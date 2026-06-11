"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Users, Search, MapPin, ArrowRight, Lock } from "lucide-react";

export type ParticulierCard = {
  id: string;
  name: string;
  city: string | null;
  avatar: string | null;
};

type Props = {
  particuliers: ParticulierCard[];
  isLoggedIn: boolean;
};

/**
 * Section "Communauté de particuliers" sur /rechercher.
 *
 * - Visiteur anonyme : aperçu flouté + invitation à se connecter (RGPD)
 * - Membre connecté : recherche par nom/ville + liste cliquable vers /membre/[id]
 */
export function ParticuliersSection({ particuliers, isLoggedIn }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return particuliers;
    return particuliers.filter((p) =>
      p.name.toLowerCase().includes(q) || (p.city ?? "").toLowerCase().includes(q),
    );
  }, [particuliers, query]);

  if (particuliers.length === 0) return null;

  return (
    <section className="mt-14">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[0.65rem] font-bold tracking-[0.12em] uppercase">
            <Users size={11} /> Communauté
          </span>
          <h2 className="mt-2 text-2xl md:text-3xl font-bold text-ink-700 tracking-tight">
            Particuliers <span className="text-blue-600">membres</span>
          </h2>
          <p className="text-ink-500 mt-1 text-sm">
            {particuliers.length} particulier{particuliers.length > 1 ? "s" : ""} inscrit{particuliers.length > 1 ? "s" : ""} sur Bisecco.
            {isLoggedIn ? " Suis-les, échange avec eux." : " Connecte-toi pour les voir et échanger."}
          </p>
        </div>

        {isLoggedIn && (
          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher par nom, ville…"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-ink-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none text-sm transition"
            />
          </div>
        )}
      </div>

      {/* CTA non connecté : aperçu flouté + invitation */}
      {!isLoggedIn ? (
        <div className="relative">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 blur-[6px] select-none pointer-events-none opacity-60">
            {particuliers.slice(0, 12).map((p) => (
              <ParticulierMini key={p.id} card={p} />
            ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-2xl border border-ink-100 shadow-[0_10px_40px_-10px_rgba(13,30,74,0.2)] p-5 sm:p-6 text-center max-w-sm mx-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mb-3">
                <Lock size={20} />
              </div>
              <h3 className="font-extrabold text-ink-700 text-base">Réservé aux membres</h3>
              <p className="mt-1 text-xs text-ink-500 leading-relaxed">
                Pour respecter la vie privée de nos membres, l&apos;annuaire des particuliers est uniquement visible par les utilisateurs connectés.
              </p>
              <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <Link
                  href="/connexion?redirect=/rechercher"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold transition"
                >
                  Se connecter <ArrowRight size={13} />
                </Link>
                <Link
                  href="/inscription"
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-ink-100 hover:bg-ink-200 text-ink-700 text-sm font-bold transition"
                >
                  S&apos;inscrire
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Liste réelle pour membres connectés */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-ink-100 p-8 text-center text-ink-500 text-sm">
              Aucun particulier ne correspond à <strong className="text-ink-700">&laquo; {query} &raquo;</strong>.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filtered.map((p) => (
                <Link
                  key={p.id}
                  href={`/membre/${p.id}`}
                  className="group bg-white rounded-2xl border border-ink-100 p-4 text-center hover:border-blue-300 hover:shadow-[0_8px_24px_-8px_rgba(13,30,74,0.15)] hover:-translate-y-0.5 transition"
                >
                  <ParticulierAvatar card={p} />
                  <div className="mt-3 font-bold text-ink-700 text-sm truncate group-hover:text-blue-700 transition">
                    {p.name}
                  </div>
                  {p.city && (
                    <div className="mt-0.5 inline-flex items-center gap-0.5 text-[0.7rem] text-ink-400">
                      <MapPin size={9} /> {p.city}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

function ParticulierAvatar({ card }: { card: ParticulierCard }) {
  const src = card.avatar ?? `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(card.name)}`;
  return (
    <div className="relative w-16 h-16 mx-auto">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="w-16 h-16 rounded-2xl object-cover bg-ink-100 ring-2 ring-white shadow-sm"
        loading="lazy"
      />
      <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-500 border-2 border-white inline-flex items-center justify-center">
        <Users size={9} className="text-white" strokeWidth={3} />
      </span>
    </div>
  );
}

function ParticulierMini({ card }: { card: ParticulierCard }) {
  return (
    <div className="bg-white rounded-2xl border border-ink-100 p-4 text-center">
      <ParticulierAvatar card={card} />
      <div className="mt-3 font-bold text-ink-700 text-sm truncate">{card.name}</div>
      {card.city && (
        <div className="mt-0.5 inline-flex items-center gap-0.5 text-[0.7rem] text-ink-400">
          <MapPin size={9} /> {card.city}
        </div>
      )}
    </div>
  );
}
