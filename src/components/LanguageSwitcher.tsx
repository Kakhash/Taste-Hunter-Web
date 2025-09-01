import { Globe } from 'lucide-react';
export default function LanguageSwitcher({ lang, setLang }:{lang:'ka'|'en'; setLang:(l:'ka'|'en')=>void;}){
  return (
    <button onClick={()=>setLang(lang==='ka'?'en':'ka')} className="flex items-center gap-2 px-3 py-2 rounded-2xl shadow-sm bg-white/80 hover:bg-white text-slate-800" aria-label="Change language">
      <Globe className="w-4 h-4"/>
      <span className="font-medium">{lang==='ka'? 'KA / EN':'EN / KA'}</span>
    </button>
  );
}
