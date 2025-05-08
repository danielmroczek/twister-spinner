/**
 * Utility to detect country and choose language
 */
export async function detectLanguage() {
  try {
    // Use a free GeoIP service (ipapi.co)
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    if (data && data.country_code === 'PL') {
      return 'pl';
    }
  } catch (e) {
    // Ignore errors and fallback to English
  }
  return 'en';
}