// gender-practice-data.js
// All gender data files must be loaded before this file in index.html

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

var genderPracticeData = {
  COSYfrançais: validateData(window.genderPracticeDataFrancais),
  COSYitaliano: validateData(window.genderPracticeDataItaliano),
  ΚΟΖΥελληνικά: validateData(window.genderPracticeDataEllinika),
  COSYbrezhoneg: validateData(window.genderPracticeDataBrezhoneg),
  ԾՈՍՅհայկական: validateData(window.genderPracticeDataHaykakan),
  COSYdeutsch: validateData(window.genderPracticeDataDeutsch),
  COSYenglish: validateData(window.genderPracticeDataEnglish),
  COSYespañol: validateData(window.genderPracticeDataEspanol),
  COSYportuguês: validateData(window.genderPracticeDataPortugues)
};

if (typeof window !== 'undefined') {
  window.genderPracticeData = genderPracticeData;
}