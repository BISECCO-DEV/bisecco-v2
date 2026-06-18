/**
 * Coordonnées géographiques des principales villes françaises.
 *
 * Utilisé pour positionner les artisans sur la carte quand ils n'ont pas
 * encore renseigné leur lat/lng précise dans `artisan_profiles.latitude/longitude`.
 *
 * Mieux que la dispersion aléatoire autour de l'IDF : chaque artisan apparaît
 * dans sa vraie ville (ou proche), pas à un point aléatoire de la Seine-et-Marne.
 *
 * Source : OpenStreetMap / approximation centre-ville (précision ~500m).
 *
 * Stratégie de lookup (en cascade) :
 * 1. Match exact dans CITY_COORDS (~300 communes)
 * 2. Match partiel (préfixe / suffixe) dans CITY_COORDS
 * 3. Fallback département depuis le code postal (DEPARTMENT_COORDS · 101 entrées)
 * 4. null → l'artisan ne sera pas affiché
 *
 * Avec le fallback département, n'importe quel "60300 Senlis" (même si la
 * ville n'est pas connue) tombe au centre du département (Oise → Beauvais).
 * Précision moyenne : ~30 km. Bien meilleur que rien.
 */

const CITY_COORDS: Record<string, [number, number]> = {
  // ═══════════ Île-de-France ═══════════
  "paris": [48.8566, 2.3522],
  "boulogne-billancourt": [48.8350, 2.2410],
  "saint-denis": [48.9356, 2.3539],
  "argenteuil": [48.9474, 2.2474],
  "montreuil": [48.8612, 2.4435],
  "nanterre": [48.8924, 2.2070],
  "vitry-sur-seine": [48.7872, 2.3925],
  "creteil": [48.7900, 2.4550],
  "versailles": [48.8014, 2.1301],
  "courbevoie": [48.8967, 2.2567],
  "asnieres-sur-seine": [48.9134, 2.2887],
  "colombes": [48.9243, 2.2540],
  "rueil-malmaison": [48.8775, 2.1797],
  "issy-les-moulineaux": [48.8245, 2.2741],
  "levallois-perret": [48.8930, 2.2870],
  "antony": [48.7540, 2.3000],
  "neuilly-sur-seine": [48.8854, 2.2698],
  "noisy-le-grand": [48.8478, 2.5500],
  "noisy-le-sec": [48.8896, 2.4525],
  "cergy": [49.0353, 2.0666],
  "evry": [48.6293, 2.4408],
  "evry-courcouronnes": [48.6293, 2.4408],
  "meaux": [48.9601, 2.8782],
  "chelles": [48.8853, 2.5928],
  "lagny-sur-marne": [48.8730, 2.7170],
  "torcy": [48.8500, 2.6500],
  "bussy-saint-georges": [48.8400, 2.7000],
  "champs-sur-marne": [48.8470, 2.5950],
  "pontault-combault": [48.7903, 2.6094],
  "coulommiers": [48.8164, 3.0808],
  "provins": [48.5594, 3.2989],
  "fontainebleau": [48.4046, 2.7012],
  "melun": [48.5414, 2.6620],
  "pontoise": [49.0489, 2.1019],
  "saint-germain-en-laye": [48.8979, 2.0935],
  "aulnay-sous-bois": [48.9333, 2.5000],
  "champigny-sur-marne": [48.8166, 2.5111],
  "saint-maur-des-fosses": [48.7989, 2.4922],
  "drancy": [48.9234, 2.4453],
  "issy": [48.8245, 2.2741],
  "puteaux": [48.8841, 2.2384],
  "bezons": [48.9276, 2.2126],
  "houilles": [48.9237, 2.1955],
  "sartrouville": [48.9389, 2.1620],
  "poissy": [48.9292, 2.0376],
  "mantes-la-jolie": [48.9905, 1.7196],
  "rambouillet": [48.6444, 1.8294],
  "trappes": [48.7747, 2.0118],
  "elancourt": [48.7755, 1.9568],
  "plaisir": [48.8181, 1.9447],
  "mantes-la-ville": [48.9750, 1.7136],
  "conflans-sainte-honorine": [48.9989, 2.0996],
  "andresy": [48.9826, 2.0560],
  "achere": [48.9659, 2.0734],
  "achères": [48.9659, 2.0734],
  "saint-cloud": [48.8418, 2.2173],
  "garches": [48.8424, 2.1860],
  "vaucresson": [48.8410, 2.1430],
  "marnes-la-coquette": [48.8267, 2.1742],
  "ville-d-avray": [48.8267, 2.1842],
  "sevres": [48.8232, 2.2106],
  "meudon": [48.8137, 2.2353],
  "clamart": [48.8016, 2.2624],
  "chatillon": [48.7989, 2.2914],
  "fontenay-aux-roses": [48.7896, 2.2934],
  "bagneux": [48.7969, 2.3097],
  "cachan": [48.7913, 2.3331],
  "arcueil": [48.8067, 2.3354],
  "gentilly": [48.8156, 2.3450],
  "le-kremlin-bicetre": [48.8131, 2.3585],
  "ivry-sur-seine": [48.8132, 2.3879],
  "alfortville": [48.8045, 2.4189],
  "maisons-alfort": [48.8047, 2.4393],
  "saint-mande": [48.8398, 2.4189],
  "vincennes": [48.8470, 2.4376],
  "saint-mandé": [48.8398, 2.4189],
  "fontenay-sous-bois": [48.8493, 2.4763],
  "rosny-sous-bois": [48.8731, 2.4836],
  "le-perreux-sur-marne": [48.8408, 2.5037],
  "nogent-sur-marne": [48.8362, 2.4853],
  "bondy": [48.9027, 2.4860],
  "le-blanc-mesnil": [48.9375, 2.4666],
  "pantin": [48.8946, 2.4022],
  "bobigny": [48.9020, 2.4408],
  "stains": [48.9533, 2.3859],
  "epinay-sur-seine": [48.9544, 2.3104],
  "villepinte": [48.9619, 2.5417],
  "tremblay-en-france": [48.9747, 2.5683],
  "sevran": [48.9377, 2.5326],
  "le-raincy": [48.8950, 2.5160],
  "livry-gargan": [48.9197, 2.5366],
  "noisy": [48.8478, 2.5500],
  "pierrefitte-sur-seine": [48.9657, 2.3625],
  "villetaneuse": [48.9533, 2.3429],
  "deuil-la-barre": [48.9836, 2.3273],
  "montmorency": [48.9897, 2.3257],
  "soisy-sous-montmorency": [48.9908, 2.3015],
  "enghien-les-bains": [48.9694, 2.3088],
  "argenteuil-cedex": [48.9474, 2.2474],
  "garges-les-gonesse": [48.9728, 2.4071],
  "gonesse": [48.9870, 2.4470],
  "sarcelles": [48.9881, 2.3793],
  "goussainville": [49.0238, 2.4694],
  "louvres": [49.0455, 2.5104],
  "fosses": [49.0978, 2.4988],
  "luzarches": [49.1184, 2.4180],
  "ezanville": [49.0306, 2.3658],
  "moisselles": [49.0344, 2.3530],
  "domont": [49.0286, 2.3306],
  "saint-brice-sous-foret": [48.9981, 2.3611],
  "piscop": [49.0090, 2.3413],
  "andilly": [49.0094, 2.3057],
  "margency": [48.9986, 2.3014],
  "eaubonne": [48.9929, 2.2843],
  "ermont": [48.9890, 2.2607],
  "franconville": [48.9881, 2.2299],
  "sannois": [48.9719, 2.2649],
  "saint-gratien": [48.9712, 2.2880],
  "longjumeau": [48.6981, 2.2925],
  "massy": [48.7269, 2.2722],
  "palaiseau": [48.7144, 2.2453],
  "orsay": [48.6993, 2.1873],
  "gif-sur-yvette": [48.6997, 2.1357],
  "bures-sur-yvette": [48.6975, 2.1632],
  "saclay": [48.7307, 2.1722],
  "verrieres-le-buisson": [48.7508, 2.2658],
  "bievres": [48.7567, 2.2114],
  "jouy-en-josas": [48.7625, 2.1683],
  "guyancourt": [48.7686, 2.0716],
  "voisins-le-bretonneux": [48.7592, 2.0432],
  "magny-les-hameaux": [48.7333, 2.0667],
  "saint-quentin-en-yvelines": [48.7702, 2.0167],
  "montigny-le-bretonneux": [48.7686, 2.0317],
  "le-mesnil-saint-denis": [48.7456, 1.9492],
  "chevreuse": [48.7080, 2.0397],
  "saint-remy-les-chevreuse": [48.7081, 2.0700],
  "limours": [48.6464, 2.0747],
  "dourdan": [48.5311, 2.0119],
  "etampes": [48.4344, 2.1614],
  "corbeil-essonnes": [48.6126, 2.4827],
  "savigny-sur-orge": [48.6814, 2.3477],
  "athis-mons": [48.7042, 2.3911],
  "viry-chatillon": [48.6731, 2.3739],
  "morsang-sur-orge": [48.6603, 2.3434],
  "sainte-genevieve-des-bois": [48.6356, 2.3414],
  "epinay-sur-orge": [48.6692, 2.3225],
  "longpont-sur-orge": [48.6594, 2.2999],
  "montlhery": [48.6391, 2.2733],
  "marcoussis": [48.6395, 2.2347],
  "nozay": [48.6611, 2.2436],
  "villebon-sur-yvette": [48.6975, 2.2308],
  "champlan": [48.7117, 2.2811],
  "chilly-mazarin": [48.7039, 2.3097],
  "wissous": [48.7400, 2.3247],
  "rungis": [48.7464, 2.3514],
  "fresnes": [48.7575, 2.3236],
  "antony-cedex": [48.7540, 2.3000],

  // ═══════════ Sud-Est / Côte d'Azur ═══════════
  "cannes": [43.5528, 7.0174],
  "cannes-la-bocca": [43.5474, 6.9961],
  "le-cannet": [43.5764, 7.0186],
  "mougins": [43.6000, 7.0000],
  "mandelieu-la-napoule": [43.5466, 6.9355],
  "mandelieu-le-napoule": [43.5466, 6.9355],
  "mandelieu": [43.5466, 6.9355],
  "la-napoule": [43.5253, 6.9408],
  "nice": [43.7102, 7.2620],
  "antibes": [43.5808, 7.1239],
  "vallauris": [43.5800, 7.0500],
  "juan-les-pins": [43.5675, 7.1059],
  "grasse": [43.6584, 6.9224],
  "menton": [43.7765, 7.5051],
  "monaco": [43.7384, 7.4246],
  "monte-carlo": [43.7406, 7.4276],
  "roquefort-les-pins": [43.6597, 7.0011],
  "valbonne": [43.6403, 7.0080],
  "biot": [43.6303, 7.0925],
  "villeneuve-loubet": [43.6586, 7.1230],
  "cagnes-sur-mer": [43.6644, 7.1486],
  "saint-laurent-du-var": [43.6699, 7.1768],
  "auribeau-sur-siagne": [43.6056, 6.9133],
  "pegomas": [43.6011, 6.9322],
  "la-roquette-sur-siagne": [43.5778, 6.9450],
  "theoule-sur-mer": [43.5083, 6.9417],
  "marseille": [43.2965, 5.3698],
  "aix-en-provence": [43.5297, 5.4474],
  "marignane": [43.4172, 5.2156],
  "vitrolles": [43.4598, 5.2475],
  "martigues": [43.4054, 5.0518],
  "salon-de-provence": [43.6402, 5.0974],
  "aubagne": [43.2932, 5.5705],
  "la-ciotat": [43.1748, 5.6065],
  "cassis": [43.2151, 5.5378],
  "istres": [43.5135, 4.9904],
  "miramas": [43.5828, 5.0011],
  "toulon": [43.1242, 5.9280],
  "la-seyne-sur-mer": [43.1009, 5.8806],
  "six-fours-les-plages": [43.0931, 5.8398],
  "hyeres": [43.1205, 6.1286],
  "draguignan": [43.5380, 6.4661],
  "frejus": [43.4332, 6.7370],
  "saint-raphael": [43.4250, 6.7689],
  "sainte-maxime": [43.3088, 6.6395],
  "saint-tropez": [43.2728, 6.6406],
  "avignon": [43.9493, 4.8055],
  "orange": [44.1379, 4.8088],
  "carpentras": [44.0552, 5.0490],
  "cavaillon": [43.8367, 5.0396],
  "apt": [43.8769, 5.3956],
  "nimes": [43.8367, 4.3601],
  "ales": [44.1262, 4.0832],
  "bagnols-sur-ceze": [44.1592, 4.6182],
  "montpellier": [43.6108, 3.8767],
  "beziers": [43.3450, 3.2200],
  "sete": [43.4047, 3.6970],
  "perpignan": [42.6886, 2.8946],
  "narbonne": [43.1837, 3.0036],
  "carcassonne": [43.2129, 2.3491],
  "albi": [43.9298, 2.1480],

  // ═══════════ Sud-Ouest ═══════════
  "toulouse": [43.6047, 1.4442],
  "blagnac": [43.6356, 1.3914],
  "colomiers": [43.6109, 1.3325],
  "tournefeuille": [43.5837, 1.3411],
  "muret": [43.4633, 1.3273],
  "montauban": [44.0181, 1.3550],
  "agen": [44.2046, 0.6263],
  "bordeaux": [44.8378, -0.5792],
  "merignac": [44.8358, -0.6440],
  "pessac": [44.8067, -0.6311],
  "talence": [44.8092, -0.5928],
  "begles": [44.8073, -0.5478],
  "le-bouscat": [44.8650, -0.5895],
  "bruges": [44.8829, -0.5917],
  "biarritz": [43.4832, -1.5586],
  "bayonne": [43.4929, -1.4748],
  "anglet": [43.4815, -1.5180],
  "pau": [43.2951, -0.3708],
  "tarbes": [43.2330, 0.0719],
  "lourdes": [43.0915, -0.0467],
  "dax": [43.7102, -1.0521],
  "mont-de-marsan": [43.8924, -0.5006],
  "rodez": [44.3504, 2.5750],

  // ═══════════ Ouest / Bretagne / Pays de la Loire ═══════════
  "nantes": [47.2184, -1.5536],
  "saint-herblain": [47.2191, -1.6502],
  "reze": [47.1858, -1.5500],
  "saint-nazaire": [47.2734, -2.2128],
  "la-baule": [47.2860, -2.3934],
  "la-baule-escoublac": [47.2860, -2.3934],
  "pornic": [47.1138, -2.1014],
  "challans": [46.8456, -1.8761],
  "les-sables-d-olonne": [46.4970, -1.7836],
  "la-roche-sur-yon": [46.6705, -1.4260],
  "cholet": [47.0606, -0.8782],
  "saumur": [47.2599, -0.0769],
  "rennes": [48.1173, -1.6778],
  "saint-malo": [48.6500, -2.0264],
  "dinan": [48.4538, -2.0466],
  "vannes": [47.6582, -2.7608],
  "lorient": [47.7480, -3.3700],
  "quimper": [48.0000, -4.0972],
  "brest": [48.3905, -4.4860],
  "saint-brieuc": [48.5141, -2.7660],
  "lannion": [48.7341, -3.4596],
  "morlaix": [48.5790, -3.8281],
  "ploemeur": [47.7383, -3.4283],
  "concarneau": [47.8743, -3.9210],
  "auray": [47.6647, -2.9851],
  "angers": [47.4784, -0.5632],
  "le-mans": [48.0061, 0.1996],
  "tours": [47.3941, 0.6848],
  "orleans": [47.9029, 1.9039],
  "blois": [47.5859, 1.3350],
  "chartres": [48.4470, 1.4886],
  "bourges": [47.0810, 2.3989],
  "chateauroux": [46.8131, 1.6920],
  "la-rochelle": [46.1591, -1.1520],
  "rochefort": [45.9412, -0.9580],
  "poitiers": [46.5802, 0.3404],
  "niort": [46.3239, -0.4570],
  "saintes": [45.7458, -0.6328],
  "angouleme": [45.6484, 0.1562],
  "cognac": [45.6952, -0.3304],

  // ═══════════ Nord / Normandie / Picardie ═══════════
  "lille": [50.6292, 3.0573],
  "roubaix": [50.6927, 3.1746],
  "tourcoing": [50.7236, 3.1606],
  "villeneuve-d-ascq": [50.6188, 3.1432],
  "wattrelos": [50.7037, 3.2169],
  "marcq-en-baroeul": [50.6700, 3.1000],
  "loos": [50.6125, 3.0173],
  "dunkerque": [51.0344, 2.3768],
  "calais": [50.9513, 1.8587],
  "boulogne-sur-mer": [50.7264, 1.6147],
  "saint-omer": [50.7475, 2.2598],
  "arras": [50.2911, 2.7780],
  "lens": [50.4319, 2.8316],
  "bethune": [50.5294, 2.6386],
  "douai": [50.3714, 3.0800],
  "valenciennes": [50.3580, 3.5232],
  "cambrai": [50.1761, 3.2363],
  "maubeuge": [50.2786, 3.9701],
  "amiens": [49.8941, 2.2957],
  "abbeville": [50.1054, 1.8369],
  "compiegne": [49.4148, 2.8266],
  "beauvais": [49.4295, 2.0809],
  "creil": [49.2589, 2.4775],
  "soissons": [49.3814, 3.3232],
  "laon": [49.5642, 3.6230],
  "saint-quentin": [49.8489, 3.2875],
  "rouen": [49.4431, 1.0993],
  "le-havre": [49.4944, 0.1079],
  "dieppe": [49.9229, 1.0769],
  "evreux": [49.0240, 1.1510],
  "vernon": [49.0936, 1.4853],
  "louviers": [49.2150, 1.1700],
  "caen": [49.1829, -0.3707],
  "lisieux": [49.1442, 0.2272],
  "bayeux": [49.2764, -0.7050],
  "cherbourg": [49.6337, -1.6221],
  "cherbourg-en-cotentin": [49.6337, -1.6221],
  "saint-lo": [49.1146, -1.0890],
  "alencon": [48.4316, 0.0918],

  // ═══════════ Est / Grand-Est ═══════════
  "strasbourg": [48.5734, 7.7521],
  "schiltigheim": [48.6097, 7.7444],
  "haguenau": [48.8167, 7.7900],
  "saverne": [48.7397, 7.3622],
  "selestat": [48.2603, 7.4528],
  "metz": [49.1193, 6.1757],
  "thionville": [49.3578, 6.1689],
  "forbach": [49.1894, 6.9011],
  "sarreguemines": [49.1106, 7.0676],
  "nancy": [48.6921, 6.1844],
  "vandoeuvre-les-nancy": [48.6553, 6.1700],
  "luneville": [48.5928, 6.4953],
  "epinal": [48.1735, 6.4498],
  "saint-die-des-vosges": [48.2839, 6.9492],
  "mulhouse": [47.7508, 7.3359],
  "colmar": [48.0794, 7.3585],
  "altkirch": [47.6242, 7.2453],
  "reims": [49.2583, 4.0317],
  "chalons-en-champagne": [48.9569, 4.3653],
  "epernay": [49.0436, 3.9603],
  "troyes": [48.2973, 4.0744],
  "charleville-mezieres": [49.7714, 4.7268],
  "sedan": [49.7019, 4.9442],
  "dijon": [47.3220, 5.0415],
  "chenove": [47.2864, 5.0133],
  "beaune": [47.0247, 4.8403],
  "macon": [46.3083, 4.8290],
  "chalon-sur-saone": [46.7806, 4.8536],
  "besancon": [47.2378, 6.0241],
  "montbeliard": [47.5103, 6.7989],
  "belfort": [47.6379, 6.8628],
  "lons-le-saunier": [46.6747, 5.5544],

  // ═══════════ Centre / Auvergne / Rhône-Alpes ═══════════
  "lyon": [45.7640, 4.8357],
  "villeurbanne": [45.7665, 4.8795],
  "venissieux": [45.6970, 4.8853],
  "vaulx-en-velin": [45.7770, 4.9189],
  "bron": [45.7387, 4.9131],
  "saint-priest": [45.6975, 4.9444],
  "caluire-et-cuire": [45.7956, 4.8478],
  "givors": [45.5897, 4.7686],
  "decines-charpieu": [45.7686, 4.9603],
  "meyzieu": [45.7708, 5.0042],
  "rillieux-la-pape": [45.8189, 4.8997],
  "tassin-la-demi-lune": [45.7642, 4.7886],
  "francheville": [45.7339, 4.7639],
  "ecully": [45.7783, 4.7800],
  "oullins": [45.7142, 4.8081],
  "pierre-benite": [45.7036, 4.8181],
  "irigny": [45.6797, 4.8175],
  "feyzin": [45.6736, 4.8569],
  "corbas": [45.6736, 4.9094],
  "mions": [45.6700, 4.9500],
  "saint-genis-laval": [45.6961, 4.7956],
  "brignais": [45.6700, 4.7600],
  "grigny": [45.6128, 4.7886],
  "vienne": [45.5256, 4.8742],
  "grenoble": [45.1885, 5.7245],
  "echirolles": [45.1497, 5.7136],
  "saint-martin-d-heres": [45.1681, 5.7642],
  "fontaine": [45.1936, 5.6856],
  "voiron": [45.3672, 5.5908],
  "saint-etienne": [45.4397, 4.3872],
  "roanne": [46.0364, 4.0700],
  "le-puy-en-velay": [45.0428, 3.8852],
  "annecy": [45.8992, 6.1294],
  "annecy-le-vieux": [45.9203, 6.1431],
  "chambery": [45.5646, 5.9178],
  "aix-les-bains": [45.6886, 5.9156],
  "albertville": [45.6753, 6.3924],
  "thonon-les-bains": [46.3719, 6.4783],
  "evian-les-bains": [46.4012, 6.5891],
  "cluses": [46.0594, 6.5811],
  "sallanches": [45.9358, 6.6311],
  "chamonix-mont-blanc": [45.9237, 6.8694],
  "passy": [45.9242, 6.6914],
  "clermont-ferrand": [45.7772, 3.0870],
  "vichy": [46.1280, 3.4264],
  "moulins": [46.5650, 3.3336],
  "montlucon": [46.3408, 2.6033],
  "aurillac": [44.9279, 2.4444],
  "limoges": [45.8336, 1.2611],
  "brive-la-gaillarde": [45.1591, 1.5331],
  "valence": [44.9332, 4.8920],
  "romans-sur-isere": [45.0497, 5.0531],
  "montelimar": [44.5556, 4.7503],
  "privas": [44.7350, 4.5994],
  "annonay": [45.2406, 4.6697],
  "guilherand-granges": [44.9367, 4.8847],

  // ═══════════ Seine-et-Marne (77) · petites communes ═══════════
  "lieusaint": [48.6336, 2.5494],
  "saint-pathus": [49.0667, 2.7833],
  "marchemoret": [49.0500, 2.8167],
  "vendrest": [48.9833, 3.0833],
  "vinantes": [49.0167, 2.8833],
  "saint-soupplets": [49.0500, 2.8333],
  "saint-mesmes": [48.9667, 2.7333],
  "claye-souilly": [48.9444, 2.6964],
  "villeparisis": [48.9472, 2.6092],
  "mitry-mory": [48.9833, 2.6167],
  "thorigny-sur-marne": [48.8814, 2.7211],
  "pomponne": [48.8800, 2.7000],
  "dampmart": [48.8867, 2.7400],
  "carnetin": [48.8867, 2.7100],
  "saint-thibault-des-vignes": [48.8639, 2.6878],
  "vaires-sur-marne": [48.8806, 2.6383],
  "brou-sur-chantereine": [48.8861, 2.6261],
  "pontcarre": [48.8167, 2.7000],
  "ozoir-la-ferriere": [48.7728, 2.6878],
  "roissy-en-brie": [48.7919, 2.6516],
  "emerainville": [48.8167, 2.6333],
  "noisiel": [48.8528, 2.6333],
  "lognes": [48.8378, 2.6308],
  "croissy-beaubourg": [48.8167, 2.6500],
  "ferrieres-en-brie": [48.8000, 2.7000],
  "bailly-romainvilliers": [48.8431, 2.7850],
  "magny-le-hongre": [48.8767, 2.8181],
  "serris": [48.8431, 2.7872],
  "chessy": [48.8650, 2.7717],
  "coupvray": [48.8889, 2.7894],
  "chalifert": [48.8825, 2.7531],
  "esbly": [48.9117, 2.8042],
  "trilport": [48.9586, 2.9192],
  "varreddes": [48.9686, 2.9258],
  "isles-les-meldeuses": [49.0028, 2.9647],
  "germigny-l-eveque": [48.9747, 2.9358],
  "nanteuil-les-meaux": [48.9347, 2.8983],
  "fublaines": [48.9594, 2.9419],
  "boutigny": [48.9533, 2.9967],
  "ussy-sur-marne": [48.9617, 3.0367],
  "jouarre": [48.9111, 3.1306],
  "la-ferte-sous-jouarre": [48.9525, 3.1242],
  "rebais": [48.8500, 3.2167],
  "tournan-en-brie": [48.7444, 2.7717],
  "presles-en-brie": [48.7333, 2.7500],
  "fontenay-tresigny": [48.7117, 2.8889],
  "rozay-en-brie": [48.6781, 2.9603],
  "mormant": [48.6111, 2.8861],
  "guignes": [48.6353, 2.7956],
  "verneuil-l-etang": [48.6361, 2.8508],
  "vaux-le-penil": [48.5278, 2.6883],
  "le-mee-sur-seine": [48.5358, 2.6431],
  "dammarie-les-lys": [48.5167, 2.6500],
  "savigny-le-temple": [48.5836, 2.5811],
  "nandy": [48.5658, 2.5828],
  "cesson": [48.5694, 2.5994],
  "vert-saint-denis": [48.5817, 2.6047],
  "moissy-cramayel": [48.6258, 2.5950],
  "combs-la-ville": [48.6694, 2.5519],
  "brie-comte-robert": [48.6886, 2.6042],
  "servon": [48.7042, 2.5739],
  "santeny": [48.7250, 2.5806],

  // ═══════════ Oise (60) · communes proches IDF ═══════════
  "chambly": [49.1696, 2.2400],
  "persan": [49.1500, 2.2731],
  "beaumont-sur-oise": [49.1411, 2.2853],
  "isle-adam": [49.1108, 2.2300],
  "l-isle-adam": [49.1108, 2.2300],
  "presles": [49.1133, 2.2828],
  "beaumont": [49.1411, 2.2853],
  "neuilly-en-thelle": [49.2167, 2.2833],
  "mery-sur-oise": [49.0683, 2.1928],
  "saint-leu-d-esserent": [49.2167, 2.4333],
  "precy-sur-oise": [49.1750, 2.3833],
  "boran-sur-oise": [49.1500, 2.4167],
  "gouvieux": [49.1933, 2.4517],
  "lamorlaye": [49.1639, 2.4467],
  "coye-la-foret": [49.1500, 2.4833],
  "asnieres-sur-oise": [49.1333, 2.4167],
  "viarmes": [49.1000, 2.3667],
  "luzarches-cedex": [49.1184, 2.4180],

  // ═══════════ Val d'Oise (95) · plus de communes ═══════════
  "taverny": [49.0264, 2.2178],
  "bessancourt": [49.0344, 2.2050],
  "frepillon": [49.0419, 2.2089],
  "saint-leu-la-foret": [49.0150, 2.2461],
  "le-plessis-bouchard": [48.9928, 2.2356],
  "montigny-les-cormeilles": [48.9794, 2.2025],
  "cormeilles-en-parisis": [48.9667, 2.2000],
  "la-frette-sur-seine": [48.9750, 2.1761],
  "herblay": [48.9886, 2.1656],
  "herblay-sur-seine": [48.9886, 2.1656],
  "pierrelaye": [49.0214, 2.1567],
  "saint-ouen-l-aumone": [49.0428, 2.1078],
  "jouy-le-moutier": [49.0167, 2.0500],
  "vaureal": [49.0258, 2.0317],
  "courdimanche": [49.0381, 2.0125],
  "puiseux-pontoise": [49.0506, 1.9881],
  "menucourt": [49.0306, 1.9889],
  "boisemont": [49.0386, 2.0028],
  "ennery": [49.0814, 2.0731],
  "osny": [49.0625, 2.0703],
  "eragny": [49.0192, 2.1011],
  "neuville-sur-oise": [49.0167, 2.0833],
  "le-thillay": [48.9989, 2.4736],
  "vemars": [49.0333, 2.5333],
  "bouqueval": [49.0167, 2.4500],
  "ecouen": [49.0214, 2.3800],
  "saint-witz": [49.0667, 2.5667],
  "fontenay-en-parisis": [49.0500, 2.4333],

  // ═══════════ Autres villes utiles ═══════════
  "senlis": [49.2065, 2.5856],
  "chantilly": [49.1936, 2.4814],
  "creil-cedex": [49.2589, 2.4775],
  "nogent-sur-oise": [49.2667, 2.4719],
  "montataire": [49.2592, 2.4361],
  "agde": [43.3092, 3.4778],
  "le-cap-d-agde": [43.2867, 3.5067],
  "vence": [43.7211, 7.1119],
  "saint-paul-de-vence": [43.6967, 7.1217],
  "tourrettes-sur-loup": [43.7117, 7.0586],
  "carros": [43.7889, 7.1858],
  "drap": [43.7589, 7.3206],
  "contes": [43.8086, 7.3158],
  "levens": [43.8567, 7.2247],
};

