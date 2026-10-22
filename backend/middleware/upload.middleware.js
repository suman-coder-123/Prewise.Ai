import multer from "multer";

const storage = multer.memoryStorage();

// Vercel caps request bodies at 4.5 MB, so 4 MB leaves room for overhead.
const upload = multer({
    storage,
    limits: {
        fileSize: 4 * 1024 * 1024,
    },
    fileFilter(req, file, cb) {
        if (file.mimetype !== "application/pdf") {
            const error = new Error("Only PDF files are allowed");
            error.status = 400;
            return cb(error);
        }
        cb(null, true);
    },
});

export default upload;
