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

## P29 — Docs visual refresh 三階段整理 / 翻新 / 收斂

- [x] 清掉 docs token 命名不一致:統一 `--docs-focus-ring` / `--docs-accent-fg` 等語意命名,移除或替換 `--docs-ring`、`--docs-accent-foreground` 這類殘留用法

**已完成**:全域比對 `apps/docs/src/styles.css` 實際定義的 35 個 `--docs-*` token 與全站 `src/**/*.ts`/`*.css`/`*.html` 內 `var(--docs-*)` 的使用清單,取差集,共揪出 5 個懸空 token——比 TODOLIST 原本點名的 `--docs-ring`/`--docs-accent-foreground` 兩個更多:`tree-page.component.ts` 的 `--docs-ring`(節點 focus ring)、`--docs-accent-foreground`(選中節點文字色,2 處)從未在 `styles.css` 定義過;`changelog-page.component.ts` 的 `--docs-danger-bg`/`--docs-danger-fg`(BREAKING chip 底色/文字色,2 處)雖然帶了 CSS fallback(`#fee2e2`/`#b91c1c`)所以視覺上沒有整個消失,但完全不吃 dark theme——BREAKING chip 在 dark mode 下會是刺眼的淺色底深色字,跟其餘 chip 用色風格不一致;`collapsible-page.component.ts` 的 `--docs-hover`(file-tree demo 按鈕的 hover 背景)沒有 fallback,hover 實際上完全沒有視覺回饋。全部改成 `styles.css` 已定義的對應語意 token:`--docs-ring`→`--docs-focus-ring`,`--docs-accent-foreground`→`--docs-accent-fg`,`--docs-danger-bg`/`-fg`→`--docs-error-bg`/`-fg`(沿用既有 error 語意色,不另建 danger 語意),`--docs-hover`→`--docs-elevated`(語意表定義的「Interactive/hover surface」正是這個 token)。改完重新跑一次同樣的差集比對,確認全站 `var(--docs-*)` 使用清單已是定義清單的子集,無殘留懸空引用。

**風險**:帶 fallback 的兩個 token(`--docs-danger-bg`/`-fg`)不是「完全沒有視覺效果」那種明顯 bug,只是 light/dark 語意錯位,比較容易在 code review 被略過,值得記一筆避免以後又長回來;沒有 fallback 的那三個則是真的會壞——`focus-visible` ring、選中節點文字色、hover 背景在對應頁面上實際上是失效的。

- [x] 更新 `apps/docs/DOCS_VISUAL_SYSTEM.md` 狀態:從 planning specification 調整為 living visual system,標記已落地項目、待實作項目與仍需決策的項目
- [x] 收斂 open decisions:code block 在 light theme 是否固定深色、docs page header 是否全面使用 framed panel、home page 是否保留獨立視覺語言、docs-only layout primitive 是否正式元件化

**已完成(2026-08-15)**:四題 open decisions 請使用者拍板,全部採用推薦選項:(1) code block 在 light/dark theme 一律固定深色,不切換 Shiki theme,理由是跟 GitHub/Vercel/shadcn 等主流文件站慣例一致,且不用維護第二套語法上色主題;(2) docs page header 全面採用 framed panel,不只限 component page,理由是符合「整站一致體驗」這個 Phase 2 的既定目標;(3) home page 拿掉 particle background,改跟內頁背景語言一致,理由是避免首頁跟其餘頁面看起來像兩個不同產品,品牌記憶點改靠排版/字級/品牌色而非動態背景;(4) `DocsCallout`/`DocsMetric`/`DocsFeatureList` 這類內容用 layout primitive 正式做成 Angular component,理由是跟進 `component-page-*` 系列已經證明可行的慣例,避免 Phase 3 再重構一次。四項決議與理由已寫進 `DOCS_VISUAL_SYSTEM.md` 的 Decision Log(取代原本的 Open Decisions 段落),同時把 Theme Rules/Component Page Structure/Motion/Implementation Rules 四個章節內對應段落標上 `**Resolved**` 直接落實決議內容,`Status` 欄位改成 living visual system 並註明 Phase 2/3 未落地項目一律標 `[planned]`。

**現況**:`DocsCallout`/`DocsMetric`/`DocsFeatureList` 決議做成元件,但實作本身還沒動工(TODOLIST 仍列為待辦),這裡完成的只是「要不要做成元件」這個決策本身。

- [x] 定義可重用視覺 pattern 的其中一項:`component-page-*` 系列要不要統一改名對齊 `Docs*` prefix

**已完成(2026-08-15)**:維持現有命名,不做全域改名。理由:`component-page-*` 系列已經在用、已經被 50+ 個 component page import,改名等於一次大範圍搬遷但沒有實質功能收益;新建的 `DocsCallout`/`DocsMetric`/`DocsFeatureList` 直接用 `Docs*` prefix 即可,新舊並存不影響可讀性——docs 目錄下本來就分「component-page 專用」跟「docs 泛用」兩層,命名前綴剛好對應這個分層。

- [x] 盤點 docs 頁面矩陣:列出 home、introduction、components、cli、registry、mcp、theming、roadmap、changelog 與 component pages 的 header、surface、typography、mobile overflow、one-off layout 現況

**已完成(2026-08-15)**:逐一讀 `apps/docs/src/app/pages/` 底下 home、introduction、components 列表頁、cli、registry、mcp、theming(含 6 個子 section)、roadmap、changelog,加上抽查 button/select/dialog/table/tree/collapsible 六個 component page,記錄 header pattern、surface token 用法、字級是否對齊 type scale、mobile overflow 處理、one-off layout。完整表格寫進 `apps/docs/DOCS_VISUAL_SYSTEM.md` 新增的「Page Matrix Audit」章節。結論:cli、registry、mcp、introduction、changelog 跟抽查的 6 個 component page 都對齊良好,沒有結構性問題——真正需要 Phase 2 處理的落在三個地方:(1) home page 完全沒用 `app-docs-page-header`、H1 字級偏離 type scale、`.home-particles` 動畫背景還在(跟已拍板要移除的決議矛盾,尚未落實只是還沒動工);(2) components 列表頁沒用 `ComponentPageSectionComponent`,自己刻 H2,手機版缺縮字;(3) `theming-presets-section.component.ts` 手刻 `<table>` 沒包 overflow-x 容器也沒用 `ComponentPageApiTableComponent`。另外發現 roadmap 頁有個無限跑馬燈動畫,雖然有遵守 `prefers-reduced-motion`,但跟系統文件「避免環境動效」的精神是否衝突,Decision Log 沒有明講涵蓋這頁,列為新的待決事項。這三項具體缺口跟 roadmap 動效的決定都已經搬進 TODOLIST Phase 2,不留在這裡重複。

**風險**:這次稽核只讀程式碼、沒有動任何實作,`.home-particles` 目前仍在運作中,不要誤以為 Decision Log 拍板等於已經落地。

- [x] 收斂 open decisions 追加一題:roadmap 頁無限跑馬燈動畫要不要保留

**已完成(2026-08-15)**:保留。理由:Decision Log 的「避免環境動效」規則針對的是裝飾性背景(像 home 的 particle background),roadmap 的跑馬燈是內容展示手法(捲動看項目)而非裝飾,且已正確實作 `prefers-reduced-motion`,不算違反精神。已寫進 `DOCS_VISUAL_SYSTEM.md` Decision Log 補上這條。

- [x] 收掉目前 home page command/code surface 微調,避免後續翻新混入未分類的小改

**已完成(2026-08-15)**:working tree 裡本來就有的 code sample 背景色調整(`--docs-bg` → `--docs-code-header`,讓 command block 底色跟其他 code surface 一致)跟今天的 token 修復、文件更新一起收進同一個 commit,**Phase 1「整理基線」全部項目完成**,進入 Phase 2。

- [x] Phase 2 起手:修掉頁面矩陣稽核發現的三個具體缺口(home particle background、home H1 type scale、theming presets 表格 overflow)

**已完成(2026-08-15)**:(1) `home-page.component.ts` 移除 `.home-particles` 動畫背景 div 跟對應的 CSS(含 `@keyframes home-particles-drift`、reduced-motion/mobile media query),落實 Decision Log 已拍板的決議,home page 現在跟內頁一樣用 `--docs-bg` 頁面背景,沒有裝飾性動態層。(2) H1 字級從 `56/40/32px` 三段式改成 `56/36px` 兩段式(`max-[860px]:text-[36px]`),對齊 type scale 表格定義的 Display 角色(規範只定義 Desktop/Mobile 兩態,40px 這個中間值本來就不在表列範圍內)。(3) `theming-presets-section.component.ts` 的手刻 `<table>` 外面包一層 `overflow-x-auto` 容器 + `min-w-[420px]`,長主題名稱在窄螢幕改成內部捲動而不是撐爆頁面版寬。

**判斷未做的部分**:components 列表頁的 H2 沒有換成 `ComponentPageSectionComponent`,只補了稽核發現的 `max-[520px]:text-[24px]` 缺字級——查證後發現 `ComponentPageSectionComponent` 綁定了不少 component-page 專屬行為(accessibility/stateModel 的結構化描述解析、level-2 專屬的漸層 accent bar、`mt-16` 是為長文件單欄捲動調的間距),硬套進 components 列表頁這種兩區塊 grid 排版反而可能生出不合適的視覺元素(例如不該出現的 accent bar),真正的缺口只有「手機縮字沒補」,已經用最小改動修掉,不強行換元件。Home page 的完整首屏重新設計(視覺層次/品牌記憶點/第一眼完成度)沒有做,那是需要跟你對過方向的創意設計工作,不是稽核發現的機械性缺陷。

**驗證**:`tsc -p apps/docs/tsconfig.app.json --noEmit`、`eslint` 三個改動檔案都乾淨;起了一份 `ng serve docs --port 4300`(跟你原本已經在跑的 dev server 分開的獨立實例,驗證完就關掉了),`ng build` watch 模式編譯成功,`/`、`/components`、`/theming` 三條路由都回 200。**沒有**用瀏覽器實際看過畫面——這個環境沒有瀏覽器/screenshot 工具,只驗證了編譯乾淨跟路由能載入,沒驗證視覺結果是否符合預期,建議你自己开 dev server 肉眼確認一次。

- [x] 翻新 docs shell:調整 header、sidebar、TOC 的密度、active state、hover/focus state、背景層次與窄螢幕表現

**已完成(2026-08-15,查證後確認不是缺口)**:逐檔讀完 `apps/docs/src/app/shell/` 底下 `header.component.ts`、`menu-list.component.ts`、`feature-list.component.ts`、`docs-sidebar.component.ts`、`docs-toc.component.ts`、`docs-section.component.ts`、`footer.component.ts`,對照 `DOCS_VISUAL_SYSTEM.md` 的 Navigation/Interactive States 規則逐條核對:header sticky 76px、優先順序(品牌→主導覽→搜尋→GitHub→主題切換)、搜尋在 860px 以下變滿寬、GitHub 在 520px 以下允許隱藏、主題切換手機版仍可用,全部符合;sidebar 用 fade mask 隱藏捲軸(符合「scrollbar 可以隱藏,只要有 fade mask」);TOC active state 用 accent border 指示、巢狀縮排一致;sidebar active state(`--docs-active` 底色 + accent border + shadow)明顯比 hover state(`--docs-elevated` 混色)更強烈,new/status 圓點跟 active state 是獨立視覺元素沒有互相取代;focus-visible 全部正確走 `--docs-focus-ring`/`--docs-border-strong`。**結論**:這塊在 P29 前置提交就已經做到位,沒有找到結構性缺口,不需要额外翻新。之前 TODOLIST 把它跟 long-form/component docs 並列成「還要大改」的項目,查證後撤回這個假設。

- [x] 補強 light/dark theme 對比與層次:確認兩種主題不只是顏色反轉,而是保留相同資訊階層與 code readability

**已完成(2026-08-15)**:讀 `apps/docs/src/styles.css` 的 dark/light token 定義,發現真正的 bug——dark theme 的 `--docs-panel`(`#182021`)、`--docs-bg`(`#202424`)、`--docs-surface`(`#232a2b`)、`--docs-elevated`(`#2b3334`)四個 token 各自不同色階,層次分明;但 light theme 的 `--docs-panel`/`--docs-surface`/`--docs-elevated` 三個語意完全不同的 token(「主要面板」「重複項目 surface」「互動/hover surface」)全部寫死 `#ffffff`,只有 `--docs-bg`(`#f6f8f8`)不同——三層語意在 light theme 底下視覺上完全塌縮成同一個顏色,只能靠 border/shadow 撐出層次,跟 dark theme「靠背景色本身分層」的做法不一致,符合我在這個任務一開始分析時提出的疑慮(light theme 容易變成 dark theme 的補丁)。**修法**:把 `--docs-surface` 改成 `color-mix(in srgb, var(--docs-bg) 14%, white)`(從 panel 的純白往 bg 的淺灰微退一階)、`--docs-elevated` 改成 `color-mix(in srgb, var(--docs-border) 16%, white)`(用 border 色系帶出微冷灰調,對應 dark theme 裡 elevated 明顯比 surface「更有存在感」的角色)。兩個都用 `color-mix()` 從既有 token 推導,不是憑感覺猜十六進位值,方便之後微調百分比。`ng build docs` 編譯過。**風險/警語**:這個改動**完全沒有肉眼驗證過**——這個環境沒有瀏覽器或 screenshot 工具,只確認了 CSS 語法正確、build 不報錯,沒辦法確認實際色階是否好看、對比是否恰當。跟這次其他修復(結構性 bug,對錯客觀)不同,這是視覺判斷,信心程度較低,建議你開 dev server 用肉眼看一次 light theme,不滿意就直接調整這兩行的 `color-mix` 百分比。

- [x] 修掉 home page「CLI run」視覺面板裡一個真正的對比度 bug(使用者用瀏覽器 DevTools 對比度檢查器回報,見下方查證過程)

