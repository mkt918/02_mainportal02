export class TodoList {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.storageKey = 'class-portal-todo-v2';
        this.MAX_PRIORITY = 5;
        this.tasks = this.loadData();
        this.dragSrcId = null;
        this.render();
    }

    loadData() {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : [];
    }

    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
    }

    addTask(text, deadline, isPriority) {
        if (!text.trim()) return;
        const priorityCount = this.tasks.filter(t => t.priority && !t.done).length;
        if (isPriority && priorityCount >= this.MAX_PRIORITY) {
            alert(`重要タスクは最大${this.MAX_PRIORITY}件までです。`);
            return;
        }
        this.tasks.push({
            id: Date.now().toString(),
            text: text.trim(),
            deadline: deadline || '',
            priority: isPriority,
            done: false,
            createdAt: new Date().toISOString(),
        });
        this.saveData();
        this.render();
    }

    toggleDone(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.done = !task.done;
            this.saveData();
            this.render();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveData();
        this.render();
    }

    moveTask(id, toPriority) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;
        const priorityCount = this.tasks.filter(t => t.priority && !t.done && t.id !== id).length;
        if (toPriority && priorityCount >= this.MAX_PRIORITY) {
            alert(`重要タスクは最大${this.MAX_PRIORITY}件までです。`);
            return false;
        }
        task.priority = toPriority;
        this.saveData();
        this.render();
        return true;
    }

    formatDeadline(deadline) {
        if (!deadline) return '';
        const d = new Date(deadline + 'T00:00:00');
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const diff = Math.ceil((d - today) / (1000 * 60 * 60 * 24));
        const dateStr = `${d.getMonth() + 1}/${d.getDate()}`;
        if (diff < 0) return `<span class="text-red-500 font-bold">${dateStr} 期限切れ</span>`;
        if (diff === 0) return `<span class="text-red-500 font-bold">${dateStr} 今日</span>`;
        if (diff <= 3) return `<span class="text-amber-500 font-semibold">${dateStr} あと${diff}日</span>`;
        return `<span class="text-slate-400">${dateStr} まで</span>`;
    }

    buildTaskCard(task) {
        const dl = this.formatDeadline(task.deadline);
        const doneClass = task.done ? 'opacity-50 line-through' : '';
        return `
      <div class="task-card group flex items-start gap-2 p-2.5 ${task.priority ? 'bg-red-50/70 border-red-100' : 'bg-slate-50/70 border-slate-100'} border rounded-xl transition-all cursor-grab active:cursor-grabbing hover:shadow-sm"
        draggable="true"
        data-id="${task.id}"
        data-priority="${task.priority ? '1' : '0'}">
        <button class="btn-toggle shrink-0 w-5 h-5 mt-0.5 rounded-full border-2 ${task.done ? 'bg-primary-500 border-primary-500' : (task.priority ? 'border-red-300 hover:border-red-500' : 'border-slate-300 hover:border-primary-500')} transition-colors flex items-center justify-center"
          data-id="${task.id}">
          ${task.done ? '<i data-lucide="check" class="w-3 h-3 text-white"></i>' : ''}
        </button>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-slate-800 break-words ${doneClass}">${this.escapeHTML(task.text)}</p>
          ${dl ? `<p class="text-[10px] mt-0.5">${dl}</p>` : ''}
        </div>
        <button class="btn-delete shrink-0 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all"
          data-id="${task.id}">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>
    `;
    }

    render() {
        if (!this.container) return;

        const priorityTasks = this.tasks.filter(t => t.priority);
        const normalTasks = this.tasks.filter(t => !t.priority);
        const priorityCount = priorityTasks.filter(t => !t.done).length;

        const html = `
      <!-- 追加フォーム -->
      <div class="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
        <input type="text" id="todo-text" placeholder="タスクを入力..." class="w-full rounded-lg border border-slate-200 text-sm p-2 outline-none focus:border-primary-500">
        <div class="flex gap-2 items-center">
          <input type="date" id="todo-deadline" class="flex-1 rounded-lg border border-slate-200 text-sm p-2 outline-none focus:border-primary-500 text-slate-600">
          <label class="flex items-center gap-1 text-xs text-slate-500 cursor-pointer shrink-0">
            <input type="checkbox" id="todo-no-deadline" class="accent-primary-500"> 締切なし
          </label>
        </div>
        <div class="flex gap-2">
          <button id="btn-add-normal" class="flex-1 bg-slate-700 hover:bg-slate-800 text-white py-2 rounded-lg text-sm font-medium transition-colors">
            通常に追加
          </button>
          <button id="btn-add-priority" class="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1">
            <i data-lucide="alert-circle" class="w-4 h-4"></i>重要に追加
            <span class="text-xs opacity-80">(${priorityCount}/${this.MAX_PRIORITY})</span>
          </button>
        </div>
      </div>

      <!-- 2カラムリスト -->
      <div class="grid grid-cols-2 gap-4">
        <!-- 重要 -->
        <div>
          <div class="flex items-center gap-1.5 mb-2">
            <i data-lucide="alert-circle" class="w-4 h-4 text-red-500"></i>
            <span class="text-sm font-semibold text-slate-700">重要タスク</span>
            <span class="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-600 rounded-full ml-auto">最大${this.MAX_PRIORITY}件</span>
          </div>
          <div id="todo-priority-list" class="drop-zone min-h-[80px] space-y-2 p-2 rounded-xl border-2 border-dashed ${priorityTasks.length === 0 ? 'border-red-200 bg-red-50/30' : 'border-transparent'}" data-target-priority="1">
            ${priorityTasks.length === 0
                ? '<p class="text-xs text-red-300 text-center py-4">ここにドロップして重要タスクへ</p>'
                : priorityTasks.map(t => this.buildTaskCard(t)).join('')}
          </div>
        </div>

        <!-- 通常 -->
        <div>
          <div class="flex items-center gap-1.5 mb-2">
            <i data-lucide="list" class="w-4 h-4 text-slate-500"></i>
            <span class="text-sm font-semibold text-slate-700">通常タスク</span>
          </div>
          <div id="todo-normal-list" class="drop-zone min-h-[80px] space-y-2 p-2 rounded-xl border-2 border-dashed ${normalTasks.length === 0 ? 'border-slate-200 bg-slate-50/30' : 'border-transparent'}" data-target-priority="0">
            ${normalTasks.length === 0
                ? '<p class="text-xs text-slate-300 text-center py-4">ここにドロップして通常タスクへ</p>'
                : normalTasks.map(t => this.buildTaskCard(t)).join('')}
          </div>
        </div>
      </div>
    `;

        this.container.innerHTML = html;
        if (window.lucide) lucide.createIcons({ root: this.container });

        this.attachEvents();
    }

    attachEvents() {
        const c = this.container;

        // 締切なしチェックボックス
        const noDeadline = c.querySelector('#todo-no-deadline');
        const deadlineInput = c.querySelector('#todo-deadline');
        noDeadline.addEventListener('change', () => {
            deadlineInput.disabled = noDeadline.checked;
            if (noDeadline.checked) deadlineInput.value = '';
        });

        // 追加ボタン
        const getText = () => c.querySelector('#todo-text').value;
        const getDeadline = () => noDeadline.checked ? '' : deadlineInput.value;
        const clearForm = () => { c.querySelector('#todo-text').value = ''; deadlineInput.value = ''; noDeadline.checked = false; deadlineInput.disabled = false; };

        c.querySelector('#btn-add-normal').addEventListener('click', () => {
            this.addTask(getText(), getDeadline(), false);
            clearForm();
        });
        c.querySelector('#btn-add-priority').addEventListener('click', () => {
            this.addTask(getText(), getDeadline(), true);
            clearForm();
        });

        // Enterキー
        c.querySelector('#todo-text').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { this.addTask(getText(), getDeadline(), false); clearForm(); }
        });

        // 完了トグル・削除ボタン
        c.querySelectorAll('.btn-toggle').forEach(btn => {
            btn.addEventListener('click', () => this.toggleDone(btn.dataset.id));
        });
        c.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => this.deleteTask(btn.dataset.id));
        });

        // Drag & Drop
        c.querySelectorAll('.task-card').forEach(card => {
            card.addEventListener('dragstart', (e) => {
                this.dragSrcId = card.dataset.id;
                card.classList.add('opacity-50');
                e.dataTransfer.effectAllowed = 'move';
            });
            card.addEventListener('dragend', () => {
                card.classList.remove('opacity-50');
            });
        });

        c.querySelectorAll('.drop-zone').forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                zone.classList.add('bg-primary-50', 'border-primary-300');
            });
            zone.addEventListener('dragleave', () => {
                zone.classList.remove('bg-primary-50', 'border-primary-300');
            });
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('bg-primary-50', 'border-primary-300');
                if (!this.dragSrcId) return;
                const toPriority = zone.dataset.targetPriority === '1';
                this.moveTask(this.dragSrcId, toPriority);
                this.dragSrcId = null;
            });
        });
    }

    escapeHTML(str) {
        return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
    }
}
