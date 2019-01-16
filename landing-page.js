// Variable declaration
let month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
let detVis = false;
let mobMenVis = false;
let inputValue = "1000";
let exRate = {
  EUR: 1,
  GBP: 0.90032,
  USD: 1.14541,
  INR: 80.3551
};

// Page load variable declaration and event handlers
window.onload = function() {
  let transferSpeed = document.getElementById("transferSpeed").value;
  let inCurr = document.getElementById("inCurr").value;
  let recCurr = document.getElementById("recCurr").value;
  document.getElementById("inputValue").placeholder = "1,000";
  calc(inputValue);

  // Fee breakdown toggle switch
  document.getElementById("feeButton").addEventListener("click", function toggleFees() {
    let details = document.getElementsByClassName("feeDetails");
    if (detVis == false) {
      detVis = true;
      document.getElementById("newCalcGrid").style.gridTemplateRows =
        "30px 30px 30px";
      for (let i = 0; i < details.length; i++) {
        details[i].style.visibility = "visible";
      }
    } else {
      detVis = false;
      document.getElementById("newCalcGrid").style.gridTemplateRows =
        "30px 0px 30px";
      for (let i = 0; i < details.length; i++) {
        details[i].style.visibility = "hidden";
      }
    }
  });

  // Update calculator and details after dropbox change
  document.getElementById("transferSpeed").addEventListener("change", function() {
    transferSpeed = this.value;
    if (this.value == 0.005) {
      document.getElementById("speedText").innerHTML = "in seconds!";
    } else {
      // TO-DO: Must check if date works at end of month/year (potential bug for 30 Jan >> 31 Jan >> 1 Jan >> 2 Feb)
      document.getElementById("speedText").innerHTML = "by " + (new Date().getDate() + 1) + " " + month[new Date().getMonth()];
    }
    calc(inputValue);
  });

  // Run calc after changing currency dropbox
  let currButts = document.getElementsByClassName("currButton");
  for (let i = 0; i < currButts.length; i++) {
    currButts[i].addEventListener("change", function() {
      calc(inputValue);
    });
  }

  // Switch between Send, Receive and Debit tabs
  let tabGroup = document.getElementsByClassName("tab");
  for (let i = 0; i < tabGroup.length; i++) {
    tabGroup[i].addEventListener("click", function() {
      for (let i = 0; i < tabGroup.length; i++) {
        document.getElementById(tabGroup[i].id + "Content").style.display = "none";
        document.getElementById(tabGroup[i].id).classList.remove("selectedTab");
      }
      document.getElementById(this.id + "Content").style.display = "block";
      this.classList.add("selectedTab");
    });
  }
  
  // Open/close mobile menu
  let mobMenTogs = document.getElementsByClassName("mobMenTog");
  for (let i = 0; i < mobMenTogs.length; i++) {
    mobMenTogs[i].addEventListener("click", function(){
      if (mobMenVis == false){
        mobMenVis = true;
        document.getElementById("navLinks").style.display = "inline-block";
        document.getElementById("heroPage").style.opacity = "0.4";
        document.getElementById("overlay").style.display = "block";
        document.getElementById("overlay").style.opacity = "0.5";
        document.getElementById("mobMenClose").style.display = "block";

      } else {
        mobMenVis = false;
        document.getElementById("navLinks").style.display = "none";
        document.getElementById("heroPage").style.opacity = "1";
        document.getElementById("overlay").style.display = "none";
        document.getElementById("overlay").style.opacity = "0";
        document.getElementById("mobMenClose").style.display = "none";
        
        // This loop hides all drop link contents after exiting the mobile menu, but they then can't be used
        for (let i = 0; i < document.getElementsByClassName("dropLink").length; i++) {
          document.getElementsByClassName("dropLinkContent")[i].style.display = "none";
        }
      }
    });
  }
  
  // Open mobile dropLink content on click
  let dropLinks = document.getElementsByClassName("dropLink");
  for (let i = 0; i < dropLinks.length; i++) {
    dropLinks[i].addEventListener("click", function() {
      for (let i = 0; i < dropLinks.length; i++) {
        document.getElementsByClassName("dropLinkContent")[i].style.display = "none";
        dropLinks[i].style.color = "var(--bgcol)";
      }
      this.getElementsByClassName("dropLinkContent")[0].style.display = "block";
      this.style.color = "var(--logocol)";
    });
  }
  
  // Reset navbar after window resizes
  window.addEventListener("resize", function() {
    let whiteLinks = document.getElementsByTagName("li");
    if (window.innerWidth > 710) {
      document.getElementById("navLinks").style.display = "inline-block";
      for (let i = 0; i < whiteLinks.length; i++) {
        whiteLinks[i].style.color = "white";
      }
    } else {
      document.getElementById("navLinks").style.display = "none";
      for (let i = 0; i < whiteLinks.length; i++) {
        whiteLinks[i].style.color = "var(--bgcol)";
      }
    }
  });

};

// Determine the exchange rate
function exchange(sc, rc) {
  return rc / sc;
}

// Calculate received value
function calc(val) {
  // Variables required for function
  let inCurr = document.getElementById("inCurr").value;
  let recCurr = document.getElementById("recCurr").value;
  let inputValue = val;
  let transferSpeed = document.getElementById("transferSpeed").value;
  let fee = (0.8 + (inputValue - 0.8) * transferSpeed).toFixed(2);
  let convertValue = (val - fee).toFixed(2);
  let outputValue = (
    convertValue * exchange(exRate[inCurr], exRate[recCurr])
  ).toFixed(2);
  
  // Prevent NaN result (no calc on invalid input)
  if (val.match(/(?=\D)(?!\.)/) || val.match(/\.(.{3}|.*\.)/)) {
    document.getElementById("outputValue").value = "0.00";
    return;
  }
  // Throw "minimum value required" error
  if (val <= 0.8) {
    document.getElementById("outputValue").value = "0.00";
    document.getElementById("insuffFunds").style.display = "block";
    document.getElementById("receiveValue").classList.add("cashBoxError");
    document.getElementById("receiveText").style.color = "#C73B3B";
    document.getElementById("recCurr").style.height = "70%";
    document.getElementById("recCurr").style.borderRadius = "0 3px 0 0";
    document.getElementById("insuffFundsText").innerHTML =
      "Please enter an amount more than 0.01 " + recCurr;
  } else {
    // Reset "minimum value" error styling to initial
    document.getElementById("insuffFunds").style.display = "none";
    document.getElementById("receiveValue").classList.remove("cashBoxError");
    document.getElementById("receiveText").style.color = "var(--shapecol)";
    document.getElementById("recCurr").style.height = "initial";
    document.getElementById("recCurr").style.borderRadius = "0 3px 3px 0";

    // Actual calculations for received value
    document.getElementById("fee").innerHTML = "-" + fee + " " + inCurr;
    document.getElementById("convert").innerHTML = convertValue + " " + inCurr;
    document.getElementById("exRate").innerHTML = exchange(exRate[inCurr],exRate[recCurr]).toFixed(5);
    document.getElementById("outputValue").value = outputValue;
    document.getElementById("saveValue").innerHTML =
      (convertValue * 0.047).toFixed(2) + " " + inCurr;
  }
}

// Set input to default (1,000) when left blank
function resetInput(val) {
  document.getElementById("inputValue").placeholder = "1,000";
  val == "" ? (inputValue = "1000") : (inputValue = val);
  calc(inputValue);
}
