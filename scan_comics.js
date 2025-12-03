import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sortChapters, generateChapterNumber } from './aiChapterSorter.js';

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DIST_DIR = path.join(__dirname, 'dist');
const PUBLIC_DIR = path.join(__dirname, 'public');
const COMICS_SRC_DIR = path.join(__dirname, 'comics');
const COMICS_DEST_DIR = path.join(DIST_DIR, 'comics');
const MANIFEST_FILENAME = 'manifest.json';
const ALLOWED_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];

// Helper for natural sorting (Chapter 1, Chapter 2, Chapter 10)
const naturalSort = (a, b) => {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
};

async function scanComics() {
    console.log('📚 Scanning comics directory...');

    // 1. Check if source directory exists
    if (!fs.existsSync(COMICS_SRC_DIR)) {
        console.log('⚠️ Comics directory not found. Creating empty manifest.');
        // Create dist if it doesn't exist (e.g. if build failed or strictly scanning)
        if (!fs.existsSync(DIST_DIR)) fs.mkdirSync(DIST_DIR, { recursive: true });
        
        fs.writeFileSync(path.join(DIST_DIR, MANIFEST_FILENAME), JSON.stringify([]));
        return;
    }

    const comics = [];

    // 2. Read Comic Directories
    const comicFolders = fs.readdirSync(COMICS_SRC_DIR).filter(f => {
        try { return fs.statSync(path.join(COMICS_SRC_DIR, f)).isDirectory(); }
        catch (e) { return false; }
    });

    for (const comicTitle of comicFolders) {
        const comicPath = path.join(COMICS_SRC_DIR, comicTitle);
        
        // 3. Find Cover Image
        let coverUrl = 'https://placehold.co/600x900/18181b/ffffff?text=No+Cover';
        try {
            const files = fs.readdirSync(comicPath);
            const coverFile = files.find(f => f.toLowerCase().startsWith('cover.'));
            if (coverFile) {
                // URL path for the frontend
                coverUrl = `/comics/${encodeURIComponent(comicTitle)}/${encodeURIComponent(coverFile)}`;
            }
        } catch (e) {
            console.error(`Error reading comic folder: ${comicTitle}`, e);
        }

        // 4. Read Metadata (meta.json)
        let meta = {};
        try {
            const metaPath = path.join(comicPath, 'meta.json');
            if (fs.existsSync(metaPath)) {
                const metaContent = fs.readFileSync(metaPath, 'utf8');
                meta = JSON.parse(metaContent);
            }
        } catch (e) {
            console.warn(`Warning: Could not read meta.json for ${comicTitle}`, e.message);
        }

        // 5. Find Chapters (AI-Powered Sorting)
        const chapters = [];
        try {
            // Get all chapter folders
            const chapterFolders = fs.readdirSync(comicPath)
                .filter(f => {
                    try { return fs.statSync(path.join(comicPath, f)).isDirectory(); }
                    catch (e) { return false; }
                });

            // Use cluster-based sorting
            console.log(`   📖 Sorting ${chapterFolders.length} chapters for "${comicTitle}"...`);
            const sortedChapters = sortChapters(chapterFolders, {
                reverseOrder: true,  // Latest chapter at top
                showProgress: false  // Don't show detailed progress for each comic
            });

            // Build chapter objects with pages
            sortedChapters.forEach((chapterInfo, index) => {
                const chapterTitle = chapterInfo.originalName;
                const chapterPath = path.join(comicPath, chapterTitle);
                try {
                    const pages = fs.readdirSync(chapterPath)
                        .filter(f => ALLOWED_EXTS.includes(path.extname(f).toLowerCase()))
                        .sort(naturalSort)
                        .map((file, pageIndex) => ({
                            id: `${comicTitle}-${chapterTitle}-${pageIndex}`,
                            pageNumber: pageIndex + 1,
                            url: `/comics/${encodeURIComponent(comicTitle)}/${encodeURIComponent(chapterTitle)}/${encodeURIComponent(file)}`
                        }));

                    if (pages.length > 0) {
                        chapters.push({
                            id: `${comicTitle}-${chapterTitle}`,
                            title: chapterTitle,
                            number: generateChapterNumber(chapterInfo, index), // Smart chapter numbering
                            pages: pages,
                            // Add metadata from pattern parsing
                            _meta: {
                                pattern: chapterInfo.pattern,
                                type: chapterInfo.type
                            }
                        });
                    }
                } catch (e) {
                    console.error(`   ❌ Error reading chapter: ${chapterTitle}`, e);
                }
            });

            if (chapters.length > 0) {
                // Merge scanned data with meta.json data
                comics.push({
                    id: comicTitle,
                    title: meta.title || comicTitle, // Use meta title or folder name
                    author: meta.author || "Unknown Author",
                    coverUrl: coverUrl,
                    description: meta.description || "No description available.",
                    status: meta.status || "Ongoing", // "Ongoing" or "Completed"
                    tags: meta.tags || ["Imported"],
                    chapters: chapters
                });
            }
        } catch (e) {
            console.error(`Error processing chapters for: ${comicTitle}`, e);
        }
    }

    // 6. PREPARE ASSETS FOR BOTH DEV AND PRODUCTION
    console.log('📦 Preparing assets...');

    const manifestContent = JSON.stringify(comics, null, 2);

    // Write manifest to PUBLIC (for dev mode)
    if (!fs.existsSync(PUBLIC_DIR)) {
        fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    }
    const publicManifestPath = path.join(PUBLIC_DIR, MANIFEST_FILENAME);
    fs.writeFileSync(publicManifestPath, manifestContent);
    console.log(`✅ Manifest generated for dev: ${publicManifestPath}`);

    // Copy comics to public/comics (for dev mode)
    if (fs.existsSync(COMICS_SRC_DIR)) {
        const publicComicsDir = path.join(PUBLIC_DIR, 'comics');
        console.log(`📂 Copying comics to public folder (for dev mode)...`);
        try {
            fs.cpSync(COMICS_SRC_DIR, publicComicsDir, { recursive: true, force: true });
            console.log('✅ Comics copied to public.');
        } catch (e) {
            console.error('❌ Failed to copy comics to public:', e);
        }
    }

    // Write manifest to DIST (for production build)
    if (fs.existsSync(DIST_DIR)) {
        const distManifestPath = path.join(DIST_DIR, MANIFEST_FILENAME);
        fs.writeFileSync(distManifestPath, manifestContent);
        console.log(`✅ Manifest generated for production: ${distManifestPath}`);

        // Copy comics to dist/comics (for production)
        if (fs.existsSync(COMICS_SRC_DIR)) {
            console.log(`📂 Copying comics to dist folder (for production)...`);
            try {
                fs.cpSync(COMICS_SRC_DIR, COMICS_DEST_DIR, { recursive: true, force: true });
                console.log('✅ Comics copied to dist.');
            } catch (e) {
                console.error('❌ Failed to copy comics to dist:', e);
            }
        }
    }
}

// Run the scanner
scanComics().catch(error => {
    console.error('❌ Failed to scan comics:', error);
    process.exit(1);
});