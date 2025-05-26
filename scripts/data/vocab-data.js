// Vocabulary data for COSYlanguages

import { vocabDataEnglish } from './vocab/english.js';
import { vocabDataFrancais } from './vocab/francais.js';
import { vocabDataItaliano } from './vocab/italiano.js';
import { vocabDataPortugues } from './vocab/portugues.js';
import { vocabDataBrezhoneg } from './vocab/brezhoneg.js';
import { vocabDataTatarca } from './vocab/tatarca.js';
import { vocabDataBashkort } from './vocab/bashkort.js';
import { vocabDataEspanol } from './vocab/espanol.js';
import { vocabDataDeutsch } from './vocab/deutsch.js';
import { vocabDataRusskiy } from './vocab/russkiy.js';
import { vocabDataEllinika } from './vocab/ellinika.js';
import { vocabDataHaykakan } from './vocab/haykakan.js';

const vocabData = {
  COSYenglish: vocabDataEnglish,
  COSYfrançais: vocabDataFrancais,
  COSYitaliano: vocabDataItaliano,
  COSYespañol: vocabDataEspanol,
  COSYportuguês: vocabDataPortugues,
  COSYdeutsch: vocabDataDeutsch,
  ТАКОЙрусский: vocabDataRusskiy,
  ΚΟΖΥελληνικά: vocabDataEllinika,
  ԾՈՍՅհայկական: vocabDataHaykakan,
  COSYbrezhoneg: vocabDataBrezhoneg,
  COSYtatarça: vocabDataTatarca,
  COSYbashkort: vocabDataBashkort
};

if (typeof window !== 'undefined') window.vocabData = vocabData;
export { vocabData };
