'use client';
import React, { useState } from 'react';

const STORAGE_KEYS = { MENU: 'th_menu', SETTINGS: 'th_settings' };
const load = (k, f) => { try{const v=localStorage.getItem(k); return v?JSON.parse(v):f;}catch{return f;} };
const save = (k,v) => { try{localStorage.setItem(k, JSON.stringify(v));}catch{} };

export default function AdminPanel() {
  const [menu, setMenu] = useState(()=>load(STORAGE_KEYS.MENU, []));
  const [settings, setSettings] = useState(()=>load(STORAGE_KEYS.SETTINGS, {
    siteNameKA:'TASTE HUNTER BISTRO', siteNameEN:'Taste Hunter Bistro',
    taglineKA:'ბურგერები, პიცა და მეტი — სიყვარულით', taglineEN:'Burgers, pizzas & more — made with love',
    phone:'511 18 88 71', address:'Kekelidze street 2', hours:'Mon–Sun 11:00–23:00', adminPin:'1111'
  }));
  const [tab, setTab] = useState<'menu'|'texts'|'contact'|'backup'>('menu');

  const setCatField = (i,f,v)=>{const c=structuredClone(menu); c[i][f]=v; setMenu(c); save(STORAGE_KEYS.MENU,c);};
  const setItemField = (ci,ii,f,v)=>{const c=structuredClone(menu); c[ci].items[ii][f]=v; setMenu(c); save(STORAGE_KEYS.MENU,c);};
  const addCategory=()=>{const c=[...menu,{id:`cat-${Date.now()}`,kaTitle:'ახალი კატეგორია',enTitle:'New category',items:[]}]; setMenu(c); save(STORAGE_KEYS.MENU,c);};
  const delCategory=(i)=>{const c=menu.filter((_,x)=>x!==i); setMenu(c); save(STORAGE_KEYS.MENU,c);};
  const addItem=(i)=>{const c=structuredClone(menu); c[i].items.push({id:`item-${Date.now()}`,kaName:'დასახელება',enName:'Name',kaDesc:'აღწერა',enDesc:'Description',price:0,img:''}); setMenu(c); save(STORAGE_KEYS.MENU,c);};
  const delItem=(ci,ii)=>{const c=structuredClone(menu); c[ci].items.splice(ii,1); setMenu(c); save(STORAGE_KEYS.MENU,c);};

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex gap-2 mb-4">
        <button onClick={()=>setTab('menu')} className="px-3 py-2 border rounded-xl">Menu</button>
        <button onClick={()=>setTab('texts')} className="px-3 py-2 border rounded-xl">Texts</button>
        <button onClick={()=>setTab('contact')} className="px-3 py-2 border rounded-xl">Contact</button>
        <button onClick={()=>setTab('backup')} className="px-3 py-2 border rounded-xl">Backup</button>
      </div>

      {tab==='menu' && (
        <div>
          <div className="mb-3"><button onClick={addCategory} className="px-3 py-2 bg-black text-white rounded-xl">Add category</button></div>
          {menu.map((cat,cIdx)=>(
            <div key={cat.id} className="border rounded-2xl p-3 mb-4">
              <div className="grid md:grid-cols-2 gap-3 mb-3">
                <input className="border p-2 rounded-xl" value={cat.kaTitle} onChange={e=>setCatField(cIdx,'kaTitle',e.target.value)} placeholder="Title (KA)"/>
                <input className="border p-2 rounded-xl" value={cat.enTitle} onChange={e=>setCatField(cIdx,'enTitle',e.target.value)} placeholder="Title (EN)"/>
              </div>
              <div className="text-right mb-3"><button onClick={()=>delCategory(cIdx)} className="px-3 py-2 border rounded-xl">Delete category</button></div>
              <div className="text-right mb-3"><button onClick={()=>addItem(cIdx)} className="px-3 py-2 bg-black text-white rounded-xl">Add item</button></div>
              <div className="grid gap-3">
                {cat.items.map((it,iIdx)=>(
                  <div key={it.id} className="grid md:grid-cols-6 gap-3 border rounded-xl p-3">
                    <input className="border p-2 rounded-xl md:col-span-2" value={it.kaName} onChange={e=>setItemField(cIdx,iIdx,'kaName',e.target.value)} placeholder="Name (KA)"/>
                    <input className="border p-2 rounded-xl md:col-span-2" value={it.enName} onChange={e=>setItemField(cIdx,iIdx,'enName',e.target.value)} placeholder="Name (EN)"/>
                    <input className="border p-2 rounded-xl" type="number" step="0.01" value={it.price} onChange={e=>setItemField(cIdx,iIdx,'price',parseFloat(e.target.value||'0'))} placeholder="Price"/>
                    <input className="border p-2 rounded-xl md:col-span-6" value={it.kaDesc} onChange={e=>setItemField(cIdx,iIdx,'kaDesc',e.target.value)} placeholder="Description (KA)"/>
                    <input className="border p-2 rounded-xl md:col-span-6" value={it.enDesc} onChange={e=>setItemField(cIdx,iIdx,'enDesc',e.target.value)} placeholder="Description (EN)"/>
                    <input className="border p-2 rounded-xl md:col-span-5" value={it.img} onChange={e=>setItemField(cIdx,iIdx,'img',e.target.value)} placeholder="Image URL"/>
                    <button onClick={()=>delItem(cIdx,iIdx)} className="px-3 py-2 border rounded-xl">Delete</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==='texts' && (
        <div className="grid gap-3">
          <input className="border p-2 rounded-xl" value={settings.siteNameKA} onChange={e=>{const s={...settings,siteNameKA:e.target.value}; setSettings(s); save(STORAGE_KEYS.SETTINGS,s);}} placeholder="Site name (KA)"/>
          <input className="border p-2 rounded-xl" value={settings.siteNameEN} onChange={e=>{const s={...settings,siteNameEN:e.target.value}; setSettings(s); save(STORAGE_KEYS.SETTINGS,s);}} placeholder="Site name (EN)"/>
          <input className="border p-2 rounded-xl" value={settings.taglineKA} onChange={e=>{const s={...settings,taglineKA:e.target.value}; setSettings(s); save(STORAGE_KEYS.SETTINGS,s);}} placeholder="Tagline (KA)"/>
          <input className="border p-2 rounded-xl" value={settings.taglineEN} onChange={e=>{const s={...settings,taglineEN:e.target.value}; setSettings(s); save(STORAGE_KEYS.SETTINGS,s);}} placeholder="Tagline (EN)"/>
        </div>
      )}

      {tab==='contact' && (
        <div className="grid gap-3">
          <input className="border p-2 rounded-xl" value={settings.address} onChange={e=>{const s={...settings,address:e.target.value}; setSettings(s); save(STORAGE_KEYS.SETTINGS,s);}} placeholder="Address"/>
          <input className="border p-2 rounded-xl" value={settings.phone} onChange={e=>{const s={...settings,phone:e.target.value}; setSettings(s); save(STORAGE_KEYS.SETTINGS,s);}} placeholder="Phone"/>
          <input className="border p-2 rounded-xl" value={settings.hours} onChange={e=>{const s={...settings,hours:e.target.value}; setSettings(s); save(STORAGE_KEYS.SETTINGS,s);}} placeholder="Hours"/>
        </div>
      )}

      {tab==='backup' && (
        <div className="grid gap-3">
          <button className="px-3 py-2 bg-black text-white rounded-xl" onClick={()=>{
            const blob=new Blob([JSON.stringify({menu,settings},null,2)],{type:'application/json'});
            const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='tastehunter-backup.json'; a.click(); URL.revokeObjectURL(url);
          }}>Export JSON</button>
          <label className="px-3 py-2 border rounded-xl cursor-pointer">
            Import JSON
            <input type="file" accept="application/json" className="hidden" onChange={e=>{
              const f=e.target.files?.[0]; if(!f)return;
              const r=new FileReader();
              r.onload=ev=>{try{const d=JSON.parse(ev.target.result as string); if(d.menu) setMenu(d.menu); if(d.settings) setSettings(d.settings); save(STORAGE_KEYS.MENU,d.menu||menu); save(STORAGE_KEYS.SETTINGS,d.settings||settings);}catch{alert('Invalid JSON')}}; 
              r.readAsText(f);
            }}/>
          </label>
        </div>
      )}
    </div>
  );
}