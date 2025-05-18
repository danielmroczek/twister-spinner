import { i18n, gameConfig } from './config.js';
import { speakText } from './speak.js';

/**
 * TwisterSpinner class handles the game logic and UI interactions
 */
export default class TwisterSpinner {
  /**
   * Create a new TwisterSpinner instance
   * @param {string} language - The language code to use
   */
  constructor(language = 'en') {
    this.language = language;
    this.translations = i18n[language];
    this.currentSpin = null;
    this.isSpinning = false;
    this.lastSelection = null; // Track the last body part + side combination

    // Set animation duration CSS variable from config
    document.documentElement.style.setProperty('--anim-duration', `${gameConfig.animationDuration}ms`);

    this.init();
  }

  /**
   * Initialize the UI and event listeners
   */
  init() {
    // Initialize UI
    document.title = this.translations.title;
    document.getElementById('spin-button').textContent = this.translations.spinButton;

    // Set up event listeners
    this.setupEventListeners();

    // Initial state
    this.resetDisplay();
  }

  /**
   * Set up all event listeners
   */
  setupEventListeners() {
    const spinButton = document.getElementById('spin-button');
    spinButton.addEventListener('click', () => this.spin());

    // Add spacebar trigger
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !e.repeat && !this.isSpinning) {
        e.preventDefault();
        spinButton.focus(); // Focus the button for accessibility
        this.spin();
      }
    });

    // Enable swipe/touch for mobile
    let touchStartY;
    document.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      if (touchStartY - touchEndY > 50 && !this.isSpinning) { // Swipe up
        this.spin();
      }
    });
  }

  /**
   * Start the spinning animation
   */
  startAnimation() {
    const spinButton = document.getElementById('spin-button');
    const background = document.getElementById('background');
    spinButton.classList.add('animating');
    background.classList.add('pulse');
  }

  /**
   * Stop the spinning animation
   */
  stopAnimation() {
    const spinButton = document.getElementById('spin-button');
    const background = document.getElementById('background');
    spinButton.classList.remove('animating');
    background.classList.remove('pulse');
  }

  /**
   * Start the spinning animation
   */
  spin() {
    if (this.isSpinning) return;

    this.isSpinning = true;
    const background = document.getElementById('background');
    const partIcon = document.getElementById('part-icon');
    const results = document.getElementById('results');
    const spinButton = document.getElementById('spin-button');

    // Animate the spin button
    this.startAnimation();

    // Clear previous results and reset icon
    results.textContent = '';
    partIcon.innerHTML = '';

    // Simulate spinning animation with color changes
    let counter = 0;
    const animationInterval = setInterval(() => {
      const randomColor = this.getRandomFrom(gameConfig.colors);
      background.style.backgroundColor = randomColor.value;
      counter++;

      if (counter >= 8) {
        clearInterval(animationInterval);
        this.finalizeSpin();
      }
    }, gameConfig.animationDuration / 4);

    setTimeout(() => {
      clearInterval(animationInterval);
      this.stopAnimation();
      this.isSpinning = false;
    }, gameConfig.animationDuration * 2);
  }

  /**
   * Complete the spin and determine the result
   */
  finalizeSpin() {
    // Select random values
    const newSelection = this.getNewSelection();
    const color = this.getRandomFrom(gameConfig.colors);

    this.currentSpin = { ...newSelection, color };

    // Update UI
    this.updateDisplay();
    
    // Speak the result text that's displayed in the UI
    const resultText = document.getElementById('results').textContent;
    speakText(resultText, this.language);

    // Stop animation
    setTimeout(() => {
      const background = document.getElementById('background');
      background.classList.remove('pulse');
      background.classList.remove('color-shift');
      this.isSpinning = false;
    }, 500);
  }

  /**
   * Generates a new random selection of a body part and side, ensuring it is not the same as the last selection.
   *
   * @returns {{ bodyPart: String, side: String }} An object containing:
   *   - bodyPart: The selected body part from `gameConfig.bodyParts`.
   *   - side: The selected side from `gameConfig.sides`.
   *   The returned combination will always differ from the previous selection stored in `this.lastSelection`.
   */
  getNewSelection() {
    const possibleCombinations = [];

    for (const bodyPart of gameConfig.bodyParts) {
      for (const side of gameConfig.sides) {
        if (
          this.lastSelection &&
          this.lastSelection.bodyPart.id === bodyPart.id &&
          this.lastSelection.side.id === side.id
        ) {
          continue;
        }
        possibleCombinations.push({ bodyPart, side });
      }
    }

    const newSelection = this.getRandomFrom(possibleCombinations);
    this.lastSelection = newSelection; // Update the last selection
    return newSelection;
  }

  /**
   * Get a random item from an array
   * @param {Array} array - The array to pick from
   * @returns {*} A random item from the array
   */
  getRandomFrom(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Update the UI to display the current spin result
   */
  updateDisplay() {
    if (!this.currentSpin) return;

    const { bodyPart, side, color } = this.currentSpin;
    const background = document.getElementById('background');
    const partIcon = document.getElementById('part-icon');
    const results = document.getElementById('results');

    // Update background color
    background.style.backgroundColor = color.value;

    // Update text display
    const resultText = this.translations.resultFormat
      .replace('{side}', this.translations.sides[side.id])
      .replace('{bodyPart}', this.translations.bodyParts[bodyPart.id])
      .replace('{color}', this.translations.colors[color.id]);

    results.textContent = resultText;

    // Use CSS variable for text color
    results.style.color = getContrastTextCssVar(color.value);

    // Position and display icon (load SVG from assets and mirror if left)
    const iconUrl = `assets/${bodyPart.icon}`;
    partIcon.innerHTML = `<img src="${iconUrl}" alt="" style="
      width: 100%; height: 100%;
      ${side.id === 'left' ? 'transform: scaleX(-1);' : ''}
      filter: ${getContrastTextCssVar(color.value) === 'var(--contrast-dark)' ? 'invert(0)' : 'invert(1)'};
    ">`;
    partIcon.style.left = side.id === 'left' ? '10%' : 'auto';
    partIcon.style.right = side.id === 'right' ? '10%' : 'auto';

    // Set icon color for contrast with background (handled by filter above)
    partIcon.style.color = '';

    // Update ARIA for accessibility
    partIcon.setAttribute('aria-label', resultText);
  }

  /**
   * Reset the display to its default state
   */
  resetDisplay() {
    const background = document.getElementById('background');
    const partIcon = document.getElementById('part-icon');
    const results = document.getElementById('results');

    background.style.backgroundColor = 'var(--background-default)';
    partIcon.innerHTML = '';
    results.textContent = '';
  }
}

/**
 * Utility to get computed color value from CSS variable
 * @param {string} varName - The CSS variable name
 * @returns {string} The computed value of the CSS variable
 */
function getCssVarValue(varName) {
  if (varName.startsWith('var(')) {
    return getComputedStyle(document.documentElement).getPropertyValue(
      varName.match(/var\((--[^)]+)\)/)[1]
    ).trim();
  }
  return varName;
}

/**
 * Utility to compute luminance and return best contrast color
 * @param {string} bgColor - The background color in hex or CSS variable format
 * @returns {string} CSS variable reference for contrast color
 */
function getContrastTextCssVar(bgColor) {
  let hex = getCssVarValue(bgColor);
  if (hex.startsWith('#')) {
    let r = parseInt(hex.substr(1, 2), 16);
    let g = parseInt(hex.substr(3, 2), 16);
    let b = parseInt(hex.substr(5, 2), 16);
    let luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5 ? 'var(--contrast-light)' : 'var(--contrast-dark)';
  }
  return 'var(--contrast-light)';
}