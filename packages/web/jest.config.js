const config = require("../jest.config.js");
config.setupFiles = (config.setupFiles || []).concat(["./setupJest.js"]);
module.exports = require("../jest.config.js");
