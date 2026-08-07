# insert-component — Sanring 元件加入 Registry

元件通過品質審查後，將其同步進 `registry/`。

**前提**：元件必須已在 `registry.json` 中有對應條目。若尚未加入 `registry.json`，請先手動新增後再執行此 skill。

**用法**：`/insert-component button` 或 `/insert-component packages/ui/src/lib/components/switch`

---

## Step 1 — 執行品質審查

讀取 `.claude/commands/audit-component.md`，對指定元件完整執行其 Phase 0–6。

審查完成後，取得 Phase 6 的**結論裁決**（✅ / ⚠ / ❌）。

---

## Step 2 — 依裁決決定是否 sync

### 裁決為 ✅ 可加入

執行：
```bash
pnpm --filter @sanring/cli sync-registry
```

完成後輸出：
```
✅ <component-name> 已同步進 registry/
```

### 裁決為 ⚠ 建議修正後加入

先輸出警告：
```
⚠ 注意：此元件有非阻斷性問題尚未修正（見審查報告）。
  建議修正後再 sync，但仍可繼續。
  是否繼續執行 sync？（回覆 y 繼續 / 任意鍵取消）
```

等待使用者確認後，若繼續，執行：
```bash
pnpm --filter @sanring/cli sync-registry
```

完成後輸出：
```
⚠ <component-name> 已同步進 registry/（含未修正的注意事項，請盡快處理）
```

### 裁決為 ❌ 需修正後再審查

輸出：
```
❌ Sync 中止：<component-name> 未通過品質審查。
  請修正審查報告中的 ❌ 項目後，重新執行 /insert-component。
```

不執行 sync。
