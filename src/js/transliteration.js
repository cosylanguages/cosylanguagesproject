function latinizeRussian(text) {
  const russianToLatinMap = {
    'А': 'A', 'а': 'a',
    'Б': 'B', 'б': 'b',
    'В': 'V', 'в': 'v',
    'Г': 'G', 'г': 'g',
    'Д': 'D', 'д': 'd',
    'Е': 'E', 'е': 'e', // Simplified, no YE distinction for simplicity
    'Ё': 'E', 'ё': 'e', // Simplified, no YO distinction for simplicity
    'Ж': 'ZH', 'ж': 'zh',
    'З': 'Z', 'з': 'z',
    'И': 'I', 'и': 'i',
    'Й': 'Y', 'й': 'y',
    'К': 'K', 'к': 'k',
    'Л': 'L', 'л': 'l',
    'М': 'M', 'м': 'm',
    'Н': 'N', 'н': 'n',
    'О': 'O', 'о': 'o',
    'П': 'P', 'п': 'p',
    'Р': 'R', 'р': 'r',
    'С': 'S', 'с': 's',
    'Т': 'T', 'т': 't',
    'У': 'U', 'у': 'u',
    'Ф': 'F', 'ф': 'f',
    'Х': 'KH', 'х': 'kh',
    'Ц': 'TS', 'ц': 'ts',
    'Ч': 'CH', 'ч': 'ch',
    'Ш': 'SH', 'ш': 'sh',
    'Щ': 'SHCH', 'щ': 'shch',
    'Ъ': '', 'ъ': '',
    'Ы': 'Y', 'ы': 'y',
    'Ь': '', 'ь': '',
    'Э': 'E', 'э': 'e',
    'Ю': 'YU', 'ю': 'yu',
    'Я': 'YA', 'я': 'ya'
  };

  let latinizedText = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    latinizedText += russianToLatinMap[char] || char;
  }
  return latinizedText;
}

// Expose getLatinization to the global scope for use in other scripts.
// Assuming this is running in a browser environment.
if (typeof window !== 'undefined') {
  window.getLatinization = getLatinization;
}

function latinizeArmenian(text) {
  const armenianToLatinMap = {
    // Uppercase
    'Ա': 'A', 'Բ': 'B', 'Գ': 'G', 'Դ': 'D', 'Ե': 'YE', 'Զ': 'Z', 'Է': 'E', 'Ը': 'E',
    'Թ': 'T\'', 'Ժ': 'ZH', 'Ի': 'I', 'Լ': 'L', 'Խ': 'KH', 'Ծ': 'TS', 'Կ': 'K', 'Հ': 'H',
    'Ձ': 'DZ', 'Ղ': 'GH', 'Ճ': 'CH', 'Մ': 'M', 'Յ': 'Y', 'Ն': 'N', 'Շ': 'SH', 'Ո': 'VO',
    'Չ': 'CH\'', 'Պ': 'P', 'Ջ': 'J', 'Ռ': 'R', 'Ս': 'S', 'Վ': 'V', 'Տ': 'T', 'Ր': 'R',
    'Ց': 'TS\'', 'Ւ': 'V', 'Փ': 'P\'', 'Ք': 'K\'',
    // Lowercase
    'ա': 'a', 'բ': 'b', 'գ': 'g', 'դ': 'd', 'ե': 'ye', 'զ': 'z', 'է': 'e', 'ը': 'e',
    'թ': 't\'', 'ժ': 'zh', 'ի': 'i', 'լ': 'l', 'խ': 'kh', 'ծ': 'ts', 'կ': 'k', 'հ': 'h',
    'ձ': 'dz', 'ղ': 'gh', 'ճ': 'ch', 'մ': 'm', 'յ': 'y', 'ն': 'n', 'շ': 'sh', 'ո': 'vo',
    'չ': 'ch\'', 'պ': 'p', 'ջ': 'j', 'ռ': 'r', 'ս': 's', 'վ': 'v', 'տ': 't', 'ր': 'r',
    'ց': 'ts\'', 'ւ': 'v', 'փ': 'p\'', 'ք': 'k\''
  };

  // Handle specific cases like Ե and Ո at the beginning of a word or after a vowel.
  // For simplicity, this implementation uses fixed mapping. More complex rules could be added here.
  // For 'Ե' and 'Ո', the map already provides 'YE' and 'VO'.
  // A more sophisticated approach would check context (e.g. previous char).

  let latinizedText = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    // Special handling for 'Ե' and 'Ո' if needed, e.g., if they should be 'E' or 'O' in some contexts.
    // Current map is YE/VO. For E/O, one might check if i === 0 or if text[i-1] is a vowel.
    // This basic version will use the map directly.
    latinizedText += armenianToLatinMap[char] || char;
  }
  return latinizedText;
}

function getLatinization(text, languageIdentifier) {
  if (!text || text.trim() === '') {
    return text;
  }

  // Normalize language identifier by removing special characters and converting to lowercase
  const normalizedIdentifier = (languageIdentifier || '').replace(/[^\w]/g, '').toLowerCase();

  // Determine language from identifier
  // This is a simple check, more robust language detection might be needed for production
  if (normalizedIdentifier.includes('русский') || normalizedIdentifier.includes('russian')) {
    return latinizeRussian(text);
  } else if (normalizedIdentifier.includes('ελληνικά') || normalizedIdentifier.includes('greek')) {
    return latinizeGreek(text);
  } else if (normalizedIdentifier.includes('հայկական') || normalizedIdentifier.includes('armenian')) {
    return latinizeArmenian(text);
  } else {
    // Return original text if language is not supported or identifier is unclear
    return text;
  }
}

function latinizeGreek(text) {
  const greekToLatinMap = {
    // Uppercase
    'Α': 'A', 'Β': 'V', 'Γ': 'G', 'Δ': 'D', 'Ε': 'E', 'Ζ': 'Z', 'Η': 'I', 'Θ': 'TH',
    'Ι': 'I', 'Κ': 'K', 'Λ': 'L', 'Μ': 'M', 'Ν': 'N', 'Ξ': 'X', 'Ο': 'O', 'Π': 'P',
    'Ρ': 'R', 'Σ': 'S', 'Τ': 'T', 'Υ': 'Y', 'Φ': 'F', 'Χ': 'CH', 'Ψ': 'PS', 'Ω': 'O',
    // Lowercase
    'α': 'a', 'β': 'v', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'i', 'θ': 'th',
    'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': 'x', 'ο': 'o', 'π': 'p',
    'ρ': 'r', 'σ': 's', 'ς': 's', 'τ': 't', 'υ': 'y', 'φ': 'f', 'χ': 'ch', 'ψ': 'ps', 'ω': 'o',
    // Digraphs (simplified handling)
    'αι': 'ai', 'ει': 'ei', 'οι': 'oi', 'ου': 'ou', 'γγ': 'ng', 'γκ': 'gk', 'γχ': 'nch',
    'μπ': 'b', // Simplified, could also be 'mp'
    'ντ': 'd', // Simplified, could also be 'nt'
    'ΑΙ': 'AI', 'ΕΙ': 'EI', 'ΟΙ': 'OI', 'ΟΥ': 'OU', 'ΓΓ': 'NG', 'ΓΚ': 'GK', 'ΓΧ': 'NCH',
    'ΜΠ': 'B', // Simplified
    'ΝΤ': 'D'  // Simplified
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
