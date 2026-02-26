import { escapeHTML } from './utils.js';

export class Settings {
    constructor() {
        this.storageKey = 'class-portal-settings';
        this.defaultSettings = {
            themeColor: '#0ea5e9',
            wallpaperMode: 'pattern',
            wallpaperImage: '',
            wallpaperColor: '#f8fafc',
            portalTitle: '学習ポータル',
            cardOpacity: 90,
            fontSize: 'md',
            timetableDays: 5,
            timetablePeriods: 6,
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
            lessonsLimit: 0,
            headerStyle: 'glass',
            headerBgColor: '',     // 空文字 = themeColorに追随
            layoutStyle: 'style1', // style1 or style2
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

    // ─── 永続化 ───────────────────────────────

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

    // ─── 設定適用 ─────────────────────────────

    applySettings() {
        const s = this.settings;
        this._applyTheme(s);
        this._applyWallpaper(s);
        this._applyHeader(s);
        this._applyWidgets(s);
        this._applyTitle(s);
        this._applyLayout(s);
    }

    /** CSS変数・カード透明度・フォントサイズ */
    _applyTheme(s) {
        const body = document.body;
        const rgb = this._hexToRgb(s.themeColor) || { r: 14, g: 165, b: 233 };
        const baseOpacity = (s.cardOpacity / 100).toFixed(2);

        let styleTag = document.getElementById('dynamic-theme-styles');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'dynamic-theme-styles';
            document.head.appendChild(styleTag);
        }

        styleTag.textContent = `
      :root {
        --tw-color-primary-50:  rgba(${rgb.r},${rgb.g},${rgb.b},0.05);
        --tw-color-primary-100: rgba(${rgb.r},${rgb.g},${rgb.b},0.15);
        --tw-color-primary-500: rgb(${rgb.r},${rgb.g},${rgb.b});
        --tw-color-primary-600: rgb(${Math.max(0, rgb.r - 20)},${Math.max(0, rgb.g - 20)},${Math.max(0, rgb.b - 20)});
      }
      .bg-primary-50  { background-color: var(--tw-color-primary-50)  !important; }
      .bg-primary-100 { background-color: var(--tw-color-primary-100) !important; }
      .bg-primary-500 { background-color: var(--tw-color-primary-500) !important; }
      .bg-primary-600 { background-color: var(--tw-color-primary-600) !important; }
      .bg-primary-700 { background-color: rgb(${Math.max(0, rgb.r - 40)},${Math.max(0, rgb.g - 40)},${Math.max(0, rgb.b - 40)}) !important; }
      .text-primary-500 { color: var(--tw-color-primary-500) !important; }
      .text-primary-600 { color: var(--tw-color-primary-600) !important; }
      .from-primary-600 { --tw-gradient-from: var(--tw-color-primary-600) !important; }
      .hover\\:bg-primary-50:hover  { background-color: var(--tw-color-primary-50)  !important; }
      .hover\\:bg-primary-100:hover { background-color: var(--tw-color-primary-100) !important; }
      .hover\\:bg-primary-700:hover { background-color: rgb(${Math.max(0, rgb.r - 40)},${Math.max(0, rgb.g - 40)},${Math.max(0, rgb.b - 40)}) !important; }
      .hover\\:border-primary-100:hover { border-color: var(--tw-color-primary-100) !important; }
      .hover\\:border-primary-200:hover { border-color: rgba(${rgb.r},${rgb.g},${rgb.b},0.3) !important; }
      .hover\\:text-primary-600:hover { color: var(--tw-color-primary-600) !important; }
      .accent-primary-500 { accent-color: var(--tw-color-primary-500); }
      .border-primary-500 { border-color: var(--tw-color-primary-500) !important; }
      .border-primary-100 { border-color: var(--tw-color-primary-100) !important; }
      .focus\\:border-primary-500:focus { border-color: var(--tw-color-primary-500) !important; }
      section { background-color: rgba(255,255,255,${baseOpacity}) !important; backdrop-filter: blur(8px); }
      #main-header { background-color: rgba(255,255,255,${Math.min(1, parseFloat(baseOpacity) + 0.1).toFixed(2)}) !important; }
      ${s.fontSize === 'sm' ? 'html { font-size: 14px; }' : ''}
      ${s.fontSize === 'md' ? 'html { font-size: 16px; }' : ''}
      ${s.fontSize === 'lg' ? 'html { font-size: 18px; }' : ''}
    `;
    }

    /** 背景パターン・カラー・画像 */
    _applyWallpaper(s) {
        const body = document.body;
        const c = `var(--tw-color-primary-100)`;
        const base = '#f8fafc';
        body.style.backgroundAttachment = 'fixed';

        const patterns = {
            image: () => {
                if (!s.wallpaperImage) { patterns.pattern(); return; }
                body.style.backgroundImage = `url(${s.wallpaperImage})`;
                body.style.backgroundSize = 'cover';
                body.style.backgroundPosition = 'center';
                body.style.backgroundColor = '';
            },
            color: () => {
                body.style.backgroundImage = 'none';
                body.style.backgroundSize = '';
                body.style.backgroundColor = s.wallpaperColor || base;
            },
            pattern: () => { body.style.backgroundImage = `radial-gradient(${c} 1px, transparent 1px)`; body.style.backgroundSize = '20px 20px'; body.style.backgroundColor = base; },
            'dots-lg': () => { body.style.backgroundImage = `radial-gradient(${c} 2px, transparent 2px)`; body.style.backgroundSize = '40px 40px'; body.style.backgroundColor = base; },
            grid: () => { body.style.backgroundImage = `linear-gradient(${c} 1px,transparent 1px),linear-gradient(90deg,${c} 1px,transparent 1px)`; body.style.backgroundSize = '30px 30px'; body.style.backgroundColor = base; },
            diagonal: () => { body.style.backgroundImage = `repeating-linear-gradient(45deg,${c} 0,${c} 1px,transparent 0,transparent 50%)`; body.style.backgroundSize = '16px 16px'; body.style.backgroundColor = base; },
            cross: () => { body.style.backgroundImage = `repeating-linear-gradient(45deg,${c} 0,${c} 1px,transparent 0,transparent 50%),repeating-linear-gradient(-45deg,${c} 0,${c} 1px,transparent 0,transparent 50%)`; body.style.backgroundSize = '14px 14px'; body.style.backgroundColor = base; },
            wave: () => { body.style.backgroundImage = `repeating-linear-gradient(0deg,${c},${c} 1px,transparent 1px,transparent 20px),repeating-linear-gradient(90deg,${c},${c} 1px,transparent 1px,transparent 20px)`; body.style.backgroundSize = '20px 40px'; body.style.backgroundColor = base; },
            triangle: () => { body.style.backgroundImage = `linear-gradient(135deg,${c} 25%,transparent 25%) -10px 0,linear-gradient(225deg,${c} 25%,transparent 25%) -10px 0,linear-gradient(315deg,${c} 25%,transparent 25%),linear-gradient(45deg,${c} 25%,transparent 25%)`; body.style.backgroundSize = '20px 20px'; body.style.backgroundColor = base; },
            checker: () => { body.style.backgroundImage = `repeating-conic-gradient(${c} 0% 25%,transparent 0% 50%)`; body.style.backgroundSize = '24px 24px'; body.style.backgroundColor = base; },
            'gradient-v': () => { body.style.backgroundImage = `linear-gradient(180deg,${c} 0%,transparent 50%)`; body.style.backgroundSize = ''; body.style.backgroundColor = base; },
        };

        (patterns[s.wallpaperMode] || patterns.pattern)();
    }

    /** ヘッダースタイル */
    _applyHeader(s) {
        const header = document.getElementById('main-header');
        if (!header) return;
        header.removeAttribute('class');
        const base = 'sticky top-0 z-50 transition-all duration-300';
        const hs = s.headerStyle || 'glass';
        // headerBgColor が設定されていればそちらを優先、未設定はthemeColor
        const color = (s.headerBgColor && s.headerBgColor !== '') ? s.headerBgColor : s.themeColor;

        if (hs === 'glass') {
            header.className = `${base} bg-white/80 backdrop-blur-md shadow-sm`;
            header.style.cssText = '';
        } else if (hs === 'solid') {
            header.className = `${base} bg-white shadow-md border-b border-slate-200`;
            header.style.cssText = '';
        } else if (hs === 'colored') {
            header.className = `${base} shadow-lg`;
            header.style.backgroundColor = color;
            header.style.backgroundImage = '';
        } else if (hs === 'gradient') {
            header.className = `${base} shadow-md`;
            header.style.backgroundColor = '';
            header.style.backgroundImage = `linear-gradient(135deg, ${color}, ${this._adjustColor(color, -40)})`;
        }

        const h1 = header.querySelector('h1');
        if (h1) {
            if (hs === 'colored' || hs === 'gradient') {
                h1.style.webkitTextFillColor = 'white';
                h1.classList.remove('bg-clip-text', 'text-transparent', 'bg-gradient-to-r');
            } else {
                h1.style.webkitTextFillColor = '';
            }
        }
    }

    /** ウィジェット表示制御 */
    _applyWidgets(s) {
        const v = s.widgetVisibility || {};
        const map = {
            timetable: '#card-timetable',
            lessons: '#section-lessons',
            calendar: '#section-calendar',
            todo: '#section-todo',
            links: '#section-links',
        };
        for (const [key, selector] of Object.entries(map)) {
            const el = document.querySelector(selector);
            if (el) el.style.display = (v[key] !== false) ? '' : 'none';
        }
    }

    /** レイアウトスタイル切替 */
    _applyLayout(s) {
        const main = document.getElementById('dashboard-main');
        if (!main) return;
        main.classList.remove('layout-style1', 'layout-style2');
        main.classList.add('layout-' + (s.layoutStyle || 'style1'));
    }

    /** タイトル */
    _applyTitle(s) {
        const titleEl = document.querySelector('#main-header h1');
        if (titleEl) titleEl.textContent = s.portalTitle || '学習ポータル';
        document.title = (s.portalTitle || '学習ポータル') + ' - Dashboard';
    }

    // ─── プライベートユーティリティ ────────────

    _hexToRgb(hex) {
        const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
    }

    _adjustColor(hex, amount) {
        return '#' + hex.replace(/^#/, '').replace(/../g, c =>
            ('0' + Math.min(255, Math.max(0, parseInt(c, 16) + amount)).toString(16)).slice(-2)
        );
    }
}
