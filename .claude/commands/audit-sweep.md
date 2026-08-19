# audit-sweep — Sanring 全庫自檢

跨 `packages/ui`(52 個 component 的 headless 品質)與 `packages/cli`(command 完整性/一致性)做一次全面掃描,把找到的缺口寫進 `TODOLIST.md`(或視情況直接修掉再記進 `DEVLOG.md`)。

`/audit-component` 審查**單一元件**是否可以加入 registry；這個 skill 審查**整個 repo 現況**是否還有缺口,是週期性的體檢,不是元件上車前的品管關卡。兩者互補,不互相取代。

**用法**:`/audit-sweep`(全掃)或 `/audit-sweep lib`(只掃 packages/ui)或 `/audit-sweep cli`(只掃 packages/cli)

---

## Phase 0 — 開場基準檢查

先用便宜、客觀的檢查建立基準,避免後面的人工審查重新發現已經有工具在守的問題:

```bash
node packages/cli/scripts/check-registry-parity.mjs
node packages/cli/scripts/check-registry-sync.mjs
pnpm lint
pnpm --filter @sanring/cli test
```

記錄哪些是綠的(不用再查)、哪些是紅的(直接就是待補項目,不用等後面的分批審查重新發現)。

讀 `TODOLIST.md` 全文與 `DEVLOG.md` 最近 100-150 行,建立「已知缺口」與「已查證過不是缺口」的清單——後面每個 Phase 找到東西時,先比對这份清單,不要重複回報已經追蹤或已經查證排除的項目。

---

## Phase 1 — `packages/ui` headless 品質掃描(`/audit-sweep` 或 `/audit-sweep lib` 執行)

1. 列出 `packages/ui/src/lib/components/` 下所有元件目錄(排除 `shared/`)。
2. 依目錄字母序切成每批 8–9 個元件的批次(52 個元件約 6 批)。
3. 對每一批,用 `Agent` 工具開一個 `general-purpose` 子代理,**唯讀**審查(明確告知不准修改/新增檔案),套用 `/audit-component` Phase 1–3 的檢查表(Angular 結構、a11y、props/API 設計),但跳過 Phase 4/5(spec 存在性與自動補寫)與 Phase 6(usage evidence,需要人工判斷,不適合批次自動跑)。
4. 子代理的 prompt 必須包含:
   - 已知例外清單(例如目前 P28 記錄在案的 9 個表單元件 CVA 架構分岔——不要重複回報這個已追蹤的架構問題,只回報這 9 個元件裡「架構分岔以外」的新問題)
   - 明確的輸出格式:每個元件分 ❌ 必須修正 / ⚠ 值得注意 / ✅ 無發現,附 `file:line`
   - 禁止臆測——沒把握的東西寫「不確定」,不要編造
5. 全部批次回報後,彙整去重:同一個底層問題如果在多個元件出現(例如同一個 shared abstraction 缺陷波及好幾個元件),合併成一條,不要重複列。

---

## Phase 2 — `packages/cli` 完整性掃描(`/audit-sweep` 或 `/audit-sweep cli` 執行)

不分批——CLI 程式碼量遠小於 52 個元件,直接自己讀,不需要子代理:

### 2-A 命令覆蓋率
- `packages/cli/src/index.ts` 註冊的每個 command,在 `packages/cli/README.md` 與 `apps/docs` 對應頁面(`cli` page、`mcp` page、`registry` page)裡是否都有出現且 flag 清單沒過期
- 每個 `commands/*.ts` 是否有對應的 `*.test.ts`;沒有的話特別注意——沒測試的 command 更容易藏 bug(可用 `diff <(ls commands/*.ts | grep -v test | sed s/.ts//) <(ls commands/*.test.ts | sed s/.test.ts//)` 快速抓出來)
- 對沒測試的 command,實際用 `npx tsx packages/cli/src/index.ts <command> --registry ./registry ...` 跑一次常見用法(含 `--json`,如果有的話),不要只讀程式碼——這個 skill 的價值在於「跑得動」不等於「讀起來合理」

### 2-B 一致性
- `--json` 輸出:哪些 command 有、哪些沒有,是否符合「CI/agent 常用 command 都該有」的原則
- Exit code 慣例:unknown target 是否都 exit 1、not-installed target 是否都採一致的軟性處理(對照 `diff.ts`/`update.ts` 已建立的慣例),`remove.ts` 這類混合 target(部分成功、部分失敗)的情境要特別看 exit code 是否真的反映了印出來的錯誤訊息
- 錯誤處理:`registry.ts` 的 `die()`/`process.exit()` 是否還是直接终止行程,还是已经改成 typed error 由 command 層決定

### 2-C Registry 完整性檢查重用
- `build.ts` 的 `validateReferencedTargets`(componentDeps/sharedDeps dangling reference 檢查)是否已經被 `doctor.ts`/`mcp.ts` 重用,或仍然只有 build 時才驗證——這代表第三方/手寫的 registry.json 沒有等價的完整性檢查入口

---

## Phase 3 — 彙整與判斷:修 vs 記錄

找到的每一項,先分類:

- **明確的 crash/邏輯錯誤,修法無歧義**(例如 TDZ 變數順序錯誤、明顯的 off-by-one):直接修掉,寫 regression 說明到 `DEVLOG.md`(遵循檔案既有的 P## 分組格式),不要進 `TODOLIST.md`——完成的項目不留在待辦清單。
- **需要設計判斷或影響範圍較大**(架構調整、新 flag 語意、docs 大改版):寫進 `TODOLIST.md`,格式比照既有項目——沿用最大的既有 P## 編號往下接,附現況查證與理由,不要臆測優先序或成本(除非有把握,寫成問句或留白讓使用者決定)。

修改 `TODOLIST.md` 前,先確認同樣的問題沒有已經被其他 P## 項目涵蓋(尤其是 P27 的「各 command 弱點」與「整體流程」兩節,和 P28 的 CVA 分岔)——找到的是既有項目的**新證據**就補進既有項目的查證,不要開新編號製造重複。

---

## Phase 4 — 收尾

1. 若 Phase 3 有直接修復,跑對應的 test/lint 確認沒破壞任何東西。
2. 向使用者總結:掃了什麼範圍、找到幾項(分「已修」/「已記錄進 TODOLIST」)、跳過了什麼(例如 Phase 6 usage evidence 需要人工決策,本 skill 不處理)。
3. 不要自己決定要不要 commit——修復和 TODOLIST 更新完成後,交還給使用者確認。

---

**注意**:這個 skill 設計成可以重複執行(例如每次大改版後、或定期跑一次)。每次執行請重新讀一次當下的 `TODOLIST.md`/`DEVLOG.md`,不要依賴上次執行的記憶——避免用過期的「已知缺口」清單漏掉新回歸,或誤判已經修好的東西還是問題。
