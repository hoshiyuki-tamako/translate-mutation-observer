import './setup';

import { suite, test } from '@testdeck/mocha';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import faker from 'faker';

import { TranslateMutationObserver } from '../src';
import { TestBase } from './base/TestBase';

chai.use(chaiAsPromised);

class CustomError extends Error {
}

@suite()
export default class TranslateMutationObserverTest extends TestBase {
  @test()
  public staticNew(): void {
    expect(TranslateMutationObserver.n(this.t)).property('constructor', TranslateMutationObserver);
  }

  @test()
  public async mutationFunction(): Promise<void> {
    const text = faker.lorem.word().toLocaleLowerCase();
    const value = faker.lorem.word().toLocaleLowerCase();

    const div = document.createElement('div');
    const span = document.createElement('span');
    span.id = value;
    span.textContent = text;
    div.appendChild(span);

    const addedText = faker.lorem.word().toLocaleLowerCase();
    const addedValue = faker.lorem.word().toLocaleLowerCase();
    const addedSpan = document.createElement('span');
    addedSpan.id = addedValue;
    addedSpan.textContent = addedText;

    const translateMutationObserver = new TranslateMutationObserver(this.t, {
      targets: [div],
      filterAttribute: () => true,
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await Promise.all([translateMutationObserver.mutationCallback([{ target: div, addedNodes: [addedSpan] }]), translateMutationObserver.mutationCallback([])]);

    expect(span).property('id', this.t(value));
    expect(span).property('textContent', this.t(text));
    expect(addedSpan).property('id', this.t(addedValue));
    expect(addedSpan).property('textContent', this.t(addedText));
  }

  @test()
  public async throwAndRecover(): Promise<void> {
    const text = faker.lorem.word().toLocaleLowerCase();

    const div = document.createElement('div');
    div.textContent = text;

    const translateMutationObserver = new TranslateMutationObserver(() => {
      throw new CustomError();
    });
    const mutations = [{ target: div, addedNodes: [] }];

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await expect(translateMutationObserver.mutationCallback(mutations)).rejectedWith(CustomError);
    expect(div).property('textContent', text);

    translateMutationObserver.translateFunction = this.t;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await translateMutationObserver.mutationCallback(mutations);

    expect(div).property('textContent', this.t(text));
  }
}
