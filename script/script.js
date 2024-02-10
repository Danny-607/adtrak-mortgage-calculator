var table = document.getElementById("table");

document.querySelector("form").addEventListener("submit", function(e) {
  e.preventDefault();
  let principal = document.getElementById("principal").value;
  let downPayment = document.getElementById("downPayment").value;
  let interestRate = document.getElementById("interestRate").value * 0.01;
  let loanTerm = document.getElementById("loanTerm").value;
  let loanTermMonth = loanTerm * 12;
  let loan = principal - downPayment;


  let monthlyInterestRate = interestRate/12;
  let monthlyPayment = loan * (monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -loanTermMonth));
  let total = monthlyPayment * loanTermMonth;
  let interestPayment = total - loan

  generateTable(loanTermMonth, monthlyPayment, total, interestPayment,loan);
});

function generateTable(loanTermMonth, monthlyPayment, total, interestPayment,loan){
  let leftToRepay = total;
  let tableRows = "";
  let monthlyInterestRepayment = interestPayment / loanTermMonth
  let monthlyLoanRepayment = loan / loanTermMonth
  console.log(monthlyInterestRepayment.toFixed(2),monthlyLoanRepayment.toFixed(2))
  for (let i = 0; i < loanTermMonth; i++){

    leftToRepay -= monthlyPayment;

    if (leftToRepay < 0) {
      leftToRepay = 0;

    }

    tableRows += `<tr> <td>${i + 1}</td> <td>${leftToRepay.toFixed(2)}</td> <td>${monthlyLoanRepayment.toFixed(2)}</td> <td>${monthlyInterestRepayment.toFixed(2)}</td> <td>${monthlyPayment.toFixed(2)}</td> </tr>`;
  }

  table.innerHTML = `<tr> <th>Month</th> <th>Remaining Loan</th> <th>Principal Repayment</th> <th>Interest Payment</th> <th>Total Monthly Payment</th> </tr>` + tableRows;
}