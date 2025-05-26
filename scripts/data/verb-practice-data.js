// Verb data for COSYlanguages (modularized)
import { verbPracticeDataEnglish } from './verbs/english.js';
import { verbPracticeDataFrancais } from './verbs/francais.js';
import { verbPracticeDataItaliano } from './verbs/italiano.js';
import { verbPracticeDataDeutsch } from './verbs/deutsch.js';
import { verbPracticeDataEspanol } from './verbs/espanol.js';
import { verbPracticeDataPortugues } from './verbs/portugues.js';
import { verbPracticeDataEllinika } from './verbs/ellinika.js';
import { verbPracticeDataBrezhoneg } from './verbs/brezhoneg.js';
import { verbPracticeDataHaykakan } from './verbs/haykakan.js';

export const verbPracticeData = {
  COSYenglish: verbPracticeDataEnglish,
  COSYfrançais: verbPracticeDataFrancais,
  COSYitaliano: verbPracticeDataItaliano,
  COSYdeutsch: verbPracticeDataDeutsch,
  COSYespañol: verbPracticeDataEspanol,
  COSYportuguês: verbPracticeDataPortugues,
  ΚΟΖΥελληνικά: verbPracticeDataEllinika,
  COSYbrezhoneg: verbPracticeDataBrezhoneg,
  ԾՈՍՅհայկական: verbPracticeDataHaykakan
};

if (typeof window !== 'undefined') window.verbPracticeData = verbPracticeData;
