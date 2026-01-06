# Dev Search - New Tab Extension 🔍

A minimalist Chrome new tab extension designed for developers with customizable shortcuts, quick search, and bookmark integration.

![Dev Search Screenshot](https://raw.githubusercontent.com/venkat-clone/dev.search/refs/heads/main/samples/demo.mp4)


<video width="320" height="240" controls>
  <source src="https://raw.githubusercontent.com/venkat-clone/dev.search/refs/heads/main/samples/demo.mp4" type="video/mp4">
</video>



## ✨ Features

- **Modern Dark Theme** with neon accents
- **Multi-Search Engine Support** 
- **Quick Shortcuts** with favicon auto-detection
- **Recent Bookmarks Display**
- **Keyboard Navigation**
- **Filter Tags** for search refinement

## 🚀 Installation

1. Clone this repository
```bash
git clone https://github.com/yourusername/dev.search.git
```

2. Open Chrome Extensions
- Navigate to `chrome://extensions/`
- Enable "Developer mode"
- Click "Load unpacked"
- Select the project directory

## 💡 Usage

### Search
- Type in the search bar and press Enter for Bing search
- Click engine icons for specific search engines
- Use filter tags to refine searches

### Shortcuts
- Click `+` to add new shortcut
- Enter URL (required)
- Icon URL (optional - auto-detects favicon)
- Add description
- Navigate form with Tab/Enter
- Press Enter to save

### Bookmarks
- Shows 12 most recent Chrome bookmarks
- Click to visit
- Long-press to copy URL

### Keyboard Navigation
- `Tab/Enter`: Navigate shortcut form
- `Enter`: Submit search
- `Enter`: Save new shortcut

## 🎨 Customization

Edit theme colors in `styles.css`:
```css
:root {
  --background-color: #191e29;
  --primary-color: #01c38d;
  --canvas-color: #132d46;
  --shade: #696e79;
}
```

## 🛠️ Development

Required permissions in `manifest.json`:
```json
"permissions": [
    "storage",
    "bookmarks",
    "tabs"
]
```

## 📝 License

[MIT License](LICENSE)

## 🤝 Contributing

1. Fork the repo
2. Create feature branch
3. Commit changes
4. Push to branch
5. Submit Pull Request

## 🐛 Bug Reports

Open an issue with:
- Expected behavior
- Actual behavior
- Steps to reproduce
- Chrome version
