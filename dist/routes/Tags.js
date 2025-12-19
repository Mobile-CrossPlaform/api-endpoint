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
const tag_1 = require("../entities/tag");
const uploader_1 = require("../uploader");
exports.router = (0, express_1.Router)();
// Fonction de validation : un seul champ parmi isOrigin, isLevel, isPrice doit être vrai
function validateSingleTrueField(data) {
    const fields = [
        { name: "isOrgin", value: data.isOrgin },
        { name: "isLevel", value: data.isLevel },
        { name: "isPrice", value: data.isPrice },
    ];
    // Convertir les valeurs en booléens (gestion des strings "true"/"false")
    const trueCount = fields.filter((f) => f.value === true || f.value === "true").length;
    if (trueCount === 0) {
        return { valid: false, error: "Au moins un des champs isOrgin, isLevel ou isPrice doit être vrai" };
    }
    if (trueCount > 1) {
        return { valid: false, error: "Un seul des champs isOrgin, isLevel ou isPrice peut être vrai" };
    }
    return { valid: true };
}
exports.router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tags = yield tag_1.Tag.find();
    res.json({ data: tags });
}));
exports.router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tag = yield tag_1.Tag.findOneBy({ id: Number(req.params.id) });
    if (!tag) {
        res.status(404).json({ error: "item not found" });
    }
    else {
        res.json({ data: tag });
    }
}));
exports.router.post("/", uploader_1.uploader.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validation : un seul champ booléen doit être vrai
        const validation = validateSingleTrueField(req.body);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }
        const newTag = new tag_1.Tag();
        Object.assign(newTag, req.body);
        const savedTag = yield newTag.save();
        res.json({ data: savedTag });
    }
    catch (e) {
        console.error(`🔴 error creating item: ${(e === null || e === void 0 ? void 0 : e.message) || JSON.stringify(e)}`);
        res.status(500).json({ error: "unable to create item" });
    }
}));
exports.router.patch("/:id", uploader_1.uploader.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tag = yield tag_1.Tag.findOneBy({ id: Number(req.params.id) });
        if (!tag) {
            return res.status(404).json({ error: "item not found" });
        }
        // Fusionner les données existantes avec les nouvelles pour la validation
        const mergedData = {
            isOrgin: req.body.isOrgin !== undefined ? req.body.isOrgin : tag.isOrgin,
            isLevel: req.body.isLevel !== undefined ? req.body.isLevel : tag.isLevel,
            isPrice: req.body.isPrice !== undefined ? req.body.isPrice : tag.isPrice,
        };
        // Validation : un seul champ booléen doit être vrai
        const validation = validateSingleTrueField(mergedData);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }
        Object.assign(tag, req.body);
        const savedTag = yield tag.save();
        res.json({ data: savedTag });
    }
    catch (e) {
        console.error(`🔴 error updating item: ${(e === null || e === void 0 ? void 0 : e.message) || JSON.stringify(e)}`);
        res.status(500).json({ error: "unable to update item" });
    }
}));
exports.router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tag = yield tag_1.Tag.findOneBy({ id: Number(req.params.id) });
    if (!tag) {
        res.status(404).json({ error: "item not found" });
    }
    else {
        const id = tag.id;
        yield tag.remove();
        res.json({ data: Object.assign(Object.assign({}, tag), { id }) });
    }
}));
