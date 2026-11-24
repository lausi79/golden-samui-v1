import type { Inquiry, Property } from '../src/types.ts';

const IMG_BOB_DYLAN = '/src/assets/images/villa_bob_dylan_1795277391069.jpg';
const IMG_GRANDE_SIESTA = '/src/assets/images/villa_grande_siesta_1795277392004.jpg';
const IMG_BEACHFRONT = '/src/assets/images/beachfront_apartment_1795277392833.jpg';
const IMG_HERO = '/src/assets/images/hero_samui_villa_1795277391956.jpg';
const IMG_FREEHOLD = '/src/assets/images/villa_freehold_estate_1795277391543.jpg';
const IMG_LONGTERM = '/src/assets/images/villa_longterm_tropical_1795277392815.jpg';

const now = '2026-11-15T10:00:00.000Z';

export const SEED_PROPERTIES: Property[] = [
  // 1. KURZZEIT VERMIETUNG — Rockstar Villas Portfolio (rockstarvillas.com)
  {
    id: 'rv-villa-bob-dylan',
    slug: 'villa-bob-dylan-choeng-mon',
    category: 'short_term',
    status: 'available',
    featured: true,
    sourcePartner: 'Rockstar Villas (rockstarvillas.com)',
    location: 'Choeng Mon',
    title_de: 'Villa Bob Dylan — Panoramic Sea View Pool Villa',
    title_en: 'Villa Bob Dylan — Panoramic Sea View Pool Villa',
    subtitle_de: '3 Schlafzimmer · Privater Infinity-Pool · Hügel über Choeng Mon & Plai Laem',
    subtitle_en: '3 Bedrooms · Private Infinity Pool · Choeng Mon & Plai Laem Hills',
    description_de:
      'Das Flaggschiff aus der Rockstar-Villas-Kollektion thront in den ruhigen Hügeln zwischen Choeng Mon und Plai Laem. Auf zwei lichtdurchfluteten Ebenen genießen bis zu 6 Gäste einen unverbauten Panoramablick über den Golf von Thailand bis nach Koh Phangan. Nur rund 2,6 km vom Big Buddha, Bangrak Beach und dem Flughafen Samui entfernt — inklusive persönlichem Concierge-Service, Flughafentransfer und optionalem Fahrzeugverleih.',
    description_en:
      'The signature residence from the Rockstar Villas collection sits high above the tranquil hills of Choeng Mon and Plai Laem. Across two sunlit levels, up to 6 guests enjoy sweeping ocean views over the Gulf of Thailand toward Koh Phangan. Located roughly 2.6 km from Big Buddha, Bangrak Beach, and Samui Airport, complete with personal concierge care, airport transfer, and car or scooter rental options.',
    highlights_de: [
      'Direktbuchung aus der Rockstar Villas Kollektion',
      'Privater Infinity-Pool mit Teakholz-Sonnendeck',
      'Voll ausgestattete Küche & offener Wohnpavillon',
      'Flughafentransfer, Auto- & Rollerverleih zubuchbar'
    ],
    highlights_en: [
      'Direct booking from the Rockstar Villas collection',
      'Private infinity pool with teak sun deck',
      'Fully equipped kitchen & open-plan living pavilion',
      'Airport transfer, car & motorbike rental available'
    ],
    amenities: ['Infinity Pool', 'Sea View', 'Fiber Wi-Fi', 'Full Kitchen', 'Air Conditioning', 'Private Parking', 'Concierge'],
    bedrooms: 3,
    bathrooms: 4,
    maxGuests: 6,
    livingAreaSqm: 310,
    landAreaSqm: 520,
    priceThb: 14500,
    priceUnit: 'night',
    landTenure: 'not_applicable',
    beachDistanceMeters: 950,
    imageUrl: IMG_BOB_DYLAN,
    galleryUrls: [IMG_BOB_DYLAN, IMG_HERO],
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'rv-villa-grande-siesta',
    slug: 'villa-grande-siesta-bophut',
    category: 'short_term',
    status: 'available',
    featured: true,
    sourcePartner: 'Rockstar Villas (rockstarvillas.com)',
    location: 'Bophut',
    title_de: 'Villa Grande Siesta — Tropische Familien-Poolvilla',
    title_en: 'Villa Grande Siesta — Tropical Family Pool Villa',
    subtitle_de: '4 Schlafzimmer · Großer Privatpool · Tropischer Garten nahe Fisherman’s Village',
    subtitle_en: '4 Bedrooms · Large Private Pool · Tropical Garden near Fisherman’s Village',
    description_de:
      'Großzügige Privatvilla von Rockstar Villas im begehrten Norden Koh Samuis (Bophut / Bangrak). Gewölbte Teakholz-Decken, weitläufige Natursteinterrassen und ein von Frangipani-Bäumen umgebener Pool schaffen die ideale Kulisse für Familien und Freundesgruppen bis 8 Personen. Strand, Pier nach Koh Phangan und das charmante Fisherman’s Village sind in wenigen Minuten erreichbar.',
    description_en:
      'Spacious private residence managed by Rockstar Villas in Koh Samui’s sought-after north (Bophut / Bangrak). Vaulted timber ceilings, natural sandstone terraces, and a large pool framed by frangipani trees offer an effortless retreat for families and groups of up to 8 guests, just minutes from the beach, Bangrak Pier, and Fisherman’s Village.',
    highlights_de: [
      '4 En-Suite-Schlafzimmer für bis zu 8 Gäste',
      'Großzügiger Outdoor-Dining-Pavillon am Pool',
      'Betreuung durch Gastgeber René & Pitchicha vor Ort',
      'Ausflüge, Kochkurse & Kinderbetreuung organisierbar'
    ],
    highlights_en: [
      '4 en-suite bedrooms accommodating up to 8 guests',
      'Expansive poolside outdoor dining pavilion',
      'Dedicated local hosting by René & Pitchicha',
      'Excursions, cooking courses & childcare on request'
    ],
    amenities: ['Private Pool', 'Tropical Garden', 'Outdoor Dining', 'Smart TV', 'Fiber Wi-Fi', 'Concierge', 'Airport Shuttle'],
    bedrooms: 4,
    bathrooms: 4,
    maxGuests: 8,
    livingAreaSqm: 360,
    landAreaSqm: 680,
    priceThb: 16800,
    priceUnit: 'night',
    landTenure: 'not_applicable',
    beachDistanceMeters: 450,
    imageUrl: IMG_GRANDE_SIESTA,
    galleryUrls: [IMG_GRANDE_SIESTA, IMG_LONGTERM],
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'rv-villa-madonna',
    slug: 'villa-madonna-choeng-mon',
    category: 'short_term',
    status: 'available',
    featured: false,
    sourcePartner: 'Rockstar Villas (rockstarvillas.com)',
    location: 'Choeng Mon',
    title_de: 'Villa Madonna — Moderne Design-Poolvilla',
    title_en: 'Villa Madonna — Modern Designer Pool Villa',
    subtitle_de: '3 Schlafzimmer · Ruhige Hanglage · 5 Min. zum Choeng Mon Beach',
    subtitle_en: '3 Bedrooms · Quiet Hillside Setting · 5 Min to Choeng Mon Beach',
    description_de:
      'Stilvolle 3-Schlafzimmer-Villa aus dem Portfolio von Rockstar Villas nahe Choeng Mon. Klare zeitgenössische Architektur trifft auf tropische Gemütlichkeit, perfekt ausgestattete Küche, private Sonnenterrasse und erfrischenden Pool — ideal für erholsame Inseltage abseits des Trubels.',
    description_en:
      'Stylish 3-bedroom residence from Rockstar Villas near Choeng Mon. Clean contemporary architecture meets tropical warmth, featuring a fully equipped kitchen, private sun terrace, and refreshing pool for tranquil island stays.',
    highlights_de: [
      'Nur 5 Fahrminuten zum feinsandigen Choeng Mon Beach',
      'Privater Pool & schattige Lounge-Terrasse',
      'Highspeed-WLAN für entspanntes Remote-Work'
    ],
    highlights_en: [
      'Just 5 minutes to white-sand Choeng Mon Beach',
      'Private pool & shaded outdoor lounge terrace',
      'High-speed Wi-Fi ideal for remote stays'
    ],
    amenities: ['Private Pool', 'Full Kitchen', 'Fiber Wi-Fi', 'Air Conditioning', 'Terrace', 'Parking'],
    bedrooms: 3,
    bathrooms: 3,
    maxGuests: 6,
    livingAreaSqm: 265,
    landAreaSqm: 440,
    priceThb: 12900,
    priceUnit: 'night',
    landTenure: 'not_applicable',
    beachDistanceMeters: 1100,
    imageUrl: IMG_HERO,
    galleryUrls: [IMG_HERO, IMG_BOB_DYLAN],
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'rv-apt-jimi-hendrix',
    slug: 'rockstar-apartment-jimi-hendrix-bangrak',
    category: 'short_term',
    status: 'available',
    featured: true,
    sourcePartner: 'Rockstar Villas (rockstarvillas.com)',
    location: 'Bangrak',
    title_de: 'Rockstar Beach Apartment „Jimi Hendrix“',
    title_en: 'Rockstar Beach Apartment “Jimi Hendrix”',
    subtitle_de: '1 Schlafzimmer · Meerblick-Balkon · Nur 80 m bis zum Bangrak Beach',
    subtitle_en: '1 Bedroom · Seaview Balcony · Only 80m to Bangrak Beach',
    description_de:
      'Charmantes Beachfront-Apartment der Rockstar-Villas-Reihe in Bangrak — nur wenige Schritte vom Sandstrand und dem Bangrak Pier entfernt. Helles Interieur aus warmem Holz und Leinen, private Meerblick-Terrasse, Smart-TV und schnelle Anbindung an Restaurants, Beach Clubs und Fähren nach Koh Phangan.',
    description_en:
      'Bright beachfront suite from Rockstar Villas in Bangrak, just 80 meters from the sandy shore and Bangrak Pier. Features warm oak and linen interiors, a private seaview balcony, Smart TV, and effortless access to beachfront dining and Koh Phangan ferries.',
    highlights_de: [
      '80 bis 150 Meter zum Strand & Bangrak Pier',
      'Privater Balkon mit Blick auf den Golf von Thailand',
      'Für bis zu 3 Gäste · Smart-TV & Küchenzeile'
    ],
    highlights_en: [
      '80 to 150 meters from the beach & Bangrak Pier',
      'Private balcony overlooking the Gulf of Thailand',
      'Sleeps up to 3 guests · Smart TV & kitchenette'
    ],
    amenities: ['Beach Access', 'Sea View', 'Balcony', 'Smart TV', 'Fiber Wi-Fi', 'Air Conditioning'],
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 3,
    livingAreaSqm: 62,
    landAreaSqm: 0,
    priceThb: 3400,
    priceUnit: 'night',
    landTenure: 'not_applicable',
    beachDistanceMeters: 80,
    imageUrl: IMG_BEACHFRONT,
    galleryUrls: [IMG_BEACHFRONT],
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'rv-apt-tina-turner',
    slug: 'rockstar-apartment-tina-turner-bophut',
    category: 'short_term',
    status: 'available',
    featured: false,
    sourcePartner: 'Rockstar Villas (rockstarvillas.com)',
    location: 'Bophut',
    title_de: 'Rockstar Beach Suite „Tina Turner“',
    title_en: 'Rockstar Beach Suite “Tina Turner”',
    subtitle_de: '2 Schlafzimmer · Strandlage Bophut/Bangrak · Pool & Fitnesszugang',
    subtitle_en: '2 Bedrooms · Bophut/Bangrak Beachfront · Pool & Gym Access',
    description_de:
      'Geräumiges 2-Schlafzimmer-Apartment aus dem Rockstar-Villas-Portfolio direkt am Küstenstreifen zwischen Bophut und Bangrak. Ideal für Paare oder kleine Familien, die direkten Strandzugang mit Resort-Annehmlichkeiten wie großem Gemeinschaftspool und Fitnessstudio verbinden möchten.',
    description_en:
      'Spacious 2-bedroom coastal apartment managed by Rockstar Villas along the Bophut–Bangrak shoreline. Ideal for couples or small families seeking direct beach access paired with a large resort swimming pool and fitness facilities.',
    highlights_de: [
      'Direkte Küstenlage zwischen Bophut & Bangrak',
      'Nutzung von großem Resort-Pool & Gym inklusive',
      'Roller- oder Mietwagenservice direkt über das Team'
    ],
    highlights_en: [
      'Prime coastal location between Bophut & Bangrak',
      'Full access to resort lagoon pool & fitness studio',
      'Direct scooter or car rental arrangement via host team'
    ],
    amenities: ['Beach Access', 'Resort Pool', 'Gym', 'Full Kitchen', 'Fiber Wi-Fi', 'Balcony'],
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    livingAreaSqm: 98,
    landAreaSqm: 0,
    priceThb: 4800,
    priceUnit: 'night',
    landTenure: 'not_applicable',
    beachDistanceMeters: 120,
    imageUrl: IMG_BEACHFRONT,
    galleryUrls: [IMG_BEACHFRONT, IMG_GRANDE_SIESTA],
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'rv-condo-michael-jackson',
    slug: 'rockstar-replay-condo-michael-jackson-bophut',
    category: 'short_term',
    status: 'reserved',
    featured: false,
    sourcePartner: 'Rockstar Villas (rockstarvillas.com)',
    location: 'Bophut',
    title_de: 'Rockstar Replay Condo „Michael Jackson“',
    title_en: 'Rockstar Replay Condo “Michael Jackson”',
    subtitle_de: '1 Schlafzimmer · Replay Beachfront Residence · Pool, Tennis & Sauna',
    subtitle_en: '1 Bedroom · Replay Beachfront Residence · Pool, Tennis & Sauna',
    description_de:
      'Beliebtes Rockstar-Condo in der renommierten Replay Residence direkt am Bophut Beach. Fußläufig zu Fisherman’s Village, mit großzügigem Lagunen-Pool, Tennisplatz, Sauna und 24h-Sicherheitsservice — geschätzt von Aktivurlaubern und digitalen Nomaden.',
    description_en:
      'Popular Rockstar suite in the renowned Replay Beachfront Residence in Bophut. Walking distance to Fisherman’s Village with a sprawling lagoon pool, tennis court, sauna, and 24-hour security — favored by active travelers and remote professionals.',
    highlights_de: [
      'Direkter Zugang zum Bophut Beach & Replay Pool',
      'Tennisplatz, Fitnesscenter & Sauna inklusive',
      'Nur 800 m bis Fisherman’s Village'
    ],
    highlights_en: [
      'Direct access to Bophut Beach & Replay lagoon pool',
      'Tennis court, fitness center & sauna included',
      '800m walk to Fisherman’s Village dining'
    ],
    amenities: ['Beach Access', 'Resort Pool', 'Gym', 'Tennis Court', 'Fiber Wi-Fi', '24h Security'],
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    livingAreaSqm: 54,
    landAreaSqm: 0,
    priceThb: 3100,
    priceUnit: 'night',
    landTenure: 'not_applicable',
    beachDistanceMeters: 60,
    imageUrl: IMG_BEACHFRONT,
    galleryUrls: [IMG_BEACHFRONT],
    createdAt: now,
    updatedAt: now
  },

  // 2. LANGZEIT VERMIETUNG
  {
    id: 'lt-siam-horizon-maenam',
    slug: 'siam-horizon-garden-villa-maenam',
    category: 'long_term',
    status: 'available',
    featured: true,
    location: 'Maenam',
    title_de: 'Siam Horizon Garden Villa — Langzeit-Residenz',
    title_en: 'Siam Horizon Garden Villa — Long-Term Residence',
    subtitle_de: '2 Schlafzimmer · Privater Lap-Pool · Inkl. Pool- & Gartenpflege (3–12 Monate)',
    subtitle_en: '2 Bedrooms · Private Lap Pool · Pool & Garden Care Included (3–12 Months)',
    description_de:
      'Ruhig gelegene Tropenvilla im grünen Herzen von Maenam, konzipiert für komfortables Langzeitwohnen und Überwintern auf Koh Samui. Überdachte Teak-Veranda, moderner Wohn- und Arbeitsbereich mit Glasfaser-Internet, privater Salzwasser-Pool sowie wöchentliche Pool- und Gartenpflege bereits im Mietpreis enthalten.',
    description_en:
      'Peaceful tropical residence tucked into Maenam’s palm groves, thoughtfully designed for effortless long-term island living. Features a covered teak dining veranda, dedicated fiber-connected workspace, private saltwater lap pool, and weekly pool & garden maintenance included in the monthly lease.',
    highlights_de: [
      'Mietdauer flexibel ab 3 bis 12+ Monaten',
      'Pool- & Gartenservice sowie Highspeed-Glasfaser inklusive',
      '5 Minuten zum ruhigen Maenam Beach & Santiburi Golf'
    ],
    highlights_en: [
      'Flexible lease terms from 3 to 12+ months',
      'Pool, garden care & fiber internet included',
      '5 minutes to tranquil Maenam Beach & Santiburi Golf'
    ],
    amenities: ['Private Pool', 'Fiber Wi-Fi', 'Workspace', 'Tropical Garden', 'Covered Parking', 'Pool Service Included'],
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    livingAreaSqm: 175,
    landAreaSqm: 420,
    priceThb: 68000,
    priceUnit: 'month',
    landTenure: 'not_applicable',
    beachDistanceMeters: 900,
    imageUrl: IMG_LONGTERM,
    galleryUrls: [IMG_LONGTERM, IMG_GRANDE_SIESTA],
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'lt-bophut-ridge-residence',
    slug: 'bophut-ridge-residence-long-term',
    category: 'long_term',
    status: 'available',
    featured: false,
    location: 'Bophut',
    title_de: 'Bophut Ridge Sea View Residence',
    title_en: 'Bophut Ridge Sea View Residence',
    subtitle_de: '3 Schlafzimmer · Meerblick-Terrasse · Home-Office-Suite · Jahresmiete',
    subtitle_en: '3 Bedrooms · Sea View Terrace · Home Office Suite · Annual Lease',
    description_de:
      'Repräsentative Langzeit-Villa auf den Hügeln von Bophut mit weitem Meerblick, separatem Arbeitszimmer für ortsunabhängiges Arbeiten, überdachtem Doppel-Carport und nur 6 Minuten Fahrzeit zu internationalen Schulen und Supermärkten.',
    description_en:
      'Executive long-term villa in Bophut Hills offering sweeping sea views, an enclosed home office suite for remote executives, covered double parking, and a 6-minute drive to international schools and shopping.',
    highlights_de: [
      'Separates klimatisiertes Home-Office mit Meerblick',
      'Ideal für Expats & Familien · Nahe International School',
      'Langzeitvertrag 6–24 Monate mit transparenten Nebenkosten'
    ],
    highlights_en: [
      'Enclosed air-conditioned home office with ocean view',
      'Ideal for expats & families · Near international schools',
      '6–24 month lease with transparent government utility rates'
    ],
    amenities: ['Infinity Pool', 'Sea View', 'Home Office', 'Fiber Wi-Fi', 'Private Parking', 'Full Kitchen'],
    bedrooms: 3,
    bathrooms: 3,
    maxGuests: 6,
    livingAreaSqm: 290,
    landAreaSqm: 560,
    priceThb: 115000,
    priceUnit: 'month',
    landTenure: 'not_applicable',
    beachDistanceMeters: 1600,
    imageUrl: IMG_BOB_DYLAN,
    galleryUrls: [IMG_BOB_DYLAN, IMG_HERO],
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'lt-lamai-coconut-grove',
    slug: 'lamai-coconut-grove-villa',
    category: 'long_term',
    status: 'available',
    featured: false,
    location: 'Lamai',
    title_de: 'Lamai Coconut Grove Family Villa',
    title_en: 'Lamai Coconut Grove Family Villa',
    subtitle_de: '3 Schlafzimmer · Solar-Backup · Ruhige Palmen-Siedlung in Lamai',
    subtitle_en: '3 Bedrooms · Solar Backup · Quiet Palm Estate in Lamai',
    description_de:
      'Energieeffiziente 3-Schlafzimmer-Villa im Süden Koh Samuis mit eigenem Salzwasser-Pool, Solar-Anlage für niedrige Stromkosten, komplett eingezäuntem Tropengarten und ruhiger Nachbarschaft.',
    description_en:
      'Energy-efficient 3-bedroom villa in Lamai featuring a private saltwater pool, rooftop solar backup reducing monthly electricity costs, walled tropical garden, and serene neighborhood setting.',
    highlights_de: [
      'Solar-System senkt laufende Stromkosten spürbar',
      'Voll eingezäuntes Grundstück — haustierfreundlich',
      '4 Minuten zum Lamai Beach & Wochenmarkt'
    ],
    highlights_en: [
      'Solar power system noticeably lowers monthly utility bills',
      'Fully walled garden — pet-friendly layout',
      '4 minutes to Lamai Beach & local fresh markets'
    ],
    amenities: ['Private Pool', 'Solar Backup', 'Tropical Garden', 'Fiber Wi-Fi', 'Pet Friendly', 'Parking'],
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    livingAreaSqm: 210,
    landAreaSqm: 480,
    priceThb: 82000,
    priceUnit: 'month',
    landTenure: 'not_applicable',
    beachDistanceMeters: 1200,
    imageUrl: IMG_LONGTERM,
    galleryUrls: [IMG_LONGTERM],
    createdAt: now,
    updatedAt: now
  },

  // 3. VERKAUF VON IMMOBILIEN (MIT KAUF ODER MIETE DES GRUNDSTÜCKS)
  {
    id: 'sale-chaweng-noi-cantilever',
    slug: 'chaweng-noi-cantilever-freehold-estate',
    category: 'sale',
    status: 'available',
    featured: true,
    location: 'Chaweng Noi',
    title_de: 'The Chaweng Noi Cantilever Estate (Freehold)',
    title_en: 'The Chaweng Noi Cantilever Estate (Freehold)',
    subtitle_de: '4 Schlafzimmer · 480 m² Wohnfläche · 920 m² Grundstück · Grundstückskauf (Chanote)',
    subtitle_en: '4 Bedrooms · 480 m² Living · 920 m² Land · Land Purchase (Freehold Chanote)',
    description_de:
      'Architektonisches Meisterwerk in den begehrten Höhen von Chaweng Noi mit 270°-Blick über die Bucht. Die Immobilie wird inklusive vollem Grundstückskauf (Freehold mit Chanote-Grundbuchtitel, erwerbbar über thailändische Gesellschaftsstruktur) angeboten. Auskragende Sichtbeton- und Teak-Architektur, versunkene Pool-Lounge, Weinklimaraum und nachgewiesene Vermietungsrendite von 8,4 % p.a.',
    description_en:
      'Architectural landmark in prime Chaweng Noi commanding a 270-degree bay panorama. Offered with full land purchase (Freehold Chanote title deed, structured cleanly via Thai company ownership). Features cantilevered concrete and Burma teak architecture, a sunken poolside fire-pit lounge, climate-controlled wine room, and a documented 8.4% annual rental yield.',
    highlights_de: [
      'Grundstücksoption: Kauf des Grundstücks (Freehold / Chanote Title)',
      '920 m² Panoramagrundstück mit privater Zufahrt',
      'Komplette rechtliche Due Diligence durch Partnerkanzlei auf Samui'
    ],
    highlights_en: [
      'Land Option: Full Land Purchase (Freehold / Chanote Title)',
      '920 m² elevated ocean-view plot with private driveway',
      'Full legal due diligence supported by our Samui law partners'
    ],
    amenities: ['Infinity Pool', 'Sea View', 'Chanote Freehold', 'Sunken Lounge', 'Wine Room', 'Smart Home', 'Private Parking'],
    bedrooms: 4,
    bathrooms: 5,
    maxGuests: 8,
    livingAreaSqm: 480,
    landAreaSqm: 920,
    priceThb: 44500000,
    priceUnit: 'total',
    landTenure: 'freehold',
    beachDistanceMeters: 1400,
    imageUrl: IMG_FREEHOLD,
    galleryUrls: [IMG_FREEHOLD, IMG_HERO],
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'sale-plai-laem-sanctuary',
    slug: 'plai-laem-peninsula-leasehold-villa',
    category: 'sale',
    status: 'available',
    featured: true,
    location: 'Plai Laem',
    title_de: 'Plai Laem Peninsula Sanctuary (Leasehold)',
    title_en: 'Plai Laem Peninsula Sanctuary (Leasehold)',
    subtitle_de: '3 Schlafzimmer · 340 m² Wohnfläche · 650 m² Grundstück · Grundstücksmiete (30+30 Jahre)',
    subtitle_en: '3 Bedrooms · 340 m² Living · 650 m² Land · Land Lease (30+30 Years)',
    description_de:
      'Elegante Neubauvilla auf der Halbinsel Plai Laem — perfekt für internationale Käufer, die Eigentum am Gebäude (House Ownership) mit einer grundbuchlich eingetragenen 30-Jahres-Grundstückspacht (inkl. vertraglicher Verlängerungsoption um weitere 30 Jahre) kombinieren möchten. Sofort bezugsfertig möbliert und mit professionellem Mietmanagement optional kombinierbar.',
    description_en:
      'Elegant newly completed villa on the Plai Laem peninsula — tailored for international buyers seeking direct building ownership paired with a registered 30-year land lease (plus contractual 30-year renewal option). Delivered turnkey furnished with optional full-service holiday rental management.',
    highlights_de: [
      'Grundstücksoption: Miete des Grundstücks (30 Jahre registrierter Leasehold)',
      'Eintragung direkt im persönlichen Namen im Land Department möglich',
      'Schlüsselfertig möbliert inklusive Management-Option'
    ],
    highlights_en: [
      'Land Option: Land Lease (Registered 30-Year Leasehold)',
      'Direct personal-name registration at the Koh Samui Land Office',
      'Turnkey designer furnishings with optional rental management'
    ],
    amenities: ['Infinity Pool', 'Sea View', '30-Year Leasehold', 'Turnkey Furnished', 'Fiber Wi-Fi', 'Private Parking'],
    bedrooms: 3,
    bathrooms: 4,
    maxGuests: 6,
    livingAreaSqm: 340,
    landAreaSqm: 650,
    priceThb: 23800000,
    priceUnit: 'total',
    landTenure: 'leasehold',
    leaseYears: 30,
    beachDistanceMeters: 500,
    imageUrl: IMG_HERO,
    galleryUrls: [IMG_HERO, IMG_BOB_DYLAN],
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'sale-choeng-mon-sunset-ridge',
    slug: 'choeng-mon-sunset-ridge-flexible-tenure',
    category: 'sale',
    status: 'available',
    featured: false,
    location: 'Choeng Mon',
    title_de: 'Choeng Mon Sunset Ridge Villa (Kauf oder Pacht)',
    title_en: 'Choeng Mon Sunset Ridge Villa (Purchase or Lease)',
    subtitle_de: '3 Schlafzimmer · 310 m² Wohnfläche · Grundstückskauf oder -miete flexibel wählbar',
    subtitle_en: '3 Bedrooms · 310 m² Living · Flexible Freehold Purchase or Land Lease',
    description_de:
      'Sonnenverwöhnte Meerblick-Villa in Choeng Mon mit maximaler Flexibilität bei der Erwerbsstruktur: Käufer können wahlweise das Grundstück vollständig erwerben (Freehold / Chanote) oder eine langfristige Grundstücksmiete (30-Jahres-Leasehold mit reduziertem Einstiegskapital) abschließen.',
    description_en:
      'Sun-drenched ocean-view residence in Choeng Mon offering complete flexibility on acquisition structure: buyers may choose full land ownership (Freehold Chanote) or a registered 30-year land lease for streamlined personal ownership and lower initial capital.',
    highlights_de: [
      'Grundstücksoption flexibel: Kauf (Chanote) ODER Miete (30J Leasehold)',
      'Vollständig renoviert 2026 mit Teak-Sonnendeck',
      'Starke Kurzzeit-Auslastung über unser Partnernetzwerk'
    ],
    highlights_en: [
      'Flexible Land Option: Freehold Purchase OR 30-Year Land Lease',
      'Newly upgraded in 2026 with expansive teak sun deck',
      'Proven short-term occupancy track record'
    ],
    amenities: ['Infinity Pool', 'Sea View', 'Flexible Freehold/Leasehold', 'Full Kitchen', 'Air Conditioning', 'Parking'],
    bedrooms: 3,
    bathrooms: 3,
    maxGuests: 6,
    livingAreaSqm: 310,
    landAreaSqm: 580,
    priceThb: 28900000,
    priceUnit: 'total',
    landTenure: 'both',
    leaseYears: 30,
    beachDistanceMeters: 850,
    imageUrl: IMG_BOB_DYLAN,
    galleryUrls: [IMG_BOB_DYLAN, IMG_FREEHOLD],
    createdAt: now,
    updatedAt: now
  }
];

