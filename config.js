const defaultShortcuts = [
    {
        url: "http://chat.openai.com/",
        icon: "images/chatgpt.jpg",
        alt: "ChatGPT"
    }
];

async function getShortcuts() {
    const result = await chrome.storage.sync.get('shortcuts');
    return result.shortcuts || defaultShortcuts;
}

async function saveShortcut(shortcut) {
    const shortcuts = await getShortcuts();
    shortcuts.push(shortcut);
    await chrome.storage.sync.set({ shortcuts });
    return shortcuts;
}

async function removeShortcut(index) {
    const shortcuts = await getShortcuts();
    shortcuts.splice(index, 1);
    await chrome.storage.sync.set({ shortcuts });
    return shortcuts;
}

export { getShortcuts, saveShortcut, removeShortcut };
