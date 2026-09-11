/**
 * DIAH — Projects data
 * `category` is a stable machine key used for filtering (matches projects.filter.* i18n keys).
 * `image` is intentionally null — the UI renders an abstract generated cover (see main.js
 * renderProjects) so the site works fully before real project photography is added.
 * To add a real project: push a new object with the same shape into each language array below,
 * and drop the image into assets/images/ then set `image: "assets/images/your-file.jpg"`.
 */

const projectsData = {
  pt: [
    {
      id: "proj-01",
      category: "software",
      year: "2025",
      technologies: ["TypeScript", "Node.js", "PostgreSQL", "Docker"],
      image: null,
      title: "Plataforma de Gestão Operacional",
      description: "Plataforma à medida para centralizar processos operacionais dispersos por múltiplas folhas de cálculo e ferramentas isoladas.",
      problem: "A organização geria operações críticas em dezenas de ficheiros Excel desconectados, sem histórico, auditoria ou visibilidade em tempo real.",
      solution: "Concebemos e desenvolvemos uma plataforma web modular com permissões por perfil, workflows configuráveis e dashboards operacionais em tempo real.",
      results: [
        "Redução de 60% no tempo de processamento mensal",
        "Eliminação de erros manuais de introdução de dados",
        "Visibilidade em tempo real para toda a gestão"
      ]
    },
    {
      id: "proj-02",
      category: "web",
      year: "2025",
      technologies: ["React", "TypeScript", "Node.js", "AWS"],
      image: null,
      title: "Portal Digital Corporativo",
      description: "Redesenho completo do portal institucional, com foco em performance, acessibilidade e gestão de conteúdo autónoma.",
      problem: "O portal existente era lento, difícil de actualizar e não reflectia a maturidade tecnológica da organização.",
      solution: "Construímos um novo portal com arquitectura headless, CMS próprio para a equipa de comunicação e infraestrutura cloud escalável.",
      results: [
        "Tempo de carregamento reduzido em 70%",
        "Equipa interna passou a publicar conteúdo sem apoio técnico",
        "Aumento de 45% no tráfego orgânico em 6 meses"
      ]
    },
    {
      id: "proj-03",
      category: "mobile",
      year: "2024",
      technologies: ["Flutter", "Firebase", "Node.js"],
      image: null,
      title: "App de Gestão de Equipas em Campo",
      description: "Aplicação mobile para coordenação de equipas técnicas em terreno, com funcionamento offline-first.",
      problem: "Equipas em campo dependiam de comunicação telefónica e papel para reportar tarefas, gerando atrasos e perda de informação.",
      solution: "Desenvolvemos uma app mobile offline-first com sincronização automática, geolocalização e relatórios digitais em tempo real.",
      results: [
        "Redução de 50% no tempo de reporte de tarefas",
        "Eliminação de relatórios em papel",
        "Rastreabilidade completa de intervenções"
      ]
    },
    {
      id: "proj-04",
      category: "systems",
      year: "2024",
      technologies: ["Java", ".NET", "SQL Server", "Azure"],
      image: null,
      title: "Modernização de Sistema Legacy",
      description: "Evolução faseada de um sistema core desenvolvido há mais de uma década, sem interromper a operação diária.",
      problem: "O sistema legacy era crítico para o negócio mas impossível de escalar, com risco elevado de falha e dependência de conhecimento não documentado.",
      solution: "Aplicámos uma estratégia de modernização incremental (strangler pattern), isolando módulos críticos e migrando-os progressivamente para uma arquitectura moderna.",
      results: [
        "Zero interrupções de serviço durante a migração",
        "Redução de 40% no tempo de resposta do sistema",
        "Base tecnológica preparada para os próximos 10 anos"
      ]
    },
    {
      id: "proj-05",
      category: "consulting",
      year: "2023",
      technologies: ["Architecture Review", "Cloud Strategy", "Roadmapping"],
      image: null,
      title: "Avaliação de Arquitectura e Roadmap Tecnológico",
      description: "Diagnóstico técnico independente e definição de roadmap de evolução tecnológica para os próximos 3 anos.",
      problem: "A organização enfrentava decisões tecnológicas importantes sem uma visão clara dos riscos, custos e alternativas disponíveis.",
      solution: "Realizámos uma auditoria técnica completa, avaliámos alternativas de arquitectura e cloud, e entregámos um roadmap priorizado por impacto e risco.",
      results: [
        "Roadmap tecnológico de 3 anos validado pela gestão",
        "Identificação de riscos críticos de segurança e escalabilidade",
        "Base de decisão clara para investimento tecnológico"
      ]
    },
    {
      id: "proj-06",
      category: "automation",
      year: "2023",
      technologies: ["Python", "APIs", "RPA", "Docker"],
      image: null,
      title: "Automação de Processos Financeiros",
      description: "Automatização de processos manuais de reconciliação financeira entre múltiplos sistemas internos.",
      problem: "A reconciliação mensal entre sistemas financeiros era feita manualmente, consumindo dezenas de horas e sujeita a erro humano.",
      solution: "Desenvolvemos um conjunto de serviços de automação que integram os sistemas via API, validam dados e geram relatórios automáticos de discrepância.",
      results: [
        "Redução de 90% no tempo de reconciliação mensal",
        "Eliminação de erros de reconciliação manual",
        "Equipa financeira realocada para trabalho de maior valor"
      ]
    }
  ],
  en: [
    {
      id: "proj-01",
      category: "software",
      year: "2025",
      technologies: ["TypeScript", "Node.js", "PostgreSQL", "Docker"],
      image: null,
      title: "Operations Management Platform",
      description: "Custom platform to centralise operational processes that were scattered across multiple spreadsheets and disconnected tools.",
      problem: "The organisation ran critical operations across dozens of disconnected Excel files, with no history, audit trail or real-time visibility.",
      solution: "We designed and built a modular web platform with role-based permissions, configurable workflows and real-time operational dashboards.",
      results: [
        "60% reduction in monthly processing time",
        "Elimination of manual data-entry errors",
        "Real-time visibility across management"
      ]
    },
    {
      id: "proj-02",
      category: "web",
      year: "2025",
      technologies: ["React", "TypeScript", "Node.js", "AWS"],
      image: null,
      title: "Corporate Digital Portal",
      description: "Complete redesign of the institutional portal, focused on performance, accessibility and self-managed content.",
      problem: "The existing portal was slow, hard to update, and did not reflect the organisation's technological maturity.",
      solution: "We built a new headless portal with an in-house CMS for the communications team and scalable cloud infrastructure.",
      results: [
        "Load time reduced by 70%",
        "Internal team now publishes content without technical support",
        "45% increase in organic traffic within 6 months"
      ]
    },
    {
      id: "proj-03",
      category: "mobile",
      year: "2024",
      technologies: ["Flutter", "Firebase", "Node.js"],
      image: null,
      title: "Field Team Management App",
      description: "Mobile app to coordinate field technical teams, built offline-first.",
      problem: "Field teams relied on phone calls and paper to report tasks, causing delays and lost information.",
      solution: "We developed an offline-first mobile app with automatic sync, geolocation and real-time digital reporting.",
      results: [
        "50% reduction in task-reporting time",
        "Paper reports eliminated",
        "Full traceability of interventions"
      ]
    },
    {
      id: "proj-04",
      category: "systems",
      year: "2024",
      technologies: ["Java", ".NET", "SQL Server", "Azure"],
      image: null,
      title: "Legacy System Modernisation",
      description: "Phased evolution of a decade-old core system, without interrupting daily operations.",
      problem: "The legacy system was business-critical but impossible to scale, with high failure risk and undocumented knowledge dependencies.",
      solution: "We applied an incremental modernisation strategy (strangler pattern), isolating critical modules and progressively migrating them to a modern architecture.",
      results: [
        "Zero service interruptions during migration",
        "40% reduction in system response time",
        "Technology foundation ready for the next 10 years"
      ]
    },
    {
      id: "proj-05",
      category: "consulting",
      year: "2023",
      technologies: ["Architecture Review", "Cloud Strategy", "Roadmapping"],
      image: null,
      title: "Architecture Assessment & Technology Roadmap",
      description: "Independent technical diagnosis and a 3-year technology roadmap.",
      problem: "The organisation faced important technology decisions without a clear view of the risks, costs and available alternatives.",
      solution: "We ran a full technical audit, evaluated architecture and cloud alternatives, and delivered a roadmap prioritised by impact and risk.",
      results: [
        "3-year technology roadmap approved by leadership",
        "Critical security and scalability risks identified",
        "Clear decision basis for technology investment"
      ]
    },
    {
      id: "proj-06",
      category: "automation",
      year: "2023",
      technologies: ["Python", "APIs", "RPA", "Docker"],
      image: null,
      title: "Financial Process Automation",
      description: "Automation of manual financial reconciliation processes across multiple internal systems.",
      problem: "Monthly reconciliation between financial systems was done manually, consuming dozens of hours and prone to human error.",
      solution: "We built a set of automation services that integrate systems via API, validate data and generate automatic discrepancy reports.",
      results: [
        "90% reduction in monthly reconciliation time",
        "Manual reconciliation errors eliminated",
        "Finance team reallocated to higher-value work"
      ]
    }
  ],
  fr: [
    {
      id: "proj-01",
      category: "software",
      year: "2025",
      technologies: ["TypeScript", "Node.js", "PostgreSQL", "Docker"],
      image: null,
      title: "Plateforme de Gestion Opérationnelle",
      description: "Plateforme sur mesure pour centraliser des processus opérationnels dispersés entre plusieurs feuilles de calcul et outils isolés.",
      problem: "L'organisation gérait des opérations critiques dans des dizaines de fichiers Excel déconnectés, sans historique, audit ni visibilité en temps réel.",
      solution: "Nous avons conçu et développé une plateforme web modulaire avec permissions par profil, workflows configurables et tableaux de bord en temps réel.",
      results: [
        "Réduction de 60% du temps de traitement mensuel",
        "Élimination des erreurs manuelles de saisie",
        "Visibilité en temps réel pour toute la direction"
      ]
    },
    {
      id: "proj-02",
      category: "web",
      year: "2025",
      technologies: ["React", "TypeScript", "Node.js", "AWS"],
      image: null,
      title: "Portail Numérique Corporatif",
      description: "Refonte complète du portail institutionnel, axée sur la performance, l'accessibilité et la gestion de contenu autonome.",
      problem: "Le portail existant était lent, difficile à mettre à jour et ne reflétait pas la maturité technologique de l'organisation.",
      solution: "Nous avons construit un nouveau portail à architecture headless, avec un CMS propre pour l'équipe de communication et une infrastructure cloud évolutive.",
      results: [
        "Temps de chargement réduit de 70%",
        "L'équipe interne publie désormais du contenu sans support technique",
        "Hausse de 45% du trafic organique en 6 mois"
      ]
    },
    {
      id: "proj-03",
      category: "mobile",
      year: "2024",
      technologies: ["Flutter", "Firebase", "Node.js"],
      image: null,
      title: "App de Gestion d'Équipes Terrain",
      description: "Application mobile pour coordonner des équipes techniques sur le terrain, conçue offline-first.",
      problem: "Les équipes terrain dépendaient du téléphone et du papier pour rapporter leurs tâches, causant retards et pertes d'information.",
      solution: "Nous avons développé une application mobile offline-first avec synchronisation automatique, géolocalisation et rapports numériques en temps réel.",
      results: [
        "Réduction de 50% du temps de rapport des tâches",
        "Élimination des rapports papier",
        "Traçabilité complète des interventions"
      ]
    },
    {
      id: "proj-04",
      category: "systems",
      year: "2024",
      technologies: ["Java", ".NET", "SQL Server", "Azure"],
      image: null,
      title: "Modernisation d'un Système Legacy",
      description: "Évolution progressive d'un système central vieux de plus d'une décennie, sans interrompre l'activité quotidienne.",
      problem: "Le système legacy était critique pour l'activité mais impossible à faire évoluer, avec un risque élevé de panne et une connaissance non documentée.",
      solution: "Nous avons appliqué une stratégie de modernisation incrémentale (strangler pattern), isolant les modules critiques et les migrant progressivement vers une architecture moderne.",
      results: [
        "Zéro interruption de service pendant la migration",
        "Réduction de 40% du temps de réponse du système",
        "Base technologique prête pour les 10 prochaines années"
      ]
    },
    {
      id: "proj-05",
      category: "consulting",
      year: "2023",
      technologies: ["Architecture Review", "Cloud Strategy", "Roadmapping"],
      image: null,
      title: "Évaluation d'Architecture & Feuille de Route Technologique",
      description: "Diagnostic technique indépendant et définition d'une feuille de route technologique sur 3 ans.",
      problem: "L'organisation faisait face à des décisions technologiques majeures sans vision claire des risques, coûts et alternatives disponibles.",
      solution: "Nous avons réalisé un audit technique complet, évalué les alternatives d'architecture et de cloud, et livré une feuille de route priorisée par impact et risque.",
      results: [
        "Feuille de route technologique sur 3 ans validée par la direction",
        "Identification des risques critiques de sécurité et d'évolutivité",
        "Base de décision claire pour l'investissement technologique"
      ]
    },
    {
      id: "proj-06",
      category: "automation",
      year: "2023",
      technologies: ["Python", "APIs", "RPA", "Docker"],
      image: null,
      title: "Automatisation des Processus Financiers",
      description: "Automatisation des processus manuels de réconciliation financière entre plusieurs systèmes internes.",
      problem: "La réconciliation mensuelle entre systèmes financiers était effectuée manuellement, consommant des dizaines d'heures et sujette à l'erreur humaine.",
      solution: "Nous avons développé un ensemble de services d'automatisation intégrant les systèmes via API, validant les données et générant des rapports automatiques d'écarts.",
      results: [
        "Réduction de 90% du temps de réconciliation mensuelle",
        "Élimination des erreurs de réconciliation manuelle",
        "Équipe financière réaffectée à des tâches à plus forte valeur"
      ]
    }
  ]
};
