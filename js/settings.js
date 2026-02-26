export class Settings {
    constructor() {
        this.storageKey = 'class-portal-settings';
        this.defaultSettings = {
            themeColor: '#0ea5e9',
            wallpaperMode: 'pattern', // pattern, color, image
            wallpaperImage: '',
            wallpaperColor: '#f8fafc',
            portalTitle: '学習ポータル',
            cardOpacity: 90,         // 0-100
            fontSize: 'md',          // sm, md, lg
            timetableDays: 5,        // 5=Mon-Fri, 6=with Sat
            timetablePeriods: 6,     // 4, 5, 6, 7
            showPeriodTimes: false,
            periodTimes: [
                { start: '08:50', end: '09:40' },
                { start: '09:50', end: '10:40' },
                { start: '10:50', end: '11:40' },
                { start: '13:00', end: '13:50' },
                { start: '14:00', end: '14:50' },
                { start: '15:00', end: '15:50' },
                { start: '16:00', end: '16:50' },
            ],
            lessonsLimit: 0,         // 0 = all, 2/4/6/8 = limit
            headerStyle: 'glass',    // glass, solid, colored, gradient
            widgetVisibility: {
                timetable: true,
                lessons: true,
                calendar: true,
                todo: true,
                links: true,
            },
        };

        this.settings = this.loadData();
        this.applySettings();
    }

    loadData() {
        const saved = localStorage.getItem(this.storageKey);
        const base = { ...this.defaultSettings };
        if (!saved) return base;
        const parsed = JSON.parse(saved);
        return {
            ...base,
            ...parsed,
            periodTimes: parsed.periodTimes || base.periodTimes,
            widgetVisibility: { ...base.widgetVisibility, ...(parsed.widgetVisibility || {}) },
        };
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

    adjustColor(color, amount) {
        return '#' + color.replace(/^#/, '').replace(/../g, c => ('0' + Math.min(255, Math.max(0, parseInt(c, 16) + amount)).toString(16)).substr(-2));
    }

    applySettings() {
        const s = this.settings;
        const body = document.body;

        let styleTag = document.getElementById('dynamic-theme-styles');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'dynamic-theme-styles';
            document.head.appendChild(styleTag);
        }

        const baseOpacity = (s.cardOpacity / 100).toFixed(2);

        styleTag.innerHTML = `
      :root {
        --tw-color-primary-500: ${s.themeColor};
        --tw-color-primary-600: ${this.adjustColor(s.themeColor, -20)};
        --tw-color-primary-50: ${this.adjustColor(s.themeColor, 90)};
        --tw-color-primary-100: ${this.adjustColor(s.themeColor, 80)};
      }
      .bg-primary-500 { background-color: var(--tw-color-primary-500) !important; }
      .bg-primary-600 { background-color: var(--tw-color-primary-600) !important; }
      .bg-primary-50  { background-color: var(--tw-color-primary-50)  !important; }
      .bg-primary-100 { background-color: var(--tw-color-primary-100) !important; }
      .hover\\:bg-primary-50:hover  { background-color: var(--tw-color-primary-50)  !important; }
      .hover\\:bg-primary-100:hover { background-color: var(--tw-color-primary-100) !important; }
      .hover\\:bg-primary-700:hover { background-color: var(--tw-color-primary-600) !important; filter: brightness(0.9); }
      .text-primary-500 { color: var(--tw-color-primary-500) !important; }
      .text-primary-600 { color: var(--tw-color-primary-600) !important; }
      .hover\\:text-primary-600:hover { color: var(--tw-color-primary-600) !important; }
      .border-primary-500 { border-color: var(--tw-color-primary-500) !important; }
      .border-primary-100 { border-color: var(--tw-color-primary-100) !important; }
      .focus\\:border-primary-500:focus { border-color: var(--tw-color-primary-500) !important; }
      section { background-color: rgba(255,255,255,${baseOpacity}) !important; backdrop-filter: blur(8px); }
      #main-header { background-color: rgba(255,255,255,${Math.min(1, parseFloat(baseOpacity) + 0.1).toFixed(2)}) !important; }
      ${s.fontSize === 'sm' ? 'html { font-size: 14px; }' : ''}
      ${s.fontSize === 'md' ? 'html { font-size: 16px; }' : ''}
      ${s.fontSize === 'lg' ? 'html { font-size: 18px; }' : ''}
    `;

        // Apply wallpaper
        const c = `var(--tw-color-primary-100)`;  // primary-100 color
        const c5 = `var(--tw-color-primary-500)`;  // primary-500 color
        const base = '#f8fafc';
        body.style.backgroundAttachment = 'fixed';

        const patterns = {
            'image': () => {
                if (!s.wallpaperImage) { patterns['pattern'](); return; }
                body.style.backgroundImage = `url(${s.wallpaperImage})`;
                body.style.backgroundSize = 'cover';
                body.style.backgroundPosition = 'center';
                body.style.backgroundColor = '';
            },
            'color': () => {
                body.style.backgroundImage = 'none';
                body.style.backgroundSize = '';
                body.style.backgroundColor = s.wallpaperColor || base;
            },
            'pattern': () => {
                // ドット（デフォルト）
                body.style.backgroundImage = `radial-gradient(${c} 1px, transparent 1px)`;
                body.style.backgroundSize = '20px 20px';
                body.style.backgroundColor = base;
            },
            'grid': () => {
                // グリッドライン
                body.style.backgroundImage = `linear-gradient(${c} 1px, transparent 1px), linear-gradient(90deg, ${c} 1px, transparent 1px)`;
                body.style.backgroundSize = '30px 30px';
                body.style.backgroundColor = base;
            },
            'dots-lg': () => {
                // 大きなドット
                body.style.backgroundImage = `radial-gradient(${c} 2px, transparent 2px)`;
                body.style.backgroundSize = '40px 40px';
                body.style.backgroundColor = base;
            },
            'diagonal': () => {
                // 斜線
                body.style.backgroundImage = `repeating-linear-gradient(45deg, ${c} 0, ${c} 1px, transparent 0, transparent 50%)`;
                body.style.backgroundSize = '16px 16px';
                body.style.backgroundColor = base;
            },
            'cross': () => {
                // クロスハッチ
                body.style.backgroundImage = `repeating-linear-gradient(45deg, ${c} 0, ${c} 1px, transparent 0, transparent 50%), repeating-linear-gradient(-45deg, ${c} 0, ${c} 1px, transparent 0, transparent 50%)`;
                body.style.backgroundSize = '14px 14px';
                body.style.backgroundColor = base;
            },
            'wave': () => {
                // 波ライン（横方向）
                body.style.backgroundImage = `repeating-linear-gradient(0deg, ${c}, ${c} 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, ${c}, ${c} 1px, transparent 1px, transparent 20px)`;
                body.style.backgroundSize = '20px 40px';
                body.style.backgroundColor = base;
            },
            'triangle': () => {
                // 三角形タイル
                body.style.backgroundImage = `linear-gradient(135deg, ${c} 25%, transparent 25%) -10px 0, linear-gradient(225deg, ${c} 25%, transparent 25%) -10px 0, linear-gradient(315deg, ${c} 25%, transparent 25%), linear-gradient(45deg, ${c} 25%, transparent 25%)`;
                body.style.backgroundSize = '20px 20px';
                body.style.backgroundColor = base;
            },
            'checker': () => {
                // チェッカーボード
                body.style.backgroundImage = `repeating-conic-gradient(${c} 0% 25%, transparent 0% 50%)`;
                body.style.backgroundSize = '24px 24px';
                body.style.backgroundColor = base;
            },
            'gradient-v': () => {
                // 縦グラデーション
                body.style.backgroundImage = `linear-gradient(180deg, ${c} 0%, transparent 50%)`;
                body.style.backgroundSize = '';
                body.style.backgroundColor = base;
            },
        };

        const fn = patterns[s.wallpaperMode] || patterns['pattern'];
        fn();

        // Portal title
        const titleEl = document.querySelector('#main-header h1');
        if (titleEl) titleEl.textContent = s.portalTitle || '学習ポータル';
        document.title = (s.portalTitle || '学習ポータル') + ' - Dashboard';

        // Header style
        const header = document.getElementById('main-header');
        if (header) {
            header.removeAttribute('class');
            const base = 'sticky top-0 z-50 transition-all duration-300';
            const hs = s.headerStyle || 'glass';
            if (hs === 'glass') {
                header.className = `${base} bg-white/80 backdrop-blur-md shadow-sm`;
            } else if (hs === 'solid') {
                header.className = `${base} bg-white shadow-md border-b border-slate-200`;
            } else if (hs === 'colored') {
                header.className = `${base} shadow-lg`;
                header.style.backgroundColor = s.themeColor;
            } else if (hs === 'gradient') {
                header.className = `${base} shadow-md`;
                header.style.backgroundColor = '';
                header.style.backgroundImage = `linear-gradient(135deg, ${s.themeColor}, ${this.adjustColor(s.themeColor, -40)})`;
            }
            // テキスト色: colored/gradientは白
            if (hs === 'colored' || hs === 'gradient') {
                header.querySelector('h1')?.style && (header.querySelector('h1').style.webkitTextFillColor = 'white');
                header.querySelector('h1')?.classList.remove('bg-clip-text', 'text-transparent', 'bg-gradient-to-r');
            } else {
                if (header.querySelector('h1')) {
                    header.querySelector('h1').style.webkitTextFillColor = '';
                }
            }
        }

        // Widget visibility
        const v = s.widgetVisibility || {};
        const widgetMap = {
            timetable: '#card-timetable',
            lessons: '#section-lessons',
            calendar: '#section-calendar',
            todo: '#section-todo',
            links: '#section-links',
        };
        for (const [key, selector] of Object.entries(widgetMap)) {
            const el = document.querySelector(selector);
            if (el) el.style.display = (v[key] !== false) ? '' : 'none';
        }
    }
}

