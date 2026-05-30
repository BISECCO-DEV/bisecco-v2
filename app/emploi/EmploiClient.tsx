"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, MapPin, Briefcase, Clock, Euro, ShieldCheck, Flame, Filter } from "lucide-react";
import { JOB_OFFERS, type ContractType } from "@/lib/emploi";

const CONTRACTS: (ContractType | "Tous")[] = ["Tous", "CDI", "CDD", "Apprentissage", "Alternance", "Stage", "Intérim", "Freelance"];

export function EmploiClient() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [contract, setContract] = useState<ContractType | "Tous">("Tous");

  const filtered = useMemo(() => {
    return JOB_OFFERS.filter((j) => {
      if (contract !== "Tous" && j.contractType !== contract) return false;
      if (query) {
        const q = query.toLowerCase();
        const match = j.title.toLowerCase().includes(q) || j.metier.toLowerCase().includes(q) || j.company.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (city && !j.city.toLowerCase().includes(city.toLowerCase())) return false;
      return true;
    });
  }, [query, city, contract]);

  return (
    <>
      {/* Search bar */}
      <div className="bg-white rounded-2xl shadow-card border border-ink-100 p-2 flex flex-col md:flex-row items-stretch gap-2 mb-4">
        <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-ink-50">
          <Search size={16} className="text-ink-300" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Quel métier ou poste ? (boulanger, apprenti plombier...)"
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
        <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-ink-50 md:border-l border-ink-100">
          <MapPin size={16} className="text-ink-300" />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Dans quelle ville ?"
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
        <button className="btn-primary px-6">
          <Search size={16} /> Rechercher
        </button>
      </div>

      {/* Contract filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CONTRACTS.map((c) => (
          <button
            key={c}
            onClick={() => setContract(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
              contract === c
                ? "bg-brand-500 text-white shadow-[0_4px_12px_rgba(240,122,47,0.35)]"
                : "bg-white border border-ink-200 text-ink-600 hover:border-brand-500"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-ink-500 flex items-center gap-2">
          <Filter size={13} className="text-brand-500" />
          <strong className="text-ink-700">{filtered.length}</strong> offre{filtered.length > 1 ? "s" : ""}
        </div>
        <select className="text-xs bg-white border border-ink-200 rounded-lg px-3 py-1.5 outline-none">
          <option>Plus récentes</option>
          <option>Mieux rémunérées</option>
          <option>Près de moi</option>
        </select>
      </div>

      {/* Liste offres */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          JOB_OFFERS.length === 0 ? (
            <div className="bg-white rounded-2xl border border-ink-100 p-12 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-4">
                <span className="text-brand-500 text-2xl">📣</span>
              </div>
              <h3 className="font-bold text-ink-700 text-base">Aucune offre pour le moment</h3>
              <p className="text-sm text-ink-500 mt-2 max-w-md mx-auto leading-relaxed">
                Les premières offres d&apos;emploi vont être publiées prochainement. Revenez bientôt · ou
                inscrivez-vous pour être prévenu dès qu&apos;un poste correspond à votre profil.
              </p>
              <a
                href="/inscription"
                className="inline-flex items-center gap-1.5 mt-5 px-4 py-2 rounded-lg bg-brand-500 text-white text-sm font-bold hover:bg-brand-600 transition"
              >
                Créer un compte gratuit →
              </a>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-ink-100 p-10 text-center text-ink-400 text-sm">
              Aucune offre ne correspond à votre recherche.{" "}
              <button onClick={() => { setQuery(""); setCity(""); setContract("Tous"); }} className="text-brand-500 font-bold hover:underline">
                Réinitialiser les filtres
              </button>
            </div>
          )
        ) : (
          filtered.map((j) => (
            <Link
              key={j.id}
              href={`/emploi/${j.id}`}
              className="block bg-white rounded-2xl border border-ink-100 hover:border-brand-300 hover:-translate-y-0.5 transition p-5 group"
            >
              <div className="flex items-start gap-4 flex-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={j.companyAvatar} alt="" className="w-14 h-14 rounded-2xl border border-ink-100 flex-shrink-0" loading="lazy" />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[0.65rem] font-bold uppercase tracking-wider">
                      {j.contractType}
                    </span>
                    {j.urgent && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-[0.65rem] font-bold uppercase tracking-wider">
                        <Flame size={9} /> Urgent
                      </span>
                    )}
                    {j.verified && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[0.65rem] font-bold uppercase tracking-wider">
                        <ShieldCheck size={9} /> Vérifié
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-ink-700 text-lg leading-tight group-hover:text-brand-500 transition">{j.title}</h3>
                  <div className="text-sm text-ink-500 mt-1">
                    {j.company}{" "}
                    <span className="text-brand-500 font-semibold">· {j.metier}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-ink-500 flex-wrap">
                    <span className="inline-flex items-center gap-1"><MapPin size={11} /> {j.city} ({j.postalCode})</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1"><Briefcase size={11} /> {j.experience}</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1"><Clock size={11} /> {j.postedAt}</span>
                  </div>
                </div>

                <div className="text-right">
                  {j.salaryMin && (
                    <>
                      <div className="text-[0.65rem] font-bold tracking-wider text-ink-400 uppercase">Salaire</div>
                      <div className="text-base font-bold text-brand-500 inline-flex items-center gap-1">
                        <Euro size={13} />
                        {j.salaryMin.toLocaleString("fr-FR")}{j.salaryMax ? ` – ${j.salaryMax.toLocaleString("fr-FR")}` : ""} €
                      </div>
                      <div className="text-[0.7rem] text-ink-400">/{j.salaryPeriod}</div>
                    </>
                  )}
                  <div className="text-[0.7rem] text-ink-400 mt-2">
                    {j.applications} candidat{j.applications > 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
