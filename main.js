import './style.css';
import { Timetable } from './js/timetable.js';
import { Calendar } from './js/calendar.js';
import { TodoList } from './js/todo.js';
import { Links } from './js/links.js';
import { Lessons } from './js/lessons.js';
import { Settings } from './js/settings.js';

// Init Settings first to apply theme
const settings = new Settings();

// Init Modules
const timetable = new Timetable('timetable-container');
const calendar = new Calendar('calendar-container');
const todo = new TodoList('todo-list', 'todo-input', 'btn-add-todo');
const links = new Links('links-container');

// Timetable Edit toggle
document.getElementById('btn-edit-timetable').addEventListener('click', (e) => {
    timetable.toggleEdit();
    e.target.textContent = timetable.isEditing ? '完了' : '編集';
    e.target.classList.toggle('bg-primary-100', timetable.isEditing);
    e.target.classList.toggle('bg-primary-50', !timetable.isEditing);
});

// Settings Modal Logic
const modal = document.getElementById('settings-modal');
const btnOpen = document.getElementById('btn-settings');
const btnClose = document.getElementById('btn-close-settings');
const btnSave = document.getElementById('btn-save-settings');
const btnReset = document.getElementById('btn-reset-settings');

const inputColor = document.getElementById('setting-color');
const selectBgMode = document.getElementById('setting-bg-mode');
const imgContainer = document.getElementById('setting-image-container');
const inputBgUrl = document.getElementById('setting-bg-url');
const inputBgFile = document.getElementById('setting-bg-file');

function openSettings() {
    inputColor.value = settings.settings.themeColor;
    selectBgMode.value = settings.settings.wallpaperMode;
    // URLの場合は表示、base64の場合は長すぎるため表示しない
    inputBgUrl.value = settings.settings.wallpaperImage.startsWith('http') ? settings.settings.wallpaperImage : '';
    imgContainer.classList.toggle('hidden', selectBgMode.value !== 'image');
    modal.classList.remove('hidden');
}

btnOpen.addEventListener('click', openSettings);
btnClose.addEventListener('click', () => modal.classList.add('hidden'));

selectBgMode.addEventListener('change', (e) => {
    imgContainer.classList.toggle('hidden', e.target.value !== 'image');
});

inputBgFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            inputBgUrl.value = ev.target.result; // base64
        };
        reader.readAsDataURL(file);
    }
});

btnSave.addEventListener('click', () => {
    settings.updateSetting('themeColor', inputColor.value);
    settings.updateSetting('wallpaperMode', selectBgMode.value);
    if (selectBgMode.value === 'image') {
        settings.updateSetting('wallpaperImage', inputBgUrl.value);
    }
    modal.classList.add('hidden');

    // Re-render components to apply new colors
    timetable.render();
    calendar.render();
    links.render();
    todo.render();
    document.getElementById('btn-edit-timetable').className = `text-sm px-3 py-1.5 ${timetable.isEditing ? 'bg-primary-100' : 'bg-primary-50'} text-primary-600 rounded-lg font-medium hover:bg-primary-100 transition-colors`;
});

btnReset.addEventListener('click', () => {
    settings.updateSetting('themeColor', settings.defaultSettings.themeColor);
    settings.updateSetting('wallpaperMode', settings.defaultSettings.wallpaperMode);
    settings.updateSetting('wallpaperImage', '');
    modal.classList.add('hidden');

    timetable.render();
    calendar.render();
    links.render();
    todo.render();
});

// Render lessons from JSON
const lessons = new Lessons('lessons-container');

// Initialize Icons
lucide.createIcons();
