export class Timetable {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.storageKey = 'class-portal-timetable';
        this.days = ['月', '火', '水', '木', '金'];
        this.periods = [1, 2, 3, 4, 5, 6];
        this.data = this.loadData();
        this.isEditing = false;
        this.render();
    }

    loadData() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) return JSON.parse(saved);

        // Initialize empty timetable
        const initial = {};
        for (const p of this.periods) {
            initial[p] = {};
            for (const d of this.days) {
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
        this.data[period][day][field] = value;
        this.saveData();
    }

    render() {
        if (!this.container) return;

        let html = `
      <table class="w-full text-sm text-left border-collapse min-w-[500px]">
        <thead>
          <tr>
            <th class="border-b border-r border-slate-200 p-2 w-12 text-center text-slate-500 font-medium bg-slate-50/50"></th>
            ${this.days.map(d => `<th class="border-b border-slate-200 p-2 text-center text-slate-600 font-medium bg-slate-50/50 w-1/5">${d}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
    `;

        for (const p of this.periods) {
            html += `<tr><td class="border-b border-r border-slate-200 p-2 text-center text-slate-500 font-medium bg-slate-50/50">${p}</td>`;
            for (const d of this.days) {
                const cell = this.data[p][d] || { subject: '', room: '' };
                html += `<td class="border-b border-slate-200 p-2 text-center cursor-pointer transition-colors hover:bg-slate-50/50 group">`;

                if (this.isEditing) {
                    html += `
            <div class="flex flex-col gap-1">
              <input type="text" class="w-full text-center border border-slate-200 rounded px-1 py-0.5 text-slate-800 text-sm focus:border-primary-500 outline-none" value="${cell.subject}" placeholder="科目" data-p="${p}" data-d="${d}" data-f="subject">
              <input type="text" class="w-full text-center border border-slate-200 rounded px-1 text-xs text-slate-500 focus:border-primary-500 outline-none" value="${cell.room}" placeholder="教室" data-p="${p}" data-d="${d}" data-f="room">
            </div>
          `;
                } else {
                    html += `
            <div class="min-h-[3rem] flex flex-col items-center justify-center">
              <div class="font-medium text-slate-800 ${!cell.subject && 'text-slate-300'}">${cell.subject || '-'}</div>
              <div class="text-xs text-slate-400 mt-1">${cell.room || ''}</div>
            </div>
          `;
                }

                html += `</td>`;
            }
            html += `</tr>`;
        }

        html += `</tbody></table>`;
        this.container.innerHTML = html;

        // Attach edit listeners
        if (this.isEditing) {
            const inputs = this.container.querySelectorAll('input');
            inputs.forEach(input => {
                input.addEventListener('change', (e) => {
                    const { p, d, f } = e.target.dataset;
                    this.updateCell(Number(p), d, f, e.target.value);
                });
            });
        }
    }
}
