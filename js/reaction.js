/**
 * reaction.js - リアクションシート履歴機能
 * index.html のインラインスクリプトから分離
 */
import { escapeHTML } from './utils.js';
import { STORAGE_KEYS, SELECTORS } from './config.js';

export function initReaction() {
    function getSubmissions() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.REACTION) || '[]'); } catch { return []; }
    }

    function formatDate(ts) {
        if (!ts) return '';
        // "2026-02-24 10:30:00" or ISO
        return ts.replace('T', ' ').slice(0, 16);
    }

    function updateBadge() {
        const badge = document.querySelector(SELECTORS.REACTION_BADGE);
        if (!badge) return;
        const count = getSubmissions().length;
        if (count > 0) {
            badge.textContent = count > 9 ? '9+' : count;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }

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
            return;
        }
        list.innerHTML = subs.map((s, i) => `
          <div class="rounded-xl border border-slate-100 bg-slate-50 p-4 relative group">
            <button class="reaction-delete-btn absolute top-2 right-2 p-1 text-slate-300 hover:text-red-400 rounded transition-all opacity-0 group-hover:opacity-100"
              data-index="${i}" title="削除">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
            <div class="flex items-start justify-between gap-2 mb-2">
              <p class="text-xs font-bold text-primary-600 line-clamp-1">${escapeHTML(s.lesson || s.title || '(無題)')}</p>
              <span class="text-[10px] text-slate-400 shrink-0">${formatDate(s.timestamp)}</span>
            </div>
            ${s.number ? `<p class="text-[11px] text-slate-500 mb-1">🔢 出席番号: <span class="font-medium">${escapeHTML(s.number)}</span></p>` : ''}
            ${s.summary ? `
              <div class="mb-1.5">
                <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">まとめ・感想</p>
                <p class="text-xs text-slate-700 leading-relaxed line-clamp-3">${escapeHTML(s.summary)}</p>
              </div>` : ''}
            ${s.questions ? `
              <div>
                <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">わからなかった点</p>
                <p class="text-xs text-slate-700 leading-relaxed line-clamp-2">${escapeHTML(s.questions)}</p>
              </div>` : ''}
          </div>`).join('');

        // 個別削除ボタン
        list.querySelectorAll('.reaction-delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const subs2 = getSubmissions();
                subs2.splice(parseInt(btn.dataset.index), 1);
                localStorage.setItem(STORAGE_KEYS.REACTION, JSON.stringify(subs2));
                renderList();
                updateBadge();
            });
        });
    }

    function openModal() {
        renderList();
        document.querySelector(SELECTORS.REACTION_MODAL)?.classList.remove('hidden');
    }

    function closeModal() {
        document.querySelector(SELECTORS.REACTION_MODAL)?.classList.add('hidden');
    }

    // main.js は type="module" のため DOM 解析後に実行される（DOMContentLoaded 不要）
    updateBadge();

    document.getElementById('btn-reaction-history')?.addEventListener('click', openModal);
    document.getElementById('btn-reaction-close')?.addEventListener('click', closeModal);
    document.getElementById('reaction-overlay')?.addEventListener('click', closeModal);

    document.getElementById('btn-reaction-clear')?.addEventListener('click', () => {
        if (confirm('送信履歴を全て削除しますか？')) {
            localStorage.removeItem(STORAGE_KEYS.REACTION);
            renderList();
            updateBadge();
        }
    });

    // storage イベント（他タブで投稿された場合にも反映）
    window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEYS.REACTION) updateBadge();
    });
}
