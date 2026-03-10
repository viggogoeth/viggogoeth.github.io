// Globals

let currentTool = "erase-tool";
let isDrawing = false;

let gridWidth = 8;
let gridHeight = 8;

let numTiles = gridWidth * gridHeight;


// Setup drawing
window.addEventListener('mousedown', () => isDrawing = true);
window.addEventListener('mouseup', () => isDrawing = false);


// Set up tool button functionality
function updateCurrentTool(tool) {
    currentTool = tool;
    console.log(currentTool);
}

const tileBtns = document.querySelectorAll(".tile-btn");

tileBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
        updateCurrentTool(this.id);
    });
});

// Bucket tool
let bucketMode = false;

const bucketTool = document.getElementById("bucket-tool");
bucketTool.addEventListener("click", function () {
    bucketMode = !bucketMode;
    console.log("Bucket mode: ", bucketMode);
});
const otherTools = document.querySelectorAll(".tool-btn");
otherTools.forEach((btn) => {
    if (btn.id != "bucket-tool") {
        btn.addEventListener("click", function () {
            bucketMode = false;
            console.log("Bucket mode: ", bucketMode);
        })
    }
})

// Setup grid functionality
function updateTile(tile) {
    tile.className = "tile";
    if (currentTool != "erase-tool") {
        tile.classList.add(currentTool);
    } else {
        tile.classList.add("tile-0");
    }
    console.log("updating tile: ", tile, " to type: ", currentTool);
}

// const matches = str.match(/\d+/);
// const number = parseInt(matches[0], 10);

// TODO: get better
function fillTiles(origin) {
    console.log("Fill with origin: ", origin);
    console.log("Filling with ", numTiles, " total tiles");
    // If the clicked tile is already the replacement color, stop.
    const targetClass = origin.classList[origin.classList.length - 1];
    console.log("target: ", targetClass);
    const replacementClass = currentTool;
    console.log("replacement: ", replacementClass);
    if (targetClass === replacementClass) return;
    if (targetClass === "tile" && currentTool === "erase-tool" ) return;

    const match = origin.id.match(/\d+/)[0];
    const startIndex = parseInt(match, 10);

    const stack = [startIndex];
    const visited = [startIndex];
    const totalTiles = numTiles; // Change to your total number of tiles

    while (stack.length > 0) {
        const currentIndex = stack.pop();
        const currentTile = document.getElementById(`tileID-${currentIndex}`);

        // Check if current tile exists and matches the target color
        if (currentTile && currentTile.classList.contains(targetClass)) {
            
            // 1. Apply the new class
            updateTile(currentTile);

            // 2. Calculate neighbor indices
            const neighbors = [
                currentIndex - gridWidth, // Top
                currentIndex + gridWidth, // Bottom
                currentIndex - 1,         // Left
                currentIndex + 1          // Right
            ];

            // 3. Prevent "wrapping" around the edges of the grid
            const isLeftEdge = (currentIndex % gridWidth === 0);
            const isRightEdge = (currentIndex % gridWidth === gridWidth - 1);

            neighbors.forEach((neighbor, i) => {
                // Skip left neighbor if we are on the left edge
                if (i === 2 && isLeftEdge) return;
                // Skip right neighbor if we are on the right edge
                if (i === 3 && isRightEdge) return;
                
                // Add valid neighbor to stack if it's within bounds
                if (neighbor >= 0 && neighbor < totalTiles && !visited.includes(neighbor)) {
                    stack.push(neighbor);
                    visited.push(neighbor);
                }
            });
        }
    }
}

function initTiles() {
    const mapTiles = document.querySelectorAll(".tile");

    mapTiles.forEach((tile) => {
        tile.addEventListener("mousedown", function (e) {
            e.preventDefault(); // prevent dragging effect
            if (bucketMode) {
                fillTiles(this);
            } else {
                updateTile(this);
            }
        })

        // Drawing effect
        tile.addEventListener('mouseenter', () => {
            if (isDrawing) {
                updateTile(tile);
            }
        });
    });
}
initTiles();





// Grid update
function updateGrid(tiles) {
    const map = document.getElementById("map");

    // delete old tiles
    while (map.firstChild) {
        map.removeChild(map.firstChild);
    }

    for (let i = 0; i < tiles; i++) {
        const newTile = document.createElement("div");
        newTile.classList.add("tile");
        newTile.classList.add("tile-0");    // Default "empty" tile num
        newTile.id = "tileID-" + i;

        map.appendChild(newTile);
    }

    initTiles();    // Add drawing event to tiles
    map.style.setProperty('--cols', gridWidth);   // Update grid look
}
updateGrid(numTiles);   // Always call atleast once


// Grid dimension update form submission
function updateDimensions(width, height) {
    if (width <= 0 || height <= 0) {
        return;
    }
    gridWidth = width;
    gridHeight = height;
    numTiles = width * height;
    console.log("Updated grid dimensions to: ", width, "x", height);
}

const dimensionForm = document.getElementById("dimensions");
dimensionForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const widthField = document.getElementById("width");
    const heightField = document.getElementById("height");

    gridWidth = parseInt(widthField.value);
    gridHeight = parseInt(heightField.value);

    numTiles = gridWidth*gridHeight;

    widthField.value = "";  // Clear input field
    heightField.value = ""; // Clear input field

    updateDimensions(gridWidth, gridHeight);
    updateGrid(numTiles);
});

const tileTypeToNumber = new Map();
tileTypeToNumber.set("tile-0", "00");
tileTypeToNumber.set("tile-1", "01");
tileTypeToNumber.set("tile-2", "02");
tileTypeToNumber.set("tile-3", "03");
tileTypeToNumber.set("tile-4", "04");
tileTypeToNumber.set("tile-5", "05");
tileTypeToNumber.set("tile-6", "06");
tileTypeToNumber.set("tile-7", "07");
tileTypeToNumber.set("tile-8", "08");
tileTypeToNumber.set("tile-9", "09");


// Get resulting map
function createOutput() {
    let content = "";

    // Add dimensions
    content += gridWidth + "\n";
    content += gridHeight + "\n";

    let i = 0;

    const map = document.getElementById("map");
    for (const tile of map.children) {
        if (i % gridWidth == 0 && i != 0) {
            content += "\n";
        }

        const tileClasses = tile.classList;
        const tileNum = tileTypeToNumber.get(tileClasses[tileClasses.length - 1]);
        content += tileNum + " ";

        i++;
    }

    // 2. Create a Blob with the text content and MIME type
    const blob = new Blob([content], { type: 'text/plain' });

    // 3. Create a unique URL representing that Blob
    return URL.createObjectURL(blob);
}

// View button
document.getElementById('output-btn').addEventListener('click', () => {
    const fileUrl = createOutput();

    // 4. Redirect the browser to that URL
    window.open(fileUrl, "_blank", 'width=400,height=400,resizable=yes');

    // Optional: Clean up the URL object after a short delay to free memory
    setTimeout(() => URL.revokeObjectURL(fileUrl), 100);
});

// Download button
document.getElementById('download-btn').addEventListener('click', () => {
    const fileUrl = createOutput();

    const fileNameField = document.getElementById("filename-field");
    let name = fileNameField.value;
    console.log("filename:", name);
    if (name === "") {
        name = "new-map.map";
    }

    // Download
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = name;

    // this is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
      new MouseEvent('click', { 
        bubbles: true, 
        cancelable: true, 
        view: window 
      })
    );
    

    // Optional: Clean up the URL object after a short delay to free memory
    setTimeout(() => URL.revokeObjectURL(fileUrl), 100);
});