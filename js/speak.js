// Store the selected voice for reuse
let selectedVoice = null;
let voiceInitialized = false;

/**
 * Initialize voice selection based on language
 * @param {string} lang - Language code (e.g., 'en', 'pl')
 */
function initializeVoice(lang) {
  if (voiceInitialized || !('speechSynthesis' in window)) {
    return;
  }

  const langMap = {
    'en': 'en-US',
    'pl': 'pl-PL'
  };
  const locale = langMap[lang] || lang;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    return;
  }

  selectedVoice = voices.find(voice => voice.lang.startsWith(locale));
  if (!selectedVoice) {
    selectedVoice = voices.find(voice => voice.lang.startsWith(lang));
  }

  voiceInitialized = true;
}

/**
 * Speak text using the browser's speech synthesis API
 * @param {string} text - Text to be spoken
 * @param {string} lang - Language code (e.g., 'en', 'pl')
 */
export function speakText(text, lang) {
  if (!('speechSynthesis' in window)) {
    console.log('Speech synthesis not supported');
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  const langMap = { 'en': 'en-US', 'pl': 'pl-PL' };
  utterance.lang = langMap[lang] || lang;

  const speakNow = () => {
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    window.speechSynthesis.speak(utterance);
  };

  if (!voiceInitialized) {
    if (window.speechSynthesis.getVoices().length > 0) {
      initializeVoice(lang);
      speakNow();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        initializeVoice(lang);
        speakNow();
      };
    }
  } else {
    speakNow();
  }
}
