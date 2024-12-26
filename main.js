const icons = [...document.querySelectorAll('#searchIcons > *')];

const searchInput = document.querySelector('.search');
const bookmarks = document.querySelectorAll('.bookmark')
const filters = document.querySelectorAll('.g-filter')


for (let i = 0; i < filters.length; i++) {
    if (filters[i] != undefined) {
        filters[i].onclick = (e) => {
            searchInput.value = searchInput.value + " " + e.target.id;
        }
    }
}


for (i = 0; i < bookmarks.length; i++) {
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

for (i = 0; i < icons.length; i++) {
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


document.body.addEventListener('mousemove', function (event) {
    searchInput.focus();
});
document.body.onclick = function (event) {
    searchInput.focus();
}

let sujjections = [];
const sujjectionList = document.querySelector('.c');
searchInput.addEventListener('input', function (event) {

    console.log(event.target.value);
});

const snapchat = document.querySelector('.snapchat');
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
    
    snapchat.onclick = () => {
      fetchKeywords();
    };












