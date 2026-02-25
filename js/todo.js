export class TodoList {
    constructor(listId, inputId, btnId) {
        this.list = document.getElementById(listId);
        this.input = document.getElementById(inputId);
        this.btnAdd = document.getElementById(btnId);
        this.storageKey = 'class-portal-todo';
        this.todos = this.loadData();

        if (this.btnAdd && this.input) {
            this.btnAdd.addEventListener('click', () => this.addTodo());
            this.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.addTodo();
            });
        }

        this.render();
    }

    loadData() {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : [];
    }

    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
    }

    addTodo() {
        const text = this.input.value.trim();
        if (!text) return;

        this.todos.push({
            id: Date.now().toString(),
            text: text,
            completed: false
        });

        this.input.value = '';
        this.saveData();
        this.render();
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveData();
            this.render();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveData();
        this.render();
    }

    render() {
        if (!this.list) return;

        if (this.todos.length === 0) {
            this.list.innerHTML = `<li class="text-sm text-slate-400 text-center py-4">タスクはありません</li>`;
            return;
        }

        let html = '';
        this.todos.forEach(todo => {
            html += `
        <li class="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg group transition-colors border border-transparent hover:border-slate-100">
          <button class="todo-toggle text-slate-400 hover:text-primary-500 transition-colors" data-id="${todo.id}">
            <i data-lucide="${todo.completed ? 'check-circle-2' : 'circle'}" class="w-5 h-5 ${todo.completed ? 'text-primary-500' : ''}"></i>
          </button>
          <span class="flex-1 text-sm ${todo.completed ? 'text-slate-400 line-through' : 'text-slate-700'}">${this.escapeHTML(todo.text)}</span>
          <button class="todo-delete opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all p-1 rounded hover:bg-red-50" data-id="${todo.id}">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </li>
      `;
        });

        this.list.innerHTML = html;

        if (window.lucide) {
            window.lucide.createIcons({ root: this.list });
        }

        this.list.querySelectorAll('.todo-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.toggleTodo(e.currentTarget.dataset.id);
            });
        });

        this.list.querySelectorAll('.todo-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.deleteTodo(e.currentTarget.dataset.id);
            });
        });
    }

    escapeHTML(str) {
        return str.replace(/[&<>'"]/g, tag => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        }[tag] || tag));
    }
}
