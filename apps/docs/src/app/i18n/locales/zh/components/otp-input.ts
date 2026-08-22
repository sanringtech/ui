export const otpInputTranslations = {
  'otpInput.description': '一次性驗證碼輸入控制項，支援貼上、鍵盤導覽與 Angular 表單。',
  'otpInput.examples.basic.description':
    '當使用者需要逐格輸入短驗證碼時，可以使用 sanring-otp-input。',
  'otpInput.usage.description':
    '匯入 OtpInputComponent，並透過 valueChange 或 Angular 表單接收驗證碼字串。',
  'otpInput.installation.description':
    '安裝 OTP input component，並使用 ariaLabel 或 ariaLabelledBy 提供可存取名稱。',
  'otpInput.demo.pattern': 'Pattern',
  'otpInput.demo.separator': '分隔符',
  'otpInput.demo.alphanumeric': '英數驗證碼',
  'otpInput.demo.disabled': '停用',
  'otpInput.demo.controlled': '受控',
  'otpInput.demo.invalid': '無效狀態',
  'otpInput.demo.fourDigits': '四位數',
  'otpInput.demo.form': '表單',
  'otpInput.demo.field': '搭配 Field',
  'otpInput.demo.verificationCode': '驗證碼',
  'otpInput.demo.digitsOnly': '僅限數字',
  'otpInput.demo.recoveryCode': '復原碼',
  'otpInput.demo.pinCode': 'PIN 碼',
  'otpInput.demo.controlledDescription': '請輸入你的一次性密碼。',
  'otpInput.demo.invalidError': '驗證碼無效。',
  'otpInput.demo.fieldError': '請輸入 6 位數驗證碼。',
  'otpInput.demo.verifyLogin': '驗證登入',
  'otpInput.demo.formDescription': '請輸入我們寄到你信箱的驗證碼。',
  'otpInput.demo.verify': '驗證',
  'otpInput.examples.invalid.description':
    '綁定表單控制項並標記為 touched，即可讓每個 slot 呈現 invalid 狀態。',
  'otpInput.examples.field.description':
    '把 sanring-otp-input 包在 sanring-field 裡，沿用表單系統的 label、description 與 validation message。',
  'otpInput.examples.form.description': '搭配 sanring-field 與送出按鈕，建立完整的驗證碼表單。',
  'otpInput.api.description': 'sanring-otp-input 支援的 Inputs 與 Outputs。',
  'otpInput.api.class.description': '與 OTP input 根元素合併的額外 class。',
  'otpInput.api.id.description': '群組 id，預設會自動產生。',
  'otpInput.api.name.description': '轉發到隱藏原生 input 的 name，供表單情境使用。',
  'otpInput.api.length.description': '驗證碼 slot 數量。',
  'otpInput.api.value.description': '目前驗證碼字串。不符合 type 的字元會被忽略。',
  'otpInput.api.type.description': '輸入與貼上時使用的字元過濾規則。',
  'otpInput.api.pattern.description': '自訂字元 pattern。提供時會優先於 type 的內建過濾規則。',
  'otpInput.api.size.description': '每個 slot 的視覺尺寸。',
  'otpInput.api.orientation.description': '控制 slot 水平或垂直排列。',
  'otpInput.api.textAlign.description': '每個 slot 內的文字對齊。',
  'otpInput.api.separatorAt.description':
    '預設渲染時要插入 sanring-otp-input-separator 的 slot 邊界位置，可傳單一數字或多個位置。',
  'otpInput.api.autocomplete.description':
    '轉發到隱藏原生 input 的 autocomplete 提示，預設為 one-time-code。',
  'otpInput.api.disabled.description': '停用所有 slot 並阻止使用者互動。',
  'otpInput.api.readOnly.description': '顯示目前值，但禁止編輯。',
  'otpInput.api.required.description':
    '將 OTP input 標記為必填，供 field 整合與 aria-required 使用。',
  'otpInput.api.ariaLabel.description': '沒有可見 label 時，提供給群組與隱藏 input 的無障礙標籤。',
  'otpInput.api.ariaLabelledBy.description': '用來命名 OTP input 的可見 label 元素 id。',
  'otpInput.api.ariaDescribedBy.description':
    '描述 OTP input 的 helper text id；會與 Field 提供的描述 id 合併。',
  'otpInput.api.valueChange.description': '使用者互動後送出下一個驗證碼字串。',
  'otpInput.api.stateChange.description': '送出下一個驗證碼字串、slot metadata 與完成狀態。',
  'otpInput.api.complete.description': '每個 slot 都有值時觸發。',
  'otpInput.api.pasted.description': '貼上事件處理後，送出正規化後的貼上資訊。',
  'otpInput.api.slotKeydown.description':
    '送出單一 slot 的鍵盤 metadata，供進階自訂 slot 行為使用。',
  'otpInput.accessibility.description':
    "宿主具有 role='group'，aria-label / aria-labelledby、aria-describedby、aria-invalid、aria-required 與 aria-disabled 會自動同步。視覺插槽不會重複暴露給輔助科技；單一透明的原生 input 負責接收完整驗證碼，並支援密碼管理器與 one-time-code 自動填入。",
  'otpInput.keyboard.description': '原生 input 提供視覺插槽之間的鍵盤導覽。',
  'otpInput.keyboard.type': '輸入字元以填入目前插槽並自動跳至下一個。',
  'otpInput.keyboard.arrowLeftRight': '移動焦點至相鄰插槽。',
  'otpInput.keyboard.backspace': '清除目前插槽並將焦點移至前一個插槽。',
  'otpInput.keyboard.delete': '清除目前插槽且不移動焦點。',
  'otpInput.stateModel.description':
    '實作 ControlValueAccessor。使用 [(ngModel)] 或 formControl。值型別：string。complete 事件會在所有插槽都有字元時觸發，方便自動送出驗證表單。',
} as const;
