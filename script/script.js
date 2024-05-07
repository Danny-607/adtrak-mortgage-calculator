// Get the 2D rendering context for the mortgage chart canvas
var ctx = document.getElementById('mortgageChart').getContext('2d');

// Variable to hold the instance of the chart
var chartInstance = null;

// Get the modal and buttons from the DOM
var modal = document.getElementById('modal');
var yearlyButton = document.getElementById('yearlyButton');
var monthlyButton = document.getElementById('monthlyButton');

// Get the elements for displaying monthly and yearly repayment amounts
var monthlyText = document.getElementById('month');
var yearlyText = document.getElementById('year');

// Event listener for the mortgage form submission
document.getElementById("mortgageForm").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent default form submission behavior

  // Remove 'hidden' class from the modal to display it
  modal.classList.remove('hidden');

  // Extract input values from the form
  let principal = parseFloat(document.getElementById("principal").value);
  let downPayment = parseFloat(document.getElementById("downPayment").value);
  let interestRate = parseFloat(document.getElementById("interestRate").value) * 0.01;
  let loanTerm = parseInt(document.getElementById("loanTerm").value);
  let loanTermMonth = loanTerm * 12;
  let loan = principal - downPayment;

  // Calculate monthly payment details
  let monthlyInterestRate = interestRate / 12;
  let monthlyPayment = loan * (monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -loanTermMonth));
  let total = monthlyPayment * loanTermMonth;
  let interestPayment = total - loan;

  // Set event handlers for yearly and monthly buttons
  yearlyButton.onclick = function () { yearly(total, loanTerm, interestPayment, loan) };
  monthlyButton.onclick = function () { monthly(total, interestPayment, monthlyPayment, loanTermMonth, loan) };
  yearly(total, loanTerm, interestPayment, loan); // Display yearly payments by default

  // Display monthly and yearly repayment amounts
  monthlyText.textContent = `Monthly repayment amount £ ${monthlyPayment.toFixed(2)}`;
  yearlyText.textContent = `Yearly repayment amount £ ${(monthlyPayment * 12).toFixed(2)}`;
});

// Function to display monthly payments on the chart
function monthly(total, interestPayment, monthlyPayment, loanTermMonth, loan) {
  let data = [];
  let interestData = [];
  let loanData = [];
  let leftToRepay = total;

  let monthlyInterestRepayment = interestPayment / loanTermMonth;
  let monthlyLoanRepayment = loan / loanTermMonth;

  // Calculate and store interest data for each month
  for (let i = 0; i < loanTermMonth; i++) {
    interestPayment -= monthlyInterestRepayment;
    if (interestPayment < 0) {
      interestPayment = 0;
    }
    interestData.push(interestPayment.toFixed(2));
  }

  // Calculate and store loan data for each month
  for (let i = 0; i < loanTermMonth; i++) {
    loan -= monthlyLoanRepayment;
    if (loan < 0) {
      loan = 0;
    }
    loanData.push(loan.toFixed(2));
  }

  // Calculate and store remaining balance data for each month
  for (let i = 0; i < loanTermMonth; i++) {
    leftToRepay -= monthlyPayment;
    if (leftToRepay < 0) {
      leftToRepay = 0;
    }
    data.push(leftToRepay.toFixed(2));
  }

  // Generate the chart
  generateChart(data, loanTermMonth, interestData, loanData);
}

// Function to display yearly payments on the chart
function yearly(total, loanTerm, interestPayment, loan) {
  var data = [];
  let interestData = [];
  let loanData = [];
  var totalYearlyLoanRepayment = total / loanTerm;
  var leftToRepay = total;
  let yearlyInterestRepayment = interestPayment / loanTerm;
  let yearlyLoanRepayment = loan / loanTerm;

  // Calculate and store interest data for each year
  for (let i = 0; i < loanTerm; i++) {
    interestPayment -= yearlyInterestRepayment;
    if (interestPayment < 0) {
      interestPayment = 0;
    }
    interestData.push(interestPayment.toFixed(2));
  }

  // Calculate and store loan data for each year
  for (let i = 0; i < loanTerm; i++) {
    loan -= yearlyLoanRepayment;
    if (loan < 0) {
      loan = 0;
    }
    loanData.push(loan.toFixed(2));
  }

  // Calculate and store remaining balance data for each year
  for (let i = 0; i < loanTerm; i++) {
    leftToRepay -= totalYearlyLoanRepayment;
    if (leftToRepay < 0) {
      leftToRepay = 0;
    }
    data.push(leftToRepay.toFixed(2));
  }

  // Generate the chart
  generateChart(data, loanTerm, interestData, loanData);
}

// Function to generate the chart using Chart.js library
function generateChart(data, term, interestData, loanData) {
  // Destroy previous chart instance if exists
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Generate new chart
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      // Sets the x-axis labels to the term of the loan
      labels: Array.from({ length: term }, (_, i) => ` ${i + 1}`),
      datasets: [{
        label: 'Remaining Balance',
        backgroundColor: 'rgba(0,255,0)',
        borderColor: 'rgba(0,255,0)',
        data: data
      },
      {
        label: 'Interest Payment',
        backgroundColor: 'rgba(0,0,255)',
        borderColor: 'rgba(0,0,255)',
        data: interestData 
      },
      {
        label: 'Loan Payment',
        backgroundColor: 'rgba(255,0,0)',
        borderColor: 'rgb(255,0,0)',
        data: loanData 
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Close modal by clicking outside the area of the modal
window.onclick = function (event) {
  if (!modal.contains(event.target)) {
    modal.classList.add('hidden');
  }
}

// Close modal by pressing button
document.getElementById('close-btn').addEventListener('click', function () {
  modal.classList.add('hidden');
});
