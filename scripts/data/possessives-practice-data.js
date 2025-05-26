// Possessives practice data for COSYlanguages (modularized)
import { possessivesDataFrancais } from './possessives/francais.js';
import { possessivesDataItaliano } from './possessives/italiano.js';
import { possessivesDataPortugues } from './possessives/portugues.js';
import { possessivesDataBashkort } from './possessives/bashkort.js';
import { possessivesDataTatarca } from './possessives/tatarca.js';

export const possessivesPracticeData = {
  COSYfrançais: possessivesDataFrancais,
  COSYitaliano: possessivesDataItaliano,
  COSYportuguês: possessivesDataPortugues,
  COSYbashkort: possessivesDataBashkort,
  COSYtatarça: possessivesDataTatarca
};

if (typeof window !== 'undefined') window.possessivesPracticeData = possessivesPracticeData;
