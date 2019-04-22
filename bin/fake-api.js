#!/usr/bin/env node

const cli = require('cli').enable('version').enable('glob');

const registerCommand = require('../src/commands/register');

cli.parse(
    {
        'verbose': [ 'v', 'Verbose output', 'bool', false ],
        'output': [ 'o', 'Output file', 'path', null ],
        'server': [ 's', 'Server url', 'url', null ],
        'collection': [ 'c', 'Collection definition', 'path', null ],
    },
    [
        'help',
        'register',
        'validate',
    ]
);

cli.main((args, options) => {
    switch (cli.command) {
        case 'register':
            registerCommand(args, options);
            break;

        case 'validate':
            cli.error('Not implemented yet.');
            cli.exit(1);
            break;

        default:
            cli.getUsage();
            cli.exit(0);
            break;
    }
});