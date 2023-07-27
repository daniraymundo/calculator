const previousValueDisplay = document.querySelector(".previous-value")
const currentValueDisplay =  document.querySelector(".current-value")
let equation = []; //stores previous value (value displayed in history)
let newNumberFlag = false;
const numbers = document.querySelectorAll(".number")
const operators = document.querySelectorAll(".operator")

numbers.forEach(number => {
    number.addEventListener("click", event => {
        const clickedNumber = event.target.textContent;
        if (newNumberFlag) {
            currentValueDisplay.textContent = clickedNumber
            newNumberFlag = false;
        } else {
            currentValueDisplay.textContent = currentValueDisplay.textContent == 0 ? clickedNumber :`${currentValueDisplay.textContent}${clickedNumber}`
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

        if (!equation.length && currentValue == 0) return;

        if (!equation.length) {
            equation.push(currentValue, operator);
            previousValueDisplay.textContent = `${currentValue} ${operator}`
            return newNumberFlag = true;
        }
        if (equation.length) {
            equation.push(currentValue);
            const newValue = calculate(equation[0], equation[2], equation[1])
            currentValueDisplay.textContent = newValue;
            previousValueDisplay.textContent = `${newValue} ${operator}`;
            equation = [newValue, operator]
            newNumberFlag = true;
        }
    })
})

function calculate(operand1, operand2, operator) {
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
        result = operand1 / operand2
    }
    return result;
}
