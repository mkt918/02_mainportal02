export class Lessons {
    constructor(containerId, settings) {
        this.container = document.getElementById(containerId);
        this.dataSource = 'data/lessons.json';
        this.settings = settings;
        this.lessons = [];
        this.activeFilter = 'all'; // 'all' or subject tag
        this.loadData();
    }

    get limit() {
        return this.settings?.settings?.lessonsLimit || 0; // 0 = all
    }

    async loadData() {
        try {
            const response = await fetch(this.dataSource);
            if (!response.ok) throw new Error('Data not found');
            this.lessons = await response.json();
            this.render();
        } catch {
            if (this.container) {
                this.container.innerHTML = '<p class="text-slate-500 text-sm py-4 col-span-full">授業データが見つかりません。update-lessons.batを実行してください。</p>';
            }
        }
    }

    // 全授業から一意な科目タグを取得
    getAllSubjects() {
        const subjects = new Set();
        this.lessons.forEach(l => (l.tags || []).forEach(t => subjects.add(t)));
        return [...subjects];
    }

    // フィルタリング済みの授業一覧を返す
    getFiltered() {
        let list = this.activeFilter === 'all'
            ? this.lessons
            : this.lessons.filter(l => (l.tags || []).includes(this.activeFilter));
        if (this.limit > 0) list = list.slice(0, this.limit);
        return list;
    }

    renderFilterTabs() {
        const subjects = this.getAllSubjects();
        if (subjects.length === 0) return '';
        const all = `<button class="lesson-filter-btn text-xs px-3 py-1 rounded-full font-medium transition-all ${this.activeFilter === 'all' ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-primary-50'}" data-filter="all">すべて</button>`;
        const tabs = subjects.map(s =>
            `<button class="lesson-filter-btn text-xs px-3 py-1 rounded-full font-medium transition-all ${this.activeFilter === s ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-primary-50'}" data-filter="${this.escapeHTML(s)}">${this.escapeHTML(s)}</button>`
        ).join('');
        return `<div class="flex flex-wrap gap-2 mb-4">${all}${tabs}</div>`;
    }

    render() {
        if (!this.container) return;
        if (!this.lessons.length) {
            this.container.innerHTML = '<p class="text-slate-500 text-sm py-4">授業データがありません。</p>';
            return;
        }

        const filtered = this.getFiltered();
        const filterHtml = this.renderFilterTabs();

        let cardsHtml = '';
        if (filtered.length === 0) {
            cardsHtml = '<p class="text-slate-400 text-sm py-6 text-center col-span-full">この科目の授業データがありません。</p>';
        } else {
            filtered.forEach(lesson => {
                const tagsHtml = (lesson.tags || []).map(tag =>
                    `<button class="lesson-tag-btn text-[10px] px-2 py-0.5 rounded-full font-medium transition-all ${this.activeFilter === tag ? 'bg-primary-500 text-white' : 'bg-primary-50 text-primary-600 hover:bg-primary-100'}" data-filter="${this.escapeHTML(tag)}">${this.escapeHTML(tag)}</button>`
                ).join('');

                cardsHtml += `
          <a href="${lesson.url}" class="lesson-card block p-4 bg-slate-50 hover:bg-primary-50 border border-slate-100 hover:border-primary-200 rounded-xl transition-all group flex flex-col h-full cursor-pointer shadow-sm hover:shadow-md">
            <div class="flex justify-between items-start mb-2">
              <div class="flex flex-wrap gap-1">${tagsHtml}</div>
              <div class="text-[10px] text-slate-400 font-medium shrink-0 ml-2">${this.escapeHTML(lesson.date)}</div>
            </div>
            <h3 class="text-sm font-bold text-slate-800 group-hover:text-primary-600 transition-colors mb-1 line-clamp-2">${this.escapeHTML(lesson.title)}</h3>
            <p class="text-xs text-slate-500 line-clamp-2 mt-auto leading-relaxed">${this.escapeHTML(lesson.summary || '')}</p>
          </a>
        `;
            });
        }

        this.container.innerHTML = `
      ${filterHtml}
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        ${cardsHtml}
      </div>
      ${this.lessons.length > filtered.length
                ? `<p class="text-xs text-slate-400 text-center mt-3">全${this.lessons.length}件中 ${filtered.length}件を表示</p>`
                : `<p class="text-xs text-slate-400 text-center mt-3">全${this.lessons.length}件</p>`
            }
    `;

        // フィルターボタンのイベント（カードに埋め込まれたタグボタンも含む）
        this.container.querySelectorAll('.lesson-filter-btn, .lesson-tag-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.activeFilter = btn.dataset.filter;
                this.render();
            });
        });
    }

    escapeHTML(str) {
        if (!str) return '';
        return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
    }
}
