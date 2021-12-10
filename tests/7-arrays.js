let assert = require('assert'),
    equal = require('./modules/equal').equal;
describe('7 Массивы', function() {
    describe('7.1 Создание массивов', function() {
        describe('7.1.1 Литералы типов массивов', function () {
            it('При отсутствии значений между запятыми массив становится разряжённым', function () {
                let actual = [1, , , 3];
                assert.strictEqual(actual.length, 4)
                assert.strictEqual(actual[1], undefined)
            });
        });
        describe('7.1.2 Операции распространения', function () {
            it('Операции распространения можно использовать и массивы', function () {
                let a = [1, 2],
                    b = [...a, 3, 4, 5];
                equal(b, [1, 2, 3, 4, 5]);
            });

            it('Можно удобно копировать массивы', function () {
                let original = [1, 2],
                    copy = [...original];
                equal(copy, original);
                copy[1] = 1;
                assert.strictEqual(original[1], 2);
            });

            it('Работает со строками', function () {
                let result = [...'abcdefg'];
                equal(result, ['a', 'b', 'c', 'd', 'e', 'f', 'g']);
            })

            it('Работает с set', function () {
                let result = [...new Set('abcdefg')];
                equal(result, ['a', 'b', 'c', 'd', 'e', 'f', 'g']);
            })
        });
        describe('7.1.3 Конструктор Array', function () {
            it('Вызов без аргумента', function () {
                equal(new Array(), []);
            });
            it('Вызов с одиночным числом', function () {
                equal(new Array(2), [, ,]);
            });
            it('Вызов с несеколькими аргумент', function () {
                equal(new Array(1, 2), [1, 2]);
            });
        });
        describe('7.1.4 Array.of()', function () {
            it('Позволяет создать элемент с одним элементом в отличии от new Array', function () {
                equal(Array.of(10), [10]);
            });
        });
        describe('7.1.5 Array.from()', function () {
            it('Позволяет создать копию похожего на массив объекта', function () {
                equal(Array.from('abc'), ['a', 'b', 'c']);
            });
            it('Позволяет работать как с map через второй необязательный массив', function () {
                equal(Array.from('abc', function () {
                    return 'a'
                }), ['a', 'a', 'a']);
            });
        });
    });
    describe('7.2 Чтение и запись элементов массива', function () {
        it('Выражение конвертируется в строку, если это не целое положительное число', function () {
            let a = [];
            a[-1] = 1
            equal(a['-1'], 1)
            a[1.0000] = 2
            equal(a[1], 2)
        });
    });

    describe('7.3 Разрежённые массивы', function () {
        it('Не имеют привычных индексов, начинающихся с нуля', function () {
            let a = new Array(5);
            equal(a.length, 5);
            a = [];
            a[1000] = 0;
            equal(a.length, 1001);
        });
        it('Если использовать , при создании массива, тогда создаётся разряженный массив', function () {
            let a1 = [,],
                a2 = [undefined];
            equal(0 in a1, false);
            equal(0 in a2, true);
        });
    });
    describe('7.4 Длина массива', function () {
        it('В плотных массивах length = самому большому индексу + 1', function () {
            let a1 = [],
                a2 = ['a', 'b', 'c'];
            equal(0, a1.length);
            equal(3, a2.length);
        });
        it('Установка значения length приводит к удалению всех значений с ключами >= length', function () {
            let a = ['a', 'b', 'c'];
            a.length = 2;
            equal(undefined, a[2])
            a.length = 0;
            a.length = 3;
            equal(undefined, a[0])
        });
    });
    describe('7.5 Добавление и удаление элементов массива', function () {
        it('Для добавления последнего можно использовать push', function () {
            let a = [];
            equal(1, a.push('a'));
            equal('a', a[0]);
            a.push('b', 'c');
            equal('c', a[2]);
        });
        it('Для извлечения последнего элемента pop', function () {
            let a = ['a', 'b'];
            equal('b', a.pop());
            equal(1, a.length);
        });
        it('Для добавлечения первого элемента unshift', function () {
            let a = ['b'];
            equal(2, a.unshift('a'));
            equal('a', a[0]);
        });
        it('Для извлечения первого элемента shift', function () {
            let a = ['a', 'b'];
            equal('a', a.shift());
            equal(1, a.length);
        });
    });

    describe('7.6 Итерация по массивам', function () {
        it('Через for of', function () {
            let letters = [, 'a', 'b'],
                counter = 0;
            for (let letter of letters) {
                switch (counter) {
                    case 0:
                        equal(undefined, letter);
                    break;
                    case 1:
                        equal('a', letter);
                    break;
                    case 2:
                        equal('b', letter);
                    break;
                }

                counter++;
            }
        });
        it ('Через for of через entries', function () {
            let letters = [...'hello word'],
                result = '';
            for (let [key, char] of letters.entries()) {
                if (key % 2 === 0) {
                    result += char;
                }
            }

            equal(result, 'hlowr');
        });
        it('forEach', function () {
            let letters = [...'hello word'],
                upperCased = '';
            letters.forEach(char => {
                upperCased += char.toUpperCase();
            });
            equal(upperCased, 'HELLO WORD');
        });
        it ('for', function () {
            let letters = [...'hello word'],
                upperCased = '';
            for (let key = 0; key < letters.length; key++) {
                let char = letters[key];
                upperCased += char.toUpperCase();
            }

            equal(upperCased, 'HELLO WORD');
        });
    });

    describe('7.8 Методы массивов', function () {
        describe('7.8.1 Методы итераторов массивов', function () {
            it('forEach', function () {
                let data = [1, 2, 3, 4, 5], sum = 0;
                data.forEach(function (v) {
                    sum += v;
                });
                equal(sum, 15);
                data.forEach(function (v, i, row) {
                    row[i] = v + 1;
                });
                equal([2, 3, 4, 5, 6], data);
            });

            it('map', function () {
                let data = [1, 2, 3];
                equal(data.map(row => row * row), [1, 4, 9]);
            });

            it('filter', function () {
                let data = [5, 4, 3, 2, 1];
                equal(data.filter(x => x < 3), [2, 1]);
                equal(data.filter((x, i) => i % 2 === 0), [5, 3, 1]);
            });

            it('filter преобразовывает разряжённый массив в плотный следующим образом', function () {
                let data = [, 1, 2, , , ,];
                equal(data.filter(() => true), [1, 2]);
            });

            it('find', function () {
                let data = [1, 2, 3];
                equal(data.find(x => x === 2), 2);
                equal(data.find(x => x === 4), undefined);
            });

            it('findIndex', function () {
                let data = [1, 2, 3];
                equal(data.findIndex(x => x === 2), 1);
                equal(data.findIndex(x => x === 4), -1);
            });

            it('every', function () {
                let data = [1, 2, 3, 4];
                equal(data.every(x => x === 4), false);
                equal(data.every(x => x < 5), true);
            });

            it('some', function () {
                let data = [1, 2, 3, 4];
                equal(data.some(x => x === 4), true);
                equal(data.some(x => x === 5), false);
                equal(data.some(isNaN), false);
            });

            it('reduce', function () {
                let data = [1, 2, 3, 4];
                equal(data.reduce((x, y) => x + y), 10);
                equal(data.reduce((x, y) => x * y, 1), 24);
                equal(data.reduce((x, y) => x > y ? x : y, 0), 4);
            });
        });
        describe('7.8.3 Выравнивание массивов с помощью flat и flatMap', function () {
            it('flat', function () {
                let data = [[[1]], [2, 3], 4];
                equal(data.flat(), [[1], 2, 3, 4]);
                equal(data.flat(2), [1, 2, 3, 4]);
            });
            it('flatMap', function () {
                let data = ['splitted string', 'other splitted string'];
                equal(data.flatMap(s => s.split(' ')), ['splitted', 'string', 'other', 'splitted', 'string']);
            });
        });
        describe('7.8.3 Присоединение массивов с помощью concat', function () {
            it('concat', function () {
                let a = [1, 2];
                equal(a.concat(3, 4, 5), [1, 2, 3, 4, 5]);
                equal(a.concat(3, [4], [[5]]), [1, 2, 3, 4, [5]]);
                equal(a, [1, 2]);
            });
        });
        describe('7.8.4 Организация стеков и очередей с помощью push(), pop(), shift() и unshift()', function () {
            it('push', function () {
                let a = ['a'];
                equal(a.push('b', 'c'), 3);
                equal(a.push(['d', 'e']), 4);
                equal(a, ['a', 'b', 'c', ['d', 'e']]);
            });
            it('К push можно применить операцию распространения', function () {
                let a = ['a'], b = ['b', 'c'];
                equal(a.push(...b), 3);
                equal(a, ['a', 'b', 'c']);
            });
            it('pop', function () {
                let a = ['a', 'b'];
                equal(a.pop(), 'b');
                equal(a.pop(), 'a');
                equal(a.pop(), undefined);
            });
            it('unshift ведёт себя неожиданно при передаче двух аргументов', function () {
                let a = [];
                equal(1, a.unshift('a'));
                equal(3, a.unshift('b', 'c'));
                equal(['b', 'c', 'a'], a);
            });
            it('shift', function () {
                let a = ['a', 'b'];
                equal('a', a.shift());
                equal('b', a.shift());
                equal([], a);
                equal(undefined, a.shift());
            });
        });
        describe('7.8.5 Работа с подмассивами с помощью slice(), splice(), fill() и copyWithin()', function () {
            it('slice', function () {
                let a = [1, 2, 3, 4];
                equal(a.slice(), [1, 2, 3, 4]);
                equal(a.slice(1), [2, 3, 4]);
                equal(a.slice(1, 2), [2]);
                equal(a.slice(-2, -1), [3]);
            });
            it('splice', function () {
                let a = [1, 2, 3, 4, 5, 6, 7, 8];
                equal(a.splice(4), [5, 6, 7, 8]);
                equal(a, [1, 2, 3, 4]);
                equal(a.splice(1, 2), [2, 3]);
                equal(a, [1, 4]);
                equal(a.splice(1, 1, 'a', 'b', ['c']), [4]);
                equal(a, [1, 'a', 'b', ['c']]);
            });
            it('fill', function () {
                let a = new Array(5);
                equal(a.fill(0), [0, 0, 0, 0, 0]);
                equal(a.fill(1, 1), [0, 1, 1, 1, 1]);
                equal(a.fill(2, 2, 3), [0, 1, 2, 1, 1]);
                equal(a.fill(3, -1), [0, 1, 2, 1, 3]);
                equal(a.fill(4, -2, -1), [0, 1, 2, 4, 3]);
            });
            it('copyWithin', function () {
                let a = [1, 2, 3, 4, 5];
                equal(a.copyWithin(1), [1, 1, 2, 3, 4]);
                equal(a.copyWithin(2, 3, 5), [1, 1, 3, 4, 4]);
                equal(a.copyWithin(0, -2), [4, 4, 3, 4, 4]);
            });
        });
        describe('7.8.6 Методы поиска и сортировки массивов', function () {
            it('indexOf', function () {
                let a = [1, 2, 2];
                equal(a.indexOf(2), 1);
                equal(a.indexOf(3), -1);
                equal(a.indexOf(2, 2), 2);
                equal(a.indexOf(2, -1), 2);
            });
            it('lastIndexOf', function () {
                let a = [1, 2, 2];
                equal(a.lastIndexOf(2), 2);
                equal(a.lastIndexOf(3), -1);
                equal(a.lastIndexOf(2, 1), 1);
                equal(a.lastIndexOf(2, -2), 1);
            });
            it('includes', function() {
                let a = [1, true, 3, NaN];
                equal(a.includes(1), true);
                equal(a.includes(1, 1), false);
                equal(a.includes(true), true);
                equal(a.includes(3), true);
                equal(a.includes(NaN), true);
                equal(a.includes(false), false);
            });
            it('sort', function () {
                let a = [3, 1, 2];
                equal(a.sort(), [1, 2, 3]);
                equal(a.sort((x, y) => y - x), [3, 2, 1]);
            });
            it('reverse', function () {
                let a = [1, 2, 3];
                equal(a.reverse(), [3, 2, 1]);
                equal(a, [3, 2, 1]);
            });
        });
        describe('7.8.7 Преобразование массивов в строки', function () {
            it('join', function () {
                let a = ['a', 'b', 'c'];
                equal(a.join(), 'a,b,c');
                equal(a.join(''), 'abc');
                equal(a.join(' '), 'a b c');
                let b = Array(5);
                equal(b.join('-'), '----');
            });
            it('toArray', function () {
                let a = ['a', 'b', 'c'];
                equal(a.toString(), 'a,b,c');
                let b = Array(5);
                equal(b.toString(), ',,,,');
                let c = ['a', ['b'], [['c']]];
                equal(c.toString(), 'a,b,c');
            });
            it('toLocaleString', function () {
                let a = [1.1, 'b', 'c'];
                equal(a.toLocaleString(), '1.1,b,c');
            });
        });
        describe('7.8.8 Статические функции массивов', function () {
            it('isArray', function () {
                equal(Array.isArray([]), true);
                equal(Array.isArray({}), false);
            });
        });
        it('7.9 Объекты, похожие на массивы', function () {
            let a = {0: 'a', 1: 'b', 2: 'c', length: 3};
            equal(Array.prototype.join.call(a, '+'), 'a+b+c');
            equal(Array.prototype.map.call(a, x => x.toUpperCase()), ['A', 'B', 'C']);
            equal(Array.prototype.slice.call(a, 1), ['b', 'c']);
            equal(Array.from(a), ['a', 'b', 'c']);
        });
        it('7.10 Строки как массивы', function () {
            let s = 'test';
            equal('t', s.charAt(0));
            equal('e', s[1]);
            equal(Array.prototype.join.call(s, ' '), 't e s t');
        });
    });
});