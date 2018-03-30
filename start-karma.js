const KarmaServer = require('karma').Server;

module.exports = (done, confPath, singleRun, configOverride) => {
    new KarmaServer(Object.assign({
        singleRun: singleRun,
        configFile: confPath
    }, configOverride || {}), function(exitStatus) {
        if (exitStatus !== 0) {
            done("specs failed");
        } else {
            done();
        }
    }).start();
};
