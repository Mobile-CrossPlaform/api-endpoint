import { Router } from "express";
import { Message } from "../entities/Message";
import { uploader } from "../uploader";

export const router = Router();

router.get("/", async (req, res) => {
  const messages = await Message.find(
    typeof req.query.channel === "string"
      ? { where: { channel: req.query.channel } }
      : {}
  );
  res.json({ data: messages });
});

router.get("/:id", async (req, res) => {
  const message = await Message.findOneBy({ id: Number(req.params.id) });
  if (!message) {
    res.status(404).json({ error: "item not found" });
  } else {
    res.json({ data: message });
  }
});

router.post("/", uploader.single("image"), async (req, res) => {
  try {
    const newMessage = new Message();
    Object.assign(newMessage, req.body);

    if (req.file) {
      newMessage.imagePath = req.file.path;
      newMessage.imageUri = `/images/${req.file.filename}`;
    }

    const savedMessage = await newMessage.save();

    res.json({ data: savedMessage });
  } catch (e: any) {
    console.error(`🔴 error creating item: ${e?.message || JSON.stringify(e)}`);
    res.status(500).json({ error: "unable to create item" });
  }
});

router.patch("/:id", uploader.single("image"), async (req, res) => {
  try {
    const message = await Message.findOneBy({ id: Number(req.params.id) });

    if (!message) {
      return res.status(404).json({ error: "item not found" });
    }

    Object.assign(message, req.body);

    if (req.file) {
      message.imagePath = req.file.path;
      message.imageUri = `/images/${req.file.filename}`;
    }

    const savedMessage = await message.save();

    res.json({ data: savedMessage });
  } catch (e: any) {
    console.error(`🔴 error updating item: ${e?.message || JSON.stringify(e)}`);
    res.status(500).json({ error: "unable to update item" });
  }
});

router.delete("/:id", async (req, res) => {
  const message = await Message.findOneBy({ id: Number(req.params.id) });
  if (!message) {
    res.status(404).json({ error: "item not found" });
  } else {
    const id = message.id;
    await message.remove();
    res.json({ data: { ...message, id } });
  }
});
