const previousValueDisplay = document.querySelector(".previous-value");
const currentValueDisplay =  document.querySelector(".current-value");
let equation = [];
let newNumberFlag = false;
let lastOperator = null;
let result;
let newResult;
let newClickedNumber;
let previousEquation = [];
const numbers = document.querySelectorAll(".number");
const operators = document.querySelectorAll(".operator");
const equals = document.querySelector(".equals");
const clear = document.querySelectorAll(".clear");
const backspace = document.querySelector(".backspace");

numbers.forEach(number => {
    number.addEventListener("click", event => {
        const clickedNumber = event.target.textContent;
        if (newNumberFlag && !equation.length) {
            previousValueDisplay.textContent = "\u00A0"
            currentValueDisplay.textContent = currentValueDisplay.textContent == result ? clickedNumber :`${currentValueDisplay.textContent}${clickedNumber}`;
            newClickedNumber = currentValueDisplay.textContent;
        } else if (newNumberFlag) {
            currentValueDisplay.textContent = clickedNumber;
            newNumberFlag = false;
        } else {
            currentValueDisplay.textContent = currentValueDisplay.textContent == 0 ? clickedNumber :`${currentValueDisplay.textContent}${clickedNumber}`;
        }
    })
})

operators.forEach(operator => {
    operator.addEventListener("click", event => {

        const operator = event.target.textContent;
        const currentValue = currentValueDisplay.textContent;
        
        if (newNumberFlag) {
            previousValueDisplay.textContent = "";
            equation = [];
        }

        if (!equation.length) {
            equation.push(currentValue, operator);
            previousValueDisplay.textContent = `${currentValue} ${operator}`;
            lastOperator = operator;
            return newNumberFlag = true;
        } else {
            equation.push(currentValue);
            const result = calculate(equation[0], equation[1], equation[2]);
            currentValueDisplay.textContent = result;
            previousValueDisplay.textContent = `${result} ${operator}`;
            equation = [result, operator];
            lastOperator = operator;
            return newNumberFlag = true;
        }
    })
})

equals.addEventListener("click", () => {

    if (!equation.length && previousEquation.length && currentValueDisplay.textContent == result) {
        equation = [...previousEquation]
        newResult = calculate(result, equation[1], equation[2]);
        currentValueDisplay.textContent = newResult;
        previousValueDisplay.textContent = `${result} ${equation[1]} ${equation[2]} =`;
        previousEquation = [];
        previousEquation.push(result, equation[1], equation[2]);
        result = newResult;
    } else if (!equation.length && previousEquation.length) {
        equation = [...previousEquation]
        newResult = calculate(newClickedNumber, equation[1], equation[2]);
        currentValueDisplay.textContent = newResult;
        previousValueDisplay.textContent = `${newClickedNumber} ${equation[1]} ${equation[2]} =`;
        previousEquation = [];
        previousEquation.push(newClickedNumber, equation[1], equation[2]);
        result = newResult;
    } else if (!equation.length)  {
        previousValueDisplay.textContent = `${currentValueDisplay.textContent} =`;
    } else if (equation.length) {
        equation.push(currentValueDisplay.textContent);
        result = calculate(equation[0], equation[1], equation[2]);
        currentValueDisplay.textContent = result;
        previousValueDisplay.textContent = `${equation[0]} ${equation[1]} ${equation[2]} =`;
        previousEquation = [...equation]
    }
    equation = [];
    newNumberFlag = true;
})

clear.forEach(btn => {
    btn.addEventListener("click", event => {
        currentValueDisplay.textContent = "0";
        if (event.target.classList.contains("all")) {
            previousValueDisplay.textContent = "\u00A0";
            equation = [];
            previousEquation = [];
            newNumberFlag = false;
        }
    })
})

backspace.addEventListener("click", () => {
    if (previousEquation.length) {
        previousValueDisplay.textContent = "\u00A0";
    } else {
        if (currentValueDisplay.textContent.length == 1) {
            currentValueDisplay.textContent = "0";
        } else {
            currentValueDisplay.textContent = currentValueDisplay.textContent.slice(0, -1);
        }
    }
})

function calculate(operand1, operator, operand2) {
    operand1 = Number(operand1);
    operand2 = Number(operand2);

    let result;

    if (operator === "+") {
        result = operand1 + operand2;
    } else if (operator === "-") {
        result = operand1 - operand2;
    } else if (operator === "x") {
        result = operand1 * operand2;
    } else if (operator === "÷") {
        result = operand2 != 0 ? operand1 / operand2 : "Cannot divide by zero";
    }
    return result;
}
