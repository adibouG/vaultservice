const api = require("express").Router();
const { encryptToEnzoVaultFile, decryptFromEnzoVaultFile, downloadEnzoVaultFile } = require("../Controllers/enzoVault.js");

//endpoint to encrypt and decrypt
api.post("/api/encrypt", encryptToEnzoVaultFile);
api.post("/api/decrypt", decryptFromEnzoVaultFile);
//endpoint to download the file
api.get("/api/file/:name", downloadEnzoVaultFile);
//service health check endpoint
api.get("/health", (req, res) => res.status(200).send("OK"));
//endpoint serving the rendered form (with url from env)
api.get("/", (req, res) =>
    res.render("form", {
        scheme: process.env.SCHEME,
        host: process.env.HOST,
        port: process.env.PORT,
    })
);

module.exports = api;