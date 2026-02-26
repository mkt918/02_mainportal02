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
            lessonsLimit: 4,         // 2, 4, 6, 8
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
        if (s.wallpaperMode === 'image' && s.wallpaperImage) {
            body.style.backgroundImage = `url(${s.wallpaperImage})`;
            body.style.backgroundSize = 'cover';
            body.style.backgroundPosition = 'center';
            body.style.backgroundAttachment = 'fixed';
            body.style.backgroundColor = '';
        } else if (s.wallpaperMode === 'color') {
            body.style.backgroundImage = 'none';
            body.style.backgroundColor = s.wallpaperColor || '#f8fafc';
        } else {
            body.style.backgroundImage = `radial-gradient(var(--tw-color-primary-100) 1px, transparent 1px)`;
            body.style.backgroundSize = '20px 20px';
            body.style.backgroundColor = '#f8fafc';
        }

        // Portal title
        const titleEl = document.querySelector('#main-header h1');
        if (titleEl) titleEl.textContent = s.portalTitle || '学習ポータル';
        document.title = (s.portalTitle || '学習ポータル') + ' - Dashboard';

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
