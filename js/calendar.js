export class Calendar {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentDate = new Date();
        this.render();
    }

    changeMonth(delta) {
        this.currentDate.setMonth(this.currentDate.getMonth() + delta);
        this.render();
    }

    render() {
        if (!this.container) return;

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const today = new Date();

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
        const dayNames = ["日", "月", "火", "水", "木", "金", "土"];

        let html = `
      <div class="flex items-center justify-between mb-4">
        <button class="cal-prev p-1 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
        <div class="font-semibold text-slate-800">${year}年 ${monthNames[month]}</div>
        <button class="cal-next p-1 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><i data-lucide="chevron-right" class="w-5 h-5"></i></button>
      </div>
      <div class="grid grid-cols-7 gap-1 text-center text-xs mb-2">
    `;

        // 曜日ヘッダー
        dayNames.forEach((d, i) => {
            const color = i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-slate-500';
            html += `<div class="font-medium ${color} pb-2">${d}</div>`;
        });
        html += `</div><div class="grid grid-cols-7 gap-1 text-sm">`;

        // 空白
        for (let i = 0; i < firstDay; i++) {
            html += `<div></div>`;
        }

        // 日付
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
            const currentDayOfWeek = (firstDay + day - 1) % 7;
            let textColor = 'text-slate-700';
            if (currentDayOfWeek === 0) textColor = 'text-red-600';
            if (currentDayOfWeek === 6) textColor = 'text-blue-600';

            const bgClass = isToday ? 'bg-primary-500 text-white font-bold rounded-lg shadow-sm' : 'hover:bg-slate-100 rounded-lg';

            html += `
        <div class="aspect-square flex items-center justify-center cursor-pointer transition-colors ${bgClass} ${isToday ? '' : textColor}">
          ${day}
        </div>
      `;
        }

        html += `</div>`;
        this.container.innerHTML = html;

        // lucide icons の再描画対応が必要なため
        if (window.lucide) {
            window.lucide.createIcons({ root: this.container });
        }

        this.container.querySelector('.cal-prev').addEventListener('click', () => this.changeMonth(-1));
        this.container.querySelector('.cal-next').addEventListener('click', () => this.changeMonth(1));
    }
}
