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
        const todayY = today.getFullYear(), todayM = today.getMonth(), todayD = today.getDate();

        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // 月曜始まり用: 0=日 → 0=月として日付オフセットを計算
        // firstDayOfWeek: 0=Sun,1=Mon,...,6=Sat
        // 月曜始まりのオフセット = (firstDayOfWeek + 6) % 7
        const rawFirstDay = new Date(year, month, 1).getDay(); // 0=Sun
        const startOffset = (rawFirstDay + 6) % 7; // 月曜始まりの空白数

        const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
        // 月曜始まりの曜日ラベル
        const dayNames = ["月", "火", "水", "木", "金", "土", "日"];

        let html = `
      <div class="flex items-center justify-between mb-4">
        <button class="cal-prev p-1 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
        <div class="font-semibold text-slate-800">${year}年 ${monthNames[month]}</div>
        <button class="cal-next p-1 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><i data-lucide="chevron-right" class="w-5 h-5"></i></button>
      </div>
      <div class="grid grid-cols-7 gap-1 text-center text-xs mb-2">
    `;

        // 曜日ヘッダー（月〜日）
        dayNames.forEach((d, i) => {
            // 月曜(0)〜金曜(4)は通常色、土曜(5)は青、日曜(6)は赤
            const color = i === 5 ? 'text-blue-500' : i === 6 ? 'text-red-500' : 'text-slate-500';
            html += `<div class="font-medium ${color} pb-2">${d}</div>`;
        });
        html += `</div><div class="grid grid-cols-7 gap-1 text-sm">`;

        // 空白マス（月曜始まりのオフセット）
        for (let i = 0; i < startOffset; i++) {
            html += `<div></div>`;
        }

        // 日付マス
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = year === todayY && month === todayM && day === todayD;
            // 月曜始まりでの曜日インデックス: 0=月,...,5=土,6=日
            const colIndex = (startOffset + day - 1) % 7;
            let textColor = 'text-slate-700';
            if (colIndex === 5) textColor = 'text-blue-600'; // 土
            if (colIndex === 6) textColor = 'text-red-600';  // 日

            const bgClass = isToday
                ? 'bg-primary-500 text-white font-bold rounded-lg shadow-sm'
                : `hover:bg-slate-100 rounded-lg ${textColor}`;

            html += `
        <div class="aspect-square flex items-center justify-center cursor-pointer transition-colors ${bgClass}">
          ${day}
        </div>
      `;
        }

        html += `</div>`;
        this.container.innerHTML = html;

        if (window.lucide) {
            window.lucide.createIcons({ root: this.container });
        }

        this.container.querySelector('.cal-prev').addEventListener('click', () => this.changeMonth(-1));
        this.container.querySelector('.cal-next').addEventListener('click', () => this.changeMonth(1));
    }
}
