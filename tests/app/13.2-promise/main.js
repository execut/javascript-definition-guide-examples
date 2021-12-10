const getJson = function (url, label) {
    label += ' (' + url + '): ';
    console.debug(label + 'Url:', url);
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('JSON не удалось получить');
            }
            return response;
        })
        .then(response => response.json())
        .then(document => {
            console.debug(label + 'Response: %o', document);
            return document;
        })
        .catch(e => {
            console.debug(label + 'Сообщение об ошибке:', e.message);
            return e;
        })
        .finally(() => console.debug(label + 'finally'));
};

let label = '13.2.2 Выстраивание объектов Promise в цепочки';
let jsonUrl = './response.json';
getJson(jsonUrl, label);
let notExistedUrl = './not-existed.json';
getJson(notExistedUrl, label);

let getJSONViaPromiseAll = function (label, urls) {
    label += ': ';
    let promises = urls.map(url => fetch(url).then(r => r.json()));
    promises.push('simple value');
    Promise.all(promises)
        .then((bodies) => {
            console.debug(label + ' Bodies from response: %o', bodies);
        })
        .catch(e => console.debug(label + e.message));
};

setTimeout(() => {
    label = '13.2.5 Параллельное выполнение нескольких асинхронных операций с помощью Promise';
    getJSONViaPromiseAll(label, [jsonUrl, jsonUrl, jsonUrl]);
    getJSONViaPromiseAll(label, [jsonUrl, notExistedUrl, notExistedUrl]);

    setTimeout(() => {
        let getJSONViaPromiseAllSettled = function (label, urls) {
            label += ' (allSettled): ';
            let promises = urls.map(url => fetch(url).then(r => r.json()));
            promises.push('simple value');
            Promise.allSettled(promises)
                .then((bodies) => {
                    console.debug(label + ' Bodies from response: %o', bodies);
                })
                .catch(e => console.debug(label + e.message));
        };
        getJSONViaPromiseAllSettled(label, [jsonUrl, jsonUrl, jsonUrl]);
        getJSONViaPromiseAllSettled(label, [jsonUrl, notExistedUrl, notExistedUrl]);
        setTimeout(() => {
            let getJSONViaPromiseRace = function (label, urls) {
                label += ' (race): ';
                let promises = urls.map(url => fetch(url).then(r => r.json()));
                Promise.race(promises)
                    .then((bodies) => {
                        console.debug(label + ' Bodies from response: %o', bodies);
                    })
                    .catch(e => console.debug(label + e.message));
            };
            getJSONViaPromiseRace(label, [jsonUrl, jsonUrl, jsonUrl]);
            getJSONViaPromiseRace(label, [jsonUrl, notExistedUrl, notExistedUrl]);
        }, 1000);
    }, 1000);

    }, 1000)