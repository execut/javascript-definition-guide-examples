let assert = require('assert'),
    equal = require('./modules/equal').equal;
describe('9 Классы', function () {
    describe('9.1 Классы и прототипы', function () {
        it('Простой класс', function () {
            function range(from, to) {
                let r = Object.create(range.methods);
                r.from = from;
                r.to = to;

                return r;
            }

            range.methods = {
                includes(x) {
                    return this.from <= x && this.to >= x;
                },
                * [Symbol.iterator]() {
                    for (let x = Math.ceil(this.from); x <= Math.ceil(this.to); x++) yield x;
                },
                toString() {
                    return "(" + this.from + '...' + this.to + ')';
                },
            };
            let rangeObject = range(1, 10);
            equal(rangeObject.includes(5), true);
            equal(rangeObject.includes(11), false);
            for (let number of rangeObject) {
                equal(rangeObject.includes(number), true);
            }

            equal(rangeObject.toString(), '(1...10)');
            equal([...rangeObject], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        });
    });
    describe('9.2 Классы и конструкторы', function () {
        it('Класс через прототип', function () {
            function Range(from, to) {
                this.from = from;
                this.to = to;
            }

            Range.prototype = {
                includes(x) {
                    return this.from <= x && this.to >= x;
                },
                * [Symbol.iterator]() {
                    for (let x = Math.ceil(this.from); x <= Math.ceil(this.to); x++) yield x;
                },
                toString() {
                    return "(" + this.from + '...' + this.to + ')';
                },
            };
            let rangeObject = new Range(1, 10);
            equal(rangeObject.includes(5), true);
            equal(rangeObject.includes(11), false);
            for (let number of rangeObject) {
                equal(rangeObject.includes(number), true);
            }

            equal(rangeObject.toString(), '(1...10)');
            equal([...rangeObject], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        });
        it('new.target не пустой, если функция была вызвана как конструктор', function () {
            let target = false;
            const constructorFunc = function () {
                    target = Boolean(new.target);
                };
            new constructorFunc;
            equal(target, true);
        });
        it('new.target undefined, если функция была вызвана обычным образом', function () {
            let target = false;
            const constructorFunc = function () {
                target = new.target;
            };
            constructorFunc();
            equal(target, undefined);
        });

        describe('9.2.1 Конструкторы, идентичность классов и операция instanceof', function () {
            it('instanceof', function () {
                function MainClass() {}
                function SubClass() {}
                SubClass.prototype = MainClass.prototype;
                equal(new SubClass() instanceof MainClass, true);
                equal(new SubClass() instanceof SubClass, true);
                equal(new MainClass() instanceof MainClass, true);
            });
            it('isPrototypeOf', function () {
                function MainClass() {}
                function SubClass() {}
                function OtherClass() {}
                SubClass.prototype = MainClass.prototype;
                let subClass = new SubClass(),
                    mainClass = new MainClass();
                equal(MainClass.prototype.isPrototypeOf(subClass), true);
                equal(SubClass.prototype.isPrototypeOf(subClass), true);

                equal(MainClass.prototype.isPrototypeOf(mainClass), true);
                equal(SubClass.prototype.isPrototypeOf(mainClass), true);

                equal(Object.prototype.isPrototypeOf(mainClass), true);

                equal(OtherClass.prototype.isPrototypeOf(mainClass), false);
            });
        });

        describe('9.2.2 Свойство constructor', function () {
            it('Function.prototype.constructor содержит Function', function () {
                let func = function () {};
                equal(func.prototype.constructor, func);
            });
            it('Свойство constructor экземпляра класса содержит Function', function () {
                let func = function () {},
                    instanceOfFunc = new func();
                equal(instanceOfFunc.constructor, func);
            });
            it('Прототипы наследуются, а с ними и конструктор', function () {
                let MainClass = function (b) {
                    this.b = b;
                };
                MainClass.prototype.a = 1;
                let mainClass = new MainClass();
                equal(mainClass.a, 1);
                MainClass.prototype.a = 2;
                equal(mainClass.a, 2);

                equal(MainClass.prototype.constructor, MainClass);
                equal(mainClass.constructor, MainClass);
            });
        });
    });

    describe('9.3 Классы с ключевым словом class', function () {
        it('Класс Range с ключевым словом class', function () {
            class Range {
                constructor(from, to) {
                    this.from = from;
                    this.to = to;
                }

                includes(x) {
                    return this.from <= x && this.to >= x;
                }

                * [Symbol.iterator]() {
                    for (let x = Math.ceil(this.from); x <= Math.ceil(this.to); x++) yield x;
                }

                toString() {
                    return "(" + this.from + '...' + this.to + ')';
                }
            }

            let rangeObject = new Range(1, 10);
            equal(rangeObject.includes(5), true);
            equal(rangeObject.includes(11), false);
            for (let number of rangeObject) {
                equal(rangeObject.includes(number), true);
            }

            equal(rangeObject.toString(), '(1...10)');
            equal([...rangeObject], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            equal(rangeObject.constructor, Range.prototype.constructor);
            equal(rangeObject.constructor, Range);
        });
        it('Наследование с помощью extends', function () {
            class MainClass {}
            class SubClass extends MainClass {}
            let subClass = new SubClass();
            equal(subClass instanceof MainClass, true);
        });
        it('9.3.1 Статические методы', function () {
            class MainClass {
                static staticMethod() {
                    return 'a';
                }
            }

            equal(MainClass.staticMethod(), 'a');
        });
        it('9.3.2 Методы получения и установки', function () {
            class MainClass {
                _variable = 2
                get Variable() {
                    return this._variable;
                }

                set Variable(v) {
                    this._variable = v;
                }
            }
            let instance = new MainClass();
            equal(instance.Variable, 2);
            instance.Variable = 1;
            equal(instance.Variable, 1);
        });
        it('9.3.3 Открытые, закрытые и статические поля', function () {
            class MainClass {
                #size = 0;
                static staticField = 123;
                static #staticAndProtectedField = 123;
                get size() {
                    return this.#size;
                }
                static getProtectedField() {
                    return this.#staticAndProtectedField;
                }
            }
            let inst = new MainClass;
            equal(inst.size, 0);
            inst['#size'] = 123;
            equal(inst.size, 0);

            equal(MainClass.staticField, 123);
            equal(MainClass.staticAndProtectedField, undefined);
            equal(MainClass['#staticAndProtectedField'], undefined);
            equal(MainClass.getProtectedField(), 123);
        });
    });
    describe('9.4 Добавление методов в существующие классы', function () {
        it('Пример', () => {
            Array.prototype.sumOfSubarrays = function () {
                let result = 0;
                for (let subArray of this) {
                    if (subArray instanceof Array) {
                        result += subArray.sumOfSubarrays();
                    } else if (Number.isInteger(subArray)) {
                        result += subArray;
                    }
                }

                return result;
            };

            const a = [1, 2, [3, [4, 5]]],
                result = a.sumOfSubarrays();
            delete Array.prototype.sumOfSubarrays;
            equal(result, 15);
        });
    });
    describe('9.5 Подклассы', function () {
        it('9.5.1 Подклассы и прототипы', function () {
            function MainClass() {
                this.b = 2;
            }
            MainClass.prototype = Object.create({a: 1});
            function SubClass() {
                this.d = 4;
            }
            SubClass.prototype = Object.create(MainClass.prototype);
            SubClass.prototype.c = 3;

            let mainClass = new MainClass(),
                subClass = new SubClass();
            equal(mainClass.a, 1);
            equal(mainClass.b, 2);
            equal(mainClass.c, undefined);
            equal(mainClass.d, undefined);
            equal(subClass.a, 1);
            equal(subClass.b, undefined);
            equal(subClass.c, 3);
            equal(subClass.d, 4);
        });
        it('9.5.2 Создание подклассов с использованием extends и super', function () {
            class EZArray extends Array {
                constructor() {
                    super();
                }
                get first() {
                    return this[0];
                }
                get last() {
                    return this[this.length - 1];
                }
            }
            let a = new EZArray();
            equal(a instanceof Array, true);
            equal(a instanceof EZArray, true);
            equal(a.push(1, 2, 3, 4), 4);
            equal(a.first, 1);
            equal(a.last, 4);
            equal(a[1], 2);
            equal(Array.isArray(a), true);
            equal(EZArray.isArray(a), true);
            equal(Array.prototype.isPrototypeOf(EZArray.prototype), true);
            equal(Array.isPrototypeOf(EZArray), true);
        });
        it('9.5.3 Делегирование вместо наследования', function () {
            class Histogram {
                map = new Map
                count(key) {
                    return this.map.get(key) || 0;
                }

                add(key) {
                    return this.map.set(key, this.count(key) + 1);
                }
            }

            let histogram = new Histogram;
            equal(histogram.count('test'), 0);
            histogram.add('test');
            equal(histogram.count('test'), 1);
        });
    });
});