import { datasource } from "./datasource";
import express from "express";
import { router } from "./router";

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

async function runServer() {
  console.log(`⏳ starting server`);

  await datasource.initialize();
  console.log(`✅ database connected`);

  const app = express();

  app.use(express.json());
  app.use(router);

  app.listen(port, (err) => {
    if (err) {
      console.error(`🔴 unable to run express (${err.message})`);
    } else {
      console.log(`✅ server listening for HTTP resquest on port ${port}`);
    }
  });
}

runServer();
