/**
 * settings-modal.js - 設定モーダルのUIロジック
 * main.jsから切り出した設定モーダルの制御クラス
 */
import { DEFAULT_SETTINGS } from './config.js';

export class SettingsModal {
    constructor({ settings, timetable, calendar, links, todo, lessons }) {
        this.settings = settings;
        this.timetable = timetable;
        this.calendar = calendar;
        this.links = links;
        this.todo = todo;
        this.lessons = lessons;
        this.modal = document.getElementById('settings-modal');
        this._init();
    }

    _init() {
        // タブ切り替え
        document.querySelectorAll('.settings-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.tab;
                document.querySelectorAll('.settings-tab').forEach(t => {
                    const a = t.dataset.tab === target;
                    t.classList.toggle('bg-white', a);
                    t.classList.toggle('shadow-sm', a);
                    t.classList.toggle('text-primary-600', a);
                    t.classList.toggle('text-slate-500', !a);
                });
                document.querySelectorAll('.settings-panel').forEach(p => p.classList.toggle('hidden', p.id !== `tab-${target}`));
                if (target === 'colors') this._renderSubjectColorList();
            });
        });

        // テーマカラープリセット
        document.querySelectorAll('.color-preset').forEach(btn => {
            btn.addEventListener('click', () => { document.getElementById('s-color').value = btn.dataset.color; });
        });

        // ヘッダーカラープリセット
        document.querySelectorAll('.header-color-preset').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('s-header-bg-color').value = btn.dataset.color;
                this._updateHeaderPreviews(btn.dataset.color);
            });
        });

        // ヘッダーカラーリセット
        document.getElementById('btn-reset-header-color')?.addEventListener('click', () => {
            document.getElementById('s-header-bg-color').value = '';
            this._updateHeaderPreviews(this.settings.settings.themeColor);
        });

        // ヘッダーカラーピッカー変更時プレビュー更新
        document.getElementById('s-header-bg-color')?.addEventListener('input', e => {
            this._updateHeaderPreviews(e.target.value);
        });

        // 背景モード切替
        document.getElementById('s-bg-mode').addEventListener('change', e => {
            document.getElementById('s-bg-color-row').classList.toggle('hidden', e.target.value !== 'color');
            document.getElementById('s-bg-image-row').classList.toggle('hidden', e.target.value !== 'image');
        });

        // 透明度スライダー表示
        document.getElementById('s-opacity').addEventListener('input', e => {
            document.getElementById('s-opacity-val').textContent = e.target.value;
        });

        // 時限数変更 → 時刻リスト再描画
        document.addEventListener('change', e => {
            if (e.target.id === 's-tt-periods') this._buildPeriodTimeInputs(this.settings.settings.periodTimes);
        });

        // ファイル → base64
        document.getElementById('s-bg-file').addEventListener('change', e => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = ev => { document.getElementById('s-bg-url').value = ev.target.result; };
                reader.readAsDataURL(file);
            }
        });

        // 開く・閉じる
        document.getElementById('btn-settings').addEventListener('click', () => this.open());
        document.getElementById('btn-close-settings').addEventListener('click', () => this.close());
        this.modal.addEventListener('click', e => { if (e.target === this.modal) this.close(); });

        // 保存
        document.getElementById('btn-save-settings').addEventListener('click', () => this._save());

        // リセット
        document.getElementById('btn-reset-settings').addEventListener('click', () => {
            Object.assign(this.settings.settings, DEFAULT_SETTINGS);
            this.settings.saveData();
            this.timetable.render();
            this.calendar.render();
            this.close();
        });
    }

    open() {
        const s = this.settings.settings;
        const $ = id => document.getElementById(id);

        $('s-portal-title').value = s.portalTitle || '';
        $('s-color').value = s.themeColor;
        $('s-bg-mode').value = s.wallpaperMode;
        $('s-bg-color').value = s.wallpaperColor || '#f8fafc';
        $('s-bg-color-row').classList.toggle('hidden', s.wallpaperMode !== 'color');
        $('s-bg-image-row').classList.toggle('hidden', s.wallpaperMode !== 'image');
        $('s-bg-url').value = s.wallpaperImage?.startsWith('http') ? s.wallpaperImage : '';
        $('s-opacity').value = s.cardOpacity;
        $('s-opacity-val').textContent = s.cardOpacity;
        $('s-tt-days').value = s.timetableDays;
        $('s-tt-periods').value = s.timetablePeriods;
        $('s-tt-showtimes').checked = s.showPeriodTimes;
        $('s-lessons-limit').value = s.lessonsLimit;
        document.querySelector(`input[name="s-fontsize"][value="${s.fontSize}"]`).checked = true;

        const v = s.widgetVisibility || {};
        $('w-timetable').checked = v.timetable !== false;
        $('w-lessons').checked = v.lessons !== false;
        $('w-calendar').checked = v.calendar !== false;
        $('w-todo').checked = v.todo !== false;
        $('w-links').checked = v.links !== false;

        const hsInput = document.querySelector(`input[name="s-header-style"][value="${s.headerStyle || 'glass'}"]`);
        if (hsInput) hsInput.checked = true;
        // レイアウトスタイル
        const lsInput = document.querySelector(`input[name="s-layout-style"][value="${s.layoutStyle || 'style1'}"]`);
        if (lsInput) lsInput.checked = true;
        // ヘッダー独自カラー
        const hbcInput = document.getElementById('s-header-bg-color');
        if (hbcInput) hbcInput.value = s.headerBgColor || '#0ea5e9';
        // プレビュー: headerBgColorがあればそちらを使う
        const previewColor = (s.headerBgColor && s.headerBgColor !== '') ? s.headerBgColor : s.themeColor;
        this._updateHeaderPreviews(previewColor);

        this._buildPeriodTimeInputs(s.periodTimes);
        this.modal.classList.remove('hidden');
        if (window.lucide) lucide.createIcons({ root: this.modal });
    }

    close() { this.modal.classList.add('hidden'); }

    _save() {
        const $ = id => document.getElementById(id);
        const periodTimes = [...this.settings.settings.periodTimes];
        document.querySelectorAll('.period-time-start').forEach(el => {
            const i = parseInt(el.dataset.idx);
            if (!periodTimes[i]) periodTimes[i] = { start: '', end: '' };
            periodTimes[i].start = el.value;
        });
        document.querySelectorAll('.period-time-end').forEach(el => {
            const i = parseInt(el.dataset.idx);
            if (!periodTimes[i]) periodTimes[i] = { start: '', end: '' };
            periodTimes[i].end = el.value;
        });

        Object.assign(this.settings.settings, {
            portalTitle: $('s-portal-title').value || '学習ポータル',
            themeColor: $('s-color').value,
            wallpaperMode: $('s-bg-mode').value,
            wallpaperColor: $('s-bg-color').value,
            wallpaperImage: $('s-bg-url').value,
            cardOpacity: parseInt($('s-opacity').value),
            timetableDays: parseInt($('s-tt-days').value),
            timetablePeriods: parseInt($('s-tt-periods').value),
            showPeriodTimes: $('s-tt-showtimes').checked,
            periodTimes,
            fontSize: document.querySelector('input[name="s-fontsize"]:checked').value,
            lessonsLimit: parseInt($('s-lessons-limit').value),
            headerStyle: document.querySelector('input[name="s-header-style"]:checked')?.value || 'glass',
            headerBgColor: document.getElementById('s-header-bg-color')?.value || '',
            layoutStyle: document.querySelector('input[name="s-layout-style"]:checked')?.value || 'style1',
            widgetVisibility: {
                timetable: $('w-timetable').checked,
                lessons: $('w-lessons').checked,
                calendar: $('w-calendar').checked,
                todo: $('w-todo').checked,
                links: $('w-links').checked,
            },
        });

        this.settings.saveData();
        this.timetable.render();
        this.calendar.render();
        this.links.render();
        this.todo.render();
        this.lessons.render();
        this.close();
    }

    _buildPeriodTimeInputs(periodTimes) {
        const container = document.getElementById('s-period-times-list');
        const count = parseInt(document.getElementById('s-tt-periods')?.value || 6);
        container.innerHTML = Array.from({ length: count }, (_, i) => {
            const t = periodTimes[i] || { start: '', end: '' };
            return `<div class="flex items-center gap-2 text-sm">
        <span class="text-slate-500 w-8 text-right shrink-0">${i + 1}限</span>
        <input type="time" class="period-time-start flex-1 border border-slate-200 rounded-lg px-2 py-1 text-sm outline-none focus:border-primary-500" value="${t.start}" data-idx="${i}">
        <span class="text-slate-400">〜</span>
        <input type="time" class="period-time-end flex-1 border border-slate-200 rounded-lg px-2 py-1 text-sm outline-none focus:border-primary-500" value="${t.end}" data-idx="${i}">
      </div>`;
        }).join('');
    }

    _renderSubjectColorList() {
        const container = document.getElementById('subject-colors-list');
        const subjects = this.timetable.getAllSubjects();
        if (!subjects.length) {
            container.innerHTML = '<p class="text-sm text-slate-400 text-center py-4">時間割に科目を登録すると、ここに表示されます。</p>';
            return;
        }
        container.innerHTML = subjects.map(subject => {
            const color = this.timetable.getSubjectColor(subject);
            return `<div class="flex items-center gap-3 py-2 border-b border-slate-100">
        <div class="w-5 h-5 rounded-md border border-slate-200 shrink-0" style="background-color:${color}"></div>
        <span class="flex-1 text-sm font-medium text-slate-700">${subject}</span>
        <input type="color" class="subject-color-input h-8 w-16 rounded border border-slate-200 cursor-pointer" value="${color}" data-subject="${subject}">
      </div>`;
        }).join('');
        container.querySelectorAll('.subject-color-input').forEach(input => {
            input.addEventListener('change', e => this.timetable.setSubjectColor(e.target.dataset.subject, e.target.value));
        });
    }

    _updateHeaderPreviews(color) {
        const c = document.getElementById('header-preview-colored');
        const g = document.getElementById('header-preview-gradient');
        if (c) c.style.backgroundColor = color;
        if (g) g.style.background = `linear-gradient(135deg, ${color}, ${color}aa)`;
    }
}
