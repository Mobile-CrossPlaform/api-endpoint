import { Router } from "express";
import { Image } from "../entities/Image";
import { uploader } from "../uploader";

export const router = Router();

router.get("/", async (req, res) => {
  const images = await Image.find();
  res.json({ data: images });
});

router.get("/:id", async (req, res) => {
  const image = await Image.findOneBy({ id: Number(req.params.id) });
  if (!image) {
    res.status(404).json({ error: "item not found" });
  } else {
    res.json({ data: image });
  }
});

router.post("/", uploader.single("image"), async (req, res) => {
  try {
    const newImage = new Image();
    Object.assign(newImage, req.body);

    if (req.file) {
      newImage.imagePath = req.file.path;
      newImage.imageUri = `/images/${req.file.filename}`;
    }

    const savedImage = await newImage.save();

    res.json({ data: savedImage });
  } catch (e: any) {
    console.error(`🔴 error creating item: ${e?.message || JSON.stringify(e)}`);
    res.status(500).json({ error: "unable to create item" });
  }
});

router.patch("/:id", uploader.single("image"), async (req, res) => {
  try {
    const image = await Image.findOneBy({ id: Number(req.params.id) });

    if (!image) {
      return res.status(404).json({ error: "item not found" });
    }

    Object.assign(image, req.body);

    if (req.file) {
      image.imagePath = req.file.path;
      image.imageUri = `/images/${req.file.filename}`;
    }

    const savedImage = await image.save();

    res.json({ data: savedImage });
  } catch (e: any) {
    console.error(`🔴 error updating item: ${e?.message || JSON.stringify(e)}`);
    res.status(500).json({ error: "unable to update item" });
  }
});

router.delete("/:id", async (req, res) => {
  const image = await Image.findOneBy({ id: Number(req.params.id) });
  if (!image) {
    res.status(404).json({ error: "item not found" });
  } else {
    const id = image.id;
    await image.remove();
    res.json({ data: { ...image, id } });
  }
});
