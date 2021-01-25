type MutationCallback<T> = (mutationRecords: MutationRecord[]) => T;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
globalThis.MutationObserver = class MutationObserver<T> {
  public callback: MutationCallback<T>;

  public targets = [] as Node[];

  public options?: MutationObserverInit;

  public constructor(callback: MutationCallback<T>) {
    this.callback = callback;
  }

  public observe(target: Node, options?: MutationObserverInit) {
    this.targets.push(target);
    this.options = options;
  }
};
