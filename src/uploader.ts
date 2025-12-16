import { format } from "date-fns";
import multer from "multer";
import mime from "mime";

const storage = multer.diskStorage({
  destination: "./data/uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      format(new Date(), "yyyy-MM-dd_HH-mm-ss") +
        "." +
        mime.getExtension(file.mimetype)
    );
  },
});

export const uploader = multer({ storage });
