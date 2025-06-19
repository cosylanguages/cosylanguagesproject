// Global flag to control transliteration
window.isLatinizationActive = true;

function latinizeRussian(text) {
  const russianToLatinMap = {
    'А': 'A', 'а': 'a', 'Б': 'B', 'б': 'b', 'В': 'V', 'в': 'v', 'Г': 'G', 'г': 'g',
    'Д': 'D', 'д': 'd', 'Е': 'E', 'е': 'e', 'Ё': 'E', 'ё': 'e', 'Ж': 'ZH', 'ж': 'zh',
    'З': 'Z', 'з': 'z', 'И': 'I', 'и': 'i', 'Й': 'Y', 'й': 'y', 'К': 'K', 'к': 'k',
    'Л': 'L', 'л': 'l', 'М': 'M', 'м': 'm', 'Н': 'N', 'н': 'n', 'О': 'O', 'о': 'o',
    'П': 'P', 'п': 'p', 'Р': 'R', 'р': 'r', 'С': 'S', 'с': 's', 'Т': 'T', 'т': 't',
    'У': 'U', 'у': 'u', 'Ф': 'F', 'ф': 'f', 'Х': 'KH', 'х': 'kh', 'Ц': 'TS', 'ц': 'ts',
    'Ч': 'CH', 'ч': 'ch', 'Ш': 'SH', 'ш': 'sh', 'Щ': 'SHCH', 'щ': 'shch',
    'Ъ': '', 'ъ': '', 'Ы': 'Y', 'ы': 'y', 'Ь': '', 'ь': '', 'Э': 'E', 'э': 'e',
    'Ю': 'YU', 'ю': 'yu', 'Я': 'YA', 'я': 'ya'
  };
  let latinizedText = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    latinizedText += russianToLatinMap[char] || char;
  }
  return latinizedText;
}

function latinizeArmenian(text) {
  const armenianToLatinMap = {
    'Ա': 'A', 'Բ': 'B', 'Գ': 'G', 'Դ': 'D', 'Ե': 'YE', 'Զ': 'Z', 'Է': 'E', 'Ը': 'E',
    'Թ': 'T\'', 'Ժ': 'ZH', 'Ի': 'I', 'Լ': 'L', 'Խ': 'KH', 'Ծ': 'TS', 'Կ': 'K', 'Հ': 'H',
    'Ձ': 'DZ', 'Ղ': 'GH', 'Ճ': 'CH', 'Մ': 'M', 'Յ': 'Y', 'Ն': 'N', 'Շ': 'SH', 'Ո': 'VO',
    'Չ': 'CH\'', 'Պ': 'P', 'Ջ': 'J', 'Ռ': 'R', 'Ս': 'S', 'Վ': 'V', 'Տ': 'T', 'Ր': 'R',
    'Ց': 'TS\'', 'Ւ': 'V', 'Փ': 'P\'', 'Ք': 'K\'',
    'ա': 'a', 'բ': 'b', 'գ': 'g', 'դ': 'd', 'ե': 'ye', 'զ': 'z', 'է': 'e', 'ը': 'e',
    'թ': 't\'', 'ժ': 'zh', 'ի': 'i', 'լ': 'l', 'խ': 'kh', 'ծ': 'ts', 'կ': 'k', 'հ': 'h',
    'ձ': 'dz', 'ղ': 'gh', 'ճ': 'ch', 'մ': 'm', 'յ': 'y', 'ն': 'n', 'շ': 'sh', 'ո': 'vo',
    'չ': 'ch\'', 'պ': 'p', 'ջ': 'j', 'ռ': 'r', 'ս': 's', 'վ': 'v', 'տ': 't', 'ր': 'r',
    'ց': 'ts\'', 'ւ': 'v', 'փ': 'p\'', 'ք': 'k\''
  };
  let latinizedText = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    latinizedText += armenianToLatinMap[char] || char;
  }
  return latinizedText;
}

function latinizeGreek(text) {
  const greekToLatinMap = {
    'Α': 'A', 'Β': 'V', 'Γ': 'G', 'Δ': 'D', 'Ε': 'E', 'Ζ': 'Z', 'Η': 'I', 'Θ': 'TH',
    'Ι': 'I', 'Κ': 'K', 'Λ': 'L', 'Μ': 'M', 'Ν': 'N', 'Ξ': 'X', 'Ο': 'O', 'Π': 'P',
    'Ρ': 'R', 'Σ': 'S', 'Τ': 'T', 'Υ': 'Y', 'Φ': 'F', 'Χ': 'CH', 'Ψ': 'PS', 'Ω': 'O',
    'α': 'a', 'β': 'v', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'i', 'θ': 'th',
    'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': 'x', 'ο': 'o', 'π': 'p',
    'ρ': 'r', 'σ': 's', 'ς': 's', 'τ': 't', 'υ': 'y', 'φ': 'f', 'χ': 'ch', 'ψ': 'ps', 'ω': 'o',
    'αι': 'ai', 'ει': 'ei', 'οι': 'oi', 'ου': 'ou', 'γγ': 'ng', 'γκ': 'gk', 'γχ': 'nch',
    'μπ': 'b', 'ντ': 'd', 'ΑΙ': 'AI', 'ΕΙ': 'EI', 'ΟΙ': 'OI', 'ΟΥ': 'OU', 'ΓΓ': 'NG',
    'ΓΚ': 'GK', 'ΓΧ': 'NCH', 'ΜΠ': 'B', 'ΝΤ': 'D'
  };
  let latinizedText = "";
  let i = 0;
  while (i < text.length) {
    let foundDigraph = false;
    if (i + 1 < text.length) {
      const digraph = text.substring(i, i + 2);
      if (greekToLatinMap[digraph]) {
        latinizedText += greekToLatinMap[digraph];
        i += 2;
        foundDigraph = true;
      }
    }
    if (!foundDigraph) {
      const char = text[i];
      latinizedText += greekToLatinMap[char] || char;
      i += 1;
    }
  }
  return latinizedText;
}

function getLatinization(text, languageIdentifier) {
  if (!text || text.trim() === '') {
    return text;
  }

  // Use exact language values from the select options
  if (languageIdentifier === 'ТАКОЙрусский') {
    return latinizeRussian(text);
  } else if (languageIdentifier === 'ΚΟΖΥελληνικά') {
    return latinizeGreek(text);
  } else if (languageIdentifier === 'ԾՈՍՅհայկական') {
    return latinizeArmenian(text);
  } else {
    return text; // Return original text if language is not supported
  }
}

function transliterateSelectedText() {
  if (!window.isLatinizationActive) {
    return null; // Or empty string, depending on how it will be used
  }

  const selectedText = window.getSelection().toString();
  if (!selectedText || selectedText.trim() === '') {
    return null; // Or empty string
  }

  const languageDropdown = document.getElementById('language');
  const currentLanguage = languageDropdown ? languageDropdown.value : '';

  if (!currentLanguage) {
    return selectedText; // Or null, if no language selected, no transliteration
  }

  return getLatinization(selectedText, currentLanguage);
}

// Expose functions to the global scope for use in other scripts.
if (typeof window !== 'undefined') {
  window.getLatinization = getLatinization; // Already existed, ensure it's still there
  window.transliterateSelectedText = transliterateSelectedText;
  // window.isLatinizationActive is already defined directly on window
}
