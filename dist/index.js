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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const datasource_1 = require("./datasource");
const express_1 = __importDefault(require("express"));
const router_1 = require("./router");
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
function runServer() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`⏳ starting server`);
        yield datasource_1.datasource.initialize();
        console.log(`✅ database connected`);
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use(router_1.router);
        app.listen(port, (err) => {
            if (err) {
                console.error(`🔴 unable to run express (${err.message})`);
            }
            else {
                console.log(`✅ server listening for HTTP resquest on port ${port}`);
            }
        });
    });
}
runServer();
