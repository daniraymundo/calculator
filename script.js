const previousValue = document.querySelector(".previous-value")
const currentValue =  document.querySelector(".current-value")
let itemArray = [];
let equationArray = [];
let newNumberFlag = false;
const numbers = document.querySelectorAll(".number")

numbers.forEach(number => {
    number.addEventListener("click", event => {
        const newInput = event.target.textContent;
        if (newNumberFlag) {
            currentValue.textContent = newInput
            newNumberFlag = false;
        } else {
            currentValue.textContent = currentValue.textContent == 0 ? newInput :`${currentValue.textContent}${newInput}`
        }
    })
})