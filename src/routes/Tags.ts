import { Router } from "express";
import { Tag } from "../entities/tag";
import { uploader } from "../uploader";

export const router = Router();

// Fonction de validation : un seul champ parmi isOrigin, isLevel, isPrice doit être vrai
function validateSingleTrueField(data: any): { valid: boolean; error?: string } {
  const fields = [
    { name: "isOrgin", value: data.isOrgin },
    { name: "isLevel", value: data.isLevel },
    { name: "isPrice", value: data.isPrice },
  ];

  // Convertir les valeurs en booléens (gestion des strings "true"/"false")
  const trueCount = fields.filter((f) => f.value === true || f.value === "true").length;

  if (trueCount === 0) {
    return { valid: false, error: "Au moins un des champs isOrgin, isLevel ou isPrice doit être vrai" };
  }

  if (trueCount > 1) {
    return { valid: false, error: "Un seul des champs isOrgin, isLevel ou isPrice peut être vrai" };
  }

  return { valid: true };
}

router.get("/", async (req, res) => {
    const tags = await Tag.find();
    res.json({ data: tags});
});

router.get("/:id", async (req, res) => {
  const tag = await Tag.findOneBy({ id: Number(req.params.id) });
  if (!tag) {
    res.status(404).json({ error: "item not found" });
  } else {
    res.json({ data: tag });
  }
});

router.post("/", uploader.single("image"), async (req, res) => {
  try {
    // Validation : un seul champ booléen doit être vrai
    const validation = validateSingleTrueField(req.body);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const newTag = new Tag();
    Object.assign(newTag, req.body);

    const savedTag = await newTag.save();

    res.json({ data: savedTag });
  } catch (e: any) {
    console.error(`🔴 error creating item: ${e?.message || JSON.stringify(e)}`);
    res.status(500).json({ error: "unable to create item" });
  }
});

router.patch("/:id", uploader.single("image"), async (req, res) => {
  try {
    const tag = await Tag.findOneBy({ id: Number(req.params.id) });

    if (!tag) {
      return res.status(404).json({ error: "item not found" });
    }

    // Fusionner les données existantes avec les nouvelles pour la validation
    const mergedData = {
      isOrgin: req.body.isOrgin !== undefined ? req.body.isOrgin : tag.isOrgin,
      isLevel: req.body.isLevel !== undefined ? req.body.isLevel : tag.isLevel,
      isPrice: req.body.isPrice !== undefined ? req.body.isPrice : tag.isPrice,
    };

    // Validation : un seul champ booléen doit être vrai
    const validation = validateSingleTrueField(mergedData);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    Object.assign(tag, req.body);

    const savedTag = await tag.save();

    res.json({ data: savedTag });
  } catch (e: any) {
    console.error(`🔴 error updating item: ${e?.message || JSON.stringify(e)}`);
    res.status(500).json({ error: "unable to update item" });
  }
});

router.delete("/:id", async (req, res) => {
  const tag = await Tag.findOneBy({ id: Number(req.params.id) });
  if (!tag) {
    res.status(404).json({ error: "item not found" });
  } else {
    const id = tag.id;
    await tag.remove();
    res.json({ data: { ...tag, id } });
  }
});
