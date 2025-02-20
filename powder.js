const canvas = document.getElementById("powderCanvas");
const ctx = canvas.getContext("2d");

const version = "arsonist"

// Set canvas size
canvas.width = 504;
canvas.height = 504;

const divisions = [252, 168, 126, 84, 72, 63, 56, 42, 36, 28, 24, 21, 18, 14, 12, 9, 8, 7, 6, 4, 3, 2];

// Grid size
const GRID_SIZE = 6;
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
        color: "#000000"
    },
    "FLAME" : 
    {
        falls : true,
        weight : 47,
        fluidity: 0.3,
        powderity: 0,
        diffusionability: 0,
        color: "#ff0000",
        specialBehavoir: function (x, y) {
            dataLayer[y][x]["movingData"]["fire"]["onFire"] = true;
            if(Math.random()<0.1)
            {
                grid[y][x]="EMPTY";
                dataLayer[y][x]["movingData"]["fire"]["onFire"] = false;
            }
            /*
            let random = Math.random()*30;
            if(random < 10) return "#ff0000";
            else if(random < 20) return "#ffa000";
            else return "#ffff00";*/
        },
        specialDraw: function (x,y) {
            let colorVariantRandom = dataLayer[y][x]["movingData"]["colorVariantRandom"];
            if(colorVariantRandom < 33) return "#ff0000";
            else if(colorVariantRandom < 66) return "#ffa000";
            else return "#ffff00";
        },
        specialInit: function (x,y)
        {

        },
        interactions:{}
    },
    "SAND" : 
    {
        falls : true,
        weight : 112,
        fluidity: 0.002,
        powderity: 1,
        diffusionability: 0.1,
        color: "#fffb00"
    },
    "ROCKS" : 
    {
        falls : true,
        weight : 150,
        fluidity: 0,
        powderity: 0.0002,
        diffusionability: 0.004,
        color: "#505050",
        interactions:{
            "WATER" : function(x, y, otherX, otherY) {
                if(Math.random() < 0.002) grid[y][x] = "SAND"
            }
        }
    },
    "ASH" : 
    {
        falls : true,
        weight : 111,
        fluidity: 0.0002,
        powderity: 1,
        diffusionability: 0.1,
        color: "#909090"
    },
    "DUST" : 
    {
        falls : true,
        weight : 110,
        fluidity: 0.00002,
        powderity: 1,
        diffusionability: 0.02,
        color:"#c6c7a3",
        flammability: {
            flammability: 0.8,
            duration: 100,
            volatility: 0.4,
            ashChance: 0.2,
        }
    },
    "WATER" : 
    {
        falls : true,
        weight : 110,
        fluidity: 1,
        powderity: 1,
        diffusionability: 0.6,
        color: "#3498db"
    },
    "OIL" : 
    {
        falls : true,
        weight : 104,
        fluidity: 0.8,
        powderity: 0.8,
        diffusionability: 0.8,
        color:"#794000",
        flammability: {
            flammability: 1,
            duration: 10,
            volatility: 1,
            ashChance: 0.2,
        }
    },
    "PETROL" : 
    {
        falls : true,
        weight : 106,
        fluidity: 1,
        powderity: 1,
        diffusionability: 0.8,
        color: "#350046",
        flammability: {
            flammability: 1,
            duration: 500,
            volatility: 1,
            ashChance: 0.2,
        }
    },
    "WALL" : 
    {
        falls : false,
        weight : 500,
        fluidity: 0,
        powderity: 0,
        diffusionability: 0,
        color: "#aaaaaa"
    },
    "BLACK_HOLE" : 
    {
        falls : false,
        weight : 500,
        fluidity: 0,
        powderity: 0,
        diffusionability: 0,
        color: "#2c002a",
        interactions:{
            "ANY" : function(x, y, otherX, otherY) {
                if(particleProperties[grid[otherY][otherX]]["falls"])
                    grid[otherY][otherX] = "EMPTY";
            }
        }
    },
    "WHITE_HOLE" : 
    {
        falls : false,
        weight : 500,
        fluidity: 0,
        powderity: 0,
        diffusionability: 0,
        color:"#fbd3ff",
        specialBehavoir: function(x, y) {
            if(dataLayer[y][x]["whiteHoleParticle"] !== null)
            {
                if (y + 1 < rows && y + 1 >= 0)
                {
                    if(grid[y+1][x]=="EMPTY")
                    {
                        if(Math.random() < 0.02) grid[y+1][x] = dataLayer[y][x]["whiteHoleParticle"]
                    }
                }
                if (y - 1 < rows && y - 1 >= 0)
                {
                    if(grid[y-1][x]=="EMPTY")
                    {
                        if(Math.random() < 0.02) grid[y-1][x] = dataLayer[y][x]["whiteHoleParticle"]
                    }
                }
                if (x + 1 < rows && x + 1 >= 0)
                {
                    if(grid[y][x+1]=="EMPTY")
                    {
                        if(Math.random() < 0.02) grid[y][x+1] = dataLayer[y][x]["whiteHoleParticle"]
                    }
                }
                if (x - 1 < rows && x - 1 >= 0)
                {
                    if(grid[y][x-1]=="EMPTY")
                    {
                        if(Math.random() < 0.02) grid[y][x-1] = dataLayer[y][x]["whiteHoleParticle"]
                    }
                }
            }
            else
            {
                if (y + 1 < rows && y + 1 >= 0)
                {
                    if(dataLayer[y+1][x]["whiteHoleParticle"]!==null)
                    {
                        dataLayer[y][x]["whiteHoleParticle"]= dataLayer[y+1][x]["whiteHoleParticle"];
                    }
                }
                if (y - 1 < rows && y - 1 >= 0)
                {
                    if(dataLayer[y-1][x]["whiteHoleParticle"]!==null)
                    {
                        dataLayer[y][x]["whiteHoleParticle"]= dataLayer[y-1][x]["whiteHoleParticle"];
                    }
                }
                if (x + 1 < rows && x + 1 >= 0)
                {
                    if(dataLayer[y][x+1]["whiteHoleParticle"]!==null)
                    {
                        dataLayer[y][x]["whiteHoleParticle"]= dataLayer[y][x+1]["whiteHoleParticle"];
                    }
                }
                if (x - 1 < rows && x - 1 >= 0)
                {
                    if(dataLayer[y][x-1]["whiteHoleParticle"]!==null)
                    {
                        dataLayer[y][x]["whiteHoleParticle"]= dataLayer[y][x-1]["whiteHoleParticle"];
                    }
                }
            }
        },
        interactions:{
            "ANY" : function(x, y, otherX, otherY) {
                if(dataLayer[y][x]["whiteHoleParticle"] == null)
                {
                    if(particleProperties[grid[otherY][otherX]] && grid[otherY][otherX]!="EMPTY")
                    {
                        if(particleProperties[grid[otherY][otherX]]["falls"])
                        {
                            dataLayer[y][x]["whiteHoleParticle"] = grid[otherY][otherX];
                        }
                    }
                }
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
let dataLayer = Array.from({ length: rows }, () => 
    Array.from({ length: cols }, () => ({
      whiteHoleParticle: null,
      movingData:{
        colorVariantRandom: Math.random()*100,
        fire: {
            onFire: false,
            howLong: 0
        }
      }
    }))
  );

let particleCount = 0;

function swapParticles(x, y, x2, y2, particle, particle2)
{
    grid[y2][x2] = particle;
    grid[y][x] = particle2;
    gridMoved[y2][x2] = true;
    gridMoved[y][x] = true;
    let data1tmp = dataLayer[y][x]["movingData"];
    dataLayer[y][x]["movingData"] = dataLayer[y2][x2]["movingData"];
    dataLayer[y2][x2]["movingData"] = data1tmp;
}

function applyGravity(xx, yy, particleKey)
{
    if (yy + 1 < rows && yy + 1 >= 0) {
        if(grid[yy+1][xx] != particleKey)
        {
            let thisDiffusionability = particleProperties[particleKey]["diffusionability"]
            let otherDiffusionability = particleProperties[grid[yy+1][xx]]["diffusionability"]
            if(!gridMoved[yy+1][xx] && particleProperties[grid[yy+1][xx]]["weight"] <= particleProperties[particleKey]["weight"])
            {
                let diffusionChance = ((thisDiffusionability + otherDiffusionability)/2)*Math.min(thisDiffusionability, otherDiffusionability);
                if(Math.random() < diffusionChance)
                {
                    let otherParticle = grid[yy+1][xx];
                    swapParticles(xx,yy,xx,yy+1,particleKey,otherParticle);
                    return true;
                }
            }
        }
    }
    if(particleProperties[particleKey]["falls"])
    {

        if (yy + 1 < rows && yy + 1 >= 0) {
            if(grid[yy+1][xx] != particleKey)
            {
                if(!gridMoved[yy + 1][xx])
                {
                    let particleBelow = grid[yy + 1][xx];
                    if(particleProperties[particleBelow]["falls"])
                    {
                        let gravitySwapChance = ((particleProperties[particleKey]["weight"]-particleProperties[particleBelow]["weight"])/10)*Math.max(particleProperties[particleKey]["fluidity"],particleProperties[particleBelow]["fluidity"]);
                        if(Math.random() < gravitySwapChance)
                        {
                            swapParticles(xx,yy,xx,yy+1,particleKey,particleBelow);
                            return true;
                        }
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
                        swapParticles(xx,yy,xx,yy-1,particleKey,particleAbove);
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
        if(grid[yy][xx + direction] === "EMPTY" || grid[yy][xx + direction] === "FLAME" )
        {
            if(Math.random() < particleProperties[particleKey]["fluidity"])
            {
                
                swapParticles(xx,yy,xx + direction,yy,particleKey,"EMPTY");
                //applyGravity(xx,yy,particleKey);
                return true;
            }
        }
        else
        {
            if(grid[yy][xx + direction] != particleKey)
            {
                let thisDiffusionability = particleProperties[particleKey]["diffusionability"]
                let otherDiffusionability = particleProperties[grid[yy][xx + direction]]["diffusionability"]
                if(!gridMoved[yy][xx + direction])
                {
                    let diffusionChance = ((thisDiffusionability + otherDiffusionability)/2)*Math.min(thisDiffusionability, otherDiffusionability);
                    if(Math.random() < diffusionChance)
                    {
                        let otherParticle = grid[yy][xx + direction];
                        swapParticles(xx,yy,xx + direction,yy,particleKey,otherParticle);
                        return true;
                    }
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
        if (yy + 1 < rows && xx + direction < cols && (grid[yy + 1][xx + direction] === "EMPTY" || grid[yy + 1][xx + direction] === "FLAME")) {
            swapParticles(xx,yy,xx + direction,yy + 1,particleKey,"EMPTY");
            return true;
        } 
        else if (yy + 1 < rows && xx - direction >= 0 && (grid[yy + 1][xx - direction] === "EMPTY" || grid[yy + 1][xx - direction] === "FLAME")) {
            swapParticles(xx,yy,xx - direction,yy + 1,particleKey,"EMPTY");
            return true;
        }
    }
    return false;
}

function handleInteraction(x, y, otherX, otherY) {
    let thisParticle = grid[y][x];
    let otherParticle = grid[otherY][otherX];
    if (particleProperties[thisParticle] && particleProperties[thisParticle]["interactions"] && particleProperties[thisParticle].interactions[otherParticle]) {
        particleProperties[thisParticle].interactions[otherParticle](x, y, otherX, otherY);
    }
    else
    if(particleProperties[thisParticle] && particleProperties[thisParticle]["interactions"] && particleProperties[thisParticle].interactions["ANY"]){
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

function handleSpecialBehavoir(x,y)
{
    if(particleProperties[grid[y][x]]["specialBehavoir"])
    {
        particleProperties[grid[y][x]].specialBehavoir(x,y);
    }
}

function handleFireBehavoir(x,y)
{
    if(particleProperties[grid[y][x]]["flammability"])
    {
        if(!getNeighbors(x,y,true).includes("EMPTY") && !getNeighbors(x,y,true).includes("FLAME"))
        {
            dataLayer[y][x]["movingData"]["fire"]["onFire"] = false;
        }
        else
        {
            if(dataLayer[y][x]["movingData"]["fire"]["onFire"])
            {
                if(Math.random() < particleProperties[grid[y][x]]["flammability"]["volatility"])
                {
                    if (y - 1 < rows && y - 1 >= 0)
                    {
                        if(grid[y-1][x] == "EMPTY")
                        {
                            grid[y-1][x] = "FLAME"
                        }
                    }
                }
                dataLayer[y][x]["movingData"]["fire"]["howLong"]+=1;
                if(dataLayer[y][x]["movingData"]["fire"]["howLong"] > particleProperties[grid[y][x]]["flammability"]["duration"])
                {
                    grid[y][x] = "EMPTY";
                    dataLayer[y][x]["movingData"]["fire"]["howLong"] = 0;
                }
            }
            else
            {
                if(getNeighbors(x,y,true).includes("EMPTY") || getNeighbors(x,y,true).includes("FLAME"))
                {
                    if (y + 1 < rows && y + 1 >= 0)
                    {
                        if(dataLayer[y+1][x]["movingData"]["fire"]["onFire"])
                        {
                            if(Math.random() < particleProperties[grid[y][x]]["flammability"]["flammability"])
                                dataLayer[y][x]["movingData"]["fire"]["onFire"] = true;
                        }
                    }
                    if (y - 1 < rows && y - 1 >= 0)
                    {
                        if(dataLayer[y-1][x]["movingData"]["fire"]["onFire"])
                        {
                            if(Math.random() < particleProperties[grid[y][x]]["flammability"]["flammability"])
                                dataLayer[y][x]["movingData"]["fire"]["onFire"] = true;
                        }
                    }
                    if (x + 1 < rows && x + 1 >= 0)
                    {
                        if(dataLayer[y][x+1]["movingData"]["fire"]["onFire"])
                        {
                            if(Math.random() < particleProperties[grid[y][x]]["flammability"]["flammability"])
                                dataLayer[y][x]["movingData"]["fire"]["onFire"] = true;
                        }
                    }
                    if (x - 1 < rows && x - 1 >= 0)
                    {
                        if(dataLayer[y][x-1]["movingData"]["fire"]["onFire"])
                        {
                            if(Math.random() < particleProperties[grid[y][x]]["flammability"]["flammability"])
                                dataLayer[y][x]["movingData"]["fire"]["onFire"] = true;
                        }
                    }
                }
            }
        }
    }
}

function getNeighbors(x,y, diagonal = false)
{
    let neighbors = []
    let otherX = x;
    let otherY = y + 1;
    if(otherY < cols)
        neighbors.push(grid[otherY][otherX]);
    otherX = x-1;
    otherY = y;
    if(otherX >= 0)
        neighbors.push(grid[otherY][otherX]);
    otherX = x + 1;
    otherY = y;
    if(otherX < rows)
        neighbors.push(grid[otherY][otherX]);
    otherX = x;
    otherY = y - 1;
    if(otherY >= 0)
        neighbors.push(grid[otherY][otherX]);
    if(diagonal)
    {
        otherX = x - 1;
        otherY = y + 1;
        if(otherY < cols && otherX >= 0)
            neighbors.push(grid[otherY][otherX]);
        otherX = x - 1;
        otherY = y - 1;
        if(otherX >= 0 && otherY >= 0)
            neighbors.push(grid[otherY][otherX]);
        otherX = x + 1;
        otherY = y + 1;
        if(otherX < rows && otherY < cols)
            neighbors.push(grid[otherY][otherX]);
        otherX = x + 1;
        otherY = y - 1;
        if(otherX < rows && otherY >= 0)
            neighbors.push(grid[otherY][otherX]);

    }
    return neighbors;
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



            if (grid[y][x] !== "EMPTY") { applyInteractions(x,y) }
            if (grid[y][x] !== "EMPTY") { handleSpecialBehavoir(x,y) }
            if (grid[y][x] !== "EMPTY") { handleFireBehavoir(x,y) }
            if (grid[y][x] !== "EMPTY") {
                if(!applyGravity(x,y,grid[y][x]))
                if(!applyPowderity(x,y,grid[y][x]))
                if(!applyFluidity(x,y,grid[y][x]))
                {}
            } 
        }
    }
}

function updateDataLayer()
{
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            //reset white holes if not present
            if (dataLayer[y][x]["whiteHoleParticle"] !== null && grid[y][x] != "WHITE_HOLE") {
                dataLayer[y][x]["whiteHoleParticle"] = null;
            }
            //reset fire duration if not on fire
            if (dataLayer[y][x]["movingData"]["fire"]["howLong"] > 0 && !particleProperties[grid[y][x]]["flammability"]) {
                dataLayer[y][x]["movingData"]["fire"]["howLong"] = 0;
            }
            if(!particleProperties[grid[y][x]]["flammability"] && dataLayer[y][x]["movingData"]["fire"]["onFire"])
                dataLayer[y][x]["movingData"]["fire"]["onFire"] = false;
            }
    }
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (grid[y][x] !== "EMPTY") {
                ctx.fillStyle = particleProperties[grid[y][x]]["color"];
                if(particleProperties[grid[y][x]]["specialDraw"])
                {
                    ctx.fillStyle = particleProperties[grid[y][x]].specialDraw(x,y);
                }
            } else {
                continue; // Skip empty pixels
            }

            ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        }
    }

    /*
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (dataLayer[y][x]["movingData"]["fire"]["onFire"]) {
                ctx.fillStyle = "#ff0000";
            } else {
                continue;
            }
            ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        }
    }*/

    //datalayer debug
    /*for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (dataLayer[y][x]["whiteHoleParticle"] !== null) {
                ctx.fillStyle = particleProperties[dataLayer[y][x]["whiteHoleParticle"]]["color"];
            } else {
                continue; // Skip empty pixels
            }

            ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        }
    }*/

    //movement debug
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

    ctx.fillStyle = "#ffffff";
    ctx.fillText(particleCount + " particles - "+version+" version", 10, 15);
}

let isTouching = false; // Track touch state
let drawInterval = null; // Store interval reference
let lastX = null, lastY = null; // Store last known position

canvas.addEventListener("mousedown", (event) => {
    isTouching = true;
    lastX = event.offsetX;
    lastY = event.offsetY;
    drawParticles(lastX, lastY);
    
    // Start continuous drawing when holding mouse
    drawInterval = setInterval(() => {
        if (isTouching && lastX !== null && lastY !== null) {
            drawParticles(lastX, lastY);
        }
    }, 50); // Adjust interval time if needed
});

canvas.addEventListener("mousemove", (event) => {
    if (event.buttons === 1) { // Only update if the mouse is held
        lastX = event.offsetX;
        lastY = event.offsetY;
        drawParticles(lastX, lastY);
    }
}, { passive: false });

canvas.addEventListener("mouseup", () => {
    isTouching = false;
    clearInterval(drawInterval);
});

canvas.addEventListener("mouseleave", () => {
    isTouching = false;
    clearInterval(drawInterval);
});

// Touch Support
canvas.addEventListener("touchstart", (event) => {
    isTouching = true;
    let touch = event.touches[0];
    lastX = touch.clientX - canvas.offsetLeft;
    lastY = touch.clientY - canvas.offsetTop;
    drawParticles(lastX, lastY);
    
    // Start continuous drawing when holding touch
    drawInterval = setInterval(() => {
        if (isTouching && lastX !== null && lastY !== null) {
            drawParticles(lastX, lastY);
        }
    }, 50);
}, { passive: false });

canvas.addEventListener("touchmove", (event) => {
    if (isTouching) {
        let touch = event.touches[0];
        lastX = touch.clientX - canvas.offsetLeft;
        lastY = touch.clientY - canvas.offsetTop;
        drawParticles(lastX, lastY);
    }
}, { passive: false });

canvas.addEventListener("touchend", () => {
    isTouching = false;
    clearInterval(drawInterval);
    lastX = null;
    lastY = null;
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
    updateDataLayer();
    updateParticles();
    drawGrid();
}

// Start the game loop
setInterval(update,1000/60);