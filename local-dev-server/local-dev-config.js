/**
 * if used inside the extension, must be
 * asynchronously imported with a `__DEV__` guard,
 * like so:
 *
 * ```ts
 * if (__DEV__) {
 * 		const { url } = await import("../../local-dev-config.js");
 *
 * }
 * ```
 *
 * edit: nvm
 *
 */

module.exports.gitlabAuthCacheEnable = true;

module.exports.protocol = "http";
module.exports.hostname = "127.0.0.1";
module.exports.port = 10420;

/** --- */

module.exports.url = `${this.protocol}://${this.hostname}:${this.port}`;
module.exports.cacheAuthPath = "/auth-cache";
module.exports.cacheAuthUrl = this.url + this.cacheAuthPath;
