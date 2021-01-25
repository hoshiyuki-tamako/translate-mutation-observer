import './setup';

import { suite, test, timeout } from '@testdeck/mocha';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import faker from 'faker';
import ms from 'ms';

import { TranslateMutationObserver } from '../src';
import { TestBase } from './base';

chai.use(chaiAsPromised);

@suite()
@timeout(ms('10m'))
export default class TranslateMutationObserverSlowTest extends TestBase {
  @test()
  public async maxStack(): Promise<void> {
    const text = faker.random.alpha();
    let i = 10000;

    const parentDiv = document.createElement('div');
    let ref = parentDiv;
    while (i-- > 0) {
      const oldRef = ref;
      ref = document.createElement('div');
      oldRef.appendChild(ref);
    }
    ref.textContent = text;

    const translateMutationObserver = new TranslateMutationObserver(this.t, {
      targets: [parentDiv],
    });
    await translateMutationObserver.translate();

    expect(ref).property('textContent', this.t(text));
  }
}
