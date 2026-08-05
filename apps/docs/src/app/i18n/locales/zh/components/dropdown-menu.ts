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
  'dropdownMenu.api.id.description': '轉發到底層 @angular/aria menu content 的 id。',
  'dropdownMenu.api.wrap.description': '鍵盤導覽抵達最後一個可用項目後，是否循環回第一個項目。',
  'dropdownMenu.api.typeaheadDelay.description':
    '@angular/aria menu typeahead 重置輸入搜尋 buffer 前等待的毫秒數。',
  'dropdownMenu.api.value.description':
    'item 被啟用時透過 itemSelected 送出的值。底層 ARIA menu pattern 要求必填。',
  'dropdownMenu.api.disabled.description': '停用 menu item，並移除鍵盤啟用行為。',
  'dropdownMenu.api.variant.description':
    '控制 item 語氣；移除資料或高風險操作可使用 destructive。',
  'dropdownMenu.api.class.description': '與對應 dropdown menu primitive 樣式合併的額外 class。',
  'dropdownMenu.accessibility.description':
    "基於 @angular/aria/menu 構建。面板有 role='menu'，每個 item 依情況有 role='menuitem'、role='menuitemcheckbox' 或 role='menuitemradio'。trigger 按鈕的 aria-haspopup='menu' 與 aria-expanded 由底層 MenuTrigger 指令管理。",
  'dropdownMenu.keyboard.description': '鍵盤導覽遵循 WAI-ARIA menu 模式。',
  'dropdownMenu.keyboard.openTrigger': '開啟選單（在 trigger 上）或啟動聚焦的項目。',
  'dropdownMenu.keyboard.navigateItems': '在選單項目間導覽（wrap 可設定）。',
  'dropdownMenu.keyboard.escape': '關閉選單或子選單，焦點返回 trigger。',
  'dropdownMenu.keyboard.openSubmenu': '開啟聚焦的子選單。',
  'dropdownMenu.keyboard.closeSubmenu': '關閉目前的子選單。',
  'dropdownMenu.stateModel.description':
    "無狀態。DropdownMenuItemDirective 啟動時送出 (itemSelected)。DropdownMenuCheckboxItemComponent 和 DropdownMenuRadioGroupComponent 透過 checked input 和 checkedChange output 自行管理選取狀態。開啟/關閉狀態由 @angular/aria/menu 內部管理。",
} as const;
