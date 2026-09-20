/**
 * DIAH — Project data
 * A single, real, in-progress project (AkiTem+) rather than a list of
 * placeholder case studies. See README before adding another project —
 * this section is intentionally built around one strong project card
 * that opens into a detailed overlay (see renderAkitemVisual /
 * openProjectModal in main.js).
 */

const projectsData = {
  pt: [
    {
      id: "akitem",
      category: "software",
      title: "AkiTem+",
      tagline: "Encontre. Confirme. Reserve.",
      description: "Plataforma para encontrar produtos e serviços disponíveis perto de si, em tempo real.",
      lede: "Uma plataforma que liga quem procura a negócios próximos com disponibilidade em tempo real.",
      problem: "Encontrar um produto ou serviço disponível perto de nós nem sempre é simples. Muitas vezes sabemos aquilo de que precisamos, mas não sabemos quem tem disponibilidade naquele momento.",
      solution: "O AkiTem+ permite ao utilizador enviar um pedido com base na sua localização, receber respostas de negócios próximos, comparar opções e, quando aplicável, efectuar uma reserva.",
      steps: [
        { title: "Procurar", text: "Indique aquilo de que precisa e a localização." },
        { title: "Confirmar", text: "Negócios próximos recebem o pedido e respondem com disponibilidade." },
        { title: "Comparar", text: "Compare disponibilidade, preço e distância." },
        { title: "Reservar", text: "Reserve quando a opção estiver disponível." },
        { title: "Validar", text: "Utilize o código/QR para validar a reserva no estabelecimento." }
      ],
      modules: [
        { title: "Farmácia", text: "Pesquisa de produtos e medicamentos em farmácias próximas." },
        { title: "Alojamento", text: "Pesquisa de alojamento, disponibilidade e preços." },
        { title: "Combustível", text: "Consulta de postos próximos e disponibilidade de combustível." },
        { title: "Gás", text: "Pesquisa de fornecedores próximos por marca, tipo e capacidade." }
      ],
      forSeekers: [
        "Pesquisa baseada na localização",
        "Disponibilidade em tempo real",
        "Comparação de opções",
        "Reservas",
        "Pagamento na aplicação ou no estabelecimento, quando aplicável",
        "Validação através de QR/code"
      ],
      forBusinesses: [
        "Receção de pedidos próximos",
        "Gestão de disponibilidade",
        "Resposta aos pedidos",
        "Gestão de reservas",
        "Actualização de produtos/serviços",
        "Validação através de QR/code"
      ],
      capabilities: ["Location-based services", "Real-time availability", "Reservations", "QR validation", "Payments", "Business management", "Multi-service architecture"],
      statusText: "O AkiTem+ encontra-se actualmente em fase de desenvolvimento e validação, com implementação progressiva dos diferentes módulos e funcionalidades da plataforma."
    }
  ],
  en: [
    {
      id: "akitem",
      category: "software",
      title: "AkiTem+",
      tagline: "Find. Confirm. Book.",
      description: "A platform to find products and services available near you, in real time.",
      lede: "A platform that connects people searching with nearby businesses offering real-time availability.",
      problem: "Finding a product or service available nearby isn't always simple. We often know what we need, but not who has availability at that moment.",
      solution: "AkiTem+ lets the user send a request based on their location, receive responses from nearby businesses, compare options and, where applicable, make a booking.",
      steps: [
        { title: "Search", text: "Tell us what you need and your location." },
        { title: "Confirm", text: "Nearby businesses receive the request and reply with availability." },
        { title: "Compare", text: "Compare availability, price and distance." },
        { title: "Book", text: "Book once an option is available." },
        { title: "Validate", text: "Use the code/QR to validate the booking at the business." }
      ],
      modules: [
        { title: "Pharmacy", text: "Search for products and medicines at nearby pharmacies." },
        { title: "Accommodation", text: "Search for accommodation, availability and prices." },
        { title: "Fuel", text: "Check nearby fuel stations and fuel availability." },
        { title: "Gas", text: "Search for nearby suppliers by brand, type and capacity." }
      ],
      forSeekers: [
        "Location-based search",
        "Real-time availability",
        "Compare options",
        "Bookings",
        "Payment in-app or on-site, where applicable",
        "QR/code validation"
      ],
      forBusinesses: [
        "Receive nearby requests",
        "Manage availability",
        "Respond to requests",
        "Manage bookings",
        "Update products/services",
        "QR/code validation"
      ],
      capabilities: ["Location-based services", "Real-time availability", "Reservations", "QR validation", "Payments", "Business management", "Multi-service architecture"],
      statusText: "AkiTem+ is currently in development and validation, with the platform's modules and features being rolled out progressively."
    }
  ],
  fr: [
    {
      id: "akitem",
      category: "software",
      title: "AkiTem+",
      tagline: "Trouvez. Confirmez. Réservez.",
      description: "Une plateforme pour trouver des produits et services disponibles près de vous, en temps réel.",
      lede: "Une plateforme qui relie les utilisateurs aux commerces proches disposant d'une disponibilité en temps réel.",
      problem: "Trouver un produit ou un service disponible à proximité n'est pas toujours simple. Nous savons souvent ce dont nous avons besoin, mais pas qui a de la disponibilité à ce moment-là.",
      solution: "AkiTem+ permet à l'utilisateur d'envoyer une demande basée sur sa localisation, de recevoir des réponses de commerces proches, de comparer les options et, le cas échéant, d'effectuer une réservation.",
      steps: [
        { title: "Rechercher", text: "Indiquez ce dont vous avez besoin et votre localisation." },
        { title: "Confirmer", text: "Les commerces proches reçoivent la demande et répondent avec leur disponibilité." },
        { title: "Comparer", text: "Comparez disponibilité, prix et distance." },
        { title: "Réserver", text: "Réservez lorsque l'option est disponible." },
        { title: "Valider", text: "Utilisez le code/QR pour valider la réservation sur place." }
      ],
      modules: [
        { title: "Pharmacie", text: "Recherche de produits et médicaments dans les pharmacies proches." },
        { title: "Hébergement", text: "Recherche d'hébergement, disponibilité et prix." },
        { title: "Carburant", text: "Consultez les stations proches et la disponibilité de carburant." },
        { title: "Gaz", text: "Recherche de fournisseurs proches par marque, type et capacité." }
      ],
      forSeekers: [
        "Recherche basée sur la localisation",
        "Disponibilité en temps réel",
        "Comparaison des options",
        "Réservations",
        "Paiement dans l'application ou sur place, le cas échéant",
        "Validation par QR/code"
      ],
      forBusinesses: [
        "Réception des demandes à proximité",
        "Gestion de la disponibilité",
        "Réponse aux demandes",
        "Gestion des réservations",
        "Mise à jour des produits/services",
        "Validation par QR/code"
      ],
      capabilities: ["Location-based services", "Real-time availability", "Reservations", "QR validation", "Payments", "Business management", "Multi-service architecture"],
      statusText: "AkiTem+ est actuellement en phase de développement et de validation, avec un déploiement progressif des différents modules et fonctionnalités de la plateforme."
    }
  ]
};
