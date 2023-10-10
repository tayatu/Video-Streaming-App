import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let destinationFolder;

    if (file.mimetype.startsWith("video/")) {
      destinationFolder = "../server/public/videos";
    } else if (file.mimetype.startsWith("image/")) {
      destinationFolder = "../server/public/images";
    }

    cb(null, destinationFolder);
  },
  filename: (req, file, cb) => {
    const originalnameWithoutSpaces = file.originalname.replace(/\s+/g, "_");
    cb(null, Date.now() + "-" + originalnameWithoutSpaces);
  },
});

export const upload = multer({ storage: storage });