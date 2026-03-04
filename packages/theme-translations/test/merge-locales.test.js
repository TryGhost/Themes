const {describe, it, beforeEach, afterEach} = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const {mergeLocales} = require('../build');

let tmpDir;
let sharedDir;
let localDir;
let outputDir;

function setup() {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'theme-translations-test-'));
    sharedDir = path.join(tmpDir, 'shared');
    localDir = path.join(tmpDir, 'local');
    outputDir = path.join(tmpDir, 'output');
    fs.mkdirSync(sharedDir);
}

function teardown() {
    fs.rmSync(tmpDir, {recursive: true});
}

function writeJSON(dir, filename, data) {
    fs.writeFileSync(path.join(dir, filename), JSON.stringify(data, null, 4));
}

function readOutput(filename) {
    return JSON.parse(fs.readFileSync(path.join(outputDir, filename), 'utf8'));
}

function runMerge(options = {}) {
    return new Promise((resolve, reject) => {
        const task = mergeLocales({
            shared: sharedDir,
            local: options.local || localDir,
            output: outputDir
        });
        task((err) => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

describe('mergeLocales', () => {
    beforeEach(() => setup());
    afterEach(() => teardown());

    it('outputs shared locales when no local overrides directory exists', async () => {
        writeJSON(sharedDir, 'en.json', {
            Subscribe: '',
            'Read more': ''
        });

        await runMerge();

        const result = readOutput('en.json');
        assert.deepStrictEqual(result, {
            'Read more': '',
            Subscribe: ''
        });
    });

    it('local non-blank values override shared values', async () => {
        writeJSON(sharedDir, 'en.json', {
            Subscribe: '',
            'Read more': ''
        });
        fs.mkdirSync(localDir);
        writeJSON(localDir, 'en.json', {
            Subscribe: 'Join us'
        });

        await runMerge();

        const result = readOutput('en.json');
        assert.strictEqual(result.Subscribe, 'Join us');
    });

    it('blank local values do not overwrite shared values', async () => {
        writeJSON(sharedDir, 'en.json', {
            Subscribe: 'Subscribe to this site'
        });
        fs.mkdirSync(localDir);
        writeJSON(localDir, 'en.json', {
            Subscribe: ''
        });

        await runMerge();

        const result = readOutput('en.json');
        assert.strictEqual(result.Subscribe, 'Subscribe to this site');
    });

    it('local-only keys are added to the output', async () => {
        writeJSON(sharedDir, 'en.json', {
            Subscribe: ''
        });
        fs.mkdirSync(localDir);
        writeJSON(localDir, 'en.json', {
            'Custom key': 'Custom value'
        });

        await runMerge();

        const result = readOutput('en.json');
        assert.strictEqual(result['Custom key'], 'Custom value');
        assert.strictEqual(result.Subscribe, '');
    });

    it('local-only locale files are written to output', async () => {
        writeJSON(sharedDir, 'en.json', {Subscribe: ''});
        fs.mkdirSync(localDir);
        writeJSON(localDir, 'de.json', {Subscribe: 'Abonnieren'});

        await runMerge();

        const result = readOutput('de.json');
        assert.deepStrictEqual(result, {Subscribe: 'Abonnieren'});
    });

    it('keys are sorted alphabetically', async () => {
        writeJSON(sharedDir, 'en.json', {
            Zebra: '',
            Apple: '',
            Mango: ''
        });

        await runMerge();

        const result = readOutput('en.json');
        const keys = Object.keys(result);
        assert.deepStrictEqual(keys, ['Apple', 'Mango', 'Zebra']);
    });

    it('creates the output directory if it does not exist', async () => {
        writeJSON(sharedDir, 'en.json', {Subscribe: ''});

        assert.strictEqual(fs.existsSync(outputDir), false);
        await runMerge();
        assert.strictEqual(fs.existsSync(outputDir), true);
    });

    it('returns a function with displayName "locales"', () => {
        const task = mergeLocales();
        assert.strictEqual(typeof task, 'function');
        assert.strictEqual(task.displayName, 'locales');
    });
});
