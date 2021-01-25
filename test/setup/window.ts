import { jsdom } from './jsdom';

const { window } = jsdom;

globalThis.MutationObserver = window.MutationObserver;
globalThis.document = window.document;
globalThis.Element = window.Element;
