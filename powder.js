const canvas = document.getElementById("powderCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = 600;
canvas.height = 400;

// Grid size
const GRID_SIZE = 4; // 2x2 pixels per cell
const cols = canvas.width / GRID_SIZE;
const rows = canvas.height / GRID_SIZE;

const particleProperties = {
    "SAND" : 
    {
        weight : 112,
        fluidity: 0.01,
        powderity: 1,
        diffusionability: 0,
        color: "#fffb00"
    },
    "WATER" : 
    {
        weight : 110,
        fluidity: 1,
        powderity: 0,
        diffusionability: 1,
        color: "#3498db"
    },
    "EMPTY" : 
    {
        weight : 100,
        fluidity: 100,
        powderity: 100,
        diffusionability: 100,
        color: "#000000"
    },
}

let grid = new Array(rows).fill().map(() => new Array(cols).fill("EMPTY"));
let gridMoved = new Array(rows).fill().map(() => new Array(cols).fill(false));

let particleCount = 0;

function applyGravity(xx, yy, particleKey)
{
    if (yy + 1 < rows && yy + 1 >= 0) {
        if(!gridMoved[yy + 1][xx])
        {
            let particleBelow = grid[yy + 1][xx];
            let gravitySwapChance = ((particleProperties[particleKey]["weight"]-particleProperties[particleBelow]["weight"])/10);
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

    if (yy - 1 < rows && yy - 1 >= 0) {
        if(!gridMoved[yy - 1][xx])
        {
            let particleAbove = grid[yy - 1][xx];
            let gravitySwapChance = ((particleProperties[particleAbove]["weight"]-particleProperties[particleKey]["weight"])/10);
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
    if(Math.random() < particleProperties[particleKey]["fluidity"])
    {
        let direction = Math.random() < 0.5 ? 1 : -1;
        if (xx + direction >= 0 && xx + direction < cols) {
            if(grid[yy][xx + direction] === "EMPTY")
            {
                grid[yy][xx + direction] = particleKey;
                gridMoved[yy][xx + direction] = true;
                grid[yy][xx] = "EMPTY";
                //applyGravity(xx,yy,particleKey);
                return true;
            }
        }
        else if (xx - direction >= 0 && xx - direction < cols) {
            if(grid[yy][xx - direction] === "EMPTY")
            {
                grid[yy][xx - direction] = particleKey;
                gridMoved[yy][xx - direction] = true;
                grid[yy][xx] = "EMPTY";
                //applyGravity(xx,yy,particleKey);
                return true;
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
    ctx.fillText(particleCount + " particles TOUCH", 10, 15);

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

canvas.addEventListener("mousemove", (event) => {
    if (event.buttons === 1) { // Left click
        let x = Math.floor(event.offsetX / GRID_SIZE);
        let y = Math.floor(event.offsetY / GRID_SIZE);
        grid[y][x] = "SAND";
    } else if (event.buttons === 2) { // Right click
        let x = Math.floor(event.offsetX / GRID_SIZE);
        let y = Math.floor(event.offsetY / GRID_SIZE);
        grid[y][x] = "WATER";
    }
}, { passive: false });

canvas.addEventListener("touchmove", (event) => {
    if (event.buttons === 1) { // Left click
        let x = Math.floor(event.offsetX / GRID_SIZE);
        let y = Math.floor(event.offsetY / GRID_SIZE);
        grid[y][x] = "SAND";
    } else if (event.buttons === 2) { // Right click
        let x = Math.floor(event.offsetX / GRID_SIZE);
        let y = Math.floor(event.offsetY / GRID_SIZE);
        grid[y][x] = "WATER";
    }
}, { passive: false });

// Prevent right-click menu
canvas.addEventListener("contextmenu", (event) => event.preventDefault());

function update() {
    updateParticles();
    drawGrid();
    requestAnimationFrame(update);
}

// Start the game loop
update();