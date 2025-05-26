// Voices data for COSYlanguages
const voiceLanguageMap = {
  COSYenglish: { lang: "en-UK", voiceURI: "Google UK English" },
  COSYfrançais: { lang: "fr-FR", voiceURI: "Google français" },
  COSYitaliano: { lang: "it-IT", voiceURI: "Google italiano" },
  COSYespañol: { lang: "es-ES", voiceURI: "Google español" },
  COSYportuguês: { lang: "pt-PT", voiceURI: "Google português" },
  COSYdeutsch: { lang: "de-DE", voiceURI: "Google Deutsch" },
  ΚΟΖΥελληνικά: { lang: "el-GR", voiceURI: "Google ελληνικά" },
  ТАКОЙрусский: { lang: "ru-RU", voiceURI: "Google русский" },
  ԾՈՍՅհայկական: { lang: "hy-AM", voiceURI: "Google հայերեն" } // Try Google Armenian first
};
// If Google Armenian is not available, fallback to Microsoft Hayk (Windows)
// The app.js logic will try lang fallback if voiceURI is not found
if (typeof window !== 'undefined') window.voiceLanguageMap = voiceLanguageMap;
