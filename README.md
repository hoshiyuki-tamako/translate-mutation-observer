# translate-mutation-observer

Translate html page using mutation observer

This only work on certain type of DOM changes such as appendChild() remove()

search for `MutationObserver` for more info

## Documentation

[https://hoshiyuki-tamako.github.io/translate-mutation-observer/guide/](https://hoshiyuki-tamako.github.io/translate-mutation-observer/guide/)

## Install

```bash
npm i translate-mutation-observer
```

## Usages

```ts
import { TranslateMutationObserver } from 'translate-mutation-observer';

// some translate function that take a full string and translate it
const t = (str: string) => str;
TranslateMutationObserver.n(t);
```

```ts
import { TranslateMutationObserver } from 'translate-mutation-observer';

import t from './zh-TW.json';
// some kind of lookup table replace character one by one
TranslateMutationObserver.n((str: string) => str.split('').map((s) => t[s]).join());
```

### Trigger Entire Page Translation

```ts
import { TranslateMutationObserver } from 'translate-mutation-observer';

const t = (str: string) => str;
const translateMutationObserver = TranslateMutationObserver.n(t);
translateMutationObserver.translate();
```

### Browser

```html
<script type="module">
import { TranslateMutationObserver } from 'https://unpkg.com/translate-mutation-observer/dist/index.js';
TranslateMutationObserver.n((str) => str.toLocaleLowerCase());
document.body.innerText = "TEST";
</script>
<body></body>
```