**已完成(2026-08-15)**:使用者截了 Chrome DevTools 的顏色對比度面板(`code.break-words` 元素,`#D7E2E4` on 深色 code 背景,對比度 12.54,綠色通過)跟 home page「CLI run」視覺卡片的截圖,問能不能直接拿這種分數當判斷依據。用 WCAG relative luminance 公式(`0.2126R+0.7152G+0.0722B`,sRGB gamma-correct 後代入,對比度 `(L1+0.05)/(L2+0.05)`)自己重算了整張卡片牽涉到的顏色組合,不用瀏覽器也能算:command 區塊的 `--docs-code-fg`(`#D7E2E4`)在 `--docs-code`(`#161d1e`)上是 12.93,跟使用者截圖的 12.54 對得上(誤差是背景實際有 color-mix 疊加透明度,不是純 `#161d1e`),這個沒問題,不是這次「不友善」的來源。往下三行輸出文字才是真正的問題:前兩行用 `--docs-muted`(`#b4c3c6`)算出來是 9.41,健康;但第三行 `ready to compose` 用的是 `--docs-success-fg`(`#1a281a`,一個近黑的深綠),算出來對比度只有 **1.11**——這個 token 設計上是要搭配淺色的 `--docs-success-bg` 當「chip 上的深色文字」用(同一個檔案裡上方的狀態徽章就是這樣正確配對的),但這裡被直接單獨套在深色 code 面板背景上,近乎完全隱形,是這次「顏色很不友善」的真正原因。全站 grep 了一輪 `docs-(success|error|warn|info)-fg` 的所有用法(changelog、recent-changes、home 三個檔案),確認只有這一處是「-fg 沒有搭配對應 -bg 使用」的裸用,其餘全部正確配對,不是系統性問題。**修法**:改用 `--docs-success`(`#81c784`,同一組色階裡設計成「直接疊在 surface 上」的中亮度基礎色,跟 `--docs-accent` vs `--docs-accent-fg`/`--docs-accent-strong` 是同一種角色分工),對 `#161d1e` 算出來是 8.49,落在舒適好讀但不會死白刺眼的區間,而且這個 token 兩個主題共用同一個值(沒有在 light theme 被覆寫),不用擔心切主題後又出問題。

**方法論(回答使用者的問題)**:WCAG 對比度是我能直接拿來當客觀判準的少數指標之一——只要有前景/背景的十六進位色碼,我自己就能照公式算,不需要瀏覽器或截圖,算出來的數字也不會因為「好不好看」這種主觀判斷而模糊掉,4.5:1 是文字的底線、3:1 是大字/UI 元件的底線,低於底線就是硬缺陷不是品味問題。但它的侷限也要說清楚:(1) WCAG 對「太高」沒有上限懲罰,12.93 這種高對比度在 code 區塊是正常的(終端機/編輯器本來就常是近白/近黑),不代表「刺眼」一定要往下修,真正刺眼與否還是要看實際畫面;(2) 對比度只看亮度差,不看色相/飽和度是否協調、也不看同一區塊內多個元素的視覺權重是否失衡(這次三行文字擠在一起,其中一行對比度是 1.11 的近乎隱形,才會讓整叢文字讀起來都很「murky」);(3) 所以最可靠的用法是:你截圖或報對比度數字給我,我就能像這次一樣直接用算出來的數字定位問題、給出可驗證的修法,比我自己盲猜色碼可靠很多——這個工作流可以繼續用。

- [x] 移除不必要的 one-off Tailwind styling:把重複出現的頁面級樣式收斂到共同 pattern 或 docs-only primitive

**已完成(2026-08-15,查證後確認 Phase 2 範圍內沒有更多要做的)**:`grep` 系統性掃過 `apps/docs/src/app/pages/` 底下所有超過 40 字元的 class 字串,按出現次數排序,再額外掃了所有 `uppercase` 標籤的變體。結論是沒有大範圍的 one-off drift:排名最高的重複(例如一模一樣的 preview 容器 class 出現 72 次)是既有慣例被全站一致遵守的結果,不是各頁各寫一套、需要收斂的「不一致」。唯一抓到的「同一個 pattern 兩種寫法」——eyebrow 標籤有 `text-xs uppercase` 跟 `text-sm font-semibold uppercase` 兩種——查證後發現前者出現在 `scroll-area-page.component.ts` 裡,是 `scroll-area` 元件示範用的假資料內容(demo 裡的一個分類標籤),不是文件頁自己的 chrome 樣式,不算真正的不一致。**判斷**:像那 72 次重複的 preview 容器這種「已經證明穩定、大量重複」的樣式,屬於 TODOLIST Phase 3 明確列出的「將已證明穩定的重複 layout 抽成 docs-only Angular component」,不是 Phase 2「清掉不一致」的範疇——Phase 2 這條的實際工作在稽核順手抓到的兩個個案(theming presets 表格、components 列表頁縮字)修完後就已經做完,沒有更多需要在 Phase 2 處理的一次性樣式問題。

- [x] 全站對比度稽核(延續上一條「CLI run」bug 的方法論,交給背景 agent 做系統性掃描)

**已完成(2026-08-15)**:把剛才手動抓 `--docs-success-fg` bug 的算法(WCAG relative luminance 公式,往上找有效背景、`color-mix()` 展開成實際 RGB 再算)套用到全站,逐一算了 506 個 `text-[var(--docs-*)]`/`text-[var(--sanring-*)]` 用法在兩個主題下的對比度。抓到 1 個真的 fail:`shell/sidebar/docs-section.component.ts` 的側邊欄分類標題(例如「GETTING STARTED」)用了 `text-[color-mix(in_srgb,var(--docs-muted)_82%,transparent)]`,多餘的透明度稀釋把 light theme 對比度拉到 3.59(12px 文字門檻是 4.5,dark theme 6.26 沒事)——`--docs-muted` 這個 token 本身沒問題(dark 8.63 / light 5.16 都過),問題是額外疊加的 `color-mix(...82%, transparent)`。已拿掉這層多餘的透明度,直接用 `--docs-muted`。`tsc --noEmit`/`eslint` 驗證乾淨。另外算出 3 處數字偏低但**不是** bug:`docs-section.component.ts` 側邊欄停用項、home page 元件面板停用項、components 列表頁停用項,這三處都是 `@if (item.disabled)` 分支渲染的純文字佔位標籤(語意上等同 disabled 按鈕),WCAG 1.4.3 明文排除「inactive user interface component」的對比度要求,不算違規,沒有動。其餘檢查過的重點案例(status chip 的 `-fg`/`-bg` 配對、`accent-fg`/`control-fg`、code 區塊文字)全部 pass,沒有找不到既有 token、只能回報不能修的案例。

- [x] header 主題切換器(light/dark/system 三顆圖示的膠囊選單)上下 padding 視覺上不對稱

**已完成(2026-08-15,使用者截圖回報)**:這次不是顏色問題,是箱模型算術對不起來。`feature-list.component.ts` 的主題切換器外層容器是 `h-10`(40px,border-box)+ `border`(1px×2=2px)+ `p-1`(4px×2=8px),扣掉之後內容區只剩 30px;但裡面的三顆圖示按鈕跟滑動指示條都是 `size-8`(32px)——內容比容器能容納的空間還大 2px。容器上還掛了 `overflow-hidden`,這 2px 溢出會被裁掉,但 `items-center` 置中演算法在「內容大於容器」時算出來的置中偏移量,兩端各裁多少常常因為次像素捨入不對稱,這就是視覺上「上下 padding 看起來不一樣」的成因,不是肉眼幻覺,是算得出來的箱模型錯誤。**修法**:容器從 `h-10`(40px)改成 `h-11`(44px),扣掉 border/padding 後內容區變 34px,比 32px 的按鈕多 2px 餘裕,`items-center` 有空間可以對稱置中,不會再觸發裁切。指示條的 `top-1 left-1`(對應原本的 `p-1`)不用跟著動,因為 padding 值沒變,只是容器變高了。`tsc --noEmit`/`eslint` 驗證乾淨。全站搜過同款「固定 h-10 容器裝 size-8 固定尺寸子元素」的組合,只有這一處,不是重複出現的系統性問題。

- [x] home page 兩個 H2 section 標題字級偏離 Type Scale 表格

**已完成(2026-08-15)**:使用者授權「Phase 2 中間不用再問,一律通過」後,開始做「數值規範」稽核(不是主觀美感,是核對實際寫的 px 數字跟 `DOCS_VISUAL_SYSTEM.md` Type Scale 表格對不對得上)。home page 的 `home.highlights.title`(第 250 行)跟 `home.components.title`(第 293 行)兩個 `<h2>` 都寫 `text-[30px] ... max-[520px]:text-[26px]`——30/26 這兩個數字整張 Type Scale 表格裡完全沒出現,是憑感覺選的,不是表定的 Section title `28px`/`24px`(表格明文規定「Do not introduce new arbitrary text sizes without updating this table」)。已改成 `28px`/`24px`。同一份檔案裡另外兩處看起來像素數字的地方(`text-[20px]`/`text-[22px]`,視覺化面板裡的統計數字跟 highlight 數值)判斷不算違規——沒有動,因為它們是數字/指標展示(視覺系統文件裡 `DocsMetric` 這個未來要做的 pattern 就是給這種用途),不是標題,不適用 heading 的 Type Scale 角色,套用文字級表格反而是誤用。`tsc --noEmit`/`eslint` 驗證乾淨。

- [x] home page 兩個 H2 補上其餘頁面都有的 section accent bar,消掉跟全站的視覺語言落差

**已完成(2026-08-15)**:`ComponentPageSectionComponent`(被所有 long-form/component page 共用)在 level-2 標題旁邊固定加一條 `h-8 w-1.5` 的漸層 accent bar(`bg-[linear-gradient(180deg,var(--docs-accent),var(--docs-accent-alt))]`),但 home page 自己刻的兩個 H2 section(highlights、components)沒有這個元素,讀起來跟其他頁面的標題語言不一致。直接複製 `ComponentPageSectionComponent` 現成的 class 跟 wrapper 結構(`flex items-start gap-3` + 同樣的 accent bar span)套進這兩處,不是自己發明新的視覺處理——這個 pattern 已經在全站每個 long-form/component page 上線很久,風險等同於零。`tsc --noEmit`/`eslint` 驗證乾淨。

- [x] Phase 2「數值規範」全站稽核(long-form 頁面 + component-page 共用層),交給背景 agent 做系統性掃描

**已完成(2026-08-15)**:延續上面 home page 的做法,把「核對 px 數字跟 Type Scale/Spacing/Radius 三張表對不對得上」的方法套用到 7 個 long-form 頁面(introduction/cli/registry/mcp/theming 含 6 個子 section/roadmap/changelog,共 15 個檔案)加上 `layouts/component-page/` 共用元件(12 個檔案,被 50+ 個 component page 共用,改一次全部受益)。抓到 4 處真的偏離、已修:

1. `layouts/component-page/docs-page-header.component.ts`——**這是全站所有 long-form 頁跟 component page 共用的 header**,描述文字用 `text-[17px]`,Type Scale 表格裡沒有 17 這個數字,對應的角色是 Body large(18px/16px,規範明寫給 hero descriptions 用,行高 1.75 跟手機 16px 都已經符合),改成 `18px`。影響面最大的一處修正。
2. `pages/changelog/changelog-page.component.ts` 與 `layouts/component-page/component-page-recent-changes.component.ts`——兩處狀態 chip 的 `CHIP_CLASS` 都用 `text-[11px]`,低於 Type Scale 最小角色 Caption(12px,規範明寫「Chips, labels, uppercase headings」正好對應這個用途),改成 `text-xs`(12px)。
3. `pages/introduction/introduction-page.component.ts` 兩處「段落說明→code block」的間距用 `mt-4`(16px),但 Spacing 表定義「Body to example」是 24-36px(桌機)/24px(手機),而且同一頁跟 cli/registry/mcp 三頁在完全相同的情境下全部一致用 `mt-6`(24px)——這兩處是隨手漏改的孤例,已統一成 `mt-6`。

三處**發現偏離但判斷不出正確值,沒有動,只回報**:`component-page-recent-changes.component.ts` 的面板 padding(`p-6`/`p-4`)介於 Card padding(16-20px)跟 Hero panel padding(28-36px)兩個表格角色中間,查無其他線索判斷該歸哪一類;同檔案 H2 用 `text-xl`(20px)且無響應式降級,精神上介於 Section title 跟 Subsection title 之間,不確定是刻意壓低視覺層級(Recent Changes 文件裡定位成「支援區塊,不是主要內容」)還是漏掉響應式;`roadmap-page.component.ts` 5 處章節說明段落用 `text-sm`(14px,Small 角色本身合法),但其他四個 long-form 頁同角色內容一律用 `text-base`(16px, Body)——這屬於「該歸哪個角色」的設計判斷,不是數字亂填,沒有動。全部改動跑過 `tsc --noEmit`/`eslint`,另外我自己重新對 4 個改動檔案再跑一次 lint/typecheck、外加整個 `ng build docs` 全站編譯(因為 `docs-page-header`/`component-page-recent-changes` 是共用層,影響 50+ 頁面),全部乾淨。

- [x] `component-page-recent-changes.component.ts` 的 H2 字級補上桌機 22px(重新評估後判斷可以確定,跟同檔案的 padding 疑問不是同一種情況)

**已完成(2026-08-15)**:回頭重新看上面回報「不確定」的兩個案例,發現 H2 字級這個其實有足夠證據可以判斷,跟面板 padding 那個真正兩難的情況不一樣。原本 `text-xl`(20px)在所有寬度都一樣,沒有響應式降級。查 Type Scale 表格:Subsection title 定義是 22px 桌機/20px 手機,`leading-tight`(Tailwind 1.25)剛好精確對上表格寫的 line-height 1.25,唯一對不上的只有桌機該是 22 卻寫成 20。給這個標題套 Subsection title 角色是合理的(它是「支援區塊」而非主要 H2 section,語意上本來就該比 Section title 弱一階,但仍需要有一個表定角色,不能沒有依歸),改成 `text-[22px] ... max-[520px]:text-xl`(桌機 22px、手機維持原本的 20px)。面板 padding 那個當時沒有動,因為兩個規範文字互相矛盾(`--sanring-radius-lg` 暗示該套 Hero panel padding,但「supporting surface」「compact rows」的敘述又暗示該收斂),沒有站得住腳的單一結論。`tsc --noEmit`/`eslint` 驗證乾淨。

- [x] `component-page-recent-changes.component.ts` 面板 padding——回頭用「查其他 `radius-lg` 面板實際怎麼用」找到夠強的實證,不再是死結

**已完成(2026-08-15)**:使用者追問「Phase 2 那 5 點是不是完全處理不了」,逼自己回頭重新檢查這個當時判定「兩難、不能猜」的案例,發現漏查了一件事——之前只從規範文字本身推論(「`radius-lg` 對應 Hero panel padding」vs「supporting surface 該收斂」互相矛盾),但沒有去查全站其他真正在用 `--sanring-radius-lg` 的地方實際上都怎麼設 padding,那個才是可查證的事實,不是文字解讀。全站 grep 出 7 個其他 `radius-lg` 面板:只有 `docs-page-header.component.ts`(真正的頁面 Hero header)用 `p-7`(28px)/`p-5`(20px 手機),精確對上 Hero panel padding 表定範圍;其餘 6 個(`docs-toc.component.ts`、home page 三個視覺面板、`component-page-api-table.component.ts`)全部落在 `p-4`(16px)或 `p-3`(12px 手機)這個 Card padding 範圍,沒有一個額外套用 Hero panel 的 28-36px。也就是說「`radius-lg` 就該用 Hero panel padding」這個推論在這個 codebase 裡根本不成立,只有真正的頁面 header 才用;其餘 `radius-lg` 面板實務上一律用 Card padding 範圍,這才是跟「supporting surface, compact」的規範文字互相印證、沒有矛盾的那個結論。已把面板 padding 從 `p-6`(24px)/`max-[520px]:p-4` 改成統一 `p-4`(16px,拿掉響應式覆寫,因為手機值本來就是 16px,現在桌機也一樣不用再寫兩份),對齊最多數的既有先例。`tsc --noEmit`/`eslint` 驗證乾淨。

