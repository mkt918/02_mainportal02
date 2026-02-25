export class Settings {
    constructor() {
        this.storageKey = 'class-portal-settings';
        this.defaultSettings = {
            themeColor: '#0ea5e9',
            wallpaperMode: 'pattern', // pattern, color, image
            wallpaperImage: '', // base64 or url
        };

        this.settings = this.loadData();
        this.applySettings();
    }

    loadData() {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? { ...this.defaultSettings, ...JSON.parse(saved) } : { ...this.defaultSettings };
    }

    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
        this.applySettings();
    }

    updateSetting(key, value) {
        this.settings[key] = value;
        this.saveData();
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    applySettings() {
        const root = document.documentElement;
        const body = document.body;

        // Apply primary color css variables
        const rgb = this.hexToRgb(this.settings.themeColor);
        if (rgb) {
            // Create simplistic shades map. In real scenario you'd want proper HSL derivation.
            root.style.setProperty('--color-primary-50', `${rgb.r}, ${rgb.g}, ${rgb.b}`); // Using raw for generic fallback if needed

            // Override tailwind primary colors (requires CSS setup to read from custom vars, or manual injection)
            // Since tailwind 3 can use css variables: root.style.setProperty('--custom-primary', this.settings.themeColor);
            // For simplicity in a basic setup without full css var config in tailwind.config, we can just inject a style tag.
        }

        let styleTag = document.getElementById('dynamic-theme-styles');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'dynamic-theme-styles';
            document.head.appendChild(styleTag);
        }

        // Inject custom colors overriding Tailwind primary
        styleTag.innerHTML = `
      :root {
        --tw-color-primary-500: ${this.settings.themeColor};
        --tw-color-primary-600: ${this.adjustColor(this.settings.themeColor, -20)};
        --tw-color-primary-50: ${this.adjustColor(this.settings.themeColor, 90)};
        --tw-color-primary-100: ${this.adjustColor(this.settings.themeColor, 80)};
      }
      .bg-primary-500 { background-color: var(--tw-color-primary-500) !important; }
      .bg-primary-600 { background-color: var(--tw-color-primary-600) !important; }
      .bg-primary-50 { background-color: var(--tw-color-primary-50) !important; }
      .bg-primary-100 { background-color: var(--tw-color-primary-100) !important; }
      .text-primary-500 { color: var(--tw-color-primary-500) !important; }
      .text-primary-600 { color: var(--tw-color-primary-600) !important; }
      .border-primary-500 { border-color: var(--tw-color-primary-500) !important; }
      .border-primary-100 { border-color: var(--tw-color-primary-100) !important; }
      .ring-primary-500 { --tw-ring-color: var(--tw-color-primary-500) !important; }
      .hover\\:bg-primary-50:hover { background-color: var(--tw-color-primary-50) !important; }
      .hover\\:bg-primary-700:hover { background-color: var(--tw-color-primary-600) !important; filter: brightness(0.9); }
      .hover\\:text-primary-600:hover { color: var(--tw-color-primary-600) !important; }
      .focus\\:border-primary-500:focus { border-color: var(--tw-color-primary-500) !important; }
      .focus\\:ring-primary-500:focus { --tw-ring-color: var(--tw-color-primary-500) !important; }
      .bg-gradient-to-r.from-primary-600 { --tw-gradient-from: var(--tw-color-primary-600) !important; }
      .to-primary-600 { --tw-gradient-to: var(--tw-color-primary-600) !important; }
    `;

        // Apply wallpaper
        if (this.settings.wallpaperMode === 'image' && this.settings.wallpaperImage) {
            body.style.backgroundImage = `url(${this.settings.wallpaperImage})`;
            body.style.backgroundSize = 'cover';
            body.style.backgroundPosition = 'center';
            body.style.backgroundAttachment = 'fixed';
        } else if (this.settings.wallpaperMode === 'pattern') {
            body.style.backgroundImage = `none`;
            body.className = "bg-slate-50 text-slate-900 font-sans antialiased transition-colors duration-300 relative";

            // Inject pattern using pseudo element or just simpler inline style
            body.style.backgroundImage = `radial-gradient(var(--tw-color-primary-100) 1px, transparent 1px)`;
            body.style.backgroundSize = '20px 20px';
            body.style.backgroundColor = '#f8fafc';
        } else {
            body.style.backgroundImage = 'none';
            body.className = "bg-slate-50 text-slate-900 font-sans antialiased transition-colors duration-300";
        }
    }

    // Simple HEX color brightener/darkener
    adjustColor(color, amount) {
        return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
    }
}
