const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public"));
app.use("/videos", express.static("videos"));

if (!fs.existsSync("videos")) {
  fs.mkdirSync("videos");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "videos/");
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + file.originalname;
    cb(null, unique);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 300 * 1024 * 1024
  }
});

app.post("/upload", upload.array("videos"), (req, res) => {
  res.json({ success: true });
});

app.get("/api/videos", (req, res) => {
  const files = fs.readdirSync("videos");

  const videoList = files.map(file => ({
    name: file,
    url: "/videos/" + file
  }));

  res.json(videoList);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
