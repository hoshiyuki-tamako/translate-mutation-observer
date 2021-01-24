import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';

import { TranslateMutationObserver } from '../src';

@suite()
export default class TransformTest {
  @test()
  public normal(): void {
    expect(TranslateMutationObserver).property('n').not.null;
  }
}
