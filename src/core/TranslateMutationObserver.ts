/* eslint-disable @typescript-eslint/no-non-null-assertion */
import sleep from 'sleep-promise';

import { cachedOptions } from './cachedOptions';
import { NodeTranslator, TranslateFunction, TranslateOptions } from './NodeTranslator';

export class TranslateMutationObserver extends NodeTranslator {
  public static n(translateFunction: TranslateFunction, options?: TranslateOptions, mutationObserverOptions?: MutationObserverInit): TranslateMutationObserver {
    return new TranslateMutationObserver(translateFunction, options, mutationObserverOptions);
  }

  public mutationObserver: MutationObserver;

  #queued = new Set<Node>();

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
    for (const dom of cachedOptions.get(this)!.targets) {
      mutationObserver.observe(dom, options || this.#defaultMutationObserverOptions);
    }
    return mutationObserver;
  }

  private async mutationCallback(mutations: MutationRecord[]): Promise<void> {
    const nodes = mutations
      .map((mutation) => [mutation.target, ...mutation.addedNodes])
      .flat()
      .filter((node) => !(this.#queued.has(node) || [...this.#queued.values()].some((p) => p.contains(node))));

    for (const node of nodes) {
      this.#queued.add(node);
    }

    try {
      await this.translate(nodes);
    } finally {
      await sleep(0);
      for (const node of nodes) {
        this.#queued.delete(node);
      }
    }
  }
}
