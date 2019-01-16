// VARIABLE DECLARATION
const LANDING_PAGE = document.getElementById("landing-page");
const MOBILE_MENU_TOGGLES = document.getElementsByClassName("mobile-menu-toggle");
const MOBILE_MENU_OVERLAY = document.getElementById("mobile-menu-overlay");
const MOBILE_MENU_CLOSE = document.getElementById("mobile-menu-close");
const NAVBAR_LINKS = document.getElementById("navbar-links");
const DROP_LINK = document.getElementsByClassName("drop-down-link");
const DROP_LINK_CONTENT = document.getElementsByClassName("drop-link-content");
const MAIN_TABS = document.getElementsByClassName("money-tab");
const TAB_CONTENTS = document.getElementsByClassName("tab-contents");
const FEE_BREAKDOWN_GRID = document.getElementById("fee-breakdown-grid");
const FEE_DETAILS = document.getElementsByClassName("fee-details");
const CURRENCY_BUTTONS = document.getElementsByClassName("currency-select");
const OUT_CURRENCY = document.getElementById("output-currency-select");
const OUTPUT_CONT = document.getElementById("receive-money-output-box");
const OUTPUT_VALUE = document.getElementById("output-value");
const RECEIVE_TEXT = document.getElementById("receive-text");
const INSUFF_ERROR = document.getElementById("insufficient-amount-error");
const INSUFF_TEXT = document.getElementById("insufficient-amount-error-text");
const ARRIVAL_TIME = document.getElementById("arrival-time");

const BASE_CHARGE = 0.8;
const MONTH = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const EXCHANGE_RATES = {
  EUR: 1,
  GBP: 0.90032,
  USD: 1.14541,
  INR: 80.3551
};

let isFeeDetailVisible = false;
let isMenuVisible = false;
let menuType = "";
let transferSpeed = 0.005;




// FUNCTIONS

function menuTypeQuery() {
  menuType = window.innerWidth >= 711 ? "laptop" : "mobile";
  adjustMenuFormat();
  setToggleType();
  closeDropLinks();
}

function toggleMobileMenu() {
  isMenuVisible = !isMenuVisible;
  adjustMenuFormat();
}

function adjustMenuFormat() {
  if (menuType === "mobile") {
    if (isMenuVisible === false) {
      NAVBAR_LINKS.style.display = "none";
      LANDING_PAGE.style.opacity = "1";
      MOBILE_MENU_OVERLAY.style.display = "none";
      MOBILE_MENU_OVERLAY.style.opacity = "0";
      MOBILE_MENU_CLOSE.style.display = "none";
    } else {
      NAVBAR_LINKS.style.display = "inline-block";
      LANDING_PAGE.style.opacity = "0.4";
      MOBILE_MENU_OVERLAY.style.display = "block";
      MOBILE_MENU_OVERLAY.style.opacity = "0.5";
      MOBILE_MENU_CLOSE.style.display = "block";
    }
  } else {
    NAVBAR_LINKS.style.display = "inline-block";
  }
}

function openDropLink() {
  closeDropLinks();
  this.children.item(1).style.display = "block";
  if (menuType === "mobile") {
    this.style.color = "var(--logocol)";
  }
}

function closeDropLinks() {
  [...DROP_LINK_CONTENT].map(content => content.style.display = "none");
  [...DROP_LINK].map(link => link.style.color =
                     menuType === "mobile" ? "var(--bgcol)" : "white");
}

function openTab() {
  [...MAIN_TABS].map(tab => tab.classList.remove("selected-tab"));
  [...TAB_CONTENTS].map(content => content.style.display = "none");
  document.getElementById(`${this.id}-content`).style.display = "block";
  this.classList.add("selected-tab");
};

function calculateFee(val) {
  return (BASE_CHARGE + (val - BASE_CHARGE) * transferSpeed).toFixed(2);
}

function calculateConvertValue(val) {
  return (val - calculateFee(val)).toFixed(2);
}

function getSendCurrency() {
  return document.getElementById("input-currency-select").value; 
}

function getReceiveCurrency() {
  return document.getElementById("output-currency-select").value;
}

function getExchangeRate() {
  return (EXCHANGE_RATES[getReceiveCurrency()]/EXCHANGE_RATES[getSendCurrency()]).toFixed(5);
}

function calculateReceiveValue(val) {
  return (calculateConvertValue(val) * getExchangeRate()).toFixed(2);
}

// Random savings of 4.7% for demo
function calculateSavings(val) {
  return (calculateConvertValue(val) * 0.047).toFixed(2);
}

