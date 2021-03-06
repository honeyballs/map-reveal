// Init variables
let grid = {fields: [], width: 0, height: 0, top: 0, left: 0};
let imageLoaded = false;
let mapHidden = true;

// Set the selection function of the input
const input = document.getElementById("img-input");
input.onchange = () => readImg(input);

// Toggle the settings form
const settingsToggle = document.getElementById("settings-button");
const gridSettings = document.getElementById("grid-settings");
settingsToggle.onclick = e => {
    e.stopPropagation();
    toggleSettings();
};
settingsToggle.ontouchstart = e => {
    e.preventDefault();
    e.stopPropagation();
    toggleSettings();
};

window.onclick = e => {
    settingsToggle.classList && settingsToggle.classList.remove("settings-open");
    gridSettings.classList.add("hidden");
};

// Prevent propagation from out of the form to prevent closing it
gridSettings.onclick = e => e.stopPropagation();

// Create the grid by using the settings form
document.getElementById("create-grid").onclick = e => {
    e.stopPropagation();
    e.preventDefault();
    settingsToggle.classList.remove("settings-open");
    gridSettings.classList.add("hidden");
    const rowValue = document.getElementById("settings-rows").value;
    const colValue = document.getElementById("settings-columns").value;
    const rowAmount = rowValue !== "" ? +rowValue : 10;
    const colAmount = colValue !== "" ? +colValue : 10;
    if (rowAmount > 0 && colAmount > 0 && imageLoaded) {
        createGrid(rowAmount, colAmount);
    }
};

// Toggle all fields of the map
const mapToggle = document.getElementById("map-toggle-button");
mapToggle.onclick = e => {
    toggleGridFields();
};
mapToggle.ontouchstart = e => {
    e.preventDefault();
    toggleGridFields();
};

// Set the resize and d&d listener
document.getElementById("resizer").onmousedown = startResize;
document.getElementById("resizer").ontouchstart = startResize;
document.getElementById("mover").onmousedown = startDragAndDrop;
document.getElementById("mover").ontouchstart = startDragAndDrop;

/**
 * Show or hide the grid settings.
 */
function toggleSettings() {
    settingsToggle.classList.toggle("settings-open");
    gridSettings.classList.toggle("hidden");
}

/**
 * Hides or shows all fields of the displayed grid.
 */
function toggleGridFields() {
    const icons = mapToggle.getElementsByClassName("map-icon");
    for (let icon of icons) {
        icon.classList.toggle("hidden");
    }
    grid.fields.forEach(row => row.forEach(item => item.fog = !mapHidden));
    mapHidden = !mapHidden;
    renderGrid();
}

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
            imageLoaded = true;
            imageSelected();
        };
        reader.readAsDataURL(input.files[0]);
    }
}

/**
 *
 * If an image was selected we hide the input and display the map and settings.
 *
 */
function imageSelected() {
    if (imageLoaded) {
        document.getElementById("choosing-div").classList.add("hidden");
        document.getElementById("mapping").classList.remove("hidden");
        settingsToggle.classList.remove("hidden");
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
    const gridElement = document.getElementById("grid");
    const mapElement = document.getElementById("map-img");
    gridElement.classList.remove("hidden");

    // Calculate the width and height of the fields.
    const fieldWidth = grid.width / grid.fields.length;
    const fieldHeight = grid.height / grid.fields[0].length;

    // Calculate the position of the grid if not already set
    const originalX = grid.left !== 0 ? grid.left : mapElement.getBoundingClientRect().left;
    const originalY = grid.top !== 0 ? grid.top : mapElement.getBoundingClientRect().top;

    // Set the appropriate styles
    gridElement.style.width = `${grid.width}px`;
    gridElement.style.height = `${grid.height}px`;
    gridElement.style.top = `${originalY}px`;
    gridElement.style.left = `${originalX}px`;
    gridElement.style.gridTemplateColumns = `repeat(${grid.fields.length}, ${fieldWidth}px)`;
    gridElement.style.gridTemplateRows = `repeat(${grid.fields[0].length}, ${fieldHeight}px)`;

    // Removes and adds fields. This is used to be able to store the status in the grid object and render accordingly.
    const fields = gridElement.getElementsByClassName("field");
    while (fields[0]) {
        fields[0].parentNode.removeChild(fields[0]);
    }
    addGridFields(gridElement);


    // When a grid is rendered we display a toggle button for it.
    mapToggle.classList.remove("hidden");
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
                // Change the value in the underlying grid object
                field.fog = !field.fog;
                renderGrid();
            };
            elementDiv.ontouchstart = e => {
                e.preventDefault();
                field.fog = !field.fog;
                renderGrid();
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
    const originalMouseX = event.touches ? event.touches[0].pageX : event.pageX;
    const originalMouseY = event.touches ? event.touches[0].pageY : event.pageY;

    // Listener function to calculate the new size and trigger a rerender
    const resize = e => {
        e.preventDefault();
        const movedX = e.touches ? e.touches[0].pageX : e.pageX;
        const movedY = e.touches ? e.touches[0].pageY : e.pageY;
        grid.width = originalWidth + (movedX - originalMouseX);
        grid.height = originalHeight + (movedY - originalMouseY);
        renderGrid();
    };

    window.addEventListener("touchmove", resize);
    window.addEventListener("mousemove", resize);

    // Remove the listener to stop resizing
    window.onmouseup = e => {
        e.preventDefault();
        window.removeEventListener("mousemove", resize);
    };

    window.ontouchend = e => {
        e.preventDefault();
        window.removeEventListener("touchmove", resize);
    };
}

/**
 * Initializes values needed for d&d and registers listeners which handle the actual dragging and dropping.
 */
function startDragAndDrop(event) {
    let gridElement = document.getElementById("grid");
    const originalX = gridElement.getBoundingClientRect().left;
    const originalY = gridElement.getBoundingClientRect().top;

    // Listener function to calculate the new position.
    // No Rerender necessary
    const dragging = e => {
        e.preventDefault();
        const movedX = e.touches ? e.touches[0].pageX : e.pageX;
        const movedY = e.touches ? e.touches[0].pageY : e.pageY;
        grid.left = originalX + (movedX - originalX);
        grid.top = originalY + (movedY - originalY);
        renderGrid()
    };

    window.addEventListener("mousemove", dragging);
    window.addEventListener("touchmove", dragging);

    // Remove the listener to stop resizing
    window.onmouseup = e => {
        e.preventDefault();
        window.removeEventListener("mousemove", dragging);
    };

    window.ontouchend = e => {
        e.preventDefault();
        window.removeEventListener("touchmove", dragging);
    };

}