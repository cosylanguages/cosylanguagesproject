// Translation data for COSYlanguages

const questionTranslations = {
  COSYenglish: {
    what: "What is it?",
    who: "Who is it?",
    choose: "Choose grammar practice for Day 3:"
  },
  COSYfrançais: {
    what: "C'est quoi?",
    who: "C'est qui?",
    choose: "Choisissez la pratique de grammaire pour le jour 3:"
  },
  COSYitaliano: {
    what: "Cos'è?",
    who: "Chi è?",
    choose: "Scegli la pratica di grammatica per il giorno 3:"
  },
  COSYespañol: {
    what: "¿Qué es?",
    who: "¿Quién es?",
    choose: "Elige la práctica de gramática para el día 3:"
  },
  COSYportuguês: {
    what: "O que é?",
    who: "Quem é?",
    choose: "Escolha a prática de gramática para o dia 3:"
  },
  COSYdeutsch: {
    what: "Was ist das?",
    who: "Wer ist das?",
    choose: "Wählen Sie Grammatikübung für Tag 3:"
  },
  ΚΟΖΥελληνικά: {
    what: "Τι είναι;",
    who: "Ποιος.α.ο είναι;",
    choose: "Επιλέξτε γραμματική άσκηση για την ημέρα 3:"
  },
  ТАКОЙрусский: {
    what: "Что это?",
    who: "Кто это?",
    choose: "Выберите грамматическое упражнение для дня 3:"
  },
  ԾՈՍՅհայկական: {
    what: "Ի՞նչ է սա:",
    who: "Ո՞վ է սա:",
    choose: "Ընտրեք քերականության պարապմունք 3-րդ օրվա համար:"
  }
};

const grammarOptionsText = {
  COSYenglish: { to_have: "To Have", possessives: "Possessive Adjectives" },
  COSYfrançais: { to_have: "Avoir", possessives: "Adjectifs Possessifs" },
  COSYitaliano: { to_have: "Avere", possessives: "Aggettivi Possessivi" },
  COSYespañol: { to_have: "Tener", possessives: "Adjetivos Posesivos" },
  COSYportuguês: { to_have: "Ter", possessives: "Adjetivos Possessivos" },
  COSYdeutsch: { to_have: "Haben", possessives: "Possessivartikel" },
  ΚΟΖΥελληνικά: { to_have: "Έχω", possessives: "Κτητικά Επίθετα" },
  ТАКОЙрусский: { to_have: "Иметь", possessives: "Притяжательные Прилагательные" },
  ԾՈՍՅհայկական: { to_have: "Ունենալ", possessives: "Ստացական Ածականներ" }
};

const questionVariants = {
  COSYenglish: {
    day2: [
      ["Who is it?", "Who is this person?"],
      ["What is it?", "What is this thing?"]
    ],
    day3plus: [
      ["Who is it?", "Who is this person?"],
      ["What is it?", "What does this person have?", "What is this thing?"]
    ]
  },
  COSYfrançais: {
    day2: [
      ["C'est qui?", "Qui est cette personne?"],
      ["C'est quoi?", "Qu'est-ce que c'est? (cette chose)" ]
    ],
    day3plus: [
      ["C'est qui?", "Qui est cette personne?"],
      ["C'est quoi?", "Qu'est-ce que cette personne a?", "Qu'est-ce que c'est? (cette chose)" ]
    ]
  },
  COSYitaliano: {
    day2: [
      ["Chi è?", "Chi è questa persona?"],
      ["Cos'è?", "Che cos'è questa cosa?" ]
    ],
    day3plus: [
      ["Chi è?", "Chi è questa persona?"],
      ["Cos'è?", "Che cosa ha questa persona?", "Che cos'è questa cosa?" ]
    ]
  },
  COSYespañol: {
    day2: [
      ["¿Quién es?", "¿Quién es esta persona?"],
      ["¿Qué es?", "¿Qué es esta cosa?" ]
    ],
    day3plus: [
      ["¿Quién es?", "¿Quién es esta persona?"],
      ["¿Qué es?", "¿Qué tiene esta persona?", "¿Qué es esta cosa?" ]
    ]
  },
  COSYportuguês: {
    day2: [
      ["Quem é?", "Quem é esta pessoa?"],
      ["O que é?", "O que é esta coisa?" ]
    ],
    day3plus: [
      ["Quem é?", "Quem é esta pessoa?"],
      ["O que é?", "O que esta pessoa tem?", "O que é esta coisa?" ]
    ]
  },
  COSYdeutsch: {
    day2: [
      ["Wer ist das?", "Wer ist diese Person?"],
      ["Was ist das?", "Was ist dieses Ding?" ]
    ],
    day3plus: [
      ["Wer ist das?", "Wer ist diese Person?"],
      ["Was ist das?", "Was hat diese Person?", "Was ist dieses Ding?" ]
    ]
  },
  ΚΟΖΥελληνικά: {
    day2: [
      ["Ποιος είναι;", "Ποιος είναι αυτό το άτομο;"],
      ["Τι είναι;", "Τι είναι αυτό το πράγμα;" ]
    ],
    day3plus: [
      ["Ποιος είναι;", "Ποιος είναι αυτό το άτομο;"],
      ["Τι είναι;", "Τι έχει αυτό το άτομο;", "Τι είναι αυτό το πράγμα;" ]
    ]
  },
  ТАКОЙрусский: {
    day2: [
      ["Кто это?", "Кто этот человек?"],
      ["Что это?", "Что это за вещь?" ]
    ],
    day3plus: [
      ["Кто это?", "Кто этот человек?"],
      ["Что это?", "Что есть у этого человека?", "Что это за вещь?" ]
    ]
  },
  ԾՈՍՅհայկական: {
    day2: [
      ["Ո՞վ է սա:", "Ո՞վ է այս մարդը:"],
      ["Ի՞նչ է սա:", "Ի՞նչ է այս բանը:" ]
    ],
    day3plus: [
      ["Ո՞վ է սա:", "Ո՞վ է այս մարդը:"],
      ["Ի՞նչ է սա:", "Ի՞նչ ունի այս մարդը:", "Ի՞նչ է այս բանը:" ]
    ]
  }
};

