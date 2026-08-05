# 架構補強 Todo List

跳脫 `packages/ui` 元件庫本身,盤點 CLI、CI、docs 站現況後列出的待補項目。依優先順序排列,每項附上現況查證與理由。

---

## P1 — registry / packages/ui / docs / public-api 一致性

- [x] 建立一致性檢查,確保每個正式元件在 `registry`、`packages/ui`、docs navigation/page、`public-api.ts` 的狀態一致
- [x] 移除殘留 `menu` registry 元件,避免和 `dropdown-menu` / `context-menu` 語意重疊

**已完成**:擴充 `packages/cli/scripts/check-registry-sync.mjs`,原本只檢查 docs↔registry 兩面,現在同時檢查四面八個方向：registry.json 內部完整性(`files` 是否真的存在)、registry.json↔`registry/components/`、registry.json↔`packages/ui` lib(這正是先前 `menu` bug 的那種落差)、`packages/ui` lib↔`public-api.ts`、docs nav id↔registry.json、docs nav id↔`packages/ui` lib、docs nav id↔docs page 檔案、docs nav id↔`app.routes.ts` 路由註冊。文件化但缺實作/路由的方向一律 fail CI;實作了但還沒文件化的方向只 warn(視為正常 WIP)。用手動模擬 drift(假 registry entry、註解掉一個 public-api export)驗證過腳本抓得到,目前 50 個正式元件在全部八個方向都一致,`pnpm lint`/腳本本身都是綠的。同步把 `.github/workflows/registry-sync-check.yml` 的 `paths` 觸發範圍擴大,涵蓋新檢查會用到的檔案,避免新檢查形同虛設。

**現況**:`menu` 曾只存在於 `registry` / README,沒有 `packages/ui` lib、沒有 docs page、也沒有 public API export。此類落差會讓 CLI 可安裝清單、文件站、套件開發 surface 彼此不同步。

**風險**:使用者可能透過 CLI 安裝到未文件化、未測試、或不是正式 library surface 的元件;反過來 docs 也可能介紹 CLI 無法安裝的元件。

**成本**:中低。已有 `packages/cli/scripts/check-registry-sync.mjs`,可擴充成同時檢查 registry、docs、package lib、public API。

---

## P2 — lint 要能乾淨通過

- [x] 修復目前 `pnpm lint` 的既有錯誤,讓 lint 成為可被 CI 信任的品質門檻

**現況**:已在 P0 CI workflow 那次一併修好(見 commit `3c516aa`)。15 個既有錯誤——docs template label association(`sanringLabel` 動態 `for` 綁定的已知 false positive,補了有註明原因的 disable comment;date-picker 兩處是真的沒關聯,補上 `id`/`for`)、`combobox` input alias(套用跟 `command-item` 一致的既有慣例)、死掉的 spec unused var——全部修好,`pnpm lint` 目前是綠的。

**風險**:主流元件庫不能長期讓 lint 紅燈;否則外部貢獻、CI、release gate 都會失去可信度,真正的新問題也容易被舊錯誤淹沒。

**成本**:中。多數是局部修正,但要小心不要為了過 lint 破壞 accessibility 或既有 API。

---

## P3 — 建立 component audit matrix 並逐一盤點 lib

- [x] 建立 `COMPONENT_AUDIT.md` 或等價盤點表,列出 50 個正式 component 的品質狀態與下一步 action
- [x] 依風險分批檢查 `packages/ui` / `registry` / docs,不要用無順序的人工掃描

**盤點欄位**:每個 component 至少記錄 `registry/package/docs/public-api 一致性`、`spec 狀態`、`a11y`、`keyboard`、`API 穩定性`、`SSR/hydration 安全`、`docs 完整度`、`風險等級`、`下一步 action`。

**建議順序**:

