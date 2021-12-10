// import './modules/10-3-1-module-export-default';
let assert = require('assert'),
    equal = require('./modules/equal').equal;
describe('12 Итераторы и генераторы', function () {
    describe('12.1 Особенности работы итераторов', function () {
        let iterable = [99],
            iterator = iterable[Symbol.iterator]();
        for (let result = iterator.next(); !result.done; result = iterator.next()) {
            equal(result.value, 99);
        }

        iterable = [0, 1, 2, 3, 4];
        iterator = iterable[Symbol.iterator]();
        let result = iterator.next();
        equal(result.done, false);
        equal(result.value, 0);
        equal([...iterator], [1, 2, 3, 4]);
    });
    describe('12.2 Реализация итерируемых объектов', function () {
        it ('Реализация Range как итерируемого объекта', function () {
            class Range {
                constructor(from, to) {
                    this.from = from;
                    this.to = to;
                }

                includes(x) {
                    return this.from <= x && this.to >= x;
                }

                [Symbol.iterator]() {
                    let value = this.from,
                        last = this.to;
                    return {
                        next() {
                            if (value <= last) {
                                return {
                                    value: value++,
                                };
                            } else {
                                return {
                                    done: true,
                                };
                            }
                        },
                    };
                }

                toString() {
                    return "(" + this.from + '...' + this.to + ')';
                }
            }

            let range = new Range(0, 9),
                iterations = 0;
            for (let key of range) {
                iterations++;
            }

            equal(iterations, 10);
            equal([...range], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        });
        it('Реализация функции обхода в форме итерируемого объекта', function () {
            let map = function (a, f) {
                let iterator = a[Symbol.iterator]();
                return {
                    [Symbol.iterator]() {
                        let key = 0;
                        return {
                            next() {
                                let v = iterator.next();
                                if (v.done) {
                                    return v;
                                } else {
                                    return {
                                        value: f(v.value),
                                    };
                                }
                            }
                        }
                    }
                };
            };

            let o = map([1, 2, 3], (x) => x + x),
                result = [];
            for (let v of o) {
                result.push(v);
            }

            equal(result, [2, 4, 6]);
        });
        it('Функция для поиска слов в тексте', function () {
            let words = (text) => {
                let regExpr = /\b\w+\b/ug;
                return {
                    [Symbol.iterator]() {
                        return {
                            next() {
                                let word = regExpr.exec(text);
                                if (word) {
                                    return {
                                        value: word[0],
                                    };
                                } else {
                                    return {
                                        done: true,
                                    };
                                }
                            }
                        }
                    },
                };
            }

            let iterator = words('test text Text фывфывфы'),
                result = [];
            for (let word of iterator) {
                result.push(word);
            }

            equal(result, ['test', 'text', 'Text']);
        });
        describe('12.2.1 "Закрытие" итератора: метод return()', function () {
            let returnIsCalled = false,
                iterable = (() => {
                return {
                    [Symbol.iterator]() {
                        return {
                            next() {
                                return {
                                    value: 123,
                                }
                            },
                            return() {
                                returnIsCalled = true;
                                return {};
                            }
                        }
                    }
                };
            })();
            for (let v of iterable) {
                break;
            }
            equal(returnIsCalled, true);
        });
    });
    describe('12.3 Генераторы', function () {
        it('Простой пример', function () {
            let generator = function* () {
                yield 1;
                yield 3;
                yield 5;
            },
            result = 0;
            for (let v of generator()) {
                result += v;
            }

            equal(result, 9);
            equal([...generator()], [1, 3, 5]);

            let iterator = generator();
            equal(iterator.next().value, 1);
            equal(iterator.next().value, 3);
            equal(iterator.next().value, 5);
            equal(iterator.next().done, true);

            equal(iterator[Symbol.iterator](), iterator)
        });
        describe('12.3.1 Примеры генераторов', function () {
            let fibonacci = function* () {
                let x = 0, y = 1;
                for (; ;) {
                    yield x;
                    [x, y] = [y, x + y];
                }
            };
            it('Числа Фиобоначчи', function () {
                let result = [];
                for (let v of fibonacci()) {
                    result.push(v);
                    if (result.length === 5) {
                        break;
                    }
                }

                equal(result, [0, 1, 1, 2, 3])
            });

            it('Take', function () {
                let take = function* (iterable, n) {
                    for (let v of iterable) {
                        if (n-- <= 0) {
                            return;
                        }

                        yield v;
                    }
                };

                equal([...take(fibonacci(), 5)], [0, 1, 1, 2, 3]);
            });

            it('zip', function () {
                let zip = function* (iterables) {
                    let iterators = iterables.map(x => x[Symbol.iterator]()),
                        key = 0;
                    while (iterators.length) {
                        if (iterators.length === 0) {
                            break;
                        }

                        if (key >= iterators.length) {
                            key = 0;
                        }

                        let iterator = iterators[key];
                        let v = iterator.next();
                        if (v.done) {
                            iterators.splice(key, 1);
                            continue;
                        }

                        key++;
                        yield v.value;
                    }
                };

                equal([...zip([[1, 2, 3], [4, 5, 6], 'ab'])], [1, 4, 'a', 2, 5, 'b', 3, 6]);
            });
        });
        it('12.3.2 yield* и рекурсивные генераторы', function () {
            let sequence = function* (...iterables) {
                for (let iterable of iterables) {
                    for (let v of iterable) {
                        yield v.value;
                    }
                }
            };

            let args = [[1, 2, 3], [4, 5, 6], 'ab'];
            let expected = [1, 2, 3, 4, 5, 6, 'a', 'b'];
            equal(...sequence(...args), expected);

            let sequenceRecursive = function* (...iterables) {
                for (let iterable of iterables) {
                    yield* iterable;
                }
            };
            equal([...sequenceRecursive(...args)], expected);
        });
    });
    describe('12.4 Расширенные возможности генераторов', function () {
        it('12.4.1 Возвращаемое значение генераторной функции', function () {
            let generator = function* () {
                    yield 1;
                    return 'done';
                },
                iterator = generator();
            equal(iterator.next(), {
                done: false,
                value: 1,
            });
            equal(iterator.next(), {
                done: true,
                value: 'done',
            });
            equal(iterator.next(), {
                done: true,
                value: undefined,
            });
            equal([...generator()], [1]);
        });
        it('12.4.2 Значение выражения yield', function () {
            let generator = function* () {
                let v = yield 1;
                equal(v, 'a');
                v = yield 2;
                equal(v, 'b');
            },
            iterator = generator();
            equal(iterator.next('ignored'), {
                value: 1,
                done: false,
            });
            iterator.next('a');

            iterator.next('b');
        });
        it('12.4.3 Методы return() и throw() генератора', function () {
            let catchIsCalled = false,
                generator = function* () {
                let counter = 1;
                    for (;;) {
                        try {
                            yield counter++;
                        } catch (e) {
                            catchIsCalled = true;
                            counter = 0;
                        }
                    }

                    return 5;
                },
                iterator = generator();
            equal(iterator.next().value, 1);
            equal(iterator.next().value, 2);
            iterator.throw(new Error('test'));
            equal(catchIsCalled, true);
            equal(iterator.next().value, 1);
        });
    });
});