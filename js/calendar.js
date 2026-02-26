export class Calendar {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.storageKey = 'class-portal-calendar-notes';
        this.currentDate = new Date();
        this.notes = this.loadNotes();
        this.selectedDay = null;
        this.render();
    }

    loadNotes() {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : {};
    }

    saveNotes() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.notes));
    }

    noteKey(year, month, day) {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    changeMonth(delta) {
        this.currentDate.setMonth(this.currentDate.getMonth() + delta);
        this.selectedDay = null;
        this.render();
    }

    openNote(day) {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const key = this.noteKey(year, month, day);
        this.selectedDay = { year, month, day, key };
        this.renderNotePanel(key);
    }

    renderNotePanel(key) {
        const panel = document.getElementById('calendar-note-panel');
        if (!panel) return;
        const s = this.selectedDay;
        const existing = this.notes[key] || '';
        panel.innerHTML = `
      <div class="mt-4 pt-4 border-t border-slate-100">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-semibold text-slate-700">
            ${s.year}/${s.month + 1}/${s.day} のメモ
          </span>
          <button id="cal-note-close" class="text-slate-400 hover:text-slate-600 text-xs px-2 py-1 bg-slate-100 rounded">閉じる</button>
        </div>
        <textarea id="cal-note-input" class="w-full text-sm border border-slate-200 rounded-lg p-2 h-24 resize-none focus:border-primary-500 outline-none" placeholder="メモを入力...">${existing}</textarea>
        <div class="flex gap-2 mt-2">
          <button id="cal-note-save" class="flex-1 bg-primary-600 text-white text-xs py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium">保存</button>
          ${existing ? `<button id="cal-note-delete" class="px-3 bg-red-50 text-red-500 text-xs py-2 rounded-lg hover:bg-red-100 transition-colors">削除</button>` : ''}
        </div>
      </div>
    `;

        panel.querySelector('#cal-note-close')?.addEventListener('click', () => {
            this.selectedDay = null;
            panel.innerHTML = '';
        });
        panel.querySelector('#cal-note-save')?.addEventListener('click', () => {
            const text = panel.querySelector('#cal-note-input').value.trim();
            if (text) {
                this.notes[key] = text;
            } else {
                delete this.notes[key];
            }
            this.saveNotes();
            this.selectedDay = null;
            panel.innerHTML = '';
            this.render();
        });
        panel.querySelector('#cal-note-delete')?.addEventListener('click', () => {
            delete this.notes[key];
            this.saveNotes();
            this.selectedDay = null;
            panel.innerHTML = '';
            this.render();
        });
    }

    render() {
        if (!this.container) return;

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const today = new Date();
        const todayY = today.getFullYear(), todayM = today.getMonth(), todayD = today.getDate();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const rawFirstDay = new Date(year, month, 1).getDay();
        const startOffset = (rawFirstDay + 6) % 7; // 月曜始まり

        const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
        const dayNames = ["月", "火", "水", "木", "金", "土", "日"];

        let html = `
      <div class="flex items-center justify-between mb-3">
        <button class="cal-prev p-1 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
        <div class="font-semibold text-slate-800">${year}年 ${monthNames[month]}</div>
        <button class="cal-next p-1 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><i data-lucide="chevron-right" class="w-5 h-5"></i></button>
      </div>
      <div class="grid grid-cols-7 gap-1 text-center text-xs mb-1">
    `;
        dayNames.forEach((d, i) => {
            const color = i === 5 ? 'text-blue-500' : i === 6 ? 'text-red-500' : 'text-slate-500';
            html += `<div class="font-medium ${color} pb-1">${d}</div>`;
        });
        html += `</div><div class="grid grid-cols-7 gap-1 text-sm">`;

        for (let i = 0; i < startOffset; i++) html += `<div></div>`;

        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = year === todayY && month === todayM && day === todayD;
            const colIndex = (startOffset + day - 1) % 7;
            const hasNote = !!this.notes[this.noteKey(year, month, day)];
            let textColor = 'text-slate-700';
            if (colIndex === 5) textColor = 'text-blue-600';
            if (colIndex === 6) textColor = 'text-red-600';

            let classes = 'aspect-square flex flex-col items-center justify-center cursor-pointer transition-colors rounded-lg relative';
            if (isToday) classes += ' bg-primary-500 text-white font-bold shadow-sm';
            else classes += ` hover:bg-slate-100 ${textColor}`;

            html += `
        <div class="${classes}" data-day="${day}">
          <span>${day}</span>
          ${hasNote ? `<span class="absolute bottom-0.5 w-1 h-1 rounded-full ${isToday ? 'bg-white/70' : 'bg-primary-400'}"></span>` : ''}
        </div>
      `;
        }
        html += `</div>`;
        html += `<div id="calendar-note-panel"></div>`;
        html += `<p class="text-xs text-slate-400 mt-3 text-center">日付をクリックしてメモを追加</p>`;

        this.container.innerHTML = html;

        if (window.lucide) window.lucide.createIcons({ root: this.container });

        this.container.querySelector('.cal-prev').addEventListener('click', () => this.changeMonth(-1));
        this.container.querySelector('.cal-next').addEventListener('click', () => this.changeMonth(1));
        this.container.querySelectorAll('[data-day]').forEach(el => {
            el.addEventListener('click', () => this.openNote(parseInt(el.dataset.day)));
        });
    }
}
