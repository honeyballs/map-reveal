console.log("executing");

let input = document.getElementById("img-input");

// Set the selection function of the input
input.onchange = () => readImg(input);

initializeGridDiv()

/**
 * Read an image from a user selected an place it in an image tag
 */
function readImg(input) {
  console.log;
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = e => {
      document
        .getElementById("map-img")
        .setAttribute("src", e.target.result);
    };
    reader.readAsDataURL(input.files[0]);
    imageSelected(true);
  }
}

/**
 *
 * If an image was selected we hide the input and display the tool div
 *
 * @param {bool} selected
 */
function imageSelected(selected) {
  if (selected) {
    document.getElementById("choosing-div").classList.add("hidden");
    document.getElementById("mapping").classList.remove("hidden");
  }
}

function createGrid() {
  let grid = {x: 50, y: 50, items: []}
  let columns = []
  for (let i = 0; i < 15; i++) {
    let rows = []
      for (let j = 0; j < 15; j++) {
         rows.push({fog: true})
      }
    columns.push(rows)  
  }
  grid.items = columns
  return grid
}

function initializeGridDiv() {
  let gridElement = document.getElementById("grid")
  let grid = createGrid()

  console.log(grid)
  
  gridElement.style.width = `${grid.items[0].length * grid.x}px`
  gridElement.style.height = `${grid.items.length * grid.y}px`
  gridElement.style.gridTemplateColumns = `repeat(${grid.items.length}, ${grid.y}px)`
  gridElement.style.gridTemplateRows = `repeat(${grid.items[0].length}, ${grid.x}px)`

  console.log(gridElement.style.width)

  grid.items.forEach(row => {
    row.forEach(item => {
      let elementDiv = document.createElement("div")
      elementDiv.style.cssText = "background: black; border: 1px solid red; cursor: pointer;"
      gridElement.appendChild(elementDiv)
    })
    console.log()
  })
}