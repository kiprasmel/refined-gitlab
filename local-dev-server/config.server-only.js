/**
 * importing node-specific modules is allowed here
 *
 * see also `./config.shared.js`
 */

const path = require("path");

module.exports.authCacheFile = path.resolve(__dirname, ".auth-cache.json");
