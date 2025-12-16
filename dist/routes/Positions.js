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
const Position_1 = require("../entities/Position");
const uploader_1 = require("../uploader");
exports.router = (0, express_1.Router)();
exports.router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const positions = yield Position_1.Position.find();
    res.json({ data: positions });
}));
exports.router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const position = yield Position_1.Position.findOneBy({ id: Number(req.params.id) });
    if (!position) {
        res.status(404).json({ error: "item not found" });
    }
    else {
        res.json({ data: position });
    }
}));
exports.router.post("/", uploader_1.uploader.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newPosition = new Position_1.Position();
        Object.assign(newPosition, req.body);
        if (req.file) {
            newPosition.imagePath = req.file.path;
            newPosition.imageUri = `/images/${req.file.filename}`;
        }
        const savedPosition = yield newPosition.save();
        res.json({ data: savedPosition });
    }
    catch (e) {
        console.error(`🔴 error creating item: ${(e === null || e === void 0 ? void 0 : e.message) || JSON.stringify(e)}`);
        res.status(500).json({ error: "unable to create item" });
    }
}));
exports.router.patch("/:id", uploader_1.uploader.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const position = yield Position_1.Position.findOneBy({ id: Number(req.params.id) });
        if (!position) {
            return res.status(404).json({ error: "item not found" });
        }
        Object.assign(position, req.body);
        if (req.file) {
            position.imagePath = req.file.path;
            position.imageUri = `/images/${req.file.filename}`;
        }
        const savedPosition = yield position.save();
        res.json({ data: savedPosition });
    }
    catch (e) {
        console.error(`🔴 error updating item: ${(e === null || e === void 0 ? void 0 : e.message) || JSON.stringify(e)}`);
        res.status(500).json({ error: "unable to update item" });
    }
}));
exports.router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const position = yield Position_1.Position.findOneBy({ id: Number(req.params.id) });
    if (!position) {
        res.status(404).json({ error: "item not found" });
    }
    else {
        const id = position.id;
        yield position.remove();
        res.json({ data: Object.assign(Object.assign({}, position), { id }) });
    }
}));
