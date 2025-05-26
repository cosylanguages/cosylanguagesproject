// gender-practice-data.js
import { genderPracticeDataFrancais } from './gender/francais.js';
import { genderPracticeDataItaliano } from './gender/italiano.js';
import { genderPracticeDataEllinika } from './gender/ellinika.js';
import { genderPracticeDataBrezhoneg } from './gender/brezhoneg.js';
import { genderPracticeDataHaykakan } from './gender/haykakan.js';
import { genderPracticeDataDeutsch } from './gender/deutsch.js';
import { genderPracticeDataEnglish } from './gender/english.js';
import { genderPracticeDataEspanol } from './gender/espanol.js';
import { genderPracticeDataPortugues } from './gender/portugues.js';

// Validate and provide fallback for missing data
const validateData = (data) => {
  if (!data) return {};
  // Ensure all days (1-7) exist with empty arrays if not defined
  const validated = {};
  for (let i = 1; i <= 7; i++) {
    validated[i] = data[i] || [];
  }
  return validated;
};

export const genderPracticeData = {
  COSYfrançais: validateData(genderPracticeDataFrancais),
  COSYitaliano: validateData(genderPracticeDataItaliano),
  ΚΟΖΥελληνικά: validateData(genderPracticeDataEllinika),
  COSYbrezhoneg: validateData(genderPracticeDataBrezhoneg),
  ԾՈՍՅհայկական: validateData(genderPracticeDataHaykakan),
  COSYdeutsch: validateData(genderPracticeDataDeutsch),
  COSYenglish: validateData(genderPracticeDataEnglish),
  COSYespañol: validateData(genderPracticeDataEspanol),
  COSYportuguês: validateData(genderPracticeDataPortugues)
};

if (typeof window !== 'undefined') {
  window.genderPracticeData = genderPracticeData;
}