// ═══════════ Centroïdes département (fallback via code postal) ═══════════
const DEPARTMENT_COORDS: Record<string, [number, number]> = {
  "01": [46.2044, 5.2256], // Ain → Bourg-en-Bresse
  "02": [49.5641, 3.6228], // Aisne → Laon
  "03": [46.5650, 3.3336], // Allier → Moulins
  "04": [44.0978, 6.2350], // Alpes-de-Haute-Provence → Digne-les-Bains
  "05": [44.5602, 6.0793], // Hautes-Alpes → Gap
  "06": [43.7102, 7.2620], // Alpes-Maritimes → Nice
  "07": [44.7350, 4.5994], // Ardèche → Privas
  "08": [49.7714, 4.7268], // Ardennes → Charleville-Mézières
  "09": [42.9637, 1.6045], // Ariège → Foix
  "10": [48.2973, 4.0744], // Aube → Troyes
  "11": [43.2129, 2.3491], // Aude → Carcassonne
  "12": [44.3504, 2.5750], // Aveyron → Rodez
  "13": [43.2965, 5.3698], // Bouches-du-Rhône → Marseille
  "14": [49.1829, -0.3707], // Calvados → Caen
  "15": [44.9279, 2.4444], // Cantal → Aurillac
  "16": [45.6484, 0.1562], // Charente → Angoulême
  "17": [46.1591, -1.1520], // Charente-Maritime → La Rochelle
  "18": [47.0810, 2.3989], // Cher → Bourges
  "19": [45.2671, 1.7727], // Corrèze → Tulle
  "2a": [41.9192, 8.7386], // Corse-du-Sud → Ajaccio
  "2b": [42.6985, 9.4502], // Haute-Corse → Bastia
  "21": [47.3220, 5.0415], // Côte-d'Or → Dijon
  "22": [48.5141, -2.7660], // Côtes-d'Armor → Saint-Brieuc
  "23": [46.1709, 1.8755], // Creuse → Guéret
  "24": [45.1842, 0.7218], // Dordogne → Périgueux
  "25": [47.2378, 6.0241], // Doubs → Besançon
  "26": [44.9332, 4.8920], // Drôme → Valence
  "27": [49.0240, 1.1510], // Eure → Évreux
  "28": [48.4470, 1.4886], // Eure-et-Loir → Chartres
  "29": [48.0000, -4.0972], // Finistère → Quimper
  "30": [43.8367, 4.3601], // Gard → Nîmes
  "31": [43.6047, 1.4442], // Haute-Garonne → Toulouse
  "32": [43.6469, 0.5859], // Gers → Auch
  "33": [44.8378, -0.5792], // Gironde → Bordeaux
  "34": [43.6108, 3.8767], // Hérault → Montpellier
  "35": [48.1173, -1.6778], // Ille-et-Vilaine → Rennes
  "36": [46.8131, 1.6920], // Indre → Châteauroux
  "37": [47.3941, 0.6848], // Indre-et-Loire → Tours
  "38": [45.1885, 5.7245], // Isère → Grenoble
  "39": [46.6747, 5.5544], // Jura → Lons-le-Saunier
  "40": [43.8924, -0.5006], // Landes → Mont-de-Marsan
  "41": [47.5859, 1.3350], // Loir-et-Cher → Blois
  "42": [45.4397, 4.3872], // Loire → Saint-Étienne
  "43": [45.0428, 3.8852], // Haute-Loire → Le Puy-en-Velay
  "44": [47.2184, -1.5536], // Loire-Atlantique → Nantes
  "45": [47.9029, 1.9039], // Loiret → Orléans
  "46": [44.4475, 1.4411], // Lot → Cahors
  "47": [44.2046, 0.6263], // Lot-et-Garonne → Agen
  "48": [44.5180, 3.5012], // Lozère → Mende
  "49": [47.4784, -0.5632], // Maine-et-Loire → Angers
  "50": [49.1146, -1.0890], // Manche → Saint-Lô
  "51": [49.2583, 4.0317], // Marne → Reims
  "52": [48.1118, 5.1382], // Haute-Marne → Chaumont
  "53": [48.0686, -0.7706], // Mayenne → Laval
  "54": [48.6921, 6.1844], // Meurthe-et-Moselle → Nancy
  "55": [49.1597, 5.3851], // Meuse → Bar-le-Duc
  "56": [47.6582, -2.7608], // Morbihan → Vannes
  "57": [49.1193, 6.1757], // Moselle → Metz
  "58": [46.9933, 3.1564], // Nièvre → Nevers
  "59": [50.6292, 3.0573], // Nord → Lille
  "60": [49.4295, 2.0809], // Oise → Beauvais
  "61": [48.4316, 0.0918], // Orne → Alençon
  "62": [50.2911, 2.7780], // Pas-de-Calais → Arras
  "63": [45.7772, 3.0870], // Puy-de-Dôme → Clermont-Ferrand
  "64": [43.2951, -0.3708], // Pyrénées-Atlantiques → Pau
  "65": [43.2330, 0.0719], // Hautes-Pyrénées → Tarbes
  "66": [42.6886, 2.8946], // Pyrénées-Orientales → Perpignan
  "67": [48.5734, 7.7521], // Bas-Rhin → Strasbourg
  "68": [47.7508, 7.3359], // Haut-Rhin → Mulhouse
  "69": [45.7640, 4.8357], // Rhône → Lyon
  "70": [47.6238, 6.1567], // Haute-Saône → Vesoul
  "71": [46.7806, 4.8536], // Saône-et-Loire → Chalon-sur-Saône
  "72": [48.0061, 0.1996], // Sarthe → Le Mans
  "73": [45.5646, 5.9178], // Savoie → Chambéry
  "74": [45.8992, 6.1294], // Haute-Savoie → Annecy
  "75": [48.8566, 2.3522], // Paris
  "76": [49.4431, 1.0993], // Seine-Maritime → Rouen
  "77": [48.5414, 2.6620], // Seine-et-Marne → Melun
  "78": [48.8014, 2.1301], // Yvelines → Versailles
  "79": [46.3239, -0.4570], // Deux-Sèvres → Niort
  "80": [49.8941, 2.2957], // Somme → Amiens
  "81": [43.9298, 2.1480], // Tarn → Albi
  "82": [44.0181, 1.3550], // Tarn-et-Garonne → Montauban
  "83": [43.1242, 5.9280], // Var → Toulon
  "84": [43.9493, 4.8055], // Vaucluse → Avignon
  "85": [46.6705, -1.4260], // Vendée → La Roche-sur-Yon
  "86": [46.5802, 0.3404], // Vienne → Poitiers
  "87": [45.8336, 1.2611], // Haute-Vienne → Limoges
  "88": [48.1735, 6.4498], // Vosges → Épinal
  "89": [47.7986, 3.5672], // Yonne → Auxerre
  "90": [47.6379, 6.8628], // Territoire de Belfort → Belfort
  "91": [48.6126, 2.4827], // Essonne → Évry-Courcouronnes
  "92": [48.8924, 2.2070], // Hauts-de-Seine → Nanterre
  "93": [48.9020, 2.4408], // Seine-Saint-Denis → Bobigny
  "94": [48.7900, 2.4550], // Val-de-Marne → Créteil
  "95": [49.0489, 2.1019], // Val-d'Oise → Pontoise
  // DOM-TOM
  "971": [16.2650, -61.5510], // Guadeloupe → Basse-Terre
  "972": [14.6037, -61.0594], // Martinique → Fort-de-France
  "973": [4.9333, -52.3266], // Guyane → Cayenne
  "974": [-20.8789, 55.4481], // La Réunion → Saint-Denis
  "975": [46.7553, -56.1813], // Saint-Pierre-et-Miquelon
  "976": [-12.7806, 45.2278], // Mayotte → Mamoudzou
};

