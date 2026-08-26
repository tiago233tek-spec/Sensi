const express = require("express");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 10000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "13279712";
const SESSION_SECRET = process.env.SESSION_SECRET || "change-this-secret";

app.use(express.json({limit:"10mb"}));
app.use(express.static(path.join(__dirname, "public")));

let videos = [];
let keys = [{key:"DEMO-KEY-2026", active:true}];

app.post("/api/login", (req,res)=>{
  if (req.body.password === ADMIN_PASSWORD) return res.json({ok:true});
  res.status(401).json({ok:false, message:"Senha incorreta"});
});

app.get("/api/videos", (req,res)=>res.json(videos));

app.post("/api/videos", (req,res)=>{
  const {title, description, brand, level, url, thumbnail} = req.body;
  if(!title || !brand || !level || !url) return res.status(400).json({message:"Preencha os campos obrigatórios."});
  const video = {id:Date.now().toString(), title, description:"", brand, level, url, thumbnail:thumbnail||""};
  videos.push(video);
  res.json(video);
});

app.delete("/api/videos/:id",(req,res)=>{
  videos = videos.filter(v=>v.id !== req.params.id);
  res.json({ok:true});
});

app.post("/api/key",(req,res)=>{
  const key = "SENSI-" + Math.random().toString(36).slice(2,10).toUpperCase();
  keys.push({key,active:true});
  res.json({key});
});

app.post("/api/check-key",(req,res)=>{
  const found = keys.find(k=>k.key === req.body.key && k.active);
  res.json({valid:!!found});
});

app.get("*",(req,res)=>{
  res.sendFile(path.join(__dirname,"public","index.html"));
});

app.listen(PORT, "0.0.0.0", ()=>console.log(`Demenor Sensi online na porta ${PORT}`));