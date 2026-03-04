export const $ = (sel, root=document) => root.querySelector(sel);
export const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

export function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }

export function toast(msg, type="info"){
  const el = document.createElement("div");
  el.className = "pill";
  el.style.position = "fixed";
  el.style.left = "14px";
  el.style.right = "14px";
  el.style.bottom = "84px";
  el.style.zIndex = "80";
  el.style.justifyContent = "space-between";
  el.style.borderColor = type==="danger" ? "rgba(239,68,68,.35)" : type==="ok" ? "rgba(34,197,94,.28)" : "rgba(255,255,255,.12)";
  el.innerHTML = `<small>${msg}</small><span style="opacity:.75;font-size:12px">OK</span>`;
  document.body.appendChild(el);
  const t = setTimeout(()=>{ el.remove(); clearTimeout(t); }, 2200);
  el.addEventListener("click", ()=> el.remove());
}

export async function sha256(text){
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  const arr = Array.from(new Uint8Array(buf));
  return arr.map(b=>b.toString(16).padStart(2,"0")).join("");
}

export async function fetchJson(url){
  const r = await fetch(url, {cache:"no-store"});
  if(!r.ok) throw new Error(`Falha ao carregar: ${url}`);
  return await r.json();
}

export function escapeHtml(s){
  return String(s)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}
