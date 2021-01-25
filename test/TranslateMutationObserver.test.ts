/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import './helper/MutationObserver.ts';
import './helper/window.ts';

import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';
import faker from 'faker';

import { TranslateMutationObserver } from '../src';

@suite()
export default class TranslateMutationObserverTest {
  @test()
  public options(): void {
    const div = document.createElement('div');

    const targets = [div];
    const attributes = ['1'];
    const attributeStartsWith = ['2'];
    const options = {
      targets,
      attributes,
      attributeStartsWith,
    };

    const translateMutationObserver = new TranslateMutationObserver(this.t, options);
    expect(translateMutationObserver).property('translateFunction', this.t);
    expect(translateMutationObserver).property('options', options);
  }

  @test()
  public translateFunctionParamType(): void {
    const text = faker.random.alpha();

    const div = document.createElement('div');
    div.textContent = text;

    const targets = [div];
    const attributes = ['1'];
    const attributeStartsWith = ['2'];
    const options = {
      targets,
      attributes,
      attributeStartsWith,
    };

    let called = false;
    const translateMutationObserver = new TranslateMutationObserver((str, { node }) => {
      called = true;
      expect(node).not.null.not.undefined;
      return str;
    }, options);
    translateMutationObserver.translate();

    expect(called).true;
  }

  @test()
  public defaultTargets(): void {
    const text = faker.random.alpha();
    document.body.textContent = text;

    const translateMutationObserver = new TranslateMutationObserver((str) => {
      expect(str).equal(text);
      return str;
    });
    translateMutationObserver.translate();
  }

  @test()
  public targets(): void {
    const text = faker.random.alpha();
    const div = document.createElement('div');
    div.textContent = text;
    const translateMutationObserver = new TranslateMutationObserver(this.t, {
      targets: [div],
    });
    translateMutationObserver.translate();

    expect(div).property('textContent', text.toLocaleUpperCase());
  }

  @test()
  public attributes(): void {
    const value = faker.random.alpha();

    const div = document.createElement('div');
    div.setAttribute('id', value);
    div.setAttribute('class', value);
    div.setAttribute('src', value);

    const translateMutationObserver = new TranslateMutationObserver(this.t, {
      targets: [div],
      attributes: ['id', 'class', 'src'],
    });

    translateMutationObserver.translate();

    expect(div).property('id', value.toLocaleUpperCase());
    expect(div).property('className', value.toLocaleUpperCase());
    expect(div.getAttribute('src')).equal(value.toLocaleUpperCase());
  }

  @test()
  public defaultAttributeStartsWith(): void {
    const value = faker.random.alpha();

    const div = document.createElement('div');
    div.setAttribute('aria-label', value);
    div.setAttribute('alt', value);
    div.setAttribute('title', value);

    const translateMutationObserver = new TranslateMutationObserver(this.t, {
      targets: [div],
    });

    translateMutationObserver.translate();

    expect(div.getAttribute('aria-label')).equal(value.toLocaleUpperCase());
    expect(div.getAttribute('alt')).equal(value.toLocaleUpperCase());
    expect(div.getAttribute('title')).equal(value.toLocaleUpperCase());
  }

  @test()
  public attributeStartsWith(): void {
    const value = faker.random.alpha();

    const div = document.createElement('div');
    div.dataset.test = value;

    const translateMutationObserver = new TranslateMutationObserver(this.t, {
      targets: [div],
      attributeStartsWith: ['data-'],
    });
    translateMutationObserver.translate();

    expect(div).property('dataset').property('test', value.toLocaleUpperCase());
  }

  @test()
  public childNodes(): void {
    const text = faker.random.alpha();

    const div = document.createElement('div');
    const span = document.createElement('span');
    span.textContent = text;
    div.appendChild(span);

    const translateMutationObserver = new TranslateMutationObserver(this.t, {
      targets: [div],
    });
    translateMutationObserver.translate();

    expect(span).property('textContent', text.toLocaleUpperCase());
  }

