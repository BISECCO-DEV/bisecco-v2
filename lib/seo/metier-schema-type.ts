/**
 * Mapping des métiers Bisecco vers les sous-types Schema.org appropriés.
 *
 * Pourquoi : le type primaire d'un schema LocalBusiness est le facteur #1 de
 * classement Local Pack (Whitespark Local Search Ranking Factors 2026, score 193).
 * Utiliser `Plumber` au lieu de `LocalBusiness` générique multiplie la pertinence
 * pour les requêtes locales du type "plombier près de chez moi".
 *
 * Liste schema.org : https://schema.org/LocalBusiness (hiérarchie complète).
 */

/** Map slug métier (lowercase, sans accents, kebab-case) → type Schema.org. */
const SCHEMA_TYPE_BY_SLUG: Record<string, string> = {
  // ─── Construction / Bâtiment ───
  "plombier": "Plumber",
  "plombier-chauffagiste": "Plumber",
  "electricien": "Electrician",
  "macon": "GeneralContractor",
  "couvreur": "RoofingContractor",
  "menuisier": "GeneralContractor",
  "ebeniste": "GeneralContractor",
  "charpentier": "GeneralContractor",
  "peintre": "HousePainter",
  "peintre-en-batiment": "HousePainter",
  "carreleur": "GeneralContractor",
  "platrier": "GeneralContractor",
  "platrier-plaquiste": "GeneralContractor",
  "isolation": "GeneralContractor",
  "vitrier": "GeneralContractor",
  "serrurier": "Locksmith",
  "ramoneur": "HVACBusiness",
  "chauffagiste": "HVACBusiness",
  "climaticien": "HVACBusiness",
  "frigoriste": "HVACBusiness",
  "terrassier": "GeneralContractor",
  "paysagiste": "GeneralContractor",
  "jardinier": "GeneralContractor",
  "elagueur": "GeneralContractor",
  "demolisseur": "GeneralContractor",
  "facadier": "GeneralContractor",
  "etancheite": "GeneralContractor",
  "fumiste": "GeneralContractor",

  // ─── Métiers d'art ───
  "ferronnier": "GeneralContractor",
  "tapissier": "HomeGoodsStore",
  "tapissier-decorateur": "HomeGoodsStore",
  "verrier": "GeneralContractor",
  "vitrailliste": "GeneralContractor",
  "ceramiste": "Store",
  "potier": "Store",
  "souffleur-de-verre": "Store",
  "horloger": "Store",
  "bijoutier": "JewelryStore",
  "joaillier": "JewelryStore",
  "doreur": "Store",
  "encadreur": "Store",
  "relieur": "Store",

  // ─── Alimentation ───
  "boulanger": "BakeryShop",
  "boulanger-patissier": "BakeryShop",
  "patissier": "BakeryShop",
  "chocolatier": "Store",
  "confiseur": "Store",
  "glacier": "IceCreamShop",
  "biscuitier": "BakeryShop",
  "traiteur": "Restaurant",
  "boucher": "Store",
  "charcutier": "Store",
  "charcutier-traiteur": "Store",
  "poissonnier": "Store",
  "fromager": "Store",
  "cremier": "Store",
  "primeur": "Store",
  "epicier": "ConvenienceStore",
  "caviste": "LiquorStore",
  "brasseur": "Brewery",
  "vigneron": "Winery",
  "fabricant-de-fromage": "Store",
  "fabricant-de-chocolat": "Store",
  "fabricant-de-glace": "IceCreamShop",
  "fabricant-de-biscuits": "BakeryShop",
  "fabricant-de-produits-locaux": "Store",
  "apiculteur": "Store",
  "crepier": "Restaurant",
  "fabricant-de-pates": "Store",
  "distillateur": "Store",
  "brasseur-artisanal": "Brewery",

  // ─── Mode / Couture ───
  "couturier": "ClothingStore",
  "couturiere": "ClothingStore",
  "tailleur": "ClothingStore",
  "modeliste": "ClothingStore",
  "modiste": "ClothingStore",
  "chapelier": "ClothingStore",
  "cordonnier": "ShoeStore",
  "bottier": "ShoeStore",
  "maroquinier": "Store",
  "sellier": "Store",
  "gantier": "ClothingStore",
  "fourreur": "ClothingStore",

  // ─── Beauté / Soin ───
  "coiffeur": "HairSalon",
  "coiffeuse": "HairSalon",
  "barbier": "HairSalon",
  "esthéticienne": "BeautySalon",
  "estheticien": "BeautySalon",
  "estheticienne": "BeautySalon",
  "manucure": "NailSalon",
  "prothesiste-ongulaire": "NailSalon",
  "maquilleur": "BeautySalon",
  "tatoueur": "TattooParlor",
  "perruquier": "BeautySalon",
  "spa-thalasso": "DaySpa",

  // ─── Automobile ───
  "mecanicien": "AutoRepair",
  "carrossier": "AutoBodyShop",
  "garagiste": "AutoRepair",
  "depanneur-auto": "AutoRepair",

  // ─── Informatique / Digital ───
  "developpeur-informatique": "ComputerStore",
  "developpeur-web": "ComputerStore",
  "graphiste": "ProfessionalService",
  "designer": "ProfessionalService",
  "photographe": "ProfessionalService",
  "videaste": "ProfessionalService",
  "infographiste": "ProfessionalService",
  "informaticien": "ComputerStore",

  // ─── Services aux entreprises ───
  "comptable": "AccountingService",
  "expert-comptable": "AccountingService",
  "consultant": "ProfessionalService",
  "avocat": "Attorney",
  "notaire": "Notary",
  "huissier": "ProfessionalService",
  "agent-immobilier": "RealEstateAgent",
  "architecte": "ProfessionalService",
  "geometre": "ProfessionalService",
  "architecte-d-interieur": "ProfessionalService",
  "decorateur": "ProfessionalService",
  "decorateur-d-interieur": "ProfessionalService",

  // ─── Santé / Bien-être ───
  "osteopathe": "Physiotherapy",
  "kinesitherapeute": "Physiotherapy",
  "naturopathe": "HealthAndBeautyBusiness",
  "sophrologue": "HealthAndBeautyBusiness",
  "psychologue": "MedicalBusiness",

  // ─── Transport / Livraison ───
  "demenageur": "MovingCompany",
  "chauffeur-vtc": "TaxiService",
  "livreur": "ProfessionalService",

  // ─── Services à la personne ───
  "femme-de-menage": "HomeAndConstructionBusiness",
  "garde-d-enfants": "ChildCare",
  "auxiliaire-de-vie": "HealthAndBeautyBusiness",
  "professeur-particulier": "EducationalOrganization",
  "coach-sportif": "SportsActivityLocation",
};

/**
 * Retourne le type Schema.org le plus spécifique pour un slug métier donné.
 * Fallback : `LocalBusiness` (générique mais valide).
 */
export function schemaTypeForMetier(slug: string | null | undefined): string {
  if (!slug) return "LocalBusiness";
  const key = slug.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  return SCHEMA_TYPE_BY_SLUG[key] ?? "LocalBusiness";
}
