let assert = require('assert'),
    equal = require('./modules/equal').equal;
describe('8 Функции', function () {
    describe('8.1 Определение функции', function () {
        it('8.1.1 Объявления функции', function () {
            function test() {
                return 'test';
            }
            equal(test(), 'test');
            equal(test instanceof Function, true);
            const a = test;
            equal(a instanceof Function, true);
        });
        it('8.1.2 Выражения функций', function () {
            const test = function a (num) {
                if (num === 1) {
                    return 'test';
                } else {
                    return a(1);
                }
            };
            equal(typeof a === 'undefined', true);
            equal(test(), 'test');
        });
        describe('8.1.3 Стрелочные функции', function () {
            it('Возвращает строку', function () {
                const test = () => 'test';
                equal(test(), 'test');
            });
            it('Возвращает объект', function () {
                const test = () => ({'test': 1});
                equal(test(), {'test': 1});
            });
            it('Возвращает объект через return', function () {
                const test = () => {let a = {'test': 1}; return a};
                equal(test(), {'test': 1});
            });
        });
        describe('8.2 Вызов функции', function () {
            describe('8.2.1 Вызов как функции', function () {
                it('Обычный вызов', function () {
                    let a = () => 'test';
                    equal(a(), 'test');
                });
                it('Условный вызов', function () {
                    let a = undefined;
                    let b = () => 'test';
                    equal(a?.(), undefined);
                    equal(b?.(), 'test');
                });
            });
            describe('8.2.2 Вызов метода', function () {
                it('Область видимости функций в методе', function () {
                    let o = {
                        m: function () {
                            equal(this, o);
                            f();
                            function f() {
                                assert.notDeepStrictEqual(this, o);
                            }
                            let a = function () {
                                assert.notDeepStrictEqual(this, o);
                            };
                            a();
                            const b = () => {
                                return this
                            }
                            equal(b(), this);
                            return 'test';
                        },
                    };
                    equal('test', o.m());
                });
                it('bind', function () {
                    const s = {},
                        f = function () {
                            equal(this, s);
                        }.bind(s);
                    f();
                });
            });
            it('8.2.3 Вызов конструктора', function () {
                let isCalled = false,
                    a = function () {
                        isCalled = true;
                    };
                new a();
                equal(isCalled, true);
            });
            it('8.2.4 Косвенный вызов функции', function () {
                const a = () => 'a',
                    b = () => 'b';
                equal(a.call(a), 'a');
                equal(b.apply(b), 'b');
            });
        });

        describe('8.3 Аргументы и параметры функции', function () {
            it('8.3.1 Необязательные параметры и стандартные значения', function () {
                const DEFAULT_VALUE = [1, 2, 3];
                let a = function (b = DEFAULT_VALUE) {
                    return b;
                };
                equal(a(), DEFAULT_VALUE);
            });
            it('8.3.2 Параметры остатка и списки аргументов переменной длины', function () {
                function max(first = -Infinity, ...vars) {
                    let maxValue = first;
                    for (let v of vars) {
                        if (maxValue < v) {
                            maxValue = v;
                        }
                    }
                    return maxValue;
                }
                equal(max(1, 5, 3, 2, 7, 2), 7);
            });
            it('8.3.3 Объект arguments', function () {
                function max() {
                    let maxValue = -Infinity;
                    for (let v of arguments) {
                        if (maxValue < v) {
                            maxValue = v;
                        }
                    }
                    return maxValue;
                }
                equal(max(1, 5, 3, 2, 7, 2), 7);
            });
            it('8.3.4 Операции распространения для вызовов функции', function () {
                let a = ['a', 'b'],
                    f = (a, b) => {
                        equal(a, 'a');
                        equal(b, 'b');
                    };
                f(...a);
            });
            describe('8.3.5 Деструктуризаци аргументов функции', function () {
                it('Деструктуризация массивов', function () {
                    let func = function ([a, b], [c, d]) {
                        equal(a, 'a');
                        equal(b, 'b');
                        equal(c, 'c');
                        equal(d, 'd');
                    };
                    func(['a', 'b'], ['c', 'd']);
                });
                it('Деструктуризация объектов', function () {
                    let func = function ({a: {c, d}, b}) {
                        equal(c, 'c');
                        equal(d, 'd');
                        equal(b, 'b');
                    };
                    func({a: {c: 'c', d: 'd'}, b: 'b'});
                });
                it('Деструктуризация объектов с переименованием аргумента', function () {
                    let func = ({x: x1, y: y1}, {x: x2, y: y2}) => {
                        equal(x1, 1);
                        equal(y1, 2);
                        equal(x2, 3);
                        equal(y2, 4);
                    };
                    func({x: 1, y: 2}, {x: 3, y:4});
                });
                it('Деструктуризация объектов со значением по-умолчанию', function () {
                    let func = ({x, y, z=3}) => {
                        equal(x, 1);
                        equal(y, 2);
                        equal(z, 3);
                    };
                    func({x: 1, y: 2});
                });
                it('Деструктуризация с параметрами остатка', function () {
                    let func = ({x, a: {x: xa, y: ya, ...aCoords}, ...coords}) => {
                        equal(x, 1);
                        equal(xa, 4);
                        equal(ya, 5);
                        equal(aCoords.z, 6);
                        equal(coords.y, 2);
                        equal(coords.z, 3);
                    };
                    func({x: 1, a: {x: 4, y: 5, z: 6}, y: 2, z: 3});
                });
            });
            it('8.3.6 Типы аргументов', function () {
                let sum = (a) => {
                        for (let v of a) {
                            if (typeof v !== 'number') {
                                throw new TypeError(v + ' is not number');
                            }
                        }
                    },
                    isCatchException = false;
                try {
                    sum(['sad']);
                } catch (e) {
                    isCatchException = true;
                }
                equal(isCatchException, true);
            });
        });
        describe('8.4 Функции как значения', function () {
            it('8.4.1 Определения собственных свойств функции', function () {
                let a = () => {
                    equal(a.x, 1);
                };
                a.x = 1;
                a();
            });
        });
        it('8.5 Функции как пространства имён', function () {
            (function () {
                let a = 'test';
            })();
            equal(typeof a, 'undefined');
        });
        it('8.6 Замыкания', function () {
            let next = (function () {
                    let currentCount = 0;
                    return function () {
                        return ++currentCount;
                    }
                })();
            equal(1, next());
            equal(2, next());
        });
        describe('8.7 Свойства, методы и конструктор функций', function () {
            it('8.7.1 Свойство length', function () {
                let func = (a, b, c, ...args) => {};
                equal(func.length, 3);
            });
            it('8.7.2 Свойство name', function () {
                let func = () => {};
                equal(func.name, 'func');
            });
            it('8.7.3 Свойство prototype', function () {
                let shortFunc = () => {};
                equal(typeof shortFunc.prototype, 'undefined');
                let varFunc = function () {};
                equal(varFunc.prototype, {});
                varFunc.prototype = {a: 1};
                let object = new varFunc;
                equal(object.a, 1);
            });
            describe('8.7.4 Методы call и apply', function () {
                it('Для обычных функций', function () {
                    let self = this,
                        selfObject = {a: 1},
                        func = function (a, b, c) {
                            equal(a, 'a');
                            equal(b, 'b');
                            equal(c, 'c');
                            equal(this, selfObject);
                        };
                    func.call(selfObject, 'a', 'b', 'c');
                    func.apply(selfObject, ['a', 'b', 'c']);
                });
                it('Для стрелочных функций первый параметр игнорируется', function () {
                    let self = this,
                        func = () => {
                            equal(this, self);
                        },
                        selfObject = {a: 1};
                    func.call(selfObject);
                    func.apply(selfObject);
                });
            });
            describe('8.7.5 Метод bind', function () {
                it('Привязывает объект к this функции', function () {
                    let o = {x: 1},
                        func = function () {
                            equal(this, o);
                        },
                        bindedFunc = func.bind(o),
                        otherObject = {
                            bindedFunc: bindedFunc,
                        };
                    bindedFunc();
                    otherObject.bindedFunc();
                });
                it('При использовании остальных аргументов вызывает частичное применение', function () {
                    let plus = (x, y) => x + y,
                        plusTwo = plus.bind(null, 2),
                        twoPlusTwo = plusTwo.bind(null, 2);
                    equal(plus.name, 'plus');
                    equal(3, plusTwo(1));
                    equal(plusTwo.name, 'bound plus');
                    equal(4, twoPlusTwo());
                    equal(twoPlusTwo.name, 'bound bound plus');
                });
            });
            it('8.7.6 Метод toString', function () {
                let func = function () {};
                equal(func.toString(), 'function () {}');
                let funcShort = () =>
                {};
                equal(funcShort.toString(), '() =>\n                {}');
            });
            describe('8.7.7 Конструктор Function', function () {
                it('Создаёт функцию', function () {
                    const f = new Function('x', 'y', 'return x*y');
                    equal(6, f(2, 3));
                });
                it('Создаёт анонимные функции', function () {
                    const f = new Function('return this');
                    assert.notDeepStrictEqual(f.name, undefined);
                });
                it('Имеет глобальную область видимости', function () {
                    const f = new Function('return this');
                    assert.notDeepStrictEqual(f(), this);
                });
            });
        });
    });
});