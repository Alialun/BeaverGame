const canvas = document.getElementById("powderCanvas");
const ctx = canvas.getContext("2d");

const version = "black hole"

// Set canvas size
canvas.width = 504;
canvas.height = 504;

const divisions = [252, 168, 126, 84, 72, 63, 56, 42, 36, 28, 24, 21, 18, 14, 12, 9, 8, 7, 6, 4, 3, 2];

// Grid size
const GRID_SIZE = 6; // 2x2 pixels per cell
const cols = canvas.width / GRID_SIZE;
const rows = canvas.height / GRID_SIZE;

const particleProperties = {
    "EMPTY" : 
    {
        falls : true,
        weight : 50,
        fluidity: 1,
        powderity: 1,
        diffusionability: 1,
        color: "#000000",
        specialBehavoir: function() {},
        interactions:{}
    },
    "SAND" : 
    {
        falls : true,
        weight : 112,
        fluidity: 0.002,
        powderity: 1,
        diffusionability: 0.1,
        color: "#fffb00",
        specialBehavoir: function() {},
        interactions:{}
    },
    "ROCKS" : 
    {
        falls : true,
        weight : 150,
        fluidity: 0,
        powderity: 0.0002,
        diffusionability: 0.0004,
        color: "#505050",
        specialBehavoir: function() {},
        interactions:{
            "WATER" : function(x, y, otherX, otherY) {
                if(Math.random() < 0.002) grid[y][x] = "SAND"
            }
        }
    },
    "WATER" : 
    {
        falls : true,
        weight : 110,
        fluidity: 1,
        powderity: 1,
        diffusionability: 1,
        color: "#3498db",
        specialBehavoir: function() {},
        interactions:{}
    },
    "OIL" : 
    {
        falls : true,
        weight : 104,
        fluidity: 0.8,
        powderity: 0.8,
        diffusionability: 1,
        color:"#794000",
        specialBehavoir: function() {},
        interactions:{}
    },
    "WALL" : 
    {
        falls : false,
        weight : 500,
        fluidity: 0,
        powderity: 0,
        diffusionability: 0,
        color: "#aaaaaa",
        specialBehavoir: function() {},
        interactions:{}
    },
    "BLACK_HOLE" : 
    {
        falls : false,
        weight : 500,
        fluidity: 0,
        powderity: 0,
        diffusionability: 0,
        color: "#2c002a",
        specialBehavoir: function() {},
        interactions:{
            "ANY" : function(x, y, otherX, otherY) {
                if(particleProperties[grid[otherY][otherX]]["falls"])
                    grid[otherY][otherX] = "EMPTY";
            }
        }
    },
}

// Generate radio buttons dynamically
const selectorDiv = document.getElementById("particleSelector");
let selectedParticle = "SAND"; // Default selection

// Generate buttons dynamically
for (let type in particleProperties) {
    const button = document.createElement("button");
    button.textContent = type;
    button.setAttribute("class","particleButton");
    button.style.backgroundColor = particleProperties[type].color; // Set button color
    button.style.color = getLuminance(particleProperties[type].color) > 0.5 ? "black" : "white"; // Ensure text is readable
    button.dataset.type = type; // Store type in data attribute

    // Default selected style
    if (type === selectedParticle) {
        button.style.border = "3px solid white";
    }

    // Button click event
    button.addEventListener("click", function () {
        selectedParticle = this.dataset.type;

        // Reset all button styles
        document.querySelectorAll("#particleSelector button").forEach(btn => {
            btn.style.border = "none";
        });

        // Highlight selected button
        this.style.border = "3px solid white";
    });

    selectorDiv.appendChild(button);
}
function getLuminance(hex) {
    // Convert hex to RGB
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    // Calculate relative luminance (per W3C standard)
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

////////////// POWDER GAME LOGIC


let grid = new Array(rows).fill().map(() => new Array(cols).fill("EMPTY"));
let gridMoved = new Array(rows).fill().map(() => new Array(cols).fill(false));

let particleCount = 0;

function applyGravity(xx, yy, particleKey)
{
    if(particleProperties[particleKey]["falls"])
    {
        if (yy + 1 < rows && yy + 1 >= 0) {
            if(!gridMoved[yy + 1][xx])
            {
                let particleBelow = grid[yy + 1][xx];
                if(particleProperties[particleBelow]["falls"])
                {
                    let gravitySwapChance = ((particleProperties[particleKey]["weight"]-particleProperties[particleBelow]["weight"])/10)*Math.max(particleProperties[particleKey]["fluidity"],particleProperties[particleBelow]["fluidity"]);
                    if(Math.random() < gravitySwapChance)
                    {
                        grid[yy + 1][xx] = particleKey;
                        grid[yy][xx] = particleBelow;
                        gridMoved[yy + 1][xx] = true;
                        gridMoved[yy][xx] = true;
                        return true;
                    }
                }
            }
        }

        if (yy - 1 < rows && yy - 1 >= 0) {
            if(!gridMoved[yy - 1][xx])
            {
                let particleAbove = grid[yy - 1][xx];
                if(particleProperties[particleAbove]["falls"])
                {
                    let gravitySwapChance = ((particleProperties[particleAbove]["weight"]-particleProperties[particleKey]["weight"])/10)*Math.max(particleProperties[particleKey]["fluidity"],particleProperties[particleAbove]["fluidity"]);
                    if(Math.random() < gravitySwapChance)
                    {
                        grid[yy - 1][xx] = particleKey;
                        grid[yy][xx] = particleAbove;
                        gridMoved[yy - 1][xx] = true;
                        gridMoved[yy][xx] = true;
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

/*function applyGravitySwapping(xx, yy, particleKey)
{
    if(yy + 1 < rows)
    {
        let particleBelow = grid[yy + 1][xx];
        if(particleBelow !== "EMPTY")
        {
            let gravitySwapChance = ((particleProperties[particleKey]["gravity"]*particleProperties[particleKey]["weight"]) - (particleProperties[particleBelow]["gravity"]*particleProperties[particleBelow]["weight"]))
            if(Math.random() < gravitySwapChance)
            {
                grid[yy + 1][xx] = particleKey;
                grid[yy][xx] = particleBelow;
                gridMoved[yy][xx] = true;
                gridMoved[yy + 1][xx] = true;
                return true;
            }
        }
    }
    return false;
}*/

function applyFluidity(xx, yy, particleKey)
{
    
    let direction = Math.random() < 0.5 ? 1 : -1;
    if (xx + direction >= 0 && xx + direction < cols) {
        if(grid[yy][xx + direction] === "EMPTY")
        {
            if(Math.random() < particleProperties[particleKey]["fluidity"])
            {
                grid[yy][xx + direction] = particleKey;
                gridMoved[yy][xx + direction] = true;
                grid[yy][xx] = "EMPTY";
                //applyGravity(xx,yy,particleKey);
                return true;
            }
        }
        else
        {
            let thisDiffusionability = particleProperties[particleKey]["diffusionability"]
            let otherDiffusionability = particleProperties[grid[yy][xx + direction]]["diffusionability"]
            if(!gridMoved[yy][xx + direction])
            {
                let diffusionChance = Math.min(thisDiffusionability, otherDiffusionability);
                if(Math.random() < diffusionChance)
                {
                    let otherParticle = grid[yy][xx + direction];
                    grid[yy][xx + direction] = particleKey;
                    grid[yy][xx] = otherParticle;
                    gridMoved[yy][xx] = true;
                    gridMoved[yy][xx + direction] = true;
                    return true;
                }
            }
        }
    }
    return false;
}

function applyPowderity(xx, yy, particleKey)
{
    if(Math.random() < particleProperties[particleKey]["powderity"])
    {
        let direction = Math.random() < 0.5 ? 1 : -1;
        if (yy + 1 < rows && xx + direction < cols && grid[yy + 1][xx + direction] === "EMPTY") {
            grid[yy + 1][xx + direction] = particleKey;
            gridMoved[yy + 1][xx + direction] = true;
            grid[yy][xx] = "EMPTY";
            return true;
        } 
        else if (yy + 1 < rows && xx - direction >= 0 && grid[yy + 1][xx - direction] === "EMPTY") {
            grid[yy + 1][xx - direction] = particleKey;
            gridMoved[yy + 1][xx + direction] = true;
            grid[yy][xx] = "EMPTY";
            return true;
        }
    }
    return false;
}

function handleInteraction(x, y, otherX, otherY) {
    let thisParticle = grid[y][x];
    let otherParticle = grid[otherY][otherX];
    if (particleProperties[thisParticle] && particleProperties[thisParticle].interactions[otherParticle]) {
        particleProperties[thisParticle].interactions[otherParticle](x, y, otherX, otherY);
    }
    else
    if(particleProperties[thisParticle] && particleProperties[thisParticle].interactions["ANY"]){
        particleProperties[thisParticle].interactions["ANY"](x, y, otherX, otherY);
    }
}

function applyInteractions(x,y){
    let otherX = x;
    let otherY = y + 1;
    if(otherY < cols)
        handleInteraction(x,y,otherX,otherY);
    otherX = x-1;
    otherY = y;
    if(otherX >= 0)
        handleInteraction(x,y,otherX,otherY);
    otherX = x + 1;
    otherY = y;
    if(otherX < rows)
        handleInteraction(x,y,otherX,otherY);
    otherX = x;
    otherY = y - 1;
    if(otherY >= 0)
        handleInteraction(x,y,otherX,otherY);
}

function updateParticles() {
    
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            gridMoved[y][x] = false;
        }
    }

    let particlesToMove = [];
    
    //vezmu všechny particly a dám je do pole
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (grid[y][x] !== "EMPTY") {
                particlesToMove.push({ x, y });
            }
        }
    }

    particleCount = particlesToMove.length;

    //pole zamíchám nějakym random algoritmem, co jsem našel na netu :)
    for (let i = particlesToMove.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [particlesToMove[i], particlesToMove[j]] = [particlesToMove[j], particlesToMove[i]];
    }

    //zpracuju všechny particly
    for (let { x, y } of particlesToMove) {
        //console.log(particlesToMove.length)
        if(!gridMoved[y][x])
        {
            let particle = grid[y][x];



            if (particle !== "EMPTY") {
                applyInteractions(x,y)
                if(!applyGravity(x,y,particle))
                if(!applyPowderity(x,y,particle))
                if(!applyFluidity(x,y,particle))
                {}
            } 
        }
    }
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (grid[y][x] !== "EMPTY") {
                ctx.fillStyle = particleProperties[grid[y][x]]["color"];
            } else {
                continue; // Skip empty pixels
            }

            ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        }
    }

    ctx.fillStyle = "#ffffff";
    ctx.fillText(particleCount + " particles - "+version+" version", 10, 15);

    /*for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (gridMoved[y][x]===true) {
                ctx.fillStyle = "#ff0000";
            } else {
                continue;
            }

            ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        }
    }*/
}

let isTouching = false; // Track touch state

canvas.addEventListener("mousedown", () => {
    isTouching = true;
});
canvas.addEventListener("mouseup", () => {
    isTouching = false;
});
canvas.addEventListener("mouseleave", () => {
    isTouching = false;
});

// Mouse Support
canvas.addEventListener("mousemove", (event) => {
    if (event.buttons === 1) {
        drawParticles(event.offsetX, event.offsetY);
    }
}, { passive: false });

// Touch Support
canvas.addEventListener("touchstart", (event) => {
    isTouching = true;
    let touch = event.touches[0];
    drawParticles(touch.clientX - canvas.offsetLeft, touch.clientY - canvas.offsetTop);
}, { passive: false });

canvas.addEventListener("touchmove", (event) => {
    if (isTouching) {
        let touch = event.touches[0];
        drawParticles(touch.clientX - canvas.offsetLeft, touch.clientY - canvas.offsetTop);
    }
}, { passive: false });

canvas.addEventListener("touchend", () => {
    isTouching = false;
});

// Function to draw particles
function drawParticles(x, y) {
    let gridX = Math.floor(x / GRID_SIZE);
    let gridY = Math.floor(y / GRID_SIZE);
    let type = selectedParticle;

    // Loop over a 3x3 area centered on (gridX, gridY)
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            let newX = gridX + dx;
            let newY = gridY + dy;

            // Ensure newX and newY are within grid bounds
            if (newX >= 0 && newX < cols && newY >= 0 && newY < rows) {
                grid[newY][newX] = type;
            }
        }
    }
}

// Prevent right-click menu
canvas.addEventListener("contextmenu", (event) => event.preventDefault());

function update() {
    updateParticles();
    drawGrid();
    requestAnimationFrame(update);
}

// Start the game loop
update();