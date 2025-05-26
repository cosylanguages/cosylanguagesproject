// Gender practice data for COSYlanguages (modularized)
import { genderPracticeDataFrancais } from './gender/francais.js';
import { genderPracticeDataItaliano } from './gender/italiano.js';
import { genderPracticeDataEllinika } from './gender/ellinika.js';
import { genderPracticeDataBrezhoneg } from './gender/brezhoneg.js';
import { genderPracticeDataHaykakan } from './gender/haykakan.js';
import { genderPracticeDataDeutsch } from './gender/deutsch.js';
import { genderPracticeDataEnglish } from './gender/english.js';
import { genderPracticeDataEspanol } from './gender/espanol.js';
import { genderPracticeDataPortugues } from './gender/portugues.js';

export const genderPracticeData = {
  COSYfrançais: genderPracticeDataFrancais,
  COSYitaliano: genderPracticeDataItaliano,
  ΚΟΖΥελληνικά: genderPracticeDataEllinika,
  COSYbrezhoneg: genderPracticeDataBrezhoneg,
  ԾՈՍՅհայկական: genderPracticeDataHaykakan,
  COSYdeutsch: genderPracticeDataDeutsch,
  COSYenglish: genderPracticeDataEnglish,
  COSYespañol: genderPracticeDataEspanol,
  COSYportuguês: genderPracticeDataPortugues
};

if (typeof window !== 'undefined') window.genderPracticeData = genderPracticeData;
