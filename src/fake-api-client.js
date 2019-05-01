require('any-promise/register/bluebird');
const request = require('request-promise-any');

const ContextError = require('./context-error');

/**
 * A registration response
 * @typedef {Object} RegistrationResponse
 * @property {string} username
 * @property {string} password
 * @property {string} auth_token
 */

/**
 * A Response definition
 * @typedef {Object} EndpointResponse
 * @property {number} status - An integer value between 100 and 600.
 * @property {string} content - The content to respond with.
 * @property {string} content_type - The content type to respond with.
 * @property {Object} headers - Headers to add to the response.
 * @property {number} delay - How long to delay before sending the response, in ms, defaults to 0, max is 60000.
 */

/**
 * Response Modes
 * @typedef {Object} ResponseMode
 * @property {string} Incremental "incremental"
 * @property {string} Random "random"
 */

/**
 * An Endpoint Definition
 * @typedef {Object} Endpoint
 * @property {get|put|post|patch|delete|head|options} method - HTTP method to respond to.
 * @property {string} path - Request path to respond to, begins with /.
 * @property {Object} headers - Headers to require in order to match the response.
 * @property {Object} query_parameters - Query parameters to require in order to match the response.
 * @property {ResponseMode} response_mode - Response mode to use.
 * @property {EndpointResponse[]} responses - Responses to define.
 */

class FakeApiClient {
    /**
     * Create a new FakeApiClient instance.
     * @param {url} server - Server URL of the Fake API Server to target.
     */
    constructor(server) {
        this.server = server;
        this.auth = {
            sendImmediately: true,
            user: null,
            pass: null,
        };
    }

    /**
     * Set the authentication to use on subsequent requests.
     * @param {string} username
     * @param {string} password
     */
    setAuthentication(username, password) {
        this.auth.user = username;
        this.auth.pass = password;
    }

    /**
     * Register a user with the Fake API.
     * @param {string} external_id External reference id for the user.
     * @returns {Promise<RegistrationResponse>}
     */
    register(external_id) {
        const registerRequest = {
            method: 'post',
            uri: this.server,
            headers: {
                'X-FakeAPI-Action': 'register',
            },
            body: {
                external_id: external_id || 'node-fake-api-client',
            },
            json: true,
            resolveWithFullResponse: true,
        };

        return request(registerRequest).then(response => {
            if (response.statusCode !== 201) {
                const context = buildErrorContext(registerRequest, response);

                throw new ContextError('Received unexpected response from server', context);
            }

            const userData = response.body;
            this.setAuthentication(userData.username, userData.password);
            return userData;
        });
    }

    /**
     * Registers an endpoint.
     * @param {Endpoint} endpoint
     * @returns {Promise<Endpoint>}
     */
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
            resolveWithFullResponse: true,
        };

        return request(recordRequest).then(response => {
            if (response.statusCode !== 201) {
                const context = buildErrorContext(recordRequest, response);

                throw new ContextError('Received unexpected response from server', context);
            }

            return response.body;
        });
    }
}

function buildErrorContext(request, response) {
    return {
        request,
        response: {
            status: response.statusCode,
            body: response.body,
            headers: response.headers,
        },
    };
}

module.exports = FakeApiClient;