/**
 * utils.js - 共通ユーティリティ関数
 */
import { CONSTANTS } from './config.js';

/** HTML特殊文字をエスケープ */
export function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
}

/** #RRGGBB 形式の色を明るさ調整した色を返す */
export function adjustColor(hex, amount) {
    return '#' + hex.replace(/^#/, '').replace(/../g, c =>
        ('0' + Math.min(255, Math.max(0, parseInt(c, 16) + amount)).toString(16)).slice(-2)
    );
}

/** hex → {r,g,b} */
export function hexToRgb(hex) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
}

/** hex色が明るいかどうかを輝度で判定（明るければ true） */
export function isLightColor(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return true;
    const luminance = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
    return luminance > CONSTANTS.LUMINANCE_THRESHOLD;
}

/** 期限文字列(YYYY-MM-DD)から今日との差分日数を返す（過去は負、当日は0） */
export function calcDeadlineDiff(deadline) {
    const d = new Date(deadline + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.ceil((d - today) / CONSTANTS.MS_PER_DAY);
}

/** Dateオブジェクトを「M/D（曜）」形式に変換 */
export function formatJpDate(dateObj) {
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    return `${dateObj.getMonth() + 1}/${dateObj.getDate()}（${days[dateObj.getDay()]}）`;
}
