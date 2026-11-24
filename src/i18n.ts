import type { Language } from './types';

export const TRANSLATIONS = {
  de: {
    brand: 'Golden Samui Real Estate',
    nav: {
      home: 'Startseite',
      listings: 'Immobilien',
      services: 'Leistungen',
      contact: 'Kontakt',
      admin: 'Admin',
      bookViewing: 'Besichtigung buchen'
    },
    hero: {
      eyebrow: 'Koh Samui · Thailand',
      title: 'Exklusive Villen und Immobilien auf Koh Samui',
      subtitle:
        'Persönliche Beratung für Kurzzeit-Ferienvillen, Langzeitmiete und den sicheren Immobilienkauf mit Grundstückskauf (Freehold) oder Grundstückspacht (Leasehold).',
      primaryCta: 'Immobilien entdecken',
      secondaryCta: 'Direkt anfragen',
      crestCaption: 'In 24k Gold gegossenes Markensiegel · Bophut & Choeng Mon, Koh Samui'
    },
    quickFilter: {
      categoryLabel: 'Kategorie',
      locationLabel: 'Lage auf Koh Samui',
      bedroomsLabel: 'Schlafzimmer',
      searchLabel: 'Suche',
      searchPlaceholder: 'z. B. Bob Dylan, Meerblick...',
      submit: 'Angebote filtern',
      allCategories: 'Alle Kategorien',
      allLocations: 'Ganz Koh Samui',
      anyBeds: 'Beliebig'
    },
    categories: {
      all: 'Alle Angebote',
      short_term: '1. Kurzzeit Vermietung',
      long_term: '2. Langzeit Vermietung',
      sale: '3. Verkauf & Grundstück'
    },
    categoryShort: {
      short_term: 'Kurzzeitmiete',
      long_term: 'Langzeitmiete',
      sale: 'Verkauf'
    },
    tenure: {
      all: 'Alle Grundstücksarten',
      freehold: 'Grundstückskauf (Freehold / Chanote)',
      leasehold: 'Grundstücksmiete (Leasehold 30J)',
      both: 'Kauf oder Miete wählbar',
      not_applicable: 'Vermietung'
    },
    tenureExplainer: {
      title: 'Grundstücksstruktur in Thailand: Kauf vs. Miete',
      freeholdTitle: 'Kauf des Grundstücks (Freehold / Chanote)',
      freeholdDesc:
        'Volles Eigentumsrecht am Grundstück mit offiziellem Chanote-Grundbuchtitel, in der Regel strukturiert über eine thailändische Gesellschaft.',
      leaseholdTitle: 'Miete des Grundstücks (Leasehold)',
      leaseholdDesc:
        'Eigentum am Gebäude im persönlichen Namen kombiniert mit einer amtlich im Land Department eingetragenen 30-Jahres-Pacht inkl. Verlängerungsoption.'
    },
    services: {
      eyebrow: 'Unsere Dienstleistungen',
      title: 'Kompetent vor Ort auf Koh Samui — vom Urlaubsaufenthalt bis zum Eigentum',
      subtitle:
        'Wir verbinden herzliche Gastfreundschaft mit rechtssicherer Immobilienbegleitung für deutsch- und englischsprachige Gäste, Residenten und Investoren.',
      items: [
        {
          num: '01.',
          title: 'Kurzzeit-Vermietung & Concierge',
          desc: 'Ausgewählte Ferienvillen und Strand-Apartments aus unserer Partnerschaft mit Rockstar Villas (rockstarvillas.com) — inklusive Flughafentransfer, Fahrzeugverleih und persönlicher Betreuung vor Ort.',
          action: 'Zur Kurzzeit-Vermietung'
        },
        {
          num: '02.',
          title: 'Langzeit-Vermietung & Ankommen',
          desc: 'Ruhige Poolvillen für 3 bis 24 Monate mit zuverlässigem Glasfaser-Internet, inkludierter Pool- und Gartenpflege sowie transparenten Nebenkosten für Expats und Überwinterer.',
          action: 'Zur Langzeit-Vermietung'
        },
        {
          num: '03.',
          title: 'Immobilienverkauf: Grundstückskauf oder -miete',
          desc: 'Kuratierte Kaufobjekte in Chaweng Noi, Plai Laem und Choeng Mon — mit klarer Gegenüberstellung von Freehold (Chanote-Grundstückskauf) und 30-Jahres-Leasehold (Grundstücksmiete).',
          action: 'Kaufobjekte ansehen'
        },
        {
          num: '04.',
          title: 'Property Management & Due Diligence',
          desc: 'Lückenlose Begleitung bei Grundbuchprüfung, Vermietungsmanagement und Werterhalt Ihrer Villa auf Koh Samui — direkt und unkompliziert auf Deutsch und Englisch.',
          action: 'Beratung anfragen'
        }
      ]
    },
    featured: {
      eyebrow: 'Ausgewählte Residenzen',
      title: 'Aktuelle Highlights auf der Insel',
      viewAll: 'Alle Immobilien ansehen'
    },
    listings: {
      title: 'Immobilien auf Koh Samui',
      subtitle:
        'Wählen Sie zwischen Kurzzeit-Ferienvillen (Rockstar Villas Portfolio), Langzeit-Residenzen und Kaufobjekten mit Grundstückskauf oder -miete.',
      rockstarBanner:
        'Kurzzeit-Vermietung in Zusammenarbeit mit rockstarvillas.com — direkte Buchungsanfrage ohne Portalgebühren.',
      currency: 'Währung',
      sortBy: 'Sortierung',
      sortFeatured: 'Empfohlen',
      sortPriceAsc: 'Preis aufsteigend',
      sortPriceDesc: 'Preis absteigend',
      sortBedsDesc: 'Meiste Schlafzimmer',
      resetFilters: 'Filter zurücksetzen',
      resultsCount: 'Objekte gefunden',
      emptyTitle: 'Keine passenden Immobilien gefunden',
      emptyDesc: 'Bitte passen Sie Ihre Filterkriterien oder den Suchbegriff an.',
      beds: 'Schlafzimmer',
      baths: 'Bäder',
      guests: 'Gäste',
      livingArea: 'Wohnfläche',
      landArea: 'Grundstück',
      beachDist: 'Zum Strand',
      perNight: '/ Nacht',
      perMonth: '/ Monat',
      bookOrDetails: 'Details & Buchen',
      requestViewing: 'Besichtigung & Details',
      statusLabels: {
        available: 'Verfügbar',
        reserved: 'Reserviert',
        sold: 'Verkauft'
      }
    },
    modal: {
      close: 'Schließen',
      highlights: 'Besondere Merkmale',
      amenities: 'Ausstattung',
      bookTitleShort: 'Aufenthalt direkt buchen',
      bookTitleViewing: 'Besichtigungstermin vereinbaren',
      checkIn: 'Anreise',
      checkOut: 'Abreise',
      guestsCount: 'Anzahl Gäste',
      viewingDate: 'Wunschdatum',
      viewingTime: 'Uhrzeit (Thailand ICT)',
      viewingFormat: 'Art der Besichtigung',
      inPerson: 'Vor-Ort auf Koh Samui',
      videoCall: 'Live Video-Besichtigung',
      tenureInterest: 'Interesse an Grundstücksart',
      tenureUndecided: 'Beratung zu beiden Optionen',
      addOnsLabel: 'Concierge-Extras (optional)',
      addOnTransfer: 'Samui Flughafen-Transfer',
      addOnCar: 'Mietwagen / SUV bereitstellen',
      addOnScooter: 'Motorroller-Verleih',
      nights: 'Nächte',
      estimatedTotal: 'Geschätzter Mietpreis',
      nameLabel: 'Ihr vollständiger Name',
      emailLabel: 'E-Mail-Adresse',
      phoneLabel: 'Telefon / WhatsApp',
      messageLabel: 'Nachricht oder Fragen',
      messagePlaceholderShort: 'Flugdaten, besondere Wünsche oder Fragen zur Villa...',
      messagePlaceholderViewing: 'Gewünschte Schwerpunkte bei der Besichtigung...',
      submitBooking: 'Buchungsanfrage verbindlich senden',
      submitViewing: 'Besichtigungstermin anfragen',
      submitting: 'Wird gesendet...',
      successTitle: 'Anfrage erfolgreich übermittelt',
      successDesc:
        'Vielen Dank! Unser Team auf Koh Samui meldet sich in der Regel innerhalb weniger Stunden persönlich bei Ihnen.',
      bookAnother: 'Weitere Anfrage senden'
    },
    contact: {
      eyebrow: 'Direkter Kontakt',
      title: 'Sprechen Sie persönlich mit unserem Team auf Koh Samui',
      subtitle:
        'Ob kurzfristige Villa-Buchung, Langzeit-Umzug oder rechtliche Fragen zu Freehold und Leasehold — wir beraten Sie freundlich, transparent und auf Augenhöhe.',
      officeLabel: 'Standort & Erreichbarkeit',
      officeValue: 'Bophut & Bangrak, Koh Samui, Surat Thani 84320, Thailand',
      hoursLabel: 'Beratungszeiten',
      hoursValue: 'Täglich 09:00 – 19:00 Uhr (ICT) · Deutsch & Englisch',
      interestLabel: 'Ihr Anliegen',
      interestOptions: {
        short_term: 'Kurzzeit-Vermietung (Rockstar Villas)',
        long_term: 'Langzeit-Vermietung (3–12+ Monate)',
        freehold: 'Immobilienkauf mit Grundstückskauf (Freehold)',
        leasehold: 'Immobilienkauf mit Grundstücksmiete (Leasehold)',
        general: 'Allgemeine Beratung / Besichtigung'
      },
      submit: 'Kontaktanfrage senden',
      success: 'Vielen Dank für Ihre Nachricht! Wir melden uns zeitnah per E-Mail oder WhatsApp bei Ihnen.'
    },
    footer: {
      tagline: 'Vertrauensvolle Immobilienvermittlung & Ferienvillen auf Koh Samui.',
      rights: 'Alle Rechte vorbehalten.'
    },
    admin: {
      title: 'Golden Samui Admin-Konsole',
      setupTitle: 'Erstmaliges Admin-Passwort festlegen',
      setupDesc:
        'Für diesen Workspace wurde noch kein Server-Passwort hinterlegt. Legen Sie jetzt ein sicheres Passwort (mind. 8 Zeichen) fest, um den Admin-Bereich dauerhaft zu schützen.',
      loginTitle: 'Passwortgeschützter Admin-Bereich',
      loginDesc: 'Melden Sie sich an, um Inserate, hochgeladene Bilder und Kundenanfragen in Echtzeit zu verwalten.',
      passwordLabel: 'Admin-Passwort',
      confirmPasswordLabel: 'Passwort bestätigen',
      createPasswordBtn: 'Passwort speichern & öffnen',
      loginBtn: 'Anmelden',
      logout: 'Abmelden',
      tabListings: 'Inserate verwalten',
      tabInquiries: 'Anfragen & Buchungen',
      newListing: '+ Neues Inserat',
      exportCsv: 'CSV-Bericht',
      exportJson: 'JSON-Export',
      kpiTotalListings: 'Aktive Inserate',
      kpiAvailable: 'Sofort verfügbar',
      kpiOpenInquiries: 'Offene Anfragen',
      kpiConfirmedBookings: 'Bestätigte Buchungen',
      searchPlaceholder: 'Suchen nach Titel, Lage, Kunde...',
      allStatuses: 'Alle Status',
      edit: 'Bearbeiten',
      delete: 'Löschen',
      confirmDelete: 'Dieses Inserat wirklich dauerhaft löschen?',
      uploadTitle: 'Immobilienfoto hochladen & automatisch skalieren',
      uploadHint: 'JPG, PNG oder WebP — wird serverseitig automatisch auf max. 1600×1066 px skaliert und als WebP gespeichert.',
      uploading: 'Skaliere & optimiere Bild...',
      uploadReady: 'Optimiert gespeichert',
      saveListing: 'Inserat speichern',
      cancel: 'Abbrechen',
      inquiryStatuses: {
        new: 'Neu',
        confirmed: 'Bestätigt',
        completed: 'Abgeschlossen',
        archived: 'Archiviert'
      },
      inquiryTypes: {
        short_term_booking: 'Kurzzeit-Buchung',
        viewing: 'Besichtigung',
        general_contact: 'Kontaktanfrage'
      },
      notesPlaceholder: 'Interne Beraternotiz hinzufügen...'
    }
  },
  en: {
    brand: 'Golden Samui Real Estate',
    nav: {
      home: 'Home',
      listings: 'Listings',
      services: 'Services',
      contact: 'Contact',
      admin: 'Admin',
      bookViewing: 'Book Viewing'
    },
    hero: {
      eyebrow: 'Koh Samui · Thailand',
      title: 'Luxury Villas & Real Estate on Koh Samui',
      subtitle:
        'Friendly, knowledgeable guidance for short-term holiday villas, long-term island leases, and residential sales with Freehold land purchase or 30-year Leasehold.',
      primaryCta: 'Explore Properties',
      secondaryCta: 'Direct Inquiry',
      crestCaption: '24k Cast-Gold Brand Seal · Bophut & Choeng Mon, Koh Samui'
    },
    quickFilter: {
      categoryLabel: 'Category',
      locationLabel: 'Koh Samui Area',
      bedroomsLabel: 'Bedrooms',
      searchLabel: 'Search',
      searchPlaceholder: 'e.g. Bob Dylan, Sea View...',
      submit: 'Filter Properties',
      allCategories: 'All Categories',
      allLocations: 'All of Koh Samui',
      anyBeds: 'Any'
    },
    categories: {
      all: 'All Properties',
      short_term: '1. Short-Term Rental',
      long_term: '2. Long-Term Rental',
      sale: '3. Property Sales'
    },
    categoryShort: {
      short_term: 'Short-Term',
      long_term: 'Long-Term',
      sale: 'For Sale'
    },
    tenure: {
      all: 'All Land Options',
      freehold: 'Land Purchase (Freehold / Chanote)',
      leasehold: 'Land Lease (30-Year Leasehold)',
      both: 'Purchase or Lease Available',
      not_applicable: 'Rental'
    },
    tenureExplainer: {
      title: 'Land Tenure in Thailand: Purchase vs. Lease',
      freeholdTitle: 'Land Purchase (Freehold / Chanote)',
      freeholdDesc:
        'Full ownership rights backed by an official Chanote title deed, typically structured through a Thai limited company.',
      leaseholdTitle: 'Land Lease (Registered Leasehold)',
      leaseholdDesc:
        'Direct building ownership in your personal name paired with an officially registered 30-year land lease and contractual renewal option.'
    },
    services: {
      eyebrow: 'Our Services',
      title: 'Dedicated Expertise on Koh Samui — From Holiday Stays to Ownership',
      subtitle:
        'We combine warm personal hospitality with transparent legal and real estate advisory for international travelers, residents, and investors.',
      items: [
        {
          num: '01.',
          title: 'Short-Term Villa Rentals & Concierge',
          desc: 'Curated pool villas and beachfront apartments from our Rockstar Villas collection (rockstarvillas.com) — including airport transfers, car/scooter rental, and local host care.',
          action: 'Browse Short-Term'
        },
        {
          num: '02.',
          title: 'Long-Term Leases & Island Relocation',
          desc: 'Peaceful private villas for 3 to 24+ month stays with fiber internet, included pool and garden maintenance, and clear utility billing.',
          action: 'Browse Long-Term'
        },
        {
          num: '03.',
          title: 'Property Sales: Land Purchase or Lease',
          desc: 'Selected residences in Chaweng Noi, Plai Laem, and Choeng Mon — clearly structured for Freehold (Chanote land purchase) or registered 30-year Leasehold.',
          action: 'View Properties for Sale'
        },
        {
          num: '04.',
          title: 'Property Management & Due Diligence',
          desc: 'End-to-end support covering title verification, yield management, and villa upkeep on Koh Samui — delivered fluently in German and English.',
          action: 'Request Advisory'
        }
      ]
    },
    featured: {
      eyebrow: 'Featured Collection',
      title: 'Selected Island Residences',
      viewAll: 'View All Properties'
    },
    listings: {
      title: 'Koh Samui Property Portfolio',
      subtitle:
        'Switch between Short-Term Holiday Rentals (Rockstar Villas portfolio), Long-Term Villas, and Properties for Sale with land purchase or land lease options.',
      rockstarBanner:
        'Short-Term Rentals curated with rockstarvillas.com — direct booking inquiries with no third-party platform fees.',
      currency: 'Currency',
      sortBy: 'Sort By',
      sortFeatured: 'Featured',
      sortPriceAsc: 'Price: Low to High',
      sortPriceDesc: 'Price: High to Low',
      sortBedsDesc: 'Most Bedrooms',
      resetFilters: 'Reset Filters',
      resultsCount: 'properties found',
      emptyTitle: 'No matching properties found',
      emptyDesc: 'Try adjusting your location, bedroom count, or price filters.',
      beds: 'Bedrooms',
      baths: 'Bathrooms',
      guests: 'Guests',
      livingArea: 'Living Area',
      landArea: 'Land Plot',
      beachDist: 'To Beach',
      perNight: '/ night',
      perMonth: '/ month',
      bookOrDetails: 'Details & Book',
      requestViewing: 'Viewing & Details',
      statusLabels: {
        available: 'Available',
        reserved: 'Reserved',
        sold: 'Sold'
      }
    },
    modal: {
      close: 'Close',
      highlights: 'Key Highlights',
      amenities: 'Amenities',
      bookTitleShort: 'Book Your Stay Directly',
      bookTitleViewing: 'Schedule a Private Viewing',
      checkIn: 'Check-In',
      checkOut: 'Check-Out',
      guestsCount: 'Guests',
      viewingDate: 'Preferred Date',
      viewingTime: 'Time Slot (Thailand ICT)',
      viewingFormat: 'Viewing Format',
      inPerson: 'In-Person on Koh Samui',
      videoCall: 'Live Video Walkthrough',
      tenureInterest: 'Preferred Land Option',
      tenureUndecided: 'Advise on both options',
      addOnsLabel: 'Optional Concierge Services',
      addOnTransfer: 'Samui Airport Transfer',
      addOnCar: 'Car / SUV Rental Arrangement',
      addOnScooter: 'Motorbike Rental',
      nights: 'nights',
      estimatedTotal: 'Estimated Stay Total',
      nameLabel: 'Full Name',
      emailLabel: 'Email Address',
      phoneLabel: 'Phone / WhatsApp',
      messageLabel: 'Message or Questions',
      messagePlaceholderShort: 'Flight details, special requests, or villa questions...',
      messagePlaceholderViewing: 'Topics or areas you would like to focus on...',
      submitBooking: 'Send Booking Request',
      submitViewing: 'Request Viewing Appointment',
      submitting: 'Submitting...',
      successTitle: 'Request Received',
      successDesc:
        'Thank you! Our Koh Samui team will review your request and reply personally within a few hours.',
      bookAnother: 'Send Another Request'
    },
    contact: {
      eyebrow: 'Direct Contact',
      title: 'Speak Directly with Our Koh Samui Team',
      subtitle:
        'Whether you are planning a holiday villa stay, a long-term island move, or evaluating Freehold vs. Leasehold ownership — we are here to help.',
      officeLabel: 'Island Office',
      officeValue: 'Bophut & Bangrak, Koh Samui, Surat Thani 84320, Thailand',
      hoursLabel: 'Advisory Hours',
      hoursValue: 'Daily 09:00 – 19:00 (ICT) · German & English',
      interestLabel: 'Topic of Interest',
      interestOptions: {
        short_term: 'Short-Term Rental (Rockstar Villas)',
        long_term: 'Long-Term Rental (3–12+ Months)',
        freehold: 'Property Purchase — Land Freehold',
        leasehold: 'Property Purchase — Land Leasehold',
        general: 'General Advisory / Viewing'
      },
      submit: 'Send Inquiry',
      success: 'Thank you for reaching out! We will reply shortly via email or WhatsApp.'
    },
    footer: {
      tagline: 'Trusted luxury real estate advisory & holiday villas on Koh Samui.',
      rights: 'All rights reserved.'
    },
    admin: {
      title: 'Golden Samui Admin Console',
      setupTitle: 'Create Initial Admin Password',
      setupDesc:
        'No server admin password is configured yet. Set a secure password (minimum 8 characters) to lock and protect the admin console.',
      loginTitle: 'Password-Protected Admin Area',
      loginDesc: 'Sign in to manage property listings, auto-scaled imagery, and live customer inquiries.',
      passwordLabel: 'Admin Password',
      confirmPasswordLabel: 'Confirm Password',
      createPasswordBtn: 'Save Password & Enter',
      loginBtn: 'Sign In',
      logout: 'Sign Out',
      tabListings: 'Manage Listings',
      tabInquiries: 'Inquiries & Bookings',
      newListing: '+ New Listing',
      exportCsv: 'Export CSV',
      exportJson: 'Export JSON',
      kpiTotalListings: 'Total Listings',
      kpiAvailable: 'Available Now',
      kpiOpenInquiries: 'Open Inquiries',
      kpiConfirmedBookings: 'Confirmed Bookings',
      searchPlaceholder: 'Search by title, location, client...',
      allStatuses: 'All Statuses',
      edit: 'Edit',
      delete: 'Delete',
      confirmDelete: 'Permanently delete this listing?',
      uploadTitle: 'Upload & Auto-Scale Property Photo',
      uploadHint: 'JPG, PNG, or WebP — automatically scaled on the server to max 1600×1066 px and saved as WebP.',
      uploading: 'Scaling & converting image...',
      uploadReady: 'Scaled & saved',
      saveListing: 'Save Listing',
      cancel: 'Cancel',
      inquiryStatuses: {
        new: 'New',
        confirmed: 'Confirmed',
        completed: 'Completed',
        archived: 'Archived'
      },
      inquiryTypes: {
        short_term_booking: 'Short-Term Booking',
        viewing: 'Viewing',
        general_contact: 'General Contact'
      },
      notesPlaceholder: 'Add internal advisor note...'
    }
  }
} as const;
