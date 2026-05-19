import type { Metadata } from "next";
import { SearchClient } from "./SearchClient";

export const metadata: Metadata = {
  title: "Rechercher un artisan qualifié",
  description: "Recherchez un artisan qualifié près de chez vous par métier et par ville. Profils vérifiés, avis clients réels.",
};

export default function RechercherPage() {
  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="container-default py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-ink-700">
          Trouvez l&apos;artisan parfait
        </h1>
        <p className="text-ink-400 mt-2">
          Plus de profils vérifiés près de chez vous.
        </p>

        <SearchClient />
      </div>
    </div>
  );
}
