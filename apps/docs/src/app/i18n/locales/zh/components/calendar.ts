export const calendarTranslations = {
  'calendar.description':
    '以 @sanring/date-picker-core 的 headless 引擎為核心的日曆格線，支援單選、範圍選取與多月顯示。',
  'calendar.examples.description':
    '以下狀態直接對應 @sanring/date-picker-core 官方 demo 的漸進式展示場景。',
  'calendar.demo.noDeselect': '不可取消選取',
  'calendar.demo.noDeselect.description': 'allowDeselect = false——再次點擊已選日期不會取消。',
  'calendar.demo.disabled': '含禁用規則',
  'calendar.demo.disabled.description':
    '週末（predicate 函式）＋ 7/20–7/24 公休（區間）疊加禁用，且不可取消選取。',
  'calendar.demo.range': '區間選取',
  'calendar.demo.range.description':
    '第一次點擊設定起點（進入 Draft），第二次點擊提交區間；可用「中止草稿」按鈕回溯。',
  'calendar.demo.multiMonth': '多月顯示',
  'calendar.demo.multiMonth.description':
    '同時顯示兩個月份，鍵盤方向鍵可在兩個月格之間無縫移動，抵達整個視窗邊界才自動換頁。orientation 純粹是版面呈現——不會改變月份順序，只切換 flex-direction。',
  'calendar.demo.multiMonth.tab.horizontal': '水平並排',
  'calendar.demo.multiMonth.tab.vertical': '垂直堆疊',
  'calendar.demo.clear': '清空',
  'calendar.demo.abortDraft': '中止草稿',
  'calendar.demo.noSelection': '尚未選取',
  'calendar.demo.selected': '已選：',
  'calendar.demo.rangeStart': '起點：',
  'calendar.demo.rangeAwaitingEnd': '（請選終點）',
  'calendar.demo.rangeSeparator': ' ～ ',
  'calendar.demo.weekStart': '一週起始日',
  'calendar.demo.weekStart.description':
    'weekStartsOn 調整的是網格本身的排序，不只是標題文字——跟語言、標籤內容完全無關，可以獨立切換。',
  'calendar.demo.weekStart.sunFirst': 'weekStartsOn: 0（週日開頭）',
  'calendar.demo.weekStart.monFirst': 'weekStartsOn: 1（週一開頭）',
  'calendar.demo.customLocale': '自訂語系',
  'calendar.demo.customLocale.description':
    'weekdayLabels 與 monthLabels 就是普通的字串陣列，沒有內建預設值——可以換成任何文字系統，且不會動到一週起始日的排序。',
  'calendar.demo.customLocale.tab.zh': '中文',
  'calendar.demo.customLocale.tab.ja': '日文',
  'calendar.examples.basic.description':
    '未提供 locale 時會拋出錯誤——CALENDAR_LOCALE 沒有預設值，強制你明確決定週起始日與月份/星期標籤。點擊標題中的年月文字可直接跳到任何月份或年份。',
  'calendar.usage.description': '匯入 CalendarComponent，並在應用層或元件層提供 CALENDAR_LOCALE。',
  'calendar.installation.description':
    '用 CLI 加入這個元件（會一併安裝 @sanring/date-picker-core 作為 peer dependency），再匯入 CalendarComponent。',
  'calendar.api.description': 'CalendarComponent 支援的 Inputs、Outputs 與公開方法。',
  'calendar.api.id.description': 'host id，用於 field 關聯與 imperative focus；未提供時自動產生。',
  'calendar.api.class.description': '與元件基礎樣式合併的額外 class。',
  'calendar.api.size.description': '日期格子的尺寸。',
  'calendar.api.locale.description': '覆蓋注入的 CALENDAR_LOCALE；未提供時退回使用注入的 token。',
  'calendar.api.mode.description': '單選或範圍選取模式，切換時會重置選取狀態。',
  'calendar.api.monthsToDisplay.description': '同時顯示的月份數量。',
  'calendar.api.orientation.description':
    '多月顯示（monthsToDisplay > 1）時的排列方向。純屬版面呈現——引擎只保證陣列順序正確，不管畫面上怎麼擺。',
  'calendar.api.disabled.description':
    '停用日期的比對條件：單一日期、陣列、區間或 predicate 函式。',
  'calendar.api.allowDeselect.description': '再次點選已選取的日期時是否可取消選取。',
  'calendar.api.required.description': '將 calendar 標記為必填，供 field 整合與 aria-required 使用。',
  'calendar.api.ariaDescribedBy.description':
    '描述 calendar 的 helper text id；會與 Field 提供的描述 id 合併。',
  'calendar.api.prevMonthLabel.description': '上一月按鈕的 aria-label，供 i18n 覆蓋。',
  'calendar.api.nextMonthLabel.description': '下一月按鈕的 aria-label，供 i18n 覆蓋。',
  'calendar.api.jumpMonthLabel.description': '年月跳轉 popover 中月份 select 的 aria-label。',
  'calendar.api.jumpYearLabel.description': '年月跳轉 popover 中年份 select 的 aria-label。',
  'calendar.api.selectedDateChange.description': '單選模式下，選取日期變化時發出。',
  'calendar.api.selectedRangeChange.description': '範圍模式下，選取範圍變化時發出。',
  'calendar.api.isDraftActive.description': '範圍模式下，是否已選第一個端點、正等待第二個端點。',
  'calendar.api.clear.description': '清空目前選取（範圍模式會連同進行中的草稿一併清除）。',
  'calendar.api.abortRangeDraft.description': '中止進行中的範圍草稿，不影響已提交的範圍。',
  'calendar.api.focus.description': '將焦點移到 calendar host 元素。',
} as const;
