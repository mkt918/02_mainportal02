import './style.css';
import { Timetable } from './js/timetable.js';
import { Calendar } from './js/calendar.js';
import { TodoList } from './js/todo.js';
import { Links } from './js/links.js';
import { Lessons } from './js/lessons.js';
import { Settings } from './js/settings.js';

// 設定を最初に適用
const settings = new Settings();

// モジュール初期化
const timetable = new Timetable('timetable-container', settings);
const calendar = new Calendar('calendar-container');
const todo = new TodoList('todo-list', 'todo-input', 'btn-add-todo');
const links = new Links('links-container');
const lessons = new Lessons('lessons-container', settings);

// 時間割 編集ボタン
document.getElementById('btn-edit-timetable').addEventListener('click', (e) => {
    timetable.toggleEdit();
    e.target.textContent = timetable.isEditing ? '完了' : '編集';
});

// ===== 設定モーダル =====
const modal = document.getElementById('settings-modal');
const btnOpen = document.getElementById('btn-settings');
const btnClose = document.getElementById('btn-close-settings');
const btnSave = document.getElementById('btn-save-settings');
const btnReset = document.getElementById('btn-reset-settings');

// タブ切り替え
const tabs = document.querySelectorAll('.settings-tab');
const panels = document.querySelectorAll('.settings-panel');
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        tabs.forEach(t => {
            const active = t.dataset.tab === target;
            t.classList.toggle('bg-white', active);
            t.classList.toggle('shadow-sm', active);
            t.classList.toggle('text-primary-600', active);
            t.classList.toggle('text-slate-500', !active);
        });
        panels.forEach(p => {
            p.classList.toggle('hidden', p.id !== `tab-${target}`);
        });
    });
});

// カラープリセット
document.querySelectorAll('.color-preset').forEach(btn => {
    btn.addEventListener('click', () => {
        document.getElementById('s-color').value = btn.dataset.color;
    });
});

// 背景モード切替
document.getElementById('s-bg-mode').addEventListener('change', (e) => {
    document.getElementById('s-bg-color-row').classList.toggle('hidden', e.target.value !== 'color');
    document.getElementById('s-bg-image-row').classList.toggle('hidden', e.target.value !== 'image');
});

// 透明度スライダー
document.getElementById('s-opacity').addEventListener('input', (e) => {
    document.getElementById('s-opacity-val').textContent = e.target.value;
});

// 授業時刻入力リスト生成
function buildPeriodTimeInputs(periodTimes) {
    const container = document.getElementById('s-period-times-list');
    const count = parseInt(document.getElementById('s-tt-periods')?.value || 6);
    let html = '';
    for (let i = 0; i < count; i++) {
        const t = periodTimes[i] || { start: '', end: '' };
        html += `
      <div class="flex items-center gap-2 text-sm">
        <span class="text-slate-500 w-8 text-right shrink-0">${i + 1}限</span>
        <input type="time" class="period-time-start flex-1 border border-slate-200 rounded-lg px-2 py-1 text-sm focus:border-primary-500 outline-none" value="${t.start}" data-idx="${i}">
        <span class="text-slate-400">〜</span>
        <input type="time" class="period-time-end flex-1 border border-slate-200 rounded-lg px-2 py-1 text-sm focus:border-primary-500 outline-none" value="${t.end}" data-idx="${i}">
      </div>
    `;
    }
    container.innerHTML = html;
}

// 時限数変更時に再描画
document.addEventListener('change', (e) => {
    if (e.target.id === 's-tt-periods') {
        buildPeriodTimeInputs(settings.settings.periodTimes);
    }
});

// 設定モーダルを開く
function openSettings() {
    const s = settings.settings;
    document.getElementById('s-portal-title').value = s.portalTitle || '';
    document.getElementById('s-color').value = s.themeColor;
    document.getElementById('s-bg-mode').value = s.wallpaperMode;
    document.getElementById('s-bg-color').value = s.wallpaperColor || '#f8fafc';
    document.getElementById('s-bg-color-row').classList.toggle('hidden', s.wallpaperMode !== 'color');
    document.getElementById('s-bg-image-row').classList.toggle('hidden', s.wallpaperMode !== 'image');
    document.getElementById('s-bg-url').value = s.wallpaperImage?.startsWith('http') ? s.wallpaperImage : '';
    document.getElementById('s-opacity').value = s.cardOpacity;
    document.getElementById('s-opacity-val').textContent = s.cardOpacity;
    document.getElementById('s-tt-days').value = s.timetableDays;
    document.getElementById('s-tt-periods').value = s.timetablePeriods;
    document.getElementById('s-tt-showtimes').checked = s.showPeriodTimes;
    document.querySelector(`input[name="s-fontsize"][value="${s.fontSize}"]`).checked = true;
    document.getElementById('s-lessons-limit').value = s.lessonsLimit;
    buildPeriodTimeInputs(s.periodTimes);
    modal.classList.remove('hidden');
    lucide.createIcons({ root: modal });
}

btnOpen.addEventListener('click', openSettings);

btnClose.addEventListener('click', () => modal.classList.add('hidden'));

modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
});

// ファイル選択 → base64
document.getElementById('s-bg-file').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => { document.getElementById('s-bg-url').value = ev.target.result; };
        reader.readAsDataURL(file);
    }
});

// 保存
btnSave.addEventListener('click', () => {
    const s = settings.settings;

    // 各時限の授業時間を収集
    const periodTimes = [...s.periodTimes];
    document.querySelectorAll('.period-time-start').forEach((el) => {
        const idx = parseInt(el.dataset.idx);
        if (!periodTimes[idx]) periodTimes[idx] = { start: '', end: '' };
        periodTimes[idx].start = el.value;
    });
    document.querySelectorAll('.period-time-end').forEach((el) => {
        const idx = parseInt(el.dataset.idx);
        if (!periodTimes[idx]) periodTimes[idx] = { start: '', end: '' };
        periodTimes[idx].end = el.value;
    });

    const newSettings = {
        portalTitle: document.getElementById('s-portal-title').value || '学習ポータル',
        themeColor: document.getElementById('s-color').value,
        wallpaperMode: document.getElementById('s-bg-mode').value,
        wallpaperColor: document.getElementById('s-bg-color').value,
        wallpaperImage: document.getElementById('s-bg-url').value,
        cardOpacity: parseInt(document.getElementById('s-opacity').value),
        timetableDays: parseInt(document.getElementById('s-tt-days').value),
        timetablePeriods: parseInt(document.getElementById('s-tt-periods').value),
        showPeriodTimes: document.getElementById('s-tt-showtimes').checked,
        periodTimes: periodTimes,
        fontSize: document.querySelector('input[name="s-fontsize"]:checked').value,
        lessonsLimit: parseInt(document.getElementById('s-lessons-limit').value),
    };

    Object.assign(settings.settings, newSettings);
    settings.saveData();

    // 画面に再反映
    timetable.render();
    calendar.render();
    links.render();
    todo.render();
    lessons.render();

    modal.classList.add('hidden');
});

// リセット
btnReset.addEventListener('click', () => {
    Object.assign(settings.settings, settings.defaultSettings);
    settings.saveData();
    timetable.render();
    calendar.render();
    modal.classList.add('hidden');
});

// アイコン初期化
lucide.createIcons();
