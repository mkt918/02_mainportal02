/**
 * config.js - アプリケーション全体の定数を一元管理
 * LocalStorageキー・DOMセレクタ・数値定数・デフォルト設定・カラーパレット
 */

// ─── LocalStorage キー ───────────────────────────────
export const STORAGE_KEYS = {
    SETTINGS:       'class-portal-settings',
    TIMETABLE:      'class-portal-timetable',
    SUBJECT_COLORS: 'class-portal-subject-colors',
    CALENDAR_NOTES: 'class-portal-calendar-notes',
    TODO:           'class-portal-todo-v2',
    LINKS:          'class-portal-links',
    REACTION:       'lesson_submissions',
};

// ─── DOM セレクタ ─────────────────────────────────────
export const SELECTORS = {
    MAIN_HEADER:     '#main-header',
    DASHBOARD_MAIN:  '#dashboard-main',
    CARD_TIMETABLE:  '#card-timetable',
    SECTION_LESSONS: '#section-lessons',
    SECTION_CAL:     '#section-calendar',
    SECTION_TODO:    '#section-todo',
    SECTION_LINKS:   '#section-links',
    CAL_NOTE_PANEL:  '#calendar-note-panel',
    CAL_UPCOMING:    '#calendar-upcoming-notes',
    REACTION_MODAL:  '#reaction-modal',
    REACTION_BADGE:  '#reaction-badge',
    REACTION_LIST:   '#reaction-list',
    REACTION_COUNT:  '#reaction-count-badge',
};

// ─── 数値定数 ─────────────────────────────────────────
export const CONSTANTS = {
    TODO_MAX_PRIORITY:      5,
    MS_PER_DAY:             86400000,
    DEADLINE_WARN_DAYS:     3,
    COLOR_DARKEN_600:      -20,   // primary-600 相当（負値で暗くなる）
    COLOR_DARKEN_700:      -40,   // primary-700 相当
    COLOR_DARKEN_GRADIENT: -50,   // グラデーション用
    LUMINANCE_THRESHOLD:   160,   // 明暗テキスト自動切替の輝度閾値
    LESSONS_PAGE_SIZE:      10,
};

// ─── デフォルト設定値 ────────────────────────────────
export const DEFAULT_SETTINGS = {
    themeColor:      '#0ea5e9',
    wallpaperMode:   'pattern',
    wallpaperImage:  '',
    wallpaperColor:  '#f8fafc',
    portalTitle:     '学習ポータル',
    cardOpacity:     90,
    fontSize:        'md',
    timetableDays:   5,
    timetablePeriods: 6,
    showPeriodTimes: false,
    periodTimes: [
        { start: '08:50', end: '09:40' },
        { start: '09:50', end: '10:40' },
        { start: '10:50', end: '11:40' },
        { start: '13:00', end: '13:50' },
        { start: '14:00', end: '14:50' },
        { start: '15:00', end: '15:50' },
        { start: '16:00', end: '16:50' },
    ],
    lessonsLimit:    0,
    headerStyle:     'glass',
    headerBgColor:   '',
    layoutStyle:     'style1',
    widgetVisibility: {
        timetable: true,
        lessons:   true,
        calendar:  true,
        todo:      true,
        links:     true,
    },
};

// ─── 時間割カラーパレット ────────────────────────────
export const TIMETABLE_PALETTE = [
    '#bfdbfe', '#bbf7d0', '#fef08a', '#fecaca',
    '#ddd6fe', '#fed7aa', '#cffafe', '#fbcfe8',
    '#e5e7eb', '#d1fae5',
];
