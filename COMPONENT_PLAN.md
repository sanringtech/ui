# @sanring/ui 元件待執行清單

> 建立日期：2026-06-19 · 目標：Angular 22 元件庫，對齊 shadcn/ui 與 spartan-ng 的元件範圍
> 依賴策略圖例：**Aria** = `@angular/aria`（headless a11y primitive）｜**CDK** = `@angular/cdk`（多半為 overlay 定位）｜**None** = 純展示，不需行為庫

## 依賴決策原則（重要）

1. **Angular Aria 目前（v22）只覆蓋 8 種 pattern**：Accordion、Combobox（含 Select/Autocomplete/Multiselect）、Listbox、Menu（含 Menubar/Dropdown/Context Menu）、Tabs、Toolbar、Tree、Grid。這些優先用 Aria。
2. **Aria 不提供浮層定位**。Select / Combobox / Menu / Dropdown / Dialog / Popover / Tooltip 的「面板要顯示在哪裡」一律靠 **`@angular/cdk/overlay`**。所以這幾個是 **Aria + CDK 並用**。
3. Dialog / Alert Dialog / Sheet / Drawer / Popover / Hover Card / Tooltip 在 Aria 中**沒有** primitive → 純 **CDK**（overlay + a11y/FocusTrap）。
4. Radio Group / Slider / Switch / Checkbox / Toggle 在 Aria 中**沒有** primitive → 以原生表單控制 + ARIA 自建（標記為 None*，未來 Aria 補上再遷移）。
5. 純展示（Button / Divider / Card / Badge / Skeleton…）→ **None**。

---

## ✅ 已完成

| 元件 | 依賴 | 狀態 | 備註 |
|------|------|------|------|
| Button | **None** | ✅ 已重構為 `sanringBtn` directive（spartan 風格，套用 host class） | variant: default/secondary/outline/ghost；size: sm/md/icon/toolbar/toolbarIcon |
| Divider (Separator) | **None** | ✅ 完成 | `role="separator"`，支援 vertical / inset |
| Accordion | CDK（現況）→ **建議改 Aria** | ⚠️ 需調整，見下節 | 目前用 `CdkAccordion`，僅有展開狀態管理，無鍵盤導覽 |

---

## ⚠️ Accordion 是否需要調整？→ 建議遷移到 Angular Aria

**現況問題**：目前 `accordion.component.ts` 使用 `@angular/cdk/accordion` 的 `CdkAccordion` / `CdkAccordionItem`。CDK 的 accordion **只負責展開/收合狀態管理（multi/expanded/disabled），不提供任何 a11y 行為**——目前的 `aria-expanded`、`role`、focus 都是在 template 手動拼的，而且**缺少鍵盤導覽**（上下鍵切換 header、Home/End、focus roving 都沒有）。

**Aria 的好處**：`@angular/aria` 的 `ngAccordionGroup / ngAccordionTrigger / ngAccordionPanel / ngAccordionContent` 內建完整 WAI-ARIA accordion pattern：roles、`aria-controls`/`aria-labelledby`、方向鍵導覽、focus 管理，全部 signal-based。

**建議**：
- [ ] 將 `Accordion` / `AccordionItem` / `AccordionTrigger` / `AccordionContent` 的 hostDirective 從 `CdkAccordion*` 換成 `@angular/aria` 的 `ngAccordion*` 系列。
- [ ] 移除手動拼的 `aria-expanded` / `data-state`（改由 Aria 提供 / 讀 Aria signal），保留樣式 class 與 `triggerType` / `showDescription` 等外觀 API。
- [ ] 既有 `accordion.component.spec.ts` 與 docs 頁面對照調整。
- 備註：若短期內不想引入新依賴，CDK 版本「功能上可動」，但 a11y（尤其鍵盤）不完整；既然新元件都會走 Aria，**統一遷移可避免兩套心智模型**。

---

