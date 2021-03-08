document.addEventListener('DOMContentLoaded', () => {
    const manager = {
        hideScrollbarIfNotOverflowing: function (element) {
            if (element.clientHeight == element.scrollHeight) {
                element.style.overflow = 'hidden'
            }
        }
    }

    start()

    function start() {
        manager.hideScrollbarIfNotOverflowing(document.getElementsByTagName('main')[0])
        displayProjects()
    }

    function displayProjects() {
        readTextFile('../../data.json', text => {
            var data = JSON.parse(text);
            console.log(data);
        });
    }

    function readTextFile(file, callback) {
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType('application/json');
        rawFile.open('GET', file, true);
        rawFile.onreadystatechange = () => {
            if (rawFile.readyState === 4 && rawFile.status == '200') {
                callback(rawFile.responseText);
            }
        }
        rawFile.send(null);
    }
})