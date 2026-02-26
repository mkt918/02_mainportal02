export class Lessons {
    constructor(containerId, settings) {
        this.container = document.getElementById(containerId);
        this.dataSource = 'data/lessons.json';
        this.settings = settings;
        this.loadData();
    }

    get limit() {
        return this.settings?.settings?.lessonsLimit || 4;
    }

    async loadData() {
        try {
            const response = await fetch(this.dataSource);
            if (!response.ok) throw new Error('Data not found');
            const data = await response.json();
            this.lessons = data;
            this.render();
        } catch (error) {
            if (this.container) {
                this.container.innerHTML = '<p class="text-slate-500 text-sm py-4 col-span-full">授業データが見つかりません。Markdownから変換スクリプトを実行してください。</p>';
            }
        }
    }

    render() {
        if (!this.container || !this.lessons) return;
        if (!this.lessons.length) {
            this.container.innerHTML = '<p class="text-slate-500 text-sm py-4 col-span-full">授業データがありません。</p>';
            return;
        }

        const displayLessons = this.lessons.slice(0, this.limit);
        let html = '';
        displayLessons.forEach(lesson => {
            const tagsHtml = (lesson.tags || []).slice(0, 2).map(tag =>
                `<span class="px-2 py-0.5 bg-primary-50 text-primary-600 rounded-full text-[10px] font-medium">${this.escapeHTML(tag)}</span>`
            ).join('');

            html += `
        <a href="${lesson.url}" class="block p-4 bg-slate-50 hover:bg-primary-50 border border-slate-100 hover:border-primary-100 rounded-xl transition-all group flex flex-col h-full cursor-pointer">
          <div class="flex justify-between items-start mb-2">
            <div class="flex flex-wrap gap-1">${tagsHtml}</div>
            <div class="text-[10px] text-slate-400 font-medium">${this.escapeHTML(lesson.date)}</div>
          </div>
          <h3 class="text-sm font-bold text-slate-800 group-hover:text-primary-600 transition-colors mb-1 line-clamp-1">${this.escapeHTML(lesson.title)}</h3>
          <p class="text-xs text-slate-500 line-clamp-2 mt-auto">${this.escapeHTML(lesson.summary)}</p>
        </a>
      `;
        });
        this.container.innerHTML = html;
    }

    escapeHTML(str) {
        return str.replace(/[&<>'"]/g, tag => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        }[tag] || tag));
    }
}
