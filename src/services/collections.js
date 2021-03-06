const fs = require('fs');
const Ajv = require('ajv');
const yaml = require('js-yaml');

require('any-promise/register/bluebird');
const request = require('request-promise-any');

const ContextError = require('../context-error');

const ajv = new Ajv();

const cache = {};

/**
 * @typedef {Object} Collection
 * @property {url} [server] - The server to point the collection to.
 * @property {string} [external_id] - External ID to reference for this collection.
 * @property {Endpoint[]} endpoints - Endpoints to register for this collection.
 */

class Collections {
    /**
     * Load a context file from the filesystem.
     * @param {file} file
     * @param {url} [server] - Server to reference
     * @returns {Promise<Collection>}
     */
    static load(file, server) {
        if (fs.existsSync(file) === false) {
            throw new ContextError("Could not find file", { file });
        }

        const content = fs.readFileSync(file).toString();

        const data = yaml.safeLoad(content);

        if (! data.server && ! server) {
            throw new ContextError("There is no server defined either in the collection or by command line config.", { file });
        }

        server = data.server || server;

        const path = server + '/fake-api.js-schema.json';

        if (cache[path]) {
            return cache[path];
        }

        const schemaRequest = {
            method: 'get',
            uri: path,
        };

        return cache[path] = request(schemaRequest).then(response => {

            const schema = Collections.createSchema(JSON.parse(response));

            if (ajv.validate(schema, data) === false) {
                throw new ContextError("Collection definition is not valid.", { data, validation_errors: ajv.errors });
            }

            data.server = server;

            return data;
        });
    }

    static createSchema(serverSchema) {
        const schema = {
            '$ref': '#/definitions/Collection',
            definitions: serverSchema.definitions
        };

        schema.definitions.Collection = {
            title: 'Collection',
            type: 'object',
            properties: {
                server: {
                    type: 'string',
                    format: 'uri'
                },
                external_id: {
                    type: 'string'
                },
                endpoints: {
                    type: 'array',
                    minItems: 1,
                    items: {
                        '$ref': '#/definitions/Endpoint'
                    }
                }
            },
            required: [ 'endpoints' ],
            additionalProperties: false,
        };

        return schema;
    }
}

module.exports = Collections;