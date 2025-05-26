// gender-practice-data.js
// No imports, use global variables attached to window by each data file

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

console.log('genderPracticeDataFrancais:', window.genderPracticeDataFrancais);
console.log('genderPracticeDataItaliano:', window.genderPracticeDataItaliano);
console.log('genderPracticeDataEllinika:', window.genderPracticeDataEllinika);
console.log('genderPracticeDataBrezhoneg:', window.genderPracticeDataBrezhoneg);
console.log('genderPracticeDataHaykakan:', window.genderPracticeDataHaykakan);
console.log('genderPracticeDataDeutsch:', window.genderPracticeDataDeutsch);
console.log('genderPracticeDataEnglish:', window.genderPracticeDataEnglish);
console.log('genderPracticeDataEspanol:', window.genderPracticeDataEspanol);
console.log('genderPracticeDataPortugues:', window.genderPracticeDataPortugues);

window.genderPracticeData = {
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

console.log('window.genderPracticeData:', window.genderPracticeData);