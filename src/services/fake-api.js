require('any-promise/register/bluebird');
const request = require('request-promise-any');

const ContextError = require('../context-error');

class FakeAPI {
    constructor(server) {
        this.server = server;
        this.auth = {
            sendImmediately: true,
        };
    }

    setAuthentication(username, password) {
        this.auth.user = username;
        this.auth.pass = password;
    }

    register(external_id) {
        const registerRequest = {
            method: 'post',
            uri: this.server,
            headers: {
                'X-FakeAPI-Action': 'register',
            },
            body: {
                external_id: 'node-fake-api-client',
            },
            json: true,
        };

        return request(registerRequest).then(userData => {
            this.setAuthentication(userData.username, userData.password);
            return userData;
        });
    }

    record(endpoint) {
        const recordRequest = {
            method: 'put',
            uri: this.server,
            headers: {
                'X-FakeAPI-Action': 'record',
            },
            body: endpoint,
            json: true,
            auth: this.auth,
        };

        return request(recordRequest);
    }
}

module.exports = FakeAPI;