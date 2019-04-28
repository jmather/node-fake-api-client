const cli = require('cli');
const Promise = require('bluebird');

const collections = require('../services/collections');
const FakeAPI = require('../services/fake-api');

module.exports = (args, options) => {
    if (args.length < 1) {
        cli.error("No files given as arguments");
        cli.exit(1);
    }

    const file = args[0];

    return collections.load(file, options.server).then(collection => {
        const fakeApi = new FakeAPI(collection.server);

        return fakeApi.register(collection.external_id || 'node-fake-api-client').tap(userData => {
            const endpoints = [];

            collection.endpoints.forEach(endpoint => endpoints.push(fakeApi.record(endpoint)));

            return Promise.all(endpoints).then((registeredEndpoints) => {
                userData.endpoints = registeredEndpoints;
                return userData;
            });
        });
    }).then(userData => {
        console.log(JSON.stringify(userData, null, 2));
    });
};