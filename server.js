const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "13279712";

const publicDir = path.join(__dirname, "public");
const dataDir = path.join(__dirname, "data");
const videoDir = path.join(publicDir, "videos");
fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(videoDir, { recursive: true });

const dbFile = path.join(dataDir, "videos.json");
if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, "[]");

app.use(express.json());
app.use(express.static(publicDir));

const upload = multer({
  storage: multer.diskStorage({
    destination: videoDir,
    filename: (req, file, cb) => {
      const safe = Date.now() + "-" + file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
      cb(null, safe);
    }
  }),
  limits: { fileSize: 200 * 1024 * 1024 }
});

function readVideos() {
  return JSON.parse(fs.readFileSync(dbFile, "utf8"));
}
function saveVideos(v) {
  fs.writeFileSync(dbFile, JSON.stringify(v, null, 2));
}

app.post("/api/login", (req, res) => {
  res.json({ ok: req.body.password === ADMIN_PASSWORD });
});

app.get("/api/videos", (req, res) => res.json(readVideos()));

app.post("/api/videos", upload.single("video"), (req, res) => {
  if (req.body.password !== ADMIN_PASSWORD) return res.status(401).json({ error: "Senha incorreta" });
  const { title, brand, level, description } = req.body;
  if (!req.file) return res.status(400).json({ error: "Envie um vídeo" });

  const videos = readVideos();
  const item = {
    id: Date.now().toString(),
    title: title || "Vídeo de Sensi",
    brand: brand || "Geral",
    level: level || "Média",
    description: description || "",
    url: "/videos/" + req.file.filename
  };
  videos.unshift(item);
  saveVideos(videos);
  res.json(item);
});

app.delete("/api/videos/:id", (req, res) => {
  if (req.body.password !== ADMIN_PASSWORD) return res.status(401).json({ error: "Senha incorreta" });
  const videos = readVideos();
  const item = videos.find(v => v.id === req.params.id);
  if (item) {
    const file = path.join(publicDir, item.url);
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }
  saveVideos(videos.filter(v => v.id !== req.params.id));
  res.json({ ok: true });
});

app.get("*", (req, res) => res.sendFile(path.join(publicDir, "index.html")));
app.listen(PORT, () => console.log("Demenor Sensi rodando na porta " + PORT));