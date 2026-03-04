import { $, $$, toast, sha256, fetchJson, escapeHtml } from "./utils.js";
import { loadCore, loadModule } from "./content.js";

const state = {
  manifest: null,
  tabId: null,
  build: null
};

function setBg(url){
  $(".bg").style.backgroundImage = `url('${url}')`;
}

function iconSvg(name){
  // Load from inline map (fast, no network)
  const icons = {
    flame: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2s4 4 4 8a4 4 0 11-8 0c0-2 1-4 2-6-1 3-5 4-5 9a7 7 0 0014 0c0-5-3-7-7-11z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    heart: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 8c0 6-8 12-8 12S4 14 4 8a4 4 0 017-2 4 4 0 017 2z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    route: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 19a2 2 0 100-4 2 2 0 000 4zM18 9a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" stroke-width="1.6"/><path d="M6 15c2-6 6 0 8-6s4 0 4 0" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    shield: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2l8 4v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4z" stroke="currentColor" stroke-width="1.6"/><path d="M9 12l2 2 4-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  };
  return icons[name] || icons.shield;
}

function renderTabs(){
  const tabs = state.manifest.tabs;
  const root = $(".tabs");
  root.innerHTML = "";
  tabs.forEach(t=>{
    const b = document.createElement("div");
    b.className = "tab";
    b.dataset.tab = t.id;
    b.innerHTML = `${iconSvg(t.icon)}<span>${escapeHtml(t.title)}</span>`;
    b.addEventListener("click", ()=> setTab(t.id));
    root.appendChild(b);
  });
}

async function renderTabContent(tab){
  setBg(tab.bg);
  const mod = await loadModule(tab.file);

  $("#screenTitle").textContent = mod.title;
  $("#screenIntro").textContent = mod.intro;

  const sections = $("#sections");
  sections.innerHTML = "";

  mod.sections.forEach(sec=>{
    const card = document.createElement("div");
    card.className = "card pad section";
    const items = (sec.p||[]).map(x=> `<li>${escapeHtml(x)}</li>`).join("");
    const imgs = (sec.img||[]).map(i=>`
      <div class="img-slot">
        <strong>${escapeHtml(i.code)}</strong>
        <span>${escapeHtml(i.name)}</span>
      </div>`).join("");

    let embedHtml = "";
    if(tab.id === "evaluation" && sec.embed !== undefined){
      const cfg = getEvaluationEmbed();
      if(cfg){
        embedHtml = `
          <div style="margin-top:12px; border:1px solid rgba(255,255,255,0.10); border-radius:16px; overflow:hidden;">
            ${cfg}
          </div>
        `;
      }else{
        embedHtml = `
          <div class="kbd" style="margin-top:12px">
            Embed do Google Forms ainda não configurado.
            <div style="margin-top:10px" class="row">
              <a class="btn primary" href="${window.APP_CONFIG.adminPath}">Abrir Admin</a>
            </div>
          </div>
        `;
      }
    }

    card.innerHTML = `
      <div class="row" style="justify-content:space-between; align-items:flex-start;">
        <h2 style="margin:0;">${escapeHtml(sec.h)}</h2>
        <span class="badge">Módulo</span>
      </div>
      ${items ? `<ul>${items}</ul>` : ``}
      ${imgs ? `<div class="img-grid">${imgs}</div>` : ``}
      ${embedHtml}
    `;
    sections.appendChild(card);
  });

  // references
  const refs = $("#refs");
  refs.innerHTML = state.manifest.references.map(r=>`
    <li><a href="${escapeHtml(r.url)}" target="_blank" rel="noopener">${escapeHtml(r.label)}</a></li>
  `).join("");
}

function setTab(id){
  state.tabId = id;
  localStorage.setItem("adb_last_tab_v1", id);
  $$(".tab").forEach(x=> x.classList.toggle("active", x.dataset.tab===id));
  const tab = state.manifest.tabs.find(t=>t.id===id) || state.manifest.tabs[0];
  renderTabContent(tab).catch(e=>{
    console.error(e);
    toast("Falha ao carregar conteúdo. Confira se está rodando em servidor (não file://).", "danger");
  });
}

function getEvaluationEmbed(){
  try{
    const obj = JSON.parse(localStorage.getItem("adb_eval_embed_v1") || "{}");
    return obj.iframeHtml || "";
  }catch{ return ""; }
}

async function guardSerial(){
  const ok = localStorage.getItem(window.APP_CONFIG.serial.storageKey);
  if(ok === "1") return true;
  $(".modal").classList.add("show");
  return false;
}

async function submitSerial(){
  const v = $("#serialInput").value.trim().toUpperCase();
  if(!v){ toast("Digite um serial.", "danger"); return; }
  const h = await sha256(v);
  const ok = window.APP_CONFIG.serial.allowedHashes.includes(h);
  if(!ok){
    toast("Serial inválido. Verifique e tente novamente.", "danger");
    return;
  }
  localStorage.setItem(window.APP_CONFIG.serial.storageKey, "1");
  $(".modal").classList.remove("show");
  toast("Acesso liberado. Bem-vindo!", "ok");
}

async function init(){
  // header
  $("#appName").textContent = window.APP_CONFIG.appName;
  $("#logo").src = window.APP_CONFIG.logoPath;

  // build
  state.build = await fetchJson("build.json");
  $("#buildInfo").textContent = `build ${state.build.build} • ${state.build.built_at}`;

  // manifest
  state.manifest = await loadCore();
  renderTabs();

  // last tab
  const last = localStorage.getItem("adb_last_tab_v1") || "fire";
  setTab(last);

  // serial gate
  const allowed = await guardSerial();
  if(!allowed){
    $("#serialBtn").addEventListener("click", submitSerial);
    $("#serialInput").addEventListener("keydown", (e)=>{ if(e.key==="Enter") submitSerial(); });
  }

  // admin quick
  $("#adminBtn").addEventListener("click", ()=> location.href = window.APP_CONFIG.adminPath);
}

init().catch(e=>{
  console.error(e);
  toast("Erro ao iniciar app. Abra o console para detalhes.", "danger");
});
