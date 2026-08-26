let videos=[],cat="Todos",brand="Todos";
const $=s=>document.querySelector(s);
async function load(){videos=await fetch("/api/videos").then(r=>r.json());render()}
function safe(s){return String(s||"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]))}
function render(){
 let a=videos.filter(v=>(cat==="Todos"||v.category===cat)&&(brand==="Todos"||v.brand==="Todos"||v.brand===brand));
 $("#cards").innerHTML=a.map(v=>`<article class="card"><div class="thumb" style="${v.thumbnail?`background-image:url('${safe(v.thumbnail)}');background-size:cover;background-position:center`:''}"><b>${v.thumbnail?'':'DS'}</b><small>${safe(v.category)}</small></div><div class="body"><h3>${safe(v.title)}</h3><p>${safe(v.description)}</p>${v.video?`<a class="watch" href="${safe(v.video)}" target="_blank">▶ ASSISTIR VÍDEO</a>`:`<a class="watch" href="${safe(v.url||'#')}" target="_blank">VER CONTEÚDO →</a>`}</div></article>`).join("")||"<p>Nenhum conteúdo encontrado.</p>";
}
document.querySelectorAll("#cats button").forEach(b=>b.onclick=()=>{document.querySelectorAll("#cats button").forEach(x=>x.classList.remove("active"));b.classList.add("active");cat=b.dataset.cat;render()});
document.querySelectorAll("#brandBtns button").forEach(b=>b.onclick=()=>{document.querySelectorAll("#brandBtns button").forEach(x=>x.classList.remove("active"));b.classList.add("active");brand=b.dataset.brand;render()});
$("#menu").onclick=()=>document.querySelector("nav").classList.toggle("show");load();