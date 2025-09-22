// src/components/Header.tsx
import React from "react";
import LanguageSwitcher from "./LanguageSwitcher";

type TNav = { menu: string; services: string; contact: string };
type T = { nav: TNav };

interface Props {
  t: T;                                   // i18n object
  lang: "ka" | "en";                       // restrict to supported langs
  setLang: React.Dispatch<React.SetStateAction<"ka" | "en">>; // match useState setter
}

export default function Header({ t, lang, setLang }: Props) {
  return (
    // full-width, shorter height (py-1.5)
    <header className="sticky top-0 z-40 backdrop-blur bg-[var(--th-mint)]/90 border-b border-[var(--th-red)]/30">
      <div className="w-full max-w-full mx-auto px-4 py-1.5 flex items-center justify-between">
        <a href="#" className="font-extrabold text-lg text-[var(--th-red)]">
          TASTE HUNTER
        </a>

        <nav className="hidden md:flex items-center gap-5 text-sm">
          <a href="#menu" className="hover:text-[var(--th-red)]">
            {t.nav.menu}
          </a>
          <a href="#services" className="hover:text-[var(--th-red)]">
            {t.nav.services}
          </a>
          <a href="#contact" className="hover:text-[var(--th-red)]">
            {t.nav.contact}
          </a>
        </nav>

        <LanguageSwitcher lang={lang} setLang={setLang} />
      </div>
    </header>
  );
}