- [x] `roadmap-page.component.ts` 5 處章節說明段落字級——同一輪回頭複查抓到的證據更直接

**已完成(2026-08-15)**:比對後發現這 5 段 `<p class="mt-0 text-sm text-[var(--docs-muted)]">` 全部出現在同一個結構位置——`<app-component-page-section>` 內容開頭的第一段說明文字。查其他 long-form 頁(以 `cli-page.component.ts` 為代表)在完全相同的結構位置,一律用 `<p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">`(Body 角色,10 處以上全部一致)。這不是「這裡的內容該算 Small 還是 Body」的設計判斷,是同一個元件插槽在不同頁面被寫成兩種字級的單純 drift——roadmap 是唯一的例外。已把 5 處全部改成跟其他頁面一致的 `text-base leading-[1.7]`。`tsc --noEmit`/`eslint` 驗證乾淨。

**檢討**:這兩個案例第一輪都被我標成「判斷不出來,需要人決定」,但其實只是查得不夠深——沒去找同一個 codebase 裡的實際先例當作可驗證的證據,只停留在抽象比對規範文字。之後遇到「規範文字看起來矛盾」的情況,應該先查 codebase 裡其他地方實際怎麼做,而不是急著結論「這是主觀判斷,不能碰」。

- [x] Phase 2「視覺翻新」收斂:把三項無法在沒有瀏覽器的情況下負責任處理的項目移出 Phase 2,另立 Phase 4

**已完成(2026-08-15)**:Phase 2 原本 6 個項目——docs shell 翻新、long-form pages 翻新、component docs 翻新、light/dark theme 對比、one-off Tailwind 清理、home page 首屏重新設計——裡,shell 翻新、light/dark 對比、one-off Tailwind 清理三項已經完整做完(見上面各自的條目);long-form/component docs 翻新的「結構面對齊」跟「數值規範(字級/間距對照表格、全站先例)」也已經做完,唯獨這三項剩下的「超出規範以外、純粹靠肉眼判斷好不好看」的部分,在這個沒有瀏覽器/screenshot 工具的環境下没辦法負責任地繼續執行——硬做等於盲猜,跟這次系列其他修法(每一個都有算得出來的數字或查得到的先例撐腰)性質不同。使用者確認後,把這三項從 Phase 2 移到新的「Phase 4 — 視覺精修」,並列出解封條件(Phase 3 的 Playwright/screenshot 基礎設施建好,或使用者提供截圖/具體方向)。Phase 2 本身視為收斂完成,不再是進行中狀態。

- [x] 建置 Playwright/e2e 基礎設施
- [x] 補 docs visual QA checklist:桌面 `1440px` / `1180px` / `1024px`,手機 `390px` / `360px`,light/dark theme,長 code line,中英文文案長度

**已完成(2026-08-15)**:確認 repo 內完全沒有 Playwright,從零建置。裝了 `@playwright/test`(root devDependency,`-w` 加到 workspace root)跟 chromium 瀏覽器。新增 `apps/docs/playwright.config.ts`:`webServer` 用 `ng serve docs --port 4310 --configuration development` 自動起 dev server(跟使用者原本自己開著的 dev server 用不同 port,不衝突),兩個 project(`desktop-chromium` 1440×900、`mobile-chromium` 用 Pixel 7 裝置設定檔)。`apps/docs/e2e/` 底下 5 個 spec 檔,對應 TODOLIST 原本要求的覆蓋範圍:
- `home.spec.ts`:首頁渲染、無 console error、無橫向溢出
- `component-page.spec.ts`:`button` component page 的 header/basic example/API reference 都渲染,code block 複製按鈕可鍵盤聚焦
- `long-form-page.spec.ts`:`introduction` 頁 header/TOC 渲染(TOC 只在 ≥980px 檢查,對應規範的隱藏斷點),`cli` 頁的長指令 code block 不撐爆頁面
- `mobile-shell.spec.ts`:390px 下桌面版 sidebar 隱藏、漢堡選單觸發 sheet(`role="dialog"`);360px 下無橫向溢出
- `theme-toggle.spec.ts`:切換 light/dark 更新 `<html data-theme>`、`aria-pressed`,重新整理後設定持續

寫的時候踩到一個真的很有參考價值的坑:`home.spec.ts` 一開始用 `getByRole('link', { name: 'Browse components' })` 抓不到元素,以為選字錯了,查 Playwright 存的 accessibility snapshot 才發現這個 `<a sanringBtn routerLink="/components">` 實際上的 role 是 **`button`** 不是 `link`——`sanringBtn` 指令會把宿主元素的 ARIA role 覆寫成 button,不管它原本是 `<a>` 還是 `<button>`。這是 `@sanring/ui` 既有的設計行為(讓消費者可以用 `<a sanringBtn>` 做出「看起來是按鈕的連結」),不是這次要修的 bug,只是把測試斷言改成符合實際 role。全部 18 個測試(9 個 spec × 2 個 project)`pnpm exec playwright test --config=apps/docs/playwright.config.ts` 綠燈。加了 `pnpm test:e2e:docs` 腳本方便之後跑。`.gitignore` 補了 `playwright-report/`/`test-results/`。QA checklist 直接寫進 `DOCS_VISUAL_SYSTEM.md` 新增的「Visual QA Checklist」章節,每一條都標明有沒有 `[automated]` 對應的 e2e 覆蓋,講清楚 Playwright 這層只驗證「有沒有渲染出來、有沒有爆版」這種結構性斷言,「好不好看」這種主觀判斷還是驗證不到,需要肉眼或視覺回歸工具(這個 repo 目前沒有 approved baseline,之後如果要做 screenshot diff 得另外決定要不要投資這塊)。

- [x] 重大更正:之前一路認定「這個環境沒有瀏覽器/screenshot 工具,Phase 4 沒辦法做」是錯的——Playwright 截圖 + `Read` 工具可以讀圖片,兩個合起來我其實看得到畫面

**已完成(2026-08-15)**:建置完 Playwright 之後,順手測了一件事:寫一個 `page.screenshot()` 把渲染結果存成 PNG,再用 `Read` 工具讀那個 PNG 檔——結果真的能看到實際畫面,不是只有 DOM/accessibility tree。這推翻了 Phase 1 到 Phase 3 一路的假設(「這個環境沒有瀏覽器,純美感判斷不能碰」),Phase 4 移出去的三項理論上現在有辦法做了。

用這個方法對現有狀態拍了一輪快照當基準:home(light/dark/mobile 390)、`button` component page(light/dark,含 recent-changes 區塊特寫)、`introduction` 頁、`roadmap` 頁、`theming` 頁的 presets 表格。**結論:目前狀態其實相當完整,沒有看到明顯需要緊急修的視覺問題**——particle background 移除後 home 首屏乾淨;accent bar 補上後 home 兩個 H2 跟其他頁面标題語言一致;light/dark 兩個主題的層次都算清楚,CLI run 面板裡「ready to compose」那行 fix 後清楚可讀;`recent-changes` 面板改完的 padding/字級比例看起來恰當,不會太擠也不會太鬆;`theming` presets 表格在桌機寬度下正常顯示(overflow 修復是防禦性的,這個寬度本來就用不到,沒有回歸);roadmap 頁的跑馬燈只是截圖抓到動畫過程中chip 被裁到一半,不是真的版面錯誤。這輪快照存在 scratchpad,沒有進 repo(用完即丟,不是要建立 approved baseline 的視覺回歸測試)。

**影響**:Phase 4 三項(home 首屏創意重新設計、long-form/component docs 超規範視覺提升)不再是「完全卡住」的狀態,但目前這輪快照沒抓到具體要修的東西——不是「看不到所以不能做」,是「看了一輪,現況已經夠好,沒有明顯要改的」。之後如果要往「更精緻」的方向推,需要具體方向(例如使用者指定想要哪種視覺調性、或針對特定頁面截圖挑毛病),而不是我自己盲目加東西。

- [x] 跑 build/lint/test 後再拆分 commit:整理基線、視覺翻新、重構驗證分開提交,避免之後 review 時混在一起

**已完成(2026-08-15,回顧確認,非額外動作)**:這條講的是整個 P29 執行期間該遵守的紀律,不是單一動作。回頭看這次系列從 Phase 1 開始的每一個 commit(`f808806` 到目前為止共 10+ 個),每次都是改完立刻跑 `tsc --noEmit`/`eslint`(共用層改動另外跑過 `ng build docs` 全站編譯),而且每個 commit 都是單一主題(token 修復自己一個、每個 Phase 1 open decision 自己一個、每個 Phase 2 稽核發現自己一個、Playwright 基礎設施自己一個),沒有把不同性質的改動混在同一個 commit 裡。這條規則從一開始就有落實,不是事後才補的動作,標記完成只是確認回顧。

- [x] 將完成項目的查證、決策與驗證結果移到 `DEVLOG.md`,並同步必要的方向性摘要到 `ROADMAP.md`

**已完成(2026-08-15)**:`DEVLOG.md` 的部分本來就隨每個項目完成同步在寫(見上面一路的條目)。`ROADMAP.md` 的部分還沒做,這次補上——P29 大部分是內部品質工作(token/對比度/字級規範),不算「產品方向」,不需要整個搬進 ROADMAP,只挑兩個真的對外部使用者/貢獻者有意義的部分寫成「Recently shipped」:(1) docs 站現在有 Playwright e2e 覆蓋,`pnpm test:e2e:docs` 可以跑;(2) docs 站的視覺系統(token/對比度/字級間距規範)整理成 `DOCS_VISUAL_SYSTEM.md` 這份文件。同時把「Quality infrastructure」段落原本就列的「Visual regression testing for CSS changes」這條補充說明——e2e runner 已經有了,但沒有 approved baseline/screenshot diffing,那個還是沒做,不要誤以為這條已經打勾。

- [x] 將已證明穩定的重複 layout 抽成 docs-only Angular component,避免頁面模板持續複製長串 class

**已完成(2026-08-15)**:全站最大宗的重複是 `<app-component-page-code-block>` 外面手動包一層 `<div class="overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]">`(有些帶額外 `mt-6`/`mt-4`/`min-w-0`)——grep 出 95 處,幾乎每個 component page 的「Usage」section 跟部分 long-form 頁(`cli`/`registry`/`introduction`/`mcp`)都在重複同一段。沒有另外新建一個包裝元件,而是直接把框樣式移進 `ComponentPageCodeBlock` 自己的 `host` binding(`rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-code)]` 現在是元件自己的,不用消費端再包)——這樣比「抽成新元件再全站替換」更乾淨,少一層 DOM,也少一個新元件要維護。交給背景 agent 做機械性清理:79 處純框 wrapper 直接刪除,14 處帶額外 margin class(`mt-6`/`mt-4`/`min-w-0`)的把 margin 移到 `<app-component-page-code-block>` 標籤自己的 `class` 上再刪除 wrapper,共 56 個檔案。2 處正確跳過沒有動:`theming-code-panel.component.ts`、`theming-playground-section.component.ts` 的 wrapper 裡除了 code-block 還有一個檔名/語言標籤列的 header,不是純框,agent 有正確識別出來保留。

**驗證**:agent 自己跑過 `tsc --noEmit`/`eslint`/`ng build docs` 都乾淨,我又獨立重跑一次三項確認(不是只信任 agent 的回報)。另外用 Playwright 截圖 + `Read` 工具肉眼比對了 `badge`(純框案例)、`registry`(帶 `mt-6` 案例)、`theming` 全頁(含兩個正確跳過的案例)——三種情況渲染結果都正常,沒有雙重邊框、沒有斷開的縫隙,`mt-6` 移到元件標籤上之後間距跟改之前一樣。這是這次系列第一次能用真的肉眼驗證取代「盲目相信沒問題」,比純看 build 綠燈更有信心。

- [x] Phase 4 重新開題:把「沒有具體待辦」改成 Sanring 風格差異化 backlog

**已完成(2026-08-15,使用者指定方向)**:使用者明確提出 Phase 4 不是要修既有 bug,而是希望重新開始設計視覺,並且盡量跟原生 shadcn 拉開差距、提高 Sanring 的風格辨識度。回頭整理 TODOLIST 後判斷:這跟已完成的 Phase 2 不重複。Phase 2 處理的是「符合規範」與可用數字/codebase 先例驗證的視覺收斂;Phase 4 處理的是品牌辨識度、視覺記憶點與掃描體驗,也就是超出規範以外的設計提升。因此把 `TODOLIST.md` 的 P29 Phase 4 從「已解封,但目前沒有具體待辦」改成「視覺精修與 Sanring 風格差異化」,保留 home / long-form docs / component docs 三個 epic,並新增 Direction、Home、Long-form Docs、Component Docs、Verification 五組可執行拆解。

**設計決策**:Phase 4 的視覺 thesis 寫進 `apps/docs/DOCS_VISUAL_SYSTEM.md`:Sanring docs should feel like a compact engineering control surface for installing, inspecting, and composing Angular UI primitives。後續翻新要避免走 shadcn clone 路線(大留白、黑白灰、單純 code preview card),改以 CLI command center、registry nodes、component dependency graph、token mapping、install result timeline、agent-readable status 作為 Sanring 自己的產品視覺語彙。mint accent 應用在訊號線、狀態燈、active edge、命令結果,而不只是 CTA 顏色;radius 與陰影維持專業工具感,避免大圓角、大陰影、行銷式漸層。

- [x] Phase 4 第一批實作:Home 首屏改成 Sanring command center

**已完成(2026-08-15)**:先從最能定義整體風格的 home page 下手,把原本偏「文件 hero + registry/CLI 卡片」的右側視覺改成更明確的 command center。首屏右側新增 4 段 pipeline status(resolve/install/compose/verify)、registry graph(帶 source 節點與 ready 狀態)、CLI run 面板(命令、0 drift、resolved/mapped/ready 輸出)、底部 signal strip(components/docs token/MCP)。mint accent 改用在訊號線、狀態點、active edge 與命令輸出,不只是 CTA 色。首頁文案也同步改成「installing, inspecting, and composing Angular UI primitives」的控制面語氣,四張 feature card 從一般 highlights 改成 Install / Inspect / Compose / Ship 的工作流敘事。這一批只動 home 與 i18n,沒有展開 long-form/component docs,避免一次把 Phase 4 全部混在一起。

