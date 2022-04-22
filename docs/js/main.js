document.addEventListener('DOMContentLoaded', async () => {
    const manager = {
        components: {
            projectsBox: document.querySelector('#projects-box'),
            colorSchemeSwitch: document.querySelectorAll('.colorScheme-switch-container')[0]
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
        enableColorSchemeSwitch(manager.settingsData.defaults.colorSchemeMode)
        displayProjects()
        setStyle(manager.settingsData.defaults.colorSchemeMode)
    }

    function setStyle(colorSchemeMode) {
        const colorSchemeModeToggled = getColorSchemeModeToggled(colorSchemeMode)
        const colors = manager.settingsData.colors
        setElementStyle(document.body, 'backgroundColor', colors[colorSchemeMode + 'Color'])
        setElementStyle(document.body, 'color', colors[colorSchemeMode + 'ModeTextColor'])
        setElementStyle(manager.components.colorSchemeSwitch, 'backgroundColor', colors[colorSchemeMode + 'ModeTextColor'])
        setElementStyle(manager.components.colorSchemeSwitch, 'borderColor', colors[colorSchemeMode + 'ModeTextColor'])
        const projectsBoxContainer = document.querySelectorAll('.projects-box-container')[0]
        setElementStyle(projectsBoxContainer, 'borderColor', colors[colorSchemeMode + 'ModeTextColor'])
        const projectBoxContainers = document.querySelectorAll('.project-box-container')
        projectBoxContainers.forEach(element => {
            setElementStyle(element, 'borderColor', colors[colorSchemeModeToggled + 'ModeTextColor'])
            setElementStyle(element, 'backgroundColor', colors[colorSchemeModeToggled + 'Color'])
            element.addEventListener('mouseover', function () {
                setElementStyle(this, 'boxShadow', `5px 5px 0px 2.5px ${colors[colorSchemeModeToggled + 'Color']}`)
            })
            element.addEventListener('mouseleave', function () {
                setElementStyle(this, 'boxShadow', 'none')
            })
            const projectTitle = element.querySelectorAll('.project-title')[0]
            projectTitle.style.color = colors[colorSchemeModeToggled + 'ModeTextColor']
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

    function enableColorSchemeSwitch(colorSchemeMode) {
        const colorSchemeModeToggled = getColorSchemeModeToggled(colorSchemeMode)
        const colors = manager.settingsData.colors
        const bgColor = colors[colorSchemeModeToggled + 'Color']
        setElementStyle(manager.components.colorSchemeSwitch, 'backgroundColor', bgColor)
        setElementStyle(manager.components.colorSchemeSwitch, 'borderColor', bgColor)
        const switchImgs = manager.components.colorSchemeSwitch.querySelectorAll('.switch-img')
        switchImgs.forEach((img, index) => {
            const switchSelectedOptionColor = colors[colorSchemeModeToggled + 'ModeTextColor']
            const imgColorSchemeMode = img.dataset.colorSchemeMode
            if (imgColorSchemeMode === manager.settingsData.defaults.colorSchemeMode) {
                setElementStyle(img, 'backgroundColor', switchSelectedOptionColor)
            } else {
                setElementStyle(img, 'backgroundColor', 'transparent')
            }
            img.addEventListener('click', function () {
                setElementStyle(this, 'backgroundColor', switchSelectedOptionColor)
                switchImgs.forEach((currentImg, currentIndex) => {
                    if (currentIndex !== index) {
                        setElementStyle(currentImg, 'backgroundColor', 'transparent')
                    }
                })
                setElementStyle(this, 'backgroundColor', colors[getColorSchemeModeToggled(imgColorSchemeMode) + 'ModeTextColor'])
                setStyle(imgColorSchemeMode)
            })
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