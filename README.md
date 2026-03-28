# QR Studio | Professional QR Generator

A high-quality, responsive web tool for generating and customizing QR codes with a native "software" feel on desktop and a "mobile app" feel on mobile devices.

## Features

- **Real-time Generation:** QR codes update instantly as you type.
- **Customizable Appearance:** Full control over foreground and background colors.
- **Precision Control:** Choose from four error correction levels (Low, Medium, Quartile, High).
- **History Management:** Automatically saves your recently generated QR codes to `localStorage`.
- **High-Resolution Export:** Download your generated QR codes as PNG images.
- **Responsive UI:**
  - **Desktop:** Professional software-like layout with a persistent sidebar.
  - **Mobile:** Native app experience with bottom navigation and drawer menus.
- **Modern Aesthetic:** Built with the Inter font family and Lucide icons.

## Technologies Used

- **HTML5:** Semantic structure and layouts.
- **CSS3:** Modern styling with variables, grid/flexbox, and keyframe animations.
- **Vanilla JavaScript:** Fast, lightweight logic without external frameworks.
- **Libraries:**
  - [QRCode.js](https://github.com/davidshimjs/qrcodejs) for QR generation.
  - [Lucide Icons](https://lucide.dev/) for iconography.
  - [Inter Font](https://rsms.me/inter/) for professional typography.

## How to Run Locally

Since this tool uses vanilla web technologies, you can run it using any simple HTTP server.

### Using Python
```bash
python3 -m http.server 8080
```
Then navigate to `http://localhost:8080` in your browser.

### Using Node.js (npx)
```bash
npx serve .
```
Then navigate to `http://localhost:3000` (or the provided port).

## License

MIT
