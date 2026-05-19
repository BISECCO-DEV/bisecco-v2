-- ============================================================
-- Bisecco — Nettoyage : garder UNIQUEMENT les 174 métiers V2
-- ============================================================
-- IMPORTANT : à exécuter APRÈS seed_metiers.sql (qui upsert les 174 nouveaux)
-- Cette migration :
--   1. Remappe les artisans existants qui pointent vers d'anciens métiers
--   2. Supprime tous les métiers absents de la nouvelle liste V2
-- ============================================================

BEGIN;

-- ─── 1. Remappage des artisans existants (mécanicien auto → garagiste, etc.) ──
-- On fait ça AVANT le DELETE pour ne pas casser les artisan_profiles
-- (la FK est ON DELETE CASCADE = supprimerait l'artisan lui-même)

-- Mécanicien auto → Garagiste
UPDATE public.artisan_profiles
SET metier_id = (SELECT id FROM public.metiers WHERE slug = 'garagiste' LIMIT 1)
WHERE metier_id IN (
  SELECT id FROM public.metiers
  WHERE slug IN ('mecanicien-auto', 'mecanicien-automobile', 'mecanicien-aviation',
                 'mecanicien-diesel', 'mecanicien-marin', 'mecanicien-poids-lourd')
);

-- Informaticien / Informatique → Réparateur informatique
UPDATE public.artisan_profiles
SET metier_id = (SELECT id FROM public.metiers WHERE slug = 'reparateur-informatique' LIMIT 1)
WHERE metier_id IN (
  SELECT id FROM public.metiers
  WHERE slug IN ('informaticien', 'informatique')
);

-- Diagnostiqueur auto / Contrôleur technique → Contrôleur technique
UPDATE public.artisan_profiles
SET metier_id = (SELECT id FROM public.metiers WHERE slug = 'controleur-technique' LIMIT 1)
WHERE metier_id IN (
  SELECT id FROM public.metiers
  WHERE slug IN ('diagnostiqueur-auto')
);

-- Carrossier, Peintre auto, Préparateur véhicules → Préparateur véhicules
UPDATE public.artisan_profiles
SET metier_id = (SELECT id FROM public.metiers WHERE slug = 'preparateur-vehicules' LIMIT 1)
WHERE metier_id IN (
  SELECT id FROM public.metiers
  WHERE slug IN ('carrossier', 'carrossier-peintre', 'customizer-auto', 'demolisseur-auto',
                 'electronicien-automobile', 'outilleur-auto', 'peintre-automobile',
                 'reparateur-de-pneus', 'restaurateur-vehicules-anciens', 'tolier-formeur',
                 'preparateur-automobile', 'depanneur', 'electricien-automobile',
                 'vulcanisateur', 'laveur-automobile', 'laveur-auto')
);

-- Réparateur moto / cycles → Réparateur motos
UPDATE public.artisan_profiles
SET metier_id = (SELECT id FROM public.metiers WHERE slug = 'reparateur-motos' LIMIT 1)
WHERE metier_id IN (
  SELECT id FROM public.metiers
  WHERE slug IN ('reparateur-moto')
);

-- Pareil pour le pivot artisan_profile_metier (au cas où il y aurait des liens orphelins)
UPDATE public.artisan_profile_metier
SET metier_id = (SELECT id FROM public.metiers WHERE slug = 'garagiste' LIMIT 1)
WHERE metier_id IN (
  SELECT id FROM public.metiers
  WHERE slug IN ('mecanicien-auto', 'mecanicien-automobile')
);

UPDATE public.artisan_profile_metier
SET metier_id = (SELECT id FROM public.metiers WHERE slug = 'reparateur-informatique' LIMIT 1)
WHERE metier_id IN (
  SELECT id FROM public.metiers
  WHERE slug IN ('informaticien', 'informatique')
);

UPDATE public.artisan_profile_metier
SET metier_id = (SELECT id FROM public.metiers WHERE slug = 'controleur-technique' LIMIT 1)
WHERE metier_id IN (
  SELECT id FROM public.metiers
  WHERE slug IN ('diagnostiqueur-auto')
);

-- ─── 2. Supprime les doublons potentiels dans la pivot ──
DELETE FROM public.artisan_profile_metier a
USING public.artisan_profile_metier b
WHERE a.id > b.id
  AND a.artisan_profile_id = b.artisan_profile_id
  AND a.metier_id = b.metier_id;

-- ─── 3. Supprime TOUS les métiers qui ne sont pas dans la nouvelle liste V2 ──
-- (sécurisé : à ce stade tous les artisans ont été remappés)
DELETE FROM public.metiers
WHERE slug NOT IN (
  'boulanger', 'patissier', 'chocolatier', 'confiseur', 'glacier', 'biscuitier',
  'traiteur', 'boucher', 'charcutier', 'poissonnier', 'fromager', 'laitier',
  'brasseur-artisanal', 'distillateur', 'liquoriste', 'torrefacteur',
  'fabricant-de-glaces', 'pizzaiolo', 'crepier', 'nougatier',
  'apiculteur-transformateur', 'fabricant-de-produits-bio', 'fabricant-de-chocolats',
  'fabricant-de-produits-regionaux', 'fabricant-de-spiritueux', 'saunier',
  'macon', 'couvreur', 'zingueur', 'charpentier', 'menuisier', 'eclairagiste',
  'plombier', 'chauffagiste', 'climaticien', 'frigoriste', 'electricien',
  'domoticien', 'cuisiniste', 'carreleur', 'peintre-en-batiment',
  'decorateur-interieur', 'facadier', 'etancheur', 'platrier', 'staffeur',
  'serrurier', 'metallier', 'ferronnier', 'tailleur-de-pierre', 'marbrier',
  'installateur-sanitaire', 'canalisateur', 'terrassier', 'pisciniste',
  'installateur-photovoltaique', 'installateur-thermique', 'storiste', 'agenceur',
  'poseur-de-cuisines', 'poseur-de-sols', 'parqueteur', 'chapiste', 'vitrier',
  'miroitier', 'constructeur-bois', 'constructeur-metallique', 'bardeur',
  'echafaudeur', 'ascensoriste', 'fumiste', 'ramoneur', 'puisatier', 'foreur',
  'ebeniste', 'ferronnier-d-art', 'chaudronnier', 'soudeur', 'tolier', 'tourneur',
  'fraiseur', 'ajusteur', 'mecanicien-de-precision', 'bijoutier', 'joaillier',
  'orfevre', 'sertisseur', 'horloger', 'graveur', 'medailleur', 'ferrailleur',
  'maroquinier', 'sellier', 'bourrelier', 'cordonnier', 'bottier', 'coutelier',
  'potier', 'ceramiste', 'porcelainier', 'verrier', 'vitrailliste',
  'souffleur-de-verre', 'tapissier', 'encadreur', 'doreur', 'relieur', 'luthier',
  'facteur-d-instruments', 'modiste', 'chapelier', 'couturier', 'tailleur',
  'brodeur', 'dentellier', 'tisserand', 'teinturier-textile', 'serigraphe',
  'imprimeur', 'lithographe', 'typographe', 'fabricant-de-meubles',
  'fabricant-textile', 'fabricant-de-jouets', 'fabricant-de-bougies', 'savonnier',
  'parfumeur-artisanal', 'cosmeticien-artisanal',
  'coiffeur', 'barbier', 'estheticienne', 'maquilleur-professionnel',
  'prothesiste-ongulaire', 'tatoueur', 'perceur', 'fleuriste', 'toiletteur-animalier',
  'photographe', 'reparateur-informatique', 'depanneur-informatique',
  'reparateur-telephones', 'reparateur-electromenager', 'reparateur-cycles',
  'reparateur-motos', 'garagiste', 'sellier-automobile', 'preparateur-vehicules',
  'controleur-technique', 'depanneur-auto', 'ambulancier', 'taxi',
  'chauffeur-prive-vtc', 'demenageur', 'blanchisseur', 'teinturier-pressing',
  'cordonnier-multiservices', 'graveur-de-cles', 'serrurier-depannage',
  'accordeur-de-piano', 'marechal-ferrant', 'deratiseur', 'desinsectiseur',
  'elagueur', 'paysagiste-artisanal', 'jardinier-artisanal', 'reparateur-horlogerie',
  'reparateur-bijoux', 'restaurateur-de-velos', 'reparateur-electronique',
  'installateur-antennes', 'reparateur-chauffage', 'reparateur-piscines',
  'desinfecteur-professionnel', 'restaurateur-de-photos-anciennes'
);

COMMIT;

-- ─── Vérification finale ──
SELECT category, COUNT(*) AS total
FROM public.metiers
GROUP BY category
ORDER BY category;

SELECT 'Total artisans actifs' AS info, COUNT(*) AS total
FROM public.artisan_profiles WHERE is_active = TRUE;
