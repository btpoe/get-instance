const rollup = require('rollup');
const buble = require('rollup-plugin-buble');
const Jasmine = require('jasmine');
const args = require('yargs').argv;

const jasmine = new Jasmine();
jasmine.loadConfigFile('spec/support/jasmine.json');

function test() {
    jasmine.execute();
}

async function build() {
    const jsInputConfig = {
        input: './src/index.js',
        plugins: [
            buble(),
        ],
    };

    const jsOutputConfigCJS = {
        file: './dist/index.js',
        name: 'getInstance',
        format: 'cjs',
        exports: 'named',
    };

    if (args.watch) {
        rollup.watch(Object.assign(
            jsInputConfig,
            { output: jsOutputConfigCJS }
        )).on('event', async (event) => {
            if (event.code !== 'BUNDLE_END') return;
            test();
        });
    } else {
        const bundle = await rollup.rollup(jsInputConfig);
        await bundle.write(jsOutputConfigCJS);
        test();
    }
}

build().then(() => console.log('watching'));
