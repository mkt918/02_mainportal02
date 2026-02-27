/**
 * reaction.js - リアクションシート履歴機能
 * 2カラム表示・ページネーション・授業ページへのリンク対応
 */
import { escapeHTML } from './utils.js';
import { STORAGE_KEYS, SELECTORS, CONSTANTS } from './config.js';

const PAGE_SIZE = 10; // 1ページ10件

export function initReaction() {
  let currentPage = 0;

  // ─── データ取得 ────────────────────────────────
  function getSubmissions() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.REACTION) || '[]'); } catch { return []; }
  }

  function formatDate(ts) {
    if (!ts) return '';
    return ts.replace('T', ' ').slice(0, 16);
  }

  // ─── バッジ更新 ────────────────────────────────
  function updateBadge() {
    const badge = document.querySelector(SELECTORS.REACTION_BADGE);
    if (!badge) return;
    const count = getSubmissions().length;
    if (count > 0) {
      badge.textContent = count > 99 ? '99+' : count;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }

  // ─── カード1件のHTMLを生成 ─────────────────────
  function renderCard(s, globalIndex) {
    const hasUrl = s.url && s.url !== '#';
    const wrapperTag = hasUrl ? 'a' : 'div';
    const wrapperAttrs = hasUrl
      ? `href="${s.url}" target="_blank" rel="noopener"`
      : '';

    return `
        <${wrapperTag} ${wrapperAttrs}
          class="reaction-card relative rounded-xl border border-slate-100 bg-slate-50
                 hover:bg-primary-50 hover:border-primary-200 hover:shadow-md
                 p-3.5 flex flex-col gap-1.5 transition-all group
                 ${hasUrl ? 'cursor-pointer' : ''}"
          ${!hasUrl ? '' : ''}>

          <!-- 削除ボタン -->
          <button class="reaction-delete-btn absolute top-2 right-2 p-1 text-slate-300 hover:text-red-400
                         rounded transition-all opacity-0 group-hover:opacity-100 z-10"
            data-index="${globalIndex}" title="削除">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <!-- 授業名 + 日時 -->
          <div class="flex items-start justify-between gap-2 pr-5">
            <p class="text-[11px] font-bold text-primary-600 line-clamp-2 leading-snug
                       group-hover:text-primary-700 transition-colors">
              ${escapeHTML(s.lesson || s.title || '(無題)')}
            </p>
          </div>
          <p class="text-[10px] text-slate-400">${formatDate(s.timestamp)}</p>

          ${s.number ? `<p class="text-[10px] text-slate-500">🔢 出席番号 <span class="font-semibold">${escapeHTML(s.number)}</span></p>` : ''}

          ${s.summary ? `
          <div>
            <p class="text-[9px] font-semibold text-slate-300 uppercase tracking-wide mb-0.5">まとめ・感想</p>
            <p class="text-[10px] text-slate-600 leading-relaxed line-clamp-3">${escapeHTML(s.summary)}</p>
          </div>` : ''}

          ${s.questions ? `
          <div>
            <p class="text-[9px] font-semibold text-slate-300 uppercase tracking-wide mb-0.5">わからなかった点</p>
            <p class="text-[10px] text-slate-600 leading-relaxed line-clamp-2">${escapeHTML(s.questions)}</p>
          </div>` : ''}

          ${hasUrl ? `
          <p class="text-[9px] text-primary-400 mt-auto pt-1 flex items-center gap-1">
            <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>授業ページへ
          </p>` : ''}
        </${wrapperTag}>`;
  }

  // ─── ページャーHTML ────────────────────────────
  function renderPager(total, page) {
    if (total <= PAGE_SIZE) return '';
    const totalPages = Math.ceil(total / PAGE_SIZE);
    const from = page * PAGE_SIZE + 1;
    const to = Math.min((page + 1) * PAGE_SIZE, total);
    const btnBase = 'reaction-pager-btn text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all';
    const on = 'text-primary-600 bg-primary-50 hover:bg-primary-100';
    const off = 'text-slate-300 cursor-not-allowed';
    return `
        <div class="flex items-center justify-between pt-3 border-t border-slate-100 shrink-0 px-4 pb-3">
          <button class="${btnBase} ${page === 0 ? off : on}" data-pager="-1" ${page === 0 ? 'disabled' : ''}>
            ← 前の${PAGE_SIZE}件
          </button>
          <span class="text-[10px] text-slate-400">${from}〜${to} / 全${total}件</span>
          <button class="${btnBase} ${page >= totalPages - 1 ? off : on}" data-pager="1" ${page >= totalPages - 1 ? 'disabled' : ''}>
            次の${PAGE_SIZE}件 →
          </button>
        </div>`;
  }

  // ─── 一覧レンダリング ──────────────────────────
  function renderList() {
    const list = document.querySelector(SELECTORS.REACTION_LIST);
    const countBadge = document.querySelector(SELECTORS.REACTION_COUNT);
    if (!list) return;

    const subs = getSubmissions();
    if (countBadge) countBadge.textContent = subs.length ? `(${subs.length}件)` : '';

    if (!subs.length) {
      list.innerHTML = `
            <div class="flex flex-col items-center justify-center py-12 text-slate-300">
              <svg class="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              <p class="text-sm">送信履歴がありません</p>
            </div>`;
      list.dataset.pager = '';
      return;
    }

    // ページ範囲クランプ
    const totalPages = Math.ceil(subs.length / PAGE_SIZE) || 1;
    if (currentPage >= totalPages) currentPage = totalPages - 1;

    const pageItems = subs.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

    // 2カラムグリッドで表示
    list.innerHTML = `
          <div class="grid grid-cols-2 gap-2.5 p-4">
            ${pageItems.map((s, i) => renderCard(s, currentPage * PAGE_SIZE + i)).join('')}
          </div>`;

    // ページャーをモーダルフッターに表示
    let pagerEl = document.getElementById('reaction-pager');
    if (!pagerEl) {
      pagerEl = document.createElement('div');
      pagerEl.id = 'reaction-pager';
      list.parentElement.appendChild(pagerEl);
    }
    pagerEl.innerHTML = renderPager(subs.length, currentPage);

    // 個別削除ボタン
    list.querySelectorAll('.reaction-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        const subs2 = getSubmissions();
        subs2.splice(parseInt(btn.dataset.index), 1);
        localStorage.setItem(STORAGE_KEYS.REACTION, JSON.stringify(subs2));
        if (currentPage > 0 && currentPage >= Math.ceil(subs2.length / PAGE_SIZE)) {
          currentPage--;
        }
        renderList();
        updateBadge();
      });
    });

    // ページャーボタン
    pagerEl.querySelectorAll('.reaction-pager-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentPage += parseInt(btn.dataset.pager);
        renderList();
      });
    });
  }

  // ─── モーダル開閉 ──────────────────────────────
  function openModal() {
    currentPage = 0;
    renderList();
    document.querySelector(SELECTORS.REACTION_MODAL)?.classList.remove('hidden');
  }

  function closeModal() {
    document.querySelector(SELECTORS.REACTION_MODAL)?.classList.add('hidden');
  }

  // ─── イベント設定 ──────────────────────────────
  updateBadge();

  document.getElementById('btn-reaction-history')?.addEventListener('click', openModal);
  document.getElementById('btn-reaction-close')?.addEventListener('click', closeModal);
  document.getElementById('reaction-overlay')?.addEventListener('click', closeModal);

  document.getElementById('btn-reaction-clear')?.addEventListener('click', () => {
    if (confirm('送信履歴を全て削除しますか？')) {
      localStorage.removeItem(STORAGE_KEYS.REACTION);
      currentPage = 0;
      renderList();
      updateBadge();
    }
  });

  // ESCキーで閉じる
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // 他タブで投稿された場合に件数バッジを更新
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEYS.REACTION) updateBadge();
  });
}
