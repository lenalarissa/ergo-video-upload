import express from "express";
import multer from "multer";
import cors from "cors";

const app = express();
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
}));

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("video"), (req, res) => {
    res.json({
        ok: true,
        originalName: req.file.originalname,
        savedAs: req.file.filename,
        path: req.file.path,
        size: req.file.size,
    });
});

app.listen(3001, () => console.log("Backend auf http://localhost:3001"));