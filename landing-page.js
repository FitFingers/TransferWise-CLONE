// Variable declaration
let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let details = document.getElementsByClassName("feeDetails");
let transferSpeed = document.getElementById("transferSpeed").value;
let inCurr = document.getElementById("inCurr").value;
let recCurr = document.getElementById("recCurr").value;
let exRate = {
  EUR: 1,
  GBP: 0.90032,
  USD: 1.14541,
  INR: 80.35510
};
let inputValue = "1000";
let fee = (0.8 + (inputValue - 0.8) * transferSpeed).toFixed(2);
let convertValue = (inputValue - fee).toFixed(2);

// Page load variable declaration
// TO-DO: Condense this code- run calc(inputValue) instead
document.body.onload = function() {
  document.getElementById("inputValue").placeholder = "1,000";
  document.getElementById("fee").innerHTML = "-" + fee + " " + inCurr;
  document.getElementById("convert").innerHTML = convertValue + " " + inCurr;
  document.getElementById("exRate").innerHTML = exchange(exRate[inCurr], exRate[recCurr]);
  var outputValue = (convertValue * exchange(exRate[inCurr], exRate[recCurr])).toFixed(2);
  document.getElementById("outputValue").placeholder = outputValue;
  document.getElementById("outputValue").setAttribute("onblur", "this.placeholder='" + outputValue + "'");
  document.getElementById("saveValue").innerHTML = ((inputValue - fee) * 0.047).toFixed(2) + " " + inCurr;
}

// Fee breakdown toggle switch
document.getElementById("feeButton").addEventListener("click", function() {
  if (details[0].style.visibility == "hidden") {
    document.getElementById("newCalcGrid").style.gridTemplateRows = "30px 30px 30px";
    for (let i = 0; i < details.length; i++) {
      details[i].style.visibility = "visible";
    }
  } else {
    document.getElementById("newCalcGrid").style.gridTemplateRows = "30px 0px 30px";
    for (let i = 0; i < details.length; i++) {
      details[i].style.visibility = "hidden";
    }
  }
});

// Determine the exchange rate
function exchange(sc, rc) {
  return rc/sc;
}

// Calculate received value
function calc(val) {
  let inCurr = document.getElementById("inCurr").value;
  let recCurr = document.getElementById("recCurr").value;
  // Prevent NaN result (no calc on invalid input)
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
    document.getElementById("insuffFundsText").innerHTML = "Please enter an amount more than 0.01 " + recCurr;
  } else {
    // Reset "minimum value" error styling to initial
    document.getElementById("insuffFunds").style.display = "none";
    document.getElementById("receiveValue").style.border = "initial";
    document.getElementById("receiveText").style.color = "var(--shapecol)";
    document.getElementById("recCurr").style.height = "initial";
    document.getElementById("recCurr").style.borderRadius = "0 3px 3px 0";
    
    // Actual calculations for received value
    inputValue = val;
    fee = (0.8 + (inputValue - 0.8) * transferSpeed).toFixed(2);
    convertValue = (val - fee).toFixed(2);
    outputValue = (convertValue * exchange(exRate[inCurr], exRate[recCurr])).toFixed(2);
    document.getElementById("fee").innerHTML = "-" + fee + " " + inCurr;
    document.getElementById("convert").innerHTML = convertValue + " " + inCurr;
  document.getElementById("exRate").innerHTML = exchange(exRate[inCurr], exRate[recCurr]).toFixed(5);
    document.getElementById("outputValue").value = outputValue;
    document.getElementById("saveValue").innerHTML = (convertValue * 0.047).toFixed(2) + " " + inCurr;
  }
}

// Set input to default (1,000) when left blank
function resetInput(val) {
  document.getElementById("inputValue").placeholder='1,000';
  val == "" ? inputValue = "1000" : inputValue = val;
  calc(inputValue);
}

// Update calculator and details after dropbox change
document.getElementById("transferSpeed").addEventListener("change", function() {
  transferSpeed = this.value;
  if (this.value == 0.005) {
    document.getElementById("speedText").innerHTML = "in seconds!";
  } else {
    // Must check if date works at end of month/year (potential bug for 31 Jan >> 1 Jan >> 2 Feb)
    document.getElementById("speedText").innerHTML = "by " + (new Date().getDate()+1) + " " + month[new Date().getMonth()];
  }
  calc(inputValue);
});

// Run calc after changing currency dropbox
let currButts = document.getElementsByClassName("currButton");
for (let i = 0; i < currButts.length; i++) {
  currButts[i].addEventListener("change", function(){calc(inputValue)});
}
