/**
 * this config is used by both node & browser,
 * thus importing non-browser shenaningans (fs, path, process etc.)
 * is not allowed here.
 *
 * see also `./config-server-only.js`
 */

module.exports.gitlabAuthCacheEnable = true;

module.exports.protocol = "http";
module.exports.hostname = "127.0.0.1";
module.exports.port = 10420;

/** --- */

module.exports.url = `${this.protocol}://${this.hostname}:${this.port}`;
module.exports.cacheAuthPath = "/auth-cache";
module.exports.cacheAuthUrl = this.url + this.cacheAuthPath;