## 🅰️ Tier A — 優先使用 Angular Aria（必要時併 CDK overlay 定位）

| 元件 | 依賴 | Aria primitive | 備註 |
|------|------|----------------|------|
| [ ] Tabs | **Aria** | `ngTabs / ngTabList / ngTab / ngTabPanel / ngTabContent` | 純鍵盤導覽，無浮層 |
| [ ] Toggle Group | **Aria**（Toolbar）/ 或 None* | `ngToolbar` + `ngToolbarWidgetGroup` | 也可視為一組 toggle button |
| [ ] Listbox | **Aria** | `ngListbox / ngOption` | |
| [ ] Select | **Aria + CDK** | `ngCombobox + ngListbox` | 面板定位用 cdk/overlay |
| [ ] Combobox / Autocomplete | **Aria + CDK** | `ngCombobox` | overlay 定位 |
| [ ] Multiselect | **Aria + CDK** | `ngCombobox + ngListbox` | overlay 定位 |
| [ ] Dropdown Menu | **Aria + CDK** | `ngMenuTrigger / ngMenu / ngMenuItem` | overlay 定位 |
| [ ] Context Menu | **Aria + CDK** | `ngMenu` 系列 | overlay + 右鍵觸發定位 |
| [ ] Menubar | **Aria + CDK** | `ngMenu` 系列 | 取代現有 stub；overlay 定位 |
| [ ] Navigation Menu | **Aria + CDK** | `ngMenu`（部分）+ overlay | shadcn/spartan 皆有 |
| [ ] Command (⌘K palette) | **Aria + CDK** | `ngCombobox` + overlay | 含搜尋過濾 |
| [ ] Tree / File Tree | **Aria** | `ngTree / ngTreeItem / ngTreeItemGroup` | |
| [ ] Data Table / Grid | **Aria（+ CDK）** | `ngGrid` 系列；排序/虛擬捲動可加 cdk | 複雜，建議後期 |

---

## 🅱️ Tier B — 需要 `@angular/cdk`（浮層 / 行為，Aria 無 primitive）

| 元件 | 依賴 | CDK 模組 | 備註 |
|------|------|----------|------|
| [ ] Dialog (Modal) | **CDK** | `cdk/dialog` + `cdk/overlay` + `cdk/a11y`(FocusTrap) | |
| [ ] Alert Dialog | **CDK** | 同上 | Dialog 的語意變體 |
| [ ] Sheet | **CDK** | `cdk/overlay` + FocusTrap | 側邊滑出 |
| [ ] Drawer | **CDK** | `cdk/overlay` + FocusTrap | |
| [ ] Popover | **CDK** | `cdk/overlay` | |
| [ ] Hover Card | **CDK** | `cdk/overlay` | hover 觸發 |
| [ ] Tooltip | **CDK** | `cdk/overlay` + `cdk/a11y`(AriaDescriber) | |
| [ ] Toast / Sonner | **CDK** | `cdk/overlay` + `cdk/a11y`(LiveAnnouncer) | |
| [ ] Scroll Area | **CDK** | `cdk/scrolling` | 自訂捲軸 / 虛擬捲動 |
| [ ] Resizable | **CDK** | `cdk/drag-drop` | 可拖拉分割面板 |
| [ ] Carousel | **CDK** 或 None | `cdk/scrolling`（或自製） | 也可用原生 scroll-snap = None |
| [ ] Sidebar | **CDK** | `cdk/layout`(BreakpointObserver) | RWD 折疊 |
| [ ] Stepper | **CDK** | `cdk/stepper` | |
| [ ] Collapsible | **CDK** 或 None | 單一展開可用原生 details 或簡易 signal | 也可歸 None |

---

## ⬜ Tier C — 純展示，不需行為庫（None）

