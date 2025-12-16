import { DataSource } from "typeorm";

export const datasource = new DataSource({
  type: "sqlite",
  database: "./data/db.sqlite",
  synchronize: true,
  entities: [__dirname + "/entities/*.{ts,js}"],
  logging: true,
});
