export class Timetable {
    constructor(containerId, settings) {
        this.container = document.getElementById(containerId);
        this.storageKey = 'class-portal-timetable';
        this.colorStorageKey = 'class-portal-subject-colors';
        this.settings = settings;
        this.isEditing = false;
        this.data = this.loadData();
        this.subjectColors = this.loadColors();

        this.palette = [
            '#bfdbfe', '#bbf7d0', '#fef08a', '#fecaca', '#ddd6fe',
            '#fed7aa', '#cffafe', '#fbcfe8', '#e5e7eb', '#d1fae5',
        ];
        this.render();
    }

    get days() {
        const d = this.settings?.settings?.timetableDays || 5;
        return ['月', '火', '水', '木', '金', '土'].slice(0, d);
    }

    get periods() {
        const p = this.settings?.settings?.timetablePeriods || 6;
        return Array.from({ length: p }, (_, i) => i + 1);
    }

    get periodTimes() {
        return this.settings?.settings?.periodTimes || [];
    }

    get showTimes() {
        return this.settings?.settings?.showPeriodTimes || false;
    }

    loadData() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) return JSON.parse(saved);
        const initial = {};
        for (let p = 1; p <= 7; p++) {
            initial[p] = {};
            for (const d of ['月', '火', '水', '木', '金', '土']) {
                initial[p][d] = { subject: '', memo: '' };
            }
        }
        return initial;
    }

    loadColors() {
        const saved = localStorage.getItem(this.colorStorageKey);
        return saved ? JSON.parse(saved) : {};
    }

    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }

    saveColors() {
        localStorage.setItem(this.colorStorageKey, JSON.stringify(this.subjectColors));
    }

    getSubjectColor(subject) {
        if (!subject) return '';
        if (this.subjectColors[subject]) return this.subjectColors[subject];
        const usedColors = Object.values(this.subjectColors);
        const available = this.palette.filter(c => !usedColors.includes(c));
        const color = available[0] || this.palette[Object.keys(this.subjectColors).length % this.palette.length];
        this.subjectColors[subject] = color;
        this.saveColors();
        return color;
    }

    setSubjectColor(subject, color) {
        this.subjectColors[subject] = color;
        this.saveColors();
        this.render();
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
        this.render();
    }

    updateCell(period, day, field, value) {
        if (!this.data[period]) this.data[period] = {};
        if (!this.data[period][day]) this.data[period][day] = { subject: '', memo: '' };
        this.data[period][day][field] = value;
        this.saveData();
    }

    getAllSubjects() {
        const subjects = new Set();
        for (const p of Object.values(this.data)) {
            for (const cell of Object.values(p)) {
                if (cell.subject) subjects.add(cell.subject);
            }
        }
        return [...subjects];
    }

    render() {
        if (!this.container) return;
        const days = this.days;
        const periods = this.periods;
        const times = this.periodTimes;
        const showTimes = this.showTimes;

        let html = `
      <table class="w-full text-sm text-left border-collapse min-w-[500px]">
        <thead>
          <tr>
            <th class="border-b border-r border-slate-200 p-2 text-center text-slate-400 font-medium bg-slate-50/50 w-20 text-xs">
              ${showTimes ? '時限/時間' : ''}
            </th>
            ${days.map(d => `<th class="border-b border-slate-200 p-2 text-center text-slate-600 font-semibold bg-slate-50/50">${d}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
    `;

        for (const p of periods) {
            const t = times[p - 1];
            html += `<tr>
        <td class="border-b border-r border-slate-200 p-2 text-center bg-slate-50/50">
          <div class="font-bold text-slate-600 text-sm">${p}限</div>
          ${showTimes && t ? `<div class="text-[10px] text-slate-400 mt-0.5 leading-tight">${t.start}<br>${t.end}</div>` : ''}
        </td>`;

            for (const d of days) {
                // 旧データ(room)との後方互換性を保つ
                const raw = (this.data[p] && this.data[p][d]) ? this.data[p][d] : { subject: '', memo: '' };
                const cell = { subject: raw.subject || '', memo: raw.memo ?? raw.room ?? '' };
                const bgColor = cell.subject ? this.getSubjectColor(cell.subject) : '';
                const bgStyle = bgColor ? `background-color: ${bgColor};` : '';

                html += `<td class="border-b border-slate-200 p-1 text-center transition-colors" style="${bgStyle}">`;

                if (this.isEditing) {
                    html += `
            <div class="flex flex-col gap-1">
              <input type="text" class="w-full text-center border border-slate-300 rounded px-1 py-0.5 text-slate-800 text-sm focus:border-primary-500 outline-none bg-white/80"
                value="${cell.subject}" placeholder="科目" data-p="${p}" data-d="${d}" data-f="subject">
              <input type="text" class="w-full text-center border border-slate-200 rounded px-1 text-xs text-slate-500 focus:border-primary-500 outline-none bg-white/60"
                value="${cell.memo}" placeholder="メモ" data-p="${p}" data-d="${d}" data-f="memo">
            </div>
          `;
                } else {
                    html += `
            <div class="min-h-[3rem] flex flex-col items-center justify-center px-1">
              <div class="font-semibold text-slate-800 text-sm ${!cell.subject ? 'text-slate-300' : ''}">${cell.subject || '　'}</div>
              ${cell.memo ? `<div class="text-[10px] text-slate-500 mt-0.5">${cell.memo}</div>` : ''}
            </div>
          `;
                }
                html += `</td>`;
            }
            html += `</tr>`;
        }

        html += `</tbody></table>`;
        this.container.innerHTML = html;

        if (this.isEditing) {
            this.container.querySelectorAll('input').forEach(input => {
                input.addEventListener('change', (e) => {
                    const { p, d, f } = e.target.dataset;
                    this.updateCell(Number(p), d, f, e.target.value);
                    if (f === 'subject') {
                        this.getSubjectColor(e.target.value);
                        this.render();
                    }
                });
            });
        }
    }
}
