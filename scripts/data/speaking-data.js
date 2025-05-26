const speakingData = {
  COSYenglish: {
    1: ["One coffee or one tea? Cash or card?"],
    2: [
      "Who are you? (name, man or woman, student or teacher?)",
      "Name 3 popular people (name, man or woman?)",
      "Name 3 people (name, man or woman?)"
    ],
    3: [
      "Your family",
      "Your friend and his/her family",
      "Drinks you have and drinks you don't have",
      "Drinks your friend has and drinks he/she doesn't have"
    ]
  },
  COSYfrançais: {
    1: ["Un café ou un thé? Espèces ou carte?"],
    2: [
      "Qui es-tu? (le nom, homme ou femme, étudiant.e ou professeur?)",
      "Nommez 3 personnes populaires (le nom, homme ou femme?)",
      "Nommez 3 personnes (le nom, homme ou femme?)"
    ],
    3: ["Ma famille, mon ami et sa famille, les boissons que tu prends."]
  },
  COSYitaliano: {
    1: ["Un caffè o un tè? Contanti o carta?"],
    2: [
      "Chi sei? (il nome, uomo o donna, studente.ssa o professore.ssa?)",
      "Nome 3 persone popolari (il nome, uomo o donna?)",
      "Nome 3 persone (il nome, uomo o donna?)"
    ],
    3: ["La mia famiglia, il mio amico e la sua famiglia, le bevande che prendi."]
  },
  ΚΟΖΥελληνικά: {
    1: ["Έναν καφέ ή ένα τσάι; Μετρητά ή κάρτα;"],
    2: [
      "Ποιος είσαι; (το όνομα, άντρας ή γυναίκα, μαθητής.ρια ή δάσκαλος.α;)",
      "Ονομάστε 3 δημοφιλή άτομα (το όνομα, άντρας ή γυναίκα;)",
      "Ονομάστε 3 άτομα (το όνομα, άντρας ή γυναίκα;)"
    ],
    3: ["Η οικογένειά μου, ο φίλος μου και η οικογένειά του/της, τα ποτά που πίνεις."]
  },
  COSYespañol: {
    1: ["¿Un café o un té? ¿Efectivo o tarjeta?"],
    2: [
      "¿Quién eres? (nombre, hombre o mujer, estudiante o profesor/a?)",
      "Nombra 3 personas populares (nombre, hombre o mujer?)",
      "Nombra 3 personas (nombre, hombre o mujer?)"
    ],
    3: ["Mi familia, mi amigo y su familia, las bebidas que tomas."]
  },
  COSYportuguês: {
    1: ["Um café ou um chá? Dinheiro ou cartão?"],
    2: [
      "Quem é você? (nome, homem ou mulher, estudante ou professor/a?)",
      "Nomeie 3 pessoas populares (nome, homem ou mulher?)",
      "Nomeie 3 pessoas (nome, homem ou mulher?)"
    ],
    3: ["Minha família, meu amigo e sua família, as bebidas que você toma."]
  },
  COSYdeutsch: {
    1: ["Kaffee oder Tee? Bar oder Karte?"],
    2: [
      "Wer bist du? (Name, Mann oder Frau, Student/in oder Lehrer/in?)",
      "Nenne 3 bekannte Personen (Name, Mann oder Frau?)",
      "Nenne 3 Personen (Name, Mann oder Frau?)"
    ],
    3: ["Meine Familie, mein Freund und seine Familie, die Getränke, die du trinkst."]
  },
  'ТАКОЙрусский': {
    1: ["Кофе или чай? Наличные или карта?"],
    2: [
      "Кто ты? (имя, мужчина или женщина, студент или преподаватель?)",
      "Назови 3 известных человека (имя, мужчина или женщина?)",
      "Назови 3 человека (имя, мужчина или женщина?)"
    ],
    3: ["Моя семья, мой друг и его семья, напитки, которые ты пьёшь."]
  },
  'ԾՈՍՅհայկական': {
    1: ["Սուրճ թե թեյ։ Կանխիկ թե քարտ։"],
    2: [
      "Ո՞վ ես դու։ (անուն, տղամարդ թե կին, ուսանող/ուհի թե դասախոս)։",
      "Անվանիր 3 հայտնի մարդ (անուն, տղամարդ թե կին)։",
      "Անվանիր 3 մարդ (անուն, տղամարդ թե կին)։"
    ],
    3: ["Իմ ընտանիքը, իմ ընկերը և նրա ընտանիքը, այն ըմպելիքները, որ դու խմում ես։"]
  },
  COSYbrezhoneg: {
    1: [
      { sentence: "Me zo ur paotr.", translation: "I am a boy." }
    ]
  },
  COSYtatarça: {
    1: [
      { sentence: "Min malay.", translation: "I am a boy." }
    ]
  },
  COSYbashkort: {
    1: ["Бер кофе йәки бер сәй? Нәҡитме, карта менәнме?"],
    2: [
      "Һин кем? (исем, ир-егетме, ҡатын-ҡыҙмы, студентмы, уҡытыусымы?)",
      "3 билдәле кешене ата (исем, ир-егетме, ҡатын-ҡыҙмы?)"
    ],
    3: [
      "Һинең ғаиләң",
      "Дуҫың һәм уның ғаиләһе",
      "Һиндә булған һәм булмаған эсемлектәр",
      "Дуҫыңда булған һәм булмаған эсемлектәр"
    ]
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.speakingData = speakingData;
}
