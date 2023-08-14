const previousValueDisplay = document.querySelector(".previous-value");
const currentValueDisplay =  document.querySelector(".current-value");
const numbers = document.querySelectorAll(".number");
const operators = document.querySelectorAll(".operator");
const equals = document.querySelector(".equals");
const clear = document.querySelectorAll(".clear");
const backspace = document.querySelector(".backspace");
const signChange = document.querySelector(".sign");
const decimal = document.querySelector(".decimal");
let equation = [];
let newNumberFlag = false;
let lastOperator = null;
let result;
let newResult;
let newClickedNumber;
let previousEquation = [];
let isDecimalClicked = false;
let divideByZeroFlag = false;

function removeTrailingDecimal(str) {
    return str.endsWith(".") ? str.slice(0,-1) : str;
}

function limitDigits(number, maxDigits) {
    const numToStr = number.toString();

    if (numToStr.length > maxDigits) {
        const [integerPart, decimalPart] = numToStr.split(".");

        if (decimalPart) {
            const maxDecimalLength = maxDigits - integerPart.length - 1; 
            const roundedDecimalPart = parseFloat(`0.${decimalPart}`).toFixed(maxDecimalLength).split(".")[1];
            return (`${integerPart}.${roundedDecimalPart}`);
        } else {
            return parseFloat(integerPart.slice(0, maxDigits));
        }
    }
    return numToStr;
}

numbers.forEach(number => {
    number.addEventListener("click", event => {
        const clickedNumber = event.target.textContent;
        if (divideByZeroFlag) divideByZeroFlag = false;
        if (newNumberFlag && !equation.length) {
            previousValueDisplay.textContent = "\u00A0"
            currentValueDisplay.textContent = 
                currentValueDisplay.textContent == result 
                    ? clickedNumber 
                    : limitDigits(`${currentValueDisplay.textContent}${clickedNumber}`, 13);
            newClickedNumber = currentValueDisplay.textContent;
        } else if (newNumberFlag) {
            currentValueDisplay.textContent = (clickedNumber);
            newNumberFlag = false;
        } else {
            currentValueDisplay.textContent = 
                currentValueDisplay.textContent == "0" 
                    ? clickedNumber 
                    : limitDigits(`${currentValueDisplay.textContent}${clickedNumber}`, 13);
        }
    });
});

operators.forEach(operator => {
    operator.addEventListener("click", event => {

        const operator = event.target.textContent;
        let currentValue = currentValueDisplay.textContent;

        if (divideByZeroFlag) return;

        if (newNumberFlag) {
            previousValueDisplay.textContent = "";
            equation = [];
        }

        if (!equation.length) {
            currentValue = removeTrailingDecimal(currentValue);
            equation.push(currentValue, operator);
            previousValueDisplay.textContent = `${currentValue} ${operator}`;
        } else {
            currentValue = removeTrailingDecimal(currentValue);
            equation.push(currentValue);
            const result = calculate(equation[0], equation[1], equation[2]);
            currentValueDisplay.textContent = result;
            previousValueDisplay.textContent = `${result} ${operator}`;
            equation = [result, operator];
        }
        isDecimalClicked = false;
        lastOperator = operator;
        newNumberFlag = true;
    });
});

equals.addEventListener("click", () => {
    if (divideByZeroFlag) return;
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
        equation.push(removeTrailingDecimal(currentValueDisplay.textContent));
        result = calculate(equation[0], equation[1], equation[2]);
        currentValueDisplay.textContent = result;
        previousValueDisplay.textContent = `${equation[0]} ${equation[1]} ${equation[2]} =`;
        previousEquation = [...equation]
    }
    equation = [];
    newNumberFlag = true;
    isDecimalClicked = false;
});

clear.forEach(btn => {
    btn.addEventListener("click", event => {
        currentValueDisplay.textContent = "0";
        if (event.target.classList.contains("all")) {
            previousValueDisplay.textContent = "\u00A0";
            equation = [];
            previousEquation = [];
            newNumberFlag = false;
            isDecimalClicked = false;
        }
        divideByZeroFlag = false;
    });
});

backspace.addEventListener("click", () => {
    if (currentValueDisplay.textContent === "Cannot divide by zero") {
        currentValueDisplay.textContent = "0";
        previousValueDisplay.textContent = "\u00A0";
        equation = []
        previousEquation = []
        newNumberFlag = false;
    }
    if (previousEquation.length) {
        previousValueDisplay.textContent = "\u00A0";
    } else {
        if (currentValueDisplay.textContent.length == 1) {
            currentValueDisplay.textContent = "0";
        } else {
            currentValueDisplay.textContent = currentValueDisplay.textContent.slice(0, -1);
        }
    }
    isDecimalClicked = false;
    divideByZeroFlag = false;
});

signChange.addEventListener("click", () => {
    currentValueDisplay.textContent = parseFloat(currentValueDisplay.textContent) * -1;
    result = parseFloat(result) * -1;
    newClickedNumber = parseFloat(newClickedNumber) * -1;
});

decimal.addEventListener ("click", event => {
    if (!equation.length && previousEquation.length && !isDecimalClicked) {
        currentValueDisplay.textContent = "0";
        previousValueDisplay.textContent = "\u00A0";
    }

    if (!isDecimalClicked) {
        currentValueDisplay.textContent += event.target.textContent
    }
    isDecimalClicked = true;
})
function calculate(operand1, operator, operand2) {
    operand1 = parseFloat(operand1);
    operand2 = parseFloat(operand2);

    let result;

    if (operator === "+") {
        result = operand1 + operand2;
    } else if (operator === "-") {
        result = operand1 - operand2;
    } else if (operator === "x") {
        result = operand1 * operand2;
    } else if (operator === "÷") {
        if (operand2 == "0") {
            divideByZeroFlag = true;
            return "Cannot divide by zero";
        } else {
            result = operand1 / operand2;
        }
    }

    if (Math.abs(result) >= 1e+16) {
        return result.toExponential(6);
    } else {
        return limitDigits(result, 13);
    }
}