// Update the DOM with newly-calculated values
function renderNewValues(input) {
  if (isThereAnError(input) || isInputInvalid(input)) { return };
    
  document.getElementById("fee-value").innerHTML =
    `-${calculateFee(input)} ${getSendCurrency()}`;
  
  document.getElementById("amount-to-convert").innerHTML =
    `${calculateConvertValue(input)} ${getSendCurrency()}`;
  
  document.getElementById("exchange-rate").innerHTML =
    getExchangeRate();
  
  document.getElementById("total-savings").innerHTML =
    `${calculateSavings(input)} ${getSendCurrency()}`;
  
  OUTPUT_VALUE.value = calculateReceiveValue(input);
}

function isThereAnError(val) {
  if (val <= 0.8) {
    OUTPUT_VALUE.value = "0.00";
    INSUFF_ERROR.style.display = "block";
    INSUFF_TEXT.innerHTML = `Please enter an amount more than 0.01 ${getReceiveCurrency()}`;
    OUTPUT_CONT.classList.add("cash-value-box-error");
    OUT_CURRENCY.style.height = "70%";
    OUT_CURRENCY.style.borderRadius = "0 3px 0 0";
    RECEIVE_TEXT.style.color = "#C73B3B";
    return true;
  } else {
    INSUFF_ERROR.style.display = "none";
    RECEIVE_TEXT.style.color = "var(--shapecol)";
    OUTPUT_CONT.classList.remove("cash-value-box-error");
    OUT_CURRENCY.style.height = "initial";
    OUT_CURRENCY.style.borderRadius = "0 3px 3px 0";
    return false;
  }
}

function isInputInvalid(input) {
  if (input.match(/(?=\D)(?!\.)/) || input.match(/\.(.{3}|.*\.)/)) {
    document.getElementById("output-value").value = "0.00";
    return true;
  }
}

function resetInput(val) {
  document.getElementById("input-value").placeholder = "1,000";
  getInput();
}

function getInput() {
  const INPUT_VALUE = document.getElementById("input-value").value || "1000";
  renderNewValues(INPUT_VALUE);
}

function toggleFeeBreakdown() {
  isFeeDetailVisible = !isFeeDetailVisible;
  showFees();
}

function showFees() {
  if (isFeeDetailVisible === true) {
    FEE_BREAKDOWN_GRID.style.gridTemplateRows = "30px 30px 30px";
    [...FEE_DETAILS].map(cell => cell.style.visibility = "visible");
  } else {
    FEE_BREAKDOWN_GRID.style.gridTemplateRows = "30px 0px 30px";
    [...FEE_DETAILS].map(cell => cell.style.visibility = "hidden");
  }
}

function setArrivalTime() {
  if (this.value === "fast-easy-transfer") {
    transferSpeed = 0.005;
    ARRIVAL_TIME.innerHTML = "in seconds!";
  } else {
    transferSpeed = 0.003;
    ARRIVAL_TIME.innerHTML = `by ${(new Date().getDate() + 1)} ${MONTH[new Date().getMonth()]}`;
    // TO-DO: Must check if date works at end of month/year (potential bug for 30 Jan >> 31 Jan >> 1 Jan >> 2 Feb)
  }
  renderNewValues();
}

// EVENT LISTENERS OR FUNCTIONS? Hmm...
// Determine the correct event and assign event listener to drop links
function setToggleType() {
  [...DROP_LINK].map(droplink => determineToggleType(droplink));
}

// Determine whether drop links open on click(mobile) or hover(laptop)
function determineToggleType(droplink) {
  if (menuType === "mobile") {
    droplink.addEventListener("click", openDropLink);
    droplink.removeEventListener("mouseover", openDropLink);
    droplink.removeEventListener("mouseout", closeDropLinks);
  } else {
    droplink.addEventListener("mouseover", openDropLink);
    droplink.addEventListener("mouseout", closeDropLinks);
  }
}




// EVENT LISTENERS

window.addEventListener("resize", menuTypeQuery);

[...CURRENCY_BUTTONS].map(button => button.addEventListener("change", getInput));

document.getElementById("transfer-speed").addEventListener("change", setArrivalTime);

document.getElementById("show-fee-button").addEventListener("click", toggleFeeBreakdown);

[...MAIN_TABS].map(tab => tab.addEventListener("click", openTab));

[...MOBILE_MENU_TOGGLES].map(function(toggle) {
  toggle.addEventListener("click", toggleMobileMenu);
  toggle.addEventListener("click", closeDropLinks);
});




// WINDOW.ONLOAD/PAGE SETUP
window.onload = function() {
  resetInput();
  menuTypeQuery();
}

// NEXT FEATURE: Reverse calculation, so user input's receive value and is told how much to send

// NEXT FEATURE: No outline on click, outline only on lastkey=tab

// NEXT FEATURE: Check on date setup (does date rollover months correctly?)