1. ✅ 高風險互動元件(已完成,見 `COMPONENT_AUDIT.md` 的「Batch 1 Findings」):`dialog`、`alert-dialog`、`popover`、`select`、`combobox`、`command`、`dropdown-menu`、`context-menu`、`tooltip`、`sheet`。查出 3 個 P0,**全部修完**:`select` 開啟後的 listbox 沒有方向鍵導覽(只能 Tab)——補上 `FocusKeyManager`,開啟時自動 focus 選中項、方向鍵可跳過 disabled 項並循環;`command` 完全沒有測試——補了 6 個 spec;`context-menu` 完全沒有方向鍵導覽也沒有測試——新增共用的 `focusAdjacentMenuItem()` 工具函式(接在既有的 `overlayKeydown` 訂閱上,root menu 跟 submenu 各自都能用方向鍵導覽、跳過 disabled 項、循環),補了 7 個 spec,寫 spec 過程中還抓到自己寫的一個 bug(還沒開的子選單項目雖然 CSS 隱藏但還在 DOM 裡、`tabindex="0"` 還在,會被誤判成可導覽項目)並修掉了。三個都在真實瀏覽器用 Playwright 跑過一輪驗證。`sheet` 文件範例用了原始碼裡根本不存在的 `showClose` input 這個次要問題還沒修。(原本以為 `command` 的 `aria-expanded="true"` 是寫死的 bug,後來查證發現它的清單本來就沒有收合狀態,寫死是對的,已撤回這條。)
2. ✅ form/control 元件(已完成盤點且找到的問題全部修完,見 `COMPONENT_AUDIT.md` 的「Batch 2 Findings」):`input`、`field`、`checkbox`、`radio`、`switch`、`slider`、`date-picker`、`calendar`、`file-upload`、`otp-input`、`textarea`。查出 2 個真的 bug,都在 `switch`,**都修好了**:補上 `checkedChange` output(現在可以 `[(checked)]` 雙向綁定);補上真正的 `ariaLabel`/`ariaLabelledBy` input——原本文件範例寫的 `aria-label="Toggle theme"` 掛在 `<sanring-switch>` 標籤上根本傳不到內部真正的 `role="switch"` button,修的時候發現不只文件程式碼範例錯,連即時渲染用的 demo 模板(`switch-page.component.ts`)也獨立踩了同一個坑(用 `[attr.aria-label]` 而不是走 input),兩處都修了,瀏覽器驗證過真的傳到 button 上。`checkbox`/`radio-group` 共用的 a11y 邊界案例(`aria-required` 只看原始 `required` input,沒涵蓋純用 `Validators.required` 的情況)也修好,兩邊都補了 regression spec。`date-picker`/`calendar` 零測試(鍵盤邏輯全部在外部套件 `@sanring/date-picker-core` 裡,這兩個元件本身沒有可審的鍵盤程式碼)這個沒修,還是 backlog。其餘主要是文件 API 表漏欄位,`field` 本身查起來完全乾淨。
3. ✅ display/layout 元件(已完成盤點且找到的問題全部修完,見 `COMPONENT_AUDIT.md` 的「Batch 3 Findings」):`accordion`、`tabs`、`table`、`carousel`、`resizable`、`avatar`、`breadcrumb`、`card`、`alert`、`badge`、`progress`、`skeleton`、`spinner`、`tag`、`timeline`、`tree`。查出 2 個真的 SSR bug,同一種類型,**都修好了**:`avatar` 的 `AvatarImageDirective` 原本在建構子欄位初始化直接 `new MutationObserver(...)` 並同步 `.observe()`——改成包進 `afterNextRender`;`carousel` 的 `CarouselContentComponent` 原本在 `ngAfterViewInit()` 直接呼叫 `EmblaCarousel()`(內部會 `new ResizeObserver(...)`)——同樣改成 `afterNextRender`,跟同一批 `resizable` 既有的正確寫法一致。`resizable` 的 handle 補上了 `aria-valuenow`/`min`/`max`(反映 handle 前面那個 panel 的目前尺寸與該 panel 自己的 `minSize`/`maxSize`,為此在 `ResizableGroupComponent` 加了一個 `getBeforePanel()` 方法)。`progress` 的 `ariaValueText` 補上轉發給底層 directive。`tabs` 的 `selectionMode` 補進文件(說明 `'follow'`/`'explicit'` 自動/手動啟用的差異),`orientation` 要同時設在 `<sanring-tabs>` 跟 `<sanring-tabs-list>` 這件事——原本想用 host binding 讓 `sanring-tabs-list` 自動吃父層的值、不讓消費者能個別覆寫,但 Angular 的 host binding 語法無法綁到 hostDirectives pass-through 以外的 input(NG8002 編譯錯誤),技術上做不到乾淨的自動同步,改成把「為什麼要設兩次」寫清楚進文件跟原始碼註解。`table` 的文件曾經真的引用不存在的 `<sanring-paginator>`,但等到要修的時候查證發現另一個並行工作階段已經把這個元件補齊、註冊完整、API 跟文件範例完全對得上——不需要改程式碼,已在稽核表更正這條過時的結論。所有修復都在真實瀏覽器用 Playwright 跑過一輪驗證,無 console error。

