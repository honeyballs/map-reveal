console.log("executing");

const input = document.getElementById("img-input");

// Set the selection function of the input
input.onchange = () => readImg(input);

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
