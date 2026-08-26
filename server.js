const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Coloque a senha do ADM nas Environment Variables do Render.
// Não coloque a senha dentro do site.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const PUBLIC = path.join(__dirname, "public");
const DATA = path.join(__dirname, "data");
const VIDEOS = path.join(PUBLIC, "videos");
const DB = path.join(DATA, "videos.json");

fs.mkdirSync(PUBLIC, { recursive: true });
fs.mkdirSync(DATA, { recursive: true });
fs.mkdirSync(VIDEOS, { recursive: true });

if (!fs.existsSync(DB)) {
  fs.writeFileSync(DB, "[]", "utf8");
}

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(PUBLIC));

function readVideos() {
  try {
    return JSON.parse(fs.readFileSync(DB, "utf8"));
  } catch {
    return [];
  }
}

function saveVideos(videos) {
  fs.writeFileSync(DB, JSON.stringify(videos, null, 2), "utf8");
}

function isAdmin(req) {
  return (
    ADMIN_PASSWORD &&
    (
      req.headers["x-admin-password"] === ADMIN_PASSWORD ||
      req.body?.password === ADMIN_PASSWORD
    )
  );
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, VIDEOS);
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();

    const name =
      Date.now() +
      "-" +
      Math.random().toString(36).slice(2, 9) +
      ext;

    cb(null, name);
  }
});

const upload = multer({
  storage,

  limits: {
    fileSize: 250 * 1024 * 1024
  },

  fileFilter: function (req, file, cb) {
    if (file.mimetype && file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Envie somente um arquivo de vídeo."));
    }
  }
});

// Login ADM
app.post("/api/login", (req, res) => {
  if (!ADMIN_PASSWORD) {
    return res.status(500).json({
      ok: false,
      error: "ADMIN_PASSWORD não configurada no Render."
    });
  }

  const password = String(req.body?.password || "");

  res.json({
    ok: password === ADMIN_PASSWORD
  });
});

// Listar vídeos
app.get("/api/videos", (req, res) => {
  res.json(readVideos());
});

// Publicar vídeo
app.post("/api/videos", (req, res) => {

  upload.single("video")(req, res, function (err) {

    if (err) {
      return res.status(400).json({
        error: err.message
      });
    }

    if (!isAdmin(req)) {

      if (req.file) {
        fs.rmSync(req.file.path, { force: true });
      }

      return res.status(401).json({
        error: "Senha incorreta."
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: "Selecione um vídeo."
      });
    }

    const item = {
      id: Date.now().toString(),

      title: String(
        req.body.title || "Vídeo de Sensi"
      ).slice(0, 120),

      brand: String(
        req.body.brand || "Motorola"
      ),

      level: String(
        req.body.level || "Média"
      ),

      description: String(
        req.body.description || ""
      ).slice(0, 500),

      url: "/videos/" + req.file.filename
    };

    const videos = readVideos();

    videos.unshift(item);

    saveVideos(videos);

    res.json({
      ok: true,
      item
    });
  });
});

// Excluir vídeo
app.delete("/api/videos/:id", (req, res) => {

  if (!isAdmin(req)) {
    return res.status(401).json({
      error: "Senha incorreta."
    });
  }

  const videos = readVideos();

  const video = videos.find(
    item => item.id === req.params.id
  );

  if (!video) {
    return res.status(404).json({
      error: "Vídeo não encontrado."
    });
  }

  const filePath = path.join(
    PUBLIC,
    video.url.replace(/^\/+/, "")
  );

  fs.rmSync(filePath, {
    force: true
  });

  saveVideos(
    videos.filter(
      item => item.id !== req.params.id
    )
  );

  res.json({
    ok: true
  });
});

// Página principal
app.get("/", (req, res) => {
  res.sendFile(
    path.join(PUBLIC, "index.html")
  );
});

// Página ADM
app.get("/admin", (req, res) => {
  res.sendFile(
    path.join(PUBLIC, "admin.html")
  );
});

app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      "Demenor Sensi rodando na porta " + PORT
    );
  }
);
