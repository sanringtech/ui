export const dropdownMenuTranslations = {
  'dropdownMenu.description': '從觸發器展開的浮動選單，適合承載情境操作。',
  'dropdownMenu.examples.basic.description': '包含 label、separator 與危險操作項目的基礎操作選單。',
  'dropdownMenu.usage.description':
    '先匯入 ButtonDirective 與 dropdown menu primitives，再用 content 的 template 變數（#menu="sanringDropdownMenuContent"）提供 trigger 的 [menu]。SANRING_DROPDOWN_MENU_IMPORTS 是便利整包匯入，適合一般使用；若只需要部分 primitive，也可以個別匯入以讓依賴更明確。',
  'dropdownMenu.installation.description':
    '用 CLI 加入這個元件，再匯入 SANRING_DROPDOWN_MENU_IMPORTS 取得完整 primitive set；需要更細的 imports 控制時，也可改用個別 primitive。',
  'dropdownMenu.examples.description':
    '常見 dropdown menu 模式，包含可勾選選項、radio 樣式選擇、巢狀選項與帶圖示項目。',
  'dropdownMenu.demo.checkbox': 'Checkbox',
  'dropdownMenu.demo.radio': 'Radio',
  'dropdownMenu.demo.submenu': 'Submenu',
  'dropdownMenu.demo.withIcons': '包含圖示',
  'dropdownMenu.api.description': 'Dropdown menu primitives 支援的 Inputs、Outputs 與 class。',
  'dropdownMenu.api.menu.description':
    '要開啟的選單，綁定到 content 匯出的參照（#ref="sanringDropdownMenuContent"，再用 [menu]="ref.menu"）。選中任一 item 都會自動關閉選單。',
  'dropdownMenu.api.itemSelected.description':
    '被啟用的 item（點擊、按 Enter 或 Space）觸發時送出對應的 value，緊接著選單就會關閉。',
  'dropdownMenu.api.value.description':
    'item 被啟用時透過 itemSelected 送出的值。底層 ARIA menu pattern 要求必填。',
  'dropdownMenu.api.disabled.description': '停用 menu item，並移除鍵盤啟用行為。',
  'dropdownMenu.api.variant.description':
    '控制 item 語氣；移除資料或高風險操作可使用 destructive。',
  'dropdownMenu.api.class.description': '與對應 dropdown menu primitive 樣式合併的額外 class。',

} as const;
