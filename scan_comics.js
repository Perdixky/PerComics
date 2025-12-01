import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DIST_DIR = path.join(__dirname, 'dist');
const COMICS_SRC_DIR = path.join(__dirname, 'comics');
const COMICS_DEST_DIR = path.join(DIST_DIR, 'comics');
const MANIFEST_FILENAME = 'manifest.json';
const ALLOWED_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];

// Helper for natural sorting (Chapter 1, Chapter 2, Chapter 10)
const naturalSort = (a, b) => {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
};

function scanComics() {
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

    comicFolders.forEach(comicTitle => {
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

        // 5. Find Chapters
        const chapters = [];
        try {
            const chapterFolders = fs.readdirSync(comicPath)
                .filter(f => {
                    try { return fs.statSync(path.join(comicPath, f)).isDirectory(); }
                    catch (e) { return false; }
                })
                .sort(naturalSort)
                .reverse(); // Standard Manga Sort: Latest chapter at top

            chapterFolders.forEach((chapterTitle, index) => {
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
                            number: chapterFolders.length - index, // Estimate chapter number based on folder count
                            pages: pages
                        });
                    }
                } catch (e) {
                    console.error(`Error reading chapter: ${chapterTitle}`, e);
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
    });

    // 6. PREPARE DEPLOYMENT ASSETS
    console.log('📦 Preparing assets for deployment...');
    
    // Ensure dist directory exists (it should after 'vite build')
    if (!fs.existsSync(DIST_DIR)) {
        fs.mkdirSync(DIST_DIR, { recursive: true });
    }

    // Write manifest to dist
    const manifestPath = path.join(DIST_DIR, MANIFEST_FILENAME);
    fs.writeFileSync(manifestPath, JSON.stringify(comics, null, 2));
    console.log(`✅ Manifest generated at: ${manifestPath}`);

    // Copy comics folder to dist/comics
    // fs.cpSync is available in Node 16.7+
    if (fs.existsSync(COMICS_SRC_DIR)) {
        console.log(`📂 Copying comics to build folder (${COMICS_DEST_DIR})...`);
        try {
            fs.cpSync(COMICS_SRC_DIR, COMICS_DEST_DIR, { recursive: true, force: true });
            console.log('✅ Comics copied successfully.');
        } catch (e) {
            console.error('❌ Failed to copy comics folder:', e);
        }
    }
}

scanComics();