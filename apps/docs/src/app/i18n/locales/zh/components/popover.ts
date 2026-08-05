export const popoverTranslations = {
  'popover.description':
    '定位在 trigger 旁邊的浮動面板——適合情境選單、豐富的提示框與表單 overlay，不阻斷主要流程。',
  'popover.examples.basic.description': '預設定位在 trigger 正下方並水平置中的 popover。',
  'popover.usage.description':
    '將 trigger 和內容包在 sanring-popover 內，content 會自動根據 trigger 元素的座標定位。',
  'popover.installation.description':
    '用 CLI 加入這個元件，再匯入 popover primitives，或使用 SANRING_POPOVER_IMPORTS 一次匯入。',
  'popover.composition.description':
    'Popover 由根節點、trigger 指令與內容面板組合，面板可選用 header、title、description 子元件。',
  'popover.examples.description': '常見 popover 模式：對齊方式、使用者資料卡片與表單控制項。',
  'popover.demo.align': '對齊',
  'popover.demo.withHeader': '含 Header',
  'popover.demo.profile': '使用者資料',
  'popover.demo.profileEmail': 'jane@example.com',
  'popover.demo.openProfile': '開啟資料',
  'popover.demo.close': '關閉',
  'popover.api.description': 'popover primitives 支援的 inputs 與 model。',
  'popover.api.isOpen.description': '控制 popover 是否可見，支援 [(isOpen)] 雙向綁定。',
  'popover.api.align.description': "相對於 trigger 的對齊方式：'start'、'center'（預設）或 'end'。",
  'popover.api.class.description': '合併到浮動面板的額外 class。',
  'popover.accessibility.description':
    "trigger 按鈕有 aria-haspopup='dialog'、aria-expanded 及指向面板 id 的 aria-controls。面板本身帶有 role='dialog'。加入 sanringPopoverTitle 或 sanringPopoverDescription，即可自動綁定 aria-labelledby 和 aria-describedby。",
  'popover.keyboard.description': 'Popover 開啟時，焦點會移入面板。',
  'popover.keyboard.escape': '關閉 popover 面板，焦點返回 trigger。',
  'popover.keyboard.tab': '移動焦點到面板內的下一個可聚焦元素。',
  'popover.keyboard.shiftTab': '移動焦點到面板內的上一個可聚焦元素。',
  'popover.stateModel.description':
    "以 toggle 驅動。PopoverComponent 提供 isOpen model signal。透過 [sanringPopoverTrigger] 宣告式控制，或以 popover.open() / popover.close() 程式化操作。不是 CVA 表單控制項。",
} as const;