| 元件 | 依賴 | 備註 |
|------|------|------|
| [ ] Card | **None** | 取代現有 stub |
| [ ] Badge | **None** | |
| [ ] Alert | **None** | `role="alert"` |
| [ ] Avatar | **None** | image fallback 邏輯 |
| [ ] Aspect Ratio | **None** | |
| [ ] Skeleton | **None** | |
| [ ] Spinner | **None** | |
| [ ] Breadcrumb | **None** | `nav` + `aria-current` |
| [ ] Label | **None** | for / 表單關聯 |
| [ ] Kbd | **None** | |
| [ ] Empty (空狀態) | **None** | |
| [ ] Pagination | **None** | `nav` + `aria-current`（純連結） |
| [ ] Progress | **None** | `role="progressbar"` |
| [ ] Input | **None** | 樣式化原生 input |
| [ ] Textarea | **None** | |
| [ ] Native Select | **None** | 樣式化原生 select |
| [ ] Input Group | **None** | |
| [ ] Button Group | **None** | |
| [ ] Item | **None** | spartan/shadcn 通用列表項 |
| [ ] Typography | **None** | |

---

## 🔶 Tier D — 表單控制（目前 Aria 無 primitive，先以原生 + ARIA 自建，標記 None*）

| 元件 | 依賴 | 備註 |
|------|------|------|
| [ ] Checkbox | **None*** | 原生 input[checkbox] + ARIA；Signal Forms 整合 |
| [ ] Radio Group | **None*** | roving focus 需自實作（未來 Aria 補上可遷移） |
| [ ] Switch | **None*** | `role="switch"` |
| [ ] Toggle | **None*** | `aria-pressed` |
| [ ] Slider | **None*** | `role="slider"` + 鍵盤 |
| [ ] Input OTP | **None*** | 多格輸入 focus 管理 |
| [ ] Field / Form | **None*** | 整合 `@angular/forms` / Signal Forms 的欄位包裝 |

---

## 🔴 Tier E — 重量級 / 第三方整合（建議最後評估，可能不照搬）

| 元件 | 依賴 | 備註 |
|------|------|------|
| [ ] Calendar | **None* / CDK** | 自製日期格網 + 鍵盤導覽（可借 cdk/a11y） |
| [ ] Date Picker | **CDK + Aria/None** | Calendar + Popover(overlay) 組合 |
| [ ] Chart | **None / 第三方** | shadcn 用 Recharts；Angular 端建議包 ngx-charts 或自評估，非核心 |

---

## 建議實作順序（由易到難、依賴遞增）

1. **先補 Tier C 純展示**（Card→Badge→Alert→Avatar→Skeleton→Spinner→Breadcrumb→Label）— 零依賴，快速擴充覆蓋率。
2. **Accordion 遷移到 Aria**（驗證 Aria 引入流程、建立 Aria 範式）。
3. **Tier A 不需 overlay 者**：Tabs、Tree、Listbox、Toggle Group。
4. **建立 CDK Overlay 基礎封裝**（共用 positioning service），再做 Tooltip → Popover → Dialog（Tier B 浮層）。
5. **Tier A 需 overlay 者**：Dropdown Menu → Menubar → Select → Combobox → Command（複用步驟 4 的 overlay 封裝 + Aria menu/combobox）。
6. **Tier D 表單控制**：Checkbox→Switch→Radio Group→Slider→Toggle→Input OTP。
7. **Tier B 其餘**：Sheet/Drawer、Scroll Area、Resizable、Sidebar、Stepper。
8. **Tier E 重量級**：Calendar→Date Picker→Data Table→Chart。

## 待釐清

- [ ] 是否要把 `@angular/aria` 加入 `package.json` peerDependencies（目前只有 `@angular/cdk`）？建議引入第一個 Aria 元件時一併加入。
- [ ] 元件 API 風格採 **directive（如新 Button `sanringBtn`）** 還是 **component（如 Accordion `<sanring-accordion>`）**？目前混用，建議定義一致準則。
- [ ] Chart 是否納入範圍（非 shadcn/spartan 核心，依賴第三方繪圖庫）。
