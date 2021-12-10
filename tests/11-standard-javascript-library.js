// import './modules/10-3-1-module-export-default';
let assert = require('assert'),
    equal = require('./modules/equal').equal;
describe('11 Стандартная библиотека JavaScript', function () {
    describe('11.1 Множества и отображения', function () {
        describe('11.1.1 Класс для множества Set', function () {
            it('add', function () {
                let s = new Set([1]);
                equal(s.size, 1);
                s.add(1).add(true).add([1]);
                equal(s.size, 3);
            });
            it('delete', function () {
                let a = [1, 2],
                    s = new Set([1, "1", true, a]);
                equal(s.size, 4);
                equal(s.delete(2), false);
                equal(s.delete(true), true);
                equal(s.size, 3);

                equal(s.delete([1]), false);
                equal(s.delete(a), true);
                equal(s.size, 2);

                equal(s.clear(), undefined);
                equal(s.size, 0);
            });
            it('has', function () {
                let s = new Set([1, true]);
                equal(s.has(1), true);
                equal(s.has('1'), false);
            });
            it('iteration', function () {
                let s = new Set([1, true]);
                for (let v of s) {
                    equal(Boolean(v), true);
                }
                s.forEach(function (v, k) {
                    if (v === 1) {
                        equal(k, 1);
                    } else {
                        equal(v, true);
                        equal(k, true);
                    }
                });
                let a = [...s];
                equal(a, [1, true]);
            })
        });
        describe('11.1.2 Класс для отображений Map', function () {
            it('constructor', function () {
                let m = new Map([['one', 1], ['two', 2]]);
                equal(m.size, 2);

                m = new Map(m);
                equal(m.size, 2);

                let o = {one: 1, two: 2};
                m = new Map(Object.entries(o));
                equal(m.size, 2);
            });
            it('set/get', function () {
                let m = new Map();
                m.set(true, 1).set(false, 2).set('three', 3);
                equal(m.get(true), 1);
                equal(m.get(false), 2);
                equal(m.get('three'), 3);
                equal(m.get('four'), undefined);
            });
            it('delete', function() {
                let m = new Map([['one', 1], ['two', 2]]);
                equal(m.delete('one'), true);
                equal(m.delete('one'), false);
                equal(m.size, 1);
                equal(m.clear(), undefined);
                equal(m.size, 0);
            });
            it('has\объекты можно использовать для ключей', function () {
                let m = new Map;
                let o = {};
                m.set(o, undefined);
                equal(m.has({}), false);
                equal(m.has(o), true);
                equal(m.get(o), undefined);

                m.set(m, true);
                equal(m.has(m), true);
                equal(m.get(m), true);
            });
            it('Операция распространения', function () {
                let a = [['one', 1], ['two', 2]],
                    m = new Map(a);
                equal([...m], a);
                equal([...m.entries()], a);
                equal([...m.keys()], ['one', 'two']);
                equal([...m.values()], [1, 2]);
            });
            it('Итерирование', function () {
                let m = new Map([['x', 1]]);
                for (let v of m) {
                    equal(v, ['x', 1]);
                }
                m.forEach(function (v, k) {
                    equal(v, 1);
                    equal(k, 'x');
                });

                for (let [x, v] of m) {
                    equal(x, 'x');
                    equal(v, 1);
                }
            });
        });
        describe('11.1.3 WeakMap и WeakSet', function () {
            it('WeakMap', function () {
                let wm = new WeakMap,
                    o = {};
                equal(wm.set(o, true).get(o), true);
                equal(wm.size, undefined);
            });
            it('WeakSet', function () {
                let ws = new WeakSet,
                    o = {};
                ws.add(o);
                equal(ws.has(o), true);
                equal(ws.size, undefined);
            });
        });
    });
    describe('11.2 Типизированные массивы и двоичные данные', function () {
        describe('11.2.1 Типы типизированных массивов', function () {
            let int8 = new Int8Array; // байты
            equal(int8.BYTES_PER_ELEMENT, 1);
            let uint8 = new Uint8Array; // и без знака
            equal(uint8.BYTES_PER_ELEMENT, 1);
            let uint8c = new Uint8ClampedArray; // и без переноса бит
            equal(uint8c.BYTES_PER_ELEMENT, 1);
            let int16 = new Int16Array; // 16 битные короткие целые числа со знаком
            equal(int16.BYTES_PER_ELEMENT, 2);
            let uint16 = new Uint16Array;
            equal(uint16.BYTES_PER_ELEMENT, 2);
            let int32 = new Int32Array; // 32 битные целые числа
            equal(int32.BYTES_PER_ELEMENT, 4);
            let uint32 = new Uint32Array;
            equal(uint32.BYTES_PER_ELEMENT, 4);
            let int64 = new BigInt64Array; // 64-битные значения BigInt
            equal(int64.BYTES_PER_ELEMENT, 8);
            let uint64 = new BigUint64Array;
            equal(uint64.BYTES_PER_ELEMENT, 8);
            let float32 = new Float32Array; // 32-битные значения с плавающей точкой
            equal(float32.BYTES_PER_ELEMENT, 4);
            let float64 = new Float64Array; // 64-битные значения с плавающей точкой, обыкновенные числа JavaScript
            equal(float64.BYTES_PER_ELEMENT, 8);
        });
        describe('11.2.2 Создание типизированных массивов', function () {
            let bytes = new Uint8Array(3),
                bytesFromArray = new Uint8Array([50, 100, 200]),
                bytesOf = Uint8Array.of(50, 100, 200),
                bytesFrom = Uint8Array.from([50, 100, 200]),
                bytesBuffer = new ArrayBuffer(255 * 4),
                bytesFromBuffer = new Uint8Array(bytesBuffer),
                bytesFromBufferWithOffset = new Uint8Array(bytesBuffer, 255, 3);
            equal(bytesBuffer.byteLength, 255*4);
            equal(bytesFromArray, bytesOf);
            equal(bytesFrom, bytesOf);
        });
        describe('11.2.3 Использование типизированных массивов', function () {
            let bytes = new Uint8Array(3);
            bytes[0] = 200;
            equal(bytes[0], 200);
            bytes[1] = 256;
            equal(bytes[1], 0);
            bytes[2] = -1;
            equal(bytes[2], 255);
            equal(bytes.fill(2).map(x => x*x).join(''), '444');
        });
        describe('11.2.4 Методы и свойства типизированных массивов', function () {
            it('set', function () {
                let bytes = new Uint8Array(1024),
                    pattern = new Uint8Array([0, 1, 2, 3]);
                bytes.set(pattern);
                equal(bytes[3], 3);
                let offset = 4;
                bytes.set(pattern, offset);
                equal(bytes[offset + 3], 3);
                offset += 4;
                bytes.set([4, 5, 6, 7], offset);
                equal(bytes[offset + 3], 7);
                equal(bytes.slice(0, offset + 4), new Uint8Array([0, 1, 2, 3, 0, 1, 2, 3, 4, 5, 6, 7]));
            });
            it('subarray', function () {
                let a = new Uint16Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
                let last3 = a.subarray(a.length - 3, a.length);
                equal(last3, new Uint16Array([7, 8, 9]));
                last3[0] = 2;
                equal(a[7], 2);
                equal(a.buffer, last3.buffer);
                equal(a.byteOffset, 0);
                equal(a.byteLength, 20);
                equal(last3.byteOffset, 14);
                equal(last3.byteLength, 6);
                equal(last3.buffer.byteLength, 20);
            });
        });
        describe('11.2.5 DataView', function () {
            it('Определение порядка следования байтов у системы. От младшему к старшему', function () {
                let littleEndian = new Uint8Array(new Int32Array([1]).buffer)[0] === 1;
                equal(littleEndian, true);
            });
            it('DataView', function () {
                let buffer = new ArrayBuffer(8),
                    dataView = new DataView(buffer, 0, 8);
                dataView.setUint8(0, 1);
                equal(dataView.getUint8(0), 1);
                equal(dataView.getUint16(0, true), 1);
                equal(dataView.getUint16(0, false), 256);
                equal(dataView.getUint16(0), 256);
                equal(dataView.getUint32(0, true), 1);
                equal(dataView.getUint32(0), 256 * 256 * 256);
            });
        });
    });
    describe('11.3 Регулярные выражения', function () {
        describe('11.3.1 Определение регулярных выражений', function () {
            it('Создание', function () {
                let pattern = /s$/,
                    patternViaConstructor = new RegExp('s$');
            });
            it('Буквальные символы', function () {
                equal(/^\0$/.test('\0'), true);
                equal(/^\t$/.test('\t'), true);
                equal(/^\x0A$/.test('\n'), true);
                equal(/^\u0009$/.test('\t'), true);
                equal(/^\cJ$/.test('\n'), true);
            });
            it('Классы символов', function () {
                equal(/^[\u0400-\u04FF]$/.test('Ф'), true, 'Все кириллические символы');
                equal(/^\w$/.test('h'), true, 'Любой символ слов ASCII');
                equal(/^\W$/.test('ы'), true, 'Любой символ не ASCII');
                equal(/^\s$/.test(' '), true, 'Любой пробельный символ');
                equal(/^\S$/.test('п'), true, 'Любой не пробельный символ');
                equal(/^\d$/.test('2'), true, 'Любая цифра ASCII');
                equal(/^[\b]$/.test(String.fromCharCode(8)), true, 'Символ забоя');
            });
            it('Классы символов unicode', function () {
                equal(/^\p{Decimal_Number}+$/u.test('𝟏𝟐𝟑𝟜𝟝𝟞𝟩𝟪𝟫𝟬𝟭𝟮𝟯𝟺𝟻𝟼'), true, 'Все десятичные числа');
                equal(/^\p{Number}+$/u.test('②Ⅱ'), true, 'Все числа');
                equal(/^\p{Script=Cyrillic}+$/u.test('Фф'), true, 'Кирилические символы');
                equal(/^\p{Script=Cyrillic}+$/u.test('β'), false, 'Кирилические символы');
            });
            it('Группы', function () {
                equal(/^(first)\1$/.test('firstfirst'), true, 'Можно ссылаться на предыдущие группы с помощь \X, где Х - номер группы');
                equal(/^(?:test)(first)\1$/.test('testfirstfirst'), true, 'Не использовать группу для ссылок');
                equal(/^(?<first>first)\k<first>$/.test('firstfirst'), true, 'Именование группы');
            });
            it('Указание позиции соответствия', function () {
                equal(/^\bword\b$/.test('word'), true);
                equal(/^\bword\b$/.test('words'), false);
                equal(/\Bword\B/.test('swords'), true);
                equal(/\Bword\B/.test('sword'), false);
            });
            it('Флаги', function () {
                equal('testtest'.match(/test/g).length, 2, 'С глобальным флагом');
                equal('testtest'.match(/test/).length, 1, 'Без глобального флага');

                equal(/Test/i.test('test'), true, 'Не чуствительно к регистру');

                equal(/^test$/m.test('abc\ntest'), true, 'Многострочность');
                equal(/^test$/.test('abc\ntest'), false, 'Многострочность отключена');

                equal(/^test$/.test('abc\ntest'), false, 'Многострочность отключена');

                equal(/^.+$/s.test('abc\ntest'), true, 'Включать в . символы новой строки');
                equal(/^.+$/.test('abc\ntest'), false, 'Не включать в . символы новой строки');

                equal(/^.$/u.test('😀'), true, 'Работает с >16-битными значениями');
                equal(/^.$/.test('😀'), false, 'Не работает с >16-битными значениями');

                let regexp = /test/yg;
                equal('testtest'.match(regexp).length, 2, 'Все вхождения последовательно равны test');
                equal('teststest'.match(/test/yg).length, 1, 'После первого вхождения есть символ s, поэтому поиск на первом обрывается');
            });
        });
        describe('11.3.2 Строковые методы для сопоставления с образцом', function () {
            it('search', function () {
                equal('asdtest'.search(/test/u), 3);
                equal('asdtest'.search('test'), 3);
                equal('asdtest'.search(/fas/u), -1);
            });
            it('replace', function () {
                equal('test "test"'.replace(/"(?<first>[^"]*)"/u, '«$<first>»'), 'test «test»');
                equal('A 10'.replace(/(?<num>\d+)/ug, function (matchFull, match, position, fullString, groups) {
                    equal(matchFull, '10');
                    equal(match, '10');
                    equal(position, 2);
                    equal(fullString, 'A 10');
                    equal(groups.num, '10');
                    return Number(match).toString(16).toUpperCase();
                }), 'A A');
            });
            it('match', function () {
                let matchObject = 'asdfirstsecondasdfirstsecond'.match(/(?<first>first)(?<second>second)/);
                equal(matchObject.length, 3);
                equal(matchObject.input, 'asdfirstsecondasdfirstsecond');
                equal(matchObject.index, 3);
                equal(matchObject[0], 'firstsecond');
                equal(matchObject[1], 'first');
                equal(matchObject[2], 'second');
                equal(matchObject.groups.first, 'first');
                equal(matchObject.groups.second, 'second');


                let matchObjectForGlobal = 'asdfirstsecondasdfirstsecond'.match(/(?<first>first)(?<second>second)/g);
                equal(matchObjectForGlobal.length, 2);
                equal(matchObjectForGlobal.input, undefined);
                equal(matchObjectForGlobal.index, undefined);
                equal(matchObjectForGlobal.groups, undefined);
                equal(matchObjectForGlobal[0], 'firstsecond');
                equal(matchObjectForGlobal[1], 'firstsecond');
            });

            it('matchAll', function () {
                let regExp = /\b(\p{Alphabetic}+)\b/gu,
                    text = 'Let find words',
                    result = [];
                for (let word of text.matchAll(regExp)) {
                    result.push(word[0]);
                    equal(word[1].length > 0, true);
                }

                equal(result, ['Let', 'find', 'words']);
            });

            it('split', function () {
                equal('test,test'.split(','), ['test', 'test']);
                equal('test, test'.split(/[ ,]+/), ['test', 'test']);
            });
        });

        describe('11.3.3', function () {
            it('Конструктор и свойства', function () {
                let regExp = new RegExp('\\dpattern', 'igmsuy');
                equal(regExp.source, '\\dpattern')
                equal(regExp.flags, 'gimsuy');
                equal(regExp.lastIndex, 0);
                equal(regExp.dotAll, true);
                equal(regExp.global, true);
                equal(regExp.ignoreCase, true);
                equal(regExp.multiline, true);
                equal(regExp.sticky, true);
                equal(regExp.unicode, true);
                equal(regExp.test('1pattern'), true);
                equal(regExp.lastIndex, 8);
                let regExpCopy = new RegExp(regExp);
                equal(regExpCopy.test('1pattern'), true);
            });
            describe('exec', function () {
                let regExp = /(?<firstGroup>first)(?<secondGroup>second)/ug;
                let result = regExp.exec('testfirstsecondtest');
                equal(regExp.lastIndex, 15);
                equal(result.input, 'testfirstsecondtest');
                equal(result.index, 4);
                equal(result[0], 'firstsecond');
                equal(result[1], 'first');
                equal(result[2], 'second');
                equal(result.groups.firstGroup, 'first');
                equal(result.groups.secondGroup, 'second');
            });
        });
    });
    describe('11.4 Дата и время', function () {
        it('Конструктор', function () {
            let simpleNow = new Date();
            equal(simpleNow.valueOf(), Date.now());
            let unixTime = new Date(0);
            equal(unixTime.toUTCString(), 'Thu, 01 Jan 1970 00:00:00 GMT');
            equal(unixTime.toISOString(), '1970-01-01T00:00:00.000Z');
            let ownTime = new Date(1988, 0, 2, 4, 2, 1, 400);
            equal(ownTime.toString(), 'Sat Jan 02 1988 04:02:01 GMT+0300 (Moscow Standard Time)');
            let ownTimeWithoutArguments = new Date(1988, 0, 2, 4);
            equal(ownTimeWithoutArguments.toString(), 'Sat Jan 02 1988 04:00:00 GMT+0300 (Moscow Standard Time)');
            let dateFromString = new Date('2020-10-02');
            equal(dateFromString.getFullYear(), 2020);
            equal(dateFromString.getMonth(), 9);
            equal(dateFromString.getDate(), 2);

            equal(Date.parse('2020-10-02'), 1601596800000);
        });
        describe('11.4.1 Отметки времени', function () {
            it('Отметки', function () {
                equal(Date.now() > 0, true);
                let now = new Date();
                equal(now.getTime() > 0, true);
                now.setTime(100);
                equal(now.getTime(), 100);
                equal(now.valueOf(), 100);
            });
            it('Объект Performance для наносекунд', function () {
                let start = performance.now();
                equal(performance.now() - start > 0, true);
            });
        });
        describe('11.4.2 Арифметические действия с датами', function () {
            let date = new Date(2020, 11, 1);
            date.setMonth(date.getMonth() + 1, 2);
            equal(date.getMonth(), 0);
            equal(date.getDate(), 2);
            equal(date.getFullYear(), 2021);
        });
        describe('11.4.3 Форматирование и разбор строк с датами', function () {
            let d = new Date(2020, 0, 1, 17, 10, 30);
            equal(d.toString(), 'Wed Jan 01 2020 17:10:30 GMT+0300 (Moscow Standard Time)');
            equal(d.toUTCString(), 'Wed, 01 Jan 2020 14:10:30 GMT');
            equal(d.toLocaleString(), '1/1/2020, 5:10:30 PM');
            equal(d.toLocaleTimeString(), '5:10:30 PM');
            equal(d.toISOString(), '2020-01-01T14:10:30.000Z')
            equal(d.toDateString(), 'Wed Jan 01 2020');
            equal(d.toTimeString(), '17:10:30 GMT+0300 (Moscow Standard Time)');
        });
    });
    describe('11.5 Классы ошибок', function () {
        let error = new Error('test');
        equal(error.toString(), 'Error: test');
        equal(error.name, 'Error');
        equal(error.stack.length > 0, true);
    });
    describe('11.6 Сериализация и разбор данных в формате JSON', function () {
        it('stringify', function () {
            let o = {s: 'test', n: 0};
            equal(JSON.stringify(o), '{"s":"test","n":0}');
            equal(JSON.stringify(o, null, 1), '{\n "s": "test",\n "n": 0\n}');
            equal(JSON.stringify(o, null, 2), '{\n  "s": "test",\n  "n": 0\n}');
            equal(JSON.stringify(o, null, '    '), '{\n    "s": "test",\n    "n": 0\n}');
            equal(JSON.stringify(o, function (key, value) {
                if (key === 's') {
                    equal(key, 's');
                    equal(value, 'test');
                    return 'asd';
                }

                return value;
            }), '{"s":"asd","n":0}');
            equal(JSON.stringify(o, ['n']), '{"n":0}');
        });
        it('stringify через toJSON', function () {
            class TestClass {
                toJSON() {
                    return 'test';
                }
            }
            let o = new TestClass();
            equal(JSON.stringify(o), '"test"');
        });
        it('parse', function () {
            let s = '{"s":"test","n":0}';
            equal(JSON.parse(s), {"s":"test","n":0});
            equal(JSON.parse(s, function (key, value) {
                if (key === 's') {
                    return 'asd';
                }

                return value;
            }), {s:'asd', n: 0});
        });
    });
    describe('11.7 API-интерфейс интернационализации', function () {
        describe('11.7.1 Форматирование чисел', function () {
            let arabic = new Intl.NumberFormat('ar', {useGrouping: false}).format;
            equal(arabic(1234567890), '١٢٣٤٥٦٧٨٩٠');

            let russian = new Intl.NumberFormat('ru', {style: 'currency', currency: 'RUB', currencyDisplay: 'symbol'}).format;
            equal(russian(123000), '123 000,00 ₽');

            russian = new Intl.NumberFormat('ru', {style: 'currency', currency: 'RUB', currencyDisplay: 'name'}).format;
            equal(russian(123000), '123 000,00 российского рубля');
        });
        describe('11.7.2 Форматирование даты и времени', function () {
            let opts = {
                    year: 'numeric',
                    era: "short",
                },
                d = new Date(2020, 0);
            equal(Intl.DateTimeFormat('ru', opts).format(d), '2020 г. н. э.');
            equal(Intl.DateTimeFormat('ru-u-ca-iso8601', opts).format(d), '2020 г. н. э.');
            equal(Intl.DateTimeFormat('ru-u-ca-hebrew', opts).format(d), '5780 г. AM');
        });
        describe('11.7.3 Сравнение строк',function () {
            const collator = new Intl.Collator(undefined, {
                usage: 'sort',
                sensitivity: 'variant',
                ignorePunctuation: true,
                caseFirst: 'upper',
                numeric: true,
            }).compare;
            equal(['q2', 'q 10', 'q', 'j', 'Q', 'J'].sort(collator), ['J', 'j', 'Q', 'q', 'q2', 'q 10']);
        });
    });
    describe('11.8 API-интерфейс Console', function () {
        // console.log() поддерживает форматирование с помощью %s, %i и %d, %f, %o и %O, %c
        // console.debug(), console.info(), console.warn(), console.error()
        // console.assert()
        // console.clear()
        // console.table()
        // console.trace()
        // console.count()
        // console.countReset()
        // console.group()
        // console.groupCollapsed();
        // console.groupEnd();
        // console.time()
        // console.timeLog()
        // console.timeEnd()
    });
    describe('11.9 API-интерфейсы URL', function () {
        it('Конструктор и свойства', function () {
            let url = new URL('ftp://user:password@ftp.example.com:8000/path/name?param=value#hashFragment');
            equal(url.origin, 'ftp://ftp.example.com:8000');
            equal(url.href, 'ftp://user:password@ftp.example.com:8000/path/name?param=value#hashFragment');
            equal(url.hash, '#hashFragment');
            url.hash = '#newHash';
            equal(url.port, '8000');
            equal(url.hostname, 'ftp.example.com');
            url.hostname = 'ftp.new.host.name';
            equal(url.host, 'ftp.new.host.name:8000');
            url.host = 'ftp.new.host.com:8001';
            equal(url.searchParams.get('param'), 'value');
            equal(url.search, '?param=value');
            url.search = '?newParam=newValue'
            equal(url.password, 'password');
            url.password = 'newPassword';
            equal(url.pathname, '/path/name');
            url.pathname = '/new/path/name';
            equal(url.protocol, 'ftp:');
            url.protocol = 'http:';
            equal(url.username, 'user');
            url.username = 'newUser';
            equal(url.href, 'http://newUser:newPassword@ftp.new.host.com:8001/new/path/name?newParam=newValue#newHash');
            url.href = 'http://test.ru/';
            equal(url.href, 'http://test.ru/');
        });
        it('URLSearchParams', function () {
            let url = new URL('https://test.ru'),
                searchParams = url.searchParams;
            equal(searchParams.has('test'), false);
            searchParams.set('test', 'value');
            equal(searchParams.get('test'), 'value');
            searchParams.delete('test');
            equal(searchParams.get('test'), null);
            searchParams.append('test2', 'test2value');
            searchParams.append('test2', 'test2value2');
            equal(url.search, '?test2=test2value&test2=test2value2');
            equal(searchParams.get('test2'), 'test2value');
            equal(searchParams.getAll('test2'), ['test2value', 'test2value2']);
            searchParams.sort();
            equal([...searchParams], [['test2', 'test2value'], ['test2', 'test2value2']])

            let params = new URLSearchParams();
            params.append('q', 'test');
            equal(params .toString(), 'q=test');
            url.search = params;
            equal(url.search, '?q=test');
        });
        describe('11.9.1 Унаследованные функции для работы с URL', function () {
            it('encodeURI и decodeURI', function () {
                let expected = 'a1%20%D1%8B&?/',
                    actual = 'a1 ы&?/';
                equal(encodeURI(actual), expected);
                equal(decodeURI(expected), actual);
            });
            it('encodeURIComponent и decodeURIComponent', function () {
                let expected = 'a1%20%D1%8B%26%3F%2F',
                    actual = 'a1 ы&?/';
                equal(encodeURIComponent(actual), expected);
                equal(decodeURIComponent(expected), actual);
            });
        });
    });
});