**驗證**:`pnpm exec tsc --noEmit` 通過;`pnpm lint` 通過。Playwright 需啟動 localhost dev server,在 sandbox 內直接跑會被 `listen EPERM 127.0.0.1:4310` 擋下,用 escalated local server 跑 `pnpm exec playwright test --config=apps/docs/playwright.config.ts apps/docs/e2e/home.spec.ts apps/docs/e2e/mobile-shell.spec.ts apps/docs/e2e/theme-toggle.spec.ts`,10 tests 全過。另用 Playwright 等 `h1` 後拍 home light/dark/mobile 快照到 `/tmp`,肉眼檢查桌機 light/dark 沒有重疊或破版,dark 版的 command center 辨識度明顯提高;手機 390px 無水平溢出,CTA 與 command center 依序堆疊,資訊密度偏高但可讀。

**後續修正(2026-08-15,使用者截圖回報)**:使用者指出兩個問題:(1) registry graph 的垂直線和節點沒有對齊;(2) hero 底部 signal strip(`52/docs-*/MCP`)跟下方 Registry snapshot 的 Components/Registry/CLI 概況資訊打架。修法:registry graph 改成 `grid-cols-[12px_minmax(0,1fr)]`,點和線放在同一個固定軌道,線從第一點中心延伸到最後一點中心,不再用卡片絕對定位往左推;hero signal 改成三個特色訊號(`source-owned`/`token-visible`/`agent-readable`),下方 snapshot 改成 Inventory/current docs coverage/source channel/install tool,並把原本不明確的 `1 Registry` 改成 `source Source channel`,讓上方講「特色」、下方講「概況」,避免重複。`pnpm exec tsc --noEmit`/`pnpm lint` 通過,Playwright home/mobile/theme subset 10 tests 全過,重新截圖確認暗色版點線已對齊、資訊層級分開。

**首頁重做嘗試撤回(2026-08-15,使用者重新定義方向後的修正)**:使用者明確表示首頁目前只有 `Curated component entry points` 區塊令人滿意,但這不代表要把該區塊的語彙擴張成整站方向。依此曾嘗試移除 command center、signal strip、snapshot 與四張 workflow cards,改成首頁入口、系統導覽、元件索引與後續文件探索的版面;使用者隨後明確指出這個調整後的 home page 很差。因此此實作已撤回,首頁檔案與首頁 i18n 文案回到改動前狀態。後續不得沿用這版產品入口 / 系統導覽配置作為基礎,正確狀態是「首頁仍待重新設計」。

**撤回驗證**:已確認工作樹只剩 `TODOLIST.md`、`DEVLOG.md`、`apps/docs/DOCS_VISUAL_SYSTEM.md` 三個紀錄檔變更;`home-page.component.ts` 與首頁中英文 i18n 檔已無本次錯誤方案 diff。

**Phase 4 首頁首屏與節奏重新實作(2026-08-16)**:使用者撤回前一版後,從乾淨舊版重新執行 Home epic。新方向採開放式 editorial hero:左側用 source-first 主張、清楚的 metadata spacing、兩個主要 CTA 與三個可掃描 proof signals;右側改成正常流動的 `Source composition` panel,以 button/dialog/toast 三個 primitive 呈現 source、compose、ready 的產品證據,沒有使用會裁切內容的絕對定位或過度裝飾。第二區塊改成「Build close to the edge」+ 三個獨立工程證據卡,第三區塊保留使用者認可的 `Curated component entry points`,最後以 introduction / CLI CTA 收束。中英文首頁文案同步更新。

**驗證**:`pnpm exec tsc --noEmit`、`pnpm lint`、`git diff --check` 通過;development bundle 成功。Playwright 首頁、mobile shell、theme toggle 共 10 tests 全部通過;1440px desktop 與 390px mobile 截圖確認首屏、source composition panel、Curated directory 均完整,且無水平 overflow。

**Phase 4 Long-form Docs 視覺提升完成查證(2026-08-17)**:`introduction`/`theming`/`cli`/`mcp`/`registry`/`roadmap`/`version-notes`(changelog)七個 long-form 頁面都已加上對應的工程感視覺區塊:CLI page 是「CLI WORKFLOW」面板,含 command groups 側欄(init/add/inspect/verify)、四步驟流程線(intent→resolve→preview→apply,虛線連接)、`--dry-run` 結果面板與 exit-0/dry-run/diff 三張 exit state 卡片;Registry page 是「REGISTRY MODEL」面板,含 `registry.json` schema 樹狀圖與 component→shared→block 三層 source graph;MCP page 是「AGENT TOOL MAP」面板,含 read→plan→write 流程列、三張工具卡片與右側「WRITE BOUNDARY」權限清單;Theming page 是「TOKEN CASCADE」面板,含 raw scale→semantic map→component reads 三段式關係與 light/dark 對照卡;Changelog page 是「RELEASE CONSOLE」面板,含 current/changes/notable 三個數字面板,取代原本的 news-feed 排版;Roadmap page 是「DELIVERY MAP」面板,含 shipped/tier1/tier2/tier3+ 四張數字卡;Introduction page 是「START HERE」三步驟導引。六條 checklist 逐條對應完成。

**驗證**:用 Playwright 針對七個頁面各跑 desktop light、desktop dark(`localStorage.setItem('sanring-docs-theme', 'dark')`)、mobile 390px 共 21 組截圖與檢查,全部零 console error。過程中抓到並修掉兩個真的 bug,而不是只信任「畫面看起來正常」:(1) `cli-page.component.ts`(dry-run 結果 checkmark)與 `mcp-page.component.ts`(WRITE BOUNDARY 的 read/safe 標籤)把 `--docs-success-fg`(設計給淺色 `--docs-success-bg` 底用的深綠色文字)直接疊在深色 `--docs-code` 背景上,對比度幾乎看不見,改用 `--docs-success`(淺綠)修正,同批同時確認 mcp 的「safe by default」徽章與 changelog 的 `added` 標籤都有正確搭配 `--docs-success-bg`,不需要動;(2) changelog page 在 390px 手機寬度有 67px 的頁面級水平 overflow,根因是 release notes 內文用 `renderInlineCode()` 產生的 inline `<code>` token(例如 `` `aria-multiselectable="true"` ``)沒有換行規則,長 token 撐開了 `min-w-0 flex-1` 的 flex 容器並一路往上傳導到頁面根層級;在 `INLINE_CODE_CLASS` 加上 `break-words` 後 overflow 歸零,同名的 `INLINE_CODE_CLASS` 在 `mcp`/`registry`/`cli` 三個檔案目前沒有觸發同樣的問題,故未預防性修改。另外排除了兩類誤判:各頁 code block 的 `overflow-auto` 是既有的可橫向捲動樣式,屬預期行為;roadmap page 的 `documented-components__row`(`overflow-hidden` 裁切一個更寬的動畫 track)是既有的跑馬燈裝飾動畫,非本次新增內容,也非 bug。

## 查證後確認「不算差距」的項目(備查,避免重複討論)

- **PR 沒有測試/型別檢查關卡**:原 P0 已完成,不再放主 todo。已新增 PR 觸發的 CI workflow,跑 `pnpm test`、`tsc --noEmit`、`pnpm lint`。
- **可編輯 playground(Monaco/StackBlitz 匯出)**:查證後 shadcn 自己的元件文件頁也是「靜態 demo + 程式碼區塊」,沒有即時可編輯的 playground,兩邊打平,不是缺口。
- **文件版本切換(per-CLI-version docs)**:shadcn 文件站同樣沒有明顯的版本切換機制,兩邊打平,不是缺口。

## Phase 4 視覺驗證(2026-08-17)

- [x] 用 Playwright 重拍 home light/dark/mobile、代表性 long-form page 與 representative component page
- [x] 檢查 360px / 390px 無水平 overflow、長 command/code line 不撐破版面、中英文文案沒有互相遮擋
- [x] 將設計決策、截圖觀察與驗證結果同步到本紀錄

**設計決策**:本輪驗證以 home、CLI、registry、MCP、theming、introduction 與 `button` component page 作為代表樣本。Home light/dark 保留「Angular primitives owned by your app」的左重右輕首屏,右側 terminal/source proof panel 作為安裝結果證據;CLI 以 command groups、intent→resolve→preview→apply 流程與 dry-run result summary 作為長頁代表;registry、MCP、theming 分別驗證 source graph、read/plan/write boundary、token cascade 的工程視覺語彙;`/components/button` 用來確認 component docs 的 header、TOC 與內容欄位仍可掃描。

**截圖觀察**:

- Home light/dark: H1、說明、CTA 與右側 source/terminal panel 均完整,暗色主題正確套用,沒有裁切或重疊。
- Home 360px / 390px: mobile header、搜尋列、version notes、H1 與兩個 CTA 依序排列;CTA 沒有互相擠壓,首頁沒有水平溢出。
- CLI 360px / 390px: page header 文案正常換行,CLI WORKFLOW 面板由 command groups 轉為垂直閱讀,長 command 保持在 code surface 內。
- Introduction、registry、MCP、theming、button component: header、主要工程證據面板、TOC/內容結構均正常渲染,沒有看到中英文文案遮擋。

**驗證結果**:

- `phase4-visual-verification.spec.ts`: **5 passed**(desktop light routes、dark home、360px、390px、long code line containment)。
- 既有回歸 suite(`long-form-page.spec.ts`、`home.spec.ts`、`mobile-shell.spec.ts`、`theme-toggle.spec.ts`): **14 passed**(desktop/mobile)。
- 本輪截圖存於 `/tmp/sanring-phase4-*.png`,未加入 repository;驗證 spec 新增於 `apps/docs/e2e/phase4-visual-verification.spec.ts`。

---

## P27 — `sanring search --json` 崩潰(全庫自檢時發現,非既有 P27 條目)

**發現(2026-08-19)**：用 `/audit-sweep` 對 `packages/cli` 做完整性掃描時,注意到 `search.ts`/`migrate.ts`/`info.ts` 是僅有的三個沒有對應 `*.test.ts` 的 command,特別針對這三個實際跑一次而不只是讀程式碼——`npx tsx packages/cli/src/index.ts search button --json --registry ./registry` 直接丟出 `ReferenceError: Cannot access 'installedNames' before initialization`。

**根因**：`search.ts` 的 `options.json` 分支（原本在第 74-85 行）在 `.map()` callback 裡讀取 `installedNames`,但 `let installedNames: Set<string> | null = null;` 的宣告在後面第 88 行才執行——同一個函式作用域內,`let` 的 temporal dead zone 讓这个提前引用直接拋錯。只要 `search --json` 有至少一筆結果就必定崩潰,零筆結果的空陣列分支因為在宣告之前 return 反而不會觸發。沒有任何測試覆蓋到這個 command,所以這個 bug 從新增 `--json` 那次改動起就一直存在没被發現。

**修法**：把 `installedNames` 的宣告與計算搬到 `options.json` 分支之前（緊接在 `matches.length === 0` 的 early return 之後),讓兩個輸出分支(JSON/人類可讀)都能安全讀到它,不改變任何行為語意。

**驗證**：修復後重跑同一條指令,`search button --json` 正確輸出含 `installed` 欄位的 JSON;`pnpm --filter @sanring/cli test`(`packages/cli` 目錄下 `npx vitest run`)175 個既有測試全數通過。`info.ts`/`migrate.ts` 沒有發現同類問題,但仍缺測試檔,已記在 `TODOLIST.md` P27。

**範圍限制**:Component Docs 全面掃描效率與工程證據尚未完成,所以本輪只用 `/components/button` 作為 representative component page;其餘 component docs 完成後,應用同一套驗證重新覆蓋。

## P29 Phase 4 — Component Docs 掃描效率與工程證據收斂(2026-08-22)

**已完成**:本輪將先前已建立的 metadata/evidence 資料層收斂成一套明確的 component reference surface,改動全部落在共用 `component-page-*` primitives,因此一次覆蓋 52 個 component pages:

- Header 把 install command 與 package path 提升成主要 manifest panel;registry name、shipped status、shared deps、SSR/browser boundary、a11y、keyboard、state model 與 latest version 收斂成第二層 evidence chips,並新增 Installation/API/Recent changes 快速 anchor。Radio 因 API 拆成 group/item 兩張表,專用 anchor 指到 `#api-group`。
- Previewer 採 `01 Preview` / `02 Source` 兩區清楚標頭與 rendered/copy-ready 狀態,並把預覽高度壓到 desktop 320px、mobile 280px。沒有重新引入 Preview/Code tabs:先前使用者已要求撤回會隱藏 code 的 tabs,所以這次保留 demo/source 同時可見,用層級而非隱藏來提升掃描效率。
- API reference 新增 row count/reference header、編號、type code pill 與更緊湊的 desktop columns;mobile 維持 cards,但將 type/default 改成雙欄、description 獨立收尾,長型別與預設值仍可斷行。
- Recent changes 從一般頁尾面板改成最多 3 筆的 compact release strip,保留 version/date/type/breaking/text 與完整 changelog 入口。
- 安裝指令在手機版改用 surface 內橫向捲動,避免 CLI token 在單字中間斷行;頁面本身仍維持零水平 overflow。

**視覺觀察**:Button 作為簡單基準時,manifest 與 Preview/Source 層級可在第一屏辨識;Dialog 的 keyboard/a11y/state evidence 可正常換行;Table 的寬 demo 與高密度 API 沒有撐破 content rail。Light/dark 的 command surface 均保持深色 code 語彙,mint 只用在 status/index/active signal。Mobile header 會把 command/path 疊成單欄,evidence chips 與 jump links 自然換行;API cards 在 360px/390px 仍可掃描。

**驗證**:`pnpm exec tsc --noEmit`、scoped ESLint、`git diff --check` 通過;Angular development bundle 冷啟動成功。Playwright 更新 component-page assertions 來覆蓋 install command、Installation/API anchors、Preview/Source 同時可見、API reference surface、recent changes 與 Radio 的 `#api-group`;Phase 4 視覺矩陣擴充為 Button/Dialog/Table 的 desktop light、desktop dark、360px、390px,並對 header/previewer/API/release strip 另拍局部截圖。Desktop Chromium **11 passed**、mobile Chromium **11 passed**。

---

## P30 — `checkbox` Enter 鍵「無法切換」查證後確認不是缺口

**查證(2026-08-19)**：`/audit-sweep` 全庫掃描把 `checkbox.component.ts:70` 的 `(keydown.enter)="$event.preventDefault()"` 列成 ❌,理由是「攔掉了原生 `<button>` 的 Enter→click 行為,導致 Enter 鍵無法切換 checkbox」。動手修之前先比對同批用 `<button>` 冒充其他互動 role 的元件,發現這其實是刻意設計：

| 元件 | 冒充的 role | Enter 鍵是否被攔截 | 對應的 WAI-ARIA APG 鍵盤規範 |
| --- | --- | --- | --- |
| `switch` | `switch` | 否 | switch pattern：`Enter or Space` 都是合法啟動鍵 |
| `radio-item` | `radio` | 是（`radio-item.component.ts:47`,同一行寫法） | radio pattern：只有 `Space`/方向鍵,Enter 不列入 |
| `checkbox` | `checkbox` | 是 | checkbox pattern：**只有 `Space`**,Enter 不列入 |

原生 `<button>` 元素 Enter/Space 都會觸發 click,但這三個元件是拿 `<button>` 冒充三種不同 ARIA role,各自角色的鍵盤規範不同。`checkbox`/`radio` 用 `preventDefault()` 蓋掉 Enter 只留 Space,`switch` 完全不攔截,三者各自對得上規範且彼此一致,不像是意外遺漏同一行程式碼——如果是遺漏,`switch` 沒有理由「剛好」沒有這個問題。

**結論**：不修改程式碼。已把 `TODOLIST.md` P30 裡這條從 ❌ 清單移除,改記一筆「查證後排除」的說明,避免下次重新調查同一個問題。`checkbox.component.spec.ts` 目前確實沒有 Enter/Space 鍵盤測試,如果之後要補,測試應該斷言「Enter 不切換、Space 才切換」,而不是反過來。

---

## P30 — `sheet` SSR crash 修復(`document.activeElement`/`document.body.children` 未保護)

**根因**：`sheet-content.component.ts` 的「attach/detach overlay」`effect()`（原第 142-148 行）直接呼叫 `attachOverlay()`，內部讀 `document.activeElement`（記錄開啟前的焦點，供關閉時還原）與透過 `hideBackgroundFromAssistiveTech()` 讀 `document.body.children`（把背景內容標成 `aria-hidden`）。這兩個都是裸的全域 `document`，不是注入的 `DOCUMENT` token。同一個檔案上面的 scroll-lock effect 已經用 `afterNextRender()` 包住等價的 `document`/`window` 存取，並在註解裡明確寫了原因；attach/detach 這個 effect 沒有比照辦理。若 `<sanring-sheet [isOpen]="true">` 在 SSR 環境初始就是開啟狀態，建構子執行時這個 effect 會在伺服器端同步觸發，直接對著沒有 `document` 的環境呼叫 `document.activeElement`，丟出 `document is not defined`。

**修法(非改動 effect 時序)**：沒有採用「把整個 attach/detach effect 包進 `afterNextRender()`」的做法——那個 effect 的同步執行時機被下面「開啟後 focus 面板」的 effect（用 `afterNextRender` 等 attach 真的 commit 完）依賴，貿然把 attach 本身也搬進 `afterNextRender` 有可能打亂兩個 effect 之間微妙的排程順序，且 CDK 的 `Overlay`/`OverlayRef`/`TemplatePortal` 本身透過注入的 `DOCUMENT` token 運作，SSR 是安全的，真正有問題的只有 `attachOverlay()` 內那兩行裸 `document` 存取。改成注入 `@angular/cdk/platform` 的 `Platform`（`command-dialog.component.ts` guard `navigator` 用的就是這個服務，屬於既有慣例），只把 `document.activeElement`/`hideBackgroundFromAssistiveTech()` 這兩行包進 `if (this.platform.isBrowser)`，其餘程式碼、effect 執行時機完全不動。`packages/ui`/`registry` 兩份完全同源，一次改完（僅 import path 不同）。

**驗證**：新增 regression test（`sheet.component.spec.ts`）：把 `Platform.isBrowser` 覆寫成 `false`，`vi.spyOn` 監看 `document.activeElement`/`document.body.children` 的 getter，開啟 sheet 後斷言不拋錯、面板仍正常掛進 DOM、且這兩個 getter 完全沒被呼叫。修復前手動移除 guard 重跑這個測試,確認會如預期失敗(`expected "get activeElement" to not be called at all, but actually been called 1 times`),證明測試真的抓得到這個回歸,而不是一個永遠綠燈的假測試；修復還原後重跑,`sheet.component.spec.ts` 11 個測試全過。`pnpm exec tsc --noEmit -p packages/ui/tsconfig.lib.json` 通過；`check-registry-parity.mjs`/`check-registry-sync.mjs` 皆綠燈。

---

## P30 — `role="button"` 缺鍵盤支援的三個獨立元件修復（`button`/`context-menu-trigger`/`sidebar-trigger`）

全庫掃描抓到三個元件各自獨立踩到同一種模式——設了 `role="button"` 卻沒有讓元素真的可以用鍵盤聚焦/觸發。三者的根因跟修法並不相同，分開處理：

**`button`**：`button.directive.ts` 的 `sanringBtn` 套在沒有 `href` 的 `<a>` 上時給了 `role="button"`，但 `tabindex` 只在 `disabled()` 時設成 `-1`，非 disabled 情況完全沒有 `tabindex`，也沒有任何 keydown handler。修法：新增 `hostTabIndex` computed——`isAnchor && hasHref` 走原生 `<a href>` 的天然可聚焦性（不設 tabindex）；`isAnchor && !hasHref` 依 `disabled()` 給 `0`/`-1`；`<button>` 元素維持 `null`（原生已可聚焦）。同時新增 `handleActivationKey`，只在 `isAnchor && !hasHref && !disabled()` 時對 `keydown.enter`/`keydown.space` `preventDefault()` 後呼叫 `this.elementRef.nativeElement.click()`，讓消費者原本掛在同一個 host 上的 `(click)` binding 正常觸發——這樣做而不是直接呼叫某個 app 層 handler，是因為 `ButtonDirective` 是通用元件，不知道消費者在 `(click)` 上綁了什麼。`packages/ui`/`registry` 同源修完。

**`context-menu-trigger`**：`context-menu-trigger.directive.ts` 的 host 設了 `role: 'button'`（檔案內既有註解已說明這只是「最接近的近似值」，因為 `aria-haspopup`/`aria-expanded` 需要合法 role 才能過 axe-core），但完全沒有 `tabindex`。這裡刻意**沒有**比照 `button` 補 Enter/Space handler——ARIA APG 沒有「context menu trigger」這個正式 pattern，Enter/Space 不是右鍵選單的鍵盤等價操作，真正的等價操作是 `Shift+F10`/鍵盤上的選單鍵，瀏覽器本身就會把這兩個按鍵轉成一個真正的 `contextmenu` DOM 事件（座標會落在目前 focus 的元素附近），而這個事件本來就已經被既有的 `(contextmenu)` handler 處理。所以整個修法只有一行：補 `tabindex: '0'`，讓這塊「右鍵區域」可以先被鍵盤聚焦到，後續瀏覽器原生行為自然接上。

**`sidebar-trigger`**：`sidebar-trigger.directive.ts` 的 selector 是不受限的 `[sanringSidebarTrigger]`，同目錄的 `sidebar-rail.directive.ts` 則限制在 `button[sanringSidebarRail]`。查過全 repo（`apps/docs` 三處демо、`sidebar.docs.ts` 四處程式碼範例、`sidebar.component.spec.ts` 兩處測試）target 元素 100% 都已經是 `<button>`，所以把 selector 收緊成 `button[sanringSidebarTrigger]`（比照 `sidebar-rail`）對現有用法零行為改變，但讓 Angular 的 template 型別檢查在編譯期直接擋下「套在非 button 元素」這種誤用，比起在 directive 內補 `role`/`tabindex`/keydown 去支援任意元素更safe——後者等於變相鼓勵大家把它套在 `<div>` 上。

**驗證**：
- `button.directive.spec.ts` 新增兩個測試：hrefless anchor 有 `tabindex="0"`、Enter 與 Space 各自都會觸發 `(click)` binding；`a[href]` 確認沒有被多加 `tabindex`。新增的 `(click)` 測試 fixture 觸發了 `@angular-eslint/template/click-events-have-key-events`/`interactive-supports-focus` 兩個 lint false positive（linter 看不到 `sanringBtn` directive 自己補的鍵盤支援），比照專案既有的 `label-has-associated-control` false positive 慣例補了註明原因的 `eslint-disable-next-line`。8 個測試全過。
- `context-menu.component.spec.ts` 新增一個測試斷言 trigger 有 `tabindex="0"`。12 個測試全過。
- `sidebar.component.spec.ts` 原有 6 個測試全過（selector 收緊沒有影響任何既有行為）；`ng build docs --configuration=production` 成功，確認全站唯一的三處 `sanringSidebarTrigger` 用法都合法通過新的 template 型別檢查。
- `packages/ui` 全量：`pnpm exec ng test "@sanring/ui" --watch=false` 70 個 spec 檔、394 個測試全過；`pnpm lint` 乾淨；`check-registry-parity.mjs`/`check-registry-sync.mjs` 皆綠燈。

**尚未處理**：`context-menu-item`/`sub-trigger` 等選單項目「每個都同時帶 `tabindex="0"`、不是 roving single-tabstop」的問題（見 `TODOLIST.md` P30 ⚠ 清單）跟這次修的 trigger 缺 tabindex 是不同層次的問題，本輪沒有動。

---

## P30 — 6 個元件的 API 完整性修復（`hover-card`/`navigation-menu`/`transfer`/`input`+`textarea`/`link`/`file-upload`）

延續 P30 全庫掃描的 ❌ 清單，逐一修完以下 6 組缺口（`packages/ui`/`registry` 同源修改，僅 import path 不同）：

**`hover-card`**：`hover-card-trigger.directive.ts` 補 `'[attr.aria-expanded]': 'hoverCard.isOpen() ? "true" : "false"'`，`hoverCard.isOpen()` 已經是既有的 public signal，純粹是漏綁。

**`navigation-menu`**：`navigation-menu-content.component.ts` 的 `role="region"` 補 `ariaLabel`/`ariaLabelledBy` 兩個 input 與對應的 `[attr.aria-label]`/`[attr.aria-labelledby]` binding，比照同目錄 `navigation-menu.component.ts` 既有的寫法。

**`transfer`**：`transfer.component.ts`（root `<sanring-transfer>`）補 `class` input 與 `[class]` host binding（用 `cn()`），比照同目錄 `transfer-panel`/`transfer-header`/`transfer-action` 既有的 `cn()`-merge 慣例。因為 Angular 的靜態 `class="..."` 屬性跟元件自己的 `[class]` host binding 是分開合併（union），不是互相覆蓋，所以這個修改對 docs demo 既有的 `class="flex items-stretch gap-2"` 寫法零風險。

**`input` + `textarea`**：兩個 directive（`input.directive.ts`/`textarea.directive.ts`）都直接 `implements SanringFieldControl<string>`（不像 `checkbox`/`file-upload` 走獨立 adapter class），介面要求 `id: string` 必須是一般字串屬性，原本的 `id = uniqueId('sanring-input')` 是一般 class field，透過 `'[id]': 'id'` host binding 輸出——host property binding 每次 CD 都會覆蓋 DOM 上的 `id`，導致消費者在 `<input sanringInput id="my-id">` 手寫的 `id` 永遠被蓋掉。修法：把捕捉消費者輸入的職責拆給一個另外命名、alias 回 `'id'` 的 `input()`（`idInput`），解析出來的 `id` getter 再回填給 host binding：

```ts
// eslint-disable-next-line @angular-eslint/no-input-rename
readonly idInput = input<string | undefined>(undefined, { alias: 'id' });
private readonly generatedId = uniqueId('sanring-input');
get id(): string { return this.idInput() ?? this.generatedId; }
```

這個「另外命名 + alias 回介面要求的名字 + eslint-disable」模式不是新發明的——`combobox-item.component.ts`（`disabledInput` alias 回 `disabled`，因為 `Highlightable` 介面同樣要求 `disabled` 是一般屬性）已經是同一個問題的既有解法，直接沿用。**`textarea` 不在本輪 P30 掃描找到的 ❌ 清單裡**（batch 6 稽核回報「✅ No findings」），但讀 `input.directive.ts` 時發現它是逐字複製的同一份程式碼、同一個 bug，順手一起修了，避免下次稽核才重新發現。

**`link`**：`link.directive.ts` 的 `computedClass()` 寫了 `disabled:pointer-events-none disabled:opacity-50`，但套在 `a[sanringLink]` 上——原生 `:disabled` 偽類不會匹配 `<a>`，這段 CSS 從來沒生效過，而且整個 directive 完全沒有 `disabled` input、`aria-disabled`、或 `tabindex` 機制。比照同一個 repo 已經做對的 `navigation-menu-link.directive.ts`：補 `disabled` input（`booleanAttribute`）、`aria-disabled` binding、`resolvedTabIndex`（沿用 `navigation-menu-link` 的 `baseTabIndex` 快照寫法，保留開發者手寫的 tabindex，disabled 時強制 `-1`）、`aria-disabled:` class 變體取代原本失效的 `disabled:`、以及 click guard。

**`file-upload`**：兩處都缺 disabled 反映——`file-item.component.ts` 的 remove 按鈕補 `[disabled]="upload.isDisabled"`（native `<button>` disabled，同時擋滑鼠跟鍵盤）與 `remove()` 內的 guard；`file-trigger.directive.ts`（selector 是不限元素的 `[sanringFileTrigger]`，檔案內註解說明是刻意「簡化 selector 提升 DX」，不像 `sidebar-trigger` 是遺漏，所以沒有收緊 selector）補上跟 `collapsible-trigger.directive.ts` 一致的 `isNativeButton` 判斷 host block（native `<button>` 用 `disabled` 屬性，非 native 用 `role`/`tabindex`/`aria-disabled`），現有用法 100% 是 `<button>` 所以這組新 binding 全部評估成 `null`、零行為改變。

**驗證過程中發現的環境陷阱（值得記錄，避免下次重踩）**：一開始幫 `file-upload` 兩處寫 regression test 時，用「建立 fixture → `detectChanges()` → 改一個 host 端一般 class field（例如 `fixture.componentInstance.disabled = true`）→ 再呼叫一次 `detectChanges()`」的寫法斷言子元件跟著更新，測試一直斷言失敗。寫了一個完全獨立、跟 file-upload 無關的最小重現（一個 root 元件單純 `{{ flag }}` 插值，改 `flag` 後呼叫兩次 `detectChanges()`）才確認：**這個 repo 的 Angular 22 + vitest 測試環境下，`ComponentFixture.detectChanges()` 對「純粹外部改一個一般 class field、沒有透過 signal 或 DOM event」的改動是靜默 no-op**——用一個插值呼叫次數計數器直接證實第二次 `detectChanges()` 完全沒有重新執行樣板的 render function。這跟傳統 zone.js Angular「非 OnPush 元件永遠整棵重查」的直覺不同，本專案的測試環境顯然是 signal-driven（zoneless 或等效行為），CD 只在真正的 signal write / DOM event 時才會標記重繪。修法：測試裡要反映「之後才變成 disabled」這種情境，必須直接呼叫元件自己的 signal-based method（例如 `FileUploadComponent.setDisabledState(true)`，內部是 `this.disabledState.set(true)`），而不是改一個外部 host 元件的一般欄位再指望 rebind 傳下去；`fixture.componentRef.setInput(...)` 是另一個官方對應解法，但只適用於改「fixture 本身的 root 元件」的 input，不適用於改「root 元件模板裡自己的一般欄位」這種情境。這個限制也解釋了為什麼這個 repo 既有的所有「disabled 情境」測試,無一例外全部是用「建立 fixture 前就把 disabled 設好」的寫法（例如 `setup({ disabled: true })`），從來沒有「先建立、之後才 toggle」的寫法——不是巧合，是因為後者在這個測試環境下本來就不會動。

