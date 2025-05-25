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
