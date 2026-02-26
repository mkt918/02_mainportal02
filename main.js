import './style.css';
import { Timetable } from './js/timetable.js';
import { Calendar } from './js/calendar.js';
import { TodoList } from './js/todo.js';
import { Links } from './js/links.js';
import { Lessons } from './js/lessons.js';
import { Settings } from './js/settings.js';

const settings = new Settings();
const timetable = new Timetable('timetable-container', settings);
const calendar = new Calendar('calendar-container');
const todo = new TodoList('todo-list', 'todo-input', 'btn-add-todo');
const links = new Links('links-container');
const lessons = new Lessons('lessons-container', settings);

// 時間割 編集
document.getElementById('btn-edit-timetable').addEventListener('click', (e) => {
    timetable.toggleEdit();
    e.target.textContent = timetable.isEditing ? '完了' : '編集';
});

// ===== 設定モーダル =====
const modal = document.getElementById('settings-modal');

// タブ切り替え
document.querySelectorAll('.settings-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        document.querySelectorAll('.settings-tab').forEach(t => {
            const active = t.dataset.tab === target;
            t.classList.toggle('bg-white', active);
            t.classList.toggle('shadow-sm', active);
            t.classList.toggle('text-primary-600', active);
            t.classList.toggle('text-slate-500', !active);
        });
        document.querySelectorAll('.settings-panel').forEach(p => {
            p.classList.toggle('hidden', p.id !== `tab-${target}`);
        });
        // 科目カラータブを開いたとき科目リストを描画
        if (target === 'colors') renderSubjectColorList();
    });
});

// カラープリセット
document.querySelectorAll('.color-preset').forEach(btn => {
    btn.addEventListener('click', () => {
        document.getElementById('s-color').value = btn.dataset.color;
    });
});

// 背景モード
document.getElementById('s-bg-mode').addEventListener('change', (e) => {
    document.getElementById('s-bg-color-row').classList.toggle('hidden', e.target.value !== 'color');
    document.getElementById('s-bg-image-row').classList.toggle('hidden', e.target.value !== 'image');
});

// 透明度スライダー
document.getElementById('s-opacity').addEventListener('input', (e) => {
    document.getElementById('s-opacity-val').textContent = e.target.value;
});

// 時限数変更→時刻リスト再描画
document.addEventListener('change', (e) => {
    if (e.target.id === 's-tt-periods') buildPeriodTimeInputs(settings.settings.periodTimes);
});

// ファイル選択→base64
document.getElementById('s-bg-file').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = ev => { document.getElementById('s-bg-url').value = ev.target.result; };
        reader.readAsDataURL(file);
    }
});

function buildPeriodTimeInputs(periodTimes) {
    const container = document.getElementById('s-period-times-list');
    const count = parseInt(document.getElementById('s-tt-periods')?.value || 6);
    let html = '';
    for (let i = 0; i < count; i++) {
        const t = periodTimes[i] || { start: '', end: '' };
        html += `
      <div class="flex items-center gap-2 text-sm">
        <span class="text-slate-500 w-8 text-right shrink-0">${i + 1}限</span>
        <input type="time" class="period-time-start flex-1 border border-slate-200 rounded-lg px-2 py-1 text-sm outline-none focus:border-primary-500" value="${t.start}" data-idx="${i}">
        <span class="text-slate-400">〜</span>
        <input type="time" class="period-time-end flex-1 border border-slate-200 rounded-lg px-2 py-1 text-sm outline-none focus:border-primary-500" value="${t.end}" data-idx="${i}">
      </div>
    `;
    }
    container.innerHTML = html;
}

// 科目カラーリスト描画
function renderSubjectColorList() {
    const container = document.getElementById('subject-colors-list');
    const subjects = timetable.getAllSubjects();
    if (!subjects.length) {
        container.innerHTML = '<p class="text-sm text-slate-400 text-center py-4">時間割に科目を登録すると、ここに表示されます。</p>';
        return;
    }
    let html = '';
    subjects.forEach(subject => {
        const color = timetable.getSubjectColor(subject);
        html += `
      <div class="flex items-center gap-3 py-2 border-b border-slate-100">
        <div class="w-5 h-5 rounded-md border border-slate-200 shrink-0" style="background-color:${color}"></div>
        <span class="flex-1 text-sm font-medium text-slate-700">${subject}</span>
        <input type="color" class="subject-color-input h-8 w-16 rounded border border-slate-200 cursor-pointer" value="${color}" data-subject="${subject}">
      </div>
    `;
    });
    container.innerHTML = html;

    container.querySelectorAll('.subject-color-input').forEach(input => {
        input.addEventListener('change', (e) => {
            timetable.setSubjectColor(e.target.dataset.subject, e.target.value);
        });
    });
}

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

    // Widgets
    const v = s.widgetVisibility || {};
    document.getElementById('w-timetable').checked = v.timetable !== false;
    document.getElementById('w-lessons').checked = v.lessons !== false;
    document.getElementById('w-calendar').checked = v.calendar !== false;
    document.getElementById('w-todo').checked = v.todo !== false;
    document.getElementById('w-links').checked = v.links !== false;

    buildPeriodTimeInputs(s.periodTimes);
    modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons({ root: modal });
}

document.getElementById('btn-settings').addEventListener('click', openSettings);
document.getElementById('btn-close-settings').addEventListener('click', () => modal.classList.add('hidden'));
modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });

// 保存
document.getElementById('btn-save-settings').addEventListener('click', () => {
    const periodTimes = [...settings.settings.periodTimes];
    document.querySelectorAll('.period-time-start').forEach(el => {
        const idx = parseInt(el.dataset.idx);
        if (!periodTimes[idx]) periodTimes[idx] = { start: '', end: '' };
        periodTimes[idx].start = el.value;
    });
    document.querySelectorAll('.period-time-end').forEach(el => {
        const idx = parseInt(el.dataset.idx);
        if (!periodTimes[idx]) periodTimes[idx] = { start: '', end: '' };
        periodTimes[idx].end = el.value;
    });

    Object.assign(settings.settings, {
        portalTitle: document.getElementById('s-portal-title').value || '学習ポータル',
        themeColor: document.getElementById('s-color').value,
        wallpaperMode: document.getElementById('s-bg-mode').value,
        wallpaperColor: document.getElementById('s-bg-color').value,
        wallpaperImage: document.getElementById('s-bg-url').value,
        cardOpacity: parseInt(document.getElementById('s-opacity').value),
        timetableDays: parseInt(document.getElementById('s-tt-days').value),
        timetablePeriods: parseInt(document.getElementById('s-tt-periods').value),
        showPeriodTimes: document.getElementById('s-tt-showtimes').checked,
        periodTimes,
        fontSize: document.querySelector('input[name="s-fontsize"]:checked').value,
        lessonsLimit: parseInt(document.getElementById('s-lessons-limit').value),
        widgetVisibility: {
            timetable: document.getElementById('w-timetable').checked,
            lessons: document.getElementById('w-lessons').checked,
            calendar: document.getElementById('w-calendar').checked,
            todo: document.getElementById('w-todo').checked,
            links: document.getElementById('w-links').checked,
        },
    });

    settings.saveData();
    timetable.render();
    calendar.render();
    links.render();
    todo.render();
    lessons.render();
    modal.classList.add('hidden');
});

// リセット
document.getElementById('btn-reset-settings').addEventListener('click', () => {
    Object.assign(settings.settings, settings.defaultSettings);
    settings.saveData();
    timetable.render();
    calendar.render();
    modal.classList.add('hidden');
});

lucide.createIcons();
