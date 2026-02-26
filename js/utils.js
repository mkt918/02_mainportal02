/**
 * utils.js - 共通ユーティリティ関数
 */

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
