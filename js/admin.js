import { $, $$, toast } from "./utils.js";
import { loadDlcIndex, getEnabledDlcs, setEnabledDlcs, getLocalDlcs, setLocalDlcs } from "./content.js";

const SERIALS = [
  "HBTR-QJGF-5CBF-PQBN-4Q6T",
  "AL5X-TKPX-GF2G-YYSC-7H2F",
  "UZNE-CQUF-QG2T-7ZLZ-YPTE",
  "LRL7-2TQW-DQCW-3TEP-WP93",
  "7KSJ-RS53-ZQJ9-FDHK-L5E2",
  "27SA-HTXH-U5L7-ASMG-VNKZ",
  "LAW9-BHZV-RDRF-F9EJ-J8LS",
  "5PNV-3Z66-HRQE-XBQQ-AEDQ",
  "ECXE-RT9P-J8R8-4NGG-5Y54",
  "7DGD-3XGR-NN6J-5MT7-RE6G",
  "DAFR-L498-P3DL-2A2S-7U59",
  "KNUP-DDWD-D8LD-FMEE-R3HR",
  "CF4W-SPWR-S3JV-7WEA-7GEP",
  "SJYE-RZUL-6VAV-GJSH-GKTU",
  "PXPS-9SDF-5TCA-XJSL-65AH",
  "EKCZ-K5JC-VZCY-PRGY-4KRL",
  "M4BM-X4RT-LG2C-8QN7-YVQQ",
  "BN3X-TETY-3XBH-SMSC-G5YW",
  "5H2N-SC5A-NZ5E-XWHV-V4W3",
  "UJN4-2MV3-AVUP-5W76-6P8L"
];

function sessionOk(){
  return localStorage.getItem(window.APP_CONFIG.security.storageKeyAdminSession) === "1";
}
function setSession(ok){
  localStorage.setItem(window.APP_CONFIG.security.storageKeyAdminSession, ok ? "1" : "0");
}

async function loadBuild(){
  const r = await fetch("build.json", {cache:"no-store"});
  const j = await r.json();
  $("#buildInfo").textContent = `build ${j.build} • ${j.built_at}`;
}

function showPanel(show){
  $("#loginCard").style.display = show ? "none" : "block";
  $("#panel").style.display = show ? "block" : "none";
}

function doLogin(){
  const u = $("#u").value.trim();
  const p = $("#p").value;
  if(u === window.APP_CONFIG.security.adminUser && p === window.APP_CONFIG.security.adminPass){
    setSession(true);
    showPanel(true);
    toast("Login ok", "ok");
    initPanel();
  } else {
    toast("Usuário ou senha inválidos.", "danger");
  }
}

function logout(){
  setSession(false);
  showPanel(false);
}

function loadEmbed(){
  try{
    const obj = JSON.parse(localStorage.getItem("adb_eval_embed_v1") || "{}");
    $("#embed").value = obj.iframeHtml || "";
  }catch{ $("#embed").value = ""; }
}
function saveEmbed(){
  const v = $("#embed").value.trim();
  localStorage.setItem("adb_eval_embed_v1", JSON.stringify({iframeHtml: v}));
  toast("Embed salvo.", "ok");
}
function clearEmbed(){
  localStorage.removeItem("adb_eval_embed_v1");
  $("#embed").value = "";
  toast("Embed removido.", "ok");
}

async function renderDlcs(){
  const idx = await loadDlcIndex();
  const remote = idx.dlcs || [];
  const local = getLocalDlcs();
  const all = [
    ...remote.map(d=>({...d, source:"remoto"})),
    ...local.map(d=>({...d, source:"local"})),
  ];

  const enabled = new Set(getEnabledDlcs());
  const root = $("#dlcList");
  if(!all.length){
    root.innerHTML = `<div class="kbd">Nenhuma DLC cadastrada ainda.</div>`;
    return;
  }

  root.innerHTML = all.map(d=>{
    const on = enabled.has(d.id);
    return `
      <div class="row" style="justify-content:space-between; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.08)">
        <div style="min-width:0">
          <strong style="display:block; font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis">${d.name}</strong>
          <small style="color:rgba(255,255,255,0.62)">id: ${d.id} • v${d.version} • ${d.source}</small>
        </div>
        <button class="btn ${on ? "primary" : "ghost"}" data-toggle="${d.id}">${on ? "Ativa" : "Inativa"}</button>
      </div>
    `;
  }).join("");

  $$("[data-toggle]").forEach(b=>{
    b.addEventListener("click", ()=>{
      const id = b.dataset.toggle;
      const enabled = new Set(getEnabledDlcs());
      if(enabled.has(id)) enabled.delete(id); else enabled.add(id);
      setEnabledDlcs(Array.from(enabled));
      renderDlcs();
      toast("DLC atualizada.", "ok");
    });
  });
}

function renderSerials(){
  $("#serialsBox").textContent = SERIALS.join("\n");
}

function resetSerial(){
  localStorage.removeItem(window.APP_CONFIG.serial.storageKey);
  toast("Serial resetado neste navegador.", "ok");
}

function resetAll(){
  const keys = [
    window.APP_CONFIG.serial.storageKey,
    window.APP_CONFIG.content.storageKeyEnabledDlcs,
    window.APP_CONFIG.content.storageKeyLocalDlcs,
    "adb_eval_embed_v1",
  ];
  keys.forEach(k=> localStorage.removeItem(k));
  toast("Reset concluído.", "ok");
  renderDlcs();
  loadEmbed();
}

function exportLocalDlcs(){
  const data = getLocalDlcs();
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "dlcs-locais.json";
  a.click();
  URL.revokeObjectURL(a.href);
}

function importDlcFile(file){
  const fr = new FileReader();
  fr.onload = () => {
    try{
      const dlc = JSON.parse(fr.result);
      if(!dlc.id || !dlc.name || !dlc.version){
        toast("JSON inválido: precisa de id, name, version.", "danger"); return;
      }
      const local = getLocalDlcs();
      const idx = local.findIndex(x=>x.id===dlc.id);
      if(idx>=0) local[idx] = dlc; else local.push(dlc);
      setLocalDlcs(local);
      toast("DLC importada (local).", "ok");
      renderDlcs();
    }catch(e){
      console.error(e);
      toast("Falha ao ler JSON.", "danger");
    }
  };
  fr.readAsText(file);
}

function initPanel(){
  loadEmbed();
  renderDlcs();
  renderSerials();

  $("#saveEmbed").onclick = saveEmbed;
  $("#clearEmbed").onclick = clearEmbed;

  $("#resetSerial").onclick = resetSerial;
  $("#resetAll").onclick = resetAll;

  $("#exportLocalDlcs").onclick = exportLocalDlcs;
  $("#importDlcBtn").onclick = ()=> $("#importFile").click();
  $("#importFile").onchange = (e)=> {
    const f = e.target.files?.[0];
    if(f) importDlcFile(f);
    e.target.value = "";
  };
}

async function init(){
  $("#logo").src = window.APP_CONFIG.logoPath;
  await loadBuild();

  if(sessionOk()) {
    showPanel(true);
    initPanel();
  } else {
    showPanel(false);
    $("#loginBtn").onclick = doLogin;
    $("#p").addEventListener("keydown", (e)=>{ if(e.key==="Enter") doLogin(); });
  }

  $("#logoutBtn").onclick = logout;
}

init();
