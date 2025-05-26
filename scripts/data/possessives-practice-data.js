// Possessives practice data for COSYlanguages
import { possessivesDataEnglish } from './possessives/english.js';
import { possessivesDataFrancais } from './possessives/francais.js';
import { possessivesDataItaliano } from './possessives/italiano.js';
import { possessivesDataEspanol } from './possessives/espanol.js';
import { possessivesDataPortugues } from './possessives/portugues.js';
import { possessivesDataDeutsch } from './possessives/deutsch.js';
import { possessivesDataRusskiy } from './possessives/russkiy.js';
import { possessivesDataEllinika } from './possessives/ellinika.js';
import { possessivesDataHaykakan } from './possessives/haykakan.js';
import { possessivesDataTatarca } from './possessives/tatarca.js';
import { possessivesDataBashkort } from './possessives/bashkort.js';
import { possessivesDataBrezhoneg } from './possessives/brezhoneg.js';

const possessivesPracticeData = {
  COSYenglish: possessivesDataEnglish,
  COSYfrançais: possessivesDataFrancais,
  COSYitaliano: possessivesDataItaliano,
  COSYespañol: possessivesDataEspanol,
  COSYportuguês: possessivesDataPortugues,
  COSYdeutsch: possessivesDataDeutsch,
  ТАКОЙрусский: possessivesDataRusskiy,
  ΚΟΖΥελληνικά: possessivesDataEllinika,
  ԾՈՍՅհայկական: possessivesDataHaykakan,
  COSYtatarça: possessivesDataTatarca,
  COSYbashkort: possessivesDataBashkort,
  COSYbrezhoneg: possessivesDataBrezhoneg
};

if (typeof window !== 'undefined') window.possessivesPracticeData = possessivesPracticeData;
export { possessivesPracticeData };
