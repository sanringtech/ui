export const linkTranslations = {
  'link.description': '原生 anchor primitive，適用於外部連結與 Angular 路由導覽。',
  'link.demo.basic': 'Sanring UI',
  'link.demo.external': '外部連結',
  'link.demo.router': '路由連結',
  'link.demo.active': '目前路由',
  'link.demo.custom': '自訂連結',
  'link.examples.description': '常見的連結模式，適用於外部導覽與 Angular 路由狀態。',
  'link.examples.basic.description':
    '將 directive 套用在原生 anchor 上，讓 href、target、routerLink 與 routerLinkActive 保持原生行為。',
  'link.usage.description': '匯入 LinkDirective，並將 sanringLink 套用在 anchor 上。',
  'link.installation.description':
    '用 CLI 加入這個元件，再匯入 LinkDirective，並將導覽屬性保留在原生 anchor 元素上。',
  'link.composition.description':
    '外部連結使用 href；應用程式內路由使用 routerLink 搭配 routerLinkActive。',
  'link.api.description': 'sanringLink directive 支援的 Inputs。',
  'link.api.property': '屬性',
  'link.api.type': '型別',
  'link.api.default': '預設值',
  'link.api.descriptionLabel': '說明',
  'link.api.class.description': '與基礎連結樣式合併的額外 class。',
  'link.api.target.description':
    '設定原生 anchor target。當 target 為 _blank 且沒有提供 rel 時，會自動補上安全屬性。',
  'link.api.rel.description': '設定原生 anchor rel。需要覆蓋安全預設時可自行提供。',
} as const;
