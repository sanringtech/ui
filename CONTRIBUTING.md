# Contributing

## 環境需求

- Node.js >= 20.19（建議 22 LTS）
- pnpm 10+

## 啟動

```bash
pnpm install
pnpm start        # docs dev server → http://localhost:4200
```

## 路徑別名

`tsconfig.json` 設定讓 `docs` 直接引用元件庫原始碼，不需先 build：

```jsonc
{
  "compilerOptions": {
    "paths": {
      "@sanring/ui": ["./projects/sanring/ui/src/public-api.ts"]
    }
  }
}
```

## 常用指令

| 指令 | 說明 |
|---|---|
| `pnpm start` | 啟動 docs dev server |
| `pnpm build` | Build `@sanring/ui` |
| `pnpm test` | 執行 Vitest（`@sanring/ui`，**不含** `@sanring/cli`） |
| `pnpm lint` | ESLint |
| `pnpm --filter @sanring/cli build` | Build CLI（含 `sync-registry` 步驟，見下） |
| `pnpm --filter @sanring/cli test` | 執行 CLI 自己的 Vitest 測試 |

## `@sanring/cli` 的 registry 同步

`packages/cli/registry/` 是 build 產物、不進 git（見 `.gitignore`），每次 `pnpm --filter @sanring/cli build` 都會先跑 `scripts/sync-registry.mjs`，把 repo 根目錄的 `registry/`（正本，有 tracked in git）整個複製過去，再驗證 `registry.json` 列的每個檔案都存在。

**改動 `registry/` 底下的元件檔案後，一定要重新 build 一次 CLI 套件**（或至少跑 `pnpm --filter @sanring/cli sync-registry`），否則發布出去的 CLI 會裝到舊版程式碼——這正是 [.changeset/plenty-pumas-sync.md](.changeset/plenty-pumas-sync.md) 修的問題。

## `@sanring/cli` 版本相容性（Changesets）

`@sanring/cli` 用 [Changesets](https://github.com/changesets/changesets) 管理版本與 CHANGELOG：改到 `packages/cli` 的 PR 跑 `pnpm changeset`，選版本、寫說明——這段說明會直接進 `packages/cli/CHANGELOG.md`，不需要另外維護一份相容性文件。

判斷 patch / minor / major 用同一句話：**「一個裝了舊版 CLI 的使用者，在不知情的情況下升級，行為會不會變？」** 對照四塊契約範圍：

| 範圍 | 改動類型 → 版本 | 例子 |
|---|---|---|
| CLI 指令 / flag | 移除、改名 → **major**；新增 → **minor** | 拿掉 `--force`、`-p` 語意改變 |
| `sanring.config.json` schema | 舊 config 檔用新版 CLI 讀取行為改變 → **major** | 改變 `componentPath` 的預設解讀方式 |
| `registry.json` schema | 新格式舊版 CLI 讀不懂 → **major** | 既有欄位語意被改掉，而非單純新增欄位 |
| 內部建置 / 測試 / 文件 | 不影響使用者可觀察行為 → **patch** | sync-registry script、補測試 |

**Major 變更必須在 changeset 內文寫遷移步驟**——不用另開檔案，changeset 本文就會被渲染進 CHANGELOG。

`registry.ts` 的 `fetchRegistry`/`fetchFile` 另外有一層版本鎖定的 remote fallback：本地 bundle 遺失時，會抓對應版本 tag（`refs/tags/<package-name>@<version>`，URL-encoded）下的根目錄 `registry/`，讓落後版本的 CLI 不會意外抓到不相容的新 registry。這一層曾經因為假設了錯誤的 tag 格式和路徑而完全失效且沒人發現——改動這段邏輯後，建議照 [registry.test.ts](packages/cli/src/registry.test.ts) 的方式跑一次手動驗證（暫時搬走本地 `registry/` 目錄，確認真的能從 GitHub 抓到東西），而不是只看程式碼「看起來合理」。
