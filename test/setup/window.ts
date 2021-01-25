import { jsdom } from './jsdom';

const { window } = jsdom;

globalThis.document = window.document;
globalThis.Element = window.Element;
