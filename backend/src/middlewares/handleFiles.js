import multer from "multer";

// Temporary storage on server
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // temp folder, make sure it exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

export default upload;
