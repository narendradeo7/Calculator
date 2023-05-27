console.log("main js is working");
let input = document.querySelector('.inpbox');
let btns = document.querySelectorAll('.calbtn');

// empty string for the display of expression we write 
let string = "";
let calexp = "";

btns.forEach(button => {
    button.addEventListener('click', (e) => {
        if (e.target.innerHTML == '=') {
            // fixing ++ and -- 
            string = string.replace("++", "+").replace("--", "+");

            // saving expression before calculating
            calexp = string;

            // eval to calculate as javascript
            string = eval(string);
            input.innerHTML = string;
        } else if (e.target.innerHTML == 'AC') {
            string = "";
            input.innerHTML = string;
        }
        // working for negation 
        else if (e.target.innerHTML == '+/-') {
            // check if the last character is an operator
            const lastChar = string.charAt(string.length - 1);
            if (lastChar === '+' || lastChar === '-' || lastChar === '*' || lastChar === '/') {
                // append the negative sign to the next digit
                string += '-';
            } else {
                // flipping the sign of the last operand in the expression
                const operands = string.split(/[\+\-\*\/]/);
                const lastOperand = operands[operands.length - 1];
                string = string.replace(lastOperand, -lastOperand);
            }
            input.innerHTML = string;
        } else {
            // fixing ++ and -- 
            string = string.replace("++", "+").replace("--", "+");
            // replacing divide and multiply symbols
            if (e.target.innerHTML == "×") {
                string += "*";
            } else if (e.target.innerHTML == "÷") {
                string += "/";
            } else {
                string += e.target.innerHTML;
            }

            input.innerHTML = string;
        }

    })
})


// working of save function 
const savebtn = document.querySelector('.savebtn');


savebtn.addEventListener('click', (e) => {
    // Get the input elements
    const calcNameInput = document.getElementById('calcname');
    const expression = calexp;
    const result = string;

    // Create an object to hold the calculation data
    const calculationData = {
        calcname: calcNameInput.value,
        expression: expression,
        result: result
    };

    console.log("save button clicked" + calculationData.calcname + calculationData.result);

    if (loggedIn) {
        // Send the form data to the server
        fetch('/put-route', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(calculationData)
            })
            .then(response => response.json())
            .then(data => {
                // Handle the response from the server
                console.log('Calculation saved:', data);
                // Reload the current page
                location.reload();
                // Perform any additional actions or UI updates
            })
            .catch(error => {
                console.error('Error saving calculation:', error);
                // Handle any error that occurred during the request
            });

    } else {
        // Redirect to the /login route
        window.location.href = '/login';
    }


});