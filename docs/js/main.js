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
        enableColorSchemeSwitch()
        displayProjects()
        setStyle(manager.settingsData.defaults.colorSchemeMode)
    }

    function setStyle(colorSchemeMode = 'light') {
        const colors = manager.settingsData.colors
        setElementStyle(document.body, 'backgroundColor', colors[colorSchemeMode + 'Color'])
        setElementStyle(document.body, 'color', colors[colorSchemeMode + 'ModeTextColor'])
        const projectsBoxContainer = document.querySelectorAll('.projects-box-container')[0]
        setElementStyle(projectsBoxContainer, 'borderColor', colors[colorSchemeMode + 'ModeTextColor'])
        const projectBoxContainers = document.querySelectorAll('.project-box-container')
        projectBoxContainers.forEach(element => {
            setElementStyle(element, 'borderColor', colors[getColorSchemeModeToggled(colorSchemeMode) + 'ModeTextColor'])
            setElementStyle(element, 'backgroundColor', colors[getColorSchemeModeToggled(colorSchemeMode) + 'Color'])
            element.addEventListener('mouseover', function () {
                setElementStyle(this, 'boxShadow', `5px 5px 0px 2.5px ${colors[getColorSchemeModeToggled(colorSchemeMode) + 'Color']}`)
            })
            element.addEventListener('mouseleave', function () {
                setElementStyle(this, 'boxShadow', 'none')
            })
            const projectTitle = element.querySelectorAll('.project-title')[0]
            projectTitle.style.color = colors[getColorSchemeModeToggled(colorSchemeMode) + 'ModeTextColor']
        })
    }

    function setElementStyle(element, styleName, styleValue) {
        element.style[styleName] = styleValue
    }

    function getColorSchemeModeToggled(mode) {
        let toggledMode = ''
        switch(mode.toUpperCase()) {
            case 'LIGHT':
                toggledMode = 'dark'
                break
            case 'DARK':
                toggledMode = 'light'
                break
        }
        return toggledMode
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