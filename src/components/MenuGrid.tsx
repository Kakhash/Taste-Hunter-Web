import Image from "next/image";
import { useState } from "react";
import ImageModal from "./ImageModal";
import { menu } from "@/lib/menu";

type Lang = "ka" | "en";

export default function MenuGrid({
  lang,
  t,
  onAdd,
}: {
  lang: Lang;
  t: any;
  onAdd: (p: any) => void;
}) {
  const [modal, setModal] = useState<{ open: boolean; src: string; alt: string }>(
    { open: false, src: "", alt: "" }
  );

  return (
    <section id="menu" className="max-w-6xl mx-auto px-4 py-10">
      {menu.map((cat) => (
        <div key={cat.id} className="mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
            {lang === "ka" ? cat.kaTitle : cat.enTitle}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cat.items.map((item) => {
              const name = lang === "ka" ? item.kaName : item.enName;
              const desc = lang === "ka" ? item.kaDesc : item.enDesc;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-100 flex flex-col"
                >
                  <button
                    onClick={() =>
                      setModal({ open: true, src: item.img, alt: name })
                    }
                    className="relative group"
                  >
                    <Image
                      src={item.img}
                      alt={name}
                      width={800}
                      height={600}
                      className="w-full h-52 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 text-white text-xs bg-black/40 px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                      {t.seePhoto}
                    </div>
                  </button>

                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg">{name}</h3>
                    <p className="text-sm text-slate-600 mt-1 flex-1">{desc}</p>

                    {/* Bottom row: visible red button */}
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-semibold">
                        {(t.lang === "ka" ? "₾" : "GEL") + " " + item.price.toFixed(2)}
                      </span>

                      <button
                        onClick={() =>
                          onAdd({ id: item.id, name, price: item.price })
                        }
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-medium text-white
                                   hover:opacity-95 focus:outline-none focus:ring
                                   bg-[var(--th-red)]"
                      >
                        + {t.add}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <ImageModal
        open={modal.open}
        src={modal.src}
        alt={modal.alt}
        onClose={() => setModal((m) => ({ ...m, open: false }))}
      />
    </section>
  );
}
