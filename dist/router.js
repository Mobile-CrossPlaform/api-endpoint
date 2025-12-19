"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const Images_1 = require("./routes/Images");
const Messages_1 = require("./routes/Messages");
const Positions_1 = require("./routes/Positions");
const Tags_1 = require("./routes/Tags");
exports.router = (0, express_1.Router)();
exports.router.use("/api/images/", Images_1.router);
exports.router.use("/api/messages/", Messages_1.router);
exports.router.use("/api/positions/", Positions_1.router);
exports.router.use("/api/tags/", Tags_1.router);
exports.router.get("/images/:path", (req, res) => {
    if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}_[0-9]{2}-[0-9]{2}-[0-9]{2}\.[a-z]{1,10}$/.test(req.params.path)) {
        res.sendFile(`${process.cwd()}/data/uploads/${req.params.path}`);
    }
    else {
        res.status(404).json({ error: "image not found" });
    }
});
exports.router.get("/", (req, res) => {
    res.json({
        data: `welcome on the api`,
    });
});
exports.router.use((req, res) => {
    res.status(404).json({ error: "route not found" });
});