/**
 * Normalise une chaîne de ville pour matcher dans CITY_COORDS.
 * - Lowercase
 * - Strip accents
 * - Strip code postal en préfixe ("60300 Senlis" → "senlis")
 * - Strip "Cedex", numéros d'arrondissement, etc.
 * - Remplace espaces par tirets
 */
function normalizeCity(raw: string): string {
  return raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/^\d{4,5}\s+/, "") // code postal en début
    .replace(/\s+cedex\s*\d*$/i, "")
    .replace(/\s+\d+e?(?:r|me|er)?\s+arr?(?:ondissement)?$/i, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/**
 * Extrait le département à partir d'un code postal en début de chaîne.
 * Ex : "60300 Senlis" → "60", "97100 Basse-Terre" → "971", "20000 Ajaccio" → "2a"
 */
function deptCodeFromCity(city: string): string | null {
  const match = city.match(/(\d{5})/);
  if (!match) return null;
  const cp = match[1];

  // DOM-TOM (97x)
  if (cp.startsWith("97")) {
    const dom = cp.substring(0, 3);
    if (DEPARTMENT_COORDS[dom]) return dom;
  }

  // Corse : 20000-20199 → 2a, 20200-20999 → 2b
  if (cp.startsWith("20")) {
    const n = parseInt(cp, 10);
    return n < 20200 ? "2a" : "2b";
  }

  const dept = cp.substring(0, 2);
  return DEPARTMENT_COORDS[dept] ? dept : null;
}

/**
 * Retourne les coordonnées d'une ville, ou null si inconnue.
 * Accepte les variations ("Paris", "75000 Paris", "PARIS Cedex 01", etc.).
 *
 * Cascade : exact city → partial city → department centroid → null.
 */
export function coordsForCity(city: string | null | undefined): [number, number] | null {
  if (!city) return null;
  const normalized = normalizeCity(city);
  if (normalized && CITY_COORDS[normalized]) return CITY_COORDS[normalized];

  // Match partiel : "saint-germain-en-laye" matche aussi "saint-germain"
  if (normalized.length >= 4) {
    for (const key of Object.keys(CITY_COORDS)) {
      if (normalized.startsWith(key) || key.startsWith(normalized)) {
        return CITY_COORDS[key];
      }
    }
  }

  // Fallback département via code postal
  const dept = deptCodeFromCity(city);
  if (dept && DEPARTMENT_COORDS[dept]) return DEPARTMENT_COORDS[dept];

  return null;
}
