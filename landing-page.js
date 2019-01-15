// Variable declaration
let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let details = document.getElementsByClassName("feeDetails");
let transferSpeed = document.getElementById("transferSpeed").value;
let exRate = {
  EUR: 1,
  GBP: 0.90032,
  USD: 1.14541,
  INR: 80.3551
};
let inputValue = "1000";
let fee = (0.8 + (inputValue - 0.8) * transferSpeed).toFixed(2);
let convertValue = (inputValue - fee).toFixed(2);

// Page load variable declaration
document.body.onload = function() {
  document.getElementById("inputValue").placeholder = "1,000";
  document.getElementById("fee").innerHTML = "-" + fee + " " + document.getElementById("inCurr").value;
  document.getElementById("convert").innerHTML = convertValue + " " + document.getElementById("inCurr").value;
  document.getElementById("exRate").innerHTML = exRate.toFixed(5);
  var outputValue = (convertValue * exRate).toFixed(2);
  document.getElementById("outputValue").placeholder = outputValue;
  document.getElementById("outputValue").setAttribute("onblur", "this.placeholder='" + outputValue + "'");
  document.getElementById("saveValue").innerHTML = ((inputValue - fee) * 0.047).toFixed(2) + " " + document.getElementById("inCurr").value;
}

// Fee details toggle switch
document.getElementById("feeButton").addEventListener("click", function() {
  if (details[0].style.visibility == "hidden") {
    for (let i = 0; i < details.length; i++) {
      details[i].style.visibility = "visible";
    }
    document.getElementById("newCalcGrid").style.gridTemplateRows = "30px 30px 30px";
  } else {
    for (let i = 0; i < details.length; i++) {
      details[i].style.visibility = "hidden";
    }
    document.getElementById("newCalcGrid").style.gridTemplateRows = "30px 0px 30px";
  }
});

// Calculate received value
function calc(val) {
  // Prevent NaN result
  if (val.match(/(?=\D)(?![,.])/)) {
    return;
  }
  // Throw "minimum value required" error
  if (val <= 0.8) {
    document.getElementById("insuffFunds").style.display = "block";
    document.getElementById("receiveValue").style.border = "thin solid #C73B3B";
    document.getElementById("receiveText").style.color = "#C73B3B";
    document.getElementById("recCurr").style.height = "70%";
    document.getElementById("recCurr").style.borderRadius = "0 3px 0 0";
    document.getElementById("insuffFundsText").innerHTML = "Please enter an amount more than 0.01 " + recCurr.value;
  } else {
    // Error reset to initial
    document.getElementById("insuffFunds").style.display = "none";
    document.getElementById("receiveValue").style.border = "initial";
    document.getElementById("receiveText").style.color = "var(--shapecol)";
    document.getElementById("recCurr").style.height = "initial";
    document.getElementById("recCurr").style.borderRadius = "0 3px 3px 0";
    
    // Actual calculations
    inputValue = val;
    fee = (0.8 + (inputValue - 0.8) * transferSpeed).toFixed(2);
    convertValue = (val - fee).toFixed(2);
    outputValue = (convertValue * exRate).toFixed(2);
    document.getElementById("fee").innerHTML = "-" + fee + " " + document.getElementById("inCurr").value;
    document.getElementById("convert").innerHTML = convertValue + " " + document.getElementById("inCurr").value;
    document.getElementById("outputValue").value = outputValue;
    document.getElementById("saveValue").innerHTML = (convertValue * 0.047).toFixed(2) + " " + document.getElementById("inCurr").value;
  }
}

// Set input to default (1,000) when blank
function resetInput(val) {
  document.getElementById("inputValue").placeholder='1,000';
  val == "" ? inputValue = "1000" : inputValue = val;
  calc(inputValue);
}

// Update transfer speed and fee
document.getElementById("transferSpeed").addEventListener("change", function() {
  transferSpeed = this.value;
  if (this.value == 0.005) {
    document.getElementById("speedText").innerHTML = "in seconds!";
  } else {
    document.getElementById("speedText").innerHTML = "by " + (new Date().getDate()+1) + " " + month[new Date().getMonth()];
  }
  calc(inputValue);
});

// Run calc after changing currency
let buttons = document.getElementsByClassName("currButton");
for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("change", function(){calc(inputValue)});
}
