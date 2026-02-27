import { escapeHTML } from './utils.js';
import { STORAGE_KEYS, TIMETABLE_PALETTE } from './config.js';

export class Timetable {
  constructor(containerId, settings) {
    this.container = document.getElementById(containerId);
    this.storageKey = STORAGE_KEYS.TIMETABLE;
    this.colorStorageKey = STORAGE_KEYS.SUBJECT_COLORS;
    this.settings = settings;
    this.isEditing = false;
    this.data = this.loadData();
    this.subjectColors = this.loadColors();
    this.palette = TIMETABLE_PALETTE;
    this.render();
  }

  get days() { return ['月', '火', '水', '木', '金', '土'].slice(0, this.settings?.settings?.timetableDays || 5); }
  get periods() { const n = this.settings?.settings?.timetablePeriods || 6; return Array.from({ length: n }, (_, i) => i + 1); }
  get periodTimes() { return this.settings?.settings?.periodTimes || []; }
  get showTimes() { return this.settings?.settings?.showPeriodTimes || false; }

  loadData() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) return JSON.parse(saved);
    const init = {};
    for (let p = 1; p <= 7; p++) {
      init[p] = {};
      ['月', '火', '水', '木', '金', '土'].forEach(d => { init[p][d] = { subject: '', memo: '' }; });
    }
    return init;
  }

  loadColors() { const s = localStorage.getItem(this.colorStorageKey); return s ? JSON.parse(s) : {}; }
  saveData() { localStorage.setItem(this.storageKey, JSON.stringify(this.data)); }
  saveColors() { localStorage.setItem(this.colorStorageKey, JSON.stringify(this.subjectColors)); }

  getSubjectColor(subject) {
    if (!subject) return '';
    if (this.subjectColors[subject]) return this.subjectColors[subject];
    const used = Object.values(this.subjectColors);
    const color = this.palette.find(c => !used.includes(c)) || this.palette[Object.keys(this.subjectColors).length % this.palette.length];
    this.subjectColors[subject] = color;
    this.saveColors();
    return color;
  }

  setSubjectColor(subject, color) { this.subjectColors[subject] = color; this.saveColors(); this.render(); }
  toggleEdit() { this.isEditing = !this.isEditing; this.render(); }

  updateCell(period, day, field, value) {
    if (!this.data[period]) this.data[period] = {};
    if (!this.data[period][day]) this.data[period][day] = { subject: '', memo: '' };
    this.data[period][day][field] = value;
    this.saveData();
  }

  getAllSubjects() {
    const s = new Set();
    Object.values(this.data).forEach(row => Object.values(row).forEach(c => { if (c.subject) s.add(c.subject); }));
    return [...s];
  }

  renderCell(cell, p, d) {
    const bgStyle = cell.subject ? `background-color:${this.getSubjectColor(cell.subject)};` : '';
    if (this.isEditing) {
      return `
        <td class="border-b border-slate-200 p-0.5 text-center transition-colors" style="${bgStyle}">
          <div class="flex flex-col gap-0.5">
            <input type="text" class="w-full text-center border border-slate-300 rounded px-1 py-0.5 text-xs focus:border-primary-500 outline-none bg-white/80"
              value="${escapeHTML(cell.subject)}" placeholder="科目" data-p="${p}" data-d="${d}" data-f="subject">
            <input type="text" class="w-full text-center border border-slate-200 rounded px-1 text-[10px] text-slate-500 focus:border-primary-500 outline-none bg-white/60"
              value="${escapeHTML(cell.memo)}" placeholder="メモ" data-p="${p}" data-d="${d}" data-f="memo">
          </div>
        </td>`;
    }
    return `
      <td class="border-b border-slate-200 p-0.5 text-center transition-colors" style="${bgStyle}">
        <div class="min-h-[2rem] flex flex-col items-center justify-center px-0.5">
          <div class="font-semibold text-slate-800 text-[11px] leading-tight ${!cell.subject ? 'text-slate-300' : ''}">${escapeHTML(cell.subject) || '　'}</div>
          ${cell.memo ? `<div class="text-[9px] text-slate-500 leading-tight">${escapeHTML(cell.memo)}</div>` : ''}
        </div>
      </td>`;
  }

  render() {
    if (!this.container) return;
    const { days, periods, periodTimes, showTimes } = this;

    const headerRow = `<tr>
      <th class="border-b border-r border-slate-200 p-1 text-center text-slate-400 font-medium bg-slate-50/50 w-10 text-[10px]">${showTimes ? '時限' : ''}</th>
      ${days.map(d => `<th class="border-b border-slate-200 p-1 text-center text-slate-600 font-semibold bg-slate-50/50 text-xs">${d}</th>`).join('')}
    </tr>`;

    const bodyRows = periods.map(p => {
      const t = periodTimes[p - 1];
      const cells = days.map(d => {
        const raw = (this.data[p] && this.data[p][d]) || { subject: '', memo: '' };
        const cell = { subject: raw.subject || '', memo: raw.memo ?? raw.room ?? '' };
        return this.renderCell(cell, p, d);
      }).join('');
      return `<tr>
        <td class="border-b border-r border-slate-200 p-1 text-center bg-slate-50/50">
          <div class="font-bold text-slate-600 text-[11px]">${p}</div>
          ${showTimes && t ? `<div class="text-[9px] text-slate-400 leading-tight">${t.start}<br>${t.end}</div>` : ''}
        </td>${cells}
      </tr>`;
    }).join('');

    this.container.innerHTML = `<table class="w-full text-xs text-left border-collapse min-w-[280px]">
      <thead>${headerRow}</thead><tbody>${bodyRows}</tbody></table>`;

    if (this.isEditing) {
      this.container.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', e => {
          const { p, d, f } = e.target.dataset;
          this.updateCell(Number(p), d, f, e.target.value);
          if (f === 'subject') { this.getSubjectColor(e.target.value); this.render(); }
        });
      });
    }
  }
}
