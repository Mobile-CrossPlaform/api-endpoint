"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.datasource = void 0;
const typeorm_1 = require("typeorm");
exports.datasource = new typeorm_1.DataSource({
    type: "sqlite",
    database: "./data/db.sqlite",
    synchronize: true,
    entities: [__dirname + "/entities/*.{ts,js}"],
    logging: true,
});
