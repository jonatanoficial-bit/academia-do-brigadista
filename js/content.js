import { fetchJson } from "./utils.js";

export async function loadCore(){
  return await fetchJson(window.APP_CONFIG.content.coreManifest);
}

export async function loadDlcIndex(){
  try{
    return await fetchJson(window.APP_CONFIG.content.dlcIndex);
  }catch{
    return {dlcs:[]};
  }
}

export function getEnabledDlcs(){
  try{
    return JSON.parse(localStorage.getItem(window.APP_CONFIG.content.storageKeyEnabledDlcs) || "[]");
  }catch{ return []; }
}

export function setEnabledDlcs(ids){
  localStorage.setItem(window.APP_CONFIG.content.storageKeyEnabledDlcs, JSON.stringify(ids));
}

export function getLocalDlcs(){
  try{
    return JSON.parse(localStorage.getItem(window.APP_CONFIG.content.storageKeyLocalDlcs) || "[]");
  }catch{ return []; }
}

export function setLocalDlcs(dlcs){
  localStorage.setItem(window.APP_CONFIG.content.storageKeyLocalDlcs, JSON.stringify(dlcs));
}

export async function loadModule(file){
  return await fetchJson(`content/core/${file}`);
}
