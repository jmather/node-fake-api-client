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

    setAutentication(username, password) {
        this.auth.user = username;
        this.auth.pass = password;
    }

    register(external_id) {
        const registerRequest = {
            method: 'post',
            uri: this.server,
            headers: {
                'X-FakeAPI-Action': 'register',
                'X-FakeAPI-ExternalId': external_id,
            }
        };

        return request(registerRequest).then(response => {
            return JSON.parse(response);
        })
    }

    record(endpoint) {
        const recordRequest = {
            method: 'post',
            uri: this.server,
            headers: {
                'X-FakeAPI-Action': 'record',
            },
            auth: this.auth,
        };

        return request(recordRequest).then(response => {
            return JSON.parse(response);
        })
    }
}

module.exports = FakeAPI;