let unlocked=false;
async function checkKey(){
 const key=document.getElementById("key").value.trim();
 const r=await fetch("/api/check-key",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({key})});
 const d=await r.json(); const m=document.getElementById("keymsg");
 if(d.valid){unlocked=true;document.getElementById("content").classList.remove("locked");m.textContent="Key válida!";loadVideos()}
 else m.textContent="Key inválida.";
}
async function loadVideos(){
 if(!unlocked)return;
 const r=await fetch("/api/videos"); const all=await r.json();
 const b=document.getElementById("brand").value,l=document.getElementById("level").value;
 const arr=all.filter(v=>v.brand===b&&v.level===l);
 document.getElementById("videos").innerHTML=arr.length?arr.map(v=>`<article class="card"><h3>${esc(v.title)}</h3>${v.thumbnail?`<img src="${esc(v.thumbnail)}">`:""}<p>${esc(v.description||"")}</p><a href="${esc(v.url)}" target="_blank"><button>ASSISTIR VÍDEO</button></a></article>`).join(""):"<p>Nenhum vídeo publicado ainda.</p>";
}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}