**風險**:如果沒有盤點矩陣,逐一檢查 lib 很容易變成「看過但沒有結論」,也會先花時間在低風險元件,延後發現真正影響 production 採用的互動/a11y/API 問題。

**成本**:中。先建立矩陣成本低,但後續每批元件需要逐一補結論與 follow-up。

---

## P4 — 每個 component 至少有最低 spec

- [x] 補齊無 spec 元件的最低測試:render、class merging、a11y/keyboard 核心行為

**已完成**:50 個正式 component 現在都有至少一個 package-level `.spec.ts` baseline。這次補齊 `alert`、`avatar`、`badge`、`breadcrumb`、`calendar`、`card`、`carousel`、`date-picker`、`divider`、`hover-card`、`label`、`link`、`resizable`、`spinner`、`table`；`command`、`context-menu` 也已在高風險互動元件盤點中補齊。最低 spec 覆蓋 render、class merging、重要 aria/security attribute、以及互動元件的核心 keyboard/open/selection 行為。

**風險**:headless component library 的信任感很大一部分來自互動與 a11y 穩定性。沒有最低 spec 時,重構 styling、ARIA、keyboard 行為都容易出現隱性退化。

**成本**:中高。可先從高風險互動元件開始: `dialog`、`alert-dialog`、`popover`、`select`、`combobox`、`command`、`dropdown-menu`、`context-menu`、`tooltip`。

---

## P5 — docs 要成為採用入口

- [x] 補齊每個 component docs 的採用資訊:usage、installation、API、accessibility notes、keyboard behavior、controlled/uncontrolled 或 state 說明

**現況**:docs page 覆蓋度已不錯,但主流採用入口需要更穩定的資訊架構。`menu` 缺頁問題已改以移除 `menu` 解決;後續重點是讓保留下來的正式元件文件完整、可預期。

**進度**:已先修正可查證的採用/API 準確性缺口,但 P5 整體尚未完成。第一批:`sheet` 文件移除不存在的 `showClose` API 與會編譯失敗的 `[showClose]="false"` 範例,改成自訂 `sanringSheetClose` close control 範例;`calendar` API 表補上 `id`、`required`、`ariaDescribedBy`、`jumpMonthLabel`、`jumpYearLabel`、`focus()`;`date-picker` API 表補上 `id`、`required`、`ariaDescribedBy`、`focus()`。第二批:`otp-input` API 表補上 `name`、`autocomplete`、`required`、`ariaLabel`、`ariaLabelledBy`、`ariaDescribedBy`、`pasted`、`slotKeydown`;`slider` 補 `tabIndex`;`radio` 補 `RadioGroupComponent.id`;`dropdown-menu` 補 `id`、`wrap`、`typeaheadDelay`;`select` 補 `id`、`contentId`、`placeholder`,並把 `value` 說明改清楚為唯讀 getter、值更新應走 Angular Forms。

**完成標準**:每個正式 component docs 至少具備:usage/imports、installation、API table、accessibility notes、keyboard behavior、state model(controlled/uncontrolled、CVA、model/input/output 或 service-driven 狀態)。

**下一步**:

- [x] 建立 docs completeness checklist/matrix,逐頁標記 usage、installation、API、accessibility、keyboard、state model 是否完成
- [x] 先補高互動元件的 adoption notes:`dialog`、`alert-dialog`、`popover`、`select`、`combobox`、`command`、`dropdown-menu`、`context-menu`、`tooltip`、`sheet`
- [x] 再補表單元件的 field/CVA/state 說明:`input`、`field`、`checkbox`、`radio`、`switch`、`slider`、`date-picker`、`calendar`、`file-upload`、`otp-input`、`textarea`
- [x] 最後補 display/layout 元件的 accessibility semantics 與 keyboard note:`accordion`、`tabs`、`table`、`carousel`、`resizable`、`avatar`、`breadcrumb`、`card`、`alert`、`badge`、`progress`、`skeleton`、`spinner`、`tag`、`timeline`、`tree`

**風險**:即使元件可用,若文件缺少 a11y、keyboard、state model 與 API 說明,使用者會很難判斷它是否適合 production。

**成本**:中。可搭配 component audit matrix 逐一補,避免每頁格式與深度不一致。

---

## P6 — package-only 使用者的 theme token 入口(已評估,暫不執行)

- [x] 評估是否要讓 package-only(不透過 CLI)使用者取得 theme CSS

**原始現況(2026-08 前)**:`registry/shared/theme.css` 已經提供完整 `--sanring-*` CSS custom properties,`registry/registry.json` 也已把 `theme` 宣告為 shared dependency;`sanring init` 會產生 `src/sanring-theme.css`,docs theming page 也有說明。但如果使用者只從 npm 安裝 `@sanring/ui`,目前不夠直覺地知道 `bg-[var(--sanring-border)]`、`text-[var(--sanring-foreground)]` 等 token 要從哪裡設定。

**查證後發現前提不成立**:`@sanring/ui` 目前**沒有被發布到 npm**,而且是刻意設計成這樣——`packages/ui/package.json` 是 `private: true`、`.changeset/config.json` 把 `@sanring/ui` 明確排除在版本管理外、`release.yml` 只在 `packages/cli/**`/`registry/**` 變動時觸發,`release` script 也只 build/publish `@sanring/cli`。唯一真實存在的發布管道是 CLI 把 `registry/` 的原始碼複製進使用者專案(shadcn 那套模式),「只從 npm 安裝 @sanring/ui」這個使用情境目前不存在,原始「現況」段的假設不成立。

**結論**:不執行,維持 CLI-only 發布模式。要讓這個情境成立,前提是先決定要不要把 `@sanring/ui` 也發布成傳統 npm 依賴套件——那是一個獨立、更大的策略決定(牽涉 semver 版本紀律、使用者失去「程式碼歸你、可以隨便改」的 CLI 模式優勢、兩條發布管道共存的複雜度),不是「補一個 CSS export」這麼小的事。若之後真的要發 npm 套件,「要不要發 npm 套件」本身應該先開一個新的 P 項目評估,這條再接在後面做。

**技術備查(留給未來參考)**:實測過 ng-packagr 的 `assets` 設定會拒絕讀取 project root 以外的檔案(不能直接指到 `../../registry/shared/theme.css`),且它會自己產生/覆寫 `package.json` 的 `exports` 欄位(預設只有 `.` 跟 `./package.json`)。這條路技術上可行,但要嘛把 theme.css 複製一份進 `packages/ui/` 自己顧跟 `registry/shared/theme.css` 同步,要嘛接受兩份 source of truth。

---

## P7 — docs 站沒有搜尋功能

- [x] 幫 docs 站加上搜尋(至少支援元件名稱/描述搜尋,理想上做成 Cmd+K 面板)

**現況(更新)**:查證後發現 `apps/docs/src/app/shell/header/feature-list.component.ts` 其實已經有完整的 Cmd+K 搜尋面板(快捷鍵、fuzzy match、鍵盤導覽都做了),原本的「找不到任何搜尋元件」現況查證是舊的、不準。真正的落差只有：搜尋索引只比對翻譯過的元件名稱(`labelKey`),沒有比對描述文字，跟這裡「至少支援名稱/描述搜尋」的要求還差一步。

**已完成**:`docsComponentItems`(`apps/docs/src/app/navigation/docs-navigation.ts`)每筆補上 `descriptionKey`(對應各元件 `.docs.ts` 裡本來就有的 `page.descriptionKey`，型別化、雙語言都不用另外維護);`feature-list.component.ts` 的 `searchIndex`/`filteredItems` 改成先比對名稱、名稱沒中才退而求其次比對描述(用固定偏移量讓名稱命中永遠排前面);結果項目改成兩行式，名稱下面帶一行描述摘要。已用 Playwright 手動驗證：搜尋不在名稱裡的描述字串(如 "vertically stacked")能正確命中 Accordion 並正常導頁。

---

## P8 — 沒有 MCP server 整合

