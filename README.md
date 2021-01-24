# TranslateMutationObserver

Translate html page using mutation observer

This only work on certain type of DOM changes such as appendChild() remove()

search for `MutationObserver` for more info

## Install

```bash
npm i translate-mutation-observer
```

## Usages

### Basic

```ts
import { TranslateMutationObserver } from 'translate-mutation-observer';

const t = (str: string) => str;
TranslateMutationObserver.n(t);
```

### Translate Each Char

```ts
import { TranslateMutationObserver } from 'translate-mutation-observer';

const t = (str: string) => str.split('').map((s) => s).join();
TranslateMutationObserver.n(t);
```

### Body Only

```ts
import { TranslateMutationObserver } from 'translate-mutation-observer';

const t = (str: string) => str;
TranslateMutationObserver.n(t, [document.body]);
```

### Example Translate To Simplified Chinese Using Other External Library

```ts
import { sify } from 'chinese-conv';
import { TranslateMutationObserver } from 'translate-mutation-observer';

TranslateMutationObserver.n(sify);
```

### vue

App.vue

```ts
import { Vue } from 'vue-class-component';
import { sify } from 'chinese-conv';

export default class extends Vue {
  public beforeCreate() {
     if (this.$i18n.locale === 'zh-CN') {
      TranslationQueue.start(sify);
    }
  }
}
```
