"use strict";

const mdeps = require('module-deps');
const graphlib = require('graphlib');

const core = [ 'events', 'path', 'util', 'vm', 'dns', 'dgram', 'http', 'https', 'net', 'fs' ];

const stripPath = (row) => row.replace(/.+js\//, '');
const printCycle = (cycle) => cycle.map(stripPath).join(' <- ');
const debugCycles = (cycles) => cycles.map(printCycle).join('\n\n');

function verifyModules(index, done) {
    const externalModuleRegexp = process.platform === 'win32' ?
    /^(\.|\w:)/ :
    /^[\/.]/;

    const g = new graphlib.Graph({ directed: true });
    const md = mdeps({
        transform: [],
        filter: function(id) {
            return core.indexOf(id) === -1 && externalModuleRegexp.test(id);
        }
    });

    md.on('data', function(entry) {
        Object.keys(entry.deps).forEach(function(dep) {
            g.setEdge(entry.id, entry.deps[dep]);
        });
    });

    md.on('end', function() {
        const cycles = graphlib.alg.findCycles(g);

        if (cycles.length > 0) {
            const error = new Error(
                `Found ${cycles.length} dependency cycles\n ${debugCycles(cycles)}`
            );

            done(error);
        } else {
            done();
        }
    });

    md.end({ file: index });
}

module.exports = verifyModules;

