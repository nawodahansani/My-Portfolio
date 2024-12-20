let display = document.getElementById("display");
let currentInput = "";

function appendNumber(number) {
    if (display.innerHTML === "0" && number !== ".") {
        display.innerHTML = "";
    }
    display.innerHTML += number;
    currentInput += number;
}

function appendOperator(operator) {
    if (currentInput === "" || currentInput.endsWith(" ")) return;
    display.innerHTML += " " + operator + " ";
    currentInput += " " + operator + " ";
}

function appendDot() {
    const lastNumber = currentInput.split(" ").pop();
    if (!lastNumber.includes(".")) {
        display.innerHTML += ".";
        currentInput += ".";
    }
}

function clearDisplay() {
    display.innerHTML = "0";
    currentInput = "";
}

function deleteLast() {
    currentInput = currentInput.trim();
    if (currentInput.length > 0) {
        currentInput = currentInput.slice(0, -1);
        display.innerHTML = currentInput || "0";
    }
}

function calculate() {
    try {
        let result = eval(currentInput);
        display.innerHTML = result;
        currentInput = result.toString();
    } catch (error) {
        display.innerHTML = "Error";
    }
}
