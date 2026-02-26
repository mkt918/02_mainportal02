import { escapeHTML } from './utils.js';

export class Lessons {
    constructor(containerId, settings) {
        this.container = document.getElementById(containerId);
        this.dataSource = 'data/lessons.json';
        this.settings = settings;
        this.lessons = [];
        this.activeFilter = 'all';
        this.loadData();
    }

    get limit() { return this.settings?.settings?.lessonsLimit || 0; }

    async loadData() {
        try {
            const res = await fetch(this.dataSource);
            if (!res.ok) throw new Error();
            this.lessons = await res.json();
            this.render();
        } catch {
            if (this.container)
                this.container.innerHTML = '<p class="text-slate-500 text-sm py-4">授業データが見つかりません。update-lessons.batを実行してください。</p>';
        }
    }

    getAllSubjects() {
        const subjects = new Set();
        this.lessons.forEach(l => (l.tags || []).forEach(t => subjects.add(t)));
        return [...subjects];
    }

    getFiltered() {
        let list = this.activeFilter === 'all'
            ? this.lessons
            : this.lessons.filter(l => (l.tags || []).includes(this.activeFilter));
        return this.limit > 0 ? list.slice(0, this.limit) : list;
    }

    renderFilterTabs() {
        const subjects = this.getAllSubjects();
        if (!subjects.length) return '';
        const btn = (filter, label) => {
            const active = this.activeFilter === filter;
            return `<button class="lesson-filter-btn text-xs px-3 py-1 rounded-full font-medium transition-all ${active ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-primary-50'}" data-filter="${escapeHTML(filter)}">${escapeHTML(label)}</button>`;
        };
        return `<div class="flex flex-wrap gap-2 mb-4">${btn('all', 'すべて')}${subjects.map(s => btn(s, s)).join('')}</div>`;
    }

    renderCard(lesson) {
        const tagsHtml = (lesson.tags || []).map(tag => {
            const active = this.activeFilter === tag;
            return `<button class="lesson-tag-btn text-[10px] px-2 py-0.5 rounded-full font-medium transition-all ${active ? 'bg-primary-500 text-white' : 'bg-primary-50 text-primary-600 hover:bg-primary-100'}" data-filter="${escapeHTML(tag)}">${escapeHTML(tag)}</button>`;
        }).join('');

        return `
      <a href="${lesson.url}" class="lesson-card block p-4 bg-slate-50 hover:bg-primary-50 border border-slate-100 hover:border-primary-200 rounded-xl transition-all group flex flex-col h-full cursor-pointer shadow-sm hover:shadow-md">
        <div class="flex justify-between items-start mb-2">
          <div class="flex flex-wrap gap-1">${tagsHtml}</div>
          <div class="text-[10px] text-slate-400 font-medium shrink-0 ml-2">${escapeHTML(lesson.date)}</div>
        </div>
        <h3 class="text-sm font-bold text-slate-800 group-hover:text-primary-600 transition-colors mb-1 line-clamp-2">${escapeHTML(lesson.title)}</h3>
        <p class="text-xs text-slate-500 line-clamp-2 mt-auto leading-relaxed">${escapeHTML(lesson.summary || '')}</p>
      </a>
    `;
    }

    render() {
        if (!this.container) return;
        if (!this.lessons.length) {
            this.container.innerHTML = '<p class="text-slate-500 text-sm py-4">授業データがありません。</p>';
            return;
        }

        const filtered = this.getFiltered();
        const cards = filtered.length
            ? filtered.map(l => this.renderCard(l)).join('')
            : '<p class="text-slate-400 text-sm py-6 text-center col-span-full">この科目の授業がありません。</p>';
        const count = `<p class="text-xs text-slate-400 text-center mt-3">全${this.lessons.length}件中 ${filtered.length}件表示</p>`;

        this.container.innerHTML = `
      ${this.renderFilterTabs()}
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">${cards}</div>
      ${count}
    `;

        this.container.querySelectorAll('.lesson-filter-btn, .lesson-tag-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                e.preventDefault(); e.stopPropagation();
                this.activeFilter = btn.dataset.filter;
                this.render();
            });
        });
    }
}
