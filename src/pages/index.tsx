// src/pages/index.tsx
import { useMemo, useState, useEffect } from "react";
import Head from "next/head";
import { messages } from "@/lib/i18n";
import Header from "@/components/Header";
import HeroAnimation from "@/components/HeroAnimation";
import MenuGrid from "@/components/MenuGrid";
import Cart from "@/components/Cart";
import {
  CheckCircle2,
  ChevronRight,
  MapPin,
  PhoneCall,
  Facebook,
  Instagram,
  Music2, // using as a TikTok stand-in
} from "lucide-react";

function useCart() {
  const [items, setItems] = useState<any[]>([]);

  const add = (p: any) =>
    setItems((prev) => {
      const f = prev.find((i) => i.id === p.id);
      return f
        ? prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { ...p, qty: 1 }];
    });

  const inc = (id: string) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));

  const dec = (id: string) =>
    setItems((prev) =>
      prev.flatMap((i) => (i.id === id ? (i.qty > 1 ? [{ ...i, qty: i.qty - 1 }] : []) : [i]))
    );

  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const total = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);

  return { items, add, inc, dec, remove, total };
}

export default function Home() {
  const [lang, setLang] = useState<"ka" | "en">(
    process.env.NEXT_PUBLIC_DEFAULT_LANG === "en" ? "en" : "ka"
  );
  const t = { ...messages[lang], lang } as any;

  const cart = useCart();
  const [introDone, setIntroDone] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"bog" | "tbc">("bog");
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Brand CSS variables (Taste Hunter)
  useEffect(() => {
    document.documentElement.style.setProperty("--th-red", "#FF3B2E");
    document.documentElement.style.setProperty("--th-mint", "#E6FAFB");
  }, []);

  // auto-close cart when empty
  useEffect(() => {
    if (cart.items.length === 0) setIsCartOpen(false);
  }, [cart.items]);

  const handleCheckout = async () => {
    if (cart.items.length === 0) return alert(t.emptyCart);

    const endpoint = paymentMethod === "bog" ? "/api/bog/create-payment" : "/api/tbc/create-payment";

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: cart.total, currency: "GEL", items: cart.items }),
    });

    const data = await res.json();
    if (res.ok && data?.ok && data.redirectUrl) {
      window.location.href = data.redirectUrl;
    } else {
      alert("Checkout not configured yet.");
    }
  };

  return (
    <main className="min-h-screen bg-[var(--th-mint)] text-slate-800 pb-[300px]">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header t={t} lang={lang} setLang={setLang} />

      {!introDone && <HeroAnimation onDone={() => setIntroDone(true)} />}

      {/* Redesigned Hero Box */}
      <section className="px-4 py-8">
        <div className="bg-white rounded-2xl px-8 py-8 md:py-12 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between shadow-sm">
          <div className="md:w-1/2 space-y-4">
            <h1 className="text-4xl font-extrabold text-[--th-red]">
              {t.siteName}
            </h1>
            <p className="text-lg text-gray-700">{t.tagline}</p>
            <a
              href="#menu"
              className="inline-flex items-center gap-2 bg-[--th-red] text-white px-6 py-2 rounded-full text-lg hover:opacity-90"
            >
              {t.cta} <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="md:w-1/2 grid grid-cols-2 gap-4 mt-6 md:mt-0 text-sm text-gray-800">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="text-[--th-red]" /> <span>100% fresh ingredients</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="text-[--th-red]" /> <span>Fast delivery & pickup</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="text-[--th-red]" /> <span>Secure payments</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="text-[--th-red]" /> <span>Mobile-friendly</span>
            </div>
          </div>
        </div>
      </section>

      <MenuGrid
        lang={lang}
        t={t}
        onAdd={(product) => {
          cart.add(product);
          setIsCartOpen(true);
        }}
      />

      <footer className="bg-[var(--th-mint)] border-t border-[var(--th-red)] mt-12">
        <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8 text-slate-700">
          <div>
            <h2 className="font-extrabold text-xl text-[var(--th-red)]">TASTE HUNTER BISTRO</h2>
            <p className="mt-2 text-sm text-slate-600">
              Fresh flavors & friendly vibes in Tbilisi.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Contact</h3>
            <ul className="space-y-1 text-sm mb-4">
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[var(--th-red)]" /> Tbilisi, Kekelidze street 2</li>
              <li className="flex items-center gap-2"><PhoneCall className="w-4 h-4 text-[var(--th-red)]" /> 511 18 88 71</li>
            </ul>
            <iframe
              title="Taste Hunter Location"
              className="rounded-xl border w-full h-40"
              loading="lazy"
              src="https://www.google.com/maps?q=Kekelidze%20street%202%2C%20Tbilisi&output=embed"
            />
          </div>

          <div>
            <h3 className="font-semibold mb-2">Follow us</h3>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/tastehunter.ge" target="_blank" rel="noopener noreferrer" className="text-[var(--th-red)] hover:opacity-80"><Facebook className="w-5 h-5" /></a>
              <a href="https://www.instagram.com/tastehunterbistro/" target="_blank" rel="noopener noreferrer" className="text-[var(--th-red)] hover:opacity-80"><Instagram className="w-5 h-5" /></a>
              <a href="https://www.tiktok.com/@taste.hunter33" target="_blank" rel="noopener noreferrer" className="text-[var(--th-red)] hover:opacity-80"><Music2 className="w-5 h-5" /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 text-center text-xs text-slate-500 py-4">
          © {new Date().getFullYear()} Taste Hunter Bistro · All rights reserved.
        </div>
      </footer>

      {isCartOpen && (
        <Cart
          t={t}
          items={cart.items}
          total={cart.total}
          onCheckout={handleCheckout}
          onInc={cart.inc}
          onDec={cart.dec}
          onRemove={cart.remove}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          onClose={() => setIsCartOpen(false)}
        />
      )}
    </main>
  );
}