**驗證**：
- `hover-card`：既有 spec 全過（沒有新增獨立測試，`aria-expanded` 屬於既有 a11y 檢查表的一部分，後續可在 `/audit-component hover-card` 時補專屬 regression test）。
- `navigation-menu`：既有 spec 全過。
- `transfer`：既有 spec 全過。
- `input`/`textarea`：`input.directive.spec.ts`/`textarea.directive.spec.ts` 各新增兩個測試（自訂 id 被保留、沒給 id 時 fallback 到產生的 id），共 4 個新測試,連同既有測試全過；`input.field.spec.ts`（CVA/Field 整合 regression）同步跑過確認沒有受影響。
- `link`：`link.directive.spec.ts` 新增一個測試斷言 `aria-disabled="true"`、`tabindex="-1"`、click 被攔截，全過。
- `file-upload`：`file-trigger.directive.spec.ts`/`file-upload.component.spec.ts` 各新增一個測試（用上面提到的 `setDisabledState()` 寫法），全過；兩個新測試都先手動移除對應修復、確認測試真的會紅（`expected false to be true`），再還原修復確認轉綠，證明測試真的抓得到回歸。
- 全量：`pnpm exec ng test "@sanring/ui" --watch=false` 70 個 spec 檔、**401** 個測試全過（比修復前的 398 多 3 個——`link` +1、`file-upload` +2；`input`/`textarea` 各 +2 但同時原本就有的測試數量打平，淨值算在對應檔案裡）；`pnpm lint` 乾淨（含新增的 `no-input-rename` disable comment）；`pnpm exec tsc --noEmit -p packages/ui/tsconfig.lib.json` 通過；`ng build docs --configuration=production` 成功；`check-registry-parity.mjs`/`check-registry-sync.mjs` 皆綠燈。

**TODOLIST.md P30 現況**：❌ 清單從 15 項降到 3 項（`calendar`/`date-picker` 的 ARIA 巢狀結構、`select` 缺 `disabled` input），這三項都需要更多設計判斷（`calendar`/`date-picker` 涉及重新設計 role 結構，`select` 需要決定是否要跟其他表單元件一致補 plain boolean input），暫緩到下一輪再處理。

---

## P30 — `select` 補齊一般 `disabled` boolean input

**查證**：跟使用者討論後確認這項其實不算大決策——同一個 select 家族裡 `select-item.component.ts` 早就已經在用「plain input alias 回 `disabled` + 跟 CVA state 用 `||` 合併」這個模式（`disabledInput`/`isDisabled`），只有 `select.component.ts`（root）跟 `select-trigger.directive.ts` 兩處沒跟上，一直只讀 CVA 專用的 `disabledState()`。所以不是要不要引入新設計，是把家族裡已經有前例、已經在用的既有模式補到少了兩處的地方。

**修法**：`select.component.ts` 仿照 `select-item` 既有寫法新增：

```ts
// eslint-disable-next-line @angular-eslint/no-input-rename
readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });
readonly isDisabled = computed(() => this.disabledInput() || this.disabledState());
```

`get disabled()`（`SanringFieldControl` 介面要求）、`setOpen()`、`selectValue()` 三處原本直接讀 `disabledState()` 的地方全部改讀 `isDisabled()`；`select-trigger.directive.ts` 的 `[disabled]`/`[attr.aria-disabled]` binding 與 `onClick()`/`onOpenKeydown()` 兩個 guard 同步改讀 `select.isDisabled()`。額外發現並一併修正一個關聯的小缺口：`select-item.component.ts:69` 自己的 `isDisabled` computed 原本讀的是 `this.select.disabledState()`（root 的原始 CVA state），不是新的 `isDisabled()`——這代表在這次修之前,就算之後幫 root 補了 plain `disabled` input,個別 item 也不會跟著變成 disabled,兩者会不一致。改讀 `this.select.isDisabled()` 後三層（root/trigger/item）行為統一。

**驗證**：`select.component.spec.ts` 新增 `SelectPlainDisabledHost`（`<sanring-select disabled>`，不透過 `FormControl`）與對應測試,斷言 trigger 的 `disabled`/`aria-disabled` 屬性正確,且點擊不會打開選單;測試先手動把 `select-trigger.directive.ts` 改回讀 `disabledState()`,確認測試真的會紅（`expected false to be true`），再還原確認轉綠。`select` 資料夾兩個 spec 檔共 17 個測試全過（原 16 個 +1 個新的）。`packages/ui`/`registry` 三個檔案（`select.component.ts`/`select-trigger.directive.ts`/`select-item.component.ts`）同步修改,`diff` 確認除了既有的 import path 差異外完全一致。全量：`pnpm exec ng test "@sanring/ui" --watch=false` 70 個 spec 檔、**402** 個測試全過；`pnpm lint` 乾淨；`pnpm exec tsc --noEmit -p packages/ui/tsconfig.lib.json` 通過；`ng build docs --configuration=production` 成功；`check-registry-parity.mjs`/`check-registry-sync.mjs` 皆綠燈。

**TODOLIST.md P30 現況**：❌ 清單只剩 `calendar`/`date-picker` 的 ARIA 巢狀結構這一組。已跟使用者討論過,`role="radiogroup"` 包 `role="grid"` 這個組合目前 axe-core（`calendar.component.spec.ts`/`date-picker.component.spec.ts` 都有跑 `expectNoA11yViolations`）並未判定為 violation,所以不是工具會擋的急迫問題,是嚴格照 ARIA spec 讀的理論缺口。候選解法（外層 host 的 `role="radiogroup"` 改成 `role="group"`，一個通用容器 role,不像 `radiogroup` 隱含子項必須是 `role="radio"`）已提出但尚未定案，暫緩。

---

## P30 — `calendar`/`date-picker` 的 `role="radiogroup"` 包 `role="grid"` 無效巢狀結構修復

**查證：先去查了姊妹 repo `/Users/jack755051/Project/sanring/date-picker`**（`@sanring/date-picker-core` 與 `@sanring/date-picker` 的原始碼,`packages/ui` 的 `calendar`/`date-picker` 透過 `hostDirectives` 用的 `CalendarGridDirective`/`GranularityGridDirective` 就是這個套件出的）,確認兩件事：

1. `@sanring/date-picker-core`（headless engine,套件說明就寫「zero DOM/CSS assumptions」）——`calendar-grid.directive.ts`/`granularity-grid.directive.ts` 完全沒有任何 role/aria 相關程式碼。這裡沒有「正確答案」可以抄,因為它本來就不管 ARIA 語意,這件事完全是消費端（`packages/ui`）自己的責任。
2. `@sanring/date-picker`（組裝好的 input + popup + grid 完整元件,拿 `date-picker-core` 組出來的參考實作）——整個套件**沒有任何地方用 `role="radiogroup"`**,日曆格子一律是乾淨的 `role="grid"` → `row` → `gridcell`。但它的 `aria-invalid`/`aria-required` 是掛在一顆真正的文字 `<input role="combobox">` 上,不是掛在格子容器上——這個技巧沒辦法直接搬過來,因為 `packages/ui` 的 `calendar`/`date-picker` 沒有 input,格子本身直接就是表單控制項（inline 使用,不是 input+彈出視窗）。

**所以兩個 repo 都沒有現成的答案,只能自己在 `packages/ui` 查證出正確解法**。用一個獨立的 throwaway spec（`aria-experiment.spec.ts`,驗證完就刪了,沒留在 repo 裡）直接對著這個 repo 自己的 axe-core 跑,逐一排除候選方案,而不是憑 spec 記憶猜：

| 候選方案 | 結果 |
| --- | --- |
| host `role="group"` + `aria-required` | ❌ `aria-allowed-attr` violation——`group` 不支援 `aria-required` |
| host `role="grid"`（單一 grid,無 radiogroup 包裝）+ `aria-required` | ❌ 同上,`grid` 也不支援 `aria-required` |
| host `role="group"` + `aria-invalid`／`aria-describedby` 單獨測 | ✅ 兩個都合法（`aria-allowed-attr` 沒有擋——這兩個是 global/widget attribute,`aria-required` 才是限定角色的那個） |
| `role="gridcell"`（正確巢狀在 `group` → `grid` → `row` 底下）+ `aria-required`／`aria-invalid` | ✅ 通過——`gridcell` 本來就是原始註解列出「支援 aria-required 的角色」清單裡的一個,只是原本沒人把它用在這裡 |

也考慮過改成 `radiogroup` 直接擁有 `role="radio"` 子節點（丟掉 `grid`/`gridcell`,徹底改成合法的 radiogroup 結構）,但查了 `calendar.component.ts` 才發現 `calendar`/`date-picker` 都支援 `range`/`multi` 選取模式（同時有多個格子是「in range」／被選中）,`radio` 的「同組只能有一個 checked」語意跟這個天生衝突,這條路也是死的。

**最終修法**：外層 host 從 `role="radiogroup"` 改成 `role="group"`,拿掉 host 上的 `[attr.aria-required]`；`aria-invalid`/`aria-describedby` 留在原地不動（反正 `group` 本來就支援）。`aria-required` 改成掛在逐個 `role="gridcell"` 按鈕上（`calendar-day.directive.ts`/`date-picker-cell.directive.ts`,inject 對應的父元件讀 `fieldRequired` getter,套用在整組 gridcell 而非只有目前 focus 的那一顆——跟既有的 `aria-selected`/`aria-disabled` 逐格子綁定風格一致,而不是只在容器層宣告一次）。`calendar-day.directive.ts`/`date-picker-cell.directive.ts` 因此需要 `inject(CalendarComponent)`/`inject(DatePickerComponent)`,跟父元件之間形成循環 import——這是這個 repo 既有、安全的既定模式（`select-item.component.ts` inject `SelectComponent`、`context-menu-item` inject `ContextMenuComponent` 等都是同一招,`inject()` 是執行期才解析,不是模組載入期的同步依賴,不會有實際的循環載入問題）。

**驗證**：`calendar.component.spec.ts`/`date-picker.component.spec.ts` 各自原本斷言 `aria-required` 在 host 上的既有測試(`renders month grids with host field attributes...`/`renders the picker grid with host field attributes...`)改成斷言每個 `role="gridcell"` 按鈕都有 `aria-required="true"`,不是斷言 host。兩邊各自的 `has no axe-detectable a11y violations` 測試（本來就存在,不是新加的）在改完後直接驗證了新結構真的乾淨——這比額外寫新測試更有說服力,因為這正是原本抓到問題的同一個把關機制。`packages/ui`/`registry` 四個檔案（`calendar.component.ts`/`calendar-day.directive.ts`/`date-picker.component.ts`/`date-picker-cell.directive.ts`）同步修改,`check-registry-parity.mjs` 一開始就正確抓到我漏改 registry 那邊（`aria-required` binding drift 訊息精準點出四個檔案),修完後綠燈。全量：`pnpm exec ng test "@sanring/ui" --watch=false` 70 個 spec 檔、**402** 個測試全過（測試數沒變,是改既有斷言不是新增)；`pnpm lint` 乾淨；`pnpm exec tsc --noEmit -p packages/ui/tsconfig.lib.json` 通過；`ng build docs --configuration=production` 成功；`check-registry-parity.mjs`/`check-registry-sync.mjs` 皆綠燈。

**TODOLIST.md P30 現況**：❌ 清單全部清空,15 項全部修復或查證排除完畢。

**沒有動姊妹 repo `date-picker`**：`date-picker-core` 刻意「zero DOM/CSS assumptions」,幫它加上這次的 ARIA 慣例會違背它自己的設計目標,也會讓它多一個要跨 repo 發版/更新依賴版本的環節,而這次的問題純粹是 `packages/ui` 自己組裝 grid 結構時的角色選擇,不是 headless engine 該管的事。`@sanring/date-picker`（組裝好的參考實作）也沒有需要跟進的東西——它沒有這個 bug,是因為它的元件形狀本來就不一樣（input+popup vs. inline grid),不是因為它比較新或比較對。


---

## P27 — `remove` 混合 target 時 exit code 隱含成功

**查證**：`remove.ts` 原本把「registry 裡真的沒有這個元件（typo/未知）」跟「registry 裡有,只是這個專案沒裝」兩種完全不同的狀況混在同一個 `notInstalled` 陣列裡,只要陣列非空就印紅色 `✖` 錯誤,但退出碼只看 `plan.toRemove.length === 0` 這一個條件——只要至少一個 target 真的被移除,函式跑到底就是隱含 exit 0,即使其中混了一個打錯字的元件名稱。

對照 `diff.ts`/`update.ts` 兩者共用的 `resolveDiffTargets()` 既有慣例：`missing`（registry 裡完全找不到）一律視為輸入錯誤,印紅字後立即 `process.exit(1)`、不執行任何後續動作；`notInstalled`（registry 裡有,只是專案沒裝）只是軟性提示,印一行 dim 文字後繼續處理其餘 target,不影響最終 exit code。`remove` 從來沒有對齊這個既有區分——它自己的 `notInstalled` 實際上是「上述兩種情況的聯集」。

**修法**：`RemovalPlan` 拆成 `notInstalled`（registry 裡有、只是未安裝,沿用既有語意)與新增的 `unknown`（registry 裡完全沒有這個名字)。`planRemoval()` 用 `byName.has(n)` 區分兩者。command action 比照 `diff.ts` 的寫法：`plan.unknown.length > 0` 一律印紅字 `✖ Unknown component(s): ...` 並立即 `process.exit(1)`,在做任何刪除動作之前就擋下,徹底避免半調子的部分成功；`plan.notInstalled` 降級成 `pc.dim` 提示文字,不再影響 exit code——這修正了原本「視覺上宣告失敗但退出碼宣告成功」的不一致,做法是讓 `remove` 的兩種情境分別精確對齊 `diff`/`update` 各自既有的處理方式,而不是發明新規則。

**驗證**：`remove.test.ts` 新增/調整 3 個測試——`planRemoval` 單元測試拆成兩個(一個驗證已知但未裝的 `notInstalled`,一個驗證 registry 裡沒有的 `unknown`,原本的測試用例其實誤用了一個 registry 裡不存在的元件名稱去驗證「未安裝」語意,已修正成用真正已知的 `combobox`);整合測試新增「混合已知-未裝 + 可移除 target 時 exit 0」與「混合 unknown + 可移除 target 時 exit 1 且完全不刪除任何檔案」兩case,後者用 `vi.spyOn(process, 'exit')` 攔截驗證真的呼叫了 `exit(1)`,並斷言 `installedHashes` 裡原本可移除的元件的 hash 仍然存在(證明 unknown 檢查真的在任何刪除動作之前就擋下,不是刪了一半才失敗)。`pnpm --filter @sanring/cli exec vitest run`：15 個測試檔、178 個測試全過；`pnpm --filter @sanring/cli exec tsc --noEmit` 通過。

