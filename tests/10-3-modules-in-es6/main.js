import TestClass, {TEST_CONST} from "../modules/10-3-1-module-export-default.js"
import {EXPORTED_CONST} from "../modules/10-3-1-module-export-simple.js"
import * as simple from "../modules/10-3-1-module-export-simple.js"
let testClass = new TestClass;
import "../modules/10-3-1-module-without-export.js"
console.debug('10.3.2 default export', testClass.b);
console.debug('10.3.2 default export const', TEST_CONST);
console.debug('10.3.2 export', EXPORTED_CONST);
console.debug('10.3.2 default export', simple.EXPORTED_CONST);

import {EXPORTED_CONST as EXPORTED_CONST_ALIAS_1, EXPORTED_CONST as EXPORTED_CONST_ALIAS_2} from "../modules/10-3-1-module-export-simple.js"
console.debug('10.3.3 Импортирование с переименованием', EXPORTED_CONST_ALIAS_1, EXPORTED_CONST_ALIAS_2);

import {IMPORTED_CONST} from "../modules/10-3-4-module-with-second-export.js"
console.debug('10.3.4 Повторное экспортирование', IMPORTED_CONST);

import('../modules/10-3-1-module-export-simple.js').then(simple => {
    console.debug('10.3.6 Динамическое импортирование', simple);
});

import meta from '../modules/10-3-7-import-meta.js'
console.debug('10.3.7 Мета-информация импорта', meta);