var table = document.getElementById("table");

document.querySelector("form").addEventListener("submit", function(e) {
    e.preventDefault();

let principal = document.getElementById("principal").value;
  let downPayment = document.getElementById("downPayment").value;
  let interestRate = document.getElementById("interestRate").value * 0.01;
  let loanTerm = document.getElementById("loanTerm").value;
  let loanTermMonth = loanTerm * 12;
  let loan = principal - downPayment;

  var monthlyInterestRate = interestRate/12;
  var monthlyPayment = loan * (monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -loanTermMonth));
  var total = monthlyPayment * loanTermMonth;


  generateTable(loanTermMonth, monthlyPayment, total);
});

function generateTable(loanTermMonth, monthlyPayment, total){
  var leftToRepay = total;
    for (let i = 0; i < loanTermMonth; i++){
      // console.log(i)

      leftToRepay = (leftToRepay - monthlyPayment).toFixed(2);
      console.log(leftToRepay, monthlyPayment.toFixed(2), i);
      if (leftToRepay < 0) {
        leftToRepay = 0;
      }
      table.innerHTML += `<tr> <td>${i + 1}</td> <td>${leftToRepay}</td> <td>${monthlyPayment.toFixed(2)}</td>  </tr>`;
    }

  }
