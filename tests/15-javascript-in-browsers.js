let chai = require('chai');
let sinon = require('sinon');
let jsdom = require('mocha-jsdom');
let assert = chai.assert;
describe('15 JavaScript в браузерах', () => {
    jsdom({
        html: '',
        src: '',
        url: "http://localhost"
    });
    describe('15.1 Основы программирования для веб-сети', () => {
    });

    describe('15.2 События', function () {
        describe('15.2.2 Регистрация обработчиков событий', () => {
            it('document.addEventListener()', () => {
                let listener = sinon.spy(() => {
                });
                document.addEventListener('click', listener);
                let e = new window.Event('click');
                document.dispatchEvent(e);
                document.dispatchEvent(e);
                assert.isTrue(listener.calledTwice);
            });
            it('document.addEventListener() с флагом once', () => {
                let listener = sinon.spy(() => {
                });
                document.addEventListener('click', listener, {
                    once: true
                });
                let e = new window.Event('click');
                document.dispatchEvent(e);
                document.dispatchEvent(e);
                assert.isTrue(listener.calledOnce);
            });
            it('document.removeEventListener()', () => {
                let listener = (e) => {
                    throw new Error('Never');
                };
                document.addEventListener('click', listener, {
                    passive: true
                });
                document.removeEventListener('click', listener);
                let e = new window.Event('click');
                document.dispatchEvent(e);
            });
        });
        describe('15.2.3 Вызов обработчиков событий', () => {
            it('Аргументы обработчиков событий', () => {
                document.body.innerHTML = '<div id="handledElement"><div id="clickedElement"></div></div>';
                let clickedEl = document.getElementById('clickedElement'),
                    handledEl = document.getElementById('handledElement'),
                    factE = false;
                let listener = (e) => {
                    factE = e;
                };
                handledEl.addEventListener('click', listener);
                let e = new window.Event('click');

                clickedEl.dispatchEvent(e);
                assert.isNotFalse(e);
                assert.deepStrictEqual(e.type, 'click');
                assert.deepStrictEqual(e.target, clickedEl, 'Цель равна');
                // assert.deepStrictEqual(e.currentTarget, handledEl);
                assert.isTrue(e.timeStamp > 0, 'Время события');
                assert.isFalse(e.isTrusted, 'Отправлено не браузером, а кодом');
            });
        });
        describe('15.2.4 Распространение событий', () => {
            it('Стадии', () => {
                document.body.innerHTML = '<div id="parent"><div id="child"></div></div>';
                let steps = [],
                    windowEvent = false,
                    addStep = (step) => {
                        steps.push(step)
                    },
                    childElListener = function (e) {
                        addStep('child');
                        return e;
                    },
                    parentElListener = function (e) {
                        addStep('parent');
                    },
                    documentElListener = function (e) {
                        addStep('document');
                    },
                    windowElListener = function (e) {
                        addStep('window');
                    },
                    childElCapturedListener = function (e) {
                        addStep('child captured');
                    },
                    parentElCapturedListener = function (e) {
                        addStep('parent captured');
                    },
                    documentElCapturedListener = function (e) {
                        addStep('document captured');
                    },
                    windowElCapturedListener = function (e) {
                        addStep('window captured');
                    };
                let childEl = document.getElementById('child'),
                    parentEl = document.getElementById('parent');
                parentEl.addEventListener('click', parentElCapturedListener, true);
                document.addEventListener('click', documentElCapturedListener, true);
                window.addEventListener('click', windowElCapturedListener, true);
                childEl.addEventListener('click', childElCapturedListener, true);
                childEl.addEventListener('click', childElListener);
                parentEl.addEventListener('click', parentElListener);
                document.addEventListener('click', documentElListener);
                window.addEventListener('click', windowElListener);
                let e = new window.Event('click', {
                    bubbles: true,
                });
                childEl.dispatchEvent(e);
                assert.deepStrictEqual(steps, [
                    "window captured", "document captured", "parent captured", "child captured",
                    'child', 'parent', 'document', 'window'
                ]);
            });
        });
        describe('15.2.5 Отмена событий', () => {
            it('Отмена стандартный действий через Event.preventDefault()', () => {
            });
            it('Отмена событий через Event.stopPropagation()', () => {
                let isFiredDocumentListener = false,
                    isFiredDocumentListener2 = false,
                    isFiredWindowListener = false;
                document.addEventListener('click', (e) => {
                    isFiredDocumentListener = true;
                    e.stopPropagation();
                });
                document.addEventListener('click', (e) => {
                    isFiredDocumentListener2 = true;
                });
                window.addEventListener('click', (e) => {
                    isFiredWindowListener = true;
                });
                let e = new window.Event('click', {
                    bubbles: true,
                });
                document.dispatchEvent(e);
                assert.isTrue(isFiredDocumentListener);
                assert.isTrue(isFiredDocumentListener2, 'Событие всё ещё обрабатываются остальными обработчиками элемента');
                assert.isFalse(isFiredWindowListener, 'Событие перестаёт всплывать до родителей');
            });
            it('Отмена событий через Event.stopImmediatePropagation()', () => {
                let isFiredDocumentListener = false,
                    isFiredDocumentListener2 = false,
                    isFiredWindowListener = false;
                document.addEventListener('click', (e) => {
                    isFiredDocumentListener = true;
                    e.stopImmediatePropagation();
                });
                document.addEventListener('click', (e) => {
                    isFiredDocumentListener2 = true;
                });
                window.addEventListener('click', (e) => {
                    isFiredWindowListener = true;
                });
                let e = new window.Event('click', {
                    bubbles: true,
                });
                document.dispatchEvent(e);
                assert.isTrue(isFiredDocumentListener);
                assert.isFalse(isFiredDocumentListener2, 'Событие не обрабатываются остальными обработчиками элемента');
                assert.isFalse(isFiredWindowListener, 'Событие перестаёт всплывать до родителей');
            });
        });
        describe('15.2.6 Отправка специальных событий', () => {
            it('CustomEvent', () => {
                let e = new window.CustomEvent('custom.testEvent', {
                        detail: {
                            testKey: 'testValue'
                        }
                    }),
                    actualE = false;
                window.addEventListener('custom.testEvent', (e) => {
                    actualE = e;
                });
                window.dispatchEvent(e);
                assert.deepStrictEqual(actualE.detail, {
                    testKey: 'testValue'
                });
            });
        });
    });

    describe('15.3 Работа с документами в сценариях', () => {
        let child1 = null,
            child2 = null,
            parent = null;
        beforeEach(() => {
            document.body.innerHTML = `
    <img id="imgId" />
    <form id="formId" action="/actionUrl" method="post"><input type="text" value="inputValue" /></form>
    <a id="aId" href=""></a>
    <a id="aIdWithoutHref"></a>
    <div id="parent">
        <div id="child" name="childName" class="childClass childClass2" own-attribute="attributeValue" data-own-attribute="data attribute value" title="title of div" lang="ru" dir="ltr" onclick="onclickFunc()">children content</div>
        <span></span>
        <div id="child2">child2 content <i>child2 i content</i></div>
    </div>
<script type="text/x-custom-data">custom text<test></test></script>
`;
            child1 = document.getElementById('child');
            child2 = document.getElementById('child2');
            parent = document.getElementById('parent');
        });

        describe('15.3.1 Выбор элементов документа', () => {
            describe('Выбор элементов с использованием CSS', () => {
                it('(document|Element).querySelector()', () => {
                    assert.deepStrictEqual(document.querySelector('#child ~ div'), child2, 'div, расположенный после #child');
                    assert.deepStrictEqual(document.querySelector('span + div'), child2, 'div, расположенный сразу после span');
                });
                it('(document|Element).querySelectorAll()', () => {
                    let allChilds = document.querySelectorAll('#child, #child2');
                    assert.instanceOf(allChilds, window.NodeList);
                    assert.deepStrictEqual(allChilds[0], child1);
                    assert.deepStrictEqual(allChilds[1], child2);

                    let parentEl = document.getElementById('parent');
                    assert.deepStrictEqual(parentEl.querySelector('#child'), child1, 'Element так-же имеет querySelector');
                });
                it('(document|Element).closest()', () => {
                    assert.deepStrictEqual(child1.closest('#child'), child1);
                    assert.deepStrictEqual(child1.closest('#parent'), document.getElementById('parent'));
                    assert.isNull(child1.closest('#asd'));
                });
                it('(document|Element).match()', () => {
                    assert.isTrue(child1.matches('#child'));
                    assert.isFalse(child1.matches('#child2'));
                });
            });
            describe('(устарело) Другие методы выбора элементов', () => {
                it('document.getElementById()', () => {
                    assert.deepStrictEqual(document.getElementById('child'), child1);
                    assert.isNull(document.getElementById('child1'));
                });
                it('document.getElementsByName()', () => {
                    let elements = document.getElementsByName('childName');
                    assert.instanceOf(elements, window.NodeList);
                });
                it('document.getElementsByTagName()', () => {
                    let elements = document.getElementsByTagName('span');
                    assert.notInstanceOf(elements, window.NodeList);
                    assert.lengthOf(elements, 1);
                });
                it('document.getElementsByClassName()', () => {
                    let elements = document.getElementsByClassName('childClass');
                    assert.notInstanceOf(elements, window.NodeList);
                    assert.deepStrictEqual(elements[0], child1);

                    let divEl = document.createElement('div');
                    divEl.setAttribute('class', 'childClass')
                    document.body.appendChild(divEl);
                    assert.lengthOf(elements, 2, 'NodeList является активным в отличии от новых методов получения элементов');
                });
            });
            describe('(устарело) Предварительно выбранные элементы', () => {
                it('document.(images|forms|links)', () => {
                    let forms = document.forms;
                    assert.instanceOf(forms, window.HTMLCollection);
                    assert.lengthOf(forms, 1);
                    assert.instanceOf(forms.formId, window.Element);

                    let links = document.links;
                    assert.instanceOf(links, window.HTMLCollection);
                    assert.lengthOf(links, 1);
                    assert.instanceOf(links.aId, window.Element);

                    let images = document.images;
                    assert.instanceOf(images, window.HTMLCollection);
                    assert.lengthOf(images, 1);
                    assert.instanceOf(images.imgId, window.Element);
                });
            });
        });
        describe('15.3.2 Структура и обход документа', () => {
            it('Свойства элемента для обхода', () => {
                let element = document.getElementById('child'),
                    parentEl = document.getElementById('parent');
                assert.equal(parentEl, element.parentNode);
                assert.lengthOf(parentEl.children, 3);
                assert.equal(parentEl.childElementCount, 3);
                assert.equal(parentEl.firstElementChild, child1);
                assert.equal(parentEl.lastElementChild, child2);
                assert.equal(child1.nextElementSibling.tagName, 'SPAN');
                assert.isNull(child1.previousElementSibling);
            });
            it('Получить body', () => {
                assert.equal(document.children[0].children[1], document.body);
                assert.equal(document.firstElementChild.firstElementChild.nextElementSibling, document.body);
            });
            it('Документы как деревья узлов', () => {
                assert.isNull(document.parentNode);
                assert.equal(child1.parentNode, parent);

                assert.instanceOf(parent.childNodes, window.NodeList);
                assert.isTrue(parent.childNodes.length > 3);

                assert.instanceOf(parent.firstChild, window.Text);
                assert.instanceOf(parent.lastChild, window.Text);

                assert.instanceOf(child1.previousSibling, window.Text);
                assert.instanceOf(child2.nextSibling, window.Text);

                let text = child1.childNodes[0];
                assert.instanceOf(text, window.Text);
                assert.equal(text.nodeType, 3);
                assert.equal(text.nodeValue, 'children content');
                assert.equal(child1.nodeName, 'DIV');
            });
        });
        describe('15.3.3 Атрибуты', () => {
            it('Атрибуты HTML как свойства элементов', () => {
                // Универсальные аттрибуты
                assert.equal(child1.id, 'child');
                assert.equal(child1.title, 'title of div');
                assert.equal(child1.lang, 'ru');
                assert.equal(child1.dir, 'ltr');
                assert.equal(child1.className, 'childClass childClass2');

                let form = document.querySelector('form');
                assert.equal(form.action, 'http://localhost/actionUrl');
                assert.equal(form.method, 'post');
                form.action = 'testUrl';
                assert.equal(form.action, 'http://localhost/testUrl');

                let input = document.querySelector('form input');
                assert.equal(input.defaultValue, 'inputValue');
                assert.equal(input.value, 'inputValue');
                input.value = 'test';
                assert.equal(input.value, 'test');
                assert.equal(input.defaultValue, 'inputValue');
            });
            it('Атрибут class', () => {
                assert.equal(child1.className, 'childClass childClass2');
                let classList = child1.classList;
                classList.add('newClass', 'newClass2');
                assert.equal(child1.className, 'childClass childClass2 newClass newClass2');
                assert.isTrue(classList.contains('newClass'));
                classList.remove('newClass');
                assert.equal(child1.className, 'childClass childClass2 newClass2');
                classList.toggle('newClass2');
                assert.equal(child1.className, 'childClass childClass2');
                assert.equal(child1.className, 'childClass childClass2');
            });
            it('Атрибуты наборы данных', () => {
                assert.equal(child1.dataset.ownAttribute, 'data attribute value');
            });
        });
        describe('15.3.4 Содержимое элементов', () => {
            let oldHTML = false;
            beforeEach(() => {
                oldHTML = child2.outerHTML;
            });
            afterEach(() => {
                child2.outerHTML = oldHTML;
                child2 = document.getElementById('child2');
            });
            it('Содержимое элементов в виде HTML-разметки', () => {
                assert.equal(child2.innerHTML, 'child2 content <i>child2 i content</i>');
                assert.equal(child2.outerHTML, '<div id="child2">child2 content <i>child2 i content</i></div>');
                child2.outerHTML = '<span id="child2-replaced"><div></div></span>';
                child2 = document.getElementById('child2-replaced');
                assert.equal(child2.tagName, 'SPAN');

                let div = child2.firstElementChild;
                div.insertAdjacentHTML('beforebegin', 'bb');
                div.insertAdjacentHTML('afterbegin', 'ab');
                div.insertAdjacentHTML('beforeend', 'be');
                div.insertAdjacentHTML('afterend', 'ae');
                assert.equal(child2.innerHTML, 'bb<div>abbe</div>ae');
            });
            it('Содержимое элементов в виде простого текста', () => {
                assert.equal(child2.textContent, 'child2 content child2 i content');
                child2.textContent = 'test';
                assert.equal(child2.textContent, 'test');
            });
            it('Текст в элементах <script>', () => {
                assert.equal(document.querySelector('script').textContent, 'custom text<test></test>');
            });
        });
        describe('15.3.5 Создание, вставка и удаление узлов', () => {
            it('createElement, append, prepend', () => {
                let p = document.createElement('p'),
                    emphasis = document.createElement('em');
                emphasis.append('World');
                p.append('Hello ', emphasis, '!');
                p.prepend(';');
                assert.equal(p.innerHTML, ';Hello <em>World</em>!');
            });
            it('after', () => {
                let div = document.createElement('div'),
                    span = document.createElement('span');
                div.append(span);
                span.after(document.createElement('i'));
                assert.instanceOf(span.nextElementSibling, window.Element);
            });
            it('before', () => {
                let div = document.createElement('div'),
                    span = document.createElement('span');
                div.append(span);
                let i = document.createElement('i');
                span.before(i);
                assert.instanceOf(span.previousElementSibling, window.Element);

                // Добавляем в документ
                document.body.append(div);
                div.before(i);
                assert.equal(div.childNodes.length, 1, 'И после этого в документе');
            });
            it('cloneNode()', () => {
                let div = document.createElement('div');
                div.classList.add('cloned-div');
                div.append(document.createElement('span'));
                document.body.append(div);
                document.body.append(div);
                assert.equal(document.querySelectorAll('.cloned-div').length, 1);

                document.body.append(div.cloneNode());
                assert.equal(document.querySelectorAll('.cloned-div').length, 2);
                assert.equal(document.body.lastElementChild.children.length, 0, 'Склонировалось без потомков');

                document.body.append(div.cloneNode(true));
                assert.equal(document.body.lastElementChild.children.length, 1, 'Склонировалось с потомком');
            });
            it('remove', () => {
                let div = document.createElement('div');
                div.classList.add('new-div');
                document.body.append(div);
                assert.equal(document.querySelector('.new-div'), div);
                div.remove();
                assert.equal(document.querySelector('.new-div'), null);
            });
            it('replaceWith', () => {
                let div = document.createElement('div');
                document.body.append(div);
                let newDiv = document.createElement('div');
                newDiv.classList.add('new-div');
                div.replaceWith(newDiv);
                assert.equal(document.querySelector('.new-div'), newDiv);
            });
        });
    });
    describe('15.4 Работа с CSS в сценариях', () => {
        it('15.4.2 Встроенные стили', () => {
            let div = document.createElement('div');
            div.style.borderLeft = '2px';
            div.style.marginLeft = '1px';
            assert.equal(div.getAttribute('style'), 'border-left: 2px; margin-left: 1px;');
            assert.equal(div.style.cssText, 'border-left: 2px; margin-left: 1px;');
            div.setAttribute('style', 'top: 1px;');
            assert.equal(div.style.cssText, 'top: 1px;');
            div.style.cssText = 'left: 1px';
            assert.equal(div.style.cssText, 'left: 1px;')
        });
        it('15.4.3 Вычисляемые стили', () => {
            let div = document.createElement('div');
            document.body.append(div);
            let style = window.getComputedStyle(div);
            assert.equal(style.display, 'block');
        });
        it('15.4.4 Работа с таблицами стилей в сценариях', () => {
            document.body.insertAdjacentHTML('beforeend', '<style id="left2">body{left: 2px;}</style>');
            let styleLeft2 = document.querySelector('#left2');
            assert.equal(window.getComputedStyle(document.body).left, '2px');
        });
        it('15.4.5 Анимация и события CSS', () => {
            // document.body.insertAdjacentHTML('beforeend', '<style>.transparent {opacity: 0}; .fideable {transition: opacity 10ms ease-in}</style><div id="target-div" class="fideable"></div>');
            // let div = document.querySelector('#target-div');
            // let events = [];
            // div.addEventListener('transitionrun', () => {
            //     events.push('transitionrun');
            //     done();
            // });
            // div.addEventListener('transitionstart', () => {
            //     events.push('transitionstart');
            //     done();
            // });
            // div.addEventListener('transitionend', () => {
            //     events.push('transitionend');
            //     assert.equal(events, ['transitionrun', 'transitionstart', 'transitionend']);
            //     done();
            // });
            // div.classList.add('transparent');
        });
    });
    describe('15.5 Геометрия и прокрутка документов', () => {
        describe('15.5.1 Координаты документа и координаты окна просмотра', () => {
            it('Пиксели CSS', () => {
                assert.equal(window.devicePixelRatio, 1, 'Соотношение пикселя устройства к пикселю браузера (2 - это 1px браузера=2х2px устройства)');
            });
        });
        describe('15.5.2 Запрашивание геометрии элемента', () => {
            it('Element.getBoundingClientRect()', () => {
                document.body.innerHTML = '<div style="width: 10px; height: 10px;" id="text2">text2<span>span content</span><em>em content</em><b>b content</b></div>';
                let text2 = document.querySelector('#text2');
                let rect = text2.getBoundingClientRect();
                assert.equal(rect.left, 0);
                assert.equal(rect.top, 0);
                assert.equal(rect.right, 0);
                assert.equal(rect.bottom, 0);
                assert.equal(rect.width, 0);
                assert.equal(rect.height, 0);
                let rects = text2.getClientRects();
                assert.equal(rects.length, 0, 'Должен быть заполненный массив');
            });
        });
        describe('15.5.3 Определение элемента в точке', () => {
            it('document.elementFromPoint(x, y)', () => {
                document.body.innerHTML = '<div style="width: 10px; height: 10px;" id="text2">text2</div>';
                // let div = document.elementFromPoint(1, 1);
                // assert.equal(div.id, 'text2', 'Не работает в NodeJS');
            });
        });
        describe('15.5.5 Размер окна просмотра, размер содержимого и позиция прокрутки', () => {
            it('Размер окна', () => {
                assert.equal(window.innerWidth, 1024);
                assert.equal(window.innerHeight, 768);
            });
            it('Размер документа', () => {
                let div = document.createElement('div');
                div.innerHTML = 'asdasdas';
                div.style.width = '10px';
                div.style.height = '10px';
                document.body.append(div);
                // assert.equal(document.documentElement.offsetWidth, 10, 'Не работает');
                // assert.equal(document.documentElement.offsetHeight, 10, 'Не работает');
            });
            it('Размеры элементов', () => {
                let div = document.createElement('div');
                div.innerHTML = 'asdasdas';
                div.style.width = '10px';
                div.style.height = '10px';
                div.style.padding = '25px, 25px, 25px, 25px';//отступы
                div.style.border = '20px, 20px, 20px, 20px';//границы
                div.style.margin = '15px, 15px, 15px, 15px';//поля
                document.body.append(div);
                assert.equal(div.offsetWidth, 10);
            })
        });
    });
});