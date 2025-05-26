// Verb data for COSYlanguages
// TODO: Add verb practice data here.

const verbPracticeData = {
  COSYenglish: {
    2: [
      { prompt: "I", answer: "am" },
      { prompt: "You", answer: "are" },
      { prompt: "He", answer: "is" },
      { prompt: "She", answer: "is" },
      { prompt: "It", answer: "is" },
      { prompt: "am", answer: "I" },
      { prompt: "are", answer: "you" },
      { prompt: "is", answer: "he/she/it" }
    ],
    3: [
      { prompt: "I", answer: "have" },
      { prompt: "You", answer: "have" },
      { prompt: "He", answer: "has" },
      { prompt: "She", answer: "has" },
      { prompt: "It", answer: "has" },
      { prompt: "have", answer: "I/you" },
      { prompt: "has", answer: "he/she/it" }
    ]
  },
  COSYfrançais: {
    2: [
      { prompt: "Je", answer: "suis" },
      { prompt: "Tu", answer: "es" },
      { prompt: "Il", answer: "est" },
      { prompt: "Elle", answer: "est" },
      { prompt: "Ce", answer: "est" },
      { prompt: "suis", answer: "je" },
      { prompt: "es", answer: "tu" },
      { prompt: "est", answer: "il/elle/ce" }
    ],
    3: [
      { prompt: "J", answer: "ai" },
      { prompt: "Tu", answer: "as" },
      { prompt: "Il", answer: "a" },
      { prompt: "Elle", answer: "a" },
      { prompt: "Ce", answer: "a" },
      { prompt: "ai", answer: "je" },
      { prompt: "as", answer: "tu" },
      { prompt: "a", answer: "il/elle/ce" }
    ]
  },
  COSYitaliano: {
    2: [
      { prompt: "Io", answer: "sono" },
      { prompt: "Tu", answer: "sei" },
      { prompt: "Lui", answer: "è" },
      { prompt: "Lei", answer: "è" },
      { prompt: "sono", answer: "io" },
      { prompt: "sei", answer: "tu" },
      { prompt: "è", answer: "lui/lei" }
    ],
    3: [
      { prompt: "Io", answer: "ho" },
      { prompt: "Tu", answer: "hai" },
      { prompt: "Lui", answer: "ha" },
      { prompt: "Lei", answer: "ha" },
      { prompt: "ho", answer: "io" },
      { prompt: "hai", answer: "tu" },
      { prompt: "ha", answer: "lui/lei" }
    ]
  },
  ΚΟΖΥελληνικά: {
    2: [
      { prompt: "Εγώ", answer: "είμαι" },
      { prompt: "Εσύ", answer: "είσαι" },
      { prompt: "Αυτός", answer: "είναι" },
      { prompt: "Αυτή", answer: "είναι" },
      { prompt: "Αυτό", answer: "είναι" },
      { prompt: "είμαι", answer: "εγώ" },
      { prompt: "είσαι", answer: "εσύ" },
      { prompt: "είναι", answer: "αυτός/αυτή/αυτό" }
    ],
    3: [
      { prompt: "Εγώ", answer: "έχω" },
      { prompt: "Εσύ", answer: "έχεις" },
      { prompt: "Αυτός", answer: "έχει" },
      { prompt: "Αυτή", answer: "έχει" },
      { prompt: "Αυτό", answer: "έχει" },
      { prompt: "έχω", answer: "εγώ" },
      { prompt: "έχεις", answer: "εσύ" },
      { prompt: "έχει", answer: "αυτός/αυτή/αυτό" }
    ]
  },
  COSYespañol: {
    2: [
      { prompt: "Yo", answer: "soy" },
      { prompt: "Tú", answer: "eres" },
      { prompt: "Él", answer: "es" },
      { prompt: "Ella", answer: "es" },
      { prompt: "Eso", answer: "es" },
      { prompt: "soy", answer: "yo" },
      { prompt: "eres", answer: "tú" },
      { prompt: "es", answer: "él/ella/eso" }
    ],
    3: [
      { prompt: "Yo", answer: "tengo" },
      { prompt: "Tú", answer: "tienes" },
      { prompt: "Él", answer: "tiene" },
      { prompt: "Ella", answer: "tiene" },
      { prompt: "tengo", answer: "yo" },
      { prompt: "tienes", answer: "tú" },
      { prompt: "tiene", answer: "él/ella" }
    ]
  },
  COSYportuguês: {
    2: [
      { prompt: "Eu", answer: "sou" },
      { prompt: "Tu", answer: "és" },
      { prompt: "Ele", answer: "é" },
      { prompt: "Ela", answer: "é" },
      { prompt: "Isso", answer: "é" },
      { prompt: "sou", answer: "eu" },
      { prompt: "és", answer: "tu" },
      { prompt: "é", answer: "ele/ela/isso" }
    ],
    3: [
      { prompt: "Eu", answer: "tenho" },
      { prompt: "Tu", answer: "tens" },
      { prompt: "Ele", answer: "tem" },
      { prompt: "Ela", answer: "tem" },
      { prompt: "tenho", answer: "eu" },
      { prompt: "tens", answer: "tu" },
      { prompt: "tem", answer: "ele/ela" }
    ]
  },
  COSYdeutsch: {
    2: [
      { prompt: "Ich", answer: "bin" },
      { prompt: "Du", answer: "bist" },
      { prompt: "Er", answer: "ist" },
      { prompt: "Sie", answer: "ist" },
      { prompt: "Es", answer: "ist" },
      { prompt: "bin", answer: "ich" },
      { prompt: "bist", answer: "du" },
      { prompt: "ist", answer: "er/sie/es" }
    ],
    3: [
      { prompt: "Ich", answer: "habe" },
      { prompt: "Du", answer: "hast" },
      { prompt: "Er", answer: "hat" },
      { prompt: "Sie", answer: "hat" },
      { prompt: "habe", answer: "ich" },
      { prompt: "hast", answer: "du" },
      { prompt: "hat", answer: "er/sie/es" }
    ]
  },
  ԾՈՍՅհայկական: {
    2: [
      { prompt: "Ես", answer: "եմ" },
      { prompt: "Դու", answer: "ես" },
      { prompt: "Նա", answer: "է" },
      { prompt: "Այն", answer: "է" },
      { prompt: "ենք", answer: "մենք" },
      { prompt: "ես", answer: "դու" },
      { prompt: "է", answer: "նա/այն" }
    ],
    3: [
      { prompt: "Ես", answer: "ունեմ" },
      { prompt: "Դու", answer: "ունես" },
      { prompt: "Նա", answer: "ունի" },
      { prompt: "Այն", answer: "ունի" },
      { prompt: "ունենամ", answer: "ես/դու/նա/այն" }
    ]
  },
  

};
if (typeof window !== 'undefined') window.verbPracticeData = verbPracticeData;