- [ ] 評估幫 `@sanring/cli` 加上 MCP server 支援,讓 Claude Code / Cursor 等 AI agent 能直接查詢、安裝元件

**現況**:`packages/cli/src` 裡沒有任何 MCP 相關程式碼。

**對比**:shadcn 這一兩年加了 MCP 整合,AI coding agent 可以透過 MCP protocol 直接跟 registry 互動,不用手動下 shell 指令。跟目前透過 Claude Code 使用這個專案的情境直接相關。

---

## P9 — 沒有自訂/第三方 registry 支援

- [ ] 評估支援 `@namespace/component` 語法 + `sanring build` 指令,讓團隊可以架自己的私有 registry

**現況**:`registry.ts` 沒有 namespace 概念,`packages/cli/src/commands/` 沒有 `build` 指令。目前 CLI 只認一個寫死的 registry 來源。

**對比**:shadcn 支援混用官方 registry + 團隊自己的私有 registry。優先度較低,除非近期有多團隊/多產品線共用元件庫的需求才需要拉高。

---

## P10 — `sanring init` 沒有 monorepo/workspace 偵測

- [ ] 評估 `init` 指令加上 monorepo 結構偵測與對應處理邏輯

**現況**:`init.ts` 沒有 `monorepo`/`workspace`/`nx.json`/`pnpm-workspace` 相關的偵測邏輯,目前假設單一 Angular 專案。

**對比**:shadcn 的 `init` 會自動判斷 Next.js/Vite/Remix、偵測 monorepo 結構分別處理。

---

## P11 — 品質關卡類(優先度較低,長期補強)

- [ ] 自動化 a11y 測試(如 axe-core),目前 UI library 完全沒有無障礙迴歸的自動把關,只能靠人工肉眼抓
- [ ] 視覺回歸測試(如 Chromatic / Playwright screenshot),CSS 改動有沒有意外破壞其他元件外觀,現在沒有自動偵測
- [ ] CLI 補真正的 e2e 測試(拉一個全新 Angular 專案、真的跑 `sanring add`、真的 `ng build`)——現有的 `add.test.ts`/`doctor.test.ts` 等是對假的檔案系統 mock 驗證邏輯,不是「CLI 真的能在使用者機器上跑起來」的保證

---

## P12 — Masked Input 是否需要獨立套件(比照 date-picker-core)

- [ ] 評估 Masked Input(roadmap tier2 規劃中)的遮罩引擎是否要比照 `@sanring/date-picker-core` 拆成獨立套件

**現況**:查證 `@sanring/date-picker-core`(headless Angular calendar engine,純邏輯零 DOM/CSS,有自己的獨立 repo)發現它會被拆分的關鍵理由是「同一套引擎被 `calendar` 跟 `date-picker` 兩個元件共用」,而不只是「邏輯複雜、值得獨立測試」。Masked Input 目前規劃只疊加在單一 `Input` directive 上,還沒有第二個消費者。

**建議方向**:先不拆獨立套件。把遮罩演算法(字串 + cursor 位置 + mask config → 格式化後字串 + 新 cursor 位置)寫成 `packages/ui` 內一個零 Angular 依賴的純函式模組,可以獨立單元測試,但不用背獨立 repo/版本協調的重量。等真的出現第二個消費者(例如某個 table 欄位編輯器也要用同一套遮罩)再拆成獨立套件。

**風險**:太早拆套件會增加版本協調與跨 repo 維護成本,卻沒有實際的重用收益;太晚拆則要在多個消費者之間做痛苦的遷移。

**成本**:低(目前只是紀錄架構決策,Masked Input 本身還沒開工實作)。

---

## 查證後確認「不算差距」的項目(備查,避免重複討論)

- **PR 沒有測試/型別檢查關卡**:原 P0 已完成,目前不再放主 todo。已新增 PR 觸發的 CI workflow,跑 `pnpm test`、`tsc --noEmit`、`pnpm lint`。
- **可編輯 playground(Monaco/StackBlitz 匯出)**:查證後 shadcn 自己的元件文件頁也是「靜態 demo + 程式碼區塊」,沒有即時可編輯的 playground,兩邊打平,不是缺口。
- **文件版本切換(per-CLI-version docs)**:shadcn 文件站同樣沒有明顯的版本切換機制,兩邊打平,不是缺口。
