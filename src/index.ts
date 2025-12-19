import { datasource } from "./datasource";
import express from "express";
import { router } from "./router";
import { resetDataDir, seedDatabase } from "./seed";

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

async function runServer() {
  console.log(`⏳ starting server`);

  // If MOCK_DATA env var is set, wipe and reseed the database
  if (process.env.MOCK_DATA === "true") {
    console.log("🔄 MOCK_DATA=true detected, resetting and seeding data...");
    resetDataDir();
  }

  await datasource.initialize();
  console.log(`✅ database connected`);

  // Run seeding after datasource is initialized (so entities work)
  if (process.env.MOCK_DATA === "true") {
    await seedDatabase();
  }

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
