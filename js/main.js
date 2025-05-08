import TwisterSpinner from './spinner.js';
import { detectLanguage } from './i18n.js';

/**
 * Initialize the app when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', async () => {
  const language = await detectLanguage();
  const app = new TwisterSpinner(language);
});
