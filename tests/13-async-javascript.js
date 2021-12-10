let assert = require('chai').assert,
    fetch = require('node-fetch'),
    sinon = require("sinon");

// var chaiAsPromised = require("chai-as-promised");
// chai.use(chaiAsPromised);
const jsonUrl = 'http://127.0.0.1:3000/13.2-promise/response.json';
const expectedJSON = {
    testKey: 'testValue'
};

describe('13 Асинхронный JavaScript', () => {
    describe('13.1.1 Таймеры', () => {
        it('setTimeout', function (done) {
            setTimeout(done, 0);
        });
    });

    describe('13.2 Объекты Promise', function () {
        it('13.2.2 Выстраивание объектов Promise в цепочки', (done) => {
            /**
             * Promise - обещание
             * Ожидающий решения (pending) - не отклонён и не удовлетворён
             * Отклонён (rejected) - был вызван следующий catch в цепочке или второй обратный вызов в then
             * Удовлетворён (fulfilled) - был вызван следующий обратный вызов (если в текущем обещатии было возвращено ещё одно обещание, то ожидается его урегулирование)
             * Урегулироавнный (settled) - отклонён или удовлетворён
             * Разрешённый (resolved) - происходит возврат из обратного вызова обещания
             * p1 -> p2 -> p3 -> p7 -> p4 -> p5 -> p6
             */
            let getJSON = (url) => {
                let p1 = fetch(url),
                    r1 = null,
                    r2 = null,
                    p7 = null;
                assert.instanceOf(p1, Promise);

                let p2 = p1.then(response => {
                        assert.deepStrictEqual(response.ok, true);
                        assert.deepStrictEqual(response.url, jsonUrl);
                        assert.deepStrictEqual(response.status, 200);
                        r1 = response;
                        return response;
                    }),
                    p3 = p2.then(function (response) {
                        assert.deepStrictEqual(response, r1);

                        p7 = response.json()
                        assert.instanceOf(p7, Promise);

                        return p7;
                    }),
                    c3 = sinon.spy(document => {
                        assert.notDeepEqual(document, p7);
                        assert.equal(document.testKey, "testValue");
                        return document;
                    }),
                    p4 = p3.then(c3).then((a) => {
                        assert.isTrue(c3.calledOnce);
                        done();
                    }),
                    p5 = p4.catch(e => {
                        done(e);
                    });

                return p5;
            };
            getJSON(jsonUrl);
        });
        describe('13.2.4 Дополнительные сведения об объектах Promise и ошибках', function () {
            describe('Методы .catch() и .finally()', function () {
                it('перехват ошибок через then()', async function () {
                    return fetch('http://127.0.0.1:3001').then(function () {
                        assert.isTrue(false);
                    }, (e) => {
                        assert.instanceOf(e, Error);
                    });
                });
                it('catch()', async function () {
                    let onError = e => {
                            assert.notStrictEqual(e.message, 'is from when');
                            assert.instanceOf(e, Error);
                        };
                    return fetch('http://127.0.0.1:3001').then((r) => {
                        throw new Error('is from when');
                    }).catch(onError);
                });
                it('finally()', async function () {
                    return fetch(jsonUrl)
                        .finally(() => {
                            throw new Error('finally before catch')
                        })
                        .catch((e) => {
                            assert.strictEqual(e.message, 'finally before catch');
                        })
                        .finally(() => {
                            throw new Error('finally after catch')
                        }).catch((e) => {
                            assert.strictEqual(e.message, 'finally after catch');
                        });
                });
            });
        });
        describe('13.2.5 Параллельное выполнение нескольких асинхронных операций с помощью Promise', function () {
            it('Promise.all()', async function () {
                let urls = [jsonUrl],
                    promises = urls.map(url => fetch(url).then(r => r.json()));
                promises.push('simple value');
                return Promise.all(promises)
                    .then((bodies) => {
                        assert.deepStrictEqual(bodies, [
                            {
                                "testKey": "testValue"
                            },
                            'simple value'
                        ]);
                    });
            });
            it('Promise.all() с первым отклонением отклоняется без ожидания остальных обещаний', function (done) {
                let timeoutResolved = false,
                    promises = [
                        new Promise((resolve, rejected) => {
                            setTimeout(function () {
                                timeoutResolved = true;
                                resolve();
                            }, 100);
                        }),
                        Promise.resolve(123),
                        Promise.reject('Reject reason'),
                    ];
                Promise.all(promises).catch(e => {
                    assert.isFalse(timeoutResolved);
                    done();
                });
            });
            it('Promise.allSettled() никогда не отклоняется без урегулирования остальных обещаний', function (done) {
                let promises = [
                        new Promise((resolve, rejected) => {
                            setTimeout(function () {
                                resolve('abc');
                            }, 0);
                        }),
                        Promise.resolve(123),
                        Promise.reject('Reject reason'),
                    ];
                Promise.allSettled(promises).then(results => {
                    assert.deepStrictEqual(results, [
                        {
                            "status": "fulfilled",
                            "value": 'abc'
                        },
                        {
                            "status": "fulfilled",
                            "value": 123
                        },
                        {
                            "reason": "Reject reason",
                            "status": "rejected"
                        }
                    ]);
                    done();
                }).catch(e => {
                    done(e);
                });
            });
            it('Promise.race() возвращает первый успешный результат', function (done) {
                let promises = [
                    new Promise((resolve, rejected) => {
                        setTimeout(function () {
                            resolve('abc');
                        }, 0);
                    }),
                    Promise.resolve(123),
                ];
                Promise.race(promises).then(v => {
                    assert.deepStrictEqual(v, 123);
                    done();
                }).catch(e => done(e));
            });
        });
        describe('13.2.6 Создание объектов Promise', function () {
            it('Объекты Promise, основанные на других объектах Promise', function (done) {
                let promise = Promise.resolve(123),
                    promise2 = promise.then(p => {
                        assert.deepStrictEqual(p, 123);
                        done();
                        return p;
                    });
                assert.instanceOf(promise2, Promise);
            });
            it('Объекты Promise, основанные на синхронных значениях', function () {
                let resolved = Promise.resolve(2),
                    rejected = Promise.reject(3);
            });
            it('Объекты Promise с нуля', function (done) {
                let wait = function (timeout) {
                    return new Promise((resolve, rejected) => {
                        setTimeout(function () {
                            resolve(123);
                        }, timeout);
                    });
                };
                wait(0).then(x => {
                    assert.deepStrictEqual(x, 123);
                    done();
                });
            });
        });
        describe('13.2.7 Последовательное выполнение нескольких асинхронных операций с помощью Promise', () => {
            it('Цепочка для последовательного асинхронного парсинга списка url', (done) => {
                let bodies = [],
                    fetchUrl = url => fetch(url)
                        .then(response => response.json())
                        .then(body => bodies.push(body)),
                    fetchSequentially = (urls) => {
                    let p = false;
                    for (let url of urls) {
                        if (!p) {
                            p = fetchUrl(url);
                        } else {
                            p = p.then(() => fetchUrl(url));
                        }
                    }

                    return p.then(() => bodies);
                };
                fetchSequentially([jsonUrl, jsonUrl]).then(bodies => {
                    assert.deepStrictEqual(bodies, [
                        {
                            testKey: 'testValue'
                        },
                        {
                            testKey: 'testValue'
                        },
                    ]);
                    done();
                })
            });

            it('Последовательный асинхронный парсинг списка url', (done) => {
                let fetchUrl = url => fetch(url)
                        .then(response => response.json()),
                    outputs = [],
                    promiseSequentially = (inputs, promiseMaker) => {
                        if (inputs.length === 0) {
                            return outputs;
                        }

                        let input = inputs.shift();
                        return promiseMaker(input)
                                .then((output) => {
                                    outputs.push(output);
                                    return promiseSequentially(inputs, promiseMaker);
                                });
                    };

                promiseSequentially([jsonUrl, jsonUrl], fetchUrl).then(bodies => {
                    assert.deepStrictEqual(bodies, [
                        expectedJSON,
                        expectedJSON,
                    ]);
                    done();
                })
            });
        });
    });
    describe('13.3 async и await', function () {
        let getJSON = async (url) => {
            let response = await fetch(url);
            return await response.json();
        };
        describe('13.3.3 Ожидание множества объектов Promise', () => {
            it('Функция getJSON, реализованная с применением async и await', (done) => {
                getJSON(jsonUrl).then(function (result) {
                    assert.deepStrictEqual(result, expectedJSON);
                    done();
                });
            });
            it('Функция getJSON, реализованная с применением async и await в тесте с async', async () => {
                let result = await getJSON(jsonUrl);
                assert.deepStrictEqual(result, expectedJSON);
            });
            it('Promise.all c await', async () => {
                let result = await Promise.all([getJSON(jsonUrl), getJSON(jsonUrl)]);
                assert.deepStrictEqual(result, [
                    expectedJSON,
                    expectedJSON,
                ]);
            });
        });
        describe('13.3.4 Детали реализации', function () {
            it('Функция через async', async function () {
                let isReject = false;
                async function test() {
                    if (isReject) {
                        throw new Error('test');
                    }

                    return true;
                }

                assert.isTrue(await test());
                try {
                    isReject = true;
                    await test();
                } catch (e) {
                    assert.deepStrictEqual(e.message, 'test');
                }
            });
            it('Функция через Promise', function (done) {
                let isReject = false;
                function test() {
                    return new Promise(function (resolve, reject) {
                        try {
                            if (isReject) {
                                throw new Error('test');
                            }

                            resolve(true);
                        } catch (e) {
                            reject(e);
                        }
                    });
                }

                test().then(function (v) {
                    assert.isTrue(v);
                    isReject = true;
                    test().catch(e => {
                        assert.deepStrictEqual(e.message, 'test');
                        done();
                    });
                });
            });
        });
        describe('13.4 Асинхронная итерация', function () {
            describe('13.4.1 Цикл for/await', () => {
                const urls = [jsonUrl, jsonUrl];
                const promises = urls.map(url => fetch(url).then(r => r.json()));
                it('Обычный цикл', async function () {
                    let results = [];
                    for (let promise of promises) {
                        results.push(await promise);
                    }

                    assert.deepStrictEqual(results, [
                        expectedJSON,
                        expectedJSON
                    ]);
                });
                it('await цикл', async () => {
                    let results = [];
                    for await (let response of promises) {
                        results.push(response);
                    }

                    assert.deepStrictEqual(results, [
                        expectedJSON,
                        expectedJSON
                    ]);
                });
            });

            describe('13.4.3 Асинхронные генераторы', () => {


                function elapsedTime(ms) {
                    return new Promise(resolve => setTimeout(resolve, ms));
                }

                async function* clock(interval, max = Infinity) {
                    for (let count = 0; count <= max; count++) {
                        await elapsedTime(interval);
                        yield count;
                    }
                }

                it('Часы через async/await', (done) => {

                    async function runClockAsync() {
                        let tick;
                        for await (tick of clock(0, 3)) {
                        }

                        assert.deepStrictEqual(tick, 3);
                        done();
                    }

                    runClockAsync();
                });

                it('Часы через обычный код', function (done) {
                    function runClockSync() {
                        let generator = clock(0, 3),
                            tick;
                        let promise = generator.next();

                        function addHandleToPromise(promise) {
                            promise.then(function (v) {
                                if (v.done) {
                                    assert.deepStrictEqual(tick, 3);
                                    done();
                                } else {
                                    tick = v.value;
                                    promise = generator.next();
                                    addHandleToPromise(promise);
                                }
                            });
                        }

                        addHandleToPromise(promise);
                    }

                    runClockSync();
                });
            });

            describe('13.4.4 Реализация асинхронных итераторов', () => {
                it('Часы', async () => {
                    function until(time) {
                        return new Promise(resolve => setTimeout(resolve, time - Date.now()));
                    }

                    function clock(interval, max = Infinity) {
                        let count = 0,
                            startTime = Date.now();
                        return {
                            [Symbol.asyncIterator]() {
                                return {
                                    async next() {
                                        if (count < max) {
                                            count++;
                                            await until(startTime + interval * count);
                                            return {
                                                value: count,
                                            };
                                        } else {
                                            return {
                                                done: true,
                                            }
                                        }
                                    },
                                };
                            }
                        };
                    }

                    let count = 0;
                    for await (count of clock(0, 3)) {
                    }

                    assert.deepStrictEqual(count, 3);
                });
                it('Асинхронно итерируемая очередь', async () => {
                    class AsyncQueue {
                        values = []
                        resolvers = []
                        closed = false
                        EOS = Symbol('end-of-stream')
                        enqueue(value) {
                            if (this.closed) {
                                throw new Error('Is closed');
                            }

                            if (this.resolvers.length) {
                                let resolver = this.resolvers.shift();
                                resolver(value);
                            } else {
                                this.values.push(value);
                            }
                        }
                        dequeue() {
                            if (this.values.length) {
                                let value = this.values.shift();
                                return Promise.resolve(value);
                            }

                            if (this.closed) {
                                return Promise.resolve(this.EOS);
                            }

                            return new Promise(resolver => this.resolvers.push(resolver));
                        }
                        [Symbol.asyncIterator]() {
                            let self = this;
                            return {
                                next() {
                                    return self.dequeue().then((v) => {
                                        if (v === self.EOS) {
                                            return {
                                                done: true,
                                                value: undefined,
                                            };
                                        } else {
                                            return {
                                                done: false,
                                                value: v,
                                            };
                                        }
                                    });
                                }
                            };
                        }
                        close() {
                            while (this.resolvers.length) {
                                this.resolvers.shift()(this.EOS);
                            }

                            this.closed = true;
                        }
                    }

                    let q = new AsyncQueue();
                    q.enqueue('test1');
                    q.enqueue('test2');
                    setTimeout(function () {
                        q.enqueue('test3');
                        q.close();
                    }, 0);
                    let results = [];
                    for await (let v of q) {
                        results.push(v);
                    }

                    assert.deepStrictEqual(results, ['test1', 'test2', 'test3']);
                });
            });
        });
    });
});