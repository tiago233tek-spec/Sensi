let password="";
const $=id=>document.getElementById(id);
$("enter").onclick=async()=>{
 const r=await fetch("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:$("pass").value})});
 if(!r.ok){$("msg").textContent="Senha incorreta";$("msg").className="error";return}
 password=$("pass").value;$("login").classList.add("hidden");$("dashboard").classList.remove("hidden");load();
};
$("out").onclick=()=>{password="";location.reload()};
$("form").onsubmit=async e=>{
 e.preventDefault();$("status").textContent="Publicando...";
 const fd=new FormData(e.target);
 const r=await fetch("/api/videos",{method:"POST",headers:{"x-admin-password":password},body:fd});
 if(r.ok){$("status").textContent="Vídeo publicado!";e.target.reset();load()}else $("status").textContent="Erro ao publicar.";
};
async function load(){const a=await fetch("/api/videos").then(r=>r.json());$("list").innerHTML=a.map(v=>`<div class="item"><span><b>${esc(v.title)}</b><small>${esc(v.category)} • ${esc(v.brand)}</small></span><button onclick="del(${v.id})">Excluir</button></div>`).join("")}
async function del(id){if(!confirm("Excluir vídeo?"))return;await fetch("/api/videos/"+id,{method:"DELETE",headers:{"x-admin-password":password}});load()}
function esc(s){return String(s||"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]))}