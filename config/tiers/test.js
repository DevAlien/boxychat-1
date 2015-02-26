// Test environment

// Application configuration
var rootPath = require('path').normalize(__dirname + '/../..');

exports.app = {
    root: rootPath,
    name: 'Boxychat',
    port: 3000
};

// Waterline ORM configuration
var mongoAdapter = require('sails-mongo');

exports.orm = {
    adapters: {
        'mongo': mongoAdapter
    },
    connections: {
    	'test': {
            adapter: 'mongo',
            host: 'localhost',
            database: 'boxychat-test'
        },
    },
    defaults: {
        migrate: 'drop'
    }
};

// Secrets
exports.secrets = {
    token: 'testing'
};