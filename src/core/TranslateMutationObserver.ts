import sleep from 'sleep-promise';

export type TranslateFunctionParameters = {
  node: Node,
};

export type TranslateFunction = (str: string, parameters: TranslateFunctionParameters) => string;

export type TranslateOptions = {
  targets?: Iterable<Node>,
  attributes?: string[],
  attributeStartsWith?: string[],
};

type TranslateOptionsRequired = {
  targets: Iterable<Node>,
  attributes: string[],
  attributeStartsWith: string[],
};

export class TranslateMutationObserver {
  public static n(translateFunction: TranslateFunction, options?: TranslateOptions, mutationObserverOptions?: MutationObserverInit): TranslateMutationObserver {
    return new TranslateMutationObserver(translateFunction, options, mutationObserverOptions);
  }

  public translateFunction: TranslateFunction;

  public set options(options: TranslateOptions | undefined) {
    if (options?.targets && !Array.isArray(options.targets)) {
      throw new TypeError(`options.targets should be array: ${options.targets.toString()}`);
    }

    if (options?.attributes && !Array.isArray(options.attributes)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      throw new TypeError(`options.attributes should be array: ${options.attributes.toString()}`);
    }

    if (options?.attributeStartsWith && !Array.isArray(options.attributeStartsWith)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      throw new TypeError(`options.attributeStartsWith should be array: ${options.attributeStartsWith.toString()}`);
    }

    this.#originalOption = options;
    this.#cachedOptions.targets = this.#originalOption?.targets || this.#defaultOptions.targets;
    this.#cachedOptions.attributes = this.#originalOption?.attributes || this.#defaultOptions.attributes;
    this.#cachedOptions.attributeStartsWith = this.#originalOption?.attributeStartsWith || this.#defaultOptions.attributeStartsWith;
  }

  public get options(): TranslateOptions | undefined {
    return this.#originalOption;
  }

  public mutationObserver: MutationObserver;

  #queue = false;

  // options
  #originalOption?: TranslateOptions;

  #defaultOptions = {
    targets: [document.body],
    attributes: [],
    attributeStartsWith: ['aria-', 'alt', 'title'],
  } as TranslateOptionsRequired;

  #cachedOptions = this.#defaultOptions;

  // mutation observer options
  #originalMutationObserverOptions?: MutationObserverInit;

  #defaultMutationObserverOptions = {
    subtree: true,
    childList: true,
    attributes: true,
    characterData: true,
  } as MutationObserverInit;

  public constructor(translateFunction: TranslateFunction, options?: TranslateOptions, mutationObserverOptions?: MutationObserverInit) {
    this.translateFunction = translateFunction;
    this.options = options;

    this.#originalMutationObserverOptions = mutationObserverOptions;

    this.mutationObserver = this.createMutationObserver(this.#originalMutationObserverOptions);
  }

  private createMutationObserver(options?: MutationObserverInit) {
    const mutationObserver = new MutationObserver(this.mutationCallback.bind(this));
    for (const dom of this.#cachedOptions.targets) {
      mutationObserver.observe(dom, options || this.#defaultMutationObserverOptions);
    }
    return mutationObserver;
  }

  private async mutationCallback(mutations: MutationRecord[]): Promise<void> {
    if (this.#queue) {
      return;
    }
    this.#queue = true;
    for (const mutation of mutations) {
      this.translate([mutation.target]);
      this.translate(mutation.addedNodes);
    }
    await sleep(0);
    this.#queue = false;
  }

  //
  public translate(nodes?: Iterable<Node>): void {
    const childNodes = [nodes || this.#cachedOptions.targets];
    while (childNodes.length) {
      const it = childNodes.pop() as Iterable<Node>;
      for (const node of it) {
        if (node.nodeType === node.TEXT_NODE && node.nodeValue) {
          node.nodeValue = this.translateFunction(node.nodeValue, { node });
        } else if (node instanceof Element) {
          for (const attribute of node.attributes) {
            const requiredTranslate = this.#cachedOptions.attributes.includes(attribute.name) || this.#cachedOptions.attributeStartsWith.some((a) => attribute.name.startsWith(a));
            if (requiredTranslate && attribute.value) {
              const newValue = this.translateFunction(attribute.value, { node });
              if (attribute.value !== newValue) {
                attribute.value = newValue;
              }
            }
          }

          childNodes.push(node.childNodes);
        }
      }
    }
  }
}