export const SEED_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-1001',
    type: 'short_term_booking',
    propertyId: 'rv-villa-bob-dylan',
    propertyTitle: 'Villa Bob Dylan — Panoramic Sea View Pool Villa',
    propertyCategory: 'short_term',
    name: 'Maximilian Weber',
    email: 'm.weber@atelier-muenchen.de',
    phone: '+49 171 4829103',
    language: 'de',
    checkIn: '2026-12-18',
    checkOut: '2026-12-26',
    guests: 4,
    addOns: ['airport_transfer', 'car_rental'],
    estimatedTotalThb: 116000,
    message: 'Wir landen um 14:20 Uhr am Samui Airport (PG125) und würden gerne den Flughafentransfer sowie einen SUV dazubuchen.',
    status: 'confirmed',
    adminNotes: 'Transfer & Fortuner SUV mit Team Bangrak bestätigt.',
    createdAt: '2026-11-18T09:15:00.000Z',
    updatedAt: '2026-11-18T11:40:00.000Z'
  },
  {
    id: 'inq-1002',
    type: 'viewing',
    propertyId: 'sale-chaweng-noi-cantilever',
    propertyTitle: 'The Chaweng Noi Cantilever Estate (Freehold)',
    propertyCategory: 'sale',
    name: 'Dr. Sophie Lindner',
    email: 'sophie.lindner@zurich-invest.ch',
    phone: '+41 79 310 44 82',
    language: 'de',
    viewingDate: '2026-11-28',
    viewingTime: '11:00',
    viewingFormat: 'in_person',
    preferredTenure: 'freehold',
    message: 'Wir sind nächste Woche auf Koh Samui und möchten das Chanote-Grundstück sowie die Renditeunterlagen vor Ort prüfen.',
    status: 'new',
    adminNotes: '',
    createdAt: '2026-11-20T14:30:00.000Z',
    updatedAt: '2026-11-20T14:30:00.000Z'
  },
  {
    id: 'inq-1003',
    type: 'viewing',
    propertyId: 'lt-siam-horizon-maenam',
    propertyTitle: 'Siam Horizon Garden Villa — Langzeit-Residenz',
    propertyCategory: 'long_term',
    name: 'Oliver Vance',
    email: 'oliver.vance@nordicventures.co.uk',
    phone: '+44 7700 900412',
    language: 'en',
    viewingDate: '2026-11-25',
    viewingTime: '14:00',
    viewingFormat: 'video',
    message: 'Looking for a 6-month lease starting January. Could we do a live WhatsApp/Zoom walkthrough of the workspace and pool?',
    status: 'new',
    adminNotes: '',
    createdAt: '2026-11-21T06:20:00.000Z',
    updatedAt: '2026-11-21T06:20:00.000Z'
  },
  {
    id: 'inq-1004',
    type: 'general_contact',
    name: 'Thomas & Clara Hoffmann',
    email: 'hoffmann.family@gmx.de',
    phone: '+49 152 9083124',
    language: 'de',
    preferredTenure: 'leasehold',
    message: 'Wir interessieren uns für eine Beratung zum Thema Immobilienkauf mit 30-Jahres-Grundstückspacht (Leasehold) im Norden von Koh Samui.',
    status: 'confirmed',
    adminNotes: 'Erstgespräch am Telefon durchgeführt, Exposé zu Plai Laem Sanctuary gesendet.',
    createdAt: '2026-11-19T16:05:00.000Z',
    updatedAt: '2026-11-19T18:10:00.000Z'
  }
];
