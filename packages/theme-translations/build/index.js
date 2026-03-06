const path = require('path');
const fs = require('fs');

const SHARED_LOCALES_DIR = path.resolve(__dirname, '../locales');
const DEFAULT_LOCAL_DIR = './locales-local';
const DEFAULT_OUTPUT_DIR = './locales';

/**
 * Returns a Gulp-compatible task function that merges shared locale files
 * with optional local overrides and writes the result to an output directory.
 *
 * @param {Object} [options]
 * @param {string} [options.shared] - Path to shared locales (defaults to this package's locales/)
 * @param {string} [options.local]  - Path to local overrides (defaults to ./locales-local/)
 * @param {string} [options.output] - Path to write merged locales (defaults to ./locales/)
 * @returns {Function} A Gulp task function
 */
function mergeLocales(options = {}) {
    const sharedDir = options.shared || SHARED_LOCALES_DIR;
    const localDir = options.local || DEFAULT_LOCAL_DIR;
    const outputDir = options.output || DEFAULT_OUTPUT_DIR;

    function mergeLocalesTask(done) {
        // Read all shared locale files
        const sharedFiles = fs.readdirSync(sharedDir)
            .filter(file => file.endsWith('.json'));

        // Read local override files if the directory exists
        const hasLocalDir = fs.existsSync(localDir);
        const localFiles = hasLocalDir
            ? fs.readdirSync(localDir).filter(file => file.endsWith('.json'))
            : [];

        // Collect all unique locale filenames
        const allLocales = [...new Set([...sharedFiles, ...localFiles])];

        // Ensure output directory exists
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, {recursive: true});
        }

        for (const file of allLocales) {
            const sharedPath = path.join(sharedDir, file);
            const localPath = path.join(localDir, file);
            const outputPath = path.join(outputDir, file);

            // Start with shared translations (if they exist for this locale)
            let merged = {};
            if (fs.existsSync(sharedPath)) {
                merged = JSON.parse(fs.readFileSync(sharedPath, 'utf8'));
            }

            // Merge local overrides — non-blank local values win
            if (hasLocalDir && fs.existsSync(localPath)) {
                const local = JSON.parse(fs.readFileSync(localPath, 'utf8'));
                for (const [key, value] of Object.entries(local)) {
                    if (value !== '') {
                        merged[key] = value;
                    }
                }
            }

            // Sort keys alphabetically for stable diffs
            const sorted = {};
            for (const key of Object.keys(merged).sort()) {
                sorted[key] = merged[key];
            }

            fs.writeFileSync(outputPath, JSON.stringify(sorted, null, 4) + '\n');
        }

        done();
    }

    mergeLocalesTask.displayName = 'locales';
    return mergeLocalesTask;
}

module.exports = {mergeLocales};
