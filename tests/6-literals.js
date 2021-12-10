let assert = require('assert'),
    equal = require('./modules/equal').equal;
describe('6 Объекты', function() {
    describe('6.10 Расширенный синтаксис объектных литералов', function () {
        describe('6.10.4 Операции распространения', function () {
            it('Свойства одного объекта копируются в другой', function () {
                let a = {x: 1, y: 0},
                    dimensions = {width: 100, height: 200},
                    rect = {...a, ...dimensions};
                equal(rect, {width: 100, height: 200, x: 1, y: 0});
            });

            it('Операции распространения распространяет только собственные свойства объекта, но не унаследованные', function () {
                let o = Object.create({x: 1}),
                    p = {...o};
                assert.strictEqual(p.x, undefined);
            });
        });


        describe('6.10.5. Сокращённая запись методов', function () {
            it('Сокращённая запись методов', function () {
                let square = {
                    area() {
                        return this.side * this.side
                    },
                    side: 100,
                };
                assert.strictEqual(100 * 100, square.area());
            });
            it('Сокращённая запись методов из переменной', function () {
                let name = 'area',
                    square = {
                    [name]() {
                        return true
                    },
                    side: 100,
                };
                assert.strictEqual(square.area(), true);
            });

            it('Имя свойства может принимать любую форму', function () {
                const METHOD_NAME = 'm';
                const symbol = Symbol();
                let weirdMethods = {
                    "method with spaces"(x) {
                        return x + 1
                    },
                    [METHOD_NAME](x) {
                        return x + 2
                    },
                    [symbol](x) {
                        return x + 3
                    },
                };
                assert.strictEqual(2, weirdMethods['method with spaces'](1));
                assert.strictEqual(3, weirdMethods[METHOD_NAME](1));
                assert.strictEqual(4, weirdMethods[symbol](1));
            });
        });

        describe('6.10.6 Методы получения и установки свойств', function () {
            it('Свойства с методами доступа можно обединить посредством расширения синтаксиса объектных литералов', function () {
                let o = {
                    dataProp: 1,
                    get accessorProp() {
                        return this.dataProp
                    },
                    set accessorProp(value) {
                        this.dataProp = value
                    },
                };
                assert.strictEqual(o.accessorProp, 1);
                o.accessorProp = 2;
                assert.strictEqual(o.accessorProp, 2);
            });
        });
    });
});
