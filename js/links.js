import { escapeHTML } from './utils.js';

export class Links {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.storageKey = 'class-portal-links';

    this.defaultLinks = [
      { id: '1', title: '全商検定タイピング', url: 'https://mkt918.github.io/typing03/', icon: 'keyboard', color: 'text-blue-500' },
      { id: '2', title: '情報処理用語クイズ', url: 'https://mkt918.github.io/quizmillion/', icon: 'help-circle', color: 'text-amber-500' },
      { id: '3', title: 'トランプでアルゴリズム', url: 'https://mkt918.github.io/pro_01/', icon: 'layers', color: 'text-red-500' },
      { id: '4', title: 'プログラミングでお絵描き', url: 'https://mkt918.github.io/pro_02/', icon: 'palette', color: 'text-purple-500' },
      { id: '5', title: '愛知県ジグソーパズル', url: 'https://mkt918.github.io/045_aichipazuru/', icon: 'puzzle', color: 'text-emerald-500' },
      { id: '6', title: 'マス目プログラミング', url: 'https://mkt918.github.io/pro_04/', icon: 'grid', color: 'text-indigo-500' },
      { id: '7', title: '株式投資ゲーム', url: 'https://mkt918.github.io/stock_01/', icon: 'trending-up', color: 'text-green-600' },
      { id: '8', title: '情報処理計算問題', url: 'https://mkt918.github.io/pro_05_keisan/index.html', icon: 'calculator', color: 'text-slate-700' },
    ];

    this.links = this.loadData();
    this.render();
  }

  loadData() {
    const saved = localStorage.getItem(this.storageKey);
    if (!saved) return [...this.defaultLinks];
    const parsed = JSON.parse(saved);
    const result = [...this.defaultLinks];
    parsed.forEach(p => { if (!result.find(d => d.id === p.id)) result.push(p); });
    return result;
  }

  saveData() {
    const custom = this.links.filter(l => !this.defaultLinks.find(d => d.id === l.id));
    localStorage.setItem(this.storageKey, JSON.stringify(custom));
  }

  addLink(title, url) {
    if (!title || !url) return;
    this.links.push({ id: Date.now().toString(), title, url, icon: 'link-2', color: 'text-primary-500', custom: true });
    this.saveData();
    this.render();
  }

  deleteLink(id) {
    this.links = this.links.filter(l => l.id !== id);
    this.saveData();
    this.render();
  }

  renderLink(link) {
    return `
      <div class="relative group">
        <a href="${link.url}" target="_blank" class="flex items-center gap-3 p-3 bg-slate-50 hover:bg-primary-50 border border-slate-100 hover:border-primary-100 rounded-xl transition-all">
          <div class="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 border border-slate-100">
            <i data-lucide="${link.icon}" class="w-4 h-4 ${link.color}"></i>
          </div>
          <span class="text-sm font-medium text-slate-700 truncate">${escapeHTML(link.title)}</span>
        </a>
        ${link.custom ? `
          <button class="absolute -top-2 -right-2 bg-white rounded-full p-1 border border-slate-200 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 shadow-sm transition-all" data-delete-id="${link.id}">
            <i data-lucide="x" class="w-3 h-3"></i>
          </button>
        ` : ''}
      </div>
    `;
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="flex flex-col gap-2 mb-4">
        ${this.links.map(l => this.renderLink(l)).join('')}
      </div>
      <div class="pt-4 border-t border-slate-100">
        <p class="text-xs text-slate-500 mb-2 font-medium">リンクを追加</p>
        <div class="flex flex-col gap-2">
          <input type="text" id="link-title" placeholder="サイト名" class="w-full rounded-lg border-slate-200 text-sm p-2 border outline-none focus:border-primary-500">
          <div class="flex gap-2">
            <input type="url" id="link-url" placeholder="URL (https://...)" class="flex-1 rounded-lg border-slate-200 text-sm p-2 border outline-none focus:border-primary-500">
            <button id="btn-add-link" class="bg-slate-800 hover:bg-slate-900 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors shrink-0">追加</button>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons({ root: this.container });

    this.container.querySelector('#btn-add-link')?.addEventListener('click', () => {
      this.addLink(
        this.container.querySelector('#link-title').value.trim(),
        this.container.querySelector('#link-url').value.trim()
      );
    });

    this.container.querySelectorAll('[data-delete-id]').forEach(btn => {
      btn.addEventListener('click', () => this.deleteLink(btn.dataset.deleteId));
    });
  }
}
