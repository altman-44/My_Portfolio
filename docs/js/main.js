document.addEventListener('DOMContentLoaded', async () => {
    const manager = {
        components: {
            projectsBox: document.querySelector('#projects-box'),
            colorSchemeSwitch: document.querySelector('#color-scheme-switch')
        },
        settingsData: JSON.parse(await ajax('./settings.json', 'application/json')) || {},
        projectsData: JSON.parse(await ajax('./data.json', 'application/json')) || {},
        hideScrollbarIfNotOverflowing: function (element) {
            if (element.clientHeight == element.scrollHeight) {
                element.style.overflow = 'hidden'
            }
        }
    }

    start()

    function start() {
        manager.hideScrollbarIfNotOverflowing(document.getElementsByTagName('main')[0])
        setStyle()
        enableColorSchemeSwitch()
        displayProjects()
    }

    function setStyle() {
        document.body.style.backgroundColor = manager.settingsData.colors.lightModeBgColor
        document.body.style.color = manager.settingsData.colors.lightModeTextColor
    }

    function enableColorSchemeSwitch() {
        manager.components.colorSchemeSwitch.addEventListener('click', () => {

        })
    }

    function displayProjects() {
        manager.projectsData.projects.forEach(projectData => {
            const projectBoxContainer = document.createElement('div')
            projectBoxContainer.classList.add('project-box-container')
            projectBoxContainer.addEventListener('click', () => {
                window.open(projectData.url || data.defaults.projects.url)
            })
            const projectTitle = document.createElement('p')
            projectTitle.classList.add('project-title')
            projectTitle.innerText = projectData.name
            const projectImgPreview = document.createElement('img')
            projectImgPreview.src = projectData.img_preview.url
            projectImgPreview.alt = projectData.img_preview.alt
            projectImgPreview.title = projectData.name + " (open in new tab)"
            projectBoxContainer.appendChild(projectTitle)
            projectBoxContainer.appendChild(projectImgPreview)
            manager.components.projectsBox.appendChild(projectBoxContainer)
        })
    }

    async function ajax(file, mimeType = null) {
        return new Promise(function (resolve, reject) {
            let rawFile = new XMLHttpRequest();
            if (mimeType) rawFile.overrideMimeType(mimeType);
            rawFile.open('GET', file, true);
            rawFile.onload = function () {
                if (rawFile.readyState === 4 && rawFile.status == '200') {
                    resolve(this.responseText)
                } else {
                    reject({
                        status: this.status,
                        statusText: this.statusText
                    })
                }
            }
            rawFile.onerror = function () {
                reject({
                    status: this.status,
                    statusText: this.statusText
                })
            }
            rawFile.send();
        })
    }
})