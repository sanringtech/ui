# Development Log

內部工程日誌:記錄 `TODOLIST.md` 每個項目實際怎麼做、為什麼這樣做、怎麼驗證過,以及查證後發現「其實不是缺口」的結論。寫給開發者自己(人類或未來的 Claude session)看——回答的是「當初為什麼這樣做、驗證過什麼」,顆粒度比 git commit message 粗、比 todolist 的現況/風險/成本評估更偏事後敘事。

這不是使用者看的版本紀錄,那是 [`packages/cli/CHANGELOG.md`](packages/cli/CHANGELOG.md)(changesets 自動產生,逐版本、面向消費者)。對外的方向性摘要見 [ROADMAP.md](ROADMAP.md)。三者的關係:

| 文件                        | 讀者          | 回答的問題                       | 更新頻率         |
| --------------------------- | ------------- | -------------------------------- | ---------------- |
| `TODOLIST.md`               | 開發者自己    | 接下來要做什麼、為什麼、值不值得 | 每完成一項就變動 |
| `DEVLOG.md`(這份)           | 開發者自己    | 這件事當初怎麼做的、驗證過什麼   | 每完成一項就追加 |
| `ROADMAP.md`                | 使用者/貢獻者 | 專案接下來的方向                 | 偶爾,方向改變時  |
| `packages/cli/CHANGELOG.md` | 使用者        | 這個版本對我有什麼影響           | 每次 release     |

條目依 `TODOLIST.md` 的 P 編號分組——編號代表歷史待辦清單裡的順序,不代表完成的時間序;新條目直接接在檔案最後面。

---

## P1 — registry / packages/ui / docs / public-api 一致性

- [x] 建立一致性檢查,確保每個正式元件在 `registry`、`packages/ui`、docs navigation/page、`public-api.ts` 的狀態一致
- [x] 移除殘留 `menu` registry 元件,避免和 `dropdown-menu` / `context-menu` 語意重疊

**已完成**:擴充 `packages/cli/scripts/check-registry-sync.mjs`,原本只檢查 docs↔registry 兩面,現在同時檢查四面八個方向:registry.json 內部完整性(`files` 是否真的存在)、registry.json↔`registry/components/`、registry.json↔`packages/ui` lib(這正是先前 `menu` bug 的那種落差)、`packages/ui` lib↔`public-api.ts`、docs nav id↔registry.json、docs nav id↔`packages/ui` lib、docs nav id↔docs page 檔案、docs nav id↔`app.routes.ts` 路由註冊。文件化但缺實作/路由的方向一律 fail CI;實作了但還沒文件化的方向只 warn(視為正常 WIP)。用手動模擬 drift(假 registry entry、註解掉一個 public-api export)驗證過腳本抓得到,目前 50 個正式元件在全部八個方向都一致,`pnpm lint`/腳本本身都是綠的。同步把 `.github/workflows/registry-sync-check.yml` 的 `paths` 觸發範圍擴大,涵蓋新檢查會用到的檔案,避免新檢查形同虛設。

**現況**:`menu` 曾只存在於 `registry` / README,沒有 `packages/ui` lib、沒有 docs page、也沒有 public API export。此類落差會讓 CLI 可安裝清單、文件站、套件開發 surface 彼此不同步。

**風險**:使用者可能透過 CLI 安裝到未文件化、未測試、或不是正式 library surface 的元件;反過來 docs 也可能介紹 CLI 無法安裝的元件。

---

## P2 — lint 要能乾淨通過

- [x] 修復目前 `pnpm lint` 的既有錯誤,讓 lint 成為可被 CI 信任的品質門檻

**現況**:已在 P0 CI workflow 那次一併修好(見 commit `3c516aa`)。15 個既有錯誤——docs template label association(`sanringLabel` 動態 `for` 綁定的已知 false positive,補了有註明原因的 disable comment;date-picker 兩處是真的沒關聯,補上 `id`/`for`)、`combobox` input alias(套用跟 `command-item` 一致的既有慣例)、死掉的 spec unused var——全部修好,`pnpm lint` 目前是綠的。

**風險**:主流元件庫不能長期讓 lint 紅燈;否則外部貢獻、CI、release gate 都會失去可信度,真正的新問題也容易被舊錯誤淹沒。

**回歸(2026-08-08)**:`sidebar` component(`39463f5 feat(ui/docs): 新增 sidebar component`)上車後沒同步套用既有的 lint 慣例,悄悄讓 `pnpm lint` 又紅了 6 個錯誤——`sidebar.component.ts`(`packages/ui` + `registry` 兩處)未用到的 `Signal` import、`_collapsible` alias 成 `collapsible` 沒補 disable comment;docs `sidebar-page.component.ts` 兩處 `sanringSidebarRail` 空 `<button>` 觸發 `elements-content`(host aria-label binding 的已知 false positive,跟 `sanringLabel` 那個一樣)。已在 `e7ba079 fix(ui): clear 6 pre-existing lint errors on sidebar component` 補齊,`pnpm lint` 目前重新綠燈。**提醒**:標記完成不代表一勞永逸,新元件上車時要記得比照既有慣例補 disable comment,不要指望事後才被發現。

---

## P3 — 建立 component audit matrix 並逐一盤點 lib

- [x] 建立 `COMPONENT_AUDIT.md` 或等價盤點表,列出 50 個正式 component 的品質狀態與下一步 action
- [x] 依風險分批檢查 `packages/ui` / `registry` / docs,不要用無順序的人工掃描

**盤點欄位**:每個 component 至少記錄 `registry/package/docs/public-api 一致性`、`spec 狀態`、`a11y`、`keyboard`、`API 穩定性`、`SSR/hydration 安全`、`docs 完整度`、`風險等級`、`下一步 action`。

**執行結果**:

1. ✅ 高風險互動元件(`dialog`、`alert-dialog`、`popover`、`select`、`combobox`、`command`、`dropdown-menu`、`context-menu`、`tooltip`、`sheet`)。查出 3 個 P0,**全部修完**:`select` 開啟後的 listbox 沒有方向鍵導覽(只能 Tab)——補上 `FocusKeyManager`,開啟時自動 focus 選中項、方向鍵可跳過 disabled 項並循環;`command` 完全沒有測試——補了 6 個 spec;`context-menu` 完全沒有方向鍵導覽也沒有測試——新增共用的 `focusAdjacentMenuItem()` 工具函式(接在既有的 `overlayKeydown` 訂閱上,root menu 跟 submenu 各自都能用方向鍵導覽、跳過 disabled 項、循環),補了 7 個 spec,寫 spec 過程中還抓到自己寫的一個 bug(還沒開的子選單項目雖然 CSS 隱藏但還在 DOM 裡、`tabindex="0"` 還在,會被誤判成可導覽項目)並修掉了。三個都在真實瀏覽器用 Playwright 跑過一輪驗證。`sheet` 文件範例用了原始碼裡根本不存在的 `showClose` input 這個次要問題還沒修(後續在 P5 修掉)。(原本以為 `command` 的 `aria-expanded="true"` 是寫死的 bug,後來查證發現它的清單本來就沒有收合狀態,寫死是對的,已撤回這條。)
2. ✅ form/control 元件(`input`、`field`、`checkbox`、`radio`、`switch`、`slider`、`date-picker`、`calendar`、`file-upload`、`otp-input`、`textarea`)。查出 2 個真的 bug,都在 `switch`,**都修好了**:補上 `checkedChange` output(現在可以 `[(checked)]` 雙向綁定);補上真正的 `ariaLabel`/`ariaLabelledBy` input——原本文件範例寫的 `aria-label="Toggle theme"` 掛在 `<sanring-switch>` 標籤上根本傳不到內部真正的 `role="switch"` button,修的時候發現不只文件程式碼範例錯,連即時渲染用的 demo 模板(`switch-page.component.ts`)也獨立踩了同一個坑(用 `[attr.aria-label]` 而不是走 input),兩處都修了,瀏覽器驗證過真的傳到 button 上。`checkbox`/`radio-group` 共用的 a11y 邊界案例(`aria-required` 只看原始 `required` input,沒涵蓋純用 `Validators.required` 的情況)也修好,兩邊都補了 regression spec。`date-picker`/`calendar` 零測試(鍵盤邏輯全部在外部套件 `@sanring/date-picker-core` 裡,這兩個元件本身沒有可審的鍵盤程式碼)這個沒修,還是 backlog。其餘主要是文件 API 表漏欄位,`field` 本身查起來完全乾淨。
3. ✅ display/layout 元件(`accordion`、`tabs`、`table`、`carousel`、`resizable`、`avatar`、`breadcrumb`、`card`、`alert`、`badge`、`progress`、`skeleton`、`spinner`、`tag`、`timeline`、`tree`)。查出 2 個真的 SSR bug,同一種類型,**都修好了**:`avatar` 的 `AvatarImageDirective` 原本在建構子欄位初始化直接 `new MutationObserver(...)` 並同步 `.observe()`——改成包進 `afterNextRender`;`carousel` 的 `CarouselContentComponent` 原本在 `ngAfterViewInit()` 直接呼叫 `EmblaCarousel()`(內部會 `new ResizeObserver(...)`)——同樣改成 `afterNextRender`,跟同一批 `resizable` 既有的正確寫法一致。`resizable` 的 handle 補上了 `aria-valuenow`/`min`/`max`(反映 handle 前面那個 panel 的目前尺寸與該 panel 自己的 `minSize`/`maxSize`,為此在 `ResizableGroupComponent` 加了一個 `getBeforePanel()` 方法)。`progress` 的 `ariaValueText` 補上轉發給底層 directive。`tabs` 的 `selectionMode` 補進文件(說明 `'follow'`/`'explicit'` 自動/手動啟用的差異),`orientation` 要同時設在 `<sanring-tabs>` 跟 `<sanring-tabs-list>` 這件事——原本想用 host binding 讓 `sanring-tabs-list` 自動吃父層的值、不讓消費者能個別覆寫,但 Angular 的 host binding 語法無法綁到 hostDirectives pass-through 以外的 input(NG8002 編譯錯誤),技術上做不到乾淨的自動同步,改成把「為什麼要設兩次」寫清楚進文件跟原始碼註解。`table` 的文件曾經真的引用不存在的 `<sanring-paginator>`,但等到要修的時候查證發現另一個並行工作階段已經把這個元件補齊、註冊完整、API 跟文件範例完全對得上——不需要改程式碼,已在稽核表更正這條過時的結論。所有修復都在真實瀏覽器用 Playwright 跑過一輪驗證,無 console error。

**回歸(2026-08-14,code review 於 `/audit-component progress` 已標記完成後發現)**:`progress` 的 `aria-valuenow` 直接輸出未 clamp 的 `value()`,但 `percentage()`(決定視覺寬度)有 clamp 到 `[0, 100]`。`[value]="150" [max]="100"` 這種情況下,視覺上正確顯示 100% 滿條,但 `aria-valuenow="150"` 會超出 `aria-valuemax="100"`,違反 ARIA 規範,screen reader 可能讀到不合理的數值。既有 spec 剛好就有 `[value]="150" [max]="100"` 這個 fixture,但那個測試(「clamps the percentage to 100 when value exceeds max」)只驗證了 `fill.style.width`,從沒斷言過同一個 bar 的 `aria-valuenow`——這也是為什麼這個 bug 在 P26 `/audit-component progress` 稽核(已標記完成,見 TODOLIST)時沒被抓到。修法:新增 `clampedValue` computed(同樣的 `Math.min(max, Math.max(0, value))` 邏輯),`aria-valuenow` 改綁這個而非原始 `value()`;`packages/ui`/`registry` 兩份完全同源,一次改完。補上兩個既有測試的 `aria-valuenow`/`aria-valuemax` 斷言(含 `max<=0` 的邊界情況,確認 `aria-valuenow`/`aria-valuemax` 都正確收斂成 `"0"`,不會出現 `aria-valuenow` 大於 `aria-valuemax="0"` 的情況)。

**回歸(2026-08-14,`/audit-component carousel` Tier 3 稽核時發現,高嚴重度)**:上面第 3 點修好的 `carousel` SSR bug(`EmblaCarousel()` 內部建立 `ResizeObserver`,必須包在 `afterNextRender()` 才不會在 SSR 環境拋錯),同樣只落在 `packages/ui`——`registry/components/carousel/carousel-content.component.ts` 的初始化邏輯還是原封不動放在 `ngAfterViewInit()`,從沒同步過去。`ngAfterViewInit()` 在 SSR 也會執行,結果是任何人 `sanring add carousel` 到有 SSR 的 Angular 專案,會直接在伺服器端崩潰。已完整同步 `packages/ui` 的寫法(改用 `afterNextRender()`)。跟 `select`/`switch`/`checkbox`/`radio` 同一個模式:一個已經在 `packages/ui` 修好、有明確理由記載的 bug,從沒真正同步到 `registry/`。

**回歸(2026-08-14,`/audit-component select` Tier 3 稽核時發現,高嚴重度)**:上面第 1 點修好的 `select` `FocusKeyManager` 方向鍵導覽,只落在 `packages/ui`,`registry/components/select/select-content.component.ts` 從來沒有這段邏輯——`handleOverlayKeydown` 只處理 Escape,完全沒有呼叫任何 key manager,`select-item.component.ts` 也連帶沒實作 `FocusableOption` 介面。結果:`sanring add select` 裝出來的下拉選單,開啟後方向鍵完全沒作用,只能滑鼠點擊或 Tab,直接違反 `registry.json` 自己寫的描述("A dropdown select control with keyboard navigation")。這個回歸本來會被抓到——`select.component.spec.ts` 早就有方向鍵導覽跳過 disabled、開啟時自動 focus 選中項的完整測試(就是上面第 1 點修復當時補的),但那組測試從沒對 `registry/` 的程式碼跑過。**這也解釋了 P28 階段(見上面 P14 段落)一個判斷錯誤**:當時比對 `select-item.component.ts` 的 `disabledInput`/`disabled` 命名差異,查了渲染出來的 `aria-disabled`/`data-disabled`/`tabindex` 完全一致就判定「純粹命名差異、不是 bug」——但那個命名差異其實是這個更大缺陷的表面症狀(`registry` 版本沒有 `FocusableOption` 介面,`disabled` 因此可以直接當一般 input 用,不需要 alias),沒有查到背後缺的是整個方向鍵導覽功能。已完整補齊 `select-content.component.ts`(`FocusKeyManager`/`contentChildren`/`focusInitialItem()`)與 `select-item.component.ts`(`FocusableOption` 介面/`focus()`/`getLabel()`/`disabledInput` alias),`check-registry-parity.mjs` 裡那條過時、實際上錯誤的允許清單條目一併移除。**順手發現另一個獨立的中嚴重度缺陷(`packages/ui`/`registry` 皆有,非單邊)**:選值(滑鼠點擊或鍵盤 Enter/Space)、Escape 關閉後,焦點都沒有回到 trigger——`SelectComponent.selectValue()`/`SelectContentComponent` 的 Escape 分支從未呼叫過 `.focus()`。已修正,outside-click 關閉刻意不動焦點(理由跟 `popover`/`context-menu` 的既有修法一致)。補了 3 個回歸測試(class merging、選值後 focus 回 trigger、Escape 後 focus 回 trigger)。**這是這一輪 Tier 3 稽核目前為止最嚴重的發現**:`select` 是被 `pagination` 內部真實依賴的常用表單控制項,鍵盤導覽完全失效影響面遠大於其他已修過的 UI 細節缺陷。

**風險**:如果沒有盤點矩陣,逐一檢查 lib 很容易變成「看過但沒有結論」,也會先花時間在低風險元件,延後發現真正影響 production 採用的互動/a11y/API 問題。

**後記**:`COMPONENT_AUDIT.md` 本身已在 `35114a3 chore: remove orphan projects/ dir and completed audit docs` 移除(盤點任務已完成,矩陣文件沒有繼續維護的價值)。`packages/cli/scripts/check-component-audit-sync.mjs` 這支驗證腳本沒有隨之移除,目前 CI 的 lint job 呼叫它會直接 `ENOENT` 失敗——這是待處理的獨立小 bug,不影響本項目結論。

---

## P4 — 每個 component 至少有最低 spec

- [x] 補齊無 spec 元件的最低測試:render、class merging、a11y/keyboard 核心行為

**已完成**:50 個正式 component 現在都有至少一個 package-level `.spec.ts` baseline。這次補齊 `alert`、`avatar`、`badge`、`breadcrumb`、`calendar`、`card`、`carousel`、`date-picker`、`divider`、`hover-card`、`label`、`link`、`resizable`、`spinner`、`table`;`command`、`context-menu` 也已在高風險互動元件盤點中補齊。最低 spec 覆蓋 render、class merging、重要 aria/security attribute、以及互動元件的核心 keyboard/open/selection 行為。

**風險**:headless component library 的信任感很大一部分來自互動與 a11y 穩定性。沒有最低 spec 時,重構 styling、ARIA、keyboard 行為都容易出現隱性退化。

---

## P5 — docs 要成為採用入口

- [x] 補齊每個 component docs 的採用資訊:usage、installation、API、accessibility notes、keyboard behavior、controlled/uncontrolled 或 state 說明

**現況**:docs page 覆蓋度已不錯,但主流採用入口需要更穩定的資訊架構。`menu` 缺頁問題已改以移除 `menu` 解決;後續重點是讓保留下來的正式元件文件完整、可預期。

**已完成**:第一批:`sheet` 文件移除不存在的 `showClose` API 與會編譯失敗的 `[showClose]="false"` 範例,改成自訂 `sanringSheetClose` close control 範例;`calendar` API 表補上 `id`、`required`、`ariaDescribedBy`、`jumpMonthLabel`、`jumpYearLabel`、`focus()`;`date-picker` API 表補上 `id`、`required`、`ariaDescribedBy`、`focus()`。第二批:`otp-input` API 表補上 `name`、`autocomplete`、`required`、`ariaLabel`、`ariaLabelledBy`、`ariaDescribedBy`、`pasted`、`slotKeydown`;`slider` 補 `tabIndex`;`radio` 補 `RadioGroupComponent.id`;`dropdown-menu` 補 `id`、`wrap`、`typeaheadDelay`;`select` 補 `id`、`contentId`、`placeholder`,並把 `value` 說明改清楚為唯讀 getter、值更新應走 Angular Forms。

**完成標準**:每個正式 component docs 至少具備:usage/imports、installation、API table、accessibility notes、keyboard behavior、state model(controlled/uncontrolled、CVA、model/input/output 或 service-driven 狀態)。

**執行順序**:

- [x] 建立 docs completeness checklist/matrix,逐頁標記 usage、installation、API、accessibility、keyboard、state model 是否完成
- [x] 先補高互動元件的 adoption notes:`dialog`、`alert-dialog`、`popover`、`select`、`combobox`、`command`、`dropdown-menu`、`context-menu`、`tooltip`、`sheet`
- [x] 再補表單元件的 field/CVA/state 說明:`input`、`field`、`checkbox`、`radio`、`switch`、`slider`、`date-picker`、`calendar`、`file-upload`、`otp-input`、`textarea`
- [x] 最後補 display/layout 元件的 accessibility semantics 與 keyboard note:`accordion`、`tabs`、`table`、`carousel`、`resizable`、`avatar`、`breadcrumb`、`card`、`alert`、`badge`、`progress`、`skeleton`、`spinner`、`tag`、`timeline`、`tree`

**風險**:即使元件可用,若文件缺少 a11y、keyboard、state model 與 API 說明,使用者會很難判斷它是否適合 production。

---

## P6 — package-only 使用者的 theme token 入口(已評估,暫不執行)

- [x] 評估是否要讓 package-only(不透過 CLI)使用者取得 theme CSS

**原始現況(2026-08 前)**:`registry/shared/theme.css` 已經提供完整 `--sanring-*` CSS custom properties,`registry/registry.json` 也已把 `theme` 宣告為 shared dependency;`sanring init` 會產生 `src/sanring-theme.css`,docs theming page 也有說明。但如果使用者只從 npm 安裝 `@sanring/ui`,目前不夠直覺地知道 `bg-[var(--sanring-border)]`、`text-[var(--sanring-foreground)]` 等 token 要從哪裡設定。

**查證後發現前提不成立**:`@sanring/ui` 目前**沒有被發布到 npm**,而且是刻意設計成這樣——`packages/ui/package.json` 是 `private: true`、`.changeset/config.json` 把 `@sanring/ui` 明確排除在版本管理外、`release.yml` 只在 `packages/cli/**`/`registry/**` 變動時觸發,`release` script 也只 build/publish `@sanring/cli`。唯一真實存在的發布管道是 CLI 把 `registry/` 的原始碼複製進使用者專案(shadcn 那套模式),「只從 npm 安裝 @sanring/ui」這個使用情境目前不存在,原始「現況」段的假設不成立。

**結論**:不執行,維持 CLI-only 發布模式。要讓這個情境成立,前提是先決定要不要把 `@sanring/ui` 也發布成傳統 npm 依賴套件——那是一個獨立、更大的策略決定(牽涉 semver 版本紀律、使用者失去「程式碼歸你、可以隨便改」的 CLI 模式優勢、兩條發布管道共存的複雜度),不是「補一個 CSS export」這麼小的事。若之後真的要發 npm 套件,「要不要發 npm 套件」本身應該先開一個新的 todolist 項目評估,這條再接在後面做。

**技術備查(留給未來參考)**:實測過 ng-packagr 的 `assets` 設定會拒絕讀取 project root 以外的檔案(不能直接指到 `../../registry/shared/theme.css`),且它會自己產生/覆寫 `package.json` 的 `exports` 欄位(預設只有 `.` 跟 `./package.json`)。這條路技術上可行,但要嘛把 theme.css 複製一份進 `packages/ui/` 自己顧跟 `registry/shared/theme.css` 同步,要嘛接受兩份 source of truth。

---

## P7 — docs 站沒有搜尋功能

- [x] 幫 docs 站加上搜尋(至少支援元件名稱/描述搜尋,理想上做成 Cmd+K 面板)

**現況(更新)**:查證後發現 `apps/docs/src/app/shell/header/feature-list.component.ts` 其實已經有完整的 Cmd+K 搜尋面板(快捷鍵、fuzzy match、鍵盤導覽都做了),原本的「找不到任何搜尋元件」現況查證是舊的、不準。真正的落差只有:搜尋索引只比對翻譯過的元件名稱(`labelKey`),沒有比對描述文字,跟「至少支援名稱/描述搜尋」的要求還差一步。

**已完成**:`docsComponentItems`(`apps/docs/src/app/navigation/docs-navigation.ts`)每筆補上 `descriptionKey`(對應各元件 `.docs.ts` 裡本來就有的 `page.descriptionKey`,型別化、雙語言都不用另外維護);`feature-list.component.ts` 的 `searchIndex`/`filteredItems` 改成先比對名稱、名稱沒中才退而求其次比對描述(用固定偏移量讓名稱命中永遠排前面);結果項目改成兩行式,名稱下面帶一行描述摘要。已用 Playwright 手動驗證:搜尋不在名稱裡的描述字串(如 "vertically stacked")能正確命中 Accordion 並正常導頁。

---

## P8 — 沒有 MCP server 整合

- [x] 實作 `@sanring/cli` MCP server 支援,讓 Claude Code / Cursor 等 AI agent 能直接查詢、安裝元件

**已完成**:新增 `packages/cli/src/commands/mcp.ts`,加入 `@modelcontextprotocol/sdk@1.30.0` 依賴,以 lower-level `Server` API(NodeNext ESM 相容、不額外依賴 zod)實作五個 tool:`list_components`(列出全部元件)、`search_components`(名稱優先搜尋)、`get_component_info`(含 files、自動安裝的 componentDeps、shared utilities、peerDeps)、`plan_component_install`(dry-run 預覽會寫入哪些檔案/componentDeps/peerDeps,不動專案)、`add_component`(`cwd` 參數指定 Angular project root,子程序執行 `sanring add --yes`)。所有 tool handler 都有 runtime input validation(`requireStrings`),找不到元件時統一回傳 `isError: true`。`sanring mcp` command 透過 stdio transport 啟動,`serverInfo.version` 正確讀取 CLI 版本。已補 `packages/cli/src/commands/mcp.test.ts`(`Client` + `InMemoryTransport`,覆蓋 tools/list、search、detail、plan、not-found isError、add tool boundary)與 `packages/cli/src/commands/mcp.e2e.test.ts`(`StdioClientTransport` 真實 spawn 編譯後的 CLI,驗證 cliBin 路徑解析與 `--registry` 傳遞);README 也補上 Claude Code / local development 設定方式與五個 tool 的說明表格。get_component_info 找不到元件時原本沒回傳 `isError: true`,跟 `plan_component_install` 同樣情境不一致,依賴 `isError` 判斷失敗的 AI agent 會誤判為成功呼叫,後續已補上並加測試保護。

**使用方式**:在 `.claude/mcp.json` 或 Claude Code 設定中加入:

```json
{
  "mcpServers": {
    "sanring": {
      "command": "npx",
      "args": ["@sanring/cli@latest", "mcp"]
    }
  }
}
```

**對比**:shadcn 這一兩年加了 MCP 整合,AI coding agent 可以透過 MCP protocol 直接跟 registry 互動,不用手動下 shell 指令。跟目前透過 Claude Code 使用這個專案的情境直接相關。

---

## P10 — `sanring init` 沒有 monorepo/workspace 偵測

- [x] 評估 `init` 指令加上 monorepo 結構偵測與對應處理邏輯

**已完成**:在 `utils.ts` 新增三個函式:`detectMonorepoRoot()`(偵測單一目錄是否為 monorepo root,辨識 pnpm-workspace.yaml / lerna.json / turbo.json / nx.json(無 angular.json 時) / package.json workspaces)、`findMonorepoAncestor()`(從 startDir 往上走直到找到 monorepo root 或碰到 filesystem root)、`findAngularProjectsInWorkspace()`(在 workspace root 下搜尋最多 2 層深的 angular.json,跳過 node_modules/.git/dist 等目錄)。`init.ts` 移除 `requireAngularProject()` 硬停,改成:若 cwd 無 angular.json → 往上找 monorepo root → 搜尋 workspace 內的 Angular 專案 → 找到一個自動選取、找到多個列出讓使用者互動選取(--yes 模式直接 fail 並印出 cd 指令)。所有後續操作改用 `projectRoot`(可能不同於 cwd)。補 5 個 init monorepo 整合測試,目前 92 tests 全過。

**現況**:`sanring init` 已不再假設 cwd 必須就是單一 Angular 專案 root。從 workspace root 或 workspace 子目錄執行時,會先辨識 monorepo root,再把設定檔、theme CSS、dependency install、global stylesheet import 寫到實際 Angular project root。已覆蓋單一 project 自動選取、多 project + `--yes` fail、workspace 內無 Angular project、非 Angular/非 monorepo 目錄、以及兩層深 Angular project 等情境。

**限制**:目前只搜尋 workspace root 往下最多 2 層深的 `angular.json`,這符合常見 `apps/web`、`packages/admin`、`apps/feature/web` 結構,但不涵蓋更深或非標準 layout。`nx.json` 只有在同目錄沒有 `angular.json` 時才視為 monorepo 訊號,避免把單一 Nx Angular 專案誤判成 workspace root。

---

## P12 — Masked Input 是否需要獨立套件(比照 date-picker-core)

- [x] 評估 Masked Input(roadmap tier2 規劃中)的遮罩引擎是否要比照 `@sanring/date-picker-core` 拆成獨立套件

**封存**:評估完成,無後續 action。結論:Masked Input 目前規劃只疊加在單一 `Input` directive 上,沒有第二個消費者;拆分的關鍵理由(同一引擎被多個元件共用)尚不成立。待 Masked Input 正式實作後出現第二個消費者,再重新評估是否拆成獨立套件。實作時遮罩演算法應寫成 `packages/ui` 內零 Angular 依賴的純函式模組,可獨立單元測試,不用背獨立 repo/版本協調的重量。

---

## P13 — CLI 指令間有重複邏輯,可收斂共用

- [x] 抽出 `requireAngularProject(cwd, hint?)` 共用檢查,取代 `add`/`init`/`update`/`remove`/`diff`/`list.ts` 各自重複的 `angular.json` 守衛區塊
- [x] `DEFAULT_PATH`/`DEFAULT_COMPONENT_PATH` 原本在 9 個檔案各自宣告,統一成 `utils.ts` 的 `DEFAULT_COMPONENT_PATH` export
- [x] 抽出 `resolveComponentPath(optionsPath, config)` / `resolveComponentBasePath(cwd, optionsPath, config)`,取代散落各檔案的 `options.path ?? config?.componentPath ?? DEFAULT_PATH` 解析邏輯
- [x] 抽出共用的 `confirmPrompt({ yes, question, nonTtyRefusal? })`,取代 `add.ts` 的 `confirmOverwrite`、`update.ts` 的 `confirmFile`、`remove.ts` 的 `confirmRemoval` 三份幾乎相同的 readline y/N 邏輯

**已完成**:四項都已抽進 `packages/cli/src/utils.ts`,`add`/`init`/`update`/`remove`/`diff`/`doctor`/`info`/`search`/`list.ts` 全部改用共用函式。`confirmPrompt` 用 `nonTtyRefusal` 參數保留了 `add.ts`/`remove.ts` 在非 TTY 時印出的額外錯誤訊息、`update.ts` 保持原本的靜默 skip 行為。`resolveComponentPath`/`resolveComponentBasePath` 拆成兩個函式,因為 `add.ts`/`update.ts` 除了要算 base path,還需要保留未解析的相對路徑寫回 `sanring.config.json`。改完 `tsc --noEmit`、`eslint`、`vitest`(87 tests)全過,另外手動建置後跑過 `add --force`(重複安裝觸發 overwrite 確認)、`remove`、`update`(本地已修改檔案觸發 conflict skip)、`init`、`list --installed` 在非 Angular 專案/非 TTY 情境下的訊息,逐字比對跟重構前一致。

**現況(重構前)**:2026-08-06 程式碼審查發現,`packages/cli/src` 的 9 個 command 檔案(`add`/`init`/`update`/`remove`/`diff`/`doctor`/`info`/`search`/`list.ts`)彼此有多處幾乎逐字重複的邏輯,當時都沒有收斂進 `utils.ts`。

**風險**:低,是行為不變的重構,但散落的邏輯會讓未來改動(例如自訂 registry namespace 支援要動到每個 command)成本變高——先收斂能讓那類改動的 diff 小很多。

---

## P14 — UI lib 效能與重複邏輯優化

- [x] 約 4 成元件(實測 162 個 `@Component` 檔案中有 69 個)未明確設定 `ChangeDetectionStrategy.OnPush`,包含 `select`、`switch`、`combobox`、`command`、`tabs`、`tree`、`tooltip`、`dropdown-menu` 等已經是 signals-based 寫法的元件,等於沒拿到 OnPush 的效能紅利
- [x] `navigation-menu-sub-content`/`context-menu-sub-content`/`context-menu-content` 三個元件各自手刻幾乎相同的 CDK Overlay 生命週期邏輯(建立/attach/detach `OverlayRef`、`outsidePointerEvents`/`keydownEvents` 訂閱、destroy 清理),約 50–60 行重複 3 次
- [x] `resizable/resizable.utils.ts:75` 的 `Array.from(groupElement.children) as HTMLElement[]` 是沒有 runtime guard 的型別斷言(`children` 是 `HTMLCollection`,假設全部是 `HTMLElement`,一般成立但沒檢查)
- [x] 9 個表單元件(`checkbox`/`switch`/`radio-group`/`slider`/`otp-input`/`date-picker`/`calendar`/`file-upload`/`combobox`)各自重複一份幾乎逐字相同的 `XxxFieldControlAdapter` + CVA state-bridge 邏輯(約 500–600 行複製貼上)

**現況**:2026-08-06 code review(人工抽查 12–15 個代表性元件 + `shared/` 全目錄,並用 grep 驗證 OnPush 覆蓋率數字)發現的落差。已確認乾淨、不用動的部分:`components/` 裡沒有 `any`、沒有殘留的舊式 `@Input()`/`@Output()` decorator(全部是 signal-based)、`cn()`/`uniqueId()` 已統一在 `utils.ts`、所有 `.subscribe()` 都有正確清理(`takeUntilDestroyed` 或隨 `overlayRef.dispose()` complete)、`package.json` 依賴合理無大材小用。

**已完成(第一批)**:OnPush 清理:全部 162 個 `@Component` 現在都設了 `ChangeDetectionStrategy.OnPush`(packages/ui + registry 雙向同步),同時修正 registry `context-menu-content`/`context-menu-sub-content` 之前缺漏的方向鍵導覽(`ArrowDown`/`ArrowUp` → `focusAdjacentMenuItem`)與 `menu-navigation` sharedDep。Overlay 生命週期抽共用 class:新增 `packages/ui/src/lib/components/shared/menu-overlay-controller.ts`(`MenuOverlayController`)與對應的 `registry/shared/menu-overlay-controller.ts`。三個 content 元件(`context-menu-content`、`context-menu-sub-content`、`navigation-menu-sub-content`)各自從 ~50 行手刻邏輯改為直接用 `MenuOverlayController`,兩種 origin 型別(`{x,y}` 座標 vs `ElementRef`)均支援;registry.json 新增 `menu-overlay-controller` shared 條目並更新 context-menu/navigation-menu 的 `sharedDeps`。`resizable.utils.ts` 型別斷言改成 `.filter((el): el is HTMLElement => el instanceof HTMLElement)`,移除 unsafe cast。

**已完成(第二批,2026-08-11)**:CVA adapter 重複邏輯收斂。建立 `registry/shared/cva-base.ts`,包含：
- `SanringCvaBase<T>`：抽象基底類別，集中所有 CVA 共用狀態(`focused`、`ngControl`、`disabledState`、`stateChanges`、`onChange`/`onTouched`)、生命週期(`ngOnInit` 裡延後 self-inject `NgControl` 避免 NG0200 循環依賴)、`errorState`/`fieldRequired` getter（用 `_stateVersion` signal 把非 signal 的 `ngControl.invalid/touched` 橋接進 signal graph）、`makeComputedAriaDescribedBy(signal?)` 合併外部 `ariaDescribedBy` input 與 `Field` 注入 ID、`onFocus()`/`onBlur()` 標準實作。
- `SanringFieldControlAdapter<T>`：泛型轉接器，接受 `SanringCvaHost<T>` 介面實作 `SanringFieldControl<T>`,取代 9 個 per-component `XxxFieldControlAdapter` 類別。

9 個元件全數改為 `extends SanringCvaBase<T>`,移除各自的共用 boilerplate（約 1,200 行）。三個設計變異點：(1) 有 `required` input 的 7 個元件覆寫 `protected hasInputRequired()` hook；(2) 沒有 `ariaDescribedBy` input 的 `switch`/`combobox` 呼叫 `makeComputedAriaDescribedBy()` 無參數版；(3) `file-upload` 的 `errorState` 額外計入 `rejectedFiles`，覆寫 base getter（因此 `_stateVersion` 設為 `protected`）；`combobox` 用 `inputId`（plain string）作 field id，保留自己的 slim adapter。`registry.json` 新增 `cva-base` shared 條目，9 個元件的 `sharedDeps` 補入 `cva-base`。golden fixture 53 元件全量 test 通過。

**回歸(2026-08-13,`/audit-component switch` Tier 2 稽核時發現)**:第二批重構只實際套用在 `registry/`,`packages/ui` 的 9 個元件從未跟進改成 `extends SanringCvaBase`,兩邊架構自此分岔而沒人注意到。更嚴重的是,`registry/components/switch/switch.component.ts` 重寫成 `SanringCvaBase` 版本時,把先前(見上方 P11 `input`/`field` 段落)已經修好並記錄在案的兩個真實 bug ——`ariaLabel`/`ariaLabelledBy` input、`checkedChange` output——整個漏掉了,導致 `sanring add switch` 裝出來的版本重新出現同一個無障礙缺陷。已比照同一批重構的 `checkbox` 補回 input/output 宣告、template binding、`toggle()` 內的 emit。逐一比對其餘 8 個元件(`checkbox`/`radio`/`slider`/`otp-input`/`file-upload`/`combobox`/`calendar`/`date-picker`)的 `packages/ui` vs `registry` input/output 清單,只有 `switch` 受影響,不是系統性問題。**提醒**:往後任何「只改 registry 不改 packages/ui」（或反過來）的重構,完成後都要跑一次雙邊 input/output/behavior diff,不能只靠 golden fixture(那個只驗證檔案結構跟 registry.json 對得上,不驗證兩邊程式碼內容一致)。

**第二筆(2026-08-13,`/audit-component checkbox` 時發現)**:同一批重構在 `checkbox` 上留下另一個更隱蔽的 drift——`aria-required` 的 template binding 從 `fieldRequired`(同時看 `required` input 與 `Validators.required`)改成直接綁純 `required()` input,漏掉 validator 偵測。影響:`[formControl]` 綁一個帶 `Validators.required` 但沒明講 `[required]` 的 control 時,`sanring add checkbox` 裝出來的版本不會在真正的互動元素上出現 `aria-required="true"`(`sanring-field` 的星號指示器走 adapter 沒受影響,只有元件自己的 native 屬性壞掉)。已修正。**這個 bug 本來會被抓到**——`packages/ui/checkbox.field.spec.ts` 早就有一個專門測「required 只靠 Validators.required 也要出現 aria-required」的 regression test,只是那個 spec 只對 `packages/ui` 跑,從沒驗證過 `registry/` 的程式碼行為,所以完全沒發揮作用。逐一核對其餘元件(`radio`/`slider`/`otp-input`/`file-upload`/`combobox`/`switch`)的 `aria-required` 綁法在兩邊一致;`calendar`/`date-picker` 兩邊都用 `required()` 直接綁,是既有設計不是 drift。

**第三筆(2026-08-13,`/audit-component radio` 時發現)**:`radio-group` 也中招,同一個模式——`registry/components/radio/radio-group.component.ts` 的 `aria-required` 綁 `required() || null`,漏掉 `fieldRequired` 的 `Validators.required` 偵測。已修正。跟前兩筆一樣,`packages/ui/radio-group.field.spec.ts` 早就有對應的 regression test(「required 只靠 `Validators.required`,沒有明講 `[required]`,`aria-required` 也要出現」),一樣因為 spec 只跑 `packages/ui`、從沒驗證過 `registry/` 而完全沒發揮作用。三個元件(`switch`/`checkbox`/`radio`)接連中同一個模式,已經不是單一元件的偶發問題——這批 P14 重構在把 template binding 從 `fieldRequired`/`ariaLabel` 等 getter 手動搬到新架構時,顯然是系統性地弄丟了一部分邏輯,而現有的驗證機制(golden fixture 只驗結構、spec 只跑 packages/ui)兩層都沒接住。

**根因修復(2026-08-13)**:先試過讓 `packages/ui` 既有 spec 直接 TestBed 實例化 `registry/` 的元件(相對路徑 import,不透過 `@sanring/ui`),失敗——`registry/components/switch/switch.component.ts` 的 `extends SanringCvaBase` 在這種跨 project import 下型別解析不出來(`Property 'onChange' does not exist`、`does not extend another class` 這類錯誤),Angular 的 `@angular/build:unit-test` builder 綁定單一 project 的 `tsconfig.spec.json`/rootDir,不支援這樣跨目錄编譯;要真的做,得另外開一個指向 `registry/` 的 Angular project + tsconfig,成本明顯更高。改用靜態比對:新增 `packages/cli/scripts/check-registry-parity.mjs`,對每個 `packages/ui`/`registry` 都有的同名元件檔案,比對 (1) `input()`/`output()`/`model()` 宣告的屬性名稱集合,(2) a11y 相關 attribute binding(`aria-*`/`role`/`disabled`/`tabindex`/`id`)綁定的表達式字串(去除註解與引號/空白差異後逐字比對)。已掛進 `.github/workflows/registry-sync-check.yml`,跟 `check-registry-sync.mjs` 同一個 workflow、同樣的觸發路徑。

跑起來後,除了前三筆已經修過的 `switch`/`checkbox`/`radio-group`,又抓到四筆獨立、跟 P14 重構無關的既有 drift,全部修正:
1. `button/button.directive.ts`——這次 session 稍早 `/audit-component button` 時把 `role="button"` 的修復從舊分支 cherry-pick 到 `packages/ui`,但漏了同步到 `registry/`(當時該修復本來就只碰 `packages/ui`,沒意識到 `registry/` 是獨立副本需要另外補)。順便發現 `registry/` 的 `rounded-lg` 與硬編碼 destructive 色碼(`#dc2626`/`#b91c1c`/`#ef4444`)兩個更早、與本次 session 無關的 design token 漂移(`packages/ui` 已是 `rounded-[var(--sanring-radius)]` 與 `--sanring-error-*` token),一併補齊。
2. `context-menu/context-menu-sub-trigger.component.ts`——`registry/` 版本漏了 `aria-disabled`,只有 `data-disabled`(CSS 用)和 `tabindex="-1"`(鍵盤跳過),螢幕報讀者收不到 disabled 狀態。已補。
3. `resizable/resizable-handle.component.ts` + `resizable-group.component.ts`——`registry/` 整組缺少 `aria-valuenow`/`aria-valuemin`/`aria-valuemax`(window-splitter 鍵盤語意)以及支撐它的 `RadioGroupComponent.getBeforePanel()`,不是單一屬性漏掉,是整段邏輯完全沒同步過去。已補齊。

`select-item.component.ts`(`disabledInput`/`disabled` 命名不同,兩邊功能驗證完全等價,是 `packages/ui` 用 `input({ alias: 'disabled' })` 避免跟 adapter getter 撞名)與 `file-upload.component.ts`(`registry` 的 `id` 是 `input()`、`packages/ui` 是純字串,消費者無法在 npm 套件版覆寫 id)兩筆記進腳本的允許清單,前者純粹是命名差異不是 bug,後者是真的、但範圍屬於 `file-upload` 自己的 Tier 3 稽核(改 `packages/ui` 的 `id` 型別是 public API 變動,留給正式稽核處理,見 TODOLIST)。**這個腳本目前是純靜態比對,不執行程式碼**——能抓到「欄位被刪掉」和「binding 表達式被換成弱化版本」這兩類已經發生過的具體錯誤模式,但抓不到更深的行為邏輯錯誤(那需要真的執行,即上面試過失敗的路線)。剩餘的「`packages/ui` 補做 P14 CVA 遷移」工作見 TODOLIST P28,優先度降低——兩邊行為現在有腳本守著,不會再無聲漂移。

**Code review 補漏(2026-08-14)**:上面的 parity script 與零星修復被拿去做了一次 code review,揪出三點:
1. **腳本本身有盲區(Medium)**:`extractInputOutputNames` 的正則只匹配 `input(`/`input<`/`model(`/`model<`,漏了 `input.required<T>()`/`model.required<T>()` 這兩種常見寫法(`.required` 後面接的是 `<`,但前面隔了一個 `.`,原正則抓不到)。全 repo 掃出 42 處用到 `.required()`,理論上這個範圍內任何一個被刪掉都不會被腳本抓到。已修正正則為 `(?:input|output|model)(?:\.required)?[<(]`,補完後重跑腳本仍是綠燈(現有 42 處都沒有實際 drift,純粹是補防線)。
2. **`accordion/accordion-trigger.component.ts` 有獨立的 design token 漂移(Low/Medium)**:`registry/` 還是硬編碼 `rounded-md`,`packages/ui` 已經是 `rounded-[var(--sanring-radius-sm)]`——跟 `toggle`/`card`/`alert`/`button` 同一種、但這個 parity script 的檢查範圍本來就不含任意 Tailwind class 字串,抓不到。已直接修正。`accordion` 本身還沒排到正式 `/audit-component` Tier 2 稽核,這筆只是順手處理,不代表 accordion 已經稽核完畢。
3. **`table/column-def.directive.ts` 有真實的動態 input 邊界案例(Low)**:`registry.ts` 的 `widthPercentFor()` 分母是所有已註冊 ratio 的總和,但 `TableColumnDefDirective` 的 constructor `effect()` 只在「有 ratio 且沒 width」時呼叫 `registerColumnRatio()`,條件不成立時什麼都不做——只有整個 directive 被銷毀(`ngOnDestroy`)才會 `unregisterColumnRatio()`。代表如果某欄位執行期把 `ratio` 動態改成 `undefined`,或原本沒設 `width` 後來動態補上,舊的 ratio 值會一直留在分母裡,永久拉低其他 ratio 欄位算出來的百分比,直到那個欄位真的從 DOM 移除為止。修法:改成 `else` 分支呼叫 `unregisterColumnRatio()`,並把 `ratio()`/`width()` 兩個 signal 都移到 `if` 判斷式外先讀取,確保 effect 的依賴追蹤在任何分支都完整(避免只在 `ratio != null` 才讀 `width()` 導致 `ratio` 為 null 時漏追蹤 `width` 變化,雖然那個特定路徑沒有 unregister 需求所以現況不算 bug,但一起修比較乾淨)。`packages/ui`/`registry` 兩份完全同源(diff 為零,含 import path),一次改完。補了兩個 regression test(`table.component.spec.ts`)驗證 ratio 清空、width 動態補上時分母都會正確調整。`table` 本身也還沒排到正式稽核,這筆同樣是順手處理。

三筆結論:兩筆(parity script 正則、table stale state)是可驗證、可重現的真實缺陷,已修正;`accordion` 那筆是已知模式的重複實例,修正方式與既有先例一致。都在合理範圍內,不是誤判。

---

## P15 — 版本兼容追蹤與 `sanring migrate` 指令

- [x] `SanringConfig` 加入 `installedVersions?: Record<string, string>`,記錄每個元件最後一次安裝/更新時的 CLI 版本
- [x] `sanring add` 與 `sanring update` 在成功寫入後同步更新 `installedVersions`
- [x] `registry.json` 的 `RegistryComponent` 加入 `since?: string` 與 `migrations?: RegistryMigration[]`,供 registry 作者標記 breaking changes
- [x] 新增 `semverLte(a, b)` 工具函式與 `getCliVersion()`(runtime 讀取 package.json)
- [x] 實作 `sanring migrate [components...] [--check]` 指令:對比 installedVersion 與 registry migrations 的 fromVersion,印出需要手動處理的步驟;`--check` 在有 migration 時 exit 1(CI gate 用)
- [x] `ComponentChange` 加入 `breaking?: boolean`;docs changelog 模板對標記 breaking 的 change 顯示紅色 BREAKING badge

**現況(修復前)**:整個開發過程中沒有顧及版本向後相容問題。使用者從舊版 CLI 安裝元件後,若 registry 有 breaking change,`sanring update` 只會同步檔案、不會提示需要手動修改模板或呼叫方式。

**設計**:`sanring.config.json` 的 `installedVersions` 以元件名稱為 key、CLI 版本為 value。`registry.json` 每個元件可以有多個 `RegistryMigration`,每筆包含 `fromVersion`(安裝在這個版本以前的使用者需要執行這份遷移)、`breaking: boolean`、`steps: string[]`。`sanring migrate` 過濾出 `semverLte(installedVersion, migration.fromVersion)` 的遷移項目,依序印出步驟;缺少 `installedVersions` 的舊 config 降級為 `"0.0.0"`。

---

## P16 — Docs 站沒有暗色模式切換

- [x] 在 docs header 加入 light / dark / system 三段切換,並讓全站 CSS variables 隨之切換

**現況**:`packages/ui` 的元件本身已經用 `--sanring-*` CSS custom properties,支援 dark mode;但 docs 站本身沒有提供切換按鈕,使用者只能依賴系統設定。

**影響**:開發者打開元件庫 docs 第一件事通常是切 dark mode 看元件效果,沒有切換按鈕會讓人對「這個 lib 有沒有認真維護 dark mode」產生懷疑,屬於第一印象層面的信任訊號。

---

## P17 — Component 頁面沒有顯示該元件自己的 changelog

- [x] 每個 component 頁面底部加一個「Recent changes」區塊,從 `componentChangelog` 過濾出 `componentIds` 包含該元件的最新 N 筆

**現況**:`component-changelog.ts` 裡每筆 change 都有 `componentIds?: DocsComponentId[]`,這份資料已經在用(驅動 sidebar 的「Updated」badge),但 component 頁面本身完全沒有顯示。

**影響**:使用者升版時想知道「這個元件到底改了什麼」,現在要去全局 changelog 自己找;shadcn 每個元件頁頂部有 "Updated X days ago" 連結。

---

## P18 — `sanring list --outdated`:安裝元件的更新狀態概覽

- [x] 新增 `sanring list --outdated`(或獨立指令 `sanring outdated`),快速顯示哪些已安裝元件的本地檔案和 registry 目前版本不同

**現況**:`diff` 指令可以逐檔比較,`update` 會實際套用,`migrate` 處理 breaking changes。但沒有一個指令能像 `npm outdated` 那樣一眼看出「我裝了哪些元件、哪些有更新、哪些是乾淨的」。

**已完成**:在 `list.ts` 加 `--outdated` flag,重用 `update.ts` 的檔案分類邏輯,只差最後不寫檔案改為彙整輸出(up-to-date / outdated / has-conflicts)。

---

## P21 — `ng add @sanring/cli` Schematics 支援

- [x] 實作 Angular Schematics,讓 `ng add @sanring/cli` 等同於跑完 `sanring init` 的全部步驟

**已完成**:新增 `packages/cli/schematics/`(`collection.json` 註冊單一 `ng-add` schematic、`ng-add/index.ts`、`ng-add/schema.json`)。`ng-add` 的 Rule 不重新實作 `init.ts` 的互動流程,而是照原本規劃「spawn `sanring init`」——用 `node:child_process` 的 `spawnSync` 呼叫已編譯好的 `dist/index.js init`,把 schema 選項(`path`/`skipConfirmation`/`force`/`registry`)轉成對應 CLI flags,`stdio: 'inherit'` 讓原本的互動式 prompt 照常運作。取捨:因為是直接寫檔案而非透過 schematics 的 `Tree` 抽象,`ng add --dry-run` 不會預覽它的檔案異動,已在程式碼註解與 README 標明。

`packages/cli/src` 是 `"type": "module"`(NodeNext),但 Angular schematics engine 用 CommonJS `require()` 載入 collection,所以 schematics 需要獨立編譯管線:新增 `tsconfig.schematics.json`(`module: CommonJS`)把 `schematics/**/*.ts` 編譯到 `dist/schematics/`,並在該目錄放一份 `package.json`(`{"type": "commonjs"}`)蓋掉外層的 `"type": "module"`;非 `.ts` 資產(`collection.json`、`schema.json`、這份 `package.json`)由新增的 `scripts/copy-schematics-assets.mjs` 複製過去。`package.json` 的 `build` script 串接這兩段編譯 + assets copy;新增 `"schematics": "./dist/schematics/collection.json"` 與 `"ng-add": { "save": "devDependencies" }` 欄位。`ng-add/index.ts` 對 `@angular-devkit/schematics` 只用 `import type`(`Rule`/`SchematicContext`/`Tree`),編譯後完全不留 runtime `require`,所以只需要 devDependency,不用背 runtime 依賴或煩惱跟使用者專案的 Angular 版本對齊。

測試:`schematics/ng-add/index.test.ts` 直接匯入原始 `.ts`(vitest 的 vite-node 對 ESM 原始檔仍提供 `__dirname`,不需要先 build 就能測),mock `node:child_process` 驗證 options → CLI flags 的轉換、失敗時的 exit code 處理、以及 context logger 有被呼叫;`schematics/collection.test.ts` 驗證 `collection.json` 的 factory/schema 路徑實際存在,防止路徑打字錯誤。CI `typecheck` job 補上獨立一步 `tsc -p tsconfig.schematics.json --noEmit`(schematics 用的是另一份 tsconfig,不會被既有的 `tsc --noEmit` 覆蓋到)。README 補上 `ng add @sanring/cli` 用法與跟 `init` flags 的對應表。實際端到端驗證:手動組一個假 Angular 專案,直接呼叫編譯後的 `ngAdd` Rule(真實 `spawnSync`、指向 local registry 避免打網路),確認 `sanring.config.json`、`sanring-theme.css`、`styles.css` import、base deps 安裝全部正確落地。

---

## P23 — CI 的 `check-component-audit-sync.mjs` 對已刪除的 `COMPONENT_AUDIT.md` 失敗

- [x] 移除 `packages/cli/scripts/check-component-audit-sync.mjs`,連同 `.github/workflows/ci.yml` lint job 裡呼叫它的那一步

**現況**:`COMPONENT_AUDIT.md` 已在 `35114a3 chore: remove orphan projects/ dir and completed audit docs` 移除(P3 盤點任務已完成,矩陣文件沒有繼續維護的價值),但驗證腳本沒有跟著移除。跑 `node packages/cli/scripts/check-component-audit-sync.mjs` 會直接對著不存在的 `COMPONENT_AUDIT.md` `ENOENT` crash,`ci.yml` 的 `lint` job 有呼叫這支腳本,main 分支 CI 因此常紅。

**已完成**:選擇刪除腳本+CI 步驟,而不是恢復 `COMPONENT_AUDIT.md`——恢復矩陣文件等於承諾要繼續手動維護它,跟當初刪除它的理由(盤點任務已完成、文件沒有持續維護的價值)直接矛盾。確認過沒有其他地方引用這支腳本(`CONTRIBUTING.md`/`README.md` 都沒提到)才刪。`pnpm lint` 重新驗證過綠燈。

---

## P20 — Theme Presets:具名主題預設與互動式產生器

- [x] 提供數個可直接套用的具名主題(`default`/`slate`/`warm`/`high-contrast`),讓 `sanring init --theme <name>` 能直接寫入對應的 CSS variables
- [x] Docs theming page 加入互動式調色預覽,讓使用者即時看到改變 accent/background/surface/border/radius 的效果並複製 CSS

**已完成**:`registry/shared/theme-presets/{slate,warm,high-contrast}.css` 三個 override-only partial,加上 `init.ts` 的 `--theme <preset>` flag。設計上刻意不讓每個 preset 各自複製一份完整的 90 行 token 檔——`slate`/`warm` 只覆寫 `--sanring-primary-10`~`90` 這條色階,靠 base `theme.css` 既有的 `--sanring-active: var(--sanring-primary-80)` 這類語意層 var() 參照自動把新色系帶過去,不用逐一重寫;`high-contrast` 因為改的是語意層本身(background/foreground/border 推向純黑白、圓角收斂),額外覆寫了 `:root[data-theme='light']` 區塊,並在檔案開頭註解說明為什麼跟另外兩個 preset 的作法不同(CSS attribute selector 的 specificity 比純 `:root` 高,兩個 preset 都必須各自帶自己的 light 區塊才能贏過 base 的 light 區塊)。

`resolveThemeContent()` 的合併方式是單純字串串接(base 內容 + `\n` + preset 內容),寫成同一份 `src/sanring-theme.css`——沒有做「動態合併多個 CSS 檔」這種更複雜的方案,因為 CSS custom property 的 cascade 規則本來就會讓後面出現的同選擇器宣告蓋掉前面的,字串串接已經足夠。preset 名稱驗證(`THEME_PRESETS` 陣列)在指令一開始就做,擋掉打錯字的 `--theme` 值並列出可用選項。

**驗證**:15 個 init.test.ts 案例全過(含新增的 3 個 `--theme` 案例);另外建置後在真實 scratch Angular 專案跑過 `sanring init --theme slate`/`--theme high-contrast`/`--theme bogus`,逐行比對輸出的 `sanring-theme.css` 內容(base + preset 正確串接、`--theme` 訊息正確顯示)、確認無效 preset 名稱會印出可用清單並 exit 1。`check-registry-sync.mjs`/`sync-registry.mjs`/`pnpm lint`/`tsc --noEmit` 全過。

**踩過的坑**:`init.test.ts` 裡的 `initCommand` 是模組層級 singleton,同一個 Command 實例會被整份測試檔案的多個 `it()` 重複 `parseAsync()`——commander 的 option default 只在 `.option()` 註冊當下套用一次,之後每次 parse 若沒有帶該 flag,並不會自動回退成 default,而是沿用上一次 parse 時明確設定的值。一開始新增的「拒絕不明 preset 名稱」測試把 `--theme nonexistent` 設進了 singleton,導致排在後面、完全沒提到 `--theme` 的既有 monorepo 測試也在 theme 驗證那關被擋下來,誤判成一堆不相關測試失敗。修法是在新增的 `describe` 區塊的 `afterEach` 裡呼叫 `initCommand.setOptionValueWithSource('theme', 'default', 'default')` 把 singleton 狀態復原,不影響其他測試檔案。

**docs**:theming page 加了一個「Named presets」段落(`--theme` 指令範例 + 4 個 preset 的一行說明表格),中英文 i18n key 都補了。這是純粹展示已出貨的 CLI flag,不是互動式調色預覽——沒有瀏覽器可以實際跑 docs dev server 驗證渲染,只用 `tsc --noEmit`/`pnpm lint` 驗證過型別和 i18n key 沒漏。

**互動式產生器**:在 `apps/docs/src/app/pages/theming/theming-page.component.ts` 新增 Theme generator section,放在「自訂品牌」之前。它提供 light/dark 預覽模式、accent/background/surface/foreground/border 色票、radius slider、即時 preview surface,並產生目前模式對應的 CSS selector(`:root` 或 `:root[data-theme='light']`)。複製行為沿用 docs 既有 `ToastService` 成功/失敗提示,中英文文案同步補在 theming locale 檔。

**互動式產生器驗證**:`pnpm exec ng build docs` 通過。此 build 需要 Google Fonts 網路存取來 inline 字型,已用網路權限完成驗證。

---

## P11 — a11y 自動化測試:axe-core 基礎設施 + 13 個高風險元件(部分完成)

- [x] 導入 axe-core,建立可重複使用的測試 helper
- [x] 套用到 P3 曾抓出真實 bug 的高風險互動元件批次(`dialog`、`alert-dialog`、`popover`、`select`、`combobox`、`command`、`dropdown-menu`、`context-menu`、`tooltip`、`sheet`)以及有歷史 a11y bug 的表單元件(`checkbox`、`switch`、`radio-group`)

**已完成**:新增 `packages/ui/src/testing/axe-a11y.ts`(不掛在 `public-api.ts`,不會進發布的套件),`expectNoA11yViolations(node, options?)` 執行 `axe.run()`,只對 `results.violations` 斷言失敗——`results.incomplete`(這個 jsdom-based test runner 底下幾乎都是 `color-contrast`,因為 jsdom 沒有真正的 layout/canvas engine 能算出渲染後的顏色)刻意不當失敗處理,這是 axe-core 自己「壞掉」跟「需要人工複查」的既有區分,不是這個環境專屬的權宜之計。已用 checkbox 元件實測驗證過失敗路徑真的會擋下已知的 a11y bug(暫時拿掉 `ariaLabel` 觸發 `button-name` violation,確認 assertion 真的會 throw,再改回來)。

`axe-core` 同時放進 `packages/cli`(它真正的消費者)跟 workspace root 的 `package.json` devDependencies——後者不是重複、不能砍掉重練:`@angular/build` 的 test bundler 是用 `root: <workspace root>` 跑 Vitest,當 2 個以上 spec 檔案 import 這支 helper 時,esbuild 會把 `axe-a11y.ts` code-split 成一個共用 chunk,而這個 chunk 的合成解析基準點是 workspace root、不是 `packages/ui`;pnpm 預設不 hoist package-local 依賴,`axe-core` 只能從 `packages/ui/node_modules` 解析,workspace root 解析不到,導致這個共用 chunk 裡的 `import axe from 'axe-core'` 完全解析不出來——但只有 2 個以上這樣的 spec 檔案同一個 Vitest process 一起跑才會炸(單一檔案會被 inline 進自己的 chunk,不會走這條路),這也是為什麼一開始追這個 bug 追得特別辛苦:整個 `ng test` 100% 重現,任何單檔 `--include` 跑法 0% 重現。詳細成因記在 `packages/ui/vitest-base.config.ts` 的註解裡,連同 `optimizeDeps.include: ['axe-core']`(可以省去 Vite dev server 冷啟動時 lazily 發現這個依賴的一輪)。

過程中另外撞到一個沒關係的插曲:並行 session(另一個同時在跑的 Codex session,做 P22 StackBlitz)也在改 workspace root `package.json`,兩邊的 `pnpm add`/手動編輯彼此蓋掉了對方的寫入(read-modify-write race,不是 pnpm 的 bug),`axe-core` 那行被吃掉兩次,靠比對 `pnpm-lock.yaml` 才發現、重新手動補回去並用 `pnpm install` 校正。

**過程中發現的真實 bug(不是 fixture 寫錯,已修好)**:

1. `select`:trigger 按鈕的 `role="combobox"` 代表它是用 `<input>` 那一套規則取得無障礙名稱(aria-label/aria-labelledby/關聯 `<label>`),不是像一般按鈕那樣文字內容就算數——placeholder 文字雖然視覺上看得到,但不算有效名稱來源。`SelectTriggerDirective` 完全沒有 `ariaLabel`/`ariaLabelledBy` input,docs 裡每一個 select 範例也都沒有示範任何替代標籤方式。補上這兩個 input(`packages/ui` + `registry` 兩處),docs API 表補上說明,中英文 i18n 補齊。
2. `context-menu`:`ContextMenuTriggerDirective` 掛在任意元素(通常是 `<div>`)上,加了 `aria-haspopup`/`aria-expanded`,但這兩個屬性只有在元素的 role 允許時才是合法 ARIA——bare div 的隱含 role 是 generic,不允許。修法是補 `role="button"`(`packages/ui` + `registry` 兩處),保留既有 5 個測試斷言 `aria-expanded` 的行為不變,而不是直接拿掉這兩個屬性(那樣做語意上更接近 Radix 的做法,但會動到既有測試驗證過的行為,選擇成本較低的修法)。

**page-scope 產生的雜訊(不是元件本身的問題,測試裡個別排除)**:overlay 內容用 CDK Overlay portal 到 `document.body` 之後,要檢查 a11y 就得對整個 `document.body` 跑 axe(不能只查 fixture 本身,不然漏掉 portal 出去的內容)。role="dialog"/"alertdialog" 的 overlay(dialog、alert-dialog、popover、sheet)axe 本來就有把它們排除在「region」規則外;但 role="listbox"(select)、role="menu"(dropdown-menu、context-menu)、role="tooltip"(tooltip)沒有這個排除,對著一個沒有 `<main>` 的裸測試 fixture 掃全部 `document.body` 一定會撞到「All page content should be contained by landmarks」——這是整份頁面結構層級的規則,跟被測元件本身的標記寫得好不好無關,這幾個測試個別用 `{ rules: { region: { enabled: false } } }` 排除,並在測試裡註解說明原因。

**尚未完成(當時)**:剩餘約 37 個元件還沒套用,helper 跟 pattern 已經穩定(overlay 用 `document.body` + 視需要排除 `region`;純文字/表單元件用 `fixture.nativeElement`),剩下是機械性套用工作。後續進度見下一條。

**驗證**:`packages/ui` 全部 64 個 spec 檔、229 個測試通過(`ng test @sanring/ui`,重跑兩次確認不是巧合)。`tsc --noEmit`(`packages/ui`/`apps/docs`/`packages/cli` 三個 tsconfig)、`pnpm lint`、`sync-registry.mjs`、`check-registry-sync.mjs` 全過。

---

## P11 — axe-core a11y 測試擴大到剩餘元件(完成)

- [x] 把上一條(P3 高風險批次)之後,剩下所有 component 都套上 `expectNoA11yViolations`

**做法**:延續上一條的既定 pattern 逐一套用——純文字/表單元件用 `fixture.nativeElement`;overlay 內容(hover-card、navigation-menu 子選單)appendChild 到 `document.body` 再對 `document.body` 跑 axe,視情況用 `{ rules: { region: { enabled: false } } }` 排除頁面級 landmark 規則。`sidebar` 原本完全沒有 component-level spec(只有其他 32 個元件目錄各自的原始檔),新建了 `sidebar.component.spec.ts`,組出 provider/header/content/footer/menu/menu-sub/rail/inset 的完整組合再測;`toast` 原本只有 `toast.service.spec.ts`(測 service 邏輯),新建了 `toaster.component.spec.ts` 補 component-level 覆蓋。

**過程中發現的真實 bug(不是 fixture 寫錯,已修好)**:

1. `navigation-menu`:`NavigationMenuSubTriggerComponent` 固定帶 `role="menuitem"`,但這個 role 依 ARIA 規範只能被 `role="menu"`/`"menubar"` 的祖先包住;它實際上直接坐在 `sanring-navigation-menu-content`(`role="region"`)底下,從來不在 menu 裡——docs 的 submenu 範例本身就是照這個(有問題的)結構寫的,不是測試 fixture 自己加出來的假陽性。改成 `role="button"`,呼應頂層 trigger(`NavigationMenuTriggerDirective`)本來就用純 `aria-haspopup`/`aria-expanded` 不掛 menu role 的做法(`packages/ui` + `registry` 兩處)。同時把 docs 兩處 submenu 範例(`navigation-menu.docs.ts`、`navigation-menu-page.component.ts`)內容連結上手動加的、同樣不成立的 `role="menuitem" tabindex="0"` 拿掉。
2. `collapsible`:`[sanringCollapsibleContent]` 固定帶 `role="region"`,套用在已經有自己語意 role 的宿主元素上時會整個蓋掉——最典型的受害者是 sidebar 的可摺疊子選單(`sanring-sidebar-menu-sub`,本身 `role="list"`),docs 的 sidebar 範例正是這樣組合(`<sanring-sidebar-menu-sub sanringCollapsibleContent>`)。蓋掉之後子選單底下 `role="listitem"` 的項目找不到合法的 `role="list"` 祖先,觸發 `aria-required-parent`。拿掉這個寫死的 role——WAI-ARIA 的 disclosure pattern本來就不要求內容面板有 role,`aria-labelledby` 指回 trigger 就夠(`packages/ui` + `registry` 兩處)。
3. `date-picker`/`calendar`:host 上的 `aria-required`/`aria-invalid`/`aria-describedby`(給 Angular Forms/`sanring-field` 整合用)掛在裸 `<div>`(預設 `role="generic"`)上,axe-core 的 `aria-allowed-attr` 規則判定不合法——這幾個屬性只有 combobox/gridcell/listbox/radiogroup/spinbutton/textbox/tree 等特定 role 才允許。兩個元件的 host 都補上 `role="radiogroup"`(語意上也貼近「從一組日期格挑一個」)。`calendar` 的月曆格早就用 `role="grid"` + `role="row"` 分組;`date-picker` 原本只有扁平的 `role="gridcell"` 清單、沒有 `role="row"` 包一層,ARIA grid pattern 要求 gridcell 必須在 row 裡,所以同時補了 `gridRows` computed 把 cell 依欄數切成列、樣板用 `role="row"` + `display:contents`(不影響 CSS Grid 版面)包住,對齊 `calendar` 既有的做法(`packages/ui` + `registry` 兩處)。

**query 過程中排除的假陽性(fixture 自己的問題,不是元件 bug)**:

- `avatar`:`sanring-avatar` host 固定帶 `role="img"`,不管有沒有 `ariaLabel` 都會掛上——就跟 `<img>` 沒給 `alt` 一樣,任何時候都需要一個無障礙名稱。原本測試 fixture 裡 `avatar-group` 底下有一個 `<sanring-avatar />` 沒給 `ariaLabel`,補上即可,docs 裡每一個 avatar(包含 group 內)都有給 `ariaLabel`,元件本身沒問題。
- `pagination`:`sanring-pagination`(`sanring-paginator` 的內層)預設 `role="navigation"` + `aria-label="Pagination"`,測試 fixture 裡放了兩個沒給 `ariaLabel` 的 `sanring-paginator`,兩個 `navigation` landmark 撞名觸發 `landmark-unique`。`sanring-paginator` 早就有 `ariaLabel` input 會往下傳,只是 fixture 沒用——補上第二個實例的 `ariaLabel` 即可。
- `navigation-menu`:同一份 fixture 裡,頂層 `sanring-navigation-menu-content`(`role="region"`)底下的連結被手動加了 `role="menuitem" tabindex="0"`——`NavigationMenuLinkDirective` 本身從不設這個 role,docs 除了 submenu 範例外也都沒這樣用,是這份 spec fixture 自己多加的,拿掉即可(跟上面第 1 點的 sub-trigger bug 是分開的兩件事,一個是 fixture 誤用、一個是元件預設值真的錯)。

**驗證**:`packages/ui` 全部 67 個 spec 檔、271 個測試通過(`ng test @sanring/ui`)。`tsc --noEmit`(`packages/ui`/`apps/docs` 兩個 tsconfig)、`eslint`(受影響的元件目錄)、`check-registry-sync.mjs` 全過。

---

## P9 — 自訂/第三方 registry 支援(alias:name 語法 + `sanring build`)

- [x] `sanring.config.json` 新增 `registries`(alias → URL map)與 `defaultRegistry` 選用欄位
- [x] `sanring add alias:componentName` 語法,從指定的第三方/私有 registry 安裝元件
- [x] `installedVersions` key 格式在元件被 `add`/`update` 觸及時升級為 `alias:componentName`(lazy migration,未觸及的舊 key 保留原樣)
- [x] `sanring build` 指令(讓第三方掃自己的 Angular component 目錄產出相容 `registry.json`)

**依據**:先寫了 [ADR-0001](.claude/adrs/0001-multi-registry-support.md) 定案設計決策,再依 [Task Charter](.claude/charters/p9-multi-registry.md) 的批次 A/B/C 分批執行(型別與純函式 → 10 個 command 接入 → alias 解析與 key 升級),每批獨立驗證(`tsc --noEmit`/`eslint`/`pnpm test`)後才 commit,批次 D(`sanring build`)charter 本身就標記「預設暫停」,需另立 charter 並先做 TypeScript AST 可行性 spike。

**核心設計**(細節見 ADR):`resolveRegistrySource(alias, config, flagOverride?)` 純函式封裝優先序 `flagOverride > registries[alias] > defaultRegistry > undefined`,12 個 command handler 統一透過它取得 registry 來源,不再各自處理 `options.registry`。一次 `add` 呼叫裡的所有元件必須來自同一個 registry(顯式 alias 或共用的 `defaultRegistry`)——CLI 不在單次呼叫內合併多個 registry 的 component 列表,這是 ADR 明確拒絕的替代方案(Q3)。

**執行中發現且已修的真實 bug(不是 charter 原範圍,但屬必要修正)**:`add.ts`/`remove.ts`/`update.ts`(x2)/`init.ts`(x2)這 6 處 `writeConfig(...)` 呼叫都是手動列欄位而非展開既有 config,已經會漏掉 `sharedPath`/`installedVersions`;新加的 `registries`/`defaultRegistry` 剛好也不在手寫清單裡——代表使用者一設定多重 registry,下一次 `add`/`update`/`remove` 就會把設定靜默清空,直接讓這個功能形同沒做完。發現後先停下用 `AskUserQuestion` 跟使用者確認要不要一併修,得到「現在一併修」的答案後才動手,改成 `{ ...config, ... }` 展開再覆蓋各自要變的欄位,並在 `add.test.ts`/`remove.test.ts`/`update.test.ts`/`init.test.ts` 各補一個回歸測試鎖住這個行為。

**驗證**:每個批次、每個 command 改完都各自跑過 `tsc --noEmit`/`eslint --max-warnings 0`/`pnpm test`,全數維持綠燈,最終 135 個測試通過(從批次開始前的 125 個增加,新增的都是 alias 解析、config 欄位保留、legacy key 遷移的回歸測試)。沒有連上真實網路 registry 做端到端手測——所有整合測試都用 `writeRegistryFixture` 產生的本地假 registry 驗證。

**`sanring build` 補完(2026-08-11)**:批次 A（目錄掃描 + AST import/export 分類）、批次 C（`sanring build` 指令本體）依序完成。批次 B 的 peerDependency 遞移閉包去重演算法(`computeUpstreamPeerCoverage`/`dedupePeerDependencies`)在 53 元件 golden fixture 驗證發現設計錯誤（跨元件去重會錯誤刪除使用者專案真正需要的 peer），整批移除，改為 `canonicalizePeerDependencies`（只做 `@angular/core/rxjs-interop` → `@angular/core` 等 submodule 規範化 + 同 registry 內去重，不做跨元件去重）。golden fixture 全量比對 53 元件、53 shared + 對應 peerDependencies 三個欄位零差異，`KNOWN_MISMATCHES` 清空、`it.skip` 改為強制啟用。README 補 `sanring build` 使用說明（`--source`/`--out`/`--dry-run`/`--name` 選項、典型工作流程）。

---

## P24 — registry 內容真實 bug(P9 spike/golden fixture 副產品)

P9 golden fixture 掃完 53 元件後發現一批長期存在的 registry 宣告錯誤,集中修正(2026-08-11)：

- `transfer` 4 個檔案 import 路徑錯誤(`../../utils`/`../component-styles` → 正確的 `../shared/utils`/`../shared/component-styles`);`otp-input` 同樣路徑問題
- `navigation-menu` 遺漏 `@lucide/angular` peerDependency;`accordion`/`collapsible` 遺漏 `@angular/cdk` peerDependency
- `calendar`/`checkbox`/`date-picker`/`file-upload`/`radio`/`slider`/`switch` 補 `@angular/cdk`(與 `@angular/forms`)peerDependency
- `date-picker` 遺漏 `field` componentDep;`alert-dialog` 移除錯誤宣告的 `utils` sharedDep(實際無 import)
- 11 個元件移除過度宣告的 `component-styles` sharedDep(`alert`/`alert-dialog`/`badge`/`breadcrumb`/`calendar`/`card`/`date-picker`/`link`/`tabs`/`tag`/`tooltip`);`transfer` 補上遺漏的 `component-styles` sharedDep

**驗證**:golden fixture 53 元件全量掃描 vs 手寫 `registry.json` 零差異。

---

## P26 — `/audit-component` 全元件稽核佇列(52 個,2026-08-13~14)

依 `/audit-component` skill 的 Tier 判定排序全數完成:先 Tier 1(純顯示型),再 Tier 2(互動型),再 Tier 3(有 CDK Overlay / 複雜鍵盤)。

### Tier 1 — Low-interaction primitive(純顯示型,無 Overlay)

- [x] `divider` — class merging + ariaLabel 已補，spec 5/5 通過
- [x] `skeleton` — registry CSS 對齊設計 token，spec 補 class merging test（3/3 通過）
- [x] `spinner` — 零缺陷，spec 3/3 通過
- [x] `progress` — registry 補 `ariaValueText` input + template binding，spec 補 class/barClass merging test（5/5 通過）。**2026-08-14 補漏**：`aria-valuenow` 原本沒 clamp（`value` 超出 `max` 時會超出 `aria-valuemax`），已改綁 clamped 值，補齊 test 斷言
- [x] `badge` — 零缺陷，spec 3/3 通過
- [x] `tag` — 關閉按鈕補 focus-visible ring（WCAG 2.4.7），spec 補 class merging + remove output test（4/4 通過）
- [x] `aspect-ratio` — 零缺陷，spec 4/4 通過
- [x] `card` — registry 補 design token（rounded-xl → rounded-[var(--sanring-radius-lg)]），spec 3/3 通過
- [x] `avatar` — registry AvatarImageDirective 補 afterNextRender SSR 防護，spec 3/3 通過
- [x] `label` — 零缺陷，spec 2/2 通過
- [x] `link` — 零缺陷，spec 3/3 通過
- [x] `alert` — registry 補 design token（rounded-lg + destructive 紅色 → CSS var），spec 3/3 通過
- [x] `timeline` — 零缺陷，spec 5/5 通過
- [x] `breadcrumb` — 零缺陷，spec 4/4 通過

### Tier 2 — Interactive / composite(有互動,無 Overlay)

- [x] `button` — `a[sanringBtn]` 無 `href` 時補 `role="button"`，spec 補 2 個 host component 測試（6/6 通過）
- [x] `toggle` — 零缺陷（工程面）；registry 端 `rounded-md` 補齊 `--sanring-radius` design token 漂移，spec 補 class merging test（4/4 通過）。Tier 1 by design（單顆 toggle button，無方向鍵語意）
- [x] `input` — 零缺陷，`id`/`aria-invalid` 設計符合既有 `sanring-field` 整合模式，spec 補 class merging + aria-invalid 狀態 test（6/6 通過）。Tier 1 by design
- [x] `textarea` — 零缺陷，設計與 `input` 一致，spec 補 aria-invalid 狀態 test（4/4 通過）。Tier 1 by design
- [x] `switch` — **高嚴重度**：P14 的 `SanringCvaBase` 重構（`a9cb0fd`）只套用在 `registry/`，過程中漏掉先前已修好的 `ariaLabel`/`ariaLabelledBy`/`checkedChange`，導致 `sanring add switch` 裝出來的版本 regression 回無障礙缺陷。已補回並比對其餘 8 個同批重構元件（checkbox/radio/slider/otp-input/file-upload/combobox/calendar/date-picker）確認皆無此問題，只有 switch 受影響。spec 補 class merging test（284/284 通過）
- [x] `checkbox` — 同批 P14 registry 重構 drift：`aria-required` 改綁純 `required()` input，漏掉 `Validators.required` 偵測（`packages/ui` 用 `fieldRequired` 才對），已修正。spec 補 class merging test（285/285 通過）
- [x] `radio` — 第三筆同類 P14 registry drift：`aria-required` 又是漏掉 `fieldRequired`（只看 `required()`），已修正。Tier 2（方向鍵導覽/roving tabindex/disabled 跳過），consumer usage 只有自己 demo 頁，Draft 狀態待評估是否投資。spec 補 class merging test（286/286 通過）
- [x] `slider` — 零缺陷，逐行核對 `registry` vs `packages/ui` 除 P14 機械性搬移外完全一致，無 drift。Tier 2（方向鍵/PageUp-Down/Home-End/拖曳），consumer usage 只有自己 demo 頁。spec 補 class merging test（287/287 通過）
- [x] `scroll-area` — registry 與 packages/ui 皆缺 `tabindex`：純文字內容超出容器高度時,鍵盤使用者完全無法捲動(WCAG 2.1.1,對應 axe-core `scrollable-region-focusable` 規則;jsdom 無真實 layout,現有 spec 結構性偵測不到),已補 `tabindex="0"` + `focus-visible` ring(沿用 `pagination-item` 既有的 ring recipe)。spec 補 render + class merging + tabindex test（5/5 通過）
- [x] `field` — `error-message`/`label` 的錯誤態文字硬編碼 `text-red-500`（registry 與 packages/ui 皆是,非單邊 drift）,已改用既有的 `--sanring-error-40` design token；`SanringFieldComponent` 本身缺 `class` input,是 field 目錄唯一沒有 class merging 支援的檔案,已補上。順手發現同一批 `input`/`textarea` 的 `errorState` 邊框/ring 也硬編碼 `border-red-500`/`ring-red-500`,一併修正為 `--sanring-error-50`/`--sanring-error-40`（這兩個先前稽核判定「零缺陷」,漏掉了設計 token 這個面向）。spec 補 render + class merging + `aria-describedby` 端對端 wiring test（8/8 通過）。**已修復(2026-08-13)**：`badge`/`checkbox`/`switch`/`toast`/`stepper`/`file-upload`/`otp-input` 的 `red-*` 硬編碼色碼,查證 registry 與 packages/ui 兩邊皆有(非單邊 drift),已全部換成對應 design token：文字色一律 `--sanring-error-40`,邊框/實心填色一律 `--sanring-error-50`(hover 用 `--sanring-error-60`),checkbox/input/textarea 這類「邊框+focus ring」組合維持 `border-error-50 + ring-error-40`。順手發現 `toast` 的 `TYPE_ICON_CLASS` 其實四色都硬編碼(`emerald-500`/`yellow-500`/`blue-400`,不只 error 用的 `red-500`),一併換成 `--sanring-success-40`/`--sanring-warn-40`/`--sanring-info-40`。`stepper.component.spec.ts` 有一處斷言直接查 `.border-red-500` class,已同步改成新的 class 選擇器。全部 7 個元件的相關 spec(70 tests)、`pnpm lint`、`check-registry-parity.mjs` 都跑過確認通過。**另外發現(已修復)**：`pnpm lint` 曾在 `main` 分支本身就是紅的——`registry/components/file-upload/file-upload.component.ts` 殘留 2 個死 import(`computed`、`SanringFieldControlAdapter`,該檔案改用自己的 `FileUploadFieldControlAdapter`,兩個都是真的沒用到)、`registry/components/otp-input/otp-input.component.ts` 殘留 1 個死 import(`inject`)。三處都是單純刪掉沒用到的 import,不影響行為;`pnpm lint` 現在重新綠燈,`check-registry-parity.mjs` 也重跑確認過
- [x] `pagination` — **高嚴重度**：`page-size-select.component.ts` 的 select trigger 按鈕完全沒有 accessible name(registry 與 packages/ui 皆是)。原因是同時對同一個 `<button sanringSelectTrigger>` element 設了兩個會衝突的 `aria-label` 來源：component 自己的 template 用 `[attr.aria-label]="ariaLabel()"` 直接綁在 raw 屬性上,但 `SelectTriggerDirective` 自己也有一個 `ariaLabel` input 對應同一個 host binding(預設 `undefined`)——後者蓋掉前者,導致這個按鈕的 `aria-label` 屬性從未真正出現在 DOM 上。加上 `role="combobox"` 的 accessible-name 算法不採計 visible text content(跟 `role="button"` 不同),所以即使按鈕文字顯示著頁碼數字,螢幕閱讀器還是完全讀不到這個控制項是什麼。已修正:改成 `[ariaLabel]="ariaLabel()"`,直接綁到 directive 自己暴露的 input。其餘元件(`pagination`/`pagination-list`/`pagination-item`/`pagination-nav`/`disableable-nav`/`paginator`)零缺陷,`role="navigation"`、`aria-current="page"`、disabled 狀態的 anchor/button 雙路徑處理(`DisableableNavDirective` 對 `<a>` 用 `tabindex="-1"` + 攔截 click,對 `<button>` 用原生 `disabled`)設計完整,無 design token drift。Spec 補齊：`paginator.component.spec.ts` 補 render/class merging/`role="navigation"` landmark/anchor-disabled 行為 4 個 test;新增 `page-size-select.component.spec.ts`(先前零覆蓋,也是這次挖出 aria-label bug 的地方),含 render/class merging/預設選項/雙向綁定更新/axe 共 5 個 test。全部 16 個 test、`pnpm lint`、`check-registry-parity.mjs` 通過。
- [x] `collapsible` — **高嚴重度**：`registry/components/collapsible/index.ts` 缺少 `SANRING_COLLAPSIBLE_IMPORTS` export(`packages/ui` 有,registry 沒有,單邊 drift,`check-registry-parity.mjs` 抓不到這種 export-shape 落差,它只比對 input/output/model 宣告跟 a11y attribute binding)。這個匯出正是 docs 自己的安裝範例教使用者要 import 的東西(`collapsible-page.component.ts`、`sidebar.docs.ts` 都直接用),代表任何人跑 `sanring add collapsible` 後照著文件範例寫都會編譯失敗。已補齊,兩邊現在逐字相同。元件本身(`CollapsibleComponent`/`CollapsibibleTriggerDirective`/`CollapsibleContentDirective`)工程品質很高:WAI-ARIA disclosure pattern 標準實作(`aria-expanded`/`aria-controls`/`aria-labelledby` 三向連結)、non-button trigger 補齊 `role="button"` + `tabindex="0"` + Enter/Space handler,disabled 狀態同時處理 native button 與非 button 兩條路徑,零缺陷。原始碼裡還留著先前一次生產環境 bug 的修復註解(移除 `role="region"` 因為蓋掉 sidebar submenu 的 `role="list"`),顯示這個元件已經被 `sidebar` 實際組合使用過並修過真的問題。spec 原本就很完整(4 tests,涵蓋 open/close cascade、disabled 攔截、非 button trigger 的 role/tabindex/keyboard),補 render + class merging 共 6 tests 全數通過。
- [x] `accordion` — 3 個獨立缺陷。**(1) 高嚴重度**：`registry/components/accordion/index.ts` 缺 `SANRING_ACCORDION_IMPORTS`(跟 `collapsible` 同一種 drift)。發現後順手寫一次性掃描比對全部元件的 `packages/ui` vs `registry` index.ts,又抓到 9 個同款 drift:`alert-dialog`(缺最多,連帶漏了整段 `export { Dialog... } from '../dialog'` re-export)、`alert`、`avatar`、`card`、`dialog`、`radio`、`scroll-area`(這個是本 session 稍早 `/audit-component scroll-area` 時漏查的,當時只 diff 了 component/directive 檔案沒 diff index.ts)、`tabs`、`toast`、`tooltip`,全部一次修正,補完的 56 個相關 test + `pnpm lint` + `check-registry-parity.mjs` + `check-registry-sync.mjs` 都過。`check-registry-parity.mjs` 目前只比對 input/output/model 宣告跟 a11y attribute binding,不比對 export 形狀,抓不到這類 drift——如果之後還想再挖,這是明確的腳本盲區。**(2) 中高嚴重度、已避開**：`accordion.component.ts` 用反射戳 `@angular/aria` `AccordionGroup` 的私有欄位(`_pattern.inputs.multiExpandable`、`_pattern.expansionBehavior.inputs.multiExpandable`)來設定 `multi` 的預設值,一開始以為是多餘的 hack 想用 `hostDirectives.inputs` alias 取代,結果讓所有沒寫 `multi` 的 accordion 預設從單開變多開(`@angular/aria` 的 `AccordionGroup.multiExpandable` 自己預設 `true`,跟 sanring 想要的 `false` 相反,而 hostDirectives alias 沒有機制覆寫底層預設值)。被既有 spec 的 `keeps only one item open by default` 當場抓到,已改回原本的寫法並補上完整原因註解(而不是留一個看起來可以刪掉、其實會 regression 的謎樣 hack)。**(3)**：`accordion-trigger.component.ts` 的展開箭頭圖示用了 `text-muted-foreground`——這不是 `var(--sanring-*)` 語法,是裸的 shadcn 慣例 class name,專案的 Tailwind 設定裡完全沒有定義,箭頭圖示色一直沒套到樣式。已改成專案內已定義好的 `text-[var(--sanring-muted)]`。其餘工程品質很高:建立在 Angular 官方 `@angular/aria` accordion primitives 上(不是手刻鍵盤邏輯),`aria-expanded`/`aria-controls`/`aria-labelledby` 三向連結正確,方向鍵導覽/Enter/Space/disabled 跳過都是函式庫內建。既有 spec 非常完整(11 tests,涵蓋結構、展開行為、multi 模式、輸入輸出、programmatic API、樣式),`pnpm lint`/`check-registry-parity.mjs`/`check-registry-sync.mjs` 全過。

**已修復(2026-08-13)**：全庫 grep 裸 shadcn class name 時,除了 `checkbox.styles.ts`、`calendar-day.directive.ts`、`date-picker-cell.directive.ts`,又多抓到 `checkbox.component.ts`(`border-primary`)、`radio-item.component.ts`(`border-primary`/`text-primary`)共 5 個檔案。根因:`--color-primary`/`--color-primary-foreground` 只定義在 `apps/docs/src/styles.css`(docs 站自己為了 light/dark 切換另外補的),`registry/shared/theme.css`(真正隨 `sanring add` 裝到消費者專案的那份)完全沒有這兩個變數——docs 站預覽看起來正常,但任何人真的用 CLI 裝 `checkbox`/`radio`/`calendar`/`date-picker` 到自己專案,選中狀態會完全沒套到顏色。已全部改用已定義好的 `--sanring-primary`/`--sanring-primary-fg` token(兩邊 registry + packages/ui 都修),`bg-primary/20` 這類透明度修飾符改用專案既有的 `color-mix()` 慣例(跟 `alert`/`file-upload` 一致)而非 Tailwind 對 arbitrary value 的 `/NN` 語法。24 個相關 test(checkbox/radio/calendar/date-picker)、`pnpm lint`、`check-registry-parity.mjs`、`check-registry-sync.mjs` 全過。
- [x] `tabs` — 建立在 `@angular/aria/tabs` 上,同一批 P14 commit 裡 registry 出現三處落差(跟 accordion 那筆一樣,是既有 drift,不是這次改動造成的)。**(1)** `tabs-content.component.ts` 是結構性差異,不只是樣式:`packages/ui` 用「外層 host `display:contents` + 內層 `<div ngTabPanel>` 真正的 panel」,`registry` 改成把 `NgTabPanel` 直接當 hostDirective 掛在 `sanring-tabs-content` 自己的 host 上(省掉一層 wrapper div),但也因此漏掉了 `value` 的本地 `input.required<string>()` 宣告(純靠 hostDirectives alias 轉發,`check-registry-parity.mjs` 目前的偵測方式沒抓到這個差異)。因為只有 `packages/ui` 這份有完整 spec 驗證,選擇讓 registry 跟 packages/ui 對齊(還原 wrapper div 寫法),而不是反過來把可能沒驗證過的簡化版推廣出去。**(2)(3)** `tabs-list.component.ts` 的 `rounded-lg`、`tabs-trigger.component.ts` 的 `rounded-md`,兩處都是 registry 端漏套 `--sanring-radius`/`--sanring-radius-sm` token(跟本 session 前面好幾筆 design token drift 同一類)。`tabs-list.component.ts` 裡解釋 orientation 需要雙處手動同步的註解也補回 registry(先前只有 packages/ui 有)。工程品質本身很高:方向鍵導覽、`aria-selected`/`aria-controls`/`aria-labelledby` 都是函式庫內建且測試涵蓋。spec 原本只有 3 個 test(render 隱含、a11y 連結、click 切換),完全沒有 class merging 跟鍵盤導覽測試——這對一個「核心互動就是方向鍵」的元件是明顯缺口。已補 render/class merging/方向鍵導覽(含 `softDisabled` 預設 `true`:disabled tab 仍會被 focus 到但不會被選取,這個非直覺行為現在有測試釘住)共 3 個 test,現在 6 個全過。`pnpm lint`/`check-registry-parity.mjs`/`check-registry-sync.mjs` 均過。
- [x] `stepper` — 建立在 `@angular/cdk/stepper`(`CdkStepper`/`CdkStep`/`CdkStepHeader`/`CdkStepLabel`)上,`role="tablist"/"tab"/"tabpanel"` 語意、roving tabindex、方向鍵/Home/End/Enter 導覽都是 CDK 內建。registry 兩處獨立 drift(跟本 session 稽核的其他元件無關,是既有問題):**(1)** `step-header.component.ts` 的 focus ring 用 `--sanring-ring`,這個 token 整個專案沒有定義過(跟先前 `--sanring-muted-foreground` 同一類「幽靈 token」),已改回已定義的 `--sanring-border-strong`。**(2)** `stepper.type.ts` 的 `StepState` 型別在 registry 端漏了 `| (string & {})` 這個 union member——這是刻意保留「已知字面量有 autocomplete、但仍接受任意字串」的 TS 慣用手法,給 `StepComponent.customState` 用;registry 版本是封閉聯集,代表任何人真的用 CLI 裝 `stepper` 後想傳自訂 state 字串會直接編譯錯誤,packages/ui(npm 套件版)卻明確支援。已補回。既有 spec 是目前稽核過最完整的一份(11 tests,涵蓋渲染/點擊選取/next-previous 指令/完整鍵盤導覽/linear+stepControl 阻擋/editable/completed-error 渲染/vertical orientation),只補 render + class merging 共 2 個 test,現在 13 個全過。`pnpm lint`/`check-registry-parity.mjs` 皆過。**順手發現**:`otp-input.component.ts` 也用了同一個幽靈 token `--sanring-ring`(這次兩邊都有,不是 drift),留給下一筆 `otp-input` 稽核時處理。
- [x] `otp-input` — 唯一的缺陷是前一筆 `stepper` 稽核時順手發現的同一個幽靈 token `--sanring-ring`(這次兩邊 registry/packages/ui 都有,不是 drift),用在 active slot 的 focus 邊框色,已改回 `--sanring-border-strong`。`otp-input.component.ts` 本身跟 registry 有已知的 P28 架構分岔(`packages/ui` 手刻 CVA、`registry` 用 `SanringCvaBase`),這是舊帳、先前 P14 saga 已經逐一比對過 packages/ui vs registry 的 input/output 清單確認 otp-input 沒受影響,這次沒有重新展開調查。工程品質很高:真正的鍵盤/IME/貼上/自動填入邏輯都在一個 `aria-hidden` 之外、視覺上縮到 1px 的真實 `<input>` 上(shadcn/Radix `input-otp` 同款設計),視覺 slot 全部 `aria-hidden`;手機虛擬鍵盤 keydown/input 重複觸發的 race condition 有文件化的雙層 `requestAnimationFrame` workaround。既有 spec 很完整(10 tests,涵蓋渲染、projected slots、數字過濾、自訂 pattern、貼上、backspace、disabled、field 整合、touched-on-blur、axe),但完全沒有方向鍵導覽測試——這是元件明確刻的功能(ArrowLeft/ArrowRight/Home/End)卻沒有回歸測試釘住,已補 render + class merging + 方向鍵導覽共 3 個 test,現在 13 個全過。`pnpm lint`/`check-registry-parity.mjs` 皆過。
- [x] `table` — 建立在 `@angular/cdk/table` 上,是這次稽核系列裡工程設計最紮實的一個,`registry`/`packages/ui` 完全零 drift(12 個檔案逐位元組相同)。**發現**:元件目錄裡有一份 `todolist.md`,內容嚴重過時——聲稱「paginator 不存在」「docs 頁面不存在」「spec 只驗證過 tsc 型別,沒有真的在瀏覽器驗證渲染,是目前最大未知風險」,但查證後這三項其實都已經解決(`pagination` 元件已存在、`apps/docs/.../table/` 頁面已存在且示範 row actions/checkbox 選取/排序/分頁組合、`table.component.spec.ts` 已經測過完整的 columnDef+cellDef+rowDef 內容查詢鏈)。已改寫 `todolist.md` 反映實際現況,移除已解決項目,只留真的還沒做的(sticky 欄位背景色、`CdkTextColumn` 等效元件、CDK flex-layout 支援、loading skeleton/欄位顯示切換的 docs 示範)。**補**:`index.ts` 沒有 `SANRING_TABLE_IMPORTS`——是這次稽核系列裡唯一一個沒有這個慣例匯出的多檔案元件,docs 自己的 table 頁面因此要手動 import 14 個個別 symbol;已比照其他 50+ 個元件的慣例補上(19 個 symbol 全部納入),兩邊同步。spec 原本 3 個 test 涵蓋渲染/class merging/selected row/sort 切換/axe,但完全沒測過 no-data 分支(`todolist.md` 自己都點名這是風險)跟 `ratio`/`width` 欄寬計算邏輯(有非平凡的比例分配數學,零覆蓋),已補 render + no-data 兩態 + ratio/width 換算共 5 個 test,現在 8 個全過。`pnpm lint`/`check-registry-parity.mjs`/`check-registry-sync.mjs` 皆過。
- [x] `resizable` — 零缺陷,是這次稽核系列裡少數完全手刻(無 CDK、無 `@angular/aria`)但工程品質依然很高的元件:滑鼠/觸控拖曳的 listener 清理完整(`stopDrag()` 同時處理正常結束跟 `destroyRef.onDestroy`)、鍵盤 resize 有 RTL 感知(`getComputedStyle(...).direction === 'rtl'` 反轉 ArrowLeft/ArrowRight)、collapsible panel 的「拖過 minSize 直接吸附 collapsedSize 而非卡住」邏輯正確。`registry`/`packages/ui` 零 drift,無硬編碼色碼、無幽靈 token,registry.json 對應正確。既有 spec 只有 3 個 test(渲染/ArrowRight resize/axe),完全沒測 disabled 狀態、Home/End、collapsible panel 這個獨立分支邏輯(有非平凡的「超過 minSize 就吸附到 collapsedSize」判斷,零覆蓋)。已補 render + disabled 狀態(aria-disabled/tabindex/攔截鍵盤)+ Home/End + collapsible 吸附共 4 個 test,現在 7 個全過。拖曳/觸控/RTL 三項因 jsdom 對 `getBoundingClientRect`/`getComputedStyle` 的層疊計算支援有限,沿用既有 spec「只測鍵盤路徑」的既有取捨,未新增覆蓋。`pnpm lint`/`check-registry-parity.mjs`/`check-registry-sync.mjs` 皆過。

**P26 Tier 2 佇列至此全數完成**(collapsible/accordion/tabs/stepper/otp-input/table/resizable 皆已稽核並修正)。

### Tier 3 — High-risk interaction(CDK Overlay / 複雜鍵盤 / Focus trap)

- [x] `tooltip` — 唯一缺陷是這個 session 很早期（`toggle` 稽核時）就發現、特意留給 tooltip 自己稽核時處理的 `rounded-md` design token 漂移，已修正。用 `cdkConnectedOverlay` 宣告式寫法（非手動 `Overlay.create()`），CDK 自動管理 attach/detach，Phase 1-C 手動生命週期檢查項目多數不適用。spec 補 class merging + hover 開關（原本只測 Escape，沒測過主要的 hover 觸發路徑）共 2 個 test（4/4 通過）。Tier 3，consumer usage 只有自己 demo 頁
- [x] `hover-card` — 零缺陷，`registry`/`packages/ui` 除了 4 個方法的 `protected`/`public` 可見度標記外完全一致。內容區塊刻意不加 `role`/`aria-describedby`（跟 tooltip 不同——內容常含可互動元素，做法對齊 Radix HoverCard 的既有慣例）。spec 補主要滑鼠 hover 開關路徑 + 「移到卡片內容不關閉」這個元件特有行為共 2 個 test（5/5 通過）。Tier 3，consumer usage 只有自己 demo 頁
- [x] `popover` — **中高嚴重度**：`role="dialog"` 面板有 `tabindex="-1"`（明顯預留給程式化 focus 用）但從未被呼叫，開啟時焦點不會移進面板、Escape/關閉時也不會回到 trigger，鍵盤/screen reader 使用者會迷失焦點。已修正：attach 時 focus 進面板、Escape 關閉時 focus 回 trigger（比照 `context-menu-sub-content` 既有慣例），outside-click 關閉時刻意不搶焦點。`packages/ui`/`registry` 皆有此問題（非單邊 drift），兩邊同步修正。spec 補 class merging + 3 個 focus 行為 test（331/331 通過）。Tier 3，**consumer usage 找到真正的內部依賴**（`calendar`/`calendar-header` 組件用它做月份/年份選單，不只是自己的 demo）
- [x] `toast` — 最後一筆 `toggle` 稽核時期發現、留給自己稽核處理的 `rounded-md`/`rounded-lg` design token 漂移，已修正。工程設計很紮實：SR 播報統一走 `LiveAnnouncer`（有註解說明避免雙重播報）、hover pause/resume 保留剩餘時間、非 modal 刻意不搶焦點都是正確設計。不使用 CDK Overlay，Phase 2-C 只有 1 項適用，**實際判定 Tier 1**（非原本手動分類的 Tier 3）。spec 補點擊/Escape 真的會關閉的測試（原本只驗證按鈕存在）共 2 個 test（4/4 通過）。consumer usage 找到全站廣泛真實使用（docs shell 掛載、複製回饋提示等），不只自己的 demo 頁
- [x] `calendar` — 零缺陷。P14 CVA 遷移純機械性搬移，`aria-required` 兩邊都是既有設計的 `required()` 直接綁（非 drift）。鍵盤格狀導覽委託給外部套件 `@sanring/date-picker-core` 的 `CalendarGridDirective`，本 repo 無可審程式碼。透過組合 `<sanring-popover>` 間接使用 CDK Overlay 做月份/年份跳轉，直接受益於 popover 稽核時修的焦點管理。spec 補 range 模式 + disabled 日期 matcher 兩個零覆蓋的真實功能（6/6 通過）。Tier 3，consumer usage 只有自己 demo 頁（`date-picker` 雖共用同一套引擎但沒有直接組合這個元件）
- [x] `dropdown-menu` — 零缺陷，本次稽核系列裡最乾淨的一個（`registry`/`packages/ui` 除 import path 外完全零 drift）。建立在 `@angular/aria/menu` 上，鍵盤/ARIA 全委託；手動管理 `OverlayRef`（非宣告式），用 `DomPortal` 只 attach 一次而非 CDK 慣用的開關重建，程式碼內有清楚註解說明為何刻意不用 `MenuOverlayController`。spec 原本零鍵盤測試（只測滑鼠點擊），已補 Escape 關閉 + class merging（content/item 兩處）共 2 個 test（337/337 通過）。Tier 3，**consumer usage 找到真實使用**（docs 站自己的導覽列 header、sidebar、table 頁）
- [x] `context-menu` — **中嚴重度**：鍵盤開啟子選單（ArrowRight/Enter）後焦點從未真正移入子選單，只是切換 `isOpen` 狀態；使用者得多按一次 ArrowDown 才能真正開始導覽項目，不符原生選單慣例。既有測試沒抓到是因為 CDK 的 overlay keydown 路由是依「目前最上層 overlay」而非實際 DOM focus，意外把測試的 ArrowLeft 斷言撐住了。已修正：`open()` 加 `{ focusFirstItem: true }` 選項，只有鍵盤路徑會用，滑鼠 hover/click 維持不搶焦點。其餘工程品質很高（P28 稽核時已修過的 `aria-disabled` drift 也在這裡）。spec 補 class merging + 焦點行為驗證共 3 個 test（339/339 通過）。Tier 3，consumer usage 只有自己 demo 頁
- [x] `select` — **高嚴重度**：`registry/select-content.component.ts` 完全沒有 `FocusKeyManager`/方向鍵導覽功能（`packages/ui` 有，程式碼註解記載這是歷史上修過的真實 bug），`registry` 的 `select-item.component.ts` 也連帶沒實作 `FocusableOption` 介面——這正是 P28 階段誤判 `disabledInput`/`disabled` 命名差異「只是命名、不是 bug」的根本原因（那次只查了 DOM 屬性，沒查出背後缺整個功能）。結果：`sanring add select` 裝出來的下拉選單方向鍵完全無效，違反 `registry.json` 自己寫的描述。已完整補齊兩個檔案，`check-registry-parity.mjs` 的過時允許清單條目也移除。**另一個中嚴重度**（`packages/ui`/`registry` 皆有）：選值/Escape 後焦點沒有回到 trigger，已修正（outside-click 刻意不動，理由同 popover/context-menu）。spec 補 class merging + 2 個焦點回歸測試（342/342 通過）。Tier 3，**consumer usage 找到真實內部依賴**（`pagination` 的 page-size 選擇器）
- [x] `file-upload` — 已知的 `id`（`packages/ui` 純字串、`registry` 是 `input()`）已修正為兩邊一致的 `input()`，`check-registry-parity.mjs` 允許清單移除。順手發現並修正兩邊皆有的 `bg-[var(--sanring-active)]/30`（Tailwind `/NN` 修飾符加在 CSS 變數 arbitrary value 上,這個專案已知不可靠,改用既有的 `color-mix()` 慣例——拖曳中的背景高亮實際上可能沒套色）跟 `rounded-lg` 沒套 design token。`registry` 端有一段過時且已經是錯的註解（宣稱 id 不是 input signal,但下一行程式碼就是函式呼叫）也一併更正。核心的 `FileUploadComponent` 驗證邏輯（accept/maxSize/maxFiles/去重/拖放/disabled/remove）原本完全零測試覆蓋，已新增 `file-upload.component.spec.ts`（9 tests）。過程中意外發現一個測試撰寫陷阱：在第一次 `detectChanges()` **之後**才修改 signal input 綁定值，即使再呼叫一次 `detectChanges()` 子元件仍讀到舊值，必須在第一次 `detectChanges()` 之前就準備好所有覆寫值。351/351 通過。Tier 1（無 CDK Overlay，拖放不落在這個 skill 的 Tier 判定範圍內），consumer usage 只有自己 demo 頁
- [x] `carousel` — **高嚴重度**：`registry/carousel-content.component.ts` 的 `EmblaCarousel()` 初始化直接放在 `ngAfterViewInit()`，沒有包 `afterNextRender()`——這正是 DEVLOG 記載過、`packages/ui` 已經修好的同一個 SSR bug（`EmblaCarousel()` 內部建立 `ResizeObserver`，SSR 沒有這個 API 會直接崩潰），從沒同步到 registry。任何人 `sanring add carousel` 到有 SSR 的專案會直接在伺服器端拋錯。已完整同步 `packages/ui` 寫法。其餘工程品質很高，完全遵循 W3C APG carousel pattern。spec 原本零互動測試，已補按鈕接線、disabled 狀態、方向鍵依 orientation 觸發共 3 個 test（jsdom 無法測 Embla 真實捲動數學，改用 spy 驗證本專案自己的 wiring）。354/354 通過。Tier 1（依嚴格判定），consumer usage 只有自己 demo 頁
- [x] `dialog` — **低嚴重度**：`registry/dialog.styles.ts` 的 `sm:rounded-lg`/`rounded-sm` 未套 design token（`packages/ui` 端已是 `var(--sanring-radius-lg/xs)`），已修正。核心架構乾淨：建立在官方 CDK `Dialog` 模組上（非手刻 overlay），`autoFocus: 'first-tabbable'`/`restoreFocus: true`/`ariaModal: true` 均正確設定，`aria-labelledby`/`aria-describedby` 三向連結正確。既有 spec 已相當完整（5 tests，涵蓋 aria 連結、disableClose、兩種關閉結果），補 class merging + focus 管理（開啟後焦點進面板、關閉後回到 trigger）共 2 個 test（356/356 通過）。注意事項（非阻斷）：`dialog-content.component.ts` 關閉按鈕同時有 `aria-label` 跟內部 `sr-only` span 且文字不一致，`aria-label` 會覆蓋掉 span，span 實質上不會被播報。Tier 3，**consumer usage 找到豐富真實情境**（docs 頁 7 種示範：basic/custom close/media/config result/no-close/sticky footer/scrollable，非孤立 API 展示）
- [x] `alert-dialog` — 零缺陷，`registry`/`packages/ui` 完全零 drift（連 import path 都一致）。建立在 `dialog` 之上（`AlertDialogService` 疊加 `DialogService`，強制合併 `role: 'alertdialog'` + `disableClose: true` 且放在 `...config` 之後不可被呼叫端覆寫），繼承 `DialogService` 的 `autoFocus`/`restoreFocus` 預設值，直接受益於 `dialog` 稽核時確認過的正確 focus 管理。既有 spec 已相當完整（7 tests，涵蓋 role/disableClose 兩種繞過嘗試/自訂與預設 close 結果/a11y），補 class merging + focus 管理共 2 個 test（358/358 通過）。Tier 3，**consumer usage 找到真實情境**（docs 頁 destructive delete 確認、media variant、自訂 close 結果等 3 種示範）
- [x] `sheet` — **高嚴重度**：`registry/sheet-content.component.ts` 是 commit `0bbb1e8`（`fix(ui): render sheet content in a CDK overlay`）之前的舊版，從未同步，完全缺少三項真實修過的 bug 修正：面板未 portal 到 CDK overlay container（祖先 `transform`/`filter`/`contain` 可能劫走 `position:fixed`、z-index 跟其他 overlay 堆疊不一致）、關閉後完全不會把焦點還給觸發元素、開啟期間完全不會把背景內容標 `aria-hidden`（screen reader 仍可導覽到面板背後）。已將 `packages/ui` 完整實作（`attachOverlay`/`detachOverlay`/aria-hiding/focus-restore）搬移過去。**中嚴重度**（兩邊皆有）：scroll-lock 的 `effect()` 建構子內無條件直接存取裸露的全域 `window`/`document`（非注入的 `DOCUMENT` token），SSR 環境會直接拋錯；已改用本檔案既有的 `afterNextRender()` 慣例包住，並加 `_scrollLocked` 旗標讓 `onDestroy` 清理也只在真的鎖過時才碰 `document`。既有 spec 品質很高（8 tests，已涵蓋 aria-hidden 背景 + focus 回到 trigger 兩項——正是這次抓到 registry 缺陷的關鍵測試），補 class merging 共 1 個（359/359 通過，lint 乾淨）。Tier 3，**consumer usage 找到真實情境**（docs 頁編輯個人資料表單、多方向 side 示範）
- [x] `command` — **低嚴重度**：`CommandComponent.onKeydown()` 有無意義的死分支（`if (event.key === 'Enter')` 兩條路徑做的事完全相同，`CollectionController.onKeydown()` 內部本來就處理 Enter），已簡化成單一呼叫。**中嚴重度（a11y）**：`command-group.component.ts` 的 heading 文字沒有 `aria-labelledby` 連回 `role="group"` 容器，screen reader 使用者聽不到群組標題，已加 id + 連結（兩邊皆有，已同步修正）。工程品質整體很高：`command-dialog.component.ts` 的 `detectIsMac()` 有先檢查 `platform.isBrowser` 才碰 `navigator`，是本次系列少見「一開始就寫對」SSR guard 的案例；`registry`/`packages/ui` 除 import path 外零 drift。既有 spec 涵蓋方向鍵導覽/Enter/點擊/搜尋過濾/axe 共 7 tests，但 `CommandDialogComponent`（Tier 3 CDK Overlay 部分）完全零覆蓋，補 2 個既有 spec test（class merging + group aria-labelledby）+ 新建 `command-dialog.component.spec.ts` 4 個 test（toggle 開關/防重複開啟/ariaLabel+class 傳遞/平台相應 ⌘K vs Ctrl+K 快捷鍵）。365/365 通過，lint 乾淨。Tier 3，**consumer usage 找到強力真實使用**（`apps/docs` 把 `CommandDialogComponent` 當成全站真正的 ⌘K 功能搜尋面板在用，非孤立展示）
- [x] `date-picker` — 零缺陷。`registry` 端已完成 P14 的 `SanringCvaBase` 遷移，逐行比對確認純機械性搬移、無功能性 drift（跟 `calendar` 稽核時的結論相同）。ARIA grid pattern 正確（`role="radiogroup"` 外層 + `grid`/`row`/`gridcell`，有註解說明為何選 radiogroup 而非裸 div），鍵盤方向鍵導覽委託給外部套件 `@sanring/date-picker-core` 的 `GranularityGridDirective`，本 repo 無可審程式碼。`registry.json` 的 `sharedDeps`/`componentDeps`/`files` 全部正確。既有 spec 涵蓋 render/屬性/class merging/導覽按鈕/點擊選取/axe 共 3 tests，但 `mode="range"` 與 `disabled` matcher 兩個零覆蓋的真實功能（跟 `calendar` 稽核時發現的同款缺口），補 2 個 test（367/367 通過）。Tier 2（無 Overlay，方向鍵網格導覽+disabled 跳過適用），**consumer usage 找到豐富真實情境**（docs 頁多組 month/quarter/year granularity 與 single/range/multi mode 示範）
- [x] `navigation-menu` — **高嚴重度**（兩邊皆有，非單邊 drift）：`navigation-menu-link.directive.ts` 的 `[attr.tabindex]: 'disabled() ? -1 : null'` 未 disabled 時綁定 `null`，會整個覆蓋消費者手動寫在 template 上的 `tabindex="0"`（submenu 用法的官方慣例，docs 頁與既有 spec test host 都這樣示範）——結果 **submenu 內 ArrowDown/ArrowUp 在項目間移動焦點完全失效**，因為 `focusAdjacentMenuItem` 依賴的 `[tabindex="0"]` 選擇器永遠比對不到東西。這是先前完全沒被任何測試抓到的真實鍵盤導覽 regression（既有測試只驗證 ArrowRight 開/ArrowLeft 關，從沒測過項目間導覽）。已改成建構子時快照消費者原本的 tabindex，disabled 時強制 `-1`、否則回退快照值。**中嚴重度**（兩邊皆有）：`navigation-menu-sub`/`-sub-trigger`/`-sub-content` 有跟先前 `context-menu-sub` 完全同款的缺陷——鍵盤開啟 submenu 後焦點沒有真正移入第一項，已用相同手法（一次性 `focusFirstItem` 旗標）修正。其餘工程品質很高：`delayDuration`/`skipDelayDuration` 是誠實記載「保留給未來、目前未生效」的公開 API（非隱藏半成品），`link` 指令自動幫 `target="_blank"` 加 `rel="noopener noreferrer"`，善用共用的 `MenuOverlayController`/`focusAdjacentMenuItem` 抽象。既有 spec 缺 class merging/submenu 內方向鍵導覽/disabled tabindex 正確性，補 5 個 test（371/371 通過，lint 乾淨）。Tier 3，consumer usage 只找到自己 demo 頁，未在網站其他地方（如實際導覽列）被使用
- [x] `combobox` — **中嚴重度**（兩邊皆有）：`combobox-list.component.ts` 的 `role="listbox"` 在 `multiple` 模式下缺 `aria-multiselectable="true"`，已加上條件式 binding。**中嚴重度**（兩邊皆有）：docs 頁 `example-popup` demo 實際示範的「收合按鈕點擊展開成搜尋框」用法，開啟後焦點停留在被面板蓋住的 trigger 上，面板內搜尋 input 完全沒自動聚焦，跟同專案 `command-dialog` 已建立的「開啟即自動聚焦搜尋框」慣例不一致，已在 `combobox-content.component.ts` 加 `effect()`+`afterNextRender()` 修正（對純 input 用法是無害 no-op）。**低嚴重度**（兩邊皆有）：`disabled`/`required`/`multiple` 三個 boolean input 都沒有 `booleanAttribute` transform，跟全專案慣例不一致，消費者被迫永遠寫 `[multiple]="true"` 不能用 bare attribute，已補上。`registry` 端已完成 P14 `SanringCvaBase` 遷移，逐行比對純機械性搬移無 drift（跟 `calendar`/`date-picker` 同結論）。ARIA combobox pattern 實作嚴謹，`aria-activedescendant` 正確追蹤鍵盤高亮、`aria-selected` 正確保留給實際選中值（比 `command` 簡化版更嚴謹）。Spec 稽核前幾乎零覆蓋（只有 1 個 axe test + 2 個 field 整合測試，對 15 檔案的大型元件家族完全不成比例），大幅補寫 `combobox.component.spec.ts`（篩選/方向鍵導覽+disabled 跳過/點擊選取/Escape+outside-click 關閉/多選 aria-multiselectable+chip 新增移除/trigger 開啟自動聚焦迴歸測試），379/379 通過，lint 乾淨。Tier 2（無 Overlay，手刻 absolute div + document:pointerdown），consumer usage 只找到自己 demo 頁
- [x] `tree` — **中嚴重度**（兩邊皆有）：`TreeComponent` 建構子建立 `TreeKeyManager` 並訂閱其 `change`，但從未呼叫 CDK 明確要求的 `keyManager.destroy()`（內部持有對 `nodes$` 的訂閱，不會自己清理），SPA 中重複掛載/卸載的樹面板會逐次洩漏。已在 `DestroyRef.onDestroy()` 呼叫 `destroy()`。**低嚴重度**（視覺 drift，兩邊皆有）：`tree-group.component.ts` 的巢狀縮排輔助線 `border-l` 完全沒指定顏色（本專案沒把 Tailwind 預設 border 顏色橋接到 design token），跟其他所有邊框寫法不一致，已加 `border-[var(--sanring-border)]`。其餘工程品質很高：建立在官方 `@angular/cdk/a11y` 的 `TreeKeyManager` 上（roving tabindex/方向鍵/展開收合全委託），click-to-select 刻意留給消費者接（docs 頁與既有 spec 一致示範，屬既定合成式設計慣例非缺陷）。既有 spec 品質很高（5 tests：roles/選取/roving tabindex/trigger 展開收合/leaf 點擊/方向鍵+Enter/axe），補 class merging + `TreeKeyManager.destroy()` 呼叫的迴歸測試共 2 個（381/381 通過，lint 乾淨）。Tier 2（無 Overlay，方向鍵導覽+roving tabindex 適用），consumer usage 只找到自己 demo 頁
- [x] `transfer` — 零缺陷，本次稽核系列中少見的「零源碼問題」元件。`registry`/`packages/ui` 完全零 drift（連 import path 都只是預期的 `../shared/` 差異）。純狀態容器 + 合成式子元件架構乾淨：分頁/搜尋自動夾範圍避免篩選後卡在空白頁、one-way 模式正確鎖住 target 面板、move 操作防禦性過濾 stale key。每個 item 用真正的 `<sanring-checkbox>`；一開始懷疑外層 row 的 `(click)` 疊加 checkbox 自己的 `(click)` 會不會雙重切換，實測（既有 spec 已直接驗證）證實安全。稽核前就有 6 個獨立 spec 檔案共 24 個既有 test，是本次系列覆蓋最完整的元件之一（split/move/disabled 阻擋/one-way 唯讀/分頁+搜尋 clamp/axe 全覆蓋），唯一缺口是 `TransferHeaderComponent` 的 `isShow` 計數徽章零覆蓋，補 1 個 test（382/382 通過，lint 乾淨）。Tier 2（無 Overlay，勾選+搬移+分頁互動適用），consumer usage 只找到自己 demo 頁
- [x] `sidebar` — **低嚴重度**（視覺 drift，兩邊皆有，3 處）：`sidebar-group-label.component.ts`/`sidebar-menu-badge.component.ts`/`sidebar-menu-action.directive.ts` 都用了 `text-[var(--sanring-muted-foreground)]`——這個 CSS 變數在整個專案 `theme.css` 裡根本不存在（只有 `--sanring-muted`），是從 shadcn 慣例命名直接搬過來沒對照這個專案實際 token 名稱的典型錯誤（跟 `accordion` 稽核時抓到的 `text-muted-foreground` 同款），未定義變數讓該屬性計算失效退回繼承值。已全部改成 `text-[var(--sanring-muted)]`。工程品質整體很高：雙層 context 設計清晰（`SidebarComponent` 可獨立當自己的 context 也可委派給外層 `SidebarProviderComponent`），全部用 `role="list"`/`role="listitem"` 純導覽清單語意（非 ARIA menu pattern），原生 button/a 天然可聚焦不需要 roving tabindex——一開始懷疑 tabindex binding 跟 `navigation-menu` 抓到的覆寫 bug 同款，查證後確認這裡不適用。注意事項：`SidebarProviderComponent.sidebarElement` 永遠是 `signal(null)` 從未賦值，技術上沒完整實作 `SidebarContext` 介面，但深入追查確認唯一讀取點（trigger 的 self-trigger 判斷）不受影響（Angular DI 解析永遠會拿到 `SidebarComponent` 自己正確實作的版本），目前無害但語意不完整。既有 spec 缺 class merging/`collapsible="none"` 鎖定/rail 切換，補 3 個 test（385/385 通過，lint 乾淨）。Tier 2（無 Overlay，展開收合+disabled 動作按鈕適用），**consumer usage 找到強力真實使用**（docs 網站自己的側邊導覽列，非孤立展示）。**P26 Tier 3「High-risk interaction」稽核佇列全數完成**（alert-dialog/sheet/command/date-picker/navigation-menu/combobox/tree/transfer/sidebar 共 9 個）

---

## 查證後確認「不算差距」的項目(備查,避免重複討論)

- **PR 沒有測試/型別檢查關卡**:原 P0 已完成,不再放主 todo。已新增 PR 觸發的 CI workflow,跑 `pnpm test`、`tsc --noEmit`、`pnpm lint`。
- **可編輯 playground(Monaco/StackBlitz 匯出)**:查證後 shadcn 自己的元件文件頁也是「靜態 demo + 程式碼區塊」,沒有即時可編輯的 playground,兩邊打平,不是缺口。
- **文件版本切換(per-CLI-version docs)**:shadcn 文件站同樣沒有明顯的版本切換機制,兩邊打平,不是缺口。
