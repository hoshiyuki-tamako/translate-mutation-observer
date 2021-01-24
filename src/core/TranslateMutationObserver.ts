import sleep from 'sleep-promise';

export type TranslateFunction = (str: string) => string;

export type TranslateOptions = {
  targets?: Iterable<Node>,
  translateAttributes?: string[],
};

export class TranslateMutationObserver {
  public static n(translateFunction: TranslateFunction, options?: TranslateOptions): TranslateMutationObserver {
    return new TranslateMutationObserver(translateFunction, options);
  }

  public translateFunction: TranslateFunction;

  public options?: TranslateOptions;

  public mutationObserver: MutationObserver;

  #queue = false;

  #defaultOptions = {
    targets: [document.documentElement],
    translateAttributes: ['aria-', 'alt'],
  };

  public constructor(translateFunction: TranslateFunction, options?: TranslateOptions) {
    this.translateFunction = translateFunction;
    this.options = options;
    this.mutationObserver = this.createMutationObserver();
  }

  private createMutationObserver() {
    const mutationObserver = new MutationObserver(async (mutationRecords) => {
      if (this.#queue) {
        return;
      }
      this.#queue = true;
      for (const mutationRecord of mutationRecords) {
        this.translate([mutationRecord.target, ...mutationRecord.addedNodes] as HTMLElement[]);
      }
      await sleep(0);
      this.#queue = false;
    });

    const options = {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true,
    };

    for (const dom of this.options?.targets || this.#defaultOptions.targets) {
      mutationObserver.observe(dom, options);
    }

    return mutationObserver;
  }

  public translate(nodes: NodeList | HTMLElement[]): void {
    const translateAttributes = this.options?.translateAttributes || this.#defaultOptions.translateAttributes;

    for (const node of nodes) {
      if (node.nodeType === node.TEXT_NODE && node.nodeValue) {
        node.nodeValue = this.translateFunction(node.nodeValue);
      } else if (node.nodeType === node.ATTRIBUTE_NODE && (node as HTMLElement).attributes) {
        for (const attribute of (node as HTMLElement).attributes) {
          if (translateAttributes.some((a) => attribute.name.startsWith(a)) && attribute.value) {
            const newValue = this.translateFunction(attribute.value);
            if (attribute.value !== newValue) {
              attribute.value = newValue;
            }
          }
        }
      }

      if (node.childNodes) {
        this.translate(node.childNodes);
      }
    }
  }
}
