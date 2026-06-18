-- =====================================================================
-- 028 — Seed 5 articles SEO premium dans la VRAIE table blog_articles
-- =====================================================================
-- La migration 027 utilisait par erreur "blog_posts" (table inexistante côté
-- code). Le vrai code de l'app lit "blog_articles" (créée par migration 010).
--
-- Ce SQL insère les 5 articles dans la bonne table.
--
-- À appliquer dans Supabase Dashboard → SQL Editor.
-- =====================================================================

-- Article 1 — Combien coûte un plombier
INSERT INTO public.blog_articles
  (slug, title, excerpt, content_html, image_url, image_alt, author, read_time, status, published_at, meta_title, meta_description)
VALUES (
  'combien-coute-plombier-2026',
  'Combien coûte un plombier en 2026 ? Tarifs, devis et urgences',
  'Guide complet des tarifs plombier 2026 : prix horaire, déplacements, urgences week-end, fourchette par type d''intervention. Comparez avant de signer.',
  $$
<p><strong>Vous cherchez un plombier mais redoutez la facture salée ?</strong> En France, les tarifs varient du simple au triple selon la zone, l''heure, et le type d''intervention. Voici un guide transparent sur ce qu''il faut savoir avant d''appeler.</p>

<h2>Combien coûte un plombier à l''heure en 2026 ?</h2>
<p>En moyenne, un plombier français facture entre <strong>45 € et 90 € de l''heure</strong>, hors déplacement. Les écarts dépendent de plusieurs critères :</p>
<ul>
  <li><strong>Zone géographique</strong> : Paris et Côte d''Azur sont 30 à 50 % plus chers que la province</li>
  <li><strong>Expérience</strong> : un plombier RGE ou avec 10+ ans d''ancienneté facture 60-90 €/h</li>
  <li><strong>Type d''intervention</strong> : un débouchage simple est moins cher qu''une recherche de fuite</li>
  <li><strong>Saison</strong> : tarifs majorés en hiver (gel = pics d''appels)</li>
</ul>

<h3>Le déplacement, c''est combien ?</h3>
<p>Le déplacement coûte généralement entre <strong>30 € et 80 €</strong>, souvent forfaitaire dans un rayon de 20-30 km. Au-delà, on ajoute le kilométrage à 0,50-1 €/km.</p>
<p>Astuce : certains plombiers offrent le déplacement si l''intervention dépasse 1h. <strong>Demandez avant.</strong></p>

<h2>Combien coûtent les interventions courantes ?</h2>

<h3>1. Fuite d''eau (le plus demandé)</h3>
<ul>
  <li><strong>Fuite simple sur robinetterie</strong> : 80-150 €</li>
  <li><strong>Fuite sur canalisation apparente</strong> : 150-300 €</li>
  <li><strong>Recherche de fuite encastrée</strong> : 250-600 € (avec caméra thermique)</li>
  <li><strong>Réparation fuite encastrée</strong> : 400-1 500 € selon casse</li>
</ul>

<h3>2. Débouchage</h3>
<ul>
  <li><strong>WC bouché simple</strong> : 80-180 €</li>
  <li><strong>Évier ou lavabo</strong> : 100-200 €</li>
  <li><strong>Canalisation principale (hydrocurage)</strong> : 250-600 €</li>
</ul>

<h3>3. Installation</h3>
<ul>
  <li><strong>Pose chauffe-eau électrique</strong> (matériel + pose) : 600-1 500 €</li>
  <li><strong>Pose chaudière gaz à condensation</strong> : 3 500-7 000 €</li>
  <li><strong>Remplacement WC</strong> : 300-800 € (pose seule : 150-300 €)</li>
  <li><strong>Rénovation complète salle de bain</strong> : 4 000-12 000 €</li>
</ul>

<h2>Urgence : les tarifs explosent</h2>
<p>Un plombier d''urgence en pleine nuit ou un dimanche peut facturer <strong>50 à 100 % de plus</strong>. Voici les majorations légales courantes :</p>
<ul>
  <li>Soir (19h-8h) : +25 à +50 %</li>
  <li>Samedi : +25 %</li>
  <li>Dimanche et jours fériés : +50 à +100 %</li>
  <li>Nuit (22h-6h) un weekend : <strong>jusqu''à +100 %</strong></li>
</ul>

<blockquote>
  <p><strong>Attention aux arnaques.</strong> Méfiez-vous des "plombiers d''urgence" qui annoncent "à partir de 39 €" sur des pubs Google sponsorisées. C''est presque toujours un appât. Une fois sur place, la facture grimpe à 800-2 000 €.</p>
</blockquote>

<h3>Comment éviter l''arnaque ?</h3>
<ol>
  <li><strong>Demandez un devis écrit AVANT toute intervention</strong> (légalement obligatoire dès 150 €)</li>
  <li>Vérifiez son <strong>numéro SIREN</strong> sur societe.com (gratuit)</li>
  <li>Demandez l''attestation d''<strong>assurance décennale</strong></li>
  <li>Évitez les pubs Google sponsorisées pour les urgences (souvent des appâts)</li>
  <li>Privilégiez un plombier <strong>vérifié SIREN</strong> sur un annuaire comme Bisecco</li>
</ol>

<h2>Faut-il toujours demander 3 devis ?</h2>
<p>Pour les <strong>petits travaux</strong> (&lt; 500 €), 1 devis suffit souvent. Pour les <strong>gros chantiers</strong> (rénovation salle de bain, installation chaudière), <strong>3 devis sont indispensables</strong>.</p>
<p>Vous gagnerez en moyenne <strong>15 à 30 % sur le devis final</strong> en comparant.</p>

<h2>Comment trouver un bon plombier près de chez vous ?</h2>
<p>Sur Bisecco, tous les <a href="/metiers/plombier">plombiers du réseau sont vérifiés SIREN</a> et leur ancienneté est contrôlée automatiquement contre la base INSEE. Vous pouvez chercher un <a href="/metiers/plombier/cannes">plombier à Cannes</a>, un <a href="/metiers/plombier/meaux">plombier à Meaux</a>, ou dans n''importe quelle ville française.</p>
<p>La demande de devis est <strong>gratuite, sans engagement</strong>, et vous échangez en direct avec le pro — pas d''intermédiaire qui prend une commission.</p>

<h2>FAQ : vos questions sur les tarifs plombier</h2>

<h3>Le devis d''un plombier est-il gratuit ?</h3>
<p>Oui, dans 95 % des cas. Certains plombiers facturent le déplacement pour devis (30-60 €) s''ils doivent diagnostiquer une fuite non visible. C''est légal mais doit être annoncé en amont.</p>

<h3>Peut-on négocier le tarif d''un plombier ?</h3>
<p>Oui, surtout sur les gros chantiers. Présentez plusieurs devis, demandez un effort sur le tarif horaire ou la fourniture. Sur l''urgence, peu de marge.</p>

<h3>Quelle assurance protège des malfaçons ?</h3>
<p>L''<strong>assurance décennale obligatoire</strong> couvre 10 ans les défauts d''ouvrage. Demandez systématiquement l''attestation. Sans elle, vous n''avez aucun recours en cas de problème.</p>

<h3>Quand un plombier doit-il être RGE ?</h3>
<p>La certification <strong>RGE</strong> (Reconnu Garant de l''Environnement) est obligatoire pour bénéficier des aides énergétiques (MaPrimeRénov'', CEE) sur certains travaux : pompe à chaleur, chaudière haute performance, etc.</p>

<p><em>Article mis à jour le 10 juin 2026 par l''équipe Bisecco.</em></p>
  $$,
  'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=1280&h=720&fit=crop',
  'Plombier au travail · clé à molette et tuyauterie',
  'L''équipe Bisecco',
  '8 min',
  'published',
  '2026-06-10 10:00:00+00',
  'Tarif plombier 2026 : prix horaire, urgences et devis',
  'Tarifs plombier 2026 : 45-90€/h, déplacement 30-80€, urgences week-end. Comparez avant de signer.'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content_html = EXCLUDED.content_html,
  image_url = EXCLUDED.image_url,
  image_alt = EXCLUDED.image_alt,
  read_time = EXCLUDED.read_time,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  updated_at = NOW();


-- Article 2 — Comment vérifier un artisan
INSERT INTO public.blog_articles
  (slug, title, excerpt, content_html, image_url, image_alt, author, read_time, status, published_at, meta_title, meta_description)
VALUES (
  'comment-verifier-artisan-avant-devis',
  'Comment vérifier un artisan avant de signer un devis ?',
  'Les 6 vérifications essentielles avant de confier vos travaux : SIREN, assurance, avis, certifications. Évitez les arnaques en 10 minutes.',
  $$
<p>Vous allez confier plusieurs milliers d''euros à un artisan. <strong>10 minutes de vérification</strong> peuvent vous éviter des mois de cauchemar. Voici les 6 contrôles à faire avant toute signature.</p>

<h2>Pourquoi vérifier un artisan est crucial ?</h2>
<p>En France, on recense plus de <strong>30 000 plaintes par an</strong> contre des artisans pour travaux non conformes, abandons de chantier, ou disparition après acompte. Dans 80 % des cas, la victime n''avait <strong>pas vérifié les bases</strong>.</p>

<h2>Vérification 1 : Le SIREN (le plus important)</h2>
<p>Tout artisan professionnel a un <strong>numéro SIREN à 9 chiffres</strong> (parfois SIRET à 14 chiffres). Sans ça, c''est du travail au noir : aucun recours légal en cas de problème.</p>

<h3>Comment vérifier un SIREN ?</h3>
<ol>
  <li>Demandez le numéro à l''artisan (il doit figurer sur son devis)</li>
  <li>Allez sur <strong>societe.com</strong> ou <strong>annuaire-entreprises.data.gouv.fr</strong> (gratuit)</li>
  <li>Tapez le SIREN</li>
  <li>Vérifiez :
    <ul>
      <li>L''entreprise <strong>existe vraiment</strong></li>
      <li>Son activité correspond (code APE/NAF cohérent avec le métier)</li>
      <li>Elle est <strong>active</strong> (pas radiée)</li>
      <li>Sa date de création (ancienneté = stabilité)</li>
    </ul>
  </li>
</ol>

<blockquote>
  <p><strong>Astuce Bisecco :</strong> Tous les artisans inscrits sur notre plateforme sont <strong>vérifiés SIREN automatiquement</strong> contre la base INSEE. Vous n''avez rien à faire — c''est garanti dès l''inscription.</p>
</blockquote>

<h2>Vérification 2 : L''assurance décennale</h2>
<p>C''est l''assurance qui couvre les <strong>défauts graves d''ouvrage pendant 10 ans</strong> après réception des travaux. Elle est <strong>obligatoire</strong> pour tout artisan du bâtiment.</p>

<h3>Comment l''obtenir ?</h3>
<p>Demandez à l''artisan son <strong>attestation d''assurance décennale</strong> avant signature. Vérifiez :</p>
<ul>
  <li>Le nom de l''artisan ou de la société y figure</li>
  <li>L''attestation est <strong>valide à la date prévue des travaux</strong> (pas périmée)</li>
  <li>Les <strong>activités couvertes</strong> incluent vos travaux (un plombier non couvert pour l''électricité ne pourra pas faire de l''électricité)</li>
</ul>
<p>Une attestation périmée ou refusée = <strong>fuyez immédiatement</strong>.</p>

<h2>Vérification 3 : Les certifications (selon les travaux)</h2>
<p>Certains travaux nécessitent des qualifications spécifiques. Selon votre projet, vérifiez :</p>
<ul>
  <li><strong>RGE</strong> : obligatoire pour bénéficier de MaPrimeRénov'' et CEE sur la rénovation énergétique</li>
  <li><strong>Qualibat</strong> : qualification générale du bâtiment (sérieux, conformité)</li>
  <li><strong>Qualifelec</strong> : pour les électriciens</li>
  <li><strong>IRVE</strong> : obligatoire pour installer une borne de recharge véhicule</li>
  <li><strong>PGN ou PGP</strong> : pour le gaz et le propane</li>
</ul>

<h2>Vérification 4 : Les avis clients (vrais et vérifiés)</h2>
<p>Méfiez-vous des avis trop parfaits ou tous en 5 étoiles sur les sites perso. Privilégiez :</p>
<ul>
  <li>Les <strong>plateformes vérifiées</strong> (Bisecco, Google, Pages Jaunes)</li>
  <li>Les <strong>avis avec photos</strong> (preuve d''un vrai chantier)</li>
  <li>Les avis qui mentionnent des <strong>détails concrets</strong> (date, lieu, type de travaux)</li>
  <li>Les <strong>réponses du pro aux avis négatifs</strong> (professionnalisme)</li>
</ul>

<h2>Vérification 5 : Le devis détaillé</h2>
<p>Un devis sérieux fait <strong>au moins 2 pages</strong> et contient :</p>
<ul>
  <li>Identité complète de l''artisan (nom, SIREN, adresse)</li>
  <li>Identité du client</li>
  <li><strong>Détail ligne par ligne</strong> (pas "lot plomberie : 5 000 €" en une seule ligne)</li>
  <li>Type, marque, référence des matériaux</li>
  <li>Quantités et prix unitaires</li>
  <li>Temps estimé (h ou jours)</li>
  <li>Délais d''intervention</li>
  <li>Conditions de paiement (généralement 30 % à la commande, 70 % à la fin)</li>
  <li>Date de validité du devis (généralement 1-3 mois)</li>
  <li><strong>Mention "Devis gratuit" + signature</strong></li>
</ul>

<h2>Vérification 6 : La référence de chantiers similaires</h2>
<p>Demandez à voir <strong>2-3 photos de chantiers similaires</strong> (avant/après idéalement), ou mieux : les coordonnées d''un client récent que vous pouvez appeler.</p>
<p>Un bon artisan fier de son travail acceptera sans problème.</p>

<h2>Les 5 red flags qui doivent vous alerter</h2>
<ol>
  <li>Pas de SIREN ou refuse de le donner</li>
  <li>Devis non détaillé (un seul prix global)</li>
  <li>Demande un acompte &gt; 30 %</li>
  <li>Pression à signer immédiatement ("offre valable 24h !")</li>
  <li>Refuse de fournir l''attestation décennale</li>
</ol>

<h2>Trouvez un artisan vérifié près de chez vous</h2>
<p>Sur Bisecco, ces vérifications sont <strong>déjà faites pour vous</strong>. Tous les artisans inscrits ont :</p>
<ul>
  <li>SIREN contrôlé contre la base INSEE</li>
  <li>Profil validé manuellement par notre équipe</li>
  <li>Avis clients vérifiés</li>
  <li>Possibilité d''afficher leurs certifications (RGE, Qualibat, etc.)</li>
</ul>
<p>Cherchez un <a href="/metiers">artisan par métier</a>, par exemple un <a href="/metiers/plombier/cannes">plombier à Cannes</a> ou un <a href="/metiers/electricien/meaux">électricien à Meaux</a>.</p>

<p><em>Article publié le 8 juin 2026 par l''équipe Bisecco.</em></p>
  $$,
  'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1280&h=720&fit=crop',
  'Artisan vérifie un document professionnel',
  'L''équipe Bisecco',
  '6 min',
  'published',
  '2026-06-08 09:00:00+00',
  'Vérifier un artisan : SIREN, décennale, avis · Guide 2026',
  '6 vérifications avant de signer un devis artisan : SIREN, assurance décennale, certifications RGE. Évitez les arnaques.'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content_html = EXCLUDED.content_html,
  image_url = EXCLUDED.image_url,
  image_alt = EXCLUDED.image_alt,
  read_time = EXCLUDED.read_time,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  updated_at = NOW();


-- Article 3 — Devis travaux 7 pièges
INSERT INTO public.blog_articles
  (slug, title, excerpt, content_html, image_url, image_alt, author, read_time, status, published_at, meta_title, meta_description)
VALUES (
  'devis-travaux-7-pieges-eviter-2026',
  'Devis travaux : les 7 pièges à éviter en 2026',
  'Avant de signer un devis travaux, repérez ces 7 pièges classiques qui coûtent en moyenne 2 000 € à 15 000 € aux particuliers chaque année.',
  $$
<p>Un devis qui semble "honnête" peut cacher des <strong>milliers d''euros de frais imprévus</strong>. Voici les 7 pièges les plus courants en 2026, et comment les éviter.</p>

<h2>Piège 1 : Le devis "tout compris" sans détail</h2>
<p>Méfiance dès qu''un devis dit simplement "<strong>Rénovation salle de bain : 8 500 €</strong>" sans rien d''autre. C''est l''excuse rêvée pour ajouter "des extras" en cours de chantier.</p>
<p><strong>Le bon réflexe :</strong> exigez un devis avec <strong>ligne par ligne</strong>, matériaux et main d''œuvre séparés, marques et références précisées.</p>

<h2>Piège 2 : L''acompte exagéré</h2>
<p>La règle légale : <strong>maximum 30 % d''acompte à la signature</strong>, sauf pour les commandes de matériaux spécifiques.</p>
<p>Un artisan qui demande <strong>50 %, 70 % ou 100 % d''avance</strong> = signal d''alarme rouge. Vous risquez un abandon de chantier après encaissement.</p>
<p><strong>Le bon réflexe :</strong> proposez un échéancier en 3 fois : 30 % début, 40 % milieu de chantier (après validation visuelle d''une étape), 30 % à la réception finale.</p>

<h2>Piège 3 : Les matériaux "à fournir par le client"</h2>
<p>Certains artisans annoncent un devis bas car ils <strong>excluent les matériaux</strong>. Vous découvrez après que le carrelage de la salle de bain = 2 500 € supplémentaires.</p>
<p><strong>Le bon réflexe :</strong> exigez 2 devis : "tout compris" et "main d''œuvre seule". Comparez. Le piège est souvent dans le silence.</p>

<h2>Piège 4 : La mention "selon les surprises"</h2>
<p>Un devis bâtiment qui contient "<strong>Tarif horaire pour travaux supplémentaires : 75 €/h</strong>" sans plafond, c''est la garantie d''une facture qui double.</p>
<p>Une rénovation budgétée 12 000 € peut atteindre 25 000 € avec ces clauses élastiques.</p>
<p><strong>Le bon réflexe :</strong> demandez un plafond clair sur les "extras" (par exemple : "tout supplément &gt; 500 € fait l''objet d''un avenant écrit signé").</p>

<h2>Piège 5 : Le devis sans assurance mentionnée</h2>
<p>Un devis professionnel <strong>mentionne le numéro de l''assurance décennale</strong> en bas de page. Si rien n''est précisé, l''artisan n''est peut-être pas assuré.</p>
<p>En cas de malfaçon (carrelage qui se décolle, fuite cachée), <strong>vous payerez les réparations vous-même</strong>.</p>
<p><strong>Le bon réflexe :</strong> exigez l''attestation d''assurance décennale en pièce jointe du devis.</p>

<h2>Piège 6 : L''urgence artificielle</h2>
<p>"<em>Madame, ma promo expire ce soir, signez aujourd''hui</em>" ou "<em>Mon ouvrier est dispo cette semaine seulement</em>" sont des techniques de <strong>vente sous pression</strong>.</p>
<p>Un artisan sérieux comprend qu''on prenne 1-2 semaines pour comparer plusieurs devis.</p>
<p><strong>Le bon réflexe :</strong> ne signez JAMAIS le jour même. Demandez 48h minimum de réflexion, comparez avec d''autres devis.</p>

<h2>Piège 7 : Le faux RGE pour les aides</h2>
<p>Pour bénéficier de <strong>MaPrimeRénov''</strong> ou des <strong>CEE</strong>, l''artisan doit être <strong>certifié RGE</strong>. Certains pros affichent un faux logo RGE sur leurs documents.</p>
<p>Sans vrai RGE, vos aides seront <strong>refusées</strong> après les travaux. Vous perdez 2 000 à 11 000 €.</p>
<p><strong>Le bon réflexe :</strong> vérifiez la certification RGE sur <strong>france-renov.gouv.fr</strong> avant signature. Tapez le SIREN, vous voyez la liste exacte de ses certifications.</p>

<h2>Checklist : signer un devis en sécurité</h2>
<ul>
  <li>SIREN vérifié sur societe.com</li>
  <li>Attestation décennale fournie et valide</li>
  <li>Certifications nécessaires vérifiées (RGE si aides)</li>
  <li>Devis détaillé, ligne par ligne</li>
  <li>Acompte ≤ 30 %</li>
  <li>Pas de clause "extras illimités"</li>
  <li>Au moins 2 devis comparés</li>
  <li>Pas signé le jour même de la visite</li>
  <li>Date de validité claire</li>
  <li>Conditions de réception et garanties précisées</li>
</ul>

<h2>Comparez en sécurité avec Bisecco</h2>
<p>Toutes les vérifications sont déjà faites sur les profils Bisecco : <strong>SIREN contrôlé</strong>, profil validé par notre équipe, avis vérifiés.</p>
<p>Demandez plusieurs devis à des <a href="/metiers">artisans de votre métier</a>, par exemple un <a href="/metiers/macon/cannes">maçon à Cannes</a> ou un <a href="/metiers/peintre-en-batiment/meaux">peintre à Meaux</a>. Comparaison facilitée, échange direct, 0 % de commission.</p>

<p><em>Article publié le 30 mai 2026 par l''équipe Bisecco.</em></p>
  $$,
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1280&h=720&fit=crop',
  'Document de devis travaux et stylo posés sur un bureau',
  'L''équipe Bisecco',
  '7 min',
  'published',
  '2026-05-30 11:00:00+00',
  'Devis travaux : 7 pièges à éviter (guide 2026)',
  'Acompte, mat. à fournir, faux RGE : 7 pièges classiques qui coûtent des milliers d''euros aux particuliers. Comment les éviter.'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content_html = EXCLUDED.content_html,
  image_url = EXCLUDED.image_url,
  image_alt = EXCLUDED.image_alt,
  read_time = EXCLUDED.read_time,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  updated_at = NOW();


-- Article 4 — MaPrimeRénov 2026
INSERT INTO public.blog_articles
  (slug, title, excerpt, content_html, image_url, image_alt, author, read_time, status, published_at, meta_title, meta_description)
VALUES (
  'maprimerenov-2026-guide-complet',
  'MaPrimeRénov'' 2026 : guide complet pour vos travaux de rénovation',
  'Tout ce qu''il faut savoir sur MaPrimeRénov'' en 2026 : barèmes par revenus, travaux éligibles, démarches, cumul avec CEE et éco-PTZ.',
  $$
<p><strong>MaPrimeRénov''</strong> est l''aide phare de l''État pour la rénovation énergétique. En 2026, elle peut financer jusqu''à <strong>70 % de vos travaux</strong>. Voici le guide complet à jour.</p>

<h2>Qu''est-ce que MaPrimeRénov'' en 2026 ?</h2>
<p>MaPrimeRénov'' est une <strong>subvention de l''État</strong> versée <strong>après les travaux</strong> aux propriétaires occupants, bailleurs ou copropriétés qui réalisent des rénovations énergétiques.</p>
<p>Elle remplace l''ancien crédit d''impôt (CITE) supprimé en 2020. Gérée par l''ANAH (Agence nationale de l''habitat), elle est versée sur votre compte en quelques semaines après réception des travaux.</p>

<h2>Qui peut en bénéficier en 2026 ?</h2>
<ul>
  <li><strong>Propriétaires occupants</strong> (depuis au moins 15 ans pour le logement, ou résidence principale)</li>
  <li><strong>Propriétaires bailleurs</strong> (avec engagement de louer pendant 6 ans)</li>
  <li><strong>Syndicats de copropriété</strong></li>
  <li>Le logement doit être <strong>occupé comme résidence principale</strong></li>
  <li>Le logement doit avoir <strong>plus de 15 ans</strong> au moment du dépôt du dossier</li>
</ul>

<h2>Les 4 catégories de revenus en 2026</h2>
<p>Le montant de l''aide dépend de vos revenus fiscaux. Voici les seuils 2026 pour l''Île-de-France (les seuils sont 10 % plus bas en province) :</p>

<h3>Bleu (très modestes)</h3>
<p>Couples avec 2 enfants : revenus &lt; 38 850 €/an. Aide maximale : jusqu''à <strong>90 % des travaux financés</strong>.</p>

<h3>Jaune (modestes)</h3>
<p>Couples avec 2 enfants : revenus 38 851 à 47 290 €/an. Aide importante : <strong>60-75 %</strong>.</p>

<h3>Violet (intermédiaires)</h3>
<p>Couples avec 2 enfants : revenus 47 291 à 66 365 €/an. Aide moyenne : <strong>30-50 %</strong>.</p>

<h3>Rose (supérieurs)</h3>
<p>Couples avec 2 enfants : revenus &gt; 66 366 €/an. Aide réduite : <strong>0-20 %</strong> selon le type de travaux.</p>

<h2>Quels travaux sont éligibles en 2026 ?</h2>

<h3>1. Isolation (toujours rentable)</h3>
<ul>
  <li><strong>Isolation des combles perdus</strong> : 7-25 €/m² selon revenus</li>
  <li><strong>Isolation des murs par l''extérieur (ITE)</strong> : 15-75 €/m²</li>
  <li><strong>Isolation des murs par l''intérieur (ITI)</strong> : 7-25 €/m²</li>
  <li><strong>Isolation des planchers</strong> : 10-30 €/m²</li>
</ul>

<h3>2. Chauffage</h3>
<ul>
  <li><strong>Pompe à chaleur air/eau</strong> : 1 500-5 000 € (selon revenus)</li>
  <li><strong>Pompe à chaleur géothermique</strong> : 2 500-11 000 €</li>
  <li><strong>Chaudière biomasse (granulés bois)</strong> : 1 800-10 000 €</li>
  <li><strong>Chauffage solaire</strong> : 2 000-10 000 €</li>
  <li><strong>Raccordement réseau de chaleur</strong> : 700-1 200 €</li>
</ul>

<h3>3. Eau chaude sanitaire</h3>
<ul>
  <li><strong>Chauffe-eau thermodynamique</strong> : 400-1 200 €</li>
  <li><strong>Chauffe-eau solaire</strong> : 1 200-4 000 €</li>
</ul>

<h3>4. Ventilation</h3>
<ul>
  <li><strong>VMC double flux</strong> : 1 500-4 000 €</li>
</ul>

<h3>5. Rénovation globale (parcours accompagné)</h3>
<p>Si vous engagez un <strong>bouquet de travaux</strong> (isolation + chauffage + ventilation) avec gain énergétique d''au moins 35 %, vous accédez à <strong>MaPrimeRénov'' Parcours accompagné</strong> :</p>
<ul>
  <li>Jusqu''à <strong>70 000 € d''aide</strong> pour les revenus les plus modestes</li>
  <li>Accompagnement obligatoire par un <strong>Mon Accompagnateur Rénov''</strong></li>
</ul>

<h2>Condition INDISPENSABLE : artisan RGE</h2>
<p>Tous les travaux financés par MaPrimeRénov'' doivent être réalisés par un <strong>artisan certifié RGE</strong> (Reconnu Garant de l''Environnement). Sans ça, votre dossier sera refusé.</p>
<p>Comment vérifier le RGE de votre artisan ? Allez sur <strong>france-renov.gouv.fr</strong> → "Trouver un professionnel" → tapez son SIREN.</p>

<h2>Comment demander MaPrimeRénov'' ? (étapes)</h2>
<ol>
  <li><strong>Faites établir un devis</strong> par un artisan RGE</li>
  <li><strong>Créez un compte</strong> sur <strong>maprimerenov.gouv.fr</strong></li>
  <li><strong>Déposez votre dossier</strong> AVANT le début des travaux (très important)</li>
  <li>Attendez l''<strong>accord de l''ANAH</strong> (2-4 semaines)</li>
  <li>Une fois l''accord reçu, <strong>faites réaliser les travaux</strong></li>
  <li>Transmettez la <strong>facture finale</strong> à l''ANAH</li>
  <li>Recevez votre <strong>prime</strong> sur votre compte (4-8 semaines)</li>
</ol>

<blockquote>
  <p><strong>Erreur classique :</strong> commencer les travaux AVANT d''avoir reçu l''accord. Résultat : prime refusée. <strong>Attendez toujours le feu vert ANAH.</strong></p>
</blockquote>

<h2>Cumul avec d''autres aides : maximisez votre financement</h2>
<p>MaPrimeRénov'' est <strong>cumulable</strong> avec :</p>
<ul>
  <li>Les <strong>Certificats d''Économie d''Énergie (CEE)</strong> : 300 à 5 000 € selon travaux</li>
  <li>L''<strong>éco-PTZ</strong> (prêt à 0 %) : jusqu''à 50 000 €</li>
  <li>La <strong>TVA réduite à 5,5 %</strong> (au lieu de 20 %)</li>
  <li>Les <strong>aides locales</strong> (région, département, commune)</li>
</ul>
<p>En cumulant intelligemment, vous pouvez couvrir <strong>jusqu''à 100 % du coût</strong> pour les revenus les plus modestes.</p>

<h2>Quel est le délai moyen de versement ?</h2>
<p>En 2026, l''ANAH verse la prime en <strong>4 à 8 semaines</strong> après réception du dossier complet. Les dossiers complexes (rénovation globale) peuvent prendre 3-6 mois.</p>

<h2>Trouver un artisan RGE de confiance</h2>
<p>Sur Bisecco, les artisans peuvent afficher leur certification RGE sur leur profil. Cherchez un <a href="/metiers/chauffagiste">chauffagiste</a>, un <a href="/metiers/electricien">électricien</a> ou un <a href="/metiers/menuisier">menuisier</a> dans votre ville pour vos travaux de rénovation énergétique.</p>
<p>Par exemple, vous pouvez trouver un <a href="/metiers/chauffagiste/meaux">chauffagiste à Meaux</a> ou un <a href="/metiers/menuisier/cannes">menuisier à Cannes</a>.</p>

<h2>FAQ MaPrimeRénov'' 2026</h2>

<h3>Puis-je toucher MaPrimeRénov'' pour ma résidence secondaire ?</h3>
<p>Non. Seules les résidences principales (du propriétaire ou de ses locataires) sont éligibles.</p>

<h3>Combien de temps faut-il pour obtenir l''accord ANAH ?</h3>
<p>En moyenne <strong>2 à 4 semaines</strong> après dépôt du dossier complet. Plus rapide si vous fournissez tous les justificatifs dès le début.</p>

<h3>Puis-je faire les travaux moi-même ?</h3>
<p>Non. Les travaux <strong>doivent être réalisés par un artisan RGE</strong>. L''auto-construction n''est pas éligible.</p>

<h3>Peut-on bénéficier plusieurs fois de MaPrimeRénov'' ?</h3>
<p>Oui, dans la limite de <strong>20 000 € sur 5 ans</strong> (revenus intermédiaires/supérieurs) ou plus pour les revenus modestes.</p>

<p><em>Article publié le 25 mai 2026 par l''équipe Bisecco. Sources : ANAH, France Rénov''.</em></p>
  $$,
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1280&h=720&fit=crop',
  'Maison rénovée avec isolation thermique et panneaux solaires',
  'L''équipe Bisecco',
  '10 min',
  'published',
  '2026-05-25 10:00:00+00',
  'MaPrimeRénov'' 2026 : barèmes, travaux, démarches · Guide',
  'MaPrimeRénov'' 2026 : barème par revenus, travaux éligibles, démarches pas à pas, cumul aides. Jusqu''à 70 % des travaux financés.'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content_html = EXCLUDED.content_html,
  image_url = EXCLUDED.image_url,
  image_alt = EXCLUDED.image_alt,
  read_time = EXCLUDED.read_time,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  updated_at = NOW();


-- Article 5 — Maçon menuisier charpentier
INSERT INTO public.blog_articles
  (slug, title, excerpt, content_html, image_url, image_alt, author, read_time, status, published_at, meta_title, meta_description)
VALUES (
  'macon-menuisier-charpentier-qui-appeler',
  'Maçon, menuisier ou charpentier : qui appeler pour vos travaux ?',
  'Vous confondez les métiers du bâtiment ? Voici qui fait quoi, dans quel ordre intervenir, et comment ne pas payer 2× la même chose.',
  $$
<p>Vous voulez rénover votre maison mais vous ne savez pas si c''est un <strong>maçon, un menuisier ou un charpentier</strong> qu''il vous faut ? Ce guide démêle le qui fait quoi pour éviter les erreurs coûteuses.</p>

<h2>Maçon, menuisier, charpentier : la différence en 30 secondes</h2>

<h3>Le maçon = le gros œuvre</h3>
<p>Il travaille la <strong>structure de la construction</strong> : fondations, murs porteurs, dalles, ouvertures (créer une porte, agrandir une fenêtre). Il manipule le <strong>parpaing, la brique, le béton, la pierre</strong>.</p>

<h3>Le menuisier = les ouvrages fins en bois (et autres matériaux)</h3>
<p>Il fabrique et pose les <strong>éléments d''aménagement</strong> : portes intérieures, fenêtres, escaliers, parquets, placards, cuisine. Il travaille le <strong>bois</strong>, mais aussi <strong>PVC, alu, verre</strong>.</p>

<h3>Le charpentier = la structure du toit</h3>
<p>Il conçoit et pose les <strong>charpentes</strong> (la structure qui porte la toiture), les <strong>ossatures bois</strong>, les <strong>extensions en bois</strong>. C''est un métier très technique.</p>

<h2>Tableau récapitulatif : qui fait quoi ?</h2>

<table>
<thead><tr><th>Travail</th><th>Qui appeler ?</th></tr></thead>
<tbody>
<tr><td>Construire un mur porteur</td><td>Maçon</td></tr>
<tr><td>Casser un mur porteur</td><td>Maçon (+ structure)</td></tr>
<tr><td>Faire une dalle béton</td><td>Maçon</td></tr>
<tr><td>Construire une terrasse en béton</td><td>Maçon</td></tr>
<tr><td>Construire une terrasse en bois</td><td>Menuisier ou charpentier</td></tr>
<tr><td>Poser une porte intérieure</td><td>Menuisier</td></tr>
<tr><td>Poser une fenêtre bois/alu/PVC</td><td>Menuisier</td></tr>
<tr><td>Installer un escalier bois</td><td>Menuisier</td></tr>
<tr><td>Poser un parquet</td><td>Menuisier (ou parqueteur spécialisé)</td></tr>
<tr><td>Construire une cuisine sur mesure</td><td>Menuisier</td></tr>
<tr><td>Faire une charpente de maison</td><td>Charpentier</td></tr>
<tr><td>Faire une extension en bois</td><td>Charpentier</td></tr>
<tr><td>Surélever une maison</td><td>Charpentier (+ maçon)</td></tr>
<tr><td>Construire un abri de jardin</td><td>Charpentier ou menuisier</td></tr>
<tr><td>Refaire une charpente abîmée</td><td>Charpentier</td></tr>
</tbody>
</table>

<h2>Combien coûte chaque métier ?</h2>

<h3>Maçon</h3>
<ul>
  <li><strong>Tarif horaire</strong> : 40-70 €/h</li>
  <li><strong>Tarif journalier</strong> : 350-500 €/jour</li>
  <li>Mur porteur : 100-200 €/m²</li>
  <li>Extension simple : 1 500-2 500 €/m²</li>
</ul>

<h3>Menuisier</h3>
<ul>
  <li><strong>Tarif horaire</strong> : 40-80 €/h</li>
  <li>Pose fenêtre : 150-400 €</li>
  <li>Pose porte intérieure : 100-300 €</li>
  <li>Pose parquet : 30-80 €/m²</li>
  <li>Cuisine sur mesure : 5 000-15 000 €</li>
</ul>

<h3>Charpentier</h3>
<ul>
  <li><strong>Tarif horaire</strong> : 45-75 €/h</li>
  <li>Charpente traditionnelle : 70-150 €/m²</li>
  <li>Extension ossature bois : 1 200-2 500 €/m²</li>
  <li>Surélévation : 1 500-3 000 €/m²</li>
</ul>

<h2>L''ordre d''intervention sur un gros chantier</h2>
<p>Sur une rénovation lourde ou une extension, voici l''ordre logique pour éviter les conflits :</p>
<ol>
  <li><strong>Maçon</strong> : fondations, murs porteurs, ouvertures, dalles</li>
  <li><strong>Charpentier</strong> : structure du toit ou ossature bois</li>
  <li><strong>Couvreur</strong> : pose toiture, étanchéité</li>
  <li><strong>Plombier + électricien</strong> : passage des réseaux (en parallèle)</li>
  <li><strong>Plâtrier</strong> : cloisons et plafonds</li>
  <li><strong>Carreleur</strong> : sols carrelés, faïence</li>
  <li><strong>Menuisier</strong> : portes, fenêtres, parquets, escaliers</li>
  <li><strong>Peintre</strong> : finitions</li>
</ol>

<h2>Comment ne pas payer deux fois ?</h2>
<p>Pour une rénovation impliquant plusieurs métiers, vous avez 3 options :</p>

<h3>Option 1 : Le maître d''œuvre / architecte</h3>
<p>Il coordonne tous les corps de métier. Coût : <strong>8 à 15 % du budget global</strong>. Idéal pour les chantiers &gt; 50 000 €.</p>

<h3>Option 2 : L''entreprise générale du bâtiment (EGB)</h3>
<p>Elle propose tous les métiers en interne. Vous avez un seul interlocuteur. Souvent <strong>10-20 % plus cher</strong> qu''en additionnant les devis spécialisés, mais beaucoup plus simple.</p>

<h3>Option 3 : Vous coordonnez vous-même</h3>
<p>Vous gérez chaque artisan indépendamment. <strong>Le moins cher</strong> mais demande du temps + organisation. Risque de conflits entre corps de métier.</p>

<h2>Pour un projet spécifique, quel devis demander ?</h2>

<h3>"Je veux rénover ma cuisine"</h3>
<ol>
  <li><strong>Maçon</strong> si vous abattez/déplacez un mur</li>
  <li><strong>Plombier</strong> pour l''évier, lave-vaisselle</li>
  <li><strong>Électricien</strong> pour les nouvelles prises, plaque induction</li>
  <li><strong>Carreleur</strong> pour le sol et la crédence</li>
  <li><strong>Menuisier</strong> pour les meubles</li>
  <li><strong>Peintre</strong> pour les finitions</li>
</ol>
<p>OU : un <strong>cuisiniste</strong> qui sous-traite tout (option 2 ci-dessus).</p>

<h3>"Je veux créer une extension de 30 m²"</h3>
<ol>
  <li><strong>Architecte</strong> pour les plans (obligatoire si surface totale &gt; 150 m²)</li>
  <li><strong>Maçon</strong> pour la dalle et les murs</li>
  <li><strong>Charpentier</strong> pour la toiture</li>
  <li><strong>Plombier + électricien</strong> pour les réseaux</li>
  <li><strong>Couvreur</strong> pour la toiture</li>
  <li><strong>Menuisier</strong> pour les portes/fenêtres</li>
  <li><strong>Plâtrier + peintre</strong> pour les finitions</li>
</ol>

<h2>Trouvez le bon métier près de chez vous</h2>
<p>Sur Bisecco, vous trouvez chaque métier facilement :</p>
<ul>
  <li><a href="/metiers/macon">Maçons vérifiés SIREN</a> dans toute la France</li>
  <li><a href="/metiers/menuisier">Menuisiers</a> spécialisés (cuisine, fenêtres, parquet)</li>
  <li><a href="/metiers/couvreur">Couvreurs et charpentiers</a> pour toiture et extension</li>
</ul>
<p>Par ville, par exemple : <a href="/metiers/macon/cannes">maçon Cannes</a>, <a href="/metiers/menuisier/meaux">menuisier Meaux</a>, <a href="/metiers/couvreur/nice">couvreur Nice</a>.</p>

<p><em>Article publié le 20 mai 2026 par l''équipe Bisecco.</em></p>
  $$,
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1280&h=720&fit=crop',
  'Outils et matériaux de construction sur un chantier',
  'L''équipe Bisecco',
  '8 min',
  'published',
  '2026-05-20 09:00:00+00',
  'Maçon, menuisier, charpentier : qui appeler ? Guide 2026',
  'Différences maçon / menuisier / charpentier expliquées : qui fait quoi, dans quel ordre, et combien ça coûte en 2026.'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content_html = EXCLUDED.content_html,
  image_url = EXCLUDED.image_url,
  image_alt = EXCLUDED.image_alt,
  read_time = EXCLUDED.read_time,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  updated_at = NOW();


-- Vérification finale
SELECT COUNT(*) AS total_articles_publies FROM public.blog_articles WHERE status = 'published';
SELECT slug, title, status, published_at FROM public.blog_articles WHERE status = 'published' ORDER BY published_at DESC;
