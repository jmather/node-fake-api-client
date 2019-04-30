class ContextError extends Error {
    /**
     * Create a new ContextError instance.
     * @param {string} message
     * @param {Object} data
     */
    constructor(message, data) {
        super(message + '\n' + JSON.stringify(data, null, 2));

        this.message = message;
        this.data = data || {};
    }
}

module.exports = ContextError;