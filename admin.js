async function login(){
 const p=document.getElementById("pass").value;
 const r=await fetch("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:p})});
 const d=await r.json(); document.getElementById("msg").textContent=d.ok?"Acesso liberado.":"Senha incorreta.";
 if(d.ok){document.getElementById("login").classList.add("hidden");document.getElementById("dashboard").classList.remove("hidden");load()}
}
async function addVideo(){
 const body={title:title.value,description:desc.value,brand:brand.value,level:level.value,url:url.value,thumbnail:thumb.value};
 await fetch("/api/videos",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
 title.value=url.value=thumb.value=desc.value=""; load();
}
async function load(){
 const r=await fetch("/api/videos"),a=await r.json();
 list.innerHTML=a.map(v=>`<div class="card"><b>${v.title}</b> — ${v.brand} / ${v.level}<br><button class="danger" onclick="del('${v.id}')">EXCLUIR</button></div>`).join("")||"<p>Nenhum vídeo.</p>";
}
async function del(id){await fetch("/api/videos/"+id,{method:"DELETE"});load()}
async function newKey(){const r=await fetch("/api/key",{method:"POST"}),d=await r.json();document.getElementById("newkey").textContent="Nova Key: "+d.key}
