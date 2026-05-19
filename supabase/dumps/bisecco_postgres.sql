-- ============================================================
-- Bisecco — Migration des données MySQL → Postgres Supabase
-- Généré automatiquement depuis le dump mysqldump
-- ============================================================
-- À exécuter dans Supabase SQL Editor APRÈS schema.sql
-- ============================================================

BEGIN;

-- Données : metiers (94 lignes)
INSERT INTO public.metiers (id, name, slug, category, description, icon, created_at, updated_at) VALUES
  (1, 'Maçon', 'macon', 'batiment', 'Murs porteurs, dalles, ouvertures et gros œuvre', NULL, '2026-04-19 09:25:38', '2026-04-26 12:31:43'),
  (2, 'Peintre', 'peintre', 'batiment', 'Peinture intérieure, extérieure et finitions', NULL, '2026-04-19 09:25:38', '2026-04-22 13:56:53'),
  (3, 'Carreleur', 'carreleur', 'batiment', 'Pose de carrelage, faïence et terrasse', NULL, '2026-04-19 09:25:38', '2026-04-22 13:56:53'),
  (4, 'Plâtrier', 'platrier', 'batiment', 'Cloisons, doublages, enduits et faux plafonds', NULL, '2026-04-19 09:25:38', '2026-04-19 09:25:38'),
  (5, 'Couvreur', 'couvreur', 'batiment', 'Pose et réparation de toitures', NULL, '2026-04-19 09:25:38', '2026-04-22 13:56:53'),
  (6, 'Charpentier', 'charpentier', 'batiment', 'Charpente bois, ossature et renforts', NULL, '2026-04-19 09:25:38', '2026-04-22 13:30:22'),
  (7, 'Serrurier', 'serrurier', 'batiment', 'Ouverture, remplacement de serrure et blindage', NULL, '2026-04-19 09:25:38', '2026-04-22 13:30:22'),
  (8, 'Vitrier', 'vitrier', 'batiment', 'Remplacement vitrage, double vitrage et vitrine', NULL, '2026-04-19 09:25:38', '2026-04-22 13:30:22'),
  (9, 'Façadier', 'facadier', 'facade_equipement', 'Ravalement, isolation extérieure et bardage', NULL, '2026-04-19 09:25:38', '2026-04-19 09:25:38'),
  (10, 'Étancheur', 'etancheur', 'facade_equipement', 'Étanchéité toiture, terrasse et fondations', NULL, '2026-04-19 09:25:38', '2026-04-19 09:25:38'),
  (11, 'Installateur de cuisine', 'installateur-de-cuisine', 'facade_equipement', 'Pose de cuisine équipée sur mesure', NULL, '2026-04-19 09:25:38', '2026-04-22 13:56:53'),
  (12, 'Climaticien', 'climaticien', 'facade_equipement', 'Installation et entretien de climatisation', NULL, '2026-04-19 09:25:38', '2026-04-22 13:30:22'),
  (13, 'Pompe à chaleur', 'pompe-a-chaleur', 'facade_equipement', 'Installation de PAC air-eau et air-air', NULL, '2026-04-19 09:25:38', '2026-04-22 13:56:53'),
  (14, 'Panneaux solaires', 'panneaux-solaires', 'facade_equipement', 'Installation photovoltaïque', NULL, '2026-04-19 09:25:38', '2026-04-22 13:56:53'),
  (15, 'Électroménager', 'electromenager', 'services_techniques', 'Dépannage lave-linge, frigo, four et lave-vaisselle', NULL, '2026-04-19 09:25:38', '2026-04-19 09:25:38'),
  (16, 'Informatique', 'informatique', 'services_techniques', 'Dépannage PC/Mac logiciel et matériel', NULL, '2026-04-19 09:25:38', '2026-04-22 13:56:53'),
  (17, 'Mécanicien auto', 'mecanicien-auto', 'services_techniques', 'Entretien et réparation automobile', NULL, '2026-04-19 09:25:38', '2026-04-19 09:25:38'),
  (18, 'Mécanicien moto', 'mecanicien-moto', 'services_techniques', 'Entretien et révision moto', NULL, '2026-04-19 09:25:38', '2026-04-19 09:25:38'),
  (19, 'Boulanger', 'boulanger', 'metiers_bouche', 'Pain traditionnel et viennoiseries', NULL, '2026-04-19 09:25:38', '2026-04-22 13:30:22'),
  (20, 'Pâtissier', 'patissier', 'metiers_bouche', 'Gâteaux, entremets et pièces montées', NULL, '2026-04-19 09:25:38', '2026-04-19 09:25:38'),
  (21, 'Boucher', 'boucher', 'metiers_bouche', 'Viandes de qualité et découpe', NULL, '2026-04-19 09:25:38', '2026-04-22 13:56:53'),
  (22, 'Fromager', 'fromager', 'metiers_bouche', 'Sélection et affinage de fromages', NULL, '2026-04-19 09:25:38', '2026-04-22 13:56:53'),
  (23, 'Chocolatier', 'chocolatier', 'metiers_bouche', 'Chocolats fins et confiseries', NULL, '2026-04-19 09:25:38', '2026-04-22 13:30:22'),
  (24, 'Coiffeur', 'coiffeur', 'services_proximite', 'Coupe, coloration et brushing', NULL, '2026-04-19 09:25:38', '2026-04-22 13:30:22'),
  (25, 'Esthéticienne', 'estheticienne', 'services_proximite', 'Soins visage, épilation et maquillage', NULL, '2026-04-19 09:25:38', '2026-04-19 09:25:38'),
  (26, 'Orthodontiste', 'orthodontiste', 'services_proximite', 'Alignement dentaire, appareils et suivi', NULL, '2026-04-19 09:25:38', '2026-04-22 13:30:22'),
  (27, 'Photographe', 'photographe', 'services_proximite', 'Mariage, portrait et événements', NULL, '2026-04-19 09:25:38', '2026-04-22 13:56:53'),
  (28, 'Jardinier', 'jardinier', 'services_proximite', 'Entretien, tonte, taille et plantations', NULL, '2026-04-19 09:25:38', '2026-04-22 13:30:22'),
  (29, 'Paysagiste', 'paysagiste', 'services_proximite', 'Aménagement et création de jardins', NULL, '2026-04-19 09:25:38', '2026-04-22 13:56:53'),
  (398, 'Plombier', 'plombier', 'batiment', 'Installation sanitaire, dépannage et réseaux d''eau', NULL, '2026-04-22 12:17:31', '2026-04-26 12:31:43'),
  (399, 'Électricien', 'electricien', 'batiment', 'Installation électrique, mise aux normes et dépannage', NULL, '2026-04-22 12:17:31', '2026-04-22 12:17:31'),
  (400, 'Menuisier', 'menuisier', 'batiment', 'Fabrication et pose de menuiseries intérieures et extérieures', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
  (401, 'Terrassier', 'terrassier', 'batiment', 'Préparation de terrain, tranchées et fondations', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
  (402, 'Chauffagiste', 'chauffagiste', 'batiment', 'Installation et entretien chauffage et eau chaude', NULL, '2026-04-22 12:17:31', '2026-04-22 13:30:22'),
  (403, 'Pisciniste', 'pisciniste', 'batiment', 'Construction, rénovation et entretien de piscines', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
  (404, 'Domoticien', 'domoticien', 'batiment', 'Automatisation de l''habitat, sécurité et objets connectés', NULL, '2026-04-22 12:17:31', '2026-04-26 12:31:43'),
  (405, 'Storiste', 'storiste', 'batiment', 'Pose de stores, volets et protections solaires', NULL, '2026-04-22 12:17:31', '2026-04-22 13:30:22'),
  (406, 'Ascensoriste', 'ascensoriste', 'batiment', 'Installation et maintenance d''ascenseurs et élévateurs', NULL, '2026-04-22 12:17:31', '2026-04-26 12:31:43'),
  (407, 'Parqueteur', 'parqueteur', 'batiment', 'Pose, rénovation et vitrification de parquet', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
  (408, 'Peintre en bâtiment', 'peintre-en-batiment', 'batiment', 'Peinture intérieure, extérieure et finitions de chantier', NULL, '2026-04-22 12:17:31', '2026-04-22 12:17:31'),
  (409, 'Installateur panneaux solaires', 'installateur-panneaux-solaires', 'facade_equipement', 'Pose et mise en service de panneaux solaires', NULL, '2026-04-22 12:17:31', '2026-04-22 13:30:22'),
  (410, 'Garagiste', 'garagiste', 'services_techniques', 'Entretien courant, diagnostic et réparations atelier', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
  (411, 'Carrossier', 'carrossier', 'services_techniques', 'Réparation carrosserie, redressage et finitions', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
  (412, 'Peintre automobile', 'peintre-automobile', 'services_techniques', 'Peinture, raccords et finitions carrosserie', NULL, '2026-04-22 12:17:31', '2026-04-22 13:30:22'),
  (413, 'Contrôleur technique', 'controleur-technique', 'services_techniques', 'Contrôle technique et vérification sécurité véhicule', NULL, '2026-04-22 12:17:31', '2026-04-22 12:17:31'),
  (414, 'Dépanneur', 'depanneur', 'services_techniques', 'Assistance, remorquage et dépannage rapide', NULL, '2026-04-22 12:17:31', '2026-04-22 12:17:31'),
  (415, 'Électricien automobile', 'electricien-automobile', 'services_techniques', 'Diagnostic et réparation des systèmes électriques auto', NULL, '2026-04-22 12:17:31', '2026-04-22 12:17:31'),
  (416, 'Préparateur automobile', 'preparateur-automobile', 'services_techniques', 'Préparation esthétique et technique de véhicules', NULL, '2026-04-22 12:17:31', '2026-04-22 12:17:31'),
  (417, 'Vulcanisateur', 'vulcanisateur', 'services_techniques', 'Réparation, montage et entretien de pneus', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
  (418, 'Réparateur électroménager', 'reparateur-electromenager', 'services_techniques', 'Diagnostic et réparation des appareils électroménagers', NULL, '2026-04-22 12:17:31', '2026-04-22 12:17:31'),
  (419, 'Réparateur informatique', 'reparateur-informatique', 'services_techniques', 'Diagnostic, maintenance et réparation informatique', NULL, '2026-04-22 12:17:31', '2026-04-22 12:17:31'),
  (420, 'Charcutier', 'charcutier', 'metiers_bouche', 'Préparation de charcuteries et spécialités traiteur', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
  (421, 'Poissonnier', 'poissonnier', 'metiers_bouche', 'Préparation et vente de poissons et produits de la mer', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
  (422, 'Traiteur', 'traiteur', 'metiers_bouche', 'Buffets, repas événementiels et cuisine livrée', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
  (423, 'Glacier', 'glacier', 'metiers_bouche', 'Glaces artisanales, sorbets et desserts glacés', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
  (424, 'Confiseur', 'confiseur', 'metiers_bouche', 'Confiseries artisanales et douceurs sucrées', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
  (425, 'Brasseur artisanal', 'brasseur-artisanal', 'metiers_bouche', 'Brassage, fermentation et production de bière artisanale', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
  (426, 'Cuisinier traiteur', 'cuisinier-traiteur', 'metiers_bouche', 'Cuisine sur mesure pour réceptions et événements', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
  (427, 'Pizzaiolo', 'pizzaiolo', 'metiers_bouche', 'Préparation et cuisson de pizzas artisanales', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
  (428, 'Barbier', 'barbier', 'services_proximite', 'Taille de barbe, rasage et soins homme', NULL, '2026-04-22 12:17:31', '2026-04-22 13:30:22'),
  (429, 'Taxi', 'taxi', 'services_proximite', 'Transport local de personnes et trajets réservés', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
  (430, 'Chauffeur VTC', 'chauffeur-vtc', 'services_proximite', 'Transport privé sur réservation', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
  (431, 'Déménageur', 'demenageur', 'services_proximite', 'Transport, manutention et installation lors de déménagements', NULL, '2026-04-22 12:17:31', '2026-04-22 12:17:31'),
  (432, 'Blanchisseur', 'blanchisseur', 'services_proximite', 'Entretien, lavage et traitement du linge', NULL, '2026-04-22 12:17:31', '2026-04-22 13:30:22'),
  (433, 'Pressing', 'pressing', 'services_proximite', 'Nettoyage, détachage et entretien textile', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
  (434, 'Cordonnier', 'cordonnier', 'services_proximite', 'Réparation de chaussures, maroquinerie et entretien cuir', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
  (435, 'Horloger', 'horloger', 'services_proximite', 'Réparation et entretien de montres et pendules', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
  (436, 'Toiletteur animalier', 'toiletteur-animalier', 'services_proximite', 'Toilettage, coupe et soins d''hygiène pour animaux', NULL, '2026-04-22 12:17:31', '2026-04-26 12:31:43'),
  (437, 'Agent de nettoyage', 'agent-de-nettoyage', 'services_proximite', 'Nettoyage régulier, remise en état et entretien de locaux', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
  (438, 'Tatoueur', 'tatoueur', 'services_proximite', 'Tatouage artistique, dessin personnalisé et retouches', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
  (439, 'Prothésiste ongulaire', 'prothesiste-ongulaire', 'services_proximite', 'Pose, entretien et décoration d''ongles', NULL, '2026-04-22 12:17:31', '2026-04-26 12:31:43'),
  (440, 'Laveur automobile', 'laveur-automobile', 'services_proximite', 'Nettoyage intérieur, extérieur et préparation esthétique', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
  (441, 'Laveur auto', 'laveur-auto', 'services_proximite', 'Nettoyage intérieur et extérieur de véhicules', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
  (442, 'Ébéniste', 'ebeniste', 'services_techniques', 'Création et restauration de mobilier en bois', NULL, '2026-04-22 12:25:34', '2026-04-22 12:25:34'),
  (443, 'Ferronnier', 'ferronnier', 'services_techniques', 'Ouvrages en métal, garde-corps et ferronnerie décorative', NULL, '2026-04-22 12:25:34', '2026-04-22 13:56:53'),
  (444, 'Céramiste', 'ceramiste', 'services_techniques', 'Création de pièces en terre cuite et émaillée', NULL, '2026-04-22 12:25:34', '2026-04-22 12:25:34'),
  (445, 'Bijoutier', 'bijoutier', 'services_techniques', 'Fabrication et réparation de bijoux', NULL, '2026-04-22 12:25:34', '2026-04-22 13:56:53'),
  (446, 'Joaillier', 'joaillier', 'services_techniques', 'Création de bijoux précieux et sertissage', NULL, '2026-04-22 12:25:34', '2026-04-22 13:56:53'),
  (447, 'Tailleur', 'tailleur', 'services_techniques', 'Confection et ajustement de vêtements sur mesure', NULL, '2026-04-22 12:25:34', '2026-04-22 13:56:53'),
  (448, 'Couturier', 'couturier', 'services_techniques', 'Retouches, confection textile et créations sur mesure', NULL, '2026-04-22 12:25:34', '2026-04-22 13:56:53'),
  (449, 'Tapissier', 'tapissier', 'services_techniques', 'Réfection de sièges, rideaux et décoration textile', NULL, '2026-04-22 12:25:34', '2026-04-22 13:56:53'),
  (450, 'Imprimeur', 'imprimeur', 'services_techniques', 'Impression artisanale, supports papier et finitions', NULL, '2026-04-22 12:25:34', '2026-04-22 13:30:22'),
  (451, 'Graveur', 'graveur', 'services_techniques', 'Gravure sur métal, verre, bois ou pierre', NULL, '2026-04-22 12:25:34', '2026-04-22 13:56:53'),
  (452, 'Maroquinier', 'maroquinier', 'services_techniques', 'Création et réparation d''articles en cuir', NULL, '2026-04-22 12:25:34', '2026-04-26 12:31:43'),
  (453, 'Luthier', 'luthier', 'services_techniques', 'Fabrication, réglage et réparation d''instruments à cordes', NULL, '2026-04-22 12:25:34', '2026-04-26 12:31:43'),
  (454, 'Souffleur de verre', 'souffleur-de-verre', 'services_techniques', 'Création d''objets décoratifs et utilitaires en verre', NULL, '2026-04-22 12:25:34', '2026-04-26 12:31:43'),
  (455, 'Sculpteur', 'sculpteur', 'services_techniques', 'Création et taille de pièces artistiques', NULL, '2026-04-22 12:25:34', '2026-04-22 13:56:53'),
  (456, 'Encadreur', 'encadreur', 'services_techniques', 'Encadrement sur mesure pour œuvres et documents', NULL, '2026-04-22 12:25:34', '2026-04-26 12:31:43'),
  (457, 'Relieur', 'relieur', 'services_techniques', 'Reliure, restauration et finition d''ouvrages', NULL, '2026-04-22 12:25:34', '2026-04-26 12:31:43'),
  (458, 'Horloger d''art', 'horloger-dart', 'services_techniques', 'Restauration d''horlogerie ancienne et pièces d''exception', NULL, '2026-04-22 12:25:34', '2026-04-26 12:31:43'),
  (459, 'Verrier', 'verrier', 'services_techniques', 'Création, découpe et restauration d''ouvrages en verre', NULL, '2026-04-22 12:25:34', '2026-04-26 12:31:43'),
  (552, 'Maçon', 'maaon', 'batiment', 'Murs porteurs, dalles, ouvertures et gros Å“uvre', NULL, '2026-04-22 13:30:22', '2026-04-22 13:30:22'),
  (554, 'Façadier', 'faaadier', 'facade_equipement', 'Ravalement, isolation extÃ©rieure et bardage', NULL, '2026-04-22 13:30:22', '2026-04-22 13:30:22'),
  (570, 'Prothésiste ongulaire', 'prothasiste-ongulaire', 'services_proximite', 'Pose, entretien et dÃ©coration d ongles', NULL, '2026-04-22 13:30:22', '2026-04-22 13:30:22');

-- Données : users (17 lignes)
INSERT INTO public.users (id, client_number, name, email, email_verified_at, password, oauth_provider, oauth_id, role, phone, city, description, profile_photo, cover_photo, siren, siren_status, siren_last_checked_at, siren_closed_at, validation_status, validated_at, validated_by, rejection_reason, remember_token, created_at, updated_at, deleted_at) VALUES
  (4, 'BIS-2026-000003', 'Admin Bisecco', 'bisecco.support@gmail.com', NULL, '$2y$12$8fIGdK9A13keHCvj74TZs.K10Lny8NkYkClXxFLHchumyGBKMDjLy', NULL, NULL, 'admin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', '2026-04-19 09:37:11', NULL, NULL, '3LIFTSsron7Mdw3ajqIRGkLkgV6XYRz3U2r1jo3c1bXOlUtNCAt8frGU9ELM', '2026-04-18 05:03:59', '2026-04-21 07:24:49', NULL),
  (35, 'BIS-2026-000004', 'Pedro De Jesus Tavares', 'assistance.endormis@gmail.com', NULL, '$2y$12$cS3pKPzovWL62AihlQlY1uLPBBBPi1zMCVAY5D9GXgOscS0jkqjB2', NULL, NULL, 'particulier', '0766035018', 'MEAUX', NULL, 'uploads/v9Copez19Uj0T4MaVnlfEBYFxElTGLQxaEdI6Lcv.png', 'uploads/LwxdS3wPYkOBtFtQ9bdt8iy7Gq1ggpU8SKnpfIpF.png', NULL, NULL, NULL, NULL, 'approved', '2026-04-26 18:00:28', NULL, NULL, NULL, '2026-04-26 17:53:39', '2026-04-26 18:00:28', NULL),
  (36, 'BIS-2026-000005', 'Lorenzo nero', 'nero.lorenzo@gmail.com', NULL, '$2y$12$42Ju6ArA8sL7lJH1Sz7giOOoNXB632uTKy2h5Fjhhq8sHfSXz9RtO', NULL, NULL, 'particulier', NULL, 'Meaux', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', '2026-04-26 18:00:27', NULL, NULL, 'RA1y6QrqU6dNuoFw5a30QRdwym9Bpb9IspTFssqdhGZDUcRsaeC1uCpRNfQy', '2026-04-26 17:55:20', '2026-04-26 18:00:27', NULL),
  (40, 'BIS-2026-000009', 'Binda Gama', 'bindagama@hotmail.com', NULL, '$2y$12$N9I1MP.PQ.l8emJPCKc0U.rlXq.G7HNXfur7bh69KvzXsaytd3IaK', NULL, NULL, 'particulier', '0624676128', '77139 MARCILLY', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', '2026-04-27 08:07:49', NULL, NULL, NULL, '2026-04-27 08:07:15', '2026-04-27 08:07:49', NULL),
  (41, 'BIS-2026-000010', 'Rajah Kuna', 'gkunarajah@gmail.com', NULL, '$2y$12$eII2R.viIK8EHGUWlJ3d8edvYuPQqAnOR/qEXtpT9/1etIHwPM8ke', NULL, NULL, 'particulier', '0628982443', 'Garges les Gonesse', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', '2026-04-27 13:19:41', NULL, NULL, NULL, '2026-04-27 13:19:12', '2026-04-27 13:19:41', NULL),
  (42, 'BIS-2026-000011', 'Olivier Lambin', 'oliviermontoir@gmail.com', NULL, '$2y$12$liDk3nyuhkL7zdrnj/QSnOXZ7guaISJ.zmJh8wvoZb5IM8E45Z3rq', NULL, NULL, 'particulier', NULL, 'Coincy', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', '2026-04-27 15:38:59', NULL, NULL, NULL, '2026-04-27 15:38:23', '2026-04-27 15:38:59', NULL),
  (43, 'BIS-2026-000012', 'Jessie Clayette', 'jess700@hotmail.fr', NULL, '$2y$12$x4xZahR.ah0cJ74qLBTH2OHhZH/Zhc8SNPHRp/wBQuEBucFuYUzni', NULL, NULL, 'particulier', '0668811033', 'Mandelieu la Napoule', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', '2026-04-28 08:54:32', NULL, NULL, NULL, '2026-04-28 08:54:01', '2026-04-28 08:54:32', NULL),
  (44, 'BIS-2026-000013', 'Miguel Pinheiro - AMP BAT', 'miguel.pinheiro.mp@gmail.com', '2026-04-28 12:03:34', '$2y$12$nhFJNfHZx5d/dpYs3k5YXOIFMl2Msboogs3AYkBmTwYI/PRuWzn6.', NULL, NULL, 'artisan', '0621073702', 'Vinantes', 'Bonjour 

Pour un travail de serieux et de qualiter', NULL, NULL, '934890187', NULL, NULL, NULL, 'approved', '2026-04-28 12:08:03', NULL, NULL, 'm0c4KLLpGmsk4bpGxXN5fQelUs3e3qAG7tRZYf8DvNZdi63Gmdb8lgcpK7eR', '2026-04-28 12:03:34', '2026-04-28 12:14:40', NULL),
  (45, 'BIS-2026-000014', 'Anna SIRUFO', 'anna.sirufo@gmail.com', NULL, '$2y$12$9d1BzR8zO2Onp3mpyiDCFueBhnMyQGDQXhg5NWCjTAXq9wSZ8lQT6', NULL, NULL, 'particulier', '0781013300', 'CANNES', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', '2026-04-29 09:14:41', NULL, NULL, NULL, '2026-04-28 13:08:24', '2026-04-29 09:14:41', NULL),
  (57, 'BIS-2026-000015', 'Bennour Naguez (naguez)', 'bennour-naguez-naguez-oagTvV@bisecco.fr', NULL, '$2y$12$UndwLLAideak5v2iclwuBudXC2wUSZrYD8RaM2VqYDsMJnbbl1aSm', NULL, NULL, 'artisan', NULL, 'Meaux', NULL, 'uploads/qjgSk1pHEyME9wN7ZQnZ2v96O9NZ5KmoEOak3Nez.png', 'uploads/ThXlevx2XWp4zdKMrH3rD6fKCFcnNaPgtfOUDHvB.png', '501828982', NULL, NULL, NULL, 'approved', '2026-04-29 17:19:06', 4, NULL, NULL, '2026-04-29 17:19:06', '2026-04-29 17:19:06', NULL),
  (58, 'BIS-2026-000016', 'Malik Haddad', 'malik-haddad-GkQahZ@bisecco.fr', NULL, '$2y$12$ZxBCSvFv8EGgt273065iEuxNb.G26ZkUb3ltri6mMM32V12zQ1KkG', NULL, NULL, 'artisan', NULL, 'Melun', NULL, 'uploads/XjFo98gTnC4REaaX5niee8e2x05CCEmdZDC3oDCA.png', 'uploads/JTHkQSIKGHj9uwdN8WAGT5UhHYtjpce4z69tRvO8.png', '983433210', NULL, NULL, NULL, 'approved', '2026-04-29 17:37:28', 4, NULL, NULL, '2026-04-29 17:37:28', '2026-04-29 17:37:28', NULL),
  (59, 'BIS-2026-000017', 'Adil Taoufik', 'adtaetc@gmail.com', NULL, '$2y$12$cutB3x0O/yoljhziQJod5.xYJW5kHQcMDWDrXrnTzO4JpqBaUrYpi', NULL, NULL, 'particulier', NULL, '60300 Senlis', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', '2026-04-30 09:23:12', NULL, NULL, NULL, '2026-04-30 09:22:33', '2026-04-30 09:23:12', NULL),
  (60, 'BIS-2026-000018', 'Franck Mino - Sirius Automobiles', 'siriusautomobiles@gmail.com', '2026-04-30 14:35:40', '$2y$12$BLJj/1jpBxRhj3WEvfKNyuBPr.hRTEcVaA7x/sMlioOCfaIb/bqXe', NULL, NULL, 'artisan', '01 60 32 98 19', '77165 Saint Soupplets', NULL, NULL, NULL, '851509372', NULL, NULL, NULL, 'approved', '2026-04-30 14:59:55', NULL, NULL, NULL, '2026-04-30 14:35:40', '2026-04-30 14:59:55', NULL),
  (63, 'BIS-2026-000020', 'Angie Cornejo', 'veronica.angie@hotmail.com', NULL, '$2y$12$zP4buFRLDmvCFZfv2x5K5Ovzd0/ygLVC5ggD5Z6ii31NwvfQJKghS', NULL, NULL, 'particulier', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', '2026-05-01 10:22:09', NULL, NULL, NULL, '2026-05-01 10:21:12', '2026-05-01 10:22:09', NULL),
  (64, 'BIS-2026-000021', 'Enzo Nero-Recrosio', 'laurent.rn@gmail.com', '2026-05-01 12:17:31', '$2y$12$aD1XnOa4QOuFOqrG66eU5uOavkYVjpNfB7Fxgo.IZXKxrjlDBwmp.', NULL, NULL, 'particulier', '0658133313', 'Mandelieu la Napoule', NULL, 'uploads/vlKUjAaKy5an6wtUtYjgn06qEnb2WtobtrFADrVk.jpg', NULL, NULL, NULL, NULL, NULL, 'approved', '2026-05-01 12:17:31', NULL, NULL, 'GxpyS6d3DcPFVPmLpdiNh66lRUJsqfOl7ejgHAGo4yu3i7PT7yIdAwV87fzW', '2026-05-01 12:17:31', '2026-05-01 12:42:01', NULL),
  (65, 'BIS-2026-000022', 'Laurent Nero - Agisco', 'agisco.fr@gmail.com', '2026-05-01 12:32:35', '$2y$12$brv293fduwNExv7fS5jMWOut4vj6pAErA9msWynhpZgYJ.0PnuQ8O', NULL, NULL, 'artisan', '0658133313', '06400 Cannes', NULL, 'uploads/8p7RUtXe5Bij5zYr5zTNpGuEmoRKqRd4O8OGAO84.png', NULL, '750463317', NULL, NULL, NULL, 'approved', '2026-05-01 12:32:58', NULL, NULL, NULL, '2026-05-01 12:32:35', '2026-05-01 12:54:56', NULL),
  (66, 'BIS-2026-000023', 'Nassim HAMMANI - Ns controle', 'ns.controle77@gmail.com', '2026-05-11 09:09:41', '$2y$12$//P70gSnLqd8GaYVrRYDEODdzGmf8Bs1zkB68yUxXtmCupG40KaNy', NULL, NULL, 'artisan', NULL, '77165 Saint-Soupplets', NULL, NULL, NULL, '921752275', NULL, NULL, NULL, 'approved', '2026-05-11 09:11:35', NULL, NULL, NULL, '2026-05-11 09:09:41', '2026-05-11 09:11:35', NULL);

-- Données : artisan_profiles (6 lignes)
INSERT INTO public.artisan_profiles (id, user_id, metier_id, company_name, description, availability, business_hours, service_radius, latitude, longitude, siret, siret_verified, rcs_verified, is_active, created_at, updated_at) VALUES
  (15, 44, 398, 'AMP BAT', 'Bonjour 

Pour un travail de serieux et de qualiter', 'week', '8 H / 17 H', 100, NULL, NULL, NULL, false, false, true, '2026-04-28 12:03:34', '2026-04-28 12:14:40'),
  (26, 57, 398, 'Bennour Naguez', 'Bennour Naguez est une entreprise professionnelle, basée à Meaux.', NULL, NULL, 30, NULL, NULL, '501828982', false, false, true, '2026-04-29 17:19:06', '2026-04-29 17:19:06'),
  (27, 58, 398, 'Malik Haddad (hm Services)', 'Malik Haddad (hm Services) est une entreprise professionnelle, basée à Melun.', NULL, NULL, 8, NULL, NULL, '983433210', false, false, true, '2026-04-29 17:37:28', '2026-04-29 17:37:28'),
  (28, 60, 17, 'Sirius Automobiles', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-04-30 14:35:40', '2026-04-30 14:35:40'),
  (29, 65, 16, 'Agisco', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-01 12:32:35', '2026-05-01 12:32:35'),
  (30, 66, 413, 'Ns controle', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-11 09:09:41', '2026-05-11 09:09:41');

-- Données : artisan_profile_metier (8 lignes)
INSERT INTO public.artisan_profile_metier (id, artisan_profile_id, metier_id) VALUES
  (2, 15, 398),
  (9, 26, 398),
  (10, 27, 398),
  (11, 28, 17),
  (12, 28, 411),
  (13, 28, 412),
  (14, 29, 16),
  (15, 30, 413);

-- Données : services (5 lignes)
INSERT INTO public.services (id, artisan_profile_id, name, price, created_at, updated_at) VALUES
  (2, 27, 'Débouchage canalisation', '80 €', '2026-04-29 17:37:28', '2026-04-29 17:37:28'),
  (3, 27, 'Réparation fuite d''eau', '90 €', '2026-04-29 17:37:28', '2026-04-29 17:37:28'),
  (4, 27, 'Installation robinetterie', '120 €', '2026-04-29 17:37:28', '2026-04-29 17:37:28'),
  (5, 27, 'Remplacement chauffe-eau', '350 €', '2026-04-29 17:37:28', '2026-04-29 17:37:28'),
  (6, 27, 'Dépannage urgent', '150 €', '2026-04-29 17:37:28', '2026-04-29 17:37:28');

-- Données : gallery_images (1 lignes)
INSERT INTO public.gallery_images (id, artisan_profile_id, user_id, image_path, caption, sort_order, created_at, updated_at) VALUES
  (5, NULL, 36, 'gallery/InAnUWKw83XW2Gh7PM0vKbj7EtnJEyYWaujPc0w2.jpg', NULL, 0, '2026-04-26 17:56:08', '2026-04-26 17:56:08');

-- Données : chat_conversations (1 lignes)
INSERT INTO public.chat_conversations (id, visitor_id, visitor_name, visitor_email, page_url, status, human_mode, last_activity_at, created_at, updated_at) VALUES
  (18, 'Izo1O31gGw78fiBIgiFdBpDC9ZsJnXuFY2gG5W1A', NULL, NULL, '/', 'open', false, '2026-05-14 20:01:59', '2026-05-14 20:01:59', '2026-05-14 20:01:59');

-- Données : chat_messages (2 lignes)
INSERT INTO public.chat_messages (id, conversation_id, body, sender, sender_name, read_at, created_at, updated_at) VALUES
  (32, 18, 'Comment fonctionne Bisecco ?', 'visitor', 'Visiteur', NULL, '2026-05-14 20:01:59', '2026-05-14 20:01:59'),
  (33, 18, 'Je note votre demande. Souhaitez-vous trouver un artisan, en savoir plus sur la plateforme ou gérer votre compte ?', 'bot', 'Camille — Conseillère Bisecco', NULL, '2026-05-14 20:01:59', '2026-05-14 20:01:59');

-- Données : profile_views (48 lignes)
INSERT INTO public.profile_views (id, profile_user_id, viewed_at) VALUES
  (4, 44, '2026-04-28 12:10:44'),
  (5, 44, '2026-04-28 12:12:00'),
  (6, 44, '2026-04-28 14:23:14'),
  (7, 44, '2026-04-28 14:49:05'),
  (8, 44, '2026-04-28 14:52:28'),
  (10, 44, '2026-04-29 06:29:04'),
  (12, 44, '2026-04-29 07:01:08'),
  (14, 44, '2026-04-29 13:45:11'),
  (27, 44, '2026-05-01 11:14:13'),
  (37, 44, '2026-05-07 13:28:38'),
  (43, 44, '2026-05-08 02:36:56'),
  (18, 57, '2026-04-29 17:19:33'),
  (26, 57, '2026-05-01 10:47:12'),
  (34, 57, '2026-05-03 08:28:32'),
  (44, 57, '2026-05-08 06:45:41'),
  (52, 57, '2026-05-13 06:17:54'),
  (56, 57, '2026-05-14 12:28:26'),
  (57, 57, '2026-05-14 12:28:30'),
  (19, 58, '2026-04-29 17:37:47'),
  (21, 58, '2026-04-30 09:23:06'),
  (32, 58, '2026-05-01 19:27:39'),
  (33, 58, '2026-05-01 21:53:38'),
  (45, 58, '2026-05-08 08:46:49'),
  (53, 58, '2026-05-13 06:21:08'),
  (55, 58, '2026-05-14 12:28:01'),
  (22, 60, '2026-04-30 15:16:35'),
  (23, 60, '2026-04-30 15:16:40'),
  (24, 60, '2026-05-01 10:22:04'),
  (28, 60, '2026-05-01 12:07:58'),
  (29, 60, '2026-05-01 12:14:19'),
  (35, 60, '2026-05-03 08:56:14'),
  (42, 60, '2026-05-08 01:07:11'),
  (47, 60, '2026-05-09 12:11:18'),
  (49, 60, '2026-05-11 12:24:20'),
  (50, 60, '2026-05-11 12:24:26'),
  (51, 60, '2026-05-11 16:14:57'),
  (58, 60, '2026-05-14 20:11:17'),
  (59, 60, '2026-05-16 07:44:04'),
  (30, 65, '2026-05-01 12:35:15'),
  (31, 65, '2026-05-01 12:56:38'),
  (36, 65, '2026-05-05 04:26:21'),
  (38, 65, '2026-05-07 15:54:36'),
  (39, 65, '2026-05-07 15:54:41'),
  (40, 65, '2026-05-07 15:55:53'),
  (41, 65, '2026-05-07 16:42:14'),
  (46, 65, '2026-05-09 12:10:55'),
  (48, 66, '2026-05-11 09:17:20'),
  (54, 66, '2026-05-14 06:43:58');

-- ─── Reset des séquences BIGSERIAL ────────────────────────
SELECT setval(pg_get_serial_sequence('public.metiers', 'id'), COALESCE((SELECT MAX(id) FROM public.metiers), 1));
SELECT setval(pg_get_serial_sequence('public.users', 'id'), COALESCE((SELECT MAX(id) FROM public.users), 1));
SELECT setval(pg_get_serial_sequence('public.artisan_profiles', 'id'), COALESCE((SELECT MAX(id) FROM public.artisan_profiles), 1));
SELECT setval(pg_get_serial_sequence('public.artisan_profile_metier', 'id'), COALESCE((SELECT MAX(id) FROM public.artisan_profile_metier), 1));
SELECT setval(pg_get_serial_sequence('public.services', 'id'), COALESCE((SELECT MAX(id) FROM public.services), 1));
SELECT setval(pg_get_serial_sequence('public.gallery_images', 'id'), COALESCE((SELECT MAX(id) FROM public.gallery_images), 1));
SELECT setval(pg_get_serial_sequence('public.reviews', 'id'), COALESCE((SELECT MAX(id) FROM public.reviews), 1));
SELECT setval(pg_get_serial_sequence('public.follows', 'id'), COALESCE((SELECT MAX(id) FROM public.follows), 1));
SELECT setval(pg_get_serial_sequence('public.artisan_posts', 'id'), COALESCE((SELECT MAX(id) FROM public.artisan_posts), 1));
SELECT setval(pg_get_serial_sequence('public.artisan_post_likes', 'id'), COALESCE((SELECT MAX(id) FROM public.artisan_post_likes), 1));
SELECT setval(pg_get_serial_sequence('public.artisan_post_comments', 'id'), COALESCE((SELECT MAX(id) FROM public.artisan_post_comments), 1));
SELECT setval(pg_get_serial_sequence('public.artisan_connections', 'id'), COALESCE((SELECT MAX(id) FROM public.artisan_connections), 1));
SELECT setval(pg_get_serial_sequence('public.chat_conversations', 'id'), COALESCE((SELECT MAX(id) FROM public.chat_conversations), 1));
SELECT setval(pg_get_serial_sequence('public.chat_messages', 'id'), COALESCE((SELECT MAX(id) FROM public.chat_messages), 1));
SELECT setval(pg_get_serial_sequence('public.profile_views', 'id'), COALESCE((SELECT MAX(id) FROM public.profile_views), 1));
SELECT setval(pg_get_serial_sequence('public.maintenance_subscribers', 'id'), COALESCE((SELECT MAX(id) FROM public.maintenance_subscribers), 1));

COMMIT;

-- Tables importées : 9/16
-- Tables vides dans le dump (pas d'INSERT) : reviews, follows, artisan_posts, artisan_post_likes, artisan_post_comments, artisan_connections, maintenance_subscribers
