/**
 * trivia.js - ヘッダートリビア表示機能
 * public/data/trivia.csv (theme,content,description) からランダム表示
 * - ページ読み込み時にランダム1件
 * - 20秒ごとにフェードで自動切替
 * - クリックで次のトリビアへ
 * - マウスオーバーで description をツールチップ表示
 */

export async function initTrivia() {
    const el = document.getElementById('header-trivia');
    if (!el) return;

    // ─── CSV 読み込み ────────────────────────────
    // Vite の base 設定に追随するため import.meta.env.BASE_URL を使用
    const csvUrl = `${import.meta.env.BASE_URL}data/trivia.csv`;
    let items = []; // { content, description }
    try {
        const res = await fetch(csvUrl);
        const text = await res.text();
        // 1行目ヘッダーをスキップ。各行: theme,content,description
        text.split('\n').slice(1).forEach(line => {
            line = line.trim();
            if (!line) return;
            const cols = line.split(',');
            if (cols.length < 2) return;
            const content = cols[1]?.trim() || '';
            const description = cols.slice(2).join(',').trim(); // descriptionにカンマが含まれる場合も結合
            if (content) items.push({ content, description });
        });
    } catch (e) {
        console.warn('[trivia] CSV の読み込みに失敗しました:', e);
        return;
    }

    if (!items.length) return;

    // ─── 既出インデックスを避けてランダム選択 ──
    let lastIndex = -1;
    function pickRandom() {
        if (items.length === 1) return items[0];
        let idx;
        do { idx = Math.floor(Math.random() * items.length); } while (idx === lastIndex);
        lastIndex = idx;
        return items[idx];
    }

    // ─── 表示（フェードアニメ付き）─────────────
    function showItem(item) {
        // フェードアウト
        el.style.transition = 'opacity 0.4s ease';
        el.style.opacity = '0';
        setTimeout(() => {
            el.textContent = `【${item.content}】`;
            el._triviaDesc = item.description; // ツールチップ用に保存
            // フェードイン
            el.style.opacity = '1';
        }, 420);
    }

    // ─── 初回表示 (フェードなし) ─────────────────
    const first = pickRandom();
    el.textContent = `【${first.content}】`;
    el._triviaDesc = first.description;
    el.style.opacity = '1';
    el.style.transition = 'opacity 0.4s ease';

    // ─── 20秒ごと自動ローテーション ────────────
    let timer = setInterval(() => showItem(pickRandom()), 20000);

    // ─── クリックで手動切替 ──────────────────────
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => {
        clearInterval(timer);
        showItem(pickRandom());
        timer = setInterval(() => showItem(pickRandom()), 20000);
    });

    // ─── マウスオーバーで description ツールチップ ─
    const tooltip = document.createElement('div');
    tooltip.id = 'trivia-tooltip';
    tooltip.style.cssText = `
        position: fixed;
        z-index: 9999;
        max-width: 320px;
        background: rgba(15,23,42,0.92);
        color: #f1f5f9;
        font-size: 12px;
        line-height: 1.6;
        padding: 8px 12px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.25);
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease;
        white-space: normal;
        word-break: break-all;
    `;
    document.body.appendChild(tooltip);

    el.addEventListener('mouseenter', (e) => {
        const desc = el._triviaDesc;
        if (!desc) return;
        tooltip.textContent = desc;
        tooltip.style.opacity = '1';
        moveTooltip(e);
    });

    el.addEventListener('mousemove', moveTooltip);

    el.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
    });

    function moveTooltip(e) {
        const margin = 12;
        const tw = tooltip.offsetWidth || 320;
        const th = tooltip.offsetHeight || 60;
        let x = e.clientX + margin;
        let y = e.clientY + margin;
        if (x + tw > window.innerWidth) x = e.clientX - tw - margin;
        if (y + th > window.innerHeight) y = e.clientY - th - margin;
        tooltip.style.left = x + 'px';
        tooltip.style.top = y + 'px';
    }
}
