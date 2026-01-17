const searchInput = document.querySelector('.search');
const body = document.querySelector('body');
let currentIconIndex = 0;

const filters = document.querySelectorAll('.g-filter')

const getIcons = () => {
    return [...document.querySelectorAll('.searcharea .icon')];
}

const isValidIndex = () => {
    return (currentIconIndex >= 0 && currentIconIndex < getIcons().length);
}

const removeSelection = (icon) => {
    if (isValidIndex()) {
        icon.classList.remove('selected');
    }
}

const incrementIndex = (maxIcons) => {
    currentIconIndex++;
    if (currentIconIndex >= maxIcons) {
        currentIconIndex = 0;
    }
}

const selectIcon = (icon) => {
    icon.classList.add('selected');
    icon.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return icon;
}

const clickIcon = (icon) => {
    if (isValidIndex()) {
        // Dispatch click event on the icon
        icon.click();
    }
}

document.addEventListener('click',(e)=>{
    searchInput.focus();
})

// Search Icons Keyboard Navigation
document.addEventListener('keydown', (e) => {
    const icons = getIcons();

    // Option + Tab to switch icons
    if (e.altKey && e.key === 'Tab') {
        e.preventDefault();

        // Remove selection from previous
        removeSelection(icons[currentIconIndex]);

        // Increment index
        incrementIndex(icons.length);

        selectIcon(icons[currentIconIndex]);
        // icons[currentIconIndex].classList.add('selected');
        // icons[currentIconIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (e.key === 'Tab' && document.activeElement.name!='search') {
        
        const timeoutId = setTimeout(()=>{
            console.log('focused');
            searchInput.focus()
        }, 10); 
        
    }

    // Enter to open selected
    if (e.key === 'Enter') {

        clickIcon(icons[currentIconIndex]);
    }


    
    
});

// Themes Data
const themes = [
    { id: 'default', color: '#01c38d', label: 'Default' },
    { id: 'ocean', color: '#00bcd4', label: 'Ocean' },
    { id: 'sunset', color: '#ff5722', label: 'Sunset' },
    { id: 'purple', color: '#a855f7', label: 'Purple' },
    { id: 'electric', color: '#fca311', label: 'Electric' }
];

// Presets Data
const bgPresets = [
    { type: 'solid', value: '#191e29', label: 'Dark' },
    { type: 'solid', value: '#000000', label: 'Black' },
    { type: 'gradient', start: '#0f2027', end: '#2c5364', dir: 'to right', label: 'Deep Sea' },
    { type: 'gradient', start: '#373b44', end: '#4286f4', dir: 'to right', label: 'Blue Sky' },
    { type: 'image', value: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop', label: 'Space' },
    { type: 'image', value: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2144&auto=format&fit=crop', label: 'City' }
];

const queryUrl = (url) => {
    const query = searchInput.value;

    let fullUrl = url + query;
    if (query == '') {
        fullUrl = fullUrl.substring(0, fullUrl.indexOf('/', 8))
    }
    window.open(fullUrl, "_self")
}


const createAndGetIconDiv = (shortcut) => {
    const iconDiv = document.createElement('div');
    iconDiv.className = 'icon' + (shortcut.selected ?' selected':'');
    iconDiv.id = shortcut.url;
    iconDiv.title = shortcut.name;
    const img = shortcutImage(shortcut);



    iconDiv.appendChild(img);

    const span = shortcut.name;

    const spanDiv = document.createElement('span');

    spanDiv.className = 'icon-span';
    spanDiv.append(span);
    iconDiv.appendChild(spanDiv);


    iconDiv.onclick = (element) => {
        queryUrl(shortcut.url);
        //  document.querySelector('.icon.selected')?.classList.remove('selected');
        //  element.currentTarget.classList.add('selected');
    };
    return iconDiv;
}

const shortcutImage = (shortcut) => {
    const img = document.createElement('img');
    img.src = shortcut.icon;
    img.alt = shortcut.name;
    return img;
}

const getShortcutDiv = (shortcut, index) => {
    const item = document.createElement('div');
    item.className = 'shortcut-item';
    item.innerHTML = `
            <div class="shortcut-info">
                <img src="${shortcut.icon}" class="shortcut-icon-preview" onerror="this.src='favicon.png'">
                <span class="shortcut-name">${shortcut.name}</span>
            </div>
            <button class="delete-shortcut-btn" data-index="${index}" title="Remove">✕</button>
        `;
    return item;
}


document.addEventListener('DOMContentLoaded', () => {

    // Settings & Customization Logic
    const settingsModal = document.getElementById('settingsModal');
    const openSettingsBtn = document.getElementById('openSettings');
    const closeSettingsBtn = document.getElementById('closeSettings');

    // Title Settings
    const showTitleInput = document.getElementById('showTitle');
    const customTitleInput = document.getElementById('customTitleInput');
    const titleElement = document.querySelector('.title h1');
    const bgNameElement = document.querySelector('.background-name');

    // Background Settings
    const bgTypeSelect = document.getElementById('bgType');
    const solidControls = document.getElementById('solidControls');
    const gradientControls = document.getElementById('gradientControls');
    const imageControls = document.getElementById('imageControls');
    const bgColorPicker = document.getElementById('bgColorPicker');
    const bgGradientStart = document.getElementById('bgGradientStart');
    const bgGradientEnd = document.getElementById('bgGradientEnd');
    const bgGradientDir = document.getElementById('bgGradientDir');
    const bgImageUrl = document.getElementById('bgImageUrl');
    const applyBgImageBtn = document.getElementById('applyBgImage');
    const bgImageUpload = document.getElementById('bgImageUpload');
    const bgPresetsContainer = document.getElementById('bgPresets');
    const themeSelectorContainer = document.getElementById('themeSelector');



    // Default Settings
    let settings = {
        theme: 'default',
        showTitle: true,
        showBookmarks: true,
        titleText: 'Venkatesh Lingampally',
        bgType: 'solid',
        solidColor: '#191e29',
        gradient: {
            start: '#191e29',
            end: '#132d46',
            dir: 'to right'
        },
        bgImage: ''
    };

    // Load Settings
    function loadSettings() {
        const saved = localStorage.getItem('userSettings');
        if (saved) {
            settings = { ...settings, ...JSON.parse(saved) };
        }
        updateSettingsUI();
    }

    function saveSettings() {
        localStorage.setItem('userSettings', JSON.stringify(settings));
    }



    function updateSettingsUI() {
        showTitleInput.checked = settings.showTitle;
        customTitleInput.value = settings.titleText;
        bgTypeSelect.value = settings.bgType;
        bgColorPicker.value = settings.solidColor;
        bgGradientStart.value = settings.gradient.start;
        bgGradientEnd.value = settings.gradient.end;
        bgGradientDir.value = settings.gradient.dir;
        bgImageUrl.value = settings.bgImage;

        updateBgControls(settings.bgType);
        updateThemeUI();
    }

    function updateThemeUI() {
        // Update active state of swatches
        const swatches = themeSelectorContainer.querySelectorAll('.theme-swatch');
        swatches.forEach(swatch => {
            if (swatch.dataset.theme === settings.theme) {
                swatch.classList.add('active');
            } else {
                swatch.classList.remove('active');
            }
        });
    }

    function updateBgControls(type) {
        solidControls.style.display = 'none';
        gradientControls.style.display = 'none';
        imageControls.style.display = 'none';

        if (type === 'solid') solidControls.style.display = 'flex';
        if (type === 'gradient') gradientControls.style.display = 'flex';
        if (type === 'image') imageControls.style.display = 'flex';
    }

    // Event Listeners
    openSettingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('open');
    });

    closeSettingsBtn.addEventListener('click', () => {
        settingsModal.classList.remove('open');
    });

    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.remove('open');
        }
    });

    showTitleInput.addEventListener('change', (e) => {
        settings.showTitle = e.target.checked;
        applySettings();
        saveSettings();
    });

    customTitleInput.addEventListener('input', (e) => {
        settings.titleText = e.target.value;
        applySettings();
        saveSettings();
    });

    bgTypeSelect.addEventListener('change', (e) => {
        settings.bgType = e.target.value;
        updateBgControls(settings.bgType);
        applySettings();
        saveSettings();
    });

    bgColorPicker.addEventListener('input', (e) => {
        settings.solidColor = e.target.value;
        applySettings();
        saveSettings();
    });

    [bgGradientStart, bgGradientEnd, bgGradientDir].forEach(el => {
        el.addEventListener('input', () => {
            settings.gradient.start = bgGradientStart.value;
            settings.gradient.end = bgGradientEnd.value;
            settings.gradient.dir = bgGradientDir.value;
            applySettings();
            saveSettings();
        });
    });

    applyBgImageBtn.addEventListener('click', () => {
        settings.bgType = 'image';
        settings.bgImage = bgImageUrl.value;
        updateSettingsUI(); // Update select dropdown
        applySettings();
        saveSettings();
    });




    // Search Shortcuts & Auto-fill Logic
    const searchIconContainer = document.getElementById('searchIcons');
    const shortcutsList = document.getElementById('shortcutsList');

    let shortcuts = [
        { name: 'Google', url: 'https://www.google.com/search?q=', icon: 'images/google.png',selected:true },
        { name: 'YouTube', url: 'https://www.youtube.com/results?search_query=', icon: 'images/youtube.png' },
        { name: 'GitHub', url: 'https://github.com/search?q=', icon: 'images/github.png' },
        { name: 'Dribbble', url: 'https://dribbble.com/search/', icon: 'images/dribble.png' },
        { name: 'LinkedIn', url: 'https://www.linkedin.com/search/results/all/?keywords=', icon: 'images/linkedin.png' },
        { name: 'Upwork', url: 'https://www.upwork.com/nx/jobs/search/?q=', icon: 'images/upwork.png' },
        { name: 'Pub.dev', url: 'https://pub.dev/packages?q=', icon: 'images/flutter.png' },
        { name: 'NPM', url: 'https://www.npmjs.com/search?q=', icon: 'images/react.png' },

    ];


    // if (localStorage.getItem('searchShortcuts')) {
    //     shortcuts = JSON.parse(localStorage.getItem('searchShortcuts'));
    // }



    function renderSearchIcons() {
        searchIconContainer.innerHTML = '';
        shortcuts.forEach((shortcut, index) => {
            const iconDiv = createAndGetIconDiv(shortcut);

            searchIconContainer.appendChild(iconDiv);
        });
    }

    function renderShortcutsList() {
        shortcutsList.innerHTML = '';
        shortcuts.forEach((shortcut, index) => {
            const item = getShortcutDiv(shortcut, index);
            shortcutsList.appendChild(item);
        });
    }







    renderSearchIcons();
    renderShortcutsList();
    // renderRecommendedShortcuts();

    // Initialize
    loadSettings();

}); // Close DOMContentLoaded



