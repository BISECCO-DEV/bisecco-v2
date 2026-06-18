-- =====================================================================
-- 031 — Articles 15 à 20 (suite et FIN du calendrier 20 articles)
-- À lancer dans Supabase Dashboard → SQL Editor.
-- =====================================================================

-- ─── Article 15 · Semaine 8 (Lun 10 août) ─────────────────────────────
INSERT INTO public.blog_articles (slug, title, excerpt, content_html, image_url, image_alt, author, read_time, status, published_at, meta_title, meta_description)
VALUES (
  'pompe-chaleur-vs-chaudiere-gaz-2026',
  'Pompe à chaleur ou chaudière gaz : que choisir en 2026 ?',
  'Comparatif complet PAC vs chaudière gaz en 2026 : coût, performance, écologie, aides. Quelle solution pour votre maison ?',
  $$
<p>En 2026, la <strong>chaudière gaz</strong> est encore très répandue, mais la <strong>pompe à chaleur</strong> gagne du terrain. Quel système choisir pour remplacer votre vieille chaudière ? Comparatif chiffré.</p>

<h2>Tableau comparatif rapide</h2>
<table>
  <tr><th>Critère</th><th>PAC air-eau</th><th>Chaudière gaz</th></tr>
  <tr><td>Prix achat + pose</td><td>10 000-18 000 €</td><td>3 500-8 000 €</td></tr>
  <tr><td>Aides 2026</td><td>jusqu'à 11 000 €</td><td>0 € (sortie aides)</td></tr>
  <tr><td>Coût énergie/an*</td><td>700-1 100 €</td><td>1 400-1 900 €</td></tr>
  <tr><td>Durée de vie</td><td>15-20 ans</td><td>15-20 ans</td></tr>
  <tr><td>Entretien/an</td><td>150-250 €</td><td>120-200 €</td></tr>
  <tr><td>Émissions CO₂</td><td>Faibles</td><td>Élevées</td></tr>
</table>
<p>*Pour 100 m² isolation correcte.</p>

<h2>Analyse détaillée</h2>

<h3>Chaudière gaz : encore une option en 2026 ?</h3>
<p><strong>Avantages :</strong></p>
<ul>
  <li>Coût d'achat 2-3× moins cher qu'une PAC</li>
  <li>Installation rapide (1 journée)</li>
  <li>Pas de gros travaux (raccord existant)</li>
  <li>Compatible TOUS radiateurs</li>
  <li>Pas de bruit extérieur</li>
</ul>
<p><strong>Inconvénients :</strong></p>
<ul>
  <li>AUCUNE aide en 2026 (fin MaPrimeRénov')</li>
  <li>Gaz cher (1,2-1,5 €/kWh)</li>
  <li>Émissions CO₂ importantes</li>
  <li>DPE pénalisé (souvent E ou F)</li>
  <li><strong>Risque interdiction</strong> à terme</li>
</ul>

<h3>Pompe à chaleur air-eau : l'avenir</h3>
<p><strong>Avantages :</strong></p>
<ul>
  <li>Aides massives (jusqu'à 11 000 €)</li>
  <li>Économies énergie 40-60 %/an</li>
  <li>Améliore le DPE de 2-3 classes</li>
  <li>Écologique (faibles émissions)</li>
  <li>Bonus pour vente future</li>
</ul>
<p><strong>Inconvénients :</strong></p>
<ul>
  <li>Investissement initial élevé</li>
  <li>Installation 1-2 jours + travaux annexes</li>
  <li>Bruit unité extérieure (35-60 dB)</li>
  <li>Performance baisse en grand froid (&lt; -10 °C)</li>
  <li>Nécessite maison correctement isolée</li>
</ul>

<h2>Quel est le ROI réel sur 15 ans ?</h2>

<h3>Scénario A : Chaudière gaz</h3>
<ul>
  <li>Achat + pose : 6 000 €</li>
  <li>Consommation 15 ans (1 700 €/an + inflation 3 %/an) : 31 700 €</li>
  <li>Entretien 15 ans (160 €/an) : 2 400 €</li>
  <li><strong>TOTAL 15 ans</strong> : <strong>40 100 €</strong></li>
</ul>

<h3>Scénario B : Pompe à chaleur air-eau</h3>
<ul>
  <li>Achat + pose : 14 000 €</li>
  <li>Aides totales : -7 000 €</li>
  <li>Coût net : 7 000 €</li>
  <li>Consommation 15 ans (900 €/an + inflation 3 %/an) : 16 770 €</li>
  <li>Entretien 15 ans (200 €/an) : 3 000 €</li>
  <li><strong>TOTAL 15 ans</strong> : <strong>26 770 €</strong></li>
</ul>

<p><strong>Économie nette sur 15 ans avec PAC : 13 330 €</strong> + meilleur DPE (+5 à +10 % valeur du bien).</p>

<h2>Cas où la chaudière gaz reste pertinente</h2>
<ul>
  <li><strong>Budget très serré</strong> sans capacité d'avance</li>
  <li>Maison <strong>très mal isolée</strong> (PAC sous-dimensionnée)</li>
  <li>Logement avec <strong>radiateurs haute température</strong> et impossibilité de remplacer</li>
  <li>Voisins très proches et inquiet pour le bruit</li>
  <li>Location courte durée (vendre avant 5 ans)</li>
</ul>

<h2>Cas où la PAC s'impose</h2>
<ul>
  <li>Maison <strong>correctement isolée</strong> (G ou F vers C/B)</li>
  <li>Budget rénovation disponible</li>
  <li>Souhait de revente (DPE améliore valeur)</li>
  <li>Engagement écologique</li>
  <li>Habitation longue durée (rentabilité 10+ ans)</li>
</ul>

<h2>Le compromis : chaudière à condensation moderne</h2>
<p>Si vraiment vous voulez du gaz, choisissez une <strong>chaudière à condensation</strong> classe A++ :</p>
<ul>
  <li>Économie 25-30 % vs vieille chaudière</li>
  <li>Coût : 4 000-6 000 € posée</li>
  <li>Pas d'aides mais investissement raisonnable</li>
  <li>Compatible radiateurs basse et haute température</li>
</ul>

<h2>FAQ PAC vs chaudière 2026</h2>

<h3>Une PAC fonctionne par grand froid ?</h3>
<p>Oui, jusqu'à -15 °C pour les bons modèles. Performance baisse mais système d'appoint électrique automatique.</p>

<h3>Puis-je garder ma chaudière gaz et ajouter une PAC ?</h3>
<p>Oui, c'est <strong>l'hybride</strong>. Coût : 12 000-18 000 €. Économie maximale mais complexe.</p>

<h3>Quand changer ma chaudière gaz actuelle ?</h3>
<p>Si elle a &gt; 12 ans, faites un comparatif. La PAC est presque toujours rentable maintenant.</p>

<h2>Trouvez votre installateur RGE</h2>
<p>Sur Bisecco, consultez des <a href="/metiers/chauffagiste">chauffagistes/plombiers RGE</a>. Par exemple un <a href="/metiers/chauffagiste/cannes">chauffagiste à Cannes</a> ou un <a href="/metiers/chauffagiste/meaux">chauffagiste à Meaux</a>.</p>

<p><em>Article publié le 10 août 2026 par l'équipe Bisecco.</em></p>
  $$,
  'https://images.unsplash.com/photo-1635424709818-12c45fe2fac6?w=1280&h=720&fit=crop',
  'Installation chauffage moderne dans une maison',
  'L''équipe Bisecco',
  '9 min',
  'published',
  '2026-08-10 10:00:00+00',
  'PAC vs chaudière gaz 2026 : que choisir',
  'PAC ou chaudière gaz en 2026 ? Comparatif coûts, aides, ROI sur 15 ans. Décryptage chiffré pour bien choisir.'
)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, excerpt = EXCLUDED.excerpt, content_html = EXCLUDED.content_html, published_at = EXCLUDED.published_at, updated_at = NOW();


-- ─── Article 16 · Semaine 8 (Jeu 13 août) ─────────────────────────────
INSERT INTO public.blog_articles (slug, title, excerpt, content_html, image_url, image_alt, author, read_time, status, published_at, meta_title, meta_description)
VALUES (
  'carrelage-ou-parquet-quel-sol-choisir-2026',
  'Carrelage ou parquet : quel sol choisir pièce par pièce ?',
  'Carrelage ou parquet en 2026 ? Avantages, prix, ambiance. Notre guide pour choisir selon la pièce et le budget.',
  $$
<p>Le revêtement de sol représente <strong>10 à 20 % du budget rénovation</strong>. Carrelage ou parquet ? Voici un guide objectif pièce par pièce.</p>

<h2>Carrelage : avantages et inconvénients</h2>

<h3>Avantages</h3>
<ul>
  <li><strong>Très résistant</strong> : 30-50 ans</li>
  <li>Imperméable (idéal pièces humides)</li>
  <li>Entretien facile (serpillière)</li>
  <li>Large choix (imitation parquet, marbre, béton)</li>
  <li>Compatible plancher chauffant</li>
  <li>Hygiénique (pas d'acariens)</li>
</ul>

<h3>Inconvénients</h3>
<ul>
  <li>Froid au toucher (sauf avec chauffage)</li>
  <li>Cassant (vaisselle qui tombe)</li>
  <li>Bruyant (résonance, talons)</li>
  <li>Pose plus longue et coûteuse</li>
  <li>Difficile à enlever ensuite</li>
</ul>

<h2>Parquet : avantages et inconvénients</h2>

<h3>Avantages</h3>
<ul>
  <li>Chaleureux et noble</li>
  <li>Confort acoustique</li>
  <li>Confort thermique (chaud aux pieds)</li>
  <li>Plus-value immobilière (parquet massif)</li>
  <li>Restauration possible (ponçage)</li>
</ul>

<h3>Inconvénients</h3>
<ul>
  <li>Sensible à l'humidité (pas pour salle de bain)</li>
  <li>Rayures et marques (animaux, talons)</li>
  <li>Entretien régulier (huilage, cirage)</li>
  <li>Prix élevé (massif)</li>
  <li>Pose plus délicate</li>
</ul>

<h2>Comparatif des prix 2026</h2>

<h3>Carrelage</h3>
<ul>
  <li><strong>Grès cérame entrée gamme</strong> : 20-40 €/m² (fourniture)</li>
  <li><strong>Grès cérame milieu</strong> : 40-80 €/m²</li>
  <li><strong>Grand format (60×60, 80×80)</strong> : 50-150 €/m²</li>
  <li><strong>Pierre naturelle</strong> : 80-300 €/m²</li>
  <li><strong>Pose</strong> : 30-70 €/m²</li>
  <li><strong>TOTAL posé</strong> : <strong>50-200 €/m²</strong></li>
</ul>

<h3>Parquet</h3>
<ul>
  <li><strong>Stratifié (imitation)</strong> : 10-40 €/m²</li>
  <li><strong>Contrecollé</strong> : 30-100 €/m²</li>
  <li><strong>Massif chêne</strong> : 60-200 €/m²</li>
  <li><strong>Massif exotique</strong> : 100-300 €/m²</li>
  <li><strong>Pose</strong> : 25-60 €/m² (clipsable) à 50-90 €/m² (collé)</li>
  <li><strong>TOTAL posé</strong> : <strong>35-350 €/m²</strong></li>
</ul>

<h2>Quel sol pièce par pièce ?</h2>

<h3>Cuisine</h3>
<p><strong>Recommandé : Carrelage</strong></p>
<ul>
  <li>Résistance graisses, eau, chocs</li>
  <li>Hygiène + nettoyage facile</li>
  <li>Si vous voulez du bois : parquet contrecollé étanche (huilé)</li>
</ul>

<h3>Salle de bain</h3>
<p><strong>Recommandé : Carrelage uniquement</strong></p>
<ul>
  <li>Le parquet ne tient pas longtemps (sauf parquet teck spécial)</li>
  <li>Idéal : grès cérame antidérapant</li>
</ul>

<h3>Salon / Salle à manger</h3>
<p><strong>Recommandé : Parquet (massif ou contrecollé)</strong></p>
<ul>
  <li>Chaleur, confort, élégance</li>
  <li>Carrelage si plancher chauffant ou maison sud</li>
</ul>

<h3>Chambre</h3>
<p><strong>Recommandé : Parquet</strong></p>
<ul>
  <li>Confort pieds nus</li>
  <li>Stratifié si budget serré</li>
  <li>Moquette si vous voulez du douillet</li>
</ul>

<h3>Entrée / Couloir</h3>
<p><strong>Recommandé : Carrelage</strong></p>
<ul>
  <li>Passage intense + saleté extérieure</li>
  <li>Carrelage grand format pour effet moderne</li>
</ul>

<h2>Combien coûte une rénovation complète sol ?</h2>
<p>Pour 80 m² (T3) :</p>
<ul>
  <li><strong>Tout stratifié</strong> : 2 800-4 800 € posé</li>
  <li><strong>Tout carrelage entrée gamme</strong> : 4 000-9 600 € posé</li>
  <li><strong>Mix carrelage + parquet contrecollé</strong> : 6 000-12 000 €</li>
  <li><strong>Carrelage + parquet massif chêne</strong> : 10 000-20 000 €</li>
</ul>

<p>Inclus : dépose ancien sol (5-15 €/m²), préparation support (5-20 €/m²), évacuation gravats (200-400 €).</p>

<h2>Carrelage imitation parquet : la solution mixte ?</h2>
<p>Tendance forte : le <strong>carrelage qui imite le bois</strong> :</p>
<ul>
  <li>Aspect visuel ~90 % du parquet réel</li>
  <li>Résistance carrelage (humide, rayures)</li>
  <li>Prix : 40-100 €/m² fourniture</li>
  <li>Compatible toutes pièces (cuisine, sdb incluses)</li>
  <li>Inconvénient : reste froid au toucher</li>
</ul>

<h2>FAQ sols 2026</h2>

<h3>Peut-on poser sur ancien carrelage ?</h3>
<p>Oui pour le stratifié (sous-couche). Oui pour le carrelage sur carrelage si solide. Non pour le parquet massif (ponctuel).</p>

<h3>Durée de pose pour 80 m² ?</h3>
<p>Stratifié : 1-2 jours. Carrelage : 3-5 jours. Parquet massif collé : 4-7 jours.</p>

<h3>Quel sol pour locataire ?</h3>
<p>Carrelage = plus durable et plus rentable sur le long terme.</p>

<h2>Trouvez votre carreleur ou poseur de parquet</h2>
<p>Sur Bisecco, consultez des <a href="/metiers/carreleur">carreleurs</a> ou <a href="/metiers/menuisier">menuisiers</a> près de chez vous. Par exemple un <a href="/metiers/carreleur/cannes">carreleur à Cannes</a> ou un <a href="/metiers/carreleur/meaux">carreleur à Meaux</a>.</p>

<p><em>Article publié le 13 août 2026 par l'équipe Bisecco.</em></p>
  $$,
  'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1280&h=720&fit=crop',
  'Sol carrelé imitation parquet dans une pièce moderne',
  'L''équipe Bisecco',
  '8 min',
  'published',
  '2026-08-13 10:00:00+00',
  'Carrelage ou parquet : quel sol choisir 2026',
  'Carrelage ou parquet en 2026 ? Comparatif prix, avantages, recommandation pièce par pièce. Guide pratique.'
)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, excerpt = EXCLUDED.excerpt, content_html = EXCLUDED.content_html, published_at = EXCLUDED.published_at, updated_at = NOW();


-- ─── Article 17 · Semaine 9 (Lun 17 août) ─────────────────────────────
INSERT INTO public.blog_articles (slug, title, excerpt, content_html, image_url, image_alt, author, read_time, status, published_at, meta_title, meta_description)
VALUES (
  'couvreur-urgence-fuite-tarifs-pieges',
  'Couvreur d''urgence : tarifs, pièges et bonnes pratiques 2026',
  'Fuite de toiture la nuit ? Voici les vrais tarifs d''un couvreur d''urgence et comment éviter les arnaques.',
  $$
<p>Une fuite de toiture est <strong>l'urgence numéro 1</strong> en bâtiment. L'eau qui s'infiltre détruit isolation, plafond, électricité. Mais attention : c'est aussi l'occasion privilégiée des <strong>arnaqueurs</strong>. Voici comment réagir intelligemment.</p>

<h2>Que faire IMMÉDIATEMENT en cas de fuite ?</h2>

<h3>Étape 1 : Limiter les dégâts (0-30 min)</h3>
<ul>
  <li><strong>Couper l'électricité</strong> si l'eau coule près de prises ou luminaires</li>
  <li>Placer des <strong>seaux ou bassines</strong> sous la fuite</li>
  <li>Protéger meubles avec bâches plastique</li>
  <li>Si plafond bombé : faire un <strong>petit trou</strong> avec un tournevis pour libérer l'eau (évite l'effondrement)</li>
  <li>Prendre des <strong>photos</strong> de tous les dégâts (assurance)</li>
</ul>

<h3>Étape 2 : Contacter votre assurance (30 min - 2h)</h3>
<ul>
  <li>Appel à votre assurance habitation (numéro souvent 24/7)</li>
  <li>Demandez s'ils ont un <strong>couvreur agréé</strong> à envoyer</li>
  <li>Si oui : intervention prise en charge directement</li>
  <li>Sinon : déclaration sinistre dans les 5 jours</li>
</ul>

<h3>Étape 3 : Appeler un couvreur d'urgence (si nécessaire)</h3>
<ul>
  <li>Évitez les premiers résultats Google Ads "dépanneur 24/7"</li>
  <li>Appelez 2-3 couvreurs locaux</li>
  <li>Demandez systématiquement le <strong>devis avant intervention</strong></li>
  <li>Vérifiez SIREN et assurance avant signature</li>
</ul>

<h2>Combien coûte une intervention d'urgence ?</h2>

<h3>Tarifs horaires</h3>
<ul>
  <li><strong>Couvreur en journée (8h-18h)</strong> : 45-70 €/h</li>
  <li><strong>Couvreur en soirée (18h-22h)</strong> : 70-110 €/h (majoration +50 %)</li>
  <li><strong>Couvreur la nuit (22h-7h)</strong> : 120-180 €/h (majoration +100-150 %)</li>
  <li><strong>Week-end / jour férié</strong> : majoration +50-100 %</li>
</ul>

<h3>Forfaits courants</h3>
<ul>
  <li><strong>Déplacement urgent</strong> : 60-150 €</li>
  <li><strong>Réparation bâche provisoire</strong> : 150-400 €</li>
  <li><strong>Réparation 5-10 tuiles cassées</strong> : 200-500 €</li>
  <li><strong>Réparation cheminée fuyante</strong> : 300-800 €</li>
  <li><strong>Réparation noue / faîtage</strong> : 400-1 200 €</li>
</ul>

<blockquote>
  <p><strong>Prix anormal :</strong> méfiez-vous des devis &gt; 2 000 € pour une simple intervention urgence. Demandez systématiquement 2-3 devis sauf risque imminent (effondrement).</p>
</blockquote>

<h2>Les 5 arnaques fréquentes</h2>

<h3>1. La sur-facturation</h3>
<p>"Tout le toit est à refaire" pour 30 000 € alors que 3 tuiles cassées coûtent 400 €. Demandez un <strong>diagnostic écrit</strong> + photos.</p>

<h3>2. Le faux RGE</h3>
<p>Logo affiché mais inexistant. Vérifiez sur <strong>france-renov.gouv.fr</strong>.</p>

<h3>3. La facturation des "frais cachés"</h3>
<p>Échelle, monte-charge, sécurité, vidage gravats, TVA... Demandez un <strong>devis TTC tout compris</strong>.</p>

<h3>4. La signature sous pression</h3>
<p>"Signez maintenant ou je pars." Refusez. Aucune urgence ne justifie une signature impulsive sans devis.</p>

<h3>5. L'acompte excessif</h3>
<p>Maximum légal : <strong>30 % d'acompte</strong>. Tout dépassement = signal d'arnaque.</p>

<h2>Quand votre assurance habitation prend-elle en charge ?</h2>
<ul>
  <li><strong>Tempête / grêle</strong> : OUI si arrêté catastrophe naturelle ou vent &gt; 100 km/h</li>
  <li><strong>Vétusté</strong> : NON (rénovation entretien à votre charge)</li>
  <li><strong>Vol / vandalisme</strong> : OUI</li>
  <li><strong>Dégât des eaux</strong> : OUI (avec franchise)</li>
  <li><strong>Glissement de tuile vétuste</strong> : NON</li>
</ul>

<h2>Comment éviter les fuites futures ?</h2>
<ul>
  <li><strong>Visite annuelle</strong> de votre couvreur : 100-200 € (économies massives)</li>
  <li>Nettoyage des chéneaux 2×/an</li>
  <li>Surveillance des tuiles déplacées après tempêtes</li>
  <li>Vérification cheminée tous les 3-5 ans</li>
  <li>Anticipation rénovation : durée de vie tuiles 30-50 ans, zinc 50-70 ans</li>
</ul>

<h2>FAQ urgence toiture 2026</h2>

<h3>Combien de temps prend une intervention ?</h3>
<p>Diagnostic : 30 min. Bâchage provisoire : 1-2h. Réparation définitive : 2h à 1 jour selon ampleur.</p>

<h3>Mon assurance peut-elle envoyer un couvreur ?</h3>
<p>Souvent oui (numéro assistance 24/7). Privilégiez cette option : pas d'avance d'argent.</p>

<h3>Que faire si l'eau a tout abîmé en bas ?</h3>
<p>Photos, déclaration assurance, expertise. Couvreur ne couvre que le toit. Plâtrier/peintre pour le reste.</p>

<h2>Trouvez un couvreur de confiance</h2>
<p>Sur Bisecco, tous les <a href="/metiers/couvreur">couvreurs</a> sont <strong>vérifiés SIREN</strong>. Par exemple un <a href="/metiers/couvreur/cannes">couvreur à Cannes</a> ou un <a href="/metiers/couvreur/meaux">couvreur à Meaux</a>.</p>

<p><em>Article publié le 17 août 2026 par l'équipe Bisecco.</em></p>
  $$,
  'https://images.unsplash.com/photo-1632935190508-c1d68fea449e?w=1280&h=720&fit=crop',
  'Couvreur sur toiture en intervention d''urgence',
  'L''équipe Bisecco',
  '8 min',
  'published',
  '2026-08-17 10:00:00+00',
  'Couvreur d''urgence 2026 : tarifs et pièges',
  'Fuite toiture en urgence ? Vrais tarifs couvreur 24/7, comment éviter arnaques, assurance. Guide complet.'
)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, excerpt = EXCLUDED.excerpt, content_html = EXCLUDED.content_html, published_at = EXCLUDED.published_at, updated_at = NOW();


-- ─── Article 18 · Semaine 9 (Jeu 20 août) ─────────────────────────────
INSERT INTO public.blog_articles (slug, title, excerpt, content_html, image_url, image_alt, author, read_time, status, published_at, meta_title, meta_description)
VALUES (
  'plombier-urgence-nuit-eviter-arnaques-2026',
  'Plombier de nuit : éviter les arnaques en 2026',
  'Fuite d''eau à 2h du matin ? Les vrais tarifs d''un plombier de nuit et les 7 arnaques à connaître.',
  $$
<p>La <strong>plomberie d'urgence</strong> est le secteur n°1 des arnaques en France. La DGCCRF reçoit plus de 10 000 plaintes par an pour "plombier-arnaque". Voici comment garder votre porte-monnaie en sécurité.</p>

<h2>Réflexes IMMÉDIATS en cas de fuite</h2>

<h3>1. Couper l'eau (5 secondes)</h3>
<ul>
  <li>Vanne générale (entrée du logement) : tournez à FOND</li>
  <li>Vanne sous évier si fuite localisée</li>
  <li>Vanne d'eau chaude si chauffe-eau</li>
</ul>

<h3>2. Couper l'électricité (proximité fuite)</h3>
<p>Disjoncteur secteur concerné. Évite court-circuit dangereux.</p>

<h3>3. Limiter dégâts</h3>
<ul>
  <li>Récupérer eau avec seaux/serpillières</li>
  <li>Photos pour assurance</li>
  <li>Prévenir voisins du dessous</li>
</ul>

<h3>4. Évaluez l'urgence</h3>
<ul>
  <li><strong>VRAIE urgence</strong> (eau qui inonde) : intervention nuit</li>
  <li><strong>FAUSSE urgence</strong> (fuite goutte à goutte) : attendre le lendemain</li>
</ul>

<h2>Combien coûte un plombier de nuit ?</h2>

<h3>Tarifs horaires honnêtes</h3>
<ul>
  <li><strong>Plombier journée (8h-18h)</strong> : 45-70 €/h</li>
  <li><strong>Soirée (18h-22h)</strong> : 75-100 €/h</li>
  <li><strong>Nuit (22h-7h)</strong> : 110-180 €/h</li>
  <li><strong>Week-end / férié</strong> : majoration +50-100 %</li>
</ul>

<h3>Forfaits classiques (nuit/week-end)</h3>
<ul>
  <li><strong>Déplacement seul (sans réparation)</strong> : 60-150 €</li>
  <li><strong>Débouchage évier / WC</strong> : 150-350 €</li>
  <li><strong>Réparation fuite robinet</strong> : 100-250 €</li>
  <li><strong>Remplacement joint chasse d'eau</strong> : 80-200 €</li>
  <li><strong>Recherche fuite invisible</strong> : 200-500 €</li>
  <li><strong>Réparation chauffe-eau</strong> : 200-600 €</li>
</ul>

<blockquote>
  <p>Si on vous demande <strong>plus de 500 € pour un simple débouchage</strong> ou <strong>plus de 1 000 € pour une réparation classique</strong> = arnaque. Sortez le téléphone et appelez la DGCCRF.</p>
</blockquote>

<h2>Les 7 arnaques fréquentes</h2>

<h3>1. Le faux "tour de plombier" qui découvre des "problèmes"</h3>
<p>Une simple fuite devient "tuyaux toute la maison à changer" : 8 000 €. Demandez TOUJOURS un <strong>2ème avis</strong> avant.</p>

<h3>2. La facturation de "matériel cher inutile"</h3>
<p>Joints à 50 € la pièce, vis à 5 €... Vérifiez sur internet AVANT de payer.</p>

<h3>3. Le devis verbal puis facture 5x plus chère</h3>
<p>Exigez TOUJOURS un devis écrit AVANT intervention. C'est obligatoire au-delà de 150 € (Loi Hamon).</p>

<h3>4. La pression à la signature</h3>
<p>"Si vous ne signez pas, je pars." Laissez-le partir : vous gagnez du temps. Aucune urgence ne justifie une signature sous pression.</p>

<h3>5. Le paiement cash uniquement</h3>
<p>Refus de carte = pas de traçabilité = arnaque probable. Demandez une <strong>facture</strong> avec SIREN.</p>

<h3>6. Le "diagnostic complet" payant</h3>
<p>Facture 200 € pour avoir juste regardé la fuite. Demandez le <strong>prix du déplacement</strong> au téléphone.</p>

<h3>7. La fausse entreprise reconnue (TOUT 24/7)</h3>
<p>"Plombier Cannes 24/7" : entreprise à Lyon qui sous-traite à n'importe qui. Choisissez un plombier <strong>local vérifié</strong>.</p>

<h2>Vos droits en cas d'arnaque</h2>

<h3>Délai de rétractation</h3>
<p>Si signature à domicile = <strong>14 jours pour annuler</strong> (Loi Hamon). Sauf si "exécution immédiate" demandée par écrit.</p>

<h3>Recours</h3>
<ul>
  <li><strong>SignalConso.gouv.fr</strong> : DGCCRF signalement gratuit</li>
  <li><strong>Médiateur consommation</strong> : avant procès</li>
  <li><strong>Tribunal proximité</strong> : si &lt; 5 000 €</li>
  <li><strong>Avocat</strong> : si &gt; 5 000 € (assurance protection juridique souvent incluse)</li>
</ul>

<h3>Demande de remboursement</h3>
<p>Lettre recommandée AR avec :</p>
<ul>
  <li>Détail des prix abusifs</li>
  <li>Demande de remboursement partiel</li>
  <li>Délai 15 jours</li>
  <li>Menace de poursuites</li>
</ul>

<h2>Comment éviter cette situation ?</h2>
<ul>
  <li>Repérez AVANT 2-3 plombiers locaux de confiance (Bisecco)</li>
  <li>Notez leur numéro dans téléphone "PLOMBIER URGENCE"</li>
  <li>Entretien annuel chaudière + chauffe-eau (50 % des urgences évitées)</li>
  <li>Robinet d'arrêt général facilement accessible</li>
  <li>Détecteur de fuite (50-200 €) qui coupe l'eau automatiquement</li>
</ul>

<h2>FAQ plombier urgence 2026</h2>

<h3>Mon assurance prend-elle en charge ?</h3>
<p>Oui pour les dégâts des eaux. Non pour la réparation du tuyau. Franchise habituelle : 150-300 €.</p>

<h3>Un plombier doit-il être RGE ?</h3>
<p>Non en urgence. RGE uniquement pour bénéficier des aides (PAC, chauffe-eau thermo).</p>

<h3>Je n'ai pas de plombier de confiance, que faire ?</h3>
<p>Bisecco filtre tous les artisans par SIREN actif + permet de voir les avis. Cherchez plombier + votre ville.</p>

<h2>Trouvez votre plombier vérifié SIREN</h2>
<p>Sur Bisecco, consultez des <a href="/metiers/plombier">plombiers vérifiés</a> près de chez vous. Par exemple un <a href="/metiers/plombier/cannes">plombier à Cannes</a> ou un <a href="/metiers/plombier/meaux">plombier à Meaux</a>.</p>

<p><em>Article publié le 20 août 2026 par l'équipe Bisecco.</em></p>
  $$,
  'https://images.unsplash.com/photo-1607400201515-c2c41c07d307?w=1280&h=720&fit=crop',
  'Plombier en intervention de nuit',
  'L''équipe Bisecco',
  '9 min',
  'published',
  '2026-08-20 10:00:00+00',
  'Plombier de nuit 2026 : éviter les arnaques',
  'Plombier urgence nuit : vrais tarifs 110-180 €/h, 7 arnaques fréquentes, vos recours. Guide complet 2026.'
)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, excerpt = EXCLUDED.excerpt, content_html = EXCLUDED.content_html, published_at = EXCLUDED.published_at, updated_at = NOW();


-- ─── Article 19 · Semaine 10 (Lun 24 août) ────────────────────────────
INSERT INTO public.blog_articles (slug, title, excerpt, content_html, image_url, image_alt, author, read_time, status, published_at, meta_title, meta_description)
VALUES (
  'comment-lire-devis-travaux-2026',
  'Comment bien lire un devis de travaux en 2026',
  'Tout ce qu''un devis doit contenir : mentions obligatoires, prix HT/TTC, conditions. Les 8 points à vérifier impérativement.',
  $$
<p>Un devis de travaux est un <strong>contrat juridique</strong>. Si l'artisan ne respecte pas ce qui y est écrit, vous pouvez l'attaquer. Mais encore faut-il savoir <strong>le lire correctement</strong>. Voici le guide complet.</p>

<h2>Mentions OBLIGATOIRES d'un devis (Loi 2026)</h2>

<h3>Sur l'artisan</h3>
<ul>
  <li>Nom et raison sociale complète</li>
  <li>Adresse du siège social</li>
  <li>Numéro SIREN</li>
  <li>Numéro de TVA intracommunautaire</li>
  <li>Forme juridique (SARL, EURL, EI, etc.)</li>
  <li>Capital social (si société)</li>
  <li>Numéro RCS ou RM</li>
  <li>Assurance décennale (obligatoire si bâtiment) : nom assureur + n° police</li>
  <li>Certification RGE le cas échéant</li>
</ul>

<h3>Sur le client</h3>
<ul>
  <li>Nom complet</li>
  <li>Adresse de facturation</li>
  <li>Adresse du chantier (si différente)</li>
</ul>

<h3>Sur le devis lui-même</h3>
<ul>
  <li>Date d'établissement</li>
  <li>Numéro de devis</li>
  <li>Durée de validité (en général 1-3 mois)</li>
  <li>Date prévisionnelle des travaux</li>
  <li>Durée prévisionnelle des travaux</li>
</ul>

<h2>Détail des travaux : les vrais points à vérifier</h2>

<h3>Description précise (NOM PAS "divers")</h3>
<ul>
  <li>Type de matériau (marque, référence si possible)</li>
  <li>Quantité (m², ml, unité)</li>
  <li>Prix unitaire HT</li>
  <li>Total ligne HT</li>
</ul>

<h3>Détail des prestations</h3>
<ul>
  <li>Fourniture (matériel)</li>
  <li>Pose / main d'œuvre</li>
  <li>Évacuation gravats</li>
  <li>Échafaudage / sécurité (si applicable)</li>
  <li>Nettoyage fin chantier</li>
</ul>

<h2>Prix : HT, TVA, TTC — décryptage</h2>

<h3>Total HT</h3>
<p>Hors taxes = prix sans TVA. Référence pour calculer TVA.</p>

<h3>Taux de TVA applicables</h3>
<ul>
  <li><strong>20 %</strong> : taux normal (construction neuve, surface non habitable)</li>
  <li><strong>10 %</strong> : taux intermédiaire (rénovation logement &gt; 2 ans)</li>
  <li><strong>5,5 %</strong> : taux réduit (rénovation énergétique éligible)</li>
</ul>

<h3>Total TTC</h3>
<p>= HT + TVA = montant à payer. C'est ce qui doit être bien visible.</p>

<blockquote>
  <p>Le devis doit indiquer <strong>HT + TVA + TTC ligne par ligne</strong>. Si vous voyez juste un montant global TTC, demandez le détail.</p>
</blockquote>

<h2>Conditions de paiement</h2>

<h3>Acompte</h3>
<ul>
  <li><strong>Maximum légal : 30 %</strong></li>
  <li>Au-delà = signal alerte (sauf commande matériel spécifique)</li>
  <li>Demandez une <strong>facture d'acompte</strong> séparée</li>
</ul>

<h3>Échéancier</h3>
<ul>
  <li>2 ou 3 paiements répartis</li>
  <li>Lié à l'<strong>avancement réel</strong> du chantier (pas dates fixes)</li>
  <li>Exemple : 30 % à signature / 40 % à mi-chantier / 30 % à réception</li>
</ul>

<h3>Modes de paiement acceptés</h3>
<ul>
  <li>Chèque : standard</li>
  <li>Virement : standard</li>
  <li>Carte : pour les artisans modernes</li>
  <li><strong>Espèces : SEULEMENT &lt; 1 000 €</strong> (limite légale)</li>
</ul>

<h2>Délais et garanties</h2>

<h3>Délai d'exécution</h3>
<p>Doit être explicite : "Démarrage J+30 après signature, durée 15 jours ouvrés". Pénalités de retard à négocier (50-200 €/jour si dépassement).</p>

<h3>Garanties applicables</h3>
<ul>
  <li><strong>Garantie de parfait achèvement</strong> : 1 an</li>
  <li><strong>Garantie biennale</strong> : 2 ans (équipements dissociables)</li>
  <li><strong>Garantie décennale</strong> : 10 ans (gros œuvre)</li>
</ul>

<h2>Les 8 points NON négociables</h2>
<ol>
  <li>SIREN visible et vérifiable (verify-siren.fr)</li>
  <li>Assurance décennale (nom + numéro)</li>
  <li>Prix HT + TVA + TTC ligne par ligne</li>
  <li>Description détaillée (pas "divers")</li>
  <li>Acompte ≤ 30 %</li>
  <li>Délai d'exécution chiffré</li>
  <li>Validité du devis (1-3 mois)</li>
  <li>Signature du client + mention "Bon pour accord"</li>
</ol>

<h2>Drapeaux rouges (refusez le devis si...)</h2>
<ul>
  <li>Pas de SIREN ou SIREN non vérifié</li>
  <li>Pas d'adresse postale</li>
  <li>Pas d'assurance décennale mentionnée</li>
  <li>Acompte demandé &gt; 30 %</li>
  <li>Pression pour signer "maintenant"</li>
  <li>Prix très bas (-30 % par rapport au marché) = arnaque ou travail au noir</li>
  <li>Prix très élevé (+50 % marché) sans justification</li>
  <li>Mention "selon estimation à confirmer" sur lignes principales</li>
</ul>

<h2>Comparaison de plusieurs devis</h2>
<p>Demandez TOUJOURS <strong>3 devis</strong> pour les travaux &gt; 1 000 €. Comparez :</p>
<ul>
  <li>Prix au m² ou unité</li>
  <li>Qualité des matériaux proposés</li>
  <li>Délais</li>
  <li>Garanties</li>
  <li>Avis clients</li>
</ul>

<p>Le moins cher n'est pas toujours le meilleur. Le plus cher non plus. Préférez le <strong>devis le plus détaillé et complet</strong>.</p>

<h2>FAQ devis 2026</h2>

<h3>Le devis est-il payant ?</h3>
<p>Non en théorie, mais certains artisans facturent le déplacement pour devis sur site (30-80 €). Précisez par téléphone.</p>

<h3>Combien de temps pour signer ?</h3>
<p>Ne signez jamais le jour même. Prenez 24-48h minimum. Si l'artisan refuse, c'est mauvais signe.</p>

<h3>Puis-je modifier un devis après signature ?</h3>
<p>Oui, par <strong>avenant écrit</strong> signé par les 2 parties. Tout changement verbal n'a aucune valeur.</p>

<h2>Trouvez des artisans transparents sur leurs devis</h2>
<p>Sur Bisecco, tous les artisans sont <strong>vérifiés SIREN</strong>. Demandez plusieurs devis. Par exemple un <a href="/metiers/plombier/cannes">plombier à Cannes</a> ou un <a href="/metiers/macon/meaux">maçon à Meaux</a>.</p>

<p><em>Article publié le 24 août 2026 par l'équipe Bisecco.</em></p>
  $$,
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1280&h=720&fit=crop',
  'Devis de travaux signé et calculatrice',
  'L''équipe Bisecco',
  '9 min',
  'published',
  '2026-08-24 10:00:00+00',
  'Comment lire un devis de travaux 2026',
  'Lire un devis travaux : mentions obligatoires, prix HT/TTC, 8 points à vérifier, drapeaux rouges. Guide.'
)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, excerpt = EXCLUDED.excerpt, content_html = EXCLUDED.content_html, published_at = EXCLUDED.published_at, updated_at = NOW();


-- ─── Article 20 · Semaine 10 (Jeu 27 août) ────────────────────────────
INSERT INTO public.blog_articles (slug, title, excerpt, content_html, image_url, image_alt, author, read_time, status, published_at, meta_title, meta_description)
VALUES (
  'assurance-decennale-artisan-2026',
  'Assurance décennale d''un professionnel : tout comprendre en 2026',
  'L''assurance décennale est obligatoire pour vos travaux. Comment la vérifier, quels travaux sont couverts, quels recours.',
  $$
<p>L'<strong>assurance décennale</strong> est l'une des garanties les plus importantes en bâtiment. Elle protège pendant <strong>10 ans</strong> contre tout vice grave. Sans elle, vous risquez gros. Voici tout ce qu'il faut savoir.</p>

<h2>Qu'est-ce que l'assurance décennale ?</h2>
<p>Créée par la <strong>loi Spinetta de 1978</strong>, cette assurance est <strong>obligatoire</strong> pour tout artisan du bâtiment. Elle couvre :</p>
<ul>
  <li>Les <strong>dommages compromettant la solidité</strong> de l'ouvrage</li>
  <li>Les <strong>dommages rendant impropre à sa destination</strong> (ex: infiltration permanente, fissures structurelles)</li>
</ul>
<p>Durée : <strong>10 ans</strong> à compter de la réception des travaux.</p>

<h2>Qui DOIT avoir une décennale ?</h2>

<h3>Métiers concernés</h3>
<ul>
  <li>Maçon</li>
  <li>Charpentier</li>
  <li>Couvreur</li>
  <li>Plombier</li>
  <li>Électricien</li>
  <li>Chauffagiste</li>
  <li>Menuisier (extérieur)</li>
  <li>Carreleur</li>
  <li>Peintre (façade extérieure)</li>
  <li>Étancheur</li>
  <li>Isoleur</li>
  <li>Terrassier</li>
</ul>

<h3>Métiers NON concernés (décennale optionnelle)</h3>
<ul>
  <li>Peintre intérieur uniquement</li>
  <li>Décorateur</li>
  <li>Coiffeur, esthéticien</li>
  <li>Service à la personne</li>
</ul>

<h2>Comment VÉRIFIER l'assurance d'un artisan ?</h2>

<h3>Méthode 1 : demander l'attestation</h3>
<p>L'artisan DOIT vous fournir son <strong>attestation d'assurance décennale</strong> avant signature du devis. Sur cette attestation :</p>
<ul>
  <li>Nom du professionnel</li>
  <li>Nom de l'assureur</li>
  <li>Numéro de police</li>
  <li>Période de validité (renouvelée tous les ans)</li>
  <li>Liste des activités couvertes</li>
</ul>

<h3>Méthode 2 : vérifier directement auprès de l'assureur</h3>
<p>Appelez l'assureur (numéro sur l'attestation) pour confirmer que le contrat est ACTIF. Ça prend 5 minutes.</p>

<h3>Méthode 3 : vérifier la cohérence des activités</h3>
<p>Si vous faites refaire la toiture, l'attestation doit mentionner "couverture" et non juste "peinture intérieure".</p>

<h2>Que faire si l'artisan refuse de la fournir ?</h2>
<ul>
  <li>NE SIGNEZ PAS le devis</li>
  <li>Cherchez un autre artisan</li>
  <li>C'est un signal d'alerte ROUGE (souvent travail au noir ou société radiée)</li>
</ul>

<h2>Que couvre EXACTEMENT la décennale ?</h2>

<h3>Couvert</h3>
<ul>
  <li>Effondrement (mur, plancher, toiture)</li>
  <li>Fissures structurelles importantes</li>
  <li>Infiltration permanente (toiture, façade)</li>
  <li>Affaissement du sol</li>
  <li>Défaut isolation thermique grave</li>
  <li>Défaut d'étanchéité</li>
  <li>Non-conformité chauffage central rendant maison invivable</li>
</ul>

<h3>NON couvert</h3>
<ul>
  <li>Petits défauts esthétiques (peinture qui s'écaille)</li>
  <li>Usure normale</li>
  <li>Mauvaise utilisation par le propriétaire</li>
  <li>Catastrophes naturelles (assurance habitation)</li>
  <li>Dégâts liés à un autre artisan</li>
  <li>Travaux non réalisés par l'artisan assuré</li>
</ul>

<h2>Comment activer la décennale en cas de problème ?</h2>

<h3>Étape 1 : Lettre recommandée à l'artisan</h3>
<ul>
  <li>Description précise du défaut</li>
  <li>Photos datées</li>
  <li>Demande de réparation sous 30 jours</li>
  <li>Mention de la garantie décennale</li>
</ul>

<h3>Étape 2 : Lettre à l'assureur de l'artisan</h3>
<p>Si l'artisan ne réagit pas :</p>
<ul>
  <li>Copie de votre lettre à l'artisan</li>
  <li>Attestation décennale (numéro)</li>
  <li>Factures et devis originaux</li>
  <li>Expertise (souvent demandée)</li>
</ul>

<h3>Étape 3 : Expertise</h3>
<p>L'assureur mandate un <strong>expert</strong> qui visite le chantier et établit un rapport. Coût : pris en charge par l'assurance si décennale active.</p>

<h3>Étape 4 : Indemnisation ou réparation</h3>
<ul>
  <li>Soit l'assureur paie pour vous faire faire les travaux</li>
  <li>Soit l'artisan vient réparer (rare en pratique)</li>
  <li>Soit indemnisation forfaitaire</li>
</ul>

<h2>Cas où votre demande peut être REFUSÉE</h2>
<ul>
  <li>Plus de 10 ans depuis la réception du chantier</li>
  <li>Pas d'attestation reçue à la signature (preuve d'achat absente)</li>
  <li>Défaut considéré "non décennal" (esthétique, fonctionnement mineur)</li>
  <li>Pas d'expertise contradictoire</li>
  <li>L'artisan a fait faillite (mais l'assureur reste responsable !)</li>
</ul>

<blockquote>
  <p><strong>Si l'artisan a fait faillite</strong> : l'assureur reste obligé d'indemniser pendant 10 ans. Contactez directement l'assurance.</p>
</blockquote>

<h2>Différence avec les autres garanties</h2>

<h3>Garantie de parfait achèvement (1 an)</h3>
<p>Couvre tous défauts signalés à la réception ou dans l'année qui suit. Travaux esthétiques compris.</p>

<h3>Garantie biennale (2 ans)</h3>
<p>Couvre les <strong>éléments d'équipement dissociables</strong> (volets, robinets, radiateurs).</p>

<h3>Garantie décennale (10 ans)</h3>
<p>Le gros œuvre + équipements indissociables (chauffage central, sanitaires intégrés).</p>

<h2>Comment trouver un artisan bien assuré ?</h2>
<ul>
  <li>Vérifiez son SIREN sur <strong>verify-siren.fr</strong></li>
  <li>Demandez l'attestation décennale AVANT signature</li>
  <li>Préférez des artisans <strong>vérifiés</strong> via plateformes</li>
  <li>Vérifiez les avis clients</li>
</ul>

<h2>FAQ décennale 2026</h2>

<h3>Combien coûte une décennale pour un artisan ?</h3>
<p>500 € à 5 000 €/an selon le métier et le chiffre d'affaires. C'est cher : c'est pourquoi certains arnaqueurs ne s'assurent pas.</p>

<h3>Si l'artisan refuse de me donner son attestation ?</h3>
<p>Aucune exception : c'est <strong>OBLIGATOIRE</strong> avant signature. Refusez le devis.</p>

<h3>Combien de temps après les travaux puis-je faire jouer la décennale ?</h3>
<p>10 ans à partir de la <strong>date de réception</strong> (procès-verbal signé). Date à conserver précieusement.</p>

<h3>Si je n'ai pas signé de procès-verbal de réception ?</h3>
<p>La réception est "tacite" (vous avez emménagé, par exemple). Plus difficile à prouver mais possible.</p>

<h2>Trouvez des artisans vérifiés et assurés</h2>
<p>Sur Bisecco, vous pouvez consulter l'attestation décennale de chaque <a href="/metiers">professionnel</a> directement sur son profil. Par exemple, un <a href="/metiers/macon/cannes">maçon à Cannes</a> ou un <a href="/metiers/plombier/meaux">plombier à Meaux</a>.</p>

<p><em>Article publié le 27 août 2026 par l'équipe Bisecco. Dernier article du calendrier été 2026 !</em></p>
  $$,
  'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1280&h=720&fit=crop',
  'Contrat d''assurance décennale signé par un artisan',
  'L''équipe Bisecco',
  '10 min',
  'published',
  '2026-08-27 10:00:00+00',
  'Assurance décennale 2026 : tout comprendre',
  'Assurance décennale : obligation, couverture, vérification, recours. Guide complet pour particuliers et artisans 2026.'
)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, excerpt = EXCLUDED.excerpt, content_html = EXCLUDED.content_html, published_at = EXCLUDED.published_at, updated_at = NOW();


-- ─── Vérification finale ──────────────────────────────────────────────
SELECT
  status,
  COUNT(*) AS nb_articles
FROM public.blog_articles
GROUP BY status;

SELECT slug, published_at
FROM public.blog_articles
WHERE status = 'published' AND published_at >= NOW()
ORDER BY published_at ASC;