const uiTranslations = {
  COSYenglish: {
    nav_home: "Home",
    nav_practice: "Practice",
    nav_progress: "Progress",
    nav_help: "Help",
    choose_language: "Choose language:",
    choose_day: "Choose day:",
    day_from: "Day from:",
    day_to: "Day to:",
    show_practice: "Show Practice",
    random_word: "Random Word",
    random_image: "Random Image",
    gender: "Gender",
    verb: "Verb",
    possessives: "Possessives",
    xp: "XP",
    streak: "Streak",
    install_app: "Install App",
    help_popup: "❓ How to use: Select a language, choose a day, pick a practice type, and start learning! Use the navigation bar for help or a demo."
  },
  COSYfrançais: {
    nav_home: "Accueil",
    nav_practice: "Pratique",
    nav_progress: "Progrès",
    nav_help: "Aide",
    choose_language: "Choisissez la langue:",
    choose_day: "Choisissez le jour:",
    day_from: "Jour de:",
    day_to: "Jour à:",
    show_practice: "Afficher la pratique",
    random_word: "Mot aléatoire",
    random_image: "Image aléatoire",
    gender: "Genre",
    verb: "Verbe",
    possessives: "Possessifs",
    xp: "XP",
    streak: "Série",
    install_app: "Installer l'application",
    help_popup: "❓ Comment utiliser: Sélectionnez une langue, choisissez un jour, choisissez un type de pratique et commencez à apprendre! Utilisez la barre de navigation pour l'aide ou une démo."
  },
  COSYitaliano: {
    nav_home: "Home",
    nav_practice: "Pratica",
    nav_progress: "Progresso",
    nav_help: "Aiuto",
    choose_language: "Scegli la lingua:",
    choose_day: "Scegli il giorno:",
    day_from: "Dal giorno:",
    day_to: "Al giorno:",
    show_practice: "Mostra pratica",
    random_word: "Parola casuale",
    random_image: "Immagine casuale",
    gender: "Genere",
    verb: "Verbo",
    possessives: "Possessivi",
    xp: "XP",
    streak: "Serie",
    install_app: "Installa App",
    help_popup: "❓ Come usare: Seleziona una lingua, scegli un giorno, scegli un tipo di pratica e inizia a imparare! Usa la barra di navigazione per aiuto o demo."
  },
  COSYespañol: {
    nav_home: "Inicio",
    nav_practice: "Práctica",
    nav_progress: "Progreso",
    nav_help: "Ayuda",
    choose_language: "Elige idioma:",
    choose_day: "Elige día:",
    day_from: "Día desde:",
    day_to: "Día hasta:",
    show_practice: "Mostrar práctica",
    random_word: "Palabra aleatoria",
    random_image: "Imagen aleatoria",
    gender: "Género",
    verb: "Verbo",
    possessives: "Posesivos",
    xp: "XP",
    streak: "Racha",
    install_app: "Instalar App",
    help_popup: "❓ Cómo usar: Selecciona un idioma, elige un día, elige un tipo de práctica y comienza a aprender! Usa la barra de navegación para ayuda o demo."
  },
  COSYportuguês: {
    nav_home: "Início",
    nav_practice: "Prática",
    nav_progress: "Progresso",
    nav_help: "Ajuda",
    choose_language: "Escolha o idioma:",
    choose_day: "Escolha o dia:",
    day_from: "Dia de:",
    day_to: "Dia até:",
    show_practice: "Mostrar prática",
    random_word: "Palavra aleatória",
    random_image: "Imagem aleatória",
    gender: "Gênero",
    verb: "Verbo",
    possessives: "Possessivos",
    xp: "XP",
    streak: "Sequência",
    install_app: "Instalar App",
    help_popup: "❓ Como usar: Selecione um idioma, escolha um dia, escolha um tipo de prática e comece a aprender! Use a barra de navegação para ajuda ou demonstração."
  },
  COSYdeutsch: {
    nav_home: "Startseite",
    nav_practice: "Übung",
    nav_progress: "Fortschritt",
    nav_help: "Hilfe",
    choose_language: "Sprache wählen:",
    choose_day: "Tag wählen:",
    day_from: "Tag von:",
    day_to: "Tag bis:",
    show_practice: "Übung anzeigen",
    random_word: "Zufallswort",
    random_image: "Zufallsbild",
    gender: "Geschlecht",
    verb: "Verb",
    possessives: "Possessivpronomen",
    xp: "XP",
    streak: "Serie",
    install_app: "App installieren",
    help_popup: "❓ Anleitung: Wählen Sie eine Sprache, einen Tag, eine Übungsart und beginnen Sie zu lernen! Nutzen Sie die Navigationsleiste für Hilfe oder Demo."
  },
  ΚΟΖΥελληνικά: {
    nav_home: "Αρχική",
    nav_practice: "Άσκηση",
    nav_progress: "Πρόοδος",
    nav_help: "Βοήθεια",
    choose_language: "Επιλέξτε γλώσσα:",
    choose_day: "Επιλέξτε ημέρα:",
    day_from: "Από ημέρα:",
    day_to: "Έως ημέρα:",
    show_practice: "Εμφάνιση άσκησης",
    random_word: "Τυχαία λέξη",
    random_image: "Τυχαία εικόνα",
    gender: "Γένος",
    verb: "Ρήμα",
    possessives: "Κτητικά",
    xp: "XP",
    streak: "Σειρά",
    install_app: "Εγκατάσταση App",
    help_popup: "❓ Πώς να χρησιμοποιήσετε: Επιλέξτε γλώσσα, ημέρα, τύπο άσκησης και ξεκινήστε! Χρησιμοποιήστε τη γραμμή πλοήγησης για βοήθεια ή επίδειξη."
  },
  ТАКОЙрусский: {
    nav_home: "Главная",
    nav_practice: "Практика",
    nav_progress: "Прогресс",
    nav_help: "Помощь",
    choose_language: "Выберите язык:",
    choose_day: "Выберите день:",
    day_from: "С дня:",
    day_to: "По день:",
    show_practice: "Показать практику",
    random_word: "Случайное слово",
    random_image: "Случайное изображение",
    gender: "Род",
    verb: "Глагол",
    possessives: "Притяжательные",
    xp: "XP",
    streak: "Серия",
    install_app: "Установить приложение",
    help_popup: "❓ Как использовать: Выберите язык, день, тип практики и начните учиться! Используйте панель навигации для помощи или демонстрации."
  },
  ԾՈՍՅհայկական: {
    nav_home: "Գլխավոր",
    nav_practice: "Պրակտիկա",
    nav_progress: "Առաջընթաց",
    nav_help: "Օգնություն",
    choose_language: "Ընտրեք լեզուն:",
    choose_day: "Ընտրեք օրը:",
    day_from: "Օրը սկսած:",
    day_to: "Օրը մինչև:",
    show_practice: "Ցուցադրել պրակտիկան",
    random_word: "Պատահական բառ",
    random_image: "Պատահական պատկեր",
    gender: "Սեռ",
    verb: "Բայ",
    possessives: "Ստացականներ",
    xp: "XP",
    streak: "Շարք",
    install_app: "Տեղադրել հավելվածը",
    help_popup: "❓ Ինչպես օգտագործել. Ընտրեք լեզուն, օրը, պրակտիկայի տեսակը և սկսեք սովորել: Օգտագործեք նավիգացիոն վահանակը օգնության կամ ցուցադրության համար:"
  }
};

if (typeof window !== 'undefined') window.questionTranslations = questionTranslations;
if (typeof window !== 'undefined') window.grammarOptionsText = grammarOptionsText;
if (typeof window !== 'undefined') window.questionVariants = questionVariants;
if (typeof window !== 'undefined') window.uiTranslations = uiTranslations;
