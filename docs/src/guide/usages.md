# Usages

## Browser

```html
<script type="module">
import { TranslateMutationObserver } from 'https://unpkg.com/translate-mutation-observer/dist/index.js';
TranslateMutationObserver.n((str) => str.toLocaleLowerCase());
document.body.innerText = "TEST";
</script>
<body></body>
```

## Basic

```ts
import { TranslateMutationObserver } from 'translate-mutation-observer';

// some translate function that take a full string and translate it
const t = (str: string) => str;
TranslateMutationObserver.n(t);
```

## Translate Each Char

```ts
import { TranslateMutationObserver } from 'translate-mutation-observer';

const t = (str: string) => str.split('').map((s) => s).join();
TranslateMutationObserver.n(t);
```

## Translate Entire Document

```ts
import { TranslateMutationObserver } from 'translate-mutation-observer';

const t = (str: string) => str;
// default only document.body will be translated
TranslateMutationObserver.n(t, { targets: [document.documentElement] });
```

## Translate Attributes

```ts
import { TranslateMutationObserver } from 'translate-mutation-observer';

const t = (str: string) => str;
TranslateMutationObserver.n(t, { attributes: ['src'] });
```

## Translate Attributes startsWith

```ts
import { TranslateMutationObserver } from 'translate-mutation-observer';

const t = (str: string) => str;
// ['aria-', 'alt'] is default value for attributeStartsWith
TranslateMutationObserver.n(t, { attributeStartsWith: ['aria-', 'alt'] });
```

## Translate To Simplified Chinese Using External Library

```ts
import { sify } from 'chinese-conv';
import { TranslateMutationObserver } from 'translate-mutation-observer';

TranslateMutationObserver.n(sify);
```

## vue

App.vue

```ts
import { Vue } from 'vue-class-component';
import { sify } from 'chinese-conv';
import { TranslateMutationObserver } from 'translate-mutation-observer';

export default class extends Vue {
  public beforeCreate() {
     if (this.$i18n.locale === 'zh-CN') {
      // make sure vue-router title translate as well
      TranslateMutationObserver.n(sify, { targets: [document.body, ...document.getElementsByTagName('title')] });
    }
  }
}
```
