export type TranslateFunctionParameters = {
  node: Node,
};

export type TranslateFunction = (str: string, parameters: TranslateFunctionParameters) => Promise<string> | string;

export type TranslateFilter = (node: Node) => boolean;

export type TranslateAttributeFilter = (attribute: Attr, node: Element) => boolean;

export type TranslateOptions = {
  targets?: Iterable<Node>,
  filter?: TranslateFilter,
  filterAttribute?: TranslateAttributeFilter,
};

type TranslateOptionsRequired = {
  targets: Iterable<Node>,
  filter: TranslateFilter,
  filterAttribute: TranslateAttributeFilter,
};

export const cachedOptions = new WeakMap();

export class NodeTranslator {
  public translateFunction: TranslateFunction;

  public set options(options: TranslateOptions | undefined) {
    if (options?.targets && !Array.isArray(options.targets)) {
      throw new TypeError(`options.targets should be array: ${options.targets.toString()}`);
    }

    if (options?.filter && !(options.filter instanceof Function)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      throw new TypeError(`options.filter should be callable: ${options.filter.toString()}`);
    }

    if (options?.filterAttribute && !(options.filterAttribute instanceof Function)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      throw new TypeError(`options.filterAttribute should be callable: ${options.filterAttribute.toString()}`);
    }

    this.#originalOption = options;

    cachedOptions.set(this, {
      targets: this.#originalOption?.targets || this.#defaultOptions.targets,
      filter: this.#originalOption?.filter || this.#defaultOptions.filter,
      filterAttribute: this.#originalOption?.filterAttribute || this.#defaultOptions.filterAttribute,
    });
  }

  public get options(): TranslateOptions | undefined {
    return this.#originalOption;
  }

  // options
  #originalOption?: TranslateOptions;

  #defaultOptions = {
    targets: [document.body],
    filter: () => true,
    filterAttribute: () => false,
  } as TranslateOptionsRequired;

  public constructor(translateFunction: TranslateFunction, options?: TranslateOptions) {
    this.translateFunction = translateFunction;
    this.options = options;
  }

  //
  public async translate(nodes?: Iterable<Node>): Promise<void> {
    const iterators = [nodes || cachedOptions.get(this).targets];
    const translatePromises = [] as Promise<void>[];
    while (iterators.length) {
      for (const node of iterators.pop() as Iterable<Node>) {
        if (cachedOptions.get(this).filter(node)) {
          if (node.nodeType === node.TEXT_NODE && node.nodeValue) {
            const text = node.nodeValue;
            translatePromises.push((async () => {
              node.nodeValue = await this.translateFunction(text, { node });
            })());
          } else if (node instanceof Element) {
            for (const attribute of node.attributes) {
              if (cachedOptions.get(this).filterAttribute(attribute, node) && attribute.value) {
                const { value } = attribute;
                translatePromises.push((async () => {
                  const newValue = await this.translateFunction(value, { node });
                  if (attribute.value !== newValue) {
                    attribute.value = newValue;
                  }
                })());
              }
            }

            iterators.push(node.childNodes);
          }
        }
      }
    }

    await Promise.all(translatePromises);
  }
}
