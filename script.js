let cookies = 0;
let clickValue = 1;
let upgradeCost = 10;
let buildings = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let buildingCosts = [10, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000, 1000000];
let buildingProduction = [1, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000];
let templeCount = 0;
let totalCookies = 0;

// Initialize IndexedDB
const dbPromise = idb.openDB('cookie-clicker-db', 1, {
    upgrade(db) {
        db.createObjectStore('game-state', { keyPath: 'id' });
    }
});

// Load game state from IndexedDB
async function loadGame() {
    const db = await dbPromise;
    const tx = db.transaction('game-state', 'readonly');
    const store = tx.objectStore('game-state');
    const state = await store.get('game-state');
    
    if (state) {
        cookies = state.cookies;
        clickValue = state.clickValue;
        upgradeCost = state.upgradeCost;
        buildings = state.buildings;
        templeCount = state.templeCount;
        totalCookies = state.totalCookies;
    }
    updateCookies();
    updateBuildings();
}

// Save game state to IndexedDB
async function saveGame() {
    const db = await dbPromise;
    const tx = db.transaction('game-state', 'readwrite');
    const store = tx.objectStore('game-state');
    await store.put({
        id: 'game-state',
        cookies,
        clickValue,
        upgradeCost,
        buildings,
        templeCount,
        totalCookies,
    });
}

// Call loadGame function to load the game state
loadGame();

const cookieElement = document.getElementById("cookie");
const cookiesElement = document.getElementById("cookies");
const clickBtn = document.getElementById("click-btn");
const buyUpgradeBtn = document.getElementById("buy-upgrade");
const buildingButtons = document.querySelectorAll(".building-btn");
const templeButton = document.getElementById("buy-temple");

cookieElement.addEventListener("click", () => {
    cookies += clickValue;
    totalCookies += clickValue;
    updateCookies();
    saveGame(); // Save game state on click
});

clickBtn.addEventListener("click", () => {
    cookies += clickValue;
    totalCookies += clickValue;
    updateCookies();
    saveGame(); // Save game state on click
});

buyUpgradeBtn.addEventListener("click", () => {
    if (cookies >= upgradeCost) {
        cookies -= upgradeCost;
        clickValue *= 2;
        upgradeCost *= 2;
        updateCookies();
        saveGame(); // Save game state after buying an upgrade
    } else {
        alert("Not enough cookies to buy the upgrade!");
    }
});

templeButton.addEventListener("click", () => {
    const templeCost = Math.pow(10, templeCount + 1);
    if (cookies >= templeCost) {
        cookies -= templeCost;
        templeCount++;
        updateCookies();
        templeButton.textContent = `Buy Temple (${Math.pow(10, templeCount + 1)} cookies) [${templeCount}]`;
        saveGame(); // Save game state after buying a temple
    } else {
        alert("Not enough cookies to buy the temple!");
    }
});

for (let i = 0; i < buildingButtons.length; i++) {
    buildingButtons[i].addEventListener("click", () => {
        if (cookies >= buildingCosts[i]) {
            cookies -= buildingCosts[i];
            buildings[i]++;
            buildingCosts[i] *= 1.1; // Increase the cost of the next building
            updateCookies();
            updateBuildings();
            saveGame(); // Save game state after buying a building
        } else {
            alert("Not enough cookies to buy this building!");
        }
    });
}

function updateCookies() {
    cookiesElement.textContent = cookies.toFixed(2); // Display cookies with 2 decimal places
    buyUpgradeBtn.textContent = `Buy Upgrade (${upgradeCost.toFixed(2)} cookies)`;
    templeButton.textContent = `Buy Temple (${Math.pow(10, templeCount + 1)} cookies) [${templeCount}]`;
}

function updateBuildings() {
    for (let i = 0; i < buildingButtons.length; i++) {
        buildingButtons[i].textContent = `Buy Building (${buildingCosts[i].toFixed(2)} cookies) [${buildings[i]}]`;
    }
}

updateCookies();
updateBuildings();
