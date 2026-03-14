# just5min

**Essential, blazing fast browser utilities for Designers, Developers and Creators.**  
No tracking. No accounts. No data leaves your machine.

> Built by [Matitaben](https://x.com/matitaben) · [just5min](#)

---

## ✦ What is just5min?

**just5min** is a curated collection of small, focused tools that work entirely in your browser. Designed for UI/UX designers, graphic designers, and web developers who need fast, reliable utilities without the friction of sign-ups, paywalls, or server-side processing.

---

## 🧰 Tools

### UI/UX Design
| Tool | Description |
|------|-------------|
| Palette Generator | Generate beautiful colour palettes |
| Tailwind Shade Generator | Generate Tailwind CSS colour scales |
| Shadow Smoother ✨ | Generate beautiful, layered CSS drop shadows |
| Glassmorphism Generator ✨ | Create frosted glass CSS effects |
| Gradient Generator | Create linear, radial, and conic gradients |
| Contrast Checker | Check WCAG colour contrast compliance |
| Golden Ratio Calculator ✨ | Typography scale & layout grids using φ (1.618) |

### Typography & Text
| Tool | Description |
|------|-------------|
| PX to REM | Convert pixels to rem units |
| Line Height Calculator | Calculate optimal line heights |
| Typography Calculator | Convert between typographic units |
| Paper Sizes | Reference for standard paper dimensions |
| Word Counter | Count words, characters and more |
| Glyph Browser | Browse unicode glyphs |

### Images & Assets
| Tool | Description |
|------|-------------|
| Background Remover | Remove image backgrounds locally |
| Favicon Generator | Generate favicons from any image |
| Placeholder Generator | Generate placeholder images |
| Image Splitter | Split images into tiles |
| Image Converter | Convert between PNG, JPEG, WebP, GIF |
| Artwork Enhancer | Add colour noise overlay to artwork |

### Colour
| Tool | Description |
|------|-------------|
| Colour Converter | Convert between HEX, RGB, HSL, OKLCH |
| Harmony Generator | Generate colour harmonies |
| Palette Collection | Browse curated colour palettes |
| Colour Blindness Simulator | Simulate colour vision deficiencies |

### Social & Marketing
| Tool | Description |
|------|-------------|
| QR Generator | Styled QR codes with custom colors and logos |
| Banner Generator | Create social media banners from your logo |
| Social Media Cropper | Crop for Instagram, Bluesky & Threads |
| Matte Generator | Put non-square images on a square matte |
| Watermarker | Add watermarks to images |
| Seamless Scroll Generator | Split images for carousel scrolls |

### Developer Utilities
| Tool | Description |
|------|-------------|
| Base Converter | Decimal, hex, binary, octal |
| Regex Tester | Test regular expressions live |
| Meta Tag Generator | Generate HTML meta tags |
| Encoding Tools | Base64, URL encoding, hash generation |
| Text Scratchpad | Text editor with manipulation tools |
| Barcode Generator | Code 128, EAN-13, and more |
| Scientific Calculator | Full-featured calculator with history |
| Unit Converter | Length, weight, data, and more |
| Time Calculator | Unix timestamps, date arithmetic, timezone |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+

### Run Locally

```bash
# Clone the repo
git clone https://github.com/matitaben1/just5min.git
cd just5min

# Install dependencies
npm install

# Start dev server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

### Environment Variables

Create a `.env` file at the root of the project:

```env
VITE_CA="your_contract_address_here"
```

> The `.env` file is git-ignored and will never be pushed to the repository.

---

## 🛠 Tech Stack

- **[Vite](https://vitejs.dev/)** — Lightning fast build tool
- **Vanilla JavaScript** — Zero framework overhead
- **Vanilla CSS** — No Tailwind, no CSS-in-JS

---

## 🔒 Privacy

All tools run **100% client-side**. No data is ever sent to a server. No analytics, no cookies, no accounts required.

---

## 📁 Project Structure

```
just5min/
├── src/
│   ├── app.js           # Router & app shell
│   ├── tools.js         # Tool registry
│   ├── tools/           # Individual tool modules
│   └── styles/          # CSS files
├── favicon/             # Favicon assets
├── index.html           # Entry point
└── vite.config.js
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or pull request.

---

## 📜 License

MIT © [Matitaben](https://x.com/matitaben)
