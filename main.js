import {  getShortcuts, saveShortcut, removeShortcut } from './config.js';

const icons = [...document.querySelectorAll('#searchIcons > *')];

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

// Initialize shortcuts on load
document.addEventListener('DOMContentLoaded', () => {
    loadQuickShortcuts();
    loadBookmarks();
});

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

for (let i = 0; i < icons.length; i++) {
    if (icons[i] != undefined) {

        icons[i].onclick = (element) => {
            query = searchInput.value
            target = element.target
            url = target.id
            if (url == undefined || url == '') {
                url = target.parentElement.id
            }
            url = url + query
            if (query == '') {
                url = url.substring(0, url.indexOf('/', 8))
            }
            window.open(url, "_self")
        }
    }
    else {
        console.log(icons[i])
    }
}

searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        query = searchInput.value

        // url = 'https://www.google.com/search?q='

        url = 'https://www.bing.com/search?q='

        url = url + query
        if (query == '') {
            url = url.substring(0, url.indexOf('/', 8))
        }
        window.open(url, "_self")
    }
});


// document.body.addEventListener('mousemove', function (event) {
//     searchInput.focus();
// });
// document.body.onclick = function (event) {
//     searchInput.focus();
// }

let sujjections = [];
const sujjectionList = document.querySelector('.c');
searchInput.addEventListener('input', function (event) {

    console.log(event.target.value);
});

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












