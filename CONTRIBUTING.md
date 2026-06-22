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
| `pnpm test` | 執行 Vitest |
| `pnpm lint` | ESLint |
