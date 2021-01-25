import { JSDOM } from 'jsdom';

const { window } = new JSDOM();
globalThis.document = window.document;
globalThis.Element = window.Element;
