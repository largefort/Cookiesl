let cookies = 0;
let clickValue = 1;
let upgradeCost = 10;
let buildings = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let buildingCosts = [10, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000, 1000000];
let buildingProduction = [1, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000];
let templeCount = 0;

const cookieElement = document.getElementById("cookie");
const cookiesElement = document.getElementById("cookies");
const clickBtn = document.getElementById("click-btn");
const buyUpgradeBtn = document.getElementById("buy-upgrade");
const buildingButtons = document.querySelectorAll(".building-btn");
const templeButton = document.getElementById("buy-temple");

cookieElement.addEventListener("click", () => {
    cookies += clickValue;
    updateCookies();
});

clickBtn.addEventListener("click", () => {
    cookies += clickValue;
    updateCookies();
});

buyUpgradeBtn.addEventListener("click", () => {
    if (cookies >= upgradeCost) {
        cookies -= upgradeCost;
        clickValue *= 2;
        upgradeCost *= 2;
        updateCookies();
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
        } else {
            alert("Not enough cookies to buy this building!");
        }
    });
}

function updateCookies() {
    cookiesElement.textContent = cookies;
    buyUpgradeBtn.textContent = `Buy Upgrade (${upgradeCost} cookies)`;
    templeButton.textContent = `Buy Temple (${Math.pow(10, templeCount + 1)} cookies) [${templeCount}]`;
}

function updateBuildings() {
    for (let i = 0; i < buildingButtons.length; i++) {
        buildingButtons[i].textContent = `Buy Building (${buildingCosts[i]} cookies) [${buildings[i]}]`;
    }
}

updateCookies();
updateBuildings();
