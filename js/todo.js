import { escapeHTML, calcDeadlineDiff } from './utils.js';
import { STORAGE_KEYS, CONSTANTS } from './config.js';

export class TodoList {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.storageKey = STORAGE_KEYS.TODO;
    this.MAX_PRIORITY = CONSTANTS.TODO_MAX_PRIORITY;
    this.tasks = this.loadData();
    this.dragSrcId = null;
    this.render();
  }

  loadData() { const s = localStorage.getItem(this.storageKey); return s ? JSON.parse(s) : []; }
  saveData() { localStorage.setItem(this.storageKey, JSON.stringify(this.tasks)); }

  addTask(text, deadline, isPriority) {
    if (!text.trim()) return;
    if (isPriority && this.tasks.filter(t => t.priority && !t.done).length >= this.MAX_PRIORITY) {
      alert(`重要タスクは最大${this.MAX_PRIORITY}件までです。`); return;
    }
    this.tasks.push({ id: Date.now().toString(), text: text.trim(), deadline: deadline || '', priority: isPriority, done: false, createdAt: new Date().toISOString() });
    this.saveData(); this.render();
  }

  toggleDone(id) { const t = this.tasks.find(t => t.id === id); if (t) { t.done = !t.done; this.saveData(); this.render(); } }
  deleteTask(id) { this.tasks = this.tasks.filter(t => t.id !== id); this.saveData(); this.render(); }

  moveTask(id, toPriority) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return false;
    if (toPriority && this.tasks.filter(t => t.priority && !t.done && t.id !== id).length >= this.MAX_PRIORITY) {
      alert(`重要タスクは最大${this.MAX_PRIORITY}件までです。`); return false;
    }
    task.priority = toPriority; this.saveData(); this.render(); return true;
  }

  formatDeadline(deadline) {
    if (!deadline) return '';
    const d = new Date(deadline + 'T00:00:00');
    const diff = calcDeadlineDiff(deadline);
    const ds = `${d.getMonth() + 1}/${d.getDate()}`;
    if (diff < 0) return `<span class="text-red-500 font-bold">${ds} 期限切れ</span>`;
    if (diff === 0) return `<span class="text-red-500 font-bold">${ds} 今日</span>`;
    if (diff <= 3) return `<span class="text-amber-500 font-semibold">${ds} あと${diff}日</span>`;
    return `<span class="text-slate-400">${ds} まで</span>`;
  }

  buildTaskCard(task) {
    const dl = this.formatDeadline(task.deadline);
    const done = task.done ? 'opacity-50 line-through' : '';
    const bg = task.priority ? 'bg-red-50/70 border-red-100' : 'bg-slate-50/70 border-slate-100';
    const circleCls = task.done
      ? 'bg-primary-500 border-primary-500'
      : task.priority ? 'border-red-300 hover:border-red-500' : 'border-slate-300 hover:border-primary-500';
    return `
      <div class="task-card group flex items-start gap-2 p-2.5 ${bg} border rounded-xl transition-all cursor-grab active:cursor-grabbing hover:shadow-sm"
        draggable="true" data-id="${task.id}" data-priority="${task.priority ? '1' : '0'}">
        <button class="btn-toggle shrink-0 w-5 h-5 mt-0.5 rounded-full border-2 ${circleCls} transition-colors flex items-center justify-center" data-id="${task.id}">
          ${task.done ? '<i data-lucide="check" class="w-3 h-3 text-white"></i>' : ''}
        </button>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-slate-800 break-words ${done}">${escapeHTML(task.text)}</p>
          ${dl ? `<p class="text-[10px] mt-0.5">${dl}</p>` : ''}
        </div>
        <button class="btn-delete shrink-0 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all" data-id="${task.id}">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>`;
  }

  buildColumn(tasks, isPriority, emptyMsg) {
    const header = isPriority
      ? `<div class="flex items-center gap-1.5 mb-2"><i data-lucide="alert-circle" class="w-4 h-4 text-red-500"></i><span class="text-sm font-semibold text-slate-700">重要タスク</span><span class="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-600 rounded-full ml-auto">最大${this.MAX_PRIORITY}件</span></div>`
      : `<div class="flex items-center gap-1.5 mb-2"><i data-lucide="list" class="w-4 h-4 text-slate-500"></i><span class="text-sm font-semibold text-slate-700">通常タスク</span></div>`;
    const empty = tasks.length === 0;
    const border = empty ? (isPriority ? 'border-red-200 bg-red-50/30' : 'border-slate-200 bg-slate-50/30') : 'border-transparent';
    const body = empty
      ? `<p class="text-xs ${isPriority ? 'text-red-300' : 'text-slate-300'} text-center py-4">ここにドロップ</p>`
      : tasks.map(t => this.buildTaskCard(t)).join('');
    const id = isPriority ? 'todo-priority-list' : 'todo-normal-list';
    return `<div>${header}<div id="${id}" class="drop-zone min-h-[80px] space-y-2 p-2 rounded-xl border-2 border-dashed ${border}" data-target-priority="${isPriority ? '1' : '0'}">${body}</div></div>`;
  }

  render() {
    if (!this.container) return;
    const pCount = this.tasks.filter(t => t.priority && !t.done).length;
    this.container.innerHTML = `
      <div class="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
        <input type="text" id="todo-text" placeholder="タスクを入力..." class="w-full rounded-lg border border-slate-200 text-sm p-2 outline-none focus:border-primary-500">
        <div class="flex gap-2 items-center">
          <label class="text-xs text-slate-500 shrink-0 font-medium">締切日：</label>
          <input type="date" id="todo-deadline" class="flex-1 rounded-lg border border-slate-200 text-sm p-2 outline-none focus:border-primary-500 text-slate-600">
          <label class="flex items-center gap-1 text-xs text-slate-500 cursor-pointer shrink-0">
            <input type="checkbox" id="todo-no-deadline" class="accent-primary-500"> なし
          </label>
        </div>
        <div class="flex gap-2">
          <button id="btn-add-priority" class="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1">
            <i data-lucide="alert-circle" class="w-4 h-4"></i>重要に追加<span class="text-xs opacity-80">(${pCount}/${this.MAX_PRIORITY})</span>
          </button>
          <button id="btn-add-normal"   class="flex-1 bg-slate-700 hover:bg-slate-800 text-white py-2 rounded-lg text-sm font-medium transition-colors">通常に追加</button>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        ${this.buildColumn(this.tasks.filter(t => t.priority), true, 'ここにドロップ')}
        ${this.buildColumn(this.tasks.filter(t => !t.priority), false, 'ここにドロップ')}
      </div>`;

    if (window.lucide) lucide.createIcons({ root: this.container });
    this.attachEvents();
  }

  attachEvents() {
    const c = this.container;
    const noDeadline = c.querySelector('#todo-no-deadline');
    const deadlineInput = c.querySelector('#todo-deadline');
    noDeadline.addEventListener('change', () => { deadlineInput.disabled = noDeadline.checked; if (noDeadline.checked) deadlineInput.value = ''; });

    const getForm = () => ({ text: c.querySelector('#todo-text').value, dl: noDeadline.checked ? '' : deadlineInput.value });
    const clearForm = () => { c.querySelector('#todo-text').value = ''; deadlineInput.value = ''; noDeadline.checked = false; deadlineInput.disabled = false; };

    c.querySelector('#btn-add-normal').addEventListener('click', () => { const f = getForm(); this.addTask(f.text, f.dl, false); clearForm(); });
    c.querySelector('#btn-add-priority').addEventListener('click', () => { const f = getForm(); this.addTask(f.text, f.dl, true); clearForm(); });
    c.querySelector('#todo-text').addEventListener('keydown', e => { if (e.key === 'Enter') { const f = getForm(); this.addTask(f.text, f.dl, false); clearForm(); } });

    c.querySelectorAll('.btn-toggle').forEach(b => b.addEventListener('click', () => this.toggleDone(b.dataset.id)));
    c.querySelectorAll('.btn-delete').forEach(b => b.addEventListener('click', () => this.deleteTask(b.dataset.id)));

    c.querySelectorAll('.task-card').forEach(card => {
      card.addEventListener('dragstart', e => { this.dragSrcId = card.dataset.id; card.classList.add('opacity-50'); e.dataTransfer.effectAllowed = 'move'; });
      card.addEventListener('dragend', () => card.classList.remove('opacity-50'));
    });

    c.querySelectorAll('.drop-zone').forEach(zone => {
      zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('bg-primary-50', 'border-primary-300'); });
      zone.addEventListener('dragleave', () => zone.classList.remove('bg-primary-50', 'border-primary-300'));
      zone.addEventListener('drop', e => {
        e.preventDefault(); zone.classList.remove('bg-primary-50', 'border-primary-300');
        if (this.dragSrcId) { this.moveTask(this.dragSrcId, zone.dataset.targetPriority === '1'); this.dragSrcId = null; }
      });
    });
  }
}
