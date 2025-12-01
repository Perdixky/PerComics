const fs = require('fs');
const path = require('path');

// Configuration
// Cloudflare Pages usually runs in the root, so __dirname is safe.
const COMICS_DIR = path.join(__dirname, 'comics');
const OUTPUT_FILE = path.join(__dirname, 'manifest.json');
const ALLOWED_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];

// Helper for natural sorting (Chapter 1, Chapter 2, Chapter 10)
const naturalSort = (a, b) => {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
};

function scanComics() {
    console.log('📚 Scanning comics directory...');

    // 1. Check if directory exists
    if (!fs.existsSync(COMICS_DIR)) {
        console.log('⚠️ Comics directory not found. Creating empty manifest.');
        // If the user hasn't uploaded comics yet, we don't want the build to fail.
        // We just create an empty manifest.
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify([]));
        return;
    }

    const comics = [];
    
    // 2. Read Comic Directories
    const comicFolders = fs.readdirSync(COMICS_DIR).filter(f => {
        try { return fs.statSync(path.join(COMICS_DIR, f)).isDirectory(); }
        catch (e) { return false; }
    });

    comicFolders.forEach(comicTitle => {
        const comicPath = path.join(COMICS_DIR, comicTitle);
        
        // 3. Find Cover Image
        let coverUrl = 'https://placehold.co/600x900/18181b/ffffff?text=No+Cover';
        try {
            const files = fs.readdirSync(comicPath);
            const coverFile = files.find(f => f.toLowerCase().startsWith('cover.'));
            if (coverFile) {
                // IMPORTANT: Cloudflare Pages serves static files relative to root
                coverUrl = `/comics/${encodeURIComponent(comicTitle)}/${encodeURIComponent(coverFile)}`;
            }
        } catch (e) {
            console.error(`Error reading comic folder: ${comicTitle}`, e);
        }

        // 4. Read Metadata (meta.json) - NEW FEATURE
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

    // 6. Write Manifest
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(comics, null, 2));
    console.log(`✅ Generated manifest.json with ${comics.length} comics.`);
}

scanComics();