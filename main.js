console.log("executing");

// Set the selection function of the input
let input = document.getElementById("img-input");
input.onchange = () => readImg(input);

let grid = {fields: [], width: 0, height: 0};

/**
 * Read an image from a user selected an place it in an image tag
 */
function readImg(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = e => {
            document
                .getElementById("map-img")
                .setAttribute("src", e.target.result);
            imageSelected(true);
            createGrid(10, 10);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

/**
 *
 * If an image was selected we hide the input and display the tool div
 *
 * @param selected
 */
function imageSelected(selected) {
    if (selected) {
        document.getElementById("choosing-div").classList.add("hidden");
        document.getElementById("mapping").classList.remove("hidden");
    }
}

/**
 * Create a grid of squares with the amount of squares the user specifies.
 *
 * @param xAxisSquares Amount of squares on X-Axis
 * @param yAxisSquares Amount of squares on Y-Axis
 */
function createGrid(xAxisSquares, yAxisSquares) {
    // Before any resizing was done set the dimensions to the image dimensions
    grid.width = document.getElementById("map-img").offsetWidth;
    grid.height = document.getElementById("map-img").offsetHeight;
    // Create the grid items
    const columns = [];
    for (let y = 0; y < yAxisSquares; y++) {
        const row = [];
        for (let x = 0; x < xAxisSquares; x++) {
            row.push({fog: true});
        }
        columns.push(row);
    }
    grid.fields = columns;
    renderGrid()
}

// TODO: Neu rendern wenn sich Größe ändert
// TODO: Fog im Objekt aus- und anmachen, neu rendern
// TODO: Auswahl für Grid Größe

/**
 * Renders the grid.
 *
 */
function renderGrid() {
    let gridElement = document.getElementById("grid");

    console.log(grid);

    // Calculate the width and height of the fields.
    const fieldWidth = grid.width / grid.fields[0].length;
    const fieldHeight = grid.height / grid.fields.length;

    gridElement.style.width = `${grid.width}px`;
    gridElement.style.height = `${grid.height}px`;
    gridElement.style.gridTemplateColumns = `repeat(${grid.fields.length}, ${fieldWidth}px)`;
    gridElement.style.gridTemplateRows = `repeat(${grid.fields[0].length}, ${fieldHeight}px)`;

    console.log(gridElement.style.width);

    grid.fields.forEach(row => {
        row.forEach(_ => {
            let elementDiv = document.createElement("div");
            elementDiv.classList.add("field", "fog");
            elementDiv.onclick = e => {
              e.preventDefault();
              elementDiv.classList.toggle("fog");
            };
            gridElement.appendChild(elementDiv);
        });
    })
}
