// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
type MutationCallback<T> = (mutationRecords: MutationRecord[]) => T;
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
