// Grammar data for COSYlanguages (modularized)
import { grammarDataFrancais } from './grammar/francais.js';
import { grammarDataItaliano } from './grammar/italiano.js';
import { grammarDataEllinika } from './grammar/ellinika.js';
import { grammarDataBrezhoneg } from './grammar/brezhoneg.js';
import { grammarDataHaykakan } from './grammar/haykakan.js';
import { grammarDataDeutsch } from './grammar/deutsch.js';
import { grammarDataEnglish } from './grammar/english.js';
import { grammarDataEspanol } from './grammar/espanol.js';
import { grammarDataPortugues } from './grammar/portugues.js';

export const grammarData = {
  COSYfrançais: grammarDataFrancais,
  COSYitaliano: grammarDataItaliano,
  ΚΟΖΥελληνικά: grammarDataEllinika,
  COSYbrezhoneg: grammarDataBrezhoneg,
  ԾՈՍՅհայկական: grammarDataHaykakan,
  COSYdeutsch: grammarDataDeutsch,
  COSYenglish: grammarDataEnglish,
  COSYespañol: grammarDataEspanol,
  COSYportuguês: grammarDataPortugues
};

if (typeof window !== 'undefined') window.grammarData = grammarData;
