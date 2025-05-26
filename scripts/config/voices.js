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
  ԾՈՍՅհայկական: { lang: "hy-AM", voiceURI: "Google հայերեն" }, // Try Google Armenian first
  COSYbrezhoneg: {
    lang: "br-FR", // Use Breton code if supported, fallback to French
    voiceURI: "Google français",
    hello: "audio/breton-hello.mp3",
    goodbye: "audio/breton-goodbye.mp3"
    // Add more as needed
  },
  COSYtatarça: {
    lang: "tt-RU", // Use Tatar code if supported, fallback to Russian
    voiceURI: "Google русский",
    hello: "audio/tatar-hello.mp3",
    goodbye: "audio/tatar-goodbye.mp3"
    // Add more as needed
  },
  COSYbashkort: {
    lang: "ba-RU", // Use Bashkir code if supported, fallback to Russian
    voiceURI: "Google русский",
    hello: "audio/bashkir-hello.mp3",
    goodbye: "audio/bashkir-goodbye.mp3"
    // Add more as needed
  }
};
// If Google Armenian is not available, fallback to Microsoft Hayk (Windows)
// The app.js logic will try lang fallback if voiceURI is not found
if (typeof window !== 'undefined') window.voiceLanguageMap = voiceLanguageMap;
