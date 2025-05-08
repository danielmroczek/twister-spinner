# Twister Spinner

An elegant, accessible, and responsive web-based spinner for the classic game of Twister. No ads, no tracking — just spin and play!

## Features

- 🎨 Colorful, animated background
- 🖐️ SVG icons for hands and feet
- 🦶 Supports left/right and all Twister colors
- 🦾 Keyboard and screen reader accessible
- ⚡ Instant, offline-capable (static HTML/JS/CSS)
- 📱 Mobile-friendly responsive design
- 🌐 Internationalization support (English, Polish)
- ✨ Smooth animations and transitions

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/twister-spinner.git
   cd twister-spinner
   ```

2. **Open `index.html` in your browser.**
   - No build step required.
   - Works offline after first load.

## Usage

- Click the **Spin** button to generate a random Twister move.
- Press <kbd>Space</kbd> to spin without clicking the button.
- Swipe up on mobile devices to trigger a spin.
- The background will change color and an icon will appear on the left or right side.
- The result is announced visually and via screen readers.

## Project Structure

```
index.html
assets/
  hand.svg, foot.svg, ...
css/
  styles.css
js/
  main.js, spinner.js, config.js, icons.js, i18n.js
```

## Accessibility

- All controls are keyboard accessible.
- ARIA labels and live regions for screen readers.
- High-contrast text and icons.

## Customization

- Add new colors or body parts in `js/config.js`.
- Replace SVG icons in `assets/` or `js/icons.js`.
- Add new languages in `js/i18n.js`.

## License

[MIT](LICENSE)