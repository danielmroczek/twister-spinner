/**
 * Internationalization data - easily expandable for more languages
 */
export const i18n = {
  en: {
    title: "Twister Spinner",
    spinButton: "Spin",
    bodyParts: {
      hand: "Hand",
      foot: "Foot"
    },
    sides: {
      left: "Left",
      right: "Right"
    },
    colors: {
      red: "Red",
      green: "Green",
      blue: "Blue",
      yellow: "Yellow"
    },
    resultFormat: "{side} {bodyPart} on {color}"
  },
  pl: {
    title: "Twister Spinner",
    spinButton: "Losuj",
    bodyParts: {
      hand: "Ręka",
      foot: "Stopa"
    },
    sides: {
      left: "Lewa",
      right: "Prawa"
    },
    colors: {
      red: "Czerwony",
      green: "Zielony",
      blue: "Niebieski",
      yellow: "Żółty"
    },
    resultFormat: "{side} {bodyPart} na {color}"
  }
  // Add more languages as needed, e.g. "es", "fr", etc.
};

/**
 * Game configuration - easily extensible
 */
export const gameConfig = {
  bodyParts: [
    { id: "hand", icon: "hand.svg" },
    { id: "foot", icon: "foot.svg" }
  ],
  sides: [
    { id: "left" },
    { id: "right" }
  ],
  colors: [
    { id: "red", value: "var(--red)" },
    { id: "green", value: "var(--green)" },
    { id: "blue", value: "var(--blue)" },
    { id: "yellow", value: "var(--yellow)" }
  ],
  animationDuration: 300 // ms, controls both spin and pulse animation durations
};
