// Set the selection function of the input
let input = document.getElementById("img-input");
input.onchange = () => readImg(input);

// Set the resize and d&d listener
document.getElementById("resizer").onmousedown = startResize;
document.getElementById("resizer").ontouchstart = startResize;
document.getElementById("mover").onmousedown = startDragAndDrop;
document.getElementById("mover").ontouchstart = startDragAndDrop;

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
            // Remove this when done
            setTimeout(() => createGrid(10, 10), 500);
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

// TODO: Auswahl für Grid Größe (Anzahl an Feldern)
// TODO: Toggle alles sichtbar/unsichtbar

/**
 * Renders the grid.
 *
 */
function renderGrid() {
    let gridElement = document.getElementById("grid");
    gridElement.classList.remove("hidden");
    // Calculate the width and height of the fields.
    const fieldWidth = grid.width / grid.fields[0].length;
    const fieldHeight = grid.height / grid.fields.length;

    gridElement.style.width = `${grid.width}px`;
    gridElement.style.height = `${grid.height}px`;
    gridElement.style.gridTemplateColumns = `repeat(${grid.fields.length}, ${fieldWidth}px)`;
    gridElement.style.gridTemplateRows = `repeat(${grid.fields[0].length}, ${fieldHeight}px)`;

    // Only add grid fields if necessary
    if (gridElement.children.length !== grid.fields.length * grid.fields[0].length + 2) {
        // Remove for safety
        const fields = gridElement.getElementsByClassName("field");
        while (fields[0]) {
            fields[0].parentNode.removeChild(fields[0]);
        }
        addGridFields(gridElement);
    }

}

/**
 * Add fields to the grid element.
 */
function addGridFields(gridElement) {
    grid.fields.forEach(row => {
        row.forEach(field => {
            let elementDiv = document.createElement("div");
            elementDiv.classList.add("field");
            // Change opacity
            field.fog && elementDiv.classList.add("fog");
            // Register click handler
            elementDiv.onclick = e => {
                e.preventDefault();
                // Change the value in the underlying grid object
                field.fog = !field.fog;
                elementDiv.classList.toggle("fog");
            };
            gridElement.appendChild(elementDiv);
        });
    })
}

/**
 * Initializes values needed for resizing and registers listeners which handle the actual resizing.
 */
function startResize(event) {
    event.preventDefault();
    // Init values
    let gridElement = document.getElementById("grid");
    const originalWidth = parseFloat(getComputedStyle(gridElement, null).getPropertyValue('width').replace('px', ''));
    const originalHeight = parseFloat(getComputedStyle(gridElement, null).getPropertyValue('height').replace('px', ''));
    const originalMouseX = event.pageX;
    const originalMouseY = event.pageY;

    // Listener function to calculate the new size and trigger a rerender
    const resize = e => {
        grid.width = originalWidth + (e.pageX - originalMouseX);
        grid.height = originalHeight + (e.pageY - originalMouseY);
        renderGrid();
    };

    window.addEventListener('mousemove', resize);
    window.addEventListener('touchmove', resize);

    // Remove the listener to stop resizing
    window.onmouseup = e => {
        window.removeEventListener('mousemove', resize)
    };

    window.ontouchend = e => {
        window.removeEventListener('touchmove', resize);
    };
}

/**
 * Initializes values needed for d&d and registers listeners which handle the actual dragging and dropping.
 */
function startDragAndDrop(event) {
    event.preventDefault();
    let gridElement = document.getElementById("grid");
    const originalX = gridElement.getBoundingClientRect().left;
    const originalY = gridElement.getBoundingClientRect().top;
    const originalMouseX = event.pageX;
    const originalMouseY = event.pageY;

    // Listener function to calculate the new position.
    // No Rerender necessary
    const dragging = e => {
        gridElement.style.left = `${originalX + (e.pageX - originalX)}px`;
        gridElement.style.top = `${originalY + (e.pageY - originalY)}px`;
    };

    window.addEventListener('mousemove', dragging);
    window.addEventListener('touchmove', dragging);

    // Remove the listener to stop resizing
    window.onmouseup = e => {
        window.removeEventListener('mousemove', dragging);
    };

    window.ontouchend = e => {
        window.removeEventListener('touchmove', dragging);
    };
}