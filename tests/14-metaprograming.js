let chai = require('chai');
let assert = chai.assert;
describe('14 Метапрограммирование', () => {
    describe('14.1 Артибуты свойств', function () {
        it('Дескриптор свойств', () => {
            let o = {x: 1},
                descriptor = Object.getOwnPropertyDescriptor(o, 'x');
            assert.deepStrictEqual(descriptor, {
                value: 1,
                writable: true,
                configurable: true,
                enumerable: true
            });

            const oWithReadOnlyProp = {
                    get x() {
                        return 1
                    }
                };
            descriptor = Object.getOwnPropertyDescriptor(oWithReadOnlyProp, 'x');
            assert.instanceOf(descriptor.get, Function);
            assert.propertyVal(descriptor, 'set', undefined);
            assert.propertyVal(descriptor, 'configurable', true);
            assert.propertyVal(descriptor, 'enumerable', true);
            assert.isUndefined(Object.getOwnPropertyDescriptor({}, 'x'));
            assert.isUndefined(Object.getOwnPropertyDescriptor({}, 'toString'));
        });
        it('Object.defineProperty Объявление своих дескрипторов', function () {
            let o = {};
            Object.defineProperty(o, 'notWritable', {
                value: 1,
                writable: false,
                enumerable: true,
                configurable: true
            });
            o.notWritable = 2;
            assert.propertyVal(o, 'notWritable', 1);

            Object.defineProperty(o, 'notEnumerable', {
                value: 1,
                writable: true,
                enumerable: false,
                configurable: true
            });
            assert.propertyVal(o, 'notEnumerable', 1);
            assert.hasAllKeys(o, ['notWritable']);

            Object.defineProperty(o, 'notConfigurable', {
                configurable: false
            });
            assert.throws(() => Object.defineProperty(o, 'notConfigurable', {
                configurable: true
            }), 'Cannot redefine property: notConfigurable');
            let descriptor = Object.getOwnPropertyDescriptor(o, 'notConfigurable');
            assert.isFalse(descriptor.configurable)

            Object.defineProperty(o, 'withGetter', {
                get: () => 2
            });
            assert.deepStrictEqual(o.withGetter, 2);
        });
        it('Object.defineProperties - несколько за раз', function () {
            let o = {};
            Object.defineProperties(o, {
                x: { value: 1},
                y: { value: 2},
            });
            assert.deepStrictEqual(o.x, 1);
            assert.deepStrictEqual(o.y, 2);
        });
        it('Object.create() - объявление свойств через второй аргумент', function () {
            let o = Object.create({}, {
                x: {
                    value: 1,
                    writable: false,
                }
            });
            o.x = 2;
            assert.propertyVal(o, 'x', 1);
        });
        it('Реализация метода для копирования дескрипторов свойств объекта', function () {
            let o = Object.create({}, {
                y: {
                    enumerable: false,
                    value: 1,
                },
                x: {
                    enumerable: true,
                    get() {
                        return 2;
                    }
                },
            });
            let oCopyViaAssign = {};
            Object.assign(oCopyViaAssign, o);
            assert.deepStrictEqual(oCopyViaAssign, {
                x: 2
            });
            let ownPropertyDescriptor = Object.getOwnPropertyDescriptor(oCopyViaAssign, 'x');
            assert.deepStrictEqual(ownPropertyDescriptor.value, 2);

            Object.defineProperty(Object, 'assignProperties', {
                value: function (target, ...sources) {
                    for (let source of sources) {
                        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
                    }
                }
            });

            let oCopyViaNewAssign = {};
            Object.assignProperties(oCopyViaNewAssign, o);
            let ownPropertyDescriptors = Object.getOwnPropertyDescriptors(oCopyViaNewAssign);
            assert.deepStrictEqual(ownPropertyDescriptors.x.get, Object.getOwnPropertyDescriptor(o,'x').get);
            assert.isObject(ownPropertyDescriptors.y);
            assert.isFalse(ownPropertyDescriptors.y.enumerable);
        });
    });
    describe('14.2 Расширяемость объектов', () => {
        it('Атрибут extensible и Object.preventExtensions() делают объект нерасширяемым', () => {
            let OA = function () {},
                OB = function () {};
            OA.a = 1;
            OB.configuredProperty = 2;
            OB.prototype = OA;
            let ob = new OB();

            assert.isTrue(Object.isExtensible(ob));
            assert.isTrue(Object.isExtensible(ob.prototype));
            assert.isFalse(Object.isExtensible(ob.prototype.prototype));

            Object.preventExtensions(OB);
            assert.isFalse(Object.isExtensible(OB));
            assert.isTrue(Object.isExtensible(OA));

            assert.throws(() => {
                Object.defineProperty(OB, 'definedAfterPrevent', {
                    value: 3,
                });
            }, 'Cannot define property definedAfterPrevent, object is not extensible');

            OB.definedAfterPrevent = 123;
            assert.isUndefined(OB.definedAfterPrevent);
            Object.defineProperty(OB, 'configuredProperty', {
                value: 3,
            });
            assert.deepStrictEqual(OB.configuredProperty, 3);
        });
        it('Object.seal() делает все поля неконфигурируемыми', () => {
            let OB = function () {};
            OB.configuredProperty = 3;

            assert.deepStrictEqual(Object.getOwnPropertyDescriptor(OB, 'configuredProperty').configurable, true);
            let OBSealed = Object.seal(OB);
            assert.deepStrictEqual(OB, OBSealed);
            // Все свойства перестали быть конфигурируемы
            assert.deepStrictEqual(Object.getOwnPropertyDescriptor(OBSealed, 'configuredProperty').configurable, false);
            assert.isTrue(Object.isSealed(OB));
        });
        it('Object.freeze() делает объект ещё и неизменяемым', function () {
            let o = function () {};
            o.writableProperty = 1;
            assert.isTrue(Object.getOwnPropertyDescriptor(o, 'writableProperty').writable);
            assert.isTrue(Object.getOwnPropertyDescriptor(o, 'writableProperty').configurable);
            assert.isTrue(Object.getOwnPropertyDescriptor(o, 'writableProperty').enumerable);
            assert.deepStrictEqual(Object.freeze(o), o);
            assert.isTrue(Object.isFrozen(o));
            assert.isFalse(Object.getOwnPropertyDescriptor(o, 'writableProperty').writable);
            assert.isFalse(Object.getOwnPropertyDescriptor(o, 'writableProperty').configurable);
            assert.isTrue(Object.getOwnPropertyDescriptor(o, 'writableProperty').enumerable);
        });
    });
    describe('14.3 Свойство prototype', () => {
        it('Object.getPrototypeOf', () => {
            assert.deepStrictEqual(Object.getPrototypeOf([]), Array.prototype);
            assert.deepStrictEqual(Object.getPrototypeOf({}), Object.prototype);
        });
        it('Object.prototype.isPrototypeOf()', () => {
            let p = {x: 1},
                o = Object.create(p);
            assert.isTrue(p.isPrototypeOf(o));
            assert.isFalse(o.isPrototypeOf(p));
            assert.isTrue(Object.prototype.isPrototypeOf(o));
            assert.isTrue(Object.prototype.isPrototypeOf(p));
        });
        it('Object.setPrototypeOf()', () => {
            let p = {x: 1},
                o = {};
            assert.deepStrictEqual(Object.setPrototypeOf(o, p), p);
            assert.isTrue(p.isPrototypeOf(o));
            assert.equal(p.x, 1);
        });
    });
    describe('14.4 Хорошо известные объекты Symbol', () => {
        it('14.4.1 Symbol.iterator и Symbol.asyncIterator', () => {});

        it('14.4.2 Symbol.hasInstance', () => {
            let uint8 = {
                [Symbol.hasInstance](x) {
                    return Number.isInteger(x) && x >= 0 && x <= 128;
                },
            };
            assert.isTrue(128 instanceof uint8);
            assert.isFalse(256 instanceof uint8);
            assert.isFalse(Math.PI instanceof uint8);
        });
        it('14.4.3 Symbol.toStringTag', () => {
            let newObject = {
                get [Symbol.toStringTag]() {
                    return 'test';
                }
            };
            assert.deepStrictEqual(newObject.toString(), '[object test]');
        });
        it('14.4.4 Symbol.species', () => {
            class EZArray extends Array {
            }

            let a = new EZArray();
            assert.instanceOf(a.map(() => {}), EZArray);
            assert.instanceOf(a.concat([]), EZArray);
            assert.instanceOf(a.filter(() => {}), EZArray);
            assert.instanceOf(a.slice(0), EZArray);
            assert.instanceOf(a.splice(0), EZArray);

            let NewClass = function () {};
            Object.defineProperty(EZArray, Symbol.species, {
                get: () => NewClass
            });

            assert.instanceOf(a.map(() => {}), NewClass);
            assert.instanceOf(a.concat([]), NewClass);
            assert.instanceOf(a.filter(() => {}), NewClass);
            assert.instanceOf(a.slice(0), NewClass);
            assert.instanceOf(a.splice(0), NewClass);
        });
        it('14.4.5 Symbol.isConcatSpreadable', () => {
            let ArrayLike = {
                [Symbol.isConcatSpreadable]: true,
                0: 1,
                length: 1,
            };
            assert.deepStrictEqual([].concat(ArrayLike), [1]);

            let NotArrayLike = {
                [Symbol.isConcatSpreadable]: false,
                0: 1,
                length: 1,
            };
            assert.deepStrictEqual([].concat(NotArrayLike), [NotArrayLike]);
        });
        it('14.4.6 Объекты Symbol для сопоставления с образцом', () => {
            let o = {
                [Symbol.search](s) {
                    assert.deepStrictEqual(s, 'test');
                    return -1;
                },
                [Symbol.match](s) {
                    assert.deepStrictEqual(s, 'test');

                    return ['matchResult'];
                },
                [Symbol.replace](s) {
                    assert.deepStrictEqual(s, 'test');

                    return 'replaced result';
                },
                [Symbol.split](s) {
                    assert.deepStrictEqual(s, 'test');

                    return 'split result';
                }
            };

            let s = 'test';
            assert.deepStrictEqual(s.search(o), -1);
            assert.deepStrictEqual(s.match(o), ['matchResult']);
            assert.deepStrictEqual(s.replace(o), 'replaced result');
            assert.deepStrictEqual(s.split(o), 'split result');
        });
        it('14.4.7 Symbol.toPrimitive', () => {
            let toBool = {
                    [Symbol.toPrimitive](type) {
                        assert.deepStrictEqual(type, 'default');
                        return false;
                    }
                },
                toNumber = {
                    [Symbol.toPrimitive](type) {
                        assert.deepStrictEqual(type, 'number');
                        return 123;
                    }
                },
                toString = {
                    [Symbol.toPrimitive](type) {
                        assert.deepStrictEqual(type, 'string');
                        return 'test';
                    }
                };

            assert.isTrue(toBool == false);
            assert.deepStrictEqual(toNumber * 1, 123);
            assert.deepStrictEqual(`${toString}`, 'test');
        });
    });
    describe('14.5 Теги шаблонов', () => {
        function html(strings, ...values) {
            let escaped = values.map(x => String(x).replace('<', '&lt;')
                .replace('>', '&gt;'));
            let result = strings[0];
            for (let [key, value] of escaped.entries()) {
                result += value + strings[key + 1];
            }

            return result;
        }

        let variable = '</html>';
        assert.deepStrictEqual(html `<html>${variable}</html>`, '<html>&lt;/html&gt;</html>');
    });
    describe('14.6 API-интерфейс Reflect', () => {
        it('Reflect.apply()', () => {
            let f = function (a, b) {
                    assert.deepStrictEqual(a, 'a');
                    assert.deepStrictEqual(b, 'b');
                },
                o = {};
            Reflect.apply(f, o, ['a', 'b']);
        });
        it('Reflect.construct()', () => {
            let c = function (a, b) {
                    assert.equal(a, 'a');
                    assert.equal(b, 'b');
                    assert.equal(new.target, c);
                },
                target = new Function(),
                cWithNewTarget = function (a, b) {
                    assert.equal(new.target, target);
                };
            Reflect.construct(c, ['a', 'b']);
            Reflect.construct(cWithNewTarget, [], target);
        });
        it('Reflect.defineProperty()', () => {});
        it('Reflect.deleteProperty()', () => {});
        it('Reflect.get()', () => {});
        it('Reflect.getOwnPropertyDescriptor()', () => {});
        it('Reflect.getPrototypeOf()', () => {});
        it('Reflect.has()', () => {});
        it('Reflect.isExtensible()', () => {});
        it('Reflect.ownKeys()', () => {});
        it('Reflect.preventExtensions()', () => {});
        it('Reflect.set()', () => {});
        it('Reflect.setPrototypeOf()', () => {});
    });
    describe('14.7 Объекты Proxy', () => {
    });
});