-- =====================================================================
-- 030 — Articles 8 à 14 (suite du 029)
-- À lancer dans Supabase Dashboard → SQL Editor.
-- =====================================================================

-- ─── Article 8 · Semaine 4 (Jeu 16 juillet) ───────────────────────────
INSERT INTO public.blog_articles (slug, title, excerpt, content_html, image_url, image_alt, author, read_time, status, published_at, meta_title, meta_description)
VALUES (
  'isolation-combles-prix-aides-2026',
  'Isolation des combles 2026 : prix, aides et gain énergétique',
  'Tout savoir sur l''isolation des combles en 2026 : prix au m², matériaux, aides MaPrimeRénov''. Gagnez jusqu''à 30 % de chauffage.',
  $$
<p>30 % des déperditions thermiques d'une maison passent par le toit. <strong>Isoler ses combles est l'investissement n°1</strong> pour réduire sa facture énergétique. Guide complet 2026.</p>

<h2>Pourquoi isoler ses combles en priorité ?</h2>
<ul>
  <li>30 % de chaleur perdue par le toit non isolé</li>
  <li>Gain énergétique : <strong>20-30 % sur la facture</strong></li>
  <li>Confort : moins de variations de température</li>
  <li>Plus-value immobilière : +5-10 %</li>
  <li>Aides massives en 2026 (jusqu'à 90 % financés)</li>
</ul>

<h2>Types d'isolation et prix au m²</h2>

<h3>Combles perdus (les plus faciles à isoler)</h3>
<ul>
  <li><strong>Laine de verre soufflée</strong> : 18-30 €/m²</li>
  <li><strong>Laine de roche soufflée</strong> : 22-35 €/m²</li>
  <li><strong>Ouate de cellulose</strong> : 25-40 €/m² (plus écolo)</li>
  <li><strong>Laine de bois</strong> : 35-55 €/m² (haut de gamme)</li>
</ul>

<h3>Combles aménageables (sous rampants)</h3>
<ul>
  <li><strong>Laine minérale en panneaux</strong> : 35-60 €/m²</li>
  <li><strong>Isolation extérieure (sarking)</strong> : 80-150 €/m²</li>
</ul>

<h2>Budget complet pour 100 m² de combles</h2>
<ul>
  <li><strong>Combles perdus (entrée gamme)</strong> : 2 000-4 000 €</li>
  <li><strong>Combles perdus (qualité)</strong> : 3 500-6 000 €</li>
  <li><strong>Combles aménageables</strong> : 5 000-12 000 €</li>
  <li><strong>Sarking (extérieur)</strong> : 12 000-20 000 €</li>
</ul>

<h2>Aides MaPrimeRénov' 2026</h2>
<p>Selon vos revenus, les aides peuvent couvrir <strong>jusqu'à 90 %</strong> du coût pour les combles perdus :</p>
<ul>
  <li><strong>Très modestes</strong> (couple avec 2 enfants &lt; 38 850 €/an) : 25 €/m²</li>
  <li><strong>Modestes</strong> : 20 €/m²</li>
  <li><strong>Intermédiaires</strong> : 10 €/m²</li>
  <li><strong>Supérieurs</strong> : 7 €/m²</li>
</ul>
<p>Cumul possible avec <strong>CEE</strong> (300-2 000 € en plus) et <strong>TVA réduite 5,5 %</strong>.</p>

<blockquote>
  <p><strong>Important</strong> : aides accessibles uniquement avec artisan RGE. Vérifiez sur france-renov.gouv.fr.</p>
</blockquote>

<h2>Quel isolant choisir ?</h2>

<h3>Laine de verre</h3>
<ul>
  <li>+ Économique, performant thermiquement</li>
  <li>+ Bonne résistance au feu</li>
  <li>- Moins écologique</li>
</ul>

<h3>Ouate de cellulose</h3>
<ul>
  <li>+ Écologique (papier recyclé)</li>
  <li>+ Excellente performance phonique</li>
  <li>- Plus chère</li>
</ul>

<h3>Laine de bois</h3>
<ul>
  <li>+ 100 % naturel</li>
  <li>+ Bonne inertie thermique (été ET hiver)</li>
  <li>- La plus chère</li>
</ul>

<h2>Retour sur investissement (ROI)</h2>
<p>Pour une maison de 100 m² chauffée à 1 800 €/an :</p>
<ul>
  <li>Économie annuelle : 350-540 €</li>
  <li>Coût net (après aides) : 800-2 500 €</li>
  <li><strong>Amortissement : 2 à 5 ans</strong></li>
  <li>Durée de vie de l'isolant : 30-50 ans</li>
</ul>

<h2>FAQ isolation combles 2026</h2>

<h3>Combien de temps prennent les travaux ?</h3>
<p>Combles perdus 100 m² : <strong>1 journée</strong> (laine soufflée). Combles aménageables : 2-5 jours.</p>

<h3>Faut-il vider les combles avant ?</h3>
<p>Oui pour les combles perdus (laine soufflée). Non si vous isolez sous rampants.</p>

<h3>Quelle épaisseur d'isolant ?</h3>
<p>Pour bénéficier des aides : <strong>R ≥ 7 m².K/W</strong>, soit environ 30 cm de laine. C'est la norme RT 2020.</p>

<h2>Trouvez votre artisan RGE</h2>
<p>Sur Bisecco, recherchez des <a href="/metiers/menuisier">menuisiers</a> ou <a href="/metiers/couvreur">couvreurs</a> certifiés RGE. Par exemple un <a href="/metiers/menuisier/cannes">menuisier à Cannes</a> ou un <a href="/metiers/couvreur/meaux">couvreur à Meaux</a>.</p>

<p><em>Article publié le 16 juillet 2026 par l'équipe Bisecco.</em></p>
  $$,
  'https://images.unsplash.com/photo-1632210067990-fb1f57aa9ac7?w=1280&h=720&fit=crop',
  'Travaux d''isolation des combles avec laine de verre',
  'L''équipe Bisecco',
  '7 min',
  'published',
  '2026-07-16 10:00:00+00',
  'Isolation combles 2026 : prix, aides MaPrimeRénov''',
  'Prix isolation combles 2026 : 18-40 €/m² selon matériau. Aides MaPrimeRénov'' jusqu''à 90 %. Guide complet.'
)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, excerpt = EXCLUDED.excerpt, content_html = EXCLUDED.content_html, published_at = EXCLUDED.published_at, updated_at = NOW();


-- ─── Article 9 · Semaine 5 (Lun 20 juillet) ───────────────────────────
INSERT INTO public.blog_articles (slug, title, excerpt, content_html, image_url, image_alt, author, read_time, status, published_at, meta_title, meta_description)
VALUES (
  'pompe-chaleur-2026-prix-aides-roi',
  'Pompe à chaleur 2026 : prix, aides et retour sur investissement',
  'Tout savoir sur la pompe à chaleur en 2026 : prix d''installation, types (air-eau, air-air), aides, ROI réel.',
  $$
<p>La pompe à chaleur (PAC) est <strong>LE</strong> mode de chauffage du futur. Avec les aides 2026, l'investissement est rentabilisé en 5-10 ans. Tour d'horizon complet.</p>

<h2>Pompe à chaleur : c'est quoi exactement ?</h2>
<p>Une PAC <strong>capte les calories</strong> de l'air, du sol ou de l'eau pour chauffer votre maison. Elle produit <strong>3 à 5 kWh de chaleur pour 1 kWh d'électricité</strong> consommé (COP 3 à 5). C'est jusqu'à 5× plus efficace qu'un chauffage électrique classique.</p>

<h2>Les 3 types de PAC en 2026</h2>

<h3>PAC air-air (climatisation réversible)</h3>
<ul>
  <li><strong>Prix</strong> : 5 000-12 000 € selon nombre de splits</li>
  <li>Chauffe ET climatise</li>
  <li>Idéale pour rénovation rapide</li>
  <li>Limite : <strong>aucune aide MaPrimeRénov'</strong> en 2026 (sortie du dispositif)</li>
</ul>

<h3>PAC air-eau (la plus populaire)</h3>
<ul>
  <li><strong>Prix</strong> : 10 000-18 000 €</li>
  <li>Remplace une chaudière classique</li>
  <li>Compatible radiateurs et plancher chauffant</li>
  <li>Aide MaPrimeRénov' : <strong>jusqu'à 5 000 €</strong> (revenus modestes)</li>
</ul>

<h3>PAC géothermique (sol-eau)</h3>
<ul>
  <li><strong>Prix</strong> : 15 000-30 000 € (forage compris)</li>
  <li>Le plus performant (COP 4-5 toute l'année)</li>
  <li>Aide MaPrimeRénov' : <strong>jusqu'à 11 000 €</strong></li>
  <li>Nécessite terrain disponible</li>
</ul>

<h2>Aides 2026 (cumul possible)</h2>
<ul>
  <li><strong>MaPrimeRénov'</strong> : 2 500-11 000 € selon revenus et type</li>
  <li><strong>CEE</strong> (Coup de Pouce Chauffage) : 2 500-5 000 €</li>
  <li><strong>TVA 5,5 %</strong> (au lieu de 20 %)</li>
  <li><strong>Éco-PTZ</strong> : prêt à 0 % jusqu'à 50 000 €</li>
  <li><strong>Aides locales</strong> : selon région/département</li>
</ul>

<h2>Retour sur investissement détaillé</h2>
<p>Pour une maison 100 m² chauffée au gaz avec ancien système (1 800 €/an de chauffage) :</p>
<ul>
  <li>Coût PAC air-eau : 14 000 €</li>
  <li>Aides totales : 7 000 €</li>
  <li>Coût net : 7 000 €</li>
  <li>Économie annuelle : 700-1 200 €</li>
  <li><strong>ROI : 6-10 ans</strong></li>
  <li>Durée de vie PAC : 15-20 ans</li>
  <li>Gain total sur 20 ans : 7 000-17 000 €</li>
</ul>

<h2>Conditions techniques à vérifier</h2>
<ul>
  <li><strong>Isolation</strong> : maison correctement isolée (sinon PAC sous-dimensionnée)</li>
  <li><strong>Espace extérieur</strong> : 1-2 m² pour l'unité externe</li>
  <li><strong>Distance habitation</strong> : au moins 5 m des voisins (bruit)</li>
  <li><strong>Type radiateurs</strong> : basse température idéal, sinon remplacement nécessaire</li>
  <li><strong>Électricité</strong> : compteur 9 kVA minimum (parfois 12 kVA)</li>
</ul>

<blockquote>
  <p><strong>Conseil</strong> : faites un <strong>audit énergétique</strong> avant. Coût : 500-1 000 €. Aide MaPrimeRénov' : 300 €.</p>
</blockquote>

<h2>FAQ pompe à chaleur 2026</h2>

<h3>Mon installateur doit-il être RGE ?</h3>
<p>OBLIGATOIRE pour bénéficier de toutes les aides. Vérifiez sur france-renov.gouv.fr.</p>

<h3>Une PAC fait-elle du bruit ?</h3>
<p>Unité externe : 35-60 dB. Choisissez modèles silencieux (Daikin, Mitsubishi, Atlantic) si voisins proches.</p>

<h3>Combien dure une PAC ?</h3>
<p>15-20 ans avec entretien annuel. Garantie constructeur : 5-10 ans pour le compresseur.</p>

<h2>Trouvez votre installateur RGE</h2>
<p>Sur Bisecco, consultez des <a href="/metiers/chauffagiste">chauffagistes certifiés</a> près de chez vous. Par exemple un <a href="/metiers/chauffagiste/cannes">chauffagiste à Cannes</a> ou un <a href="/metiers/chauffagiste/meaux">chauffagiste à Meaux</a>.</p>

<p><em>Article publié le 20 juillet 2026 par l'équipe Bisecco.</em></p>
  $$,
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1280&h=720&fit=crop',
  'Unité extérieure de pompe à chaleur installée',
  'L''équipe Bisecco',
  '9 min',
  'published',
  '2026-07-20 10:00:00+00',
  'Pompe à chaleur 2026 : prix, aides, ROI',
  'PAC 2026 : prix 5 000 à 30 000 €. Aides jusqu''à 11 000 €. ROI 6-10 ans. Air-eau ou géothermique : guide complet.'
)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, excerpt = EXCLUDED.excerpt, content_html = EXCLUDED.content_html, published_at = EXCLUDED.published_at, updated_at = NOW();


-- ─── Article 10 · Semaine 5 (Jeu 23 juillet) ──────────────────────────
INSERT INTO public.blog_articles (slug, title, excerpt, content_html, image_url, image_alt, author, read_time, status, published_at, meta_title, meta_description)
VALUES (
  'cee-2026-guide-primes-energie',
  'CEE 2026 : guide complet des primes énergie',
  'Les Certificats d''Économie d''Énergie en 2026 : montants, travaux éligibles, comment les obtenir. Cumul avec MaPrimeRénov''.',
  $$
<p>Les <strong>CEE</strong> (Certificats d'Économie d'Énergie) sont méconnus mais peuvent vous rapporter <strong>jusqu'à 5 000 €</strong> par dossier, en plus de MaPrimeRénov'. Comment en profiter ?</p>

<h2>Qu'est-ce que les CEE ?</h2>
<p>Les CEE sont une obligation faite aux <strong>fournisseurs d'énergie</strong> (EDF, Engie, Total) de financer la rénovation énergétique des particuliers. Cette aide est versée par eux <strong>en complément ou indépendamment</strong> de MaPrimeRénov'.</p>

<h2>Travaux éligibles aux CEE en 2026</h2>

<h3>Isolation</h3>
<ul>
  <li><strong>Combles perdus</strong> : 10-20 €/m²</li>
  <li><strong>Murs extérieurs (ITE)</strong> : 15-30 €/m²</li>
  <li><strong>Planchers bas</strong> : 10-25 €/m²</li>
</ul>

<h3>Chauffage</h3>
<ul>
  <li><strong>Pompe à chaleur air-eau</strong> : 2 500-5 000 €</li>
  <li><strong>Chaudière biomasse</strong> : 2 500-4 000 €</li>
  <li><strong>Système solaire combiné</strong> : 2 500-4 000 €</li>
  <li><strong>Raccordement réseau chaleur</strong> : 700-1 200 €</li>
</ul>

<h3>Eau chaude</h3>
<ul>
  <li><strong>Chauffe-eau thermodynamique</strong> : 100-400 €</li>
  <li><strong>Chauffe-eau solaire</strong> : 250-700 €</li>
</ul>

<h2>"Coup de Pouce" : majoration spéciale</h2>
<p>Certains travaux bénéficient d'un <strong>Coup de Pouce</strong> (bonus CEE majoré) si vous remplacez :</p>
<ul>
  <li>Chaudière fioul ou charbon → +1 500-3 500 € en plus</li>
  <li>Chaudière gaz → +500-1 500 €</li>
</ul>

<h2>Comment obtenir les CEE ?</h2>

<h3>Méthode 1 : Demande directe (recommandée)</h3>
<ol>
  <li>Comparez les offres sur <strong>edf.fr/primes-economie-energie</strong>, <strong>engie.fr</strong>, <strong>totalenergies.fr</strong></li>
  <li>Signez l'accord AVANT signature du devis artisan</li>
  <li>Faites réaliser les travaux par un artisan RGE</li>
  <li>Envoyez la facture au fournisseur</li>
  <li>Recevez la prime par virement ou bon d'achat</li>
</ol>

<h3>Méthode 2 : Via l'artisan</h3>
<p>Certains artisans intègrent les CEE directement dans leur devis (déduction immédiate). Plus simple mais montant souvent moins élevé.</p>

<blockquote>
  <p><strong>ATTENTION</strong> : la demande CEE doit être faite <strong>AVANT</strong> la signature du devis. Sinon refusée systématiquement.</p>
</blockquote>

<h2>Cumul avec MaPrimeRénov'</h2>
<p>OUI, les CEE sont 100 % cumulables avec :</p>
<ul>
  <li>MaPrimeRénov' (jusqu'à 11 000 €)</li>
  <li>TVA réduite à 5,5 %</li>
  <li>Éco-PTZ jusqu'à 50 000 €</li>
  <li>Aides locales (région/département)</li>
</ul>

<h2>Cas pratique : remplacement chaudière fioul par PAC</h2>
<ul>
  <li>Coût PAC air-eau : 14 000 €</li>
  <li>MaPrimeRénov' (revenus modestes) : 5 000 €</li>
  <li>CEE classiques : 2 500 €</li>
  <li>Coup de Pouce chaudière fioul : 3 000 €</li>
  <li>TVA 5,5 % (au lieu de 20 %) : économie ~2 000 €</li>
  <li><strong>Reste à charge</strong> : <strong>1 500 €</strong> seulement</li>
</ul>

<h2>Quel fournisseur choisir pour les CEE ?</h2>
<ul>
  <li><strong>EDF</strong> : primes les plus élevées en moyenne</li>
  <li><strong>Engie</strong> : bonne ergonomie demande en ligne</li>
  <li><strong>Total Energies</strong> : souvent meilleurs taux pour isolation</li>
  <li><strong>Effy</strong> (intermédiaire) : compare automatiquement</li>
</ul>
<p>Comparez systématiquement 2-3 offres : écart de 20-30 % possible.</p>

<h2>FAQ CEE 2026</h2>

<h3>Combien de temps pour recevoir la prime ?</h3>
<p>2 à 4 mois après envoi de la facture.</p>

<h3>Les CEE sont-ils imposables ?</h3>
<p>Non, ils sont défiscalisés.</p>

<h3>Peut-on cumuler CEE et éco-PTZ ?</h3>
<p>Oui, et c'est même conseillé pour ne pas avancer les fonds.</p>

<h2>Trouvez un artisan RGE pour vos travaux</h2>
<p>Sur Bisecco, consultez des artisans <a href="/metiers/chauffagiste">chauffagiste</a>, <a href="/metiers/electricien">électricien</a> certifiés RGE. Par exemple un <a href="/metiers/chauffagiste/cannes">chauffagiste à Cannes</a>.</p>

<p><em>Article publié le 23 juillet 2026 par l'équipe Bisecco.</em></p>
  $$,
  'https://images.unsplash.com/photo-1554224155-1696413565d3?w=1280&h=720&fit=crop',
  'Document d''aide énergétique et calculatrice',
  'L''équipe Bisecco',
  '8 min',
  'published',
  '2026-07-23 10:00:00+00',
  'CEE 2026 : guide complet primes énergie',
  'CEE 2026 : jusqu''à 5 000 € par dossier. Travaux éligibles, démarches, cumul MaPrimeRénov''. Guide pratique.'
)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, excerpt = EXCLUDED.excerpt, content_html = EXCLUDED.content_html, published_at = EXCLUDED.published_at, updated_at = NOW();


-- ─── Article 11 · Semaine 6 (Lun 27 juillet) ──────────────────────────
INSERT INTO public.blog_articles (slug, title, excerpt, content_html, image_url, image_alt, author, read_time, status, published_at, meta_title, meta_description)
VALUES (
  'dpe-2026-nouvelles-regles-vendre-louer',
  'DPE 2026 : nouvelles règles pour vendre ou louer',
  'DPE 2026 : ce qui change pour vendre ou louer votre logement. Interdiction location passoires thermiques, audits obligatoires.',
  $$
<p>Le DPE (Diagnostic de Performance Énergétique) est devenu un <strong>outil de filtrage</strong> du marché immobilier. En 2026, les règles se durcissent encore. Voici ce qu'il faut savoir.</p>

<h2>Qu'est-ce que le DPE ?</h2>
<p>Le DPE évalue la consommation énergétique et l'émission de gaz à effet de serre d'un logement, sur une échelle de <strong>A (très performant)</strong> à <strong>G (passoire thermique)</strong>.</p>
<p>Il est <strong>OBLIGATOIRE</strong> pour :</p>
<ul>
  <li>Toute vente immobilière</li>
  <li>Toute location (nouveau bail)</li>
  <li>Toute construction neuve (DPE prévisionnel)</li>
</ul>

<h2>Les interdictions de location en 2026</h2>
<p>Depuis le 1er janvier 2025, <strong>interdiction de louer un logement classé G</strong>. À venir :</p>
<ul>
  <li><strong>1er janvier 2028</strong> : interdiction logements classés F</li>
  <li><strong>1er janvier 2034</strong> : interdiction logements classés E</li>
</ul>
<p>Plus de 4 millions de logements seront concernés dans les prochaines années.</p>

<h2>Conséquences pour les propriétaires</h2>

<h3>Si vous voulez VENDRE en 2026</h3>
<ul>
  <li>DPE valide (moins de 10 ans) <strong>obligatoire</strong> dans l'annonce</li>
  <li>Si classement E, F ou G : <strong>audit énergétique</strong> obligatoire (300-1 000 €)</li>
  <li>Décote sur le prix : <strong>-5 à -25 %</strong> pour les logements F/G</li>
</ul>

<h3>Si vous voulez LOUER en 2026</h3>
<ul>
  <li>Classe G : <strong>interdit de louer</strong> (sauf bail en cours)</li>
  <li>Classe E ou F : interdit d'augmenter le loyer</li>
  <li>Bail mention du DPE obligatoire</li>
</ul>

<h2>Comment améliorer son DPE ?</h2>

<h3>Gain de 1-2 classes (faible budget)</h3>
<ul>
  <li><strong>Isolation combles</strong> : 2 000-4 000 €</li>
  <li><strong>VMC double flux</strong> : 1 500-4 000 €</li>
  <li><strong>Calorifugeage tuyaux</strong> : 500-1 500 €</li>
  <li><strong>Remplacement ampoules LED</strong> : 100-300 €</li>
</ul>

<h3>Gain de 2-3 classes (budget moyen)</h3>
<ul>
  <li><strong>Isolation murs extérieurs (ITE)</strong> : 10 000-20 000 €</li>
  <li><strong>Pompe à chaleur</strong> : 10 000-15 000 €</li>
  <li><strong>Fenêtres double vitrage</strong> : 600-1 500 €/fenêtre</li>
</ul>

<h3>Rénovation globale (passer de G à C ou B)</h3>
<ul>
  <li>Bouquet de travaux : 30 000-80 000 €</li>
  <li>Aides MaPrimeRénov' parcours accompagné : jusqu'à <strong>70 000 €</strong></li>
  <li>Reste à charge possible : <strong>10 000-25 000 €</strong> seulement</li>
</ul>

<h2>Combien coûte un DPE en 2026 ?</h2>
<ul>
  <li><strong>DPE seul</strong> : 100-250 €</li>
  <li><strong>Audit énergétique</strong> : 500-1 000 € (obligatoire si E/F/G en vente)</li>
  <li><strong>Diagnostics complets vente</strong> (DPE + amiante + plomb + termites) : 350-800 €</li>
</ul>

<h2>Comment choisir un diagnostiqueur ?</h2>
<ul>
  <li>Doit être <strong>certifié</strong> par un organisme accrédité (Bureau Veritas, Socotec)</li>
  <li>Vérifiez sa certification sur <strong>annuaire-diagnostiqueurs.developpement-durable.gouv.fr</strong></li>
  <li>Comparez 2-3 devis</li>
  <li>Mauvais signe : prix &lt; 100 € (souvent diagnostics expéditifs avec erreurs)</li>
</ul>

<blockquote>
  <p><strong>Astuce</strong> : un mauvais DPE peut être contesté. Si vous pensez avoir une note injuste, demandez un 2ème avis chez un autre diagnostiqueur.</p>
</blockquote>

<h2>FAQ DPE 2026</h2>

<h3>Combien de temps est valide un DPE ?</h3>
<p>10 ans, sauf si vous faites des travaux importants entre-temps (refaire un DPE post-travaux).</p>

<h3>Mon logement peut être interdit à la location ?</h3>
<p>OUI si classé G dès maintenant. F en 2028. E en 2034. Anticipez.</p>

<h3>Si je ne fais pas de DPE pour vendre ?</h3>
<p>Acheteur peut <strong>annuler la vente</strong> ou demander des dommages-intérêts. Risque énorme.</p>

<h2>Trouvez des artisans pour améliorer votre DPE</h2>
<p>Sur Bisecco, recherchez <a href="/metiers/chauffagiste">chauffagiste</a>, <a href="/metiers/menuisier">menuisier</a> ou <a href="/metiers/couvreur">couvreur</a> RGE. Par exemple un <a href="/metiers/chauffagiste/cannes">chauffagiste à Cannes</a> pour installer une PAC.</p>

<p><em>Article publié le 27 juillet 2026 par l'équipe Bisecco.</em></p>
  $$,
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1280&h=720&fit=crop',
  'Étiquette énergie d''un bâtiment',
  'L''équipe Bisecco',
  '7 min',
  'published',
  '2026-07-27 10:00:00+00',
  'DPE 2026 : nouvelles règles vente et location',
  'DPE 2026 : interdiction location G, F en 2028, E en 2034. Comment améliorer son classement, audits, aides.'
)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, excerpt = EXCLUDED.excerpt, content_html = EXCLUDED.content_html, published_at = EXCLUDED.published_at, updated_at = NOW();


-- ─── Article 12 · Semaine 6 (Jeu 30 juillet) ──────────────────────────
INSERT INTO public.blog_articles (slug, title, excerpt, content_html, image_url, image_alt, author, read_time, status, published_at, meta_title, meta_description)
VALUES (
  'permis-construire-declaration-prealable-2026',
  'Permis de construire vs déclaration préalable : guide 2026',
  'Quelle autorisation pour vos travaux ? Permis de construire ou simple déclaration préalable : seuils, démarches, délais.',
  $$
<p>Avant de lancer des travaux, vous devez souvent demander une autorisation à la mairie. <strong>Permis de construire</strong> ou <strong>déclaration préalable</strong> ? Voici le guide 2026 pour ne pas vous tromper.</p>

<h2>Les 2 régimes d'autorisation</h2>

<h3>Déclaration préalable (DP)</h3>
<ul>
  <li>Procédure simplifiée</li>
  <li>Délai : <strong>1 mois</strong></li>
  <li>Pas d'architecte obligatoire</li>
  <li>Coût : gratuit</li>
</ul>

<h3>Permis de construire (PC)</h3>
<ul>
  <li>Procédure complète</li>
  <li>Délai : <strong>2-3 mois</strong></li>
  <li>Architecte obligatoire si surface totale &gt; 150 m²</li>
  <li>Coût : gratuit (sauf honoraires architecte)</li>
</ul>

<h2>Seuils selon le type de travaux</h2>

<h3>Création de surface (extension, garage, abri)</h3>
<ul>
  <li><strong>&lt; 5 m²</strong> : aucune formalité</li>
  <li><strong>5 à 20 m²</strong> (zone rurale) ou <strong>5 à 40 m²</strong> (zone urbaine PLU) : DP</li>
  <li><strong>&gt; 20 m²</strong> ou <strong>&gt; 40 m²</strong> : PC</li>
  <li><strong>Surface totale &gt; 150 m²</strong> après travaux : architecte obligatoire</li>
</ul>

<h3>Modification de façade</h3>
<ul>
  <li>Changement fenêtre/porte (mêmes dimensions) : aucune formalité</li>
  <li>Création nouvelle ouverture : DP</li>
  <li>Modification importante (façade neuve, couleur) : DP</li>
  <li>Zone protégée (ABF) : accord Bâtiments de France obligatoire</li>
</ul>

<h3>Toiture</h3>
<ul>
  <li>Réfection à l'identique : aucune formalité</li>
  <li>Changement matériau/couleur : DP</li>
  <li>Modification volume/pente : PC</li>
</ul>

<h3>Piscine</h3>
<ul>
  <li><strong>Bassin &lt; 10 m²</strong> : aucune formalité</li>
  <li><strong>10-100 m²</strong> non couvert : DP</li>
  <li><strong>&gt; 100 m²</strong> ou couverture &gt; 1,80 m : PC</li>
</ul>

<h3>Clôture, mur</h3>
<ul>
  <li>Selon PLU : souvent DP nécessaire</li>
  <li>Hauteur réglementée par la mairie (souvent &lt; 2 m)</li>
</ul>

<h2>Démarches étape par étape</h2>

<h3>Déclaration préalable</h3>
<ol>
  <li>Constituer le dossier : <strong>cerfa 13404*XX</strong> + plans + photos + descriptif</li>
  <li>Déposer en mairie (en 2 exemplaires) ou via <strong>service-public.fr</strong></li>
  <li>Mairie a 1 mois pour répondre</li>
  <li>Silence = accord tacite (mais demandez certificat)</li>
  <li>Afficher l'autorisation sur le terrain (panneau visible)</li>
  <li>Délai de recours des tiers : 2 mois</li>
</ol>

<h3>Permis de construire</h3>
<ol>
  <li>Constituer le dossier : <strong>cerfa 13406*XX</strong> + plans architectes + descriptif</li>
  <li>Déposer en mairie (4 exemplaires) ou en ligne</li>
  <li>Mairie instruit en 2 mois (3 si zone ABF/PPRI)</li>
  <li>Si accord, afficher sur terrain</li>
  <li>Délai recours : 2 mois</li>
  <li>Démarrage travaux : <strong>après expiration du recours</strong></li>
  <li>Déclaration d'ouverture de chantier (DOC) obligatoire</li>
  <li>Déclaration d'achèvement (DAACT) à la fin</li>
</ol>

<h2>Quels documents fournir ?</h2>

<h3>Toujours nécessaires</h3>
<ul>
  <li>Plans de masse (1/100 ou 1/200)</li>
  <li>Plan en coupe</li>
  <li>Vue façades</li>
  <li>Photos du terrain (avant)</li>
  <li>Insertion paysagère (PC)</li>
</ul>

<h3>Pour le PC</h3>
<ul>
  <li>RT 2020 (étude thermique)</li>
  <li>Étude de sol (zone risque)</li>
  <li>Notice descriptive complète</li>
</ul>

<h2>Sanctions en cas de non-respect</h2>
<ul>
  <li>Amende : <strong>1 200 à 6 000 € / m²</strong></li>
  <li>Obligation de démolir (par décision du tribunal)</li>
  <li>Refus de vente future</li>
  <li>Litige permanent avec voisins/mairie</li>
</ul>

<blockquote>
  <p><strong>Erreur fréquente</strong> : penser que "personne ne verra". Les voisins ou les contrôles satellites/drones repèrent. Toujours déclarer.</p>
</blockquote>

<h2>FAQ permis 2026</h2>

<h3>Combien coûte un architecte pour un PC ?</h3>
<p>Honoraires : <strong>8-15 %</strong> du coût total des travaux. Pour 100 000 € de travaux : 8 000-15 000 € d'honoraires.</p>

<h3>Quels travaux puis-je faire sans rien déclarer ?</h3>
<p>Rénovation intérieure (peinture, sol, cuisine), changement à l'identique fenêtres/toiture, &lt; 5 m² d'extension.</p>

<h3>Si la mairie refuse mon PC ?</h3>
<p>Demandez un rendez-vous pour comprendre. Modifiez le projet. Recours possible dans les 2 mois.</p>

<h2>Trouvez un artisan pour vos travaux autorisés</h2>
<p>Sur Bisecco, consultez <a href="/metiers/macon">maçons</a>, <a href="/metiers/menuisier">menuisiers</a>, <a href="/metiers/couvreur">couvreurs</a> près de chez vous. Par exemple un <a href="/metiers/macon/cannes">maçon à Cannes</a> pour votre extension.</p>

<p><em>Article publié le 30 juillet 2026 par l'équipe Bisecco.</em></p>
  $$,
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1280&h=720&fit=crop',
  'Plans d''architecte et documents administratifs',
  'L''équipe Bisecco',
  '8 min',
  'published',
  '2026-07-30 10:00:00+00',
  'Permis construire vs déclaration préalable 2026',
  'Permis de construire ou déclaration préalable ? Seuils, démarches, délais, sanctions. Guide complet 2026.'
)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, excerpt = EXCLUDED.excerpt, content_html = EXCLUDED.content_html, published_at = EXCLUDED.published_at, updated_at = NOW();


-- ─── Article 13 · Semaine 7 (Lun 3 août) ──────────────────────────────
INSERT INTO public.blog_articles (slug, title, excerpt, content_html, image_url, image_alt, author, read_time, status, published_at, meta_title, meta_description)
VALUES (
  'prix-extension-maison-2026',
  'Prix d''une extension de maison en 2026 : guide complet',
  'Combien coûte une extension de maison en 2026 ? Par m², par matériau (parpaing, ossature bois). Architecte, permis, aides.',
  $$
<p>Une extension est l'une des meilleures façons d'<strong>augmenter sa surface habitable</strong> sans déménager. C'est aussi un investissement rentable : <strong>+8 à +15 % de valeur</strong> du bien. Voici le guide complet 2026.</p>

<h2>Combien coûte une extension par m² ?</h2>

<h3>Extension parpaing (la plus économique)</h3>
<ul>
  <li><strong>Gros œuvre seul</strong> : 800-1 200 €/m²</li>
  <li><strong>Tout corps d'état (clé en main)</strong> : 1 500-2 500 €/m²</li>
  <li>Pour 20 m² : <strong>30 000-50 000 €</strong></li>
</ul>

<h3>Extension ossature bois</h3>
<ul>
  <li><strong>Clé en main</strong> : 1 500-2 800 €/m²</li>
  <li>Pour 20 m² : <strong>30 000-56 000 €</strong></li>
  <li>Avantages : rapide (3-4 semaines), écologique, performance thermique</li>
</ul>

<h3>Extension verre / véranda</h3>
<ul>
  <li><strong>Véranda alu</strong> : 1 200-2 500 €/m²</li>
  <li><strong>Véranda fer forgé</strong> : 2 500-5 000 €/m²</li>
  <li>Inconvénient : isolation moindre</li>
</ul>

<h3>Surélévation (étage supplémentaire)</h3>
<ul>
  <li><strong>Ossature bois</strong> : 1 800-3 500 €/m²</li>
  <li><strong>Parpaing</strong> : 2 500-4 500 €/m²</li>
  <li>Nécessite étude structure préalable</li>
</ul>

<h2>Décomposition d'un budget extension parpaing 20 m²</h2>
<ul>
  <li><strong>Études (architecte si &gt; 150 m² total)</strong> : 4 000-8 000 €</li>
  <li><strong>Permis de construire</strong> : gratuit</li>
  <li><strong>Terrassement + fondations</strong> : 3 000-5 000 €</li>
  <li><strong>Gros œuvre (maçonnerie)</strong> : 15 000-25 000 €</li>
  <li><strong>Charpente + toiture + couverture</strong> : 6 000-10 000 €</li>
  <li><strong>Menuiseries (fenêtres, porte)</strong> : 3 000-6 000 €</li>
  <li><strong>Plomberie + électricité</strong> : 3 000-6 000 €</li>
  <li><strong>Isolation + cloisons + plafond</strong> : 3 000-5 000 €</li>
  <li><strong>Carrelage / parquet</strong> : 2 000-4 000 €</li>
  <li><strong>Peinture + finitions</strong> : 1 500-3 000 €</li>
  <li><strong>Imprévus (10 %)</strong> : 4 000-7 000 €</li>
  <li><strong>TOTAL extension 20 m²</strong> : <strong>~44 500-79 000 €</strong></li>
</ul>

<h2>Démarches administratives</h2>

<h3>Selon la surface créée</h3>
<ul>
  <li><strong>&lt; 5 m²</strong> : aucune formalité</li>
  <li><strong>5-20 m²</strong> (40 m² zone urbaine PLU) : déclaration préalable</li>
  <li><strong>&gt; 20 m²</strong> (40 m² zone urbaine) : permis de construire</li>
  <li><strong>Surface totale &gt; 150 m²</strong> après travaux : architecte obligatoire</li>
</ul>

<h2>Délai total du projet</h2>
<ul>
  <li>Études + plans : 1-2 mois</li>
  <li>Permis de construire : 2-3 mois</li>
  <li>Délai de recours (post-permis) : 2 mois</li>
  <li>Construction : 4-8 mois (selon matériau)</li>
  <li><strong>TOTAL : 9-15 mois</strong></li>
</ul>

<h2>Architecte ou pas ?</h2>

<h3>Avec architecte (obligatoire si &gt; 150 m²)</h3>
<ul>
  <li>Honoraires : 8-15 % du coût travaux</li>
  <li>Suivi de chantier + responsabilité</li>
  <li>Plans optimisés</li>
</ul>

<h3>Sans architecte (sous 150 m²)</h3>
<ul>
  <li>Économie 8-15 % sur le total</li>
  <li>Vous coordonnez (chronophage)</li>
  <li>Plans à faire vous-même ou par dessinateur (1 500-3 000 €)</li>
</ul>

<h2>Aides 2026 pour les extensions</h2>
<ul>
  <li><strong>MaPrimeRénov' Sérénité</strong> : si gain énergétique &gt; 35 % (parcours accompagné)</li>
  <li><strong>TVA 10 %</strong> au lieu de 20 % (logement &gt; 2 ans)</li>
  <li><strong>Éco-PTZ</strong> : jusqu'à 50 000 € à 0 %</li>
  <li><strong>Aides locales</strong> : variable selon commune</li>
</ul>

<h2>FAQ extension 2026</h2>

<h3>Quelle est la durée moyenne ?</h3>
<p>4-8 mois construction + 6-9 mois administratif = <strong>1 an total</strong> pour démarrage à fin chantier.</p>

<h3>Faut-il un permis pour un garage ?</h3>
<p>Oui dès 20 m² (40 m² zone urbaine). Sinon DP entre 5 et 20 m².</p>

<h3>Mon voisin peut-il s'opposer ?</h3>
<p>Pendant les 2 mois de recours, oui. Privilégiez le dialogue avant dépôt du permis.</p>

<h2>Trouvez vos artisans pour votre extension</h2>
<p>Sur Bisecco, consultez <a href="/metiers/macon">maçons</a>, <a href="/metiers/couvreur">couvreurs/charpentiers</a>, <a href="/metiers/menuisier">menuisiers</a> près de chez vous. Par exemple un <a href="/metiers/macon/cannes">maçon à Cannes</a> ou un <a href="/metiers/macon/meaux">maçon à Meaux</a>.</p>

<p><em>Article publié le 3 août 2026 par l'équipe Bisecco.</em></p>
  $$,
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1280&h=720&fit=crop',
  'Chantier d''extension de maison en construction',
  'L''équipe Bisecco',
  '8 min',
  'published',
  '2026-08-03 10:00:00+00',
  'Prix extension maison 2026 : budget complet',
  'Combien coûte une extension de maison en 2026 : 1 500-2 800 €/m² clé en main. Démarches, délais, aides.'
)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, excerpt = EXCLUDED.excerpt, content_html = EXCLUDED.content_html, published_at = EXCLUDED.published_at, updated_at = NOW();


-- ─── Article 14 · Semaine 7 (Jeu 6 août) ──────────────────────────────
INSERT INTO public.blog_articles (slug, title, excerpt, content_html, image_url, image_alt, author, read_time, status, published_at, meta_title, meta_description)
VALUES (
  'abandon-chantier-que-faire-2026',
  'Abandon de chantier : que faire en 2026 ? Vos recours',
  'L''artisan a disparu avec l''acompte ? Voici la procédure complète pour récupérer votre argent et faire finir les travaux.',
  $$
<p>Vous avez payé un acompte et l'artisan a <strong>disparu sans finir les travaux</strong> ? Vous n'êtes pas seul : la DGCCRF reçoit plus de <strong>30 000 plaintes par an</strong> pour abandon de chantier. Voici la procédure pour récupérer votre argent et finir vos travaux.</p>

<h2>Que faire en cas d'abandon de chantier ?</h2>

<h3>Étape 1 : Tentative de contact (8 jours)</h3>
<p>Avant tout, essayez de joindre l'artisan :</p>
<ul>
  <li>Téléphone, SMS, e-mail</li>
  <li>LinkedIn, autres réseaux</li>
  <li>Visite domicile entreprise si proche</li>
  <li>Demandez une <strong>nouvelle date de reprise</strong> écrite</li>
</ul>
<p>Si silence après 8 jours : passez à l'étape 2.</p>

<h3>Étape 2 : Mise en demeure (15 jours)</h3>
<p>Envoyez une <strong>lettre recommandée avec accusé de réception</strong> :</p>
<ul>
  <li>Rappel du contrat et de l'acompte versé</li>
  <li>Liste des travaux non effectués</li>
  <li>Délai : 15 jours pour reprendre</li>
  <li>Mention "À défaut, je résilierai le contrat"</li>
  <li>Conservez accusé de réception</li>
</ul>

<h3>Étape 3 : Résiliation du contrat</h3>
<p>Si toujours pas de reprise au 15ème jour :</p>
<ul>
  <li>Nouvelle lettre recommandée AR</li>
  <li>Notifie la résiliation pour faute</li>
  <li>Demandez remboursement de l'acompte sous 15 jours</li>
</ul>

<h3>Étape 4 : Procédures judiciaires</h3>
<p>Plusieurs options selon le montant :</p>
<ul>
  <li><strong>&lt; 5 000 €</strong> : injonction de payer (juge proxim. 15-30 jours)</li>
  <li><strong>5 000-10 000 €</strong> : tribunal de proximité</li>
  <li><strong>&gt; 10 000 €</strong> : tribunal judiciaire (avocat conseillé)</li>
  <li><strong>Procédure pénale</strong> : escroquerie si fraude avérée</li>
</ul>

<h2>Quels recours en parallèle ?</h2>

<h3>1. La DGCCRF (Répression des fraudes)</h3>
<p>Signalez sur <strong>signalconso.gouv.fr</strong>. Aucun frais. La DGCCRF peut enquêter et faire pression.</p>

<h3>2. La CAPEB / FFB (syndicats artisans)</h3>
<p>Si l'artisan en est membre, ils peuvent intervenir pour <strong>médiation amiable</strong>.</p>

<h3>3. L'assurance protection juridique</h3>
<p>Souvent incluse dans assurance habitation ou banque. Couvre frais avocat (1 000-3 000 €).</p>

<h3>4. La médiation de la consommation</h3>
<p>Service GRATUIT obligatoire avant procès. Liste sur <strong>economie.gouv.fr</strong>.</p>

<h2>Si l'artisan est en liquidation judiciaire</h2>
<p>Mauvaise nouvelle : peu de chance de récupérer votre acompte. Recours :</p>
<ul>
  <li>Déclarez votre <strong>créance au mandataire judiciaire</strong> dans les 2 mois</li>
  <li>Vous serez payé dans l'ordre des créanciers (souvent dernier)</li>
  <li>Pour les travaux non finis : vous devez payer un autre artisan</li>
</ul>

<blockquote>
  <p><strong>Bonne nouvelle</strong> : si l'artisan avait souscrit une <strong>assurance "garantie de paiement"</strong>, l'assureur peut vous rembourser. Vérifiez son devis.</p>
</blockquote>

<h2>Comment trouver un autre artisan rapidement ?</h2>
<ul>
  <li>Évitez les "artisans dépanneurs" via Google Ads (souvent les mêmes arnaqueurs)</li>
  <li>Privilégiez un <strong>artisan vérifié SIREN</strong> sur Bisecco</li>
  <li>Demandez explicitement <strong>2-3 références récentes</strong></li>
  <li>Vérifiez l'<strong>assurance décennale</strong></li>
</ul>

<h2>Comment éviter ça à l'avenir ?</h2>
<ol>
  <li><strong>Acompte ≤ 30 %</strong> max (légal)</li>
  <li>Échéancier en 3 ou 4 fois (pas en 2 grosses parts)</li>
  <li>Vérifier SIREN + assurance décennale AVANT signature</li>
  <li>Préférer un artisan <strong>recommandé par 2-3 personnes</strong> + avis vérifiés</li>
  <li>Faire un devis détaillé ligne par ligne</li>
  <li>Visiter un chantier en cours du même artisan</li>
</ol>

<h2>FAQ abandon chantier 2026</h2>

<h3>Combien de temps prend une procédure ?</h3>
<p>Injonction de payer : <strong>2-3 mois</strong>. Procès complet : 6-18 mois.</p>

<h3>Puis-je faire payer l'artisan défaillant le coût du nouvel artisan ?</h3>
<p>Oui, mais procédure judiciaire nécessaire. Conservez tous les devis.</p>

<h3>Si l'artisan est SIRET radié ?</h3>
<p>Procédure très difficile. Récupération acompte presque impossible. Bénéfice : ça fait jurisprudence.</p>

<h2>Trouvez un artisan de confiance pour reprendre vos travaux</h2>
<p>Sur Bisecco, tous les artisans sont <strong>vérifiés SIREN</strong>. Par exemple : <a href="/metiers/plombier/cannes">plombier à Cannes</a>, <a href="/metiers/macon/meaux">maçon à Meaux</a> ou <a href="/metiers/electricien/nice">électricien à Nice</a>.</p>

<p><em>Article publié le 6 août 2026 par l'équipe Bisecco.</em></p>
  $$,
  'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1280&h=720&fit=crop',
  'Chantier abandonné avec outils laissés',
  'L''équipe Bisecco',
  '9 min',
  'published',
  '2026-08-06 10:00:00+00',
  'Abandon de chantier : que faire en 2026',
  'Artisan disparu avec acompte ? Procédure complète : mise en demeure, résiliation, recours juridiques. Guide 2026.'
)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, excerpt = EXCLUDED.excerpt, content_html = EXCLUDED.content_html, published_at = EXCLUDED.published_at, updated_at = NOW();


-- ─── Vérification ─────────────────────────────────────────────────────
SELECT COUNT(*) AS total_articles FROM public.blog_articles WHERE status = 'published';
