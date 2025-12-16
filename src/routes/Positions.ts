import { Router } from "express";
import { Position } from "../entities/Position";
import { uploader } from "../uploader";

export const router = Router();

router.get("/", async (req, res) => {
  const positions = await Position.find();
  res.json({ data: positions });
});

router.get("/:id", async (req, res) => {
  const position = await Position.findOneBy({ id: Number(req.params.id) });
  if (!position) {
    res.status(404).json({ error: "item not found" });
  } else {
    res.json({ data: position });
  }
});

router.post("/", uploader.single("image"), async (req, res) => {
  try {
    const newPosition = new Position();
    Object.assign(newPosition, req.body);

    if (req.file) {
      newPosition.imagePath = req.file.path;
      newPosition.imageUri = `/images/${req.file.filename}`;
    }

    const savedPosition = await newPosition.save();

    res.json({ data: savedPosition });
  } catch (e: any) {
    console.error(`🔴 error creating item: ${e?.message || JSON.stringify(e)}`);
    res.status(500).json({ error: "unable to create item" });
  }
});

router.patch("/:id", uploader.single("image"), async (req, res) => {
  try {
    const position = await Position.findOneBy({ id: Number(req.params.id) });

    if (!position) {
      return res.status(404).json({ error: "item not found" });
    }

    Object.assign(position, req.body);

    if (req.file) {
      position.imagePath = req.file.path;
      position.imageUri = `/images/${req.file.filename}`;
    }

    const savedPosition = await position.save();

    res.json({ data: savedPosition });
  } catch (e: any) {
    console.error(`🔴 error updating item: ${e?.message || JSON.stringify(e)}`);
    res.status(500).json({ error: "unable to update item" });
  }
});

router.delete("/:id", async (req, res) => {
  const position = await Position.findOneBy({ id: Number(req.params.id) });
  if (!position) {
    res.status(404).json({ error: "item not found" });
  } else {
    const id = position.id;
    await position.remove();
    res.json({ data: { ...position, id } });
  }
});
