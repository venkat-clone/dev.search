import {  getShortcuts, saveShortcut, removeShortcut } from './config.js';

const icons = [...document.querySelectorAll('.searcharea .icon')];
let currentIconIndex = -1;

const searchInput = document.querySelector('.search');
const bookmarks = document.querySelectorAll('.bookmark')
const filters = document.querySelectorAll('.g-filter')

async function loadQuickShortcuts() {
    const container = document.getElementById('quickShortcuts');
    container.innerHTML = ''; // Clear existing shortcuts
    
    const shortcuts = await getShortcuts();
    shortcuts.forEach((shortcut, index) => {
        const shortcutHtml = `
            <div class="shortcut-container">
                <a href="${shortcut.url}">
                    <div class="icon">
                        <img src="${shortcut.icon}" alt="${shortcut.alt}" />
                    </div>
                </a>
                <button class="remove-shortcut" data-index="${index}">×</button>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', shortcutHtml);
    });

    // Add remove button listeners
    document.querySelectorAll('.remove-shortcut').forEach(button => {
        button.addEventListener('click', async (e) => {
            const index = parseInt(e.target.dataset.index);
            await removeShortcut(index);
            loadQuickShortcuts(); // Reload shortcuts
        });
    });
}

// Bookmarks toggle
const showBookmarksInput = document.getElementById('showBookmarks');
const bookmarksContainer = document.querySelector('.bookmarks');

// Load state from local storage or settings
function toggleBookmarksDisplay(show) {
    if (show) {
        bookmarksContainer.classList.remove('hidden');
    } else {
        bookmarksContainer.classList.add('hidden');
    }
}

// Search Icons Keyboard Navigation
document.addEventListener('keydown', (e) => {
            const icons = [...document.querySelectorAll('.searcharea .icon')];

    // Option + Tab to switch icons
    if (e.altKey && e.key === 'Tab') {
        e.preventDefault();

        // Remove selection from previous
        if (currentIconIndex >= 0 && currentIconIndex < icons.length) {
            icons[currentIconIndex].classList.remove('selected');
        }

        // Increment index
        currentIconIndex++;
        if (currentIconIndex >= icons.length) {
            currentIconIndex = 0;
        }

        // Add selection to new
        console.log(`Current Icon Index: ${currentIconIndex}`);
        console.log(`Icons Length: ${icons.length}`);
        console.log(`Icons: ${icons}`);
        console.log(`Icons Current: ${icons[currentIconIndex]}`);
        icons[currentIconIndex].classList.add('selected');
        icons[currentIconIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Enter to open selected
    if (e.key === 'Enter') {
        console.log(`Current Icon Index: ${currentIconIndex}`);
        console.log(`Icons Length: ${icons.length}`);
        console.log(`Active Element: ${document.activeElement}`);
        console.log(`Search Input: ${searchInput}`);
        console.log(`Search Input Value: ${document.activeElement !== searchInput}`);
        if (currentIconIndex >= 0 && currentIconIndex < icons.length) {
             // Dispatch click event on the icon
             icons[currentIconIndex].click();
        }
    }
});

// Add form toggle functionality
document.getElementById('toggleShortcutForm').addEventListener('click', () => {
    const form = document.querySelector('.add-shortcut-form');
    form.style.display = form.style.display === 'none' ? 'grid' : 'none';
    // Focus the first input when form is shown
    if (form.style.display === 'grid') {
        document.getElementById('shortcutUrl').focus();
    }
});

function getFaviconUrl(url) {
    try {
        const domain = new URL(url).origin;
        return `${domain}/favicon.ico`;
    } catch (e) {
        return '';
    }
}

// Add keyboard navigation
document.getElementById('shortcutUrl').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        document.getElementById('shortcutIcon').focus();
    }
});

document.getElementById('shortcutIcon').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        document.getElementById('shortcutAlt').focus();
    }
});

document.getElementById('shortcutAlt').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('saveShortcut').click();
    }
});

// Modify save functionality
document.getElementById('saveShortcut').addEventListener('click', async () => {
    const url = document.getElementById('shortcutUrl').value;
    let icon = document.getElementById('shortcutIcon').value;
    const alt = document.getElementById('shortcutAlt').value;

    if (url && alt) {
        // If no icon URL is provided, use favicon.ico
        if (!icon) {
            icon = getFaviconUrl(url);
        }
        
        await saveShortcut({ url, icon, alt });
        loadQuickShortcuts();
        
        // Clear form
        document.getElementById('shortcutUrl').value = '';
        document.getElementById('shortcutIcon').value = '';
        document.getElementById('shortcutAlt').value = '';
        document.querySelector('.add-shortcut-form').style.display = 'none';
    }
});


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
    applySettings();
    updateSettingsUI();
}

function saveSettings() {
    localStorage.setItem('userSettings', JSON.stringify(settings));
}

function applySettings() {
    // Theme
    document.body.setAttribute('data-theme', settings.theme);

    // Title
    titleElement.innerText = settings.titleText;
    bgNameElement.innerText = settings.titleText;
    
    if (settings.showTitle) {
        document.querySelector('.title').style.display = 'block';
    } else {
        document.querySelector('.title').style.display = 'none';
        bgNameElement.style.display = 'none';
    }

    // Bookmarks
    toggleBookmarksDisplay(settings.showBookmarks);

    // Background
    document.body.style.background = ''; // Reset
    document.body.style.backgroundImage = '';

    if (settings.bgType === 'solid') {
        document.body.style.backgroundColor = settings.solidColor;
    } else if (settings.bgType === 'gradient') {
        const { start, end, dir } = settings.gradient;
        document.body.style.backgroundImage = `linear-gradient(${dir}, ${start}, ${end})`;
    } else if (settings.bgType === 'image') {
        if (settings.bgImage) {
            document.body.style.backgroundImage = `url('${settings.bgImage}')`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundAttachment = 'fixed';
        }
    }
}

function updateSettingsUI() {
    showTitleInput.checked = settings.showTitle;
    showBookmarksInput.checked = settings.showBookmarks;
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

showBookmarksInput.addEventListener('change', (e) => {
    settings.showBookmarks = e.target.checked;
    applySettings();
    saveSettings();
});

// File Upload Logic
bgImageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const base64String = event.target.result;
            try {
                // Try to save to settings
                settings.bgType = 'image';
                settings.bgImage = base64String;
                applySettings();
                saveSettings();
                updateSettingsUI();
            } catch (error) {
                alert('Image too large to save in browser storage. Please use a smaller image or URL.');
                console.error('Storage quota exceeded', error);
            }
        };
        reader.readAsDataURL(file);
    }
});

// Render Presets
function renderPresets() {
    bgPresetsContainer.innerHTML = '';
    bgPresets.forEach(preset => {
        const btn = document.createElement('div');
        btn.className = 'preset-btn';
        btn.title = preset.label;
        
        if (preset.type === 'solid') {
            btn.style.backgroundColor = preset.value;
        } else if (preset.type === 'gradient') {
            btn.style.backgroundImage = `linear-gradient(${preset.dir}, ${preset.start}, ${preset.end})`;
        } else if (preset.type === 'image') {
            btn.style.backgroundImage = `url('${preset.value}')`;
        }
        
        btn.addEventListener('click', () => {
            settings.bgType = preset.type;
            if (preset.type === 'solid') settings.solidColor = preset.value;
            if (preset.type === 'gradient') {
                settings.gradient.start = preset.start;
                settings.gradient.end = preset.end;
                settings.gradient.dir = preset.dir;
            }
            if (preset.type === 'image') settings.bgImage = preset.value;
            
            applySettings();
            saveSettings();
            updateSettingsUI();
        });
        
        bgPresetsContainer.appendChild(btn);
    });
}
renderPresets();

// Render Themes
function renderThemes() {
    themeSelectorContainer.innerHTML = '';
    themes.forEach(theme => {
        const swatch = document.createElement('div');
        swatch.className = 'theme-swatch';
        swatch.style.backgroundColor = theme.color;
        swatch.title = theme.label;
        swatch.dataset.theme = theme.id;
        
        swatch.addEventListener('click', () => {
            settings.theme = theme.id;
            
            // If theme changes, we might want to reset background to match theme default if current bg is solid/gradient
            // For now, let's keep custom background if set, but theme change effects accent colors.
            // Optional: reset solid color picker to match theme primary if needed.
            
            applySettings();
            saveSettings();
            updateSettingsUI();
        });
        
        themeSelectorContainer.appendChild(swatch);
    });
}
renderThemes();

// Search Shortcuts & Auto-fill Logic
const searchIconContainer = document.getElementById('searchIcons');
const shortcutsList = document.getElementById('shortcutsList');
const addShortcutForm = document.getElementById('addShortcutForm');
const showAddShortcutBtn = document.getElementById('showAddShortcutBtn');
const saveShortcutBtn = document.getElementById('saveShortcutBtn');
const cancelShortcutBtn = document.getElementById('cancelShortcutBtn');
const suggestionContainer = document.querySelector('.suggestions');

let shortcuts = [
    { name: 'YouTube', url: 'https://www.youtube.com/results?search_query=', icon: 'images/youtube.png' },
    { name: 'GitHub', url: 'https://github.com/search?q=', icon: 'images/github.png' },
    { name: 'Dribbble', url: 'https://dribbble.com/search/', icon: 'images/dribble.png' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/search/results/all/?keywords=', icon: 'images/linkedin.png' },
    { name: 'Upwork', url: 'https://www.upwork.com/nx/jobs/search/?q=', icon: 'images/upwork.png' },
    { name: 'Pub.dev', url: 'https://pub.dev/packages?q=', icon: 'images/flutter.png' },
    { name: 'NPM', url: 'https://www.npmjs.com/search?q=', icon: 'images/react.png' },
    { name: 'Kandi', url: 'https://kandi.openweaver.com/search?q=', icon: 'images/kandi.svg' }
];

const recommendedShortcuts = [
    // { name: 'Gemini', url: 'https://gemini.google.com/app', icon: 'https://www.gstatic.com/lamda/images/gemini_favicon_f069954c85030ec435a7.png' },
    // { name: 'ChatGPT', url: 'https://chat.openai.com', icon: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg' },
    // { name: 'Perplexity', url: 'https://www.perplexity.ai/search?q=', icon: 'https://www.perplexity.ai/favicon.ico' },
    // { name: 'Grok', url: 'https://grok.x.ai', icon: 'https://abs.twimg.com/responsive-web/client-web/icon-default.13426a8a.png' },
    // { name: 'StackOverflow', url: 'https://stackoverflow.com/search?q=', icon: 'https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico' },
    // { name: 'Claude', url: 'https://claude.ai/chats', icon: 'https://claude.ai/favicon.ico' },
    // { name: 'HuggingFace', url: 'https://huggingface.co/search/full-text?q=', icon: 'https://huggingface.co/front/assets/huggingface_logo-noborder.svg' },
    // { name: 'Twitter/X', url: 'https://twitter.com/search?q=', icon: 'https://abs.twimg.com/responsive-web/client-web/icon-default.13426a8a.png' },
    // { name: 'Reddit', url: 'https://www.reddit.com/search/?q=', icon: 'https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png' }
];

if (localStorage.getItem('searchShortcuts')) {
    shortcuts = JSON.parse(localStorage.getItem('searchShortcuts'));
}

function renderRecommendedShortcuts() {
    const recommendedContainer = document.getElementById('recommendedShortcuts');
    recommendedContainer.innerHTML = '';
    
    // Filter out shortcuts that are already added (by name or url)
    const availableRecs = recommendedShortcuts.filter(rec => 
        !shortcuts.some(s => s.name === rec.name || s.url === rec.url)
    );

    availableRecs.forEach(rec => {
        const chip = document.createElement('div');
        chip.className = 'recommendation-chip';
        chip.innerHTML = `<img src="${rec.icon}" onerror="this.src='favicon.png'"> ${rec.name}`;
        
        chip.addEventListener('click', () => {
            shortcuts.push(rec);
            saveShortcuts();
            renderShortcutsList();
            renderSearchIcons();
            renderRecommendedShortcuts();
        });
        
        recommendedContainer.appendChild(chip);
    });

    if (availableRecs.length === 0) {
        recommendedContainer.innerHTML = '<span style="color: rgba(255,255,255,0.3); font-size: 0.9rem;">All recommendations added!</span>';
    }
}

function renderSearchIcons() {
    searchIconContainer.innerHTML = '';
    shortcuts.forEach((shortcut, index) => {
        const iconDiv = document.createElement('div');
        iconDiv.className = 'icon';
        iconDiv.id = shortcut.url;
        iconDiv.title = shortcut.name;
        
        const img = document.createElement('img');
        img.src = shortcut.icon;
        img.alt = shortcut.name;
        
        iconDiv.appendChild(img);
        
        iconDiv.onclick = (element) => {
            const query = searchInput.value
            let url = shortcut.url

            url = url + query
            if (query == '') {
                url = url.substring(0, url.indexOf('/', 8))
            }
        window.open(url, "_self")
            //  document.querySelector('.icon.selected')?.classList.remove('selected');
            //  element.currentTarget.classList.add('selected');
        };

        searchIconContainer.appendChild(iconDiv);
    });
}

function renderShortcutsList() {
    shortcutsList.innerHTML = '';
    shortcuts.forEach((shortcut, index) => {
        const item = document.createElement('div');
        item.className = 'shortcut-item';
        item.innerHTML = `
            <div class="shortcut-info">
                <img src="${shortcut.icon}" class="shortcut-icon-preview" onerror="this.src='favicon.png'">
                <span class="shortcut-name">${shortcut.name}</span>
            </div>
            <button class="delete-shortcut-btn" data-index="${index}" title="Remove">✕</button>
        `;
        shortcutsList.appendChild(item);
    });

    document.querySelectorAll('.delete-shortcut-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            shortcuts.splice(index, 1);
            saveShortcuts();
            renderShortcutsList();
            renderSearchIcons();
            renderRecommendedShortcuts(); // Refresh recommendations
        });
    });
}

function saveShortcuts() {
    localStorage.setItem('searchShortcuts', JSON.stringify(shortcuts));
}

showAddShortcutBtn.addEventListener('click', () => {
    addShortcutForm.style.display = 'block';
    showAddShortcutBtn.style.display = 'none';
});

cancelShortcutBtn.addEventListener('click', () => {
    addShortcutForm.style.display = 'none';
    showAddShortcutBtn.style.display = 'block';
});

saveShortcutBtn.addEventListener('click', () => {
    const name = document.getElementById('newShortcutName').value;
    const url = document.getElementById('newShortcutUrl').value;
    const icon = document.getElementById('newShortcutIcon').value;

    if (name && url && icon) {
        shortcuts.push({ name, url, icon });
        saveShortcuts();
        renderShortcutsList();
        renderSearchIcons();
        
        // Reset form
        document.getElementById('newShortcutName').value = '';
        document.getElementById('newShortcutUrl').value = '';
        document.getElementById('newShortcutIcon').value = '';
        addShortcutForm.style.display = 'none';
        showAddShortcutBtn.style.display = 'block';
    } else {
        alert('Please fill in all fields');
    }
});

// Auto-fill
const devPresets = ['react', 'vue', 'angular', 'python', 'javascript', 'css', 'html', 'flutter', 'dart', 'node', 'express', 'mongodb', 'sql', 'git', 'docker', 'kubernetes', 'aws', 'firebase'];

// searchInput.addEventListener('input', async (e) => {
//     const query = e.target.value.toLowerCase();
//     if (query.length < 1) {
//         suggestionContainer.innerHTML = '';
//         suggestionContainer.style.display = 'none';
//         return;
//     }

//     let matches = [];
//     matches = devPresets.filter(p => p.includes(query)).map(p => ({ title: p, url: null }));

//     try {
//         if (typeof chrome !== 'undefined' && chrome.bookmarks) {
//             const bookmarks = await chrome.bookmarks.search(query);
//             const bookmarkMatches = bookmarks
//                 .filter(b => b.url)
//                 .slice(0, 5)
//                 .map(b => ({ title: b.title, url: b.url, isBookmark: true }));
//             matches = [...matches, ...bookmarkMatches];
//         }
//     } catch (err) { }

//     if (matches.length === 0) {
//         suggestionContainer.style.display = 'none';
//         return;
//     }
    
//     suggestionContainer.innerHTML = '';
//     matches.forEach(match => {
//         const div = document.createElement('div');
//         div.className = 'suggestion';
//         div.textContent = match.title;
//         if (match.isBookmark) {
//             div.innerHTML += ' <span style="font-size: 0.8em; opacity: 0.6;">(Bookmark)</span>';
//         }
        
//         div.addEventListener('click', () => {
//             if (match.url) {
//                 window.location.href = match.url;
//             } else {
//                 searchInput.value = match.title;
//                 suggestionContainer.style.display = 'none';
//                 searchInput.focus();
//             }
//         });
        
//         suggestionContainer.appendChild(div);
//     });
    
//     suggestionContainer.style.display = 'block';
// });

renderSearchIcons();
renderShortcutsList();
renderRecommendedShortcuts();

// Initialize
loadSettings();
}); // Close DOMContentLoaded

async function loadBookmarks() {
    const bookmarksContainer = document.querySelector('.bookmarks');
    bookmarksContainer.innerHTML = ''; // Clear existing bookmarks

    try {
        const bookmarks = await chrome.bookmarks.getRecent(12); // Get 12 most recent bookmarks
        bookmarks.forEach(bookmark => {
            const favicon = getFaviconUrl(bookmark.url);
            const bookmarkHtml = `
                <div class="bookmark">
                    <div class="bookmark-header">
                        <img src="${favicon}" class="bookmark-icon" alt="favicon">
                        <div class="bookmark-title">${bookmark.title}</div>
                    </div>
                    <a href="${bookmark.url}" class="bookmark-url">${bookmark.url}</a>
                </div>
            `;
            bookmarksContainer.insertAdjacentHTML('beforeend', bookmarkHtml);
        });
    } catch (error) {
        console.error('Error loading bookmarks:', error);
    }
}

for (let i = 0; i < filters.length; i++) {
    if (filters[i] != undefined) {
        filters[i].onclick = (e) => {
            searchInput.value = searchInput.value + " " + e.target.id;
        }
    }
}


for (let i = 0; i < bookmarks.length; i++) {
    if (bookmarks[i] != undefined) {
        var pressTimer;
        // bookmarks[i].mouseup(function () {
        //     clearTimeout(pressTimer);
        //     // Clear timeout
        //     return false;
        // }).mousedown(function () {
        //     // Set timeout
        //     pressTimer = window.setTimeout(function () {
        //         console.log('clicked')
        //     }, 1000);
        //     return false;
        // });
        // bookmarks[i].addEventListener('longclick', function (e) {
        //     console.log('longclicked')
        //     var x = document.getElementById("#snackbar");
        //     x.className = "show";
        //     setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);

        // });

        bookmarks[i].addEventListener('mouseup', function () {
            clearTimeout(pressTimer);
            return false;
        });

        bookmarks[i].addEventListener('mousedown', function (e) {
            pressTimer = window.setTimeout(function () {
                console.log('clicked');
                var x = document.getElementById("snackbar");
                x.className = "show";
                x.innerText = 'copied the url ';
                setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
            }, 500);
            return false;
        });
    }
}



// searchInput.addEventListener("keydown", function (event) {
//     if (event.key === "Enter") {
//         query = searchInput.value

//         // url = 'https://www.google.com/search?q='

//         url = 'https://www.bing.com/search?q='

//         url = url + query
//         if (query == '') {
//             url = url.substring(0, url.indexOf('/', 8))
//         }
//         window.open(url, "_self")
//     }
// });


// document.body.addEventListener('mousemove', function (event) {
//     searchInput.focus();
// });
// document.body.onclick = function (event) {
//     searchInput.focus();
// }

let sujjections = [];
const sujjectionList = document.querySelector('.c');
// Redundant listener replaced by Auto-fill logic above
// searchInput.addEventListener('input', function (event) {
//     console.log(event.target.value);
// });

// const snapchat = document.querySelector('.snapchat');
const apiUrl = 'https://newsapi.org/v2/top-headlines?category=technology&apiKey=f5808133ba3b49d585ec923a38f600c8'; // Update with your API key

    // Function to fetch technology-related headlines
    async function fetchKeywords() {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        // Extract headlines (or adjust according to the API response structure)
        const keywords = data.articles.map(article => article.title);
        
        // Open search tabs for each keyword
        openSearchTabs(keywords);
      } catch (error) {
        console.error('Error fetching keywords:', error);
      }
    }
    
    // Function to open Bing search tabs for each keyword
    function openSearchTabs(keywords) {
      const baseUrl = 'https://www.bing.com/search?q=';
      
      keywords.forEach(keyword => {
        const searchUrl = baseUrl + encodeURIComponent(keyword);
        chrome.tabs.create({ url: searchUrl });
      });
    }
    
    // snapchat.onclick = () => {
    //   fetchKeywords();
    // };












