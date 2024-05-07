var ctx = document.getElementById('mortgageChart').getContext('2d');
var chartInstance = null; // This will hold the chart instance
var modal = document.getElementById('modal');
var yearlyButton = document.getElementById('yearlyButton');
var monthlyButton = document.getElementById('monthlyButton');
var monthlyText = document.getElementById('month')
var yearlyText = document.getElementById('year')

document.getElementById("mortgageForm").addEventListener("submit", function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');

  let principal = parseFloat(document.getElementById("principal").value);
  let downPayment = parseFloat(document.getElementById("downPayment").value);
  let interestRate = parseFloat(document.getElementById("interestRate").value) * 0.01;
  let loanTerm = parseInt(document.getElementById("loanTerm").value);
  let loanTermMonth = loanTerm * 12;
  let loan = principal - downPayment;

  let monthlyInterestRate = interestRate / 12;
  let monthlyPayment = loan * (monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -loanTermMonth));
  let total = monthlyPayment * loanTermMonth;
  let interestPayment = total - loan;


  yearlyButton.onclick = function () { yearly(total, loanTerm, interestPayment, loan) };

  monthlyButton.onclick = function () { monthly(total, interestPayment, monthlyPayment, loanTermMonth, loan) };
  yearly(total, loanTerm, interestPayment, loan);

  monthlyText.textContent = `Monthly repayment amount £ ${monthlyPayment.toFixed(2)}`;
  yearlyText.textContent = `Yearly repayment amount £ ${(monthlyPayment * 12).toFixed(2)}`;

});

// Show monthly payments on chart
function monthly(total, interestPayment, monthlyPayment, loanTermMonth, loan) {
  let data = [];
  let interestData = [];
  let loanData = [];
  let leftToRepay = total;


  let monthlyInterestRepayment = interestPayment / loanTermMonth
  let monthlyLoanRepayment = loan / loanTermMonth

  for (let i = 0; i < loanTermMonth; i++) {

    interestPayment -= monthlyInterestRepayment;

    if (interestPayment < 0) {
      interestPayment = 0;

    }
    interestData.push(interestPayment.toFixed(2));
  }


  for (let i = 0; i < loanTermMonth; i++) {

    loan -= monthlyLoanRepayment;

    if (loan < 0) {
      loan = 0;

    }
    loanData.push(loan.toFixed(2));
  }


  for (let i = 0; i < loanTermMonth; i++) {

    leftToRepay -= monthlyPayment;

    if (leftToRepay < 0) {
      leftToRepay = 0;

    }
    data.push(leftToRepay.toFixed(2));
  }
  generateChart(data, loanTermMonth, interestData, loanData)
}

// Show yearly payments on chart
function yearly(total, loanTerm, interestPayment, loan) {
  var data = [];
  let interestData = [];
  let loanData = [];
  var totalYearlyLoanRepayment = total / loanTerm;
  var leftToRepay = total;
  let yearlyInterestRepayment = interestPayment / loanTerm
  let yearlyLoanRepayment = loan / loanTerm

  for (let i = 0; i < loanTerm; i++) {

    interestPayment -= yearlyInterestRepayment;

    if (interestPayment < 0) {
      interestPayment = 0;

    }
    interestData.push(interestPayment.toFixed(2));
  }


  for (let i = 0; i < loanTerm; i++) {

    loan -= yearlyLoanRepayment;

    if (loan < 0) {
      loan = 0;

    }
    loanData.push(loan.toFixed(2));
  }
  for (let i = 0; i < loanTerm; i++) {
    leftToRepay -= totalYearlyLoanRepayment;
    if (leftToRepay < 0) {
      leftToRepay = 0;
    }
    data.push(leftToRepay.toFixed(2));
  }

  generateChart(data, loanTerm, interestData, loanData);
}

// generates chart
function generateChart(data, term, interestData, loanData) {
  // Destroy previous chart instance if exists
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Generate new chart
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      // sets the x-axis labels to the term of the loan
      labels: Array.from({ length: term }, (_, i) => ` ${i + 1}`),
      datasets: [{
        label: 'Remaining Balance',
        // make chart js background red and border red 


        backgroundColor: 'rgba(0,255,0)',
        borderColor: 'rgba(0,255,0)',
        data: data
      },
      {
        label: 'Interest Payment',
        backgroundColor: 'rgba(0,0,255)',

        borderColor: 'rgba(0,0,255)',
        data: interestData // This should be another array of data for the second line
      },
      {
        label: 'Loan Payment',
        backgroundColor: 'rgba(255,0,0)',
        borderColor: 'rgb(255,0,0)', // Red
        data: loanData // This should be another array of data for the second line
      }

      ],

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

// close modal by clicking outside the area of the modal
window.onclick = function (event) {
  if (!modal.contains(event.target)) {
    modal.classList.add('hidden');
  }
}

// close modal by pressing button
document.getElementById('close-btn').addEventListener('click', function () {
  modal.classList.add('hidden');
});
