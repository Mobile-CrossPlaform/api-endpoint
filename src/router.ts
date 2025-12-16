import { Router } from "express";
import { router as imagesRouter } from "./routes/Images";
import { router as messagesRouter } from "./routes/Messages";
import { router as positionsRouter } from "./routes/Positions";

export const router = Router();

router.use("/api/images/", imagesRouter);
router.use("/api/messages/", messagesRouter);
router.use("/api/positions/", positionsRouter);

router.get("/images/:path", (req, res) => {
  if (
    /^[0-9]{4}-[0-9]{2}-[0-9]{2}_[0-9]{2}-[0-9]{2}-[0-9]{2}\.[a-z]{1,10}$/.test(
      req.params.path
    )
  ) {
    res.sendFile(`${process.cwd()}/data/uploads/${req.params.path}`);
  } else {
    res.status(404).json({ error: "image not found" });
  }
});

router.get("/", (req, res) => {
  res.json({
    data: `welcome on the api`,
  });
});

router.use((req, res) => {
  res.status(404).json({ error: "route not found" });
});
