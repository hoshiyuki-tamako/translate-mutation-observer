import { JSDOM } from 'jsdom';

const { window: { document } } = new JSDOM();
globalThis.document = document;
