export class Timetable {
    constructor(containerId, settings) {
        this.container = document.getElementById(containerId);
        this.storageKey = 'class-portal-timetable';
        this.settings = settings;
        this.isEditing = false;
        this.data = this.loadData();
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
                initial[p][d] = { subject: '', room: '' };
            }
        }
        return initial;
    }

    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
        this.render();
    }

    updateCell(period, day, field, value) {
        if (!this.data[period]) this.data[period] = {};
        if (!this.data[period][day]) this.data[period][day] = { subject: '', room: '' };
        this.data[period][day][field] = value;
        this.saveData();
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
            <th class="border-b border-r border-slate-200 p-2 text-center text-slate-500 font-medium bg-slate-50/50 w-20">
              ${showTimes ? '時間' : ''}
            </th>
            ${days.map(d => `<th class="border-b border-slate-200 p-2 text-center text-slate-600 font-medium bg-slate-50/50">${d}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
    `;

        for (const p of periods) {
            const t = times[p - 1];
            html += `<tr>
        <td class="border-b border-r border-slate-200 p-2 text-center bg-slate-50/50">
          <div class="font-bold text-slate-600 text-sm">${p}限</div>
          ${showTimes && t ? `<div class="text-[10px] text-slate-400 mt-0.5">${t.start}<br>${t.end}</div>` : ''}
        </td>`;

            for (const d of days) {
                const cell = (this.data[p] && this.data[p][d]) ? this.data[p][d] : { subject: '', room: '' };

                html += `<td class="border-b border-slate-200 p-1 text-center transition-colors hover:bg-slate-50/50">`;
                if (this.isEditing) {
                    html += `
            <div class="flex flex-col gap-1">
              <input type="text" class="w-full text-center border border-slate-200 rounded px-1 py-0.5 text-slate-800 text-sm focus:border-primary-500 outline-none" value="${cell.subject}" placeholder="科目" data-p="${p}" data-d="${d}" data-f="subject">
              <input type="text" class="w-full text-center border border-slate-200 rounded px-1 text-xs text-slate-500 focus:border-primary-500 outline-none" value="${cell.room}" placeholder="教室" data-p="${p}" data-d="${d}" data-f="room">
            </div>
          `;
                } else {
                    html += `
            <div class="min-h-[3rem] flex flex-col items-center justify-center px-1">
              <div class="font-medium text-slate-800 text-sm ${!cell.subject ? 'text-slate-300' : ''}">${cell.subject || '　'}</div>
              ${cell.room ? `<div class="text-[10px] text-slate-400 mt-0.5">${cell.room}</div>` : ''}
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
                });
            });
        }
    }
}
