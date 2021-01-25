import { suite, test } from '@testdeck/mocha';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import faker from 'faker';

import { NodeTranslator } from '../src';
import { TestBase } from './base';
import { jsdom } from './setup';

chai.use(chaiAsPromised);

@suite()
export default class NodeTranslatorTest extends TestBase {
  @test()
  public options(): void {
    const div = document.createElement('div');

    const targets = [div];
    const filter = () => true;
    const filterAttribute = () => false;
    const options = {
      targets,
      filter,
      filterAttribute,
    };

    const nodeTranslator = new NodeTranslator(this.t, options);
    expect(nodeTranslator).property('translateFunction', this.t);
    expect(nodeTranslator).property('options', options);
    expect(nodeTranslator).property('options').property('targets', targets);
    expect(nodeTranslator).property('options').property('filter', filter);
    expect(nodeTranslator).property('options').property('filterAttribute', filterAttribute);
  }

  @test()
  public async translateFunctionParamType(): Promise<void> {
    const text = faker.lorem.word().toLocaleLowerCase();

    const div = document.createElement('div');
    div.textContent = text;

    let called = false;
    const nodeTranslator = new NodeTranslator((str, { node }) => {
      called = true;
      expect(node).instanceOf(jsdom.window.Node);
      return str;
    }, { targets: [div] });
    await nodeTranslator.translate();
    expect(called).true;
  }

  @test()
  public async defaultTargets(): Promise<void> {
    const text = faker.lorem.word().toLocaleLowerCase();
    document.body.textContent = text;

    let called = false;
    const nodeTranslator = new NodeTranslator((str) => {
      called = true;
      expect(str).equal(text);
      return str;
    });
    await nodeTranslator.translate();
    expect(called).true;
  }

  @test()
  public async targets(): Promise<void> {
    const text = faker.lorem.word().toLocaleLowerCase();
    const div = document.createElement('div');
    div.textContent = text;
    const nodeTranslator = new NodeTranslator(this.t, {
      targets: [div],
    });
    await nodeTranslator.translate();

    expect(div).property('textContent', this.t(text));
  }

  @test()
  public async defaultFilter(): Promise<void> {
    const text = faker.lorem.word().toLocaleLowerCase();

    const div = document.createElement('div');
    div.textContent = text;

    const nodeTranslator = new NodeTranslator(this.t, {
      targets: [div],
    });
    await nodeTranslator.translate();

    expect(div).property('textContent', this.t(text));
  }

  @test()
  public async filter(): Promise<void> {
    const text = faker.lorem.word().toLocaleLowerCase();

    const div = document.createElement('div');
    const span1 = document.createElement('span');
    span1.textContent = text;
    const span2 = document.createElement('span');
    span2.textContent = text;
    span2.classList.add('do-not-translate');
    div.appendChild(span1);
    div.appendChild(span2);

    const nodeTranslator = new NodeTranslator(this.t, {
      targets: [div],
      filter(node) {
        return !(node instanceof Element && node.classList.contains('do-not-translate'));
      },
    });
    await nodeTranslator.translate();

    expect(span1).property('textContent', this.t(text));
    expect(span2).property('textContent', text);
  }

  @test()
  public async defaultFilterAttribute(): Promise<void> {
    const value = faker.lorem.word().toLocaleLowerCase();

    const div = document.createElement('div');
    div.id = value;

    const nodeTranslator = new NodeTranslator(this.t, {
      targets: [div],
    });
    await nodeTranslator.translate();

    expect(div).property('id', value);
  }

  @test()
  public async filterAttribute(): Promise<void> {
    const value = faker.lorem.word().toLocaleLowerCase();
    const lang = 'en';

    const div = document.createElement('div');
    div.id = value;
    div.setAttribute('lang', lang);

    const nodeTranslator = new NodeTranslator(this.t, {
      targets: [div],
      filterAttribute(attribute) {
        return attribute.name === 'id';
      },
    });
    await nodeTranslator.translate();

    expect(div).property('id', this.t(value));
    expect(div.getAttribute('lang')).equal(lang);
  }

  //
  @test()
  public async childTextNode(): Promise<void> {
    const text = faker.lorem.word().toLocaleLowerCase();

    const div = document.createElement('div');
    const span = document.createElement('span');
    span.textContent = text;
    div.appendChild(span);

    const nodeTranslator = new NodeTranslator(this.t, {
      targets: [div],
    });
    await nodeTranslator.translate();

    expect(span).property('textContent', this.t(text));
  }

  @test()
  public async childAttribute(): Promise<void> {
    const value = faker.lorem.word().toLocaleLowerCase();

    const div = document.createElement('div');
    const span = document.createElement('span');
    span.id = value;
    div.appendChild(span);

    const nodeTranslator = new NodeTranslator(this.t, {
      targets: [div],
      filterAttribute: () => true,
    });
    await nodeTranslator.translate();

    expect(span).property('id', this.t(value));
  }

  @test()
  public async callWithCustomNode(): Promise<void> {
    const text = faker.lorem.word().toLocaleLowerCase();
    const value = faker.lorem.word().toLocaleLowerCase();

    const div = document.createElement('div');
    const span = document.createElement('span');
    span.id = value;
    span.textContent = text;
    div.appendChild(span);

    const staticDiv = document.createElement('div');
    staticDiv.id = value;
    staticDiv.textContent = text;

    const nodeTranslator = new NodeTranslator(this.t, {
      targets: [staticDiv],
      filterAttribute: () => true,
    });
    await nodeTranslator.translate([div]);

    expect(span).property('textContent', this.t(text));
    expect(span).property('id', this.t(value));

    expect(staticDiv).property('textContent', text);
    expect(staticDiv).property('id', value);
  }

  @test()
  public async nonElementNodeShouldIgnore(): Promise<void> {
    const text = faker.lorem.word().toLocaleLowerCase();
    const value = faker.lorem.word().toLocaleLowerCase();

    const title = document.createAttribute('title');
    title.value = value;
    const comment = document.createComment(text);

    const nodeTranslator = new NodeTranslator(this.t);
    await nodeTranslator.translate([title, comment]);

    expect(title).property('value', value);
    expect(comment).property('nodeValue', text);
  }

  @test()
  public async translateAttributeSameValue(): Promise<void> {
    const value = faker.lorem.word().toLocaleLowerCase();

    const span = document.createElement('span');
    span.id = value;

    const nodeTranslator = new NodeTranslator((str) => str, {
      targets: [span],
      filterAttribute: () => true,
    });
    await nodeTranslator.translate();

    expect(span).property('id', value);
  }

  @test()
  public async typeCheck(): Promise<void> {
    expect(() => new NodeTranslator(this.t, { targets: 1 } as never)).throw(TypeError);
    expect(() => new NodeTranslator(this.t, { filter: 1 } as never)).throw(TypeError);
    expect(() => new NodeTranslator(this.t, { filterAttribute: 1 } as never)).throw(TypeError);

    expect(() => new NodeTranslator(this.t, { targets: [document] })).not.throw();
    expect(() => new NodeTranslator(this.t, { filter: () => true })).not.throw();
    expect(() => new NodeTranslator(this.t, { filterAttribute: () => true })).not.throw();
  }
}
