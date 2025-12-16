"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploader = void 0;
const date_fns_1 = require("date-fns");
const multer_1 = __importDefault(require("multer"));
const mime_1 = __importDefault(require("mime"));
const storage = multer_1.default.diskStorage({
    destination: "./data/uploads/",
    filename: function (req, file, cb) {
        cb(null, (0, date_fns_1.format)(new Date(), "yyyy-MM-dd_HH-mm-ss") +
            "." +
            mime_1.default.getExtension(file.mimetype));
    },
});
exports.uploader = (0, multer_1.default)({ storage });
