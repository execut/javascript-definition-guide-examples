// import './modules/10-3-1-module-export-default';
let assert = require('assert'),
    equal = require('./modules/equal').equal;
describe('10 Модули', () => {
    // describe('10.1 Модули, использующие классы, объекты и замыкания', function () {
    //     describe('10.1.1 Автоматизация модульности на основе замыканий', function () {
    //     });
    // });
    it('10.2.1-2 Экспортирование и импортирование в Node', () => {
        const {TestClass} = require('./modules/10-2-1-module');
        let testClass = new TestClass;
        equal(testClass.a, 1);
    });
    // describe('10.3 Модули в ES6', function () {
    //     describe('10.3.1-2 Экспортирование и импортирование в ES6', function () {
    //         it('Импорт по-умолчанию', function () {
    //             let testClass = new TestClass;
    //             equal(testClass.b, 2);
    //         });
    //     });
    // });
});