import './style.css';
import { initReaction } from './js/reaction.js';
import { initTrivia } from './js/trivia.js';
import { Timetable } from './js/timetable.js';
import { Calendar } from './js/calendar.js';
import { TodoList } from './js/todo.js';
import { Links } from './js/links.js';
import { Lessons } from './js/lessons.js';
import { Settings } from './js/settings.js';
import { SettingsModal } from './js/settings-modal.js';

// ─── インスタンス生成 ─────────────────────────────
const settings = new Settings();
const timetable = new Timetable('timetable-container', settings);
const calendar = new Calendar('calendar-container');
const todo = new TodoList('todo-container');
const links = new Links('links-container');
const lessons = new Lessons('lessons-container', settings);

// ─── 設定モーダル（DI） ───────────────────────────
new SettingsModal({ settings, timetable, calendar, links, todo, lessons });

// ─── 時間割 編集トグル ────────────────────────────
document.getElementById('btn-edit-timetable').addEventListener('click', e => {
    timetable.toggleEdit();
    e.target.textContent = timetable.isEditing ? '完了' : '編集';
});

// ─── アイコン初期化 ────────────────────────────────
lucide.createIcons();

// ─── リアクション履歴機能 ──────────────────────────
initReaction();

// ─── トリビア ─────────────────────────────
initTrivia();