**TODOLIST.md P27 現況**：整體流程 4 項（CLI 主流程文件同步、`--json` 補齊、registry 完整性檢查抽共用工具、`fetchRegistry`/`fetchFile` typed error)與 `info`/`migrate`/`search` 缺測試這項仍待處理。

---

## P27 — `info`/`migrate`/`search` 補測試（過程中發現並修復一個真實 crash + 一個測試套件 flaky race）

**執行**：`commands/` 下依 `check-registry-parity.mjs` 同一類手法先確認缺口範圍後，比照既有 command test（`doctor.test.ts`/`list.test.ts`）的慣例，新增 `info.test.ts`（7 個測試：project info 模式 `--json`/人類可讀、component 模式 `--json`/人類可讀/已安裝狀態、未知元件 exit 1、`alias:component` 語法）、`search.test.ts`（6 個測試：排序、無結果、`--json` 無結果、`--json` 含 `installed` 欄位的回歸測試、`--group`/`--tag` 過濾）、`migrate.test.ts`（9 個測試：up to date、breaking migration 印出步驟、`fromVersion` 早於已安裝版本時不重複觸發、`--check` 有/無待遷移時的 exit code、registry 裡已移除的元件、`alias:component` key 解析、`noData` 無 baseline 情境、config 不存在時的 exit 1）。

**寫測試過程中發現的真實 bug（`info.ts`）**：幫 `info` 補 `alias:component` 語法的回歸測試時（`sanring info other:widget --json`),命令直接丟 `TypeError: Cannot read properties of undefined (reading 'name')`。查證後發現：`info.ts` 稍早的 P27 修復（見 TODOLIST 已勾選項）只改對了「用哪個 registry 抓資料」（`resolveRegistrySource(parsedRef.alias, ...)`)跟「查 registry 用裸名稱」（`resolveInstallSet([bareComponentName], ...)`),但最後一行 `const component = toInstall.find((c) => c.name === componentName)!` 沒有跟著改——`toInstall` 裡的元件 `name` 是裸名稱,但這裡拿去比對的 `componentName` 是原始帶 alias 前綴的完整字串（例如 `"other:widget"`),永遠比對不到,`.find()` 回傳 `undefined`,後面用非空斷言 `!` 硬拆導致 crash。這正是 P27 這個小節的核心論點的具體案例——`info` 先前雖然「查過」也「修過」alias 支援,但因為沒有對應測試,一個明顯會炸掉的殘留 bug 完全沒被抓到。修法：把 `componentName` 改成 `bareComponentName`,一行修復,`sanring info <alias>:<component> --json` 手動驗證正確輸出。

**寫測試過程中發現並修復的測試套件本身的 flaky race**（跟 command 程式碼無關,是測試基礎設施缺口）：新增這三個檔案後,連續跑 `vitest run` 會間歇性（約 2-3/5 次）出現 `registry.test.ts` 裡完全不相關的測試失敗（`Cannot read properties of undefined (reading 'ok')`、`ENOENT: ... 'registry/registry.json'`）。追查後確認：`registry.test.ts` 有幾個測試用**相對路徑**（`'./registry'`）依賴 `process.cwd()` 停在 `packages/cli` 這個固定位置；但 `add`/`remove`/`doctor`/`list`/`info`/`migrate`/`search` 等每一個 command 的整合測試都會在 `beforeEach`/`afterEach` 呼叫 `process.chdir()` 切到各自的 temp project 目錄再切回來。`process.chdir()` 是**整個 process 共享的全域狀態**,不是 per-worker-thread 隔離的——Vitest 預設的 `threads` pool 用 `worker_threads` 在同一個 process 裡並行跑多個測試檔案,所以只要 `registry.test.ts` 剛好在另一個檔案的 `chdir` 視窗內執行,相對路徑就會解析到錯的目錄。用二分法驗證：拿掉新增的三個檔案,原本 178 個測試連續跑 10 次 0 次失敗；加回去後連續跑 5 次有 3 次失敗——不是我新測試邏輯本身有錯,是新增的三個「會 chdir」的檔案數量把既有的競速機率推高到容易觀察到的程度(這個 race 理論上原本就存在於 9 個既有的 chdir 檔案之間,只是機率較低沒被注意到)。**修法**：`packages/cli/vitest.config.ts` 加上 `pool: 'forks'`——改用真正獨立的 OS process(而非共享 process 的 worker thread)跑每個測試檔案,每個 process 有自己獨立的 `cwd`,徹底消除這整類競速,而不是逐一修 `registry.test.ts` 或新檔案去繞開它(那樣治標不治本,下一個新增的 chdir 檔案還是會重新觸發)。

**驗證**：`pnpm --filter @sanring/cli exec vitest run` 加上 `pool: 'forks'` 後連續跑 8 次、`pnpm --filter @sanring/cli exec vitest run --pool=forks` 也連續跑 8 次,共 16 次 0 次失敗(相同條件下拿掉這個設定會在 5 次內大概率重現);18 個測試檔、**200** 個測試全過(原 178 + 新增 22:`info` 7 + `search` 6 + `migrate` 9);`pnpm --filter @sanring/cli exec tsc --noEmit` 通過。

**TODOLIST.md P27 現況**：整體流程 4 項（CLI 主流程文件同步、`--json` 補齊、registry 完整性檢查抽共用工具、`fetchRegistry`/`fetchFile` typed error)仍待處理,`info`/`migrate`/`search` 缺測試與 `remove` exit code 兩項已完成。

---

## P28 — `packages/ui` 表單元件收斂至共用 `SanringCvaBase`

**執行**：把 P14 只落在 registry 的 CVA 第二批重構完整移植到 `packages/ui`。新增 `packages/ui/src/lib/components/shared/cva-base.ts`，集中 `ControlValueAccessor` callback、disabled state、延後至 `ngOnInit()` 的 `NgControl` 解析、`control.events` 狀態橋接、Field described-by ids、focus/touched 與 `stateChanges`。`checkbox`、`switch`、`radio-group`、`slider`、`otp-input`、`calendar`、`date-picker`、`file-upload`、`combobox` 九個元件全部改成 `extends SanringCvaBase`，移除各檔重複的 lifecycle、signals、callbacks 與大型 `XxxFieldControlAdapter`。其中 `file-upload` 與 `combobox` 因前者用 `isDisabled`、後者用 plain-string `inputId` 作為 Field id，依 registry 設計保留薄型專用 adapter；其餘七個使用共用 `SanringFieldControlAdapter`。

**過程中補出的 registry 基底缺口**：第一次執行真正的 Angular library compile 時，`SanringCvaBase` 因使用 `inject()` 與 `OnInit`、但本身沒有 Angular decorator 而觸發 `NG2007`。在 `packages/ui` 與 `registry` 兩側 base 同步補上無 selector 的 `@Directive()`；這讓 base 能合法承載 Angular DI/lifecycle metadata，也讓兩份 `cva-base.ts` 維持完全相同。原先 registry source 沒有被 package TestBed 直接編譯，因此此前的靜態 parity check 不會抓到這類錯誤。

**驗證**：三批局部測試分別為 25、34、27 項，全數通過；完整 `pnpm ng test @sanring/ui --watch=false` 為 70 個 spec 檔、**404** 個測試全過；`pnpm ng build @sanring/ui` 成功；修改檔案 ESLint、Prettier、`git diff --check` 通過；`check-registry-sync.mjs`（52/52）與 `check-registry-parity.mjs`（52 個 shared component directories）皆綠燈。P28 已從 `TODOLIST.md` 移除。

---

## P27 — 整體流程 4 項收尾（`--json` 補齊、registry 完整性共用工具、typed error、help/README/docs 同步）

P27 上一輪（見前面兩則條目）已修完 `remove` exit code 與 `info`/`migrate`/`search` 缺測試。這輪收掉「整體流程」剩下的 4 項，P27 在 `TODOLIST.md` 全部清空，整節移除。

**1. `build`/`list --outdated` 補 `--json`**：兩個 command 補 `--json` flag，全部既有 `console.log`/`console.error` 人類可讀輸出路徑改成 `if (!options.json)` 包住，成功/失敗都改印一份結構化 JSON（`build` 涵蓋 `ok`/`registryName`/`components`/`warnings`/`written`/`outDir`；`list --outdated` 涵蓋 `components`/`upToDate`/`outdated`/`conflicts`）。至此 `doctor`/`diff`/`search`/`info`/`build`/`list` 六個 CI/agent 常用 command 全部支援 `--json`。新增 `build.test.ts` 3 個、`list.test.ts` 2 個測試。

**2. registry 完整性檢查抽成共用工具**：新增 `packages/cli/src/registry-integrity.ts`——`findRegistryReferenceIssues(registry)`（同步：componentDeps/sharedDeps dangling reference、`groups[].components` dangling reference、peerDependencies 版本字串是否可解析)、`checkRegistryFilesFetchable(registry, source)`（非同步：逐檔 `fetchFile` 驗證 registry.json 宣告的每個檔案真的抓得到）、`checkRegistryIntegrity()`（整合兩者）。`isParseableVersionRange()` 是刻意輕量的 heuristic（不是完整 semver-range parser，這個 repo 沒有 bundle semver 套件),用「hyphen range 前後一定有空白、pre-release 的 hyphen 前後不會有空白」這個 npm 既有慣例區分兩者。

三個呼叫端各自按用途接線,不是每處都跑全部檢查：`doctor.ts` 在既有 registry fetch 成功後加一段（同步、零額外網路成本),把每個 dangling reference 各自轉成一筆獨立 `warn()`（不是彙總一行,讓 `--json` 模式也能拿到完整明細,而不是像既有 `orphaned`/`customized` 那組舊邏輯只有人類可讀模式看得到明細——這是新程式碼順手做對,沒有回頭改舊邏輯)；`build.ts` 在 `validateRegistry` 成功、組完最終 `registry` 物件後跑同步檢查,主要抓 `registry.manifest.json` 手寫的 `groups` 引用到不存在的元件（`build.ts` 自己的 `validateReferencedTargets` 只驗證掃描到的 componentDeps/sharedDeps,從來沒驗證過 manifest 注入的 groups)；`mcp.ts` 的 `doctor_project` tool 加一段,呼叫同步檢查並列出明細,不額外呼叫非同步的 file-fetchability 檢查（避免每次 agent 呼叫這個工具都多背一輪全量網路請求)。新增 `registry-integrity.test.ts`（29 測試)、`doctor.test.ts`/`build.test.ts`/`mcp.test.ts` 各補一個對應的整合回歸測試。

**3. `fetchRegistry`/`fetchFile` 改 throw typed error（過程中發現並修掉兩個真實的嚴重 bug）**：`registry.ts` 的 `die()`（`console.error` + `process.exit(1)`)換成 `export class RegistryFetchError extends Error`,兩個呼叫點（`fetchRegistry` 本地路徑分支、`fetchRegistryFromUrl`)改成 `throw new RegistryFetchError(message, { cause: e })`。`utils.ts` 新增 `reportRegistryFetchError(error, { json? })`,是「command 層決定怎麼印訊息與 exit」的共用落地點,9 個原本沒有包 try/catch 的呼叫端（`migrate`/`info`/`search`/`diff`/`remove`/`list`/`update`/`add`,`doctor` 已有既有 try/catch)全部補上。

過程中確認並修掉這個重構動機所指出的兩個真實、嚴重的既有 bug,而不只是理論上的程式碼異味：
- **`doctor.ts` 的 `catch { fail('Unreachable...') }` 之前是死碼**：`die()` 的 `process.exit(1)` 是同步、無條件終止整個 process,呼叫端任何 try/catch 都攔不到——`doctor --registry <壞掉的路徑>` 之前是直接印紅字終止,完全繞過 doctor 自己的 checks 陣列與 `--json` 輸出,`--json` 模式下會印出非法 JSON（其實是純文字錯誤訊息)而不是結構化錯誤。新增的回歸測試（`doctor.test.ts`)先確認這個情境下 `doctorCommand.parseAsync()` 真的能正常 resolve、`fail()` 真的執行到,而不是進程被殺掉。
- **MCP server 之前會被單次 registry fetch 失敗整個殺掉**：`mcp.ts` 的 7 個 `getRegistry()` 呼叫點裡,只有 `doctor_project` 自己包了 try/catch,其餘 6 個（`list_components`/`search_components`/`get_component_info`/`plan_component_install`/`add_component`/`refresh_registry`)完全沒有——只要 registry 一次抓取失敗（typo 的 `--registry`、VPN 斷線、registry 端下線),`die()` 會直接砍掉這個長時間運行的 MCP server process,agent 整個 session 都會斷線,不只是這次工具呼叫失敗。查了 `@modelcontextprotocol/sdk` 原始碼確認 `Server.setRequestHandler` 本來就會把 handler 拋出的例外轉成正常的 JSON-RPC error response（`error.message` 直接變成回傳訊息),所以只要移除 `die()` 本身,不需要在每個呼叫點額外包 try/catch,SDK 自己的既有機制就會接住,不砍 process。新增的回歸測試（`mcp.test.ts`)驗證 `list_components` 對著壞掉的 registry 呼叫時,client 端拿到的是乾淨的 `McpError`（訊息就是 `Cannot read registry at: ...`),然後緊接著再呼叫一次 `search_components` 確認 server 還活著、還能回應（即使還是同一種失敗,重點是它有回應,不是連線直接斷掉)。

`registry.test.ts` 原本測 `die()` 行為的三個測試,用的是「spy `process.exit` 讓它拋一個假錯誤」這種間接手法（正是這次重構動機裡點名的「對測試不理想」)；改成直接 `await expect(fetchRegistry(...)).rejects.toThrow(RegistryFetchError)`,不需要碰 `process.exit` 了。`add.test.ts` 也補了一個對應的端到端回歸（registry 不可達時 exit 1、印出乾淨錯誤訊息、不是 unhandled rejection)。

**過程中順手修掉的測試基礎設施 flaky race（跟本項無直接關係,但擋在驗證路上）**：改完 `fetchRegistry` 後連續跑 `vitest run` 出現間歇性、跟這次程式碼改動看似無關的 `registry.test.ts` 失敗。追查後發現：`mcp.e2e.test.ts` 會 `execSync('npm run build', ...)`,而 `packages/cli` 的 `build` script 含 `sync-registry`（`scripts/sync-registry.mjs`),這支腳本原本是 `rmSync(DEST_DIR)` → `mkdirSync` → 非同步 `cp(...)`——如果這支腳本跟 `registry.test.ts` 依賴同一個 `packages/cli/registry` 本地 bundle 目錄的測試同時跑,會有一個「目錄剛被刪、還沒複製完」的窗口,窗口大小等於整個非同步複製 52 個元件的時間。改成先複製進一個暫存的 sibling 目錄,複製完成後才用同步的 `rmSync` + `renameSync` 原地替換,把窗口從「複製所需時間」縮到「兩個同步 syscall 之間」,連續跑 10 次 `vitest run`（含觸發真正 `npm run build` 的 `mcp.e2e.test.ts`)全部通過,修復前同樣條件下 5 次內大概率重現。

**4. 重新定義 CLI 對外主流程並同步 help/README/docs**：`packages/cli/src/index.ts` 的 `program.addCommand()` 註冊順序改成對齊五個分組（Install: `init`/`add`/`remove`；Explore: `info`/`list`/`search`；Maintain: `diff`/`migrate`/`update`/`doctor`；Publish: `build`；Agent: `mcp`),讓 auto-generated `--help` 的 Commands 清單自然照這個順序列出,並在 `addHelpText('after', ...)` 補一段「Command groups」摘要。`packages/cli/README.md` 的 Common commands 區塊改成用同一組五分類呈現,補回原本完全沒列出的 `search`/`doctor`/`migrate`,結尾加一句指向 docs 站的完整文件連結（README 本來就刻意只列主流程,這點沒變)。

`apps/docs` CLI 頁面（`cli.overview.body`,en/zh 都改)原本寫「exposes nine commands」但實際 12 個,且完全沒提過 `migrate`；改成描述五分組敘事,並指向 Registry/MCP 頁面涵蓋 `build`/`mcp`。新增完整的 `migrate` section（title/body/code sample/flags list,en/zh 都補),補上原查證抓到的五個 flag 落差：`add` 補 `--check`、`remove` 補 `--dry-run`、`list` 補 `--outdated`/`--json`、`doctor` 補 `--fix`/`--json`、`diff` 補 `--summary`/`--json`；順手一併補了查證清單沒列出、但同樣過時的兩處：`search` 缺 `--group`/`--tag`/`--json`,以及 `search` 的 `--registry <url>` 沒跟上 `list` 已經做過的「URL or local path」措辭統一（`list --registry help` 那條 P27 舊項當時只改了 `list`,沒注意到 `search` 有一樣的落差)。`sections`/`commands` 陣列與模板裡的 section index 手動同步更新（新增 `migrate` section 讓後面的 `Requirements` section index 位移),`ng build docs --configuration=production` 成功驗證模板正確。

**驗證**：`pnpm --filter @sanring/cli exec vitest run` 連續 10 次、每次 18→19 個測試檔（新增 `registry-integrity.test.ts`)、**240** 個測試全過（原 200 + 本輪新增 40：`build` +3、`list` +2、`registry-integrity` 29、`doctor` +2、`add` +1、`mcp` +2、`migrate.test.ts` 拆分計數不變只是同一批已有的 22 個)；`pnpm --filter @sanring/cli exec tsc --noEmit` 通過；`pnpm exec tsc --noEmit -p apps/docs/tsconfig.app.json` 通過；`pnpm exec ng build docs --configuration=production` 成功；`pnpm lint`（repo 全域)通過（含一個順手修掉的 `migrate.test.ts` 解構賦值 unused-var lint 錯誤,改用 `delete` 而非解構丟棄);`check-registry-sync.mjs`/`check-registry-parity.mjs` 皆綠燈。

**TODOLIST.md P27 現況**：整節（整體流程 4 項 + 各 command 弱點 26 項)全部完成,已從 `TODOLIST.md` 移除。

---

## P30 — 52 個元件 headless 掃描「建議修正」全數收斂

P30 先前已收完 15 個必修缺口；這輪把剩下 15 組建議項目逐一實作或查證排除，並同步修改 `packages/ui`、可安裝的 `registry` source、元件測試與中英文 Docs。P30 至此沒有未完成項目，整節已從 `TODOLIST.md` 移除。

**公開 API 與 Angular 結構**：`avatar-group-count` 補 `disabled` boolean coercion、停用語意與 click/keyboard guard；`breadcrumb` 補可在地化的 `ariaLabel`；`field` 與 `select` 的 `id` 改為可由消費者指定，同時保留自動產生 fallback 與 `SanringFieldControl` 相容性；`select-content`、`radio-item`、`sheet-content` 改用 signal query。所有新增 public input 與行為都同步進 Docs API table／範例／a11y 說明。

**Dialog、Sheet、Hover Card、Sidebar 語意**：`dialog`／`alert-dialog` 新增 `ariaLabel`、`ariaLabelledBy`、`ariaDescribedBy`，依「明確 input → DialogConfig → projected title/description → 元件 fallback」決定關聯，並用 signal `contentChild` + effect 處理動態加入／移除 title，避免殘留舊 attribute；沒有 title 的 `alertdialog` 也一定有 accessible name。`sheet` 使用同一套 explicit relationship／projected title／fallback 邏輯，且 nested `sheet-header` 已有回歸測試。`hover-card` 讓 trigger 與 content 透過 `aria-controls`／`aria-expanded`／穩定 id 建立關聯，有名稱時 content 具 `region` 語意。`sidebar` root 預設 `complementary` 與可覆寫 label；menu button/action 保留寬 selector相容性，同時讓非原生元素取得 `role="button"`、tab stop、Enter/Space activation、disabled guard，並忽略 key-repeat，無 `href` 的 anchor 也不再被誤認成原生互動元素。

**Combobox、Date Picker、Context Menu 焦點與鍵盤操作**：`combobox` 的 `inputId`／`listId` 可覆寫；Escape 與單選完成會在 panel 移除後回到 trigger／input，但 outside pointer close 不再排程回焦，因此不會搶走使用者剛點擊的外部 control。`date-picker` 補 `ariaLabel`／`ariaLabelledBy`，`disabled` 同時接受既有 matcher／matcher array 與整體 boolean（含裸 `disabled` attribute、`"false"` coercion），整體停用時 selection guard 與 ARIA 狀態一致。`context-menu` 改為每層 menu 只有一個 roving tab stop，方向鍵跳過 disabled item；Tab／Shift+Tab 會關閉完整 menu tree，並以 logical trigger 為基準移到文件中前／後相鄰的 control，不受 CDK overlay 被 portal 到 `<body>` 尾端影響，root 與 submenu path 都有 activeElement 回歸測試。

**Transfer 與 Tree**：`transfer-item` 移除「整列 click + 巢狀 checkbox」的雙重 toggle source，改由整列本身承擔 `role="checkbox"`、`aria-checked`、`aria-disabled`、roving tabindex、click／Space；panel 支援 ArrowUp／ArrowDown／Home／End 且跳過 disabled item。`tree` root 補 `ariaLabel`／`ariaLabelledBy`，node 補 `disabled`、ARIA/data state 與 expand/select guard；children lookup 改為一次建立 parent map，避免每個 node 都掃全部 descendants 的 O(n²) 路徑。兩者 Docs keyboard/a11y/API 與 live examples 同步更新。

**刻意保留的 Dropdown Menu 分岔**：沒有為了表面共用而改寫。它使用 `@angular/aria/menu` 的永久 `DomPortal` attach-once 模型；`MenuOverlayController` 則負責自行 create／attach／detach overlay，直接重用會造成生命週期責任衝突。現況已有檔內說明且不是 correctness 缺口，結論是保留此 deliberate divergence。

**交叉 review 額外收掉的邊界**：修正 `hover-card-content` package／registry 四個 template handler 的 `protected` 可見性 drift；刪除 registry combobox 與 `SanringCvaBase` 完全重複的 `onFocus`／`onBlur`；補 Dialog title/description 放在 nested `DialogHeader` 時的 ARIA 測試，以及 Sheet 開啟後 panel focus 測試。Transfer 使用錯誤的 `--sanring-primary-foreground` token 也改回既有 `--sanring-primary-fg`。

**驗證**：`pnpm exec ng test "@sanring/ui" --watch=false` 為 70 個 spec 檔、**421 個測試全過**；`pnpm exec ng build "@sanring/ui"` 成功；P30 修改範圍 ESLint、Prettier、`git diff --check` 通過；`pnpm exec ngc -p apps/docs/tsconfig.app.json --noEmit` 通過；`check-registry-sync.mjs`（52/52）與 `check-registry-parity.mjs`（52 個 shared component directories）皆綠燈；Docs production build 成功，initial bundle 435.37 kB。首次 Docs build 的 `SIGABRT` 由 macOS crash report 定位到 Angular 22 local build cache 的 native LMDB `ExtendedEnv`（不是編譯診斷）；清除 `.angular/cache` 後仍可重現，該次驗證以 `CI=true` 停用 local persistent cache，並在允許 Google Fonts inline request 後完整通過。

**追加查證與修復(2026-08-22)**：這輪驗證涵蓋 `packages/ui`／`registry` 原始碼本身，但沒有涵蓋「registry 發布 metadata 有沒有跟著同步」——`transfer` 把打勾指示器從內嵌 `sanring-checkbox` 改成 `@lucide/angular` 的 `LucideCheck` 圖示（本節「Transfer 與 Tree」段落所述改動）時，新增的 `@lucide/angular` import 沒有同步反映到 `registry/registry.json` 的 `transfer.peerDependencies`。這類漂移原本該被 `packages/cli/src/commands/build.test.ts` 的 golden-fixture 測試（掃描 `registry/components/` 實際 import 並與手寫 `registry.json` 逐一比對）抓到，但 `.github/workflows/ci.yml` 的 `test-cli` job 一直缺一個步驟（見下方 P31），這個測試從未在乾淨 checkout 上真正跑過，所以完全沒被察覺，直到下一個 session 為了排查一個無關的版本發布 PR 的 CI 失敗才連帶挖出來。已在 `registry/registry.json` 補上 `transfer.peerDependencies.@lucide/angular`，`build.test.ts` golden fixture 重新綠燈（52 個元件零已知落差）。**教訓**：往後任何會改到元件 import 的修正（尤其是新增/替換 icon、shared util 依賴），要記得跑一次 `pnpm --filter @sanring/cli test`（或至少 `build.test.ts` 的 golden fixture）確認 `registry.json` metadata 沒有漂移，光靠 `check-registry-sync.mjs`／`check-registry-parity.mjs` 不夠——那兩支腳本比對的是「檔案存在性」與「Angular 結構/a11y attribute」，不比對 peerDependencies 是否對得上實際 import。

---

## P31 — `ci.yml` 的 `test-cli` job 從未在乾淨環境跑過 + picocolors CI-only 測試污染

**背景**：幫 `@sanring/cli` 準備一個版本發布 PR 時，`Test (@sanring/cli)` CI check 失敗，查證後發現不是這次改動造成的——查了 repo 至今僅有的兩次 `ci.yml` 執行紀錄（2026-08-07、2026-08-22），兩次都因為同一個原因掛掉：`packages/cli/registry/`（`.gitignore` 排除、只有 `pnpm --filter @sanring/cli build` 內部的 `sync-registry` 步驟才會產生的目錄）在乾淨 checkout 上不存在，但至少一個既有測試（`registry.test.ts` 的「falls back to the bundled local registry」案例）直接讀這個目錄。本機一直測得過是因為開發機上通常至少跑過一次 `build`，留下了這份沒進版控的產物；CI 從沒補過這一步，等於這條測試路徑從沒被驗證過。

**修復**：`ci.yml` 的 `test-cli` job 在 `pnpm install` 之後、`pnpm --filter @sanring/cli test` 之前，補一個「Sync registry fixtures」步驟跑 `pnpm --filter @sanring/cli run sync-registry`。

**修復後浮現的第二層問題**：sync-registry 補上後，9 個 ENOENT 失敗消失，但浮出一個真正的 golden-fixture 落差（見上方 P30 追加段落的 `transfer` peerDependencies 漂移）與 4 個只在 CI 環境失敗、本機重跑多次都過的測試（`add.test.ts` x2、`info.test.ts`、`search.test.ts`）。用 OrbStack 起一個 `node:24-bookworm` 容器、完整重建 `node_modules`（bind mount 進來的 host `node_modules` 含 macOS 的 native binary，不能直接借用，要在容器內重新 `pnpm install`）、手動設 `CI=true`/`GITHUB_ACTIONS=true` 精確重現 GitHub Actions runner 後，100% 可重現、非 flaky。根因：`picocolors`（CLI 輸出上色用的套件）把任何 truthy 的 `CI` 環境變數當成「有 color 支援」的訊號（`isColorSupported = ... || !!env.CI`），而 GitHub Actions 預設就會設 `CI=true`；本機互動式跑測試時沒有這個變數，色碼關閉。結果是 CLI 輸出在 CI 裡夾帶 ANSI escape code（例如 `Installed \x1b[2m(1):\x1b[22m  \x1b[1mwidget\x1b[22m`），把原本假設純文字的字面比對（`output.includes('Already installed: @lucide/angular')`、`/Installed \(1\).*widget/`）全部斷開——本機測不到，CI 100% 會中。

**修復**：`packages/cli/vitest.config.ts` 的 `test.env` 補 `NO_COLOR: '1'`，讓 CLI 輸出（進而讓這些斷言）在 CI 與本機行為一致，而不是逐一修每條斷言去容忍 ANSI code。

**額外的流程修正（跟這兩個 CI bug 無關，是同一輪順手發現並修正的操作失誤）**：原本手動跑了 `pnpm changeset version` 把兩份 changeset 直接消耗掉、產生 0.24.0 並連同版號改動一起開 PR，結果讓 `.github/workflows/require-changeset.yml` 判定「這個 PR 沒有待處理的 changeset」而失敗。查 `gh pr list` 撈出的完整歷史（#1–#26）後確認：這個 repo 27 次版本紀錄裡有 26 次都是 `changesets/action` bot 自動開的 `chore: version packages` PR（分支 `changeset-release/main`）在做真正的 bump，只有一次（0.23.2→0.23.3）是例外手動直接推到 `main`（沒經過 PR，所以沒撞到這個檢查）。修正方式是把 `packages/cli/package.json`／`CHANGELOG.md` 改回 0.23.3、把兩份 changeset 檔案原樣留著（不消耗），讓 bot 在這個 PR 合併進 `main` 後自己開版號 PR。**教訓**：`packages/cli`／`registry` 的版本發布一律讓 changeset 檔案跟著功能改動落地就好，不要手動跑 `changeset version`——那是 bot 的工作，手動搶著做只會跟 `require-changeset.yml` 打架。

**驗證**：Docker 重現（`node:24-bookworm`、`CI=true`、`GITHUB_ACTIONS=true`、`--frozen-lockfile`、`sync-registry`、`vitest run`）240/240 通過；`pnpm changeset status --since=origin/main` 通過；PR #27 的六個 GitHub Actions check（Lint、Test (@sanring/cli)、Test (@sanring/ui)、Type check、Registry Sync Check、Require Changeset）全綠。