  @test()
  public childAttribute(): void {
    const value = faker.random.alpha();

    const div = document.createElement('div');
    const span = document.createElement('span');
    span.id = value;
    div.appendChild(span);

    const translateMutationObserver = new TranslateMutationObserver(this.t, {
      targets: [div],
      attributes: ['id'],
    });
    translateMutationObserver.translate();

    expect(span).property('id', value.toLocaleUpperCase());
  }

  @test()
  public customNode(): void {
    const text = faker.random.alpha();
    const value = faker.random.alpha();

    const div = document.createElement('div');
    const span = document.createElement('span');
    span.id = value;
    span.textContent = text;
    div.appendChild(span);

    const staticDiv = document.createElement('div');
    staticDiv.id = value;
    staticDiv.textContent = text;

    const translateMutationObserver = new TranslateMutationObserver(this.t, {
      targets: [staticDiv],
      attributes: ['id'],
    });
    translateMutationObserver.translate([div]);

    expect(span).property('textContent', text.toLocaleUpperCase());
    expect(span).property('id', value.toLocaleUpperCase());

    expect(staticDiv).property('textContent', text);
    expect(staticDiv).property('id', value);
  }

  @test()
  public doNotTranslateAttribute(): void {
    const value = faker.random.alpha();

    const div = document.createElement('div');
    const span = document.createElement('span');
    span.id = value;
    div.appendChild(span);

    const translateMutationObserver = new TranslateMutationObserver(this.t, {
      targets: [div],
    });
    translateMutationObserver.translate([div]);

    expect(span).property('id', value);
  }

  @test()
  public staticNew(): void {
    expect(TranslateMutationObserver.n(this.t)).property('constructor', TranslateMutationObserver);
  }

  @test()
  public mutationFunction(): void {
    const text = faker.random.alpha();
    const value = faker.random.alpha();

    const div = document.createElement('div');
    const span = document.createElement('span');
    span.id = value;
    span.textContent = text;
    div.appendChild(span);

    const addedText = faker.random.alpha();
    const addedValue = faker.random.alpha();
    const addedSpan = document.createElement('span');
    addedSpan.id = addedValue;
    addedSpan.textContent = addedText;

    const translateMutationObserver = new TranslateMutationObserver(this.t, {
      targets: [div],
      attributes: ['id'],
    });
    // @ts-ignore
    translateMutationObserver.mutationObserver.callback([
      {
        target: div,
        addedNodes: [addedSpan],
      },
    ]);
    // @ts-ignore
    translateMutationObserver.mutationObserver.callback([]);

    expect(span).property('id', value.toLocaleUpperCase());
    expect(span).property('textContent', text.toLocaleUpperCase());
    expect(addedSpan).property('id', addedValue.toLocaleUpperCase());
    expect(addedSpan).property('textContent', addedText.toLocaleUpperCase());
  }

  @test()
  public nonElementNodeShouldIgnore(): void {
    const text = faker.random.alpha();
    const value = faker.random.alpha();

    const title = document.createAttribute('title');
    title.value = value;
    const comment = document.createComment(text);

    const translateMutationObserver = new TranslateMutationObserver(this.t);
    translateMutationObserver.translate([title, comment]);

    expect(title).property('value', value);
    expect(comment).property('nodeValue', text);
  }

  @test()
  public translateAttributeSameValue(): void {
    const value = faker.random.alpha();

    const span = document.createElement('span');
    span.id = value;

    const translateMutationObserver = new TranslateMutationObserver((str) => str, {
      targets: [span],
      attributes: ['id'],
    });
    translateMutationObserver.translate();

    expect(span).property('id', value);
  }

  @test()
  public typeCheck(): void {
    expect(() => new TranslateMutationObserver(this.t, { targets: 1 } as never)).throw(TypeError);
    expect(() => new TranslateMutationObserver(this.t, { attributes: 1 } as never)).throw(TypeError);
    expect(() => new TranslateMutationObserver(this.t, { attributeStartsWith: 1 } as never)).throw(TypeError);
  }

  private t(str: string) {
    return str.toLocaleUpperCase();
  }
}
