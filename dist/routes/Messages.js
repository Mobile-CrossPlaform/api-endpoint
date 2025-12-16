"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const Message_1 = require("../entities/Message");
const uploader_1 = require("../uploader");
exports.router = (0, express_1.Router)();
exports.router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield Message_1.Message.find(typeof req.query.channel === "string"
        ? { where: { channel: req.query.channel } }
        : {});
    res.json({ data: messages });
}));
exports.router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield Message_1.Message.findOneBy({ id: Number(req.params.id) });
    if (!message) {
        res.status(404).json({ error: "item not found" });
    }
    else {
        res.json({ data: message });
    }
}));
exports.router.post("/", uploader_1.uploader.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newMessage = new Message_1.Message();
        Object.assign(newMessage, req.body);
        if (req.file) {
            newMessage.imagePath = req.file.path;
            newMessage.imageUri = `/images/${req.file.filename}`;
        }
        const savedMessage = yield newMessage.save();
        res.json({ data: savedMessage });
    }
    catch (e) {
        console.error(`🔴 error creating item: ${(e === null || e === void 0 ? void 0 : e.message) || JSON.stringify(e)}`);
        res.status(500).json({ error: "unable to create item" });
    }
}));
exports.router.patch("/:id", uploader_1.uploader.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield Message_1.Message.findOneBy({ id: Number(req.params.id) });
        if (!message) {
            return res.status(404).json({ error: "item not found" });
        }
        Object.assign(message, req.body);
        if (req.file) {
            message.imagePath = req.file.path;
            message.imageUri = `/images/${req.file.filename}`;
        }
        const savedMessage = yield message.save();
        res.json({ data: savedMessage });
    }
    catch (e) {
        console.error(`🔴 error updating item: ${(e === null || e === void 0 ? void 0 : e.message) || JSON.stringify(e)}`);
        res.status(500).json({ error: "unable to update item" });
    }
}));
exports.router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield Message_1.Message.findOneBy({ id: Number(req.params.id) });
    if (!message) {
        res.status(404).json({ error: "item not found" });
    }
    else {
        const id = message.id;
        yield message.remove();
        res.json({ data: Object.assign(Object.assign({}, message), { id }) });
    }
}));
