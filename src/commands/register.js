const cli = require('cli');

const collections = require('../services/collections');
const FakeAPI = require('../services/fake-api');

module.exports = (args, options) => {
    if (args.length < 1) {
        cli.error("No files given as arguments");
        cli.exit(1);
    }

    const file = args[0];

    collections.load(file, options.server).then(collection => {
        const fakeApi = new FakeAPI(collection.server);

        return fakeApi.register('test');
    });
};