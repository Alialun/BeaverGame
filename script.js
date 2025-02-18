// Use BigInt for handling massive numbers
let counter = BigInt(0);
let clickValue = BigInt(1);
let clickAddition = BigInt(0);
let clickMultiplier = BigInt(1);
let clickMegaMulti = [];

const counterDisplay = document.getElementById("counter");
//const upgradeButton = document.getElementById("upgradeBtn");

const upgrades = {
    "clickPower": {
        name: "Click Power",
        baseCost: BigInt(10),
        costMultiplier: 1.5,
        level: 0,
        effect_text: "+1 to click power.",
        upgrade_effect: function() {
            //clickMegaMulti.push(BigInt(2)) // Exponential growth
            clickAddition += BigInt(1);
        },
        cost: function(){
            return BigInt(Math.ceil(Number(this.baseCost) * Math.pow(this.costMultiplier, this.level)))
        },
        element: null
    },
};

function createUpgradeButtons() {
    const upgradeContainer = document.getElementById("upgrade-container");

    for (let key in upgrades) {
        let button = document.createElement("button");
        upgrades[key].element = button;
        button.setAttribute("data-id", key);
        button.innerText = `Upgrade`;
        button.setAttribute("data-title", upgrades[key].name + " (Level "+(upgrades[key].level+1)+")");
        button.setAttribute("data-cost", "Cost: " + formatNumber(upgrades[key].baseCost));
        button.setAttribute("class", "game-button");
        button.setAttribute("data-effect", upgrades[key].effect_text);
        button.setAttribute("data-flavor", "Flavor ...");
        button.onclick = (event) => {
            buyUpgrade(key);
            button.innerText = `${upgrades[key].name} (Level: ${upgrades[key].level})`;
            updateTooltip(event)
        };
        upgradeContainer.appendChild(button);
    }
}

function updateUpgradeButton(upgradeKey) {
    upgrades[upgradeKey].element.setAttribute("data-cost", "Cost: " + formatNumber(upgrades[upgradeKey].cost()));
    upgrades[upgradeKey].element.setAttribute("data-title", upgrades[upgradeKey].name + " (Level "+(upgrades[upgradeKey].level+1)+")");
}

function buyUpgrade(upgradeKey) {
    let upgrade = upgrades[upgradeKey];
    let cost = upgrade.cost();

    if (counter >= cost) {
        counter = BigInt(counter - cost);
        upgrade.level++;
        counterDisplay.innerText = formatNumber(counter);
        upgrade.upgrade_effect();
        updateUpgradeButton(upgradeKey);
    }
}

const baseWaterUnits = [
    "Drops of Water", "Puddles of Water", "Ponds of Water", "Lakes of Water", 
    "Seas of Water", "Oceans of Water", "Hydrospheres",  
    "Water Planetary Systems", "Water Nebuli", "Water Galaxies", 
    "Water Clusters", "Water Universes"
];

// Suffixes for infinite chaining AFTER Water Universes
const suffixes = ["Atoms", "Molecules", "Drops", "Puddles", "Ponds", "Lakes", "Oceans", "Hydrospheres",  
    "Planetary Systems", "Nebuli", "Galaxies", "Clusters", "Universes"];

function getInfiniteUnit(index) {
    if (index < baseWaterUnits.length) {
        return baseWaterUnits[index]; // Return base unit if within range
    }

    return getInfiniteUnit(index - baseWaterUnits.length) + "of Water Universes"

}

function formatNumber(num) {
    if (num < BigInt(1000)) return `${num} ${baseWaterUnits[0]}`; // Small numbers stay as "Drops of Water"

    let exponent = Math.floor((num.toString().length - 1) / 3); //triple exponent
    let normalizedNumber = Math.round(Number(num) / (Math.pow(10,(exponent*3)))*1000)/1000;

    let finalString = `${normalizedNumber.toFixed(3)} ${baseWaterUnits[exponent]}`;

    return finalString;
}


const dropletContainer = document.getElementById("droplet-container");

// Function to spawn a falling droplet
function createDroplet() {
    const droplet = document.createElement("div");
    if(Math.random()*100 < 1)
        droplet.classList.add("golden-droplet");
    droplet.classList.add("droplet");

    // Random horizontal position
    let randomX = Math.random() * (window.innerWidth-200) +100;
    droplet.style.left = `${randomX}px`;

    // Add droplet to the container
    dropletContainer.appendChild(droplet);

    // Remove droplet after animation
    setTimeout(() => {
        droplet.remove();
    }, 30000);

    // Click event - Collect water from droplet
    droplet.addEventListener("click", () => {
        if (droplet.classList.contains("golden-droplet")) {
            addClickValue(100);
        }
        else
        {
            addClickValue();
        }
        counterDisplay.innerText = formatNumber(counter);
        droplet.remove(); // Remove after clicking
    });

    clearInterval(dropletsInterval);
    dropletsInterval = setInterval(createDroplet, 10000 + (Math.random() * 1000 - 500));
}

// Continuously spawn new droplets
let dropletsInterval = setInterval(createDroplet, 10000);

// Upgrade event
/*upgradeButton.addEventListener("click", () => {
    clickMegaMulti.push(BigInt(10));
    upgradeButton.innerText = `Upgrade Click Power (x10) [Now: +${formatNumber(getClickValue())}]`;
});*/

document.addEventListener("DOMContentLoaded", function () {
    createUpgradeButtons();
});

function addClickValue(multi = 1)
{
    counter += getClickValue()* BigInt(multi);
}

function getClickValue()
{
    var value = (clickValue + clickAddition) * clickMultiplier;
    clickMegaMulti.forEach(element => {
        value *= element;
    });
    return value;
}

document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".game-button"); // Select all buttons
    const tooltip = document.getElementById("tooltip");

    buttons.forEach(button => {
        button.addEventListener("mouseenter", updateTooltip);

        button.addEventListener("mouseleave", () => {
            tooltip.classList.add("hidden");
        });
    });
});

function updateTooltip(event) {
    const target = event.target;

    const title = target.getAttribute("data-title");
    const cost = target.getAttribute("data-cost");
    const effect = target.getAttribute("data-effect");
    const flavor = target.getAttribute("data-flavor");

    tooltip.innerHTML = `
        <strong>${title}</strong><br>
        <p>${cost}</p>
        <p>${effect}</p>
        <hr>
        <p style="color: #888;"><em>"${flavor}"</em></p>
    `;

    tooltip.classList.remove("hidden");

    const rect = target.getBoundingClientRect();
    tooltip.style.left = `${rect.left + window.scrollX + rect.width / 2 - tooltip.offsetWidth / 2}px`;
    tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 10}px`;
}

createDroplet()