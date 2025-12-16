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
const Image_1 = require("../entities/Image");
const uploader_1 = require("../uploader");
exports.router = (0, express_1.Router)();
exports.router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const images = yield Image_1.Image.find();
    res.json({ data: images });
}));
exports.router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const image = yield Image_1.Image.findOneBy({ id: Number(req.params.id) });
    if (!image) {
        res.status(404).json({ error: "item not found" });
    }
    else {
        res.json({ data: image });
    }
}));
exports.router.post("/", uploader_1.uploader.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newImage = new Image_1.Image();
        Object.assign(newImage, req.body);
        if (req.file) {
            newImage.imagePath = req.file.path;
            newImage.imageUri = `/images/${req.file.filename}`;
        }
        const savedImage = yield newImage.save();
        res.json({ data: savedImage });
    }
    catch (e) {
        console.error(`🔴 error creating item: ${(e === null || e === void 0 ? void 0 : e.message) || JSON.stringify(e)}`);
        res.status(500).json({ error: "unable to create item" });
    }
}));
exports.router.patch("/:id", uploader_1.uploader.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const image = yield Image_1.Image.findOneBy({ id: Number(req.params.id) });
        if (!image) {
            return res.status(404).json({ error: "item not found" });
        }
        Object.assign(image, req.body);
        if (req.file) {
            image.imagePath = req.file.path;
            image.imageUri = `/images/${req.file.filename}`;
        }
        const savedImage = yield image.save();
        res.json({ data: savedImage });
    }
    catch (e) {
        console.error(`🔴 error updating item: ${(e === null || e === void 0 ? void 0 : e.message) || JSON.stringify(e)}`);
        res.status(500).json({ error: "unable to update item" });
    }
}));
exports.router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const image = yield Image_1.Image.findOneBy({ id: Number(req.params.id) });
    if (!image) {
        res.status(404).json({ error: "item not found" });
    }
    else {
        const id = image.id;
        yield image.remove();
        res.json({ data: Object.assign(Object.assign({}, image), { id }) });
    }
}));
