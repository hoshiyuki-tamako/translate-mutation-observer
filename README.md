# translate-mutation-observer

![test](https://github.com/hoshiyuki-tamako/translate-mutation-observer/workflows/test/badge.svg)
![npm publish](https://github.com/hoshiyuki-tamako/translate-mutation-observer/workflows/npm%20publish/badge.svg)
![nycrc config on GitHub](https://img.shields.io/nycrc/hoshiyuki-tamako/translate-mutation-observer?config=.nycrc&preferredThreshold=branches)

Translate html page using mutation observer

This only work on certain type of DOM changes such as appendChild()

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

### Trigger Translation for document.body

```ts
import { TranslateMutationObserver } from 'translate-mutation-observer';

const t = (str: string) => str;
const translateMutationObserver = TranslateMutationObserver.n(t);
translateMutationObserver.translate();
```

### Browser

```html
<script type="module">
import { TranslateMutationObserver } from 'https://unpkg.com/translate-mutation-observer@^1/dist/index.js';
TranslateMutationObserver.n((str) => str.toLocaleLowerCase());
document.body.innerText = "TEST";
</script>
<body></body>
```
