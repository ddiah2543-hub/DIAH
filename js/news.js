/**
 * DIAH — News data
 * A single, real announcement (the start of DIAH) rather than a list of
 * placeholder articles — same approach as projects.js.
 * `cover: "brand"` renders the DIAH logo composition (see brandCoverHTML in main.js).
 * `date` is optional (ISO YYYY-MM-DD, formatted per-locale); omit it rather than invent one.
 * Keep `id` in sync across languages.
 */

const newsData = {
  pt: [
    {
      id: "diah-launch",
      cover: "brand",
      category: "DIAH",
      type: "Empresa",
      title: "Nasce a DIAH",
      summary: "A DIAH inicia a sua atividade com o objetivo de transformar desafios de negócio em soluções digitais simples.",
      tagline: "Transformamos desafios de negócio em soluções digitais simples.",
      body: [
        "A DIAH nasce com uma missão simples: ajudar organizações a transformar desafios reais em soluções tecnológicas práticas, eficientes e adaptadas às suas necessidades.",
        "Combinamos desenvolvimento de software, automação, dados e consultoria tecnológica para criar soluções que ajudam as organizações a trabalhar melhor, mais rápido e de forma mais inteligente.",
        "Este é o início da nossa jornada. Estamos a desenvolver os primeiros projetos e a construir, passo a passo, uma empresa tecnológica focada em criar valor através da tecnologia."
      ],
      closing: "Este é apenas o começo."
    }
  ],
  en: [
    {
      id: "diah-launch",
      cover: "brand",
      category: "DIAH",
      type: "Company",
      title: "DIAH is born",
      summary: "DIAH begins operating with the goal of turning business challenges into simple digital solutions.",
      tagline: "We turn business challenges into simple digital solutions.",
      body: [
        "DIAH is born with a simple mission: to help organisations turn real challenges into practical, efficient technology solutions tailored to their needs.",
        "We combine software development, automation, data and technology consulting to build solutions that help organisations work better, faster and smarter.",
        "This is the start of our journey. We are developing our first projects and building, step by step, a technology company focused on creating value through technology."
      ],
      closing: "This is only the beginning."
    }
  ],
  fr: [
    {
      id: "diah-launch",
      cover: "brand",
      category: "DIAH",
      type: "Entreprise",
      title: "Naissance de DIAH",
      summary: "DIAH démarre son activité avec l’objectif de transformer les défis métier en solutions numériques simples.",
      tagline: "Nous transformons les défis métier en solutions numériques simples.",
      body: [
        "DIAH naît avec une mission simple : aider les organisations à transformer des défis réels en solutions technologiques pratiques, efficaces et adaptées à leurs besoins.",
        "Nous combinons développement logiciel, automatisation, données et conseil technologique pour créer des solutions qui aident les organisations à travailler mieux, plus vite et plus intelligemment.",
        "C’est le début de notre parcours. Nous développons nos premiers projets et construisons, pas à pas, une entreprise technologique centrée sur la création de valeur par la technologie."
      ],
      closing: "Ce n’est que le début."
    }
  ]
};
