import sleep from 'sleep-promise';

import { cachedOptions, NodeTranslator, TranslateFunction, TranslateOptions } from './NodeTranslator';

export class TranslateMutationObserver extends NodeTranslator {
  public static n(translateFunction: TranslateFunction, options?: TranslateOptions, mutationObserverOptions?: MutationObserverInit): TranslateMutationObserver {
    return new TranslateMutationObserver(translateFunction, options, mutationObserverOptions);
  }

  public mutationObserver: MutationObserver;

  #queue = false;

  #originalMutationObserverOptions?: MutationObserverInit;

  #defaultMutationObserverOptions = {
    subtree: true,
    childList: true,
    attributes: true,
    characterData: true,
  } as MutationObserverInit;

  public constructor(translateFunction: TranslateFunction, options?: TranslateOptions, mutationObserverOptions?: MutationObserverInit) {
    super(translateFunction, options);

    this.#originalMutationObserverOptions = mutationObserverOptions;

    this.mutationObserver = this.createMutationObserver(this.#originalMutationObserverOptions);
  }

  private createMutationObserver(options?: MutationObserverInit) {
    const mutationObserver = new MutationObserver(this.mutationCallback.bind(this));
    for (const dom of cachedOptions.get(this).targets) {
      mutationObserver.observe(dom, options || this.#defaultMutationObserverOptions);
    }
    return mutationObserver;
  }

  private async mutationCallback(mutations: MutationRecord[]): Promise<void> {
    if (this.#queue) {
      return;
    }
    this.#queue = true;
    const translatePromises = [] as Promise<void>[];
    for (const mutation of mutations) {
      translatePromises.push(this.translate([mutation.target]), this.translate(mutation.addedNodes));
    }
    try {
      await Promise.all(translatePromises);
    } finally {
      await sleep(0);
      this.#queue = false;
    }
  }
}
