# Usages

## Basic

```ts
import { TranslateMutationObserver } from 'translate-mutation-observer';

const t = (str: string) => str;
TranslateMutationObserver.n(t);
```

## Translate Each Char

```ts
import { TranslateMutationObserver } from 'translate-mutation-observer';

const t = (str: string) => str.split('').map((s) => s).join();
TranslateMutationObserver.n(t);
```

## Body Only

```ts
import { TranslateMutationObserver } from 'translate-mutation-observer';

const t = (str: string) => str;
TranslateMutationObserver.n(t, [document.body]);
```

## Example Translate To Simplified Chinese Using Other External Library

```ts
import { sify } from 'chinese-conv';
import { TranslateMutationObserver } from 'translate-mutation-observer';

TranslateMutationObserver.n(sify);
```
