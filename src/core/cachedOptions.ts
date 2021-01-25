import { NodeTranslator, TranslateOptionsRequired } from './NodeTranslator';

export const cachedOptions = new WeakMap<NodeTranslator, TranslateOptionsRequired>();
