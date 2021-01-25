/* eslint-disable import/extensions */
import './helper/MutationObserver.ts';
import './helper/window.ts';

import { suite, test, timeout } from '@testdeck/mocha';
import { expect } from 'chai';
import faker from 'faker';
import ms from 'ms';

import { TranslateMutationObserver } from '../src';

@suite()
@timeout(ms('10m'))
export default class TranslateMutationObserverSlowTest {
  @test()
  public maxStack(): void {
    const text = faker.random.alpha();
    const i = 10000;

    const parentDiv = document.createElement('div');
    let ref = parentDiv;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const _ of Array(i)) {
      const oldRef = ref;
      ref = document.createElement('div');
      oldRef.appendChild(ref);
    }

    ref.textContent = text;

    const translateMutationObserver = new TranslateMutationObserver(this.t, {
      targets: [parentDiv],
    });
    translateMutationObserver.translate();

    expect(ref).property('textContent', text.toLocaleUpperCase());
  }

  private t(str: string) {
    return str.toLocaleUpperCase();
  }
}
