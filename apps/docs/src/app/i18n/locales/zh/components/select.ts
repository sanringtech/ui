export const selectTranslations = {
  'select.description': '可組合的選取 primitive，用於從浮動 listbox 中選擇單一值。',
  'select.examples.basic.description':
    '透過 trigger 開啟定位選單，並在 trigger 中顯示已選項目的標籤。',
  'select.usage.description':
    '匯入 select primitives，並組合 root、trigger、value、content 與 item。',
  'select.installation.description':
    '用 CLI 加入這個元件，再使用 SANRING_SELECT_IMPORTS 一次匯入完整 select primitives。',
  'select.examples.description': '常見 select 模式，包含群組選項、分隔線與停用項目。',
  'select.demo.groups': '群組',
  'select.demo.itemAligned': '項目對齊 Trigger',
  'select.demo.disabledItem': '停用項目',
  'select.demo.customIcon': '自訂 CircleCheck 圖示',
  'select.demo.field': '搭配 Field',
  'select.demo.chooseWorkspace': '選擇一個工作區',
  'select.demo.fieldError': '請選擇一個工作區。',
  'select.examples.field.description':
    '把 sanring-select 包在 sanring-field 裡並綁定 reactive form control——控制項變成 invalid 且 touched 之後，錯誤訊息會自動顯示。',
  'select.api.description': 'select primitives 支援的 inputs、models 與 class。',
  'select.api.value.description':
    '唯讀的目前選取值 getter；值更新請透過 ngModel/formControl 綁定。',
  'select.api.id.description': '自動產生並套用到 trigger 的 id，也供 Field focus 整合使用。',
  'select.api.contentId.description': '自動產生並套用到 listbox 的 id，開啟時由 aria-controls 參照。',
  'select.api.isOpen.description': '控制浮動 listbox 是否開啟。',
  'select.api.contentPosition.description':
    "控制 content 定位模式：'popper' 對齊 trigger 邊緣，'item-aligned' 讓已選項目貼齊 trigger。",
  'select.api.matchTriggerWidth.description':
    '讓浮動 content 寬度與 trigger 實際寬度一致，避免因選項文字長度改變。',
  'select.api.itemValue.description': '此 option 被選取時回傳的值。',
  'select.api.itemDisabled.description': '停用單一 option。',
  'select.api.indicatorPosition.description': '設定選取圖示顯示在文字前方或後方。',
  'select.api.showIndicator.description': '控制是否渲染選取圖示。',
  'select.api.placeholder.description': '未選取任何值時，sanring-select-value 顯示的提示文字。',
  'select.api.customIndicator.description': '投影自訂選取圖案，以取代預設 check icon。',
  'select.api.class.description': '合併到對應 select primitive 的額外 class。',
  'select.api.triggerAriaLabel.description':
    'trigger 的無障礙名稱。trigger 的 role 是 "combobox"，跟一般按鈕不同——顯示的文字/placeholder 不會被視為名稱，需要設定這個或 triggerAriaLabelledBy。',
  'select.api.triggerAriaLabelledBy.description':
    '指向某個元素（例如外部 <label>）的 id，作為 trigger 的名稱來源，是 ariaLabel 的替代方案。',
  'select.accessibility.description':
    "trigger 按鈕有 role='combobox'、aria-haspopup='listbox'、aria-expanded 及指向 listbox id 的 aria-controls。每個選項有 role='option'、aria-selected、aria-disabled。在 <sanring-field> 內使用時，aria-required、aria-invalid 與 aria-describedby（hint/error id）會自動轉發。",
  'select.keyboard.description': '鍵盤快捷鍵同時適用於 trigger 與開啟的選單清單。',
  'select.keyboard.openTrigger': '開啟下拉清單（當 trigger 按鈕被聚焦時）。',
  'select.keyboard.navigateList': '在選項間移動焦點，跳過停用項目（循環）。',
  'select.keyboard.selectItem': '選取聚焦選項並關閉清單。',
  'select.keyboard.escape': '關閉清單而不變更選取值。',
  'select.stateModel.description':
    "CVA（ControlValueAccessor）。使用 [(ngModel)]、[formControl] 或 [formControlName] 整合 Angular Forms。value getter 反映目前選取值（唯讀，寫入必須透過表單）。將 <sanring-select> 放入 <sanring-field> 可自動綁定標籤、提示與錯誤顯示。",
} as const;
