
const textInput = document.getElementById("text-input");
const charCount = document.getElementById("char-count");


const MAX_CHARS = 50;


textInput.addEventListener("input", () => {
    let currentText = textInput.value;


    if (currentText.length > MAX_CHARS) {
        currentText = currentText.slice(0, MAX_CHARS);
        textInput.value = currentText;
    }


    charCount.textContent = `Character Count: ${currentText.length}/${MAX_CHARS}`;


    if (currentText.length === MAX_CHARS) {
        charCount.classList.add("max");
    } else {
        charCount.classList.remove("max");
    }
});  