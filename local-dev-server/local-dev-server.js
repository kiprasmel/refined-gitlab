const fs = require("fs-extra");
const express = require("express");
const cors = require("cors");

const { protocol, hostname, port, cacheAuthPath } = require("./config.shared");
const { authCacheFile } = require("./config.server-only");

/** add to .gitignore if updating! */

const logVia = (level) => (msg) => {
	console[level](`[local-dev-server @ ${new Date().toISOString()}]: ${msg}`);
};

const log = logVia("log");
const loge = (e) => logVia("error")(JSON.stringify(e));

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, _res, next) => {
	log(`${req.method} ${req.url}`);
	next();
});

app.post(cacheAuthPath, async (req, res, next) => {
	// log(JSON.stringify(req.body));

	const { authPkg } = req.body;

	if (!authPkg) {
		const e = new Error("`req.body.authPkg` missing");
		loge(e);
		next(e);
		return;
	}

	try {
		await fs.writeJSON(authCacheFile, { authPkg });
		res.status(200).json({ authPkg });
		log("Received auth package");
		return;
	} catch (e) {
		loge(e);
		next(e);
	}
});

app.get(cacheAuthPath, async (_req, res, next) => {
	if (!(await fs.pathExists(authCacheFile))) {
		const e = new Error(`authCacheFile (${authCacheFile}) does not exist yet`);
		loge(e);
		next(e);
		return;
	}

	try {
		const { authPkg } = await fs.readJSON(authCacheFile);
		res.status(200).json({ authPkg });
		log("Sent auth package");
		return;
	} catch (e) {
		loge(e);
		next(e);
	}
});

app.listen(port, hostname, async () => {
	if (!(await fs.pathExists(authCacheFile))) {
		await fs.writeJSON(authCacheFile, {});
	}

	log(`listening on \`${protocol}://${hostname}:${port}\` @ NODE_ENV \`${process.env.NODE_ENV}\``);
});

module.exports = {
	authCacheFile,
};
