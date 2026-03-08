// Tool registry — defines all available tools
export const TOOLS = [
  // Greatest Hits
  { id: 'qr-generator', name: 'QR Generator', desc: 'Generate styled QR codes with custom colors, shapes, and logos', icon: '⊞', category: 'Greatest Hits', badge: null },
  { id: 'palette-generator', name: 'Palette Generator', desc: 'Generate beautiful colour palettes', icon: '◐', category: 'Greatest Hits', badge: null },
  { id: 'banner-generator', name: 'Banner Generator', desc: 'Create social media banners from your logo', icon: '▬', category: 'Greatest Hits', badge: 'New' },
  { id: 'bg-remover', name: 'Background Remover', desc: 'Remove background from images', icon: '◌', category: 'Greatest Hits', badge: 'New' },

  // Social Media
  { id: 'social-cropper', name: 'Social Media Cropper', desc: 'Crop images for Instagram, Bluesky & Threads', icon: '⊡', category: 'Social Media' },
  { id: 'matte-generator', name: 'Matte Generator', desc: 'Put non-square images on a square matte', icon: '▣', category: 'Social Media' },
  { id: 'watermarker', name: 'Watermarker', desc: 'Add watermarks to images', icon: '◈', category: 'Social Media' },
  { id: 'seamless-scroll', name: 'Seamless Scroll Generator', desc: 'Split images for carousel scrolls', icon: '⇔', category: 'Social Media' },

  // Colour
  { id: 'colour-converter', name: 'Colour Converter', desc: 'Convert between colour formats (HEX, RGB, HSL, OKLCH)', icon: '◑', category: 'Colour' },
  { id: 'tailwind-shades', name: 'Tailwind Shade Generator', desc: 'Generate Tailwind colour scales', icon: '▦', category: 'Colour' },
  { id: 'harmony-generator', name: 'Harmony Generator', desc: 'Generate colour harmonies', icon: '♫', category: 'Colour' },
  { id: 'palette-collection', name: 'Palette Collection', desc: 'Browse curated colour palettes', icon: '⊟', category: 'Colour' },
  { id: 'contrast-checker', name: 'Contrast Checker', desc: 'Check WCAG colour contrast compliance', icon: '◎', category: 'Colour' },
  { id: 'colorblind-sim', name: 'Colour Blindness Simulator', desc: 'Simulate how colours appear to colour blind users', icon: '◌', category: 'Colour' },
  { id: 'gradient-generator', name: 'Gradient Generator', desc: 'Create linear, radial, and conic gradients', icon: '◒', category: 'Colour', badge: 'New' },

  // Images & Assets
  { id: 'favicon-generator', name: 'Favicon Generator', desc: 'Generate favicons from any image', icon: '◇', category: 'Images & Assets' },
  { id: 'placeholder-generator', name: 'Placeholder Generator', desc: 'Generate placeholder images', icon: '▢', category: 'Images & Assets' },
  { id: 'image-splitter', name: 'Image Splitter', desc: 'Split images into tiles', icon: '⊞', category: 'Images & Assets' },
  { id: 'image-converter', name: 'Image Converter', desc: 'Convert between PNG, JPEG, WebP, GIF and more', icon: '⇌', category: 'Images & Assets' },
  { id: 'artwork-enhancer', name: 'Artwork Enhancer', desc: 'Add colour noise overlay to artwork', icon: '✧', category: 'Images & Assets' },

  // Typography & Text
  { id: 'px-to-rem', name: 'PX to REM', desc: 'Convert pixels to rem units', icon: '⊘', category: 'Typography & Text' },
  { id: 'line-height-calc', name: 'Line Height Calculator', desc: 'Calculate optimal line heights', icon: '⊤', category: 'Typography & Text' },
  { id: 'typo-calc', name: 'Typography Calculator', desc: 'Convert between typographic units', icon: '#', category: 'Typography & Text' },
  { id: 'paper-sizes', name: 'Paper Sizes', desc: 'Reference for paper dimensions', icon: '▯', category: 'Typography & Text' },
  { id: 'word-counter', name: 'Word Counter', desc: 'Count words, characters and more', icon: '¶', category: 'Typography & Text' },
  { id: 'glyph-browser', name: 'Glyph Browser', desc: 'Browse unicode glyphs', icon: '⊕', category: 'Typography & Text' },

  // Other Tools
  { id: 'text-scratchpad', name: 'Text Scratchpad', desc: 'Text editor with manipulation tools', icon: '≡', category: 'Other Tools' },
  { id: 'barcode-generator', name: 'Barcode Generator', desc: 'Generate Code 128, EAN-13, and more', icon: '⊞', category: 'Other Tools' },
  { id: 'meta-tag-generator', name: 'Meta Tag Generator', desc: 'Generate HTML meta tags', icon: '⟨⟩', category: 'Other Tools' },
  { id: 'regex-tester', name: 'Regex Tester', desc: 'Test regular expressions', icon: '⁂', category: 'Other Tools' },
  { id: 'encoding-tools', name: 'Encoding Tools', desc: 'Base64, URL encoding, and hash generation', icon: '⌗', category: 'Other Tools' },

  // Calculators
  { id: 'scientific-calc', name: 'Scientific Calculator', desc: 'Full-featured calculator with history', icon: '⊞', category: 'Calculators' },
  { id: 'base-converter', name: 'Base Converter', desc: 'Convert between decimal, hex, binary, and octal', icon: '⟨⟩', category: 'Calculators' },
  { id: 'unit-converter', name: 'Unit Converter', desc: 'Convert between length, weight, data, and more', icon: '⇋', category: 'Calculators' },
  { id: 'time-calculator', name: 'Time Calculator', desc: 'Unix timestamps, date arithmetic, timezone conversion', icon: '◷', category: 'Calculators' },
];

export const CATEGORIES = [
  { name: 'Greatest Hits', icon: '✦' },
  { name: 'Social Media', icon: '▣' },
  { name: 'Colour', icon: '◐' },
  { name: 'Images & Assets', icon: '◇' },
  { name: 'Typography & Text', icon: '⊤' },
  { name: 'Other Tools', icon: '⊘' },
  { name: 'Calculators', icon: '⊞' },
];
