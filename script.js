const main = document.getElementById("main");
const quoteBox = document.getElementById("quote-box");
const quoteShow = document.getElementById("quote-show");
const quoteAuthor = document.getElementById("quote-author");
const newQuoteBtn = document.getElementById("new-quote-btn");
const copyQuoteBtn = document.getElementById("copy-quote-btn");
const shareBtn = document.getElementById("share-btn");
const exportBtn = document.getElementById("export-btn");

// create a div element referance for show popup copied quote
const divElement = document.createElement("div");

// API Endpoint
const url = "https://api.freeapi.app/api/v1/public/quotes/quote/random";

// store api response data
let responseData = null;

// get data from api
const getData = async () => {
  try {
    const response = await fetch(url);
    responseData = await response.json();
    // console.log(responseData);
  } catch (error) {
    console.error("Error:", error.message);
  }
};

// function define for display quote
const displayQuote = async () => {
  await getData();

  // set link for share quote on twitter
  const a = document.createElement("a");

  // generate link for twitter share
  let generateLink = `https://twitter.com/intent/tweet?text=${responseData.data.content.replaceAll(
    " ",
    "%20"
  )}%20(%20Author%20:%20${responseData.data.author.replaceAll(" ", "%20")}%20)`;

  // check and remove previous twitter link
  if (shareBtn.childNodes) {
    shareBtn.removeChild(shareBtn.firstChild);
  }
  a.setAttribute("href", generateLink);
  a.setAttribute("target", "_blank");
  a.innerText = "Share on Twitter";
  shareBtn.appendChild(a);

  // display quote and author on web page
  quoteShow.innerText = responseData.data.content;
  quoteAuthor.innerHTML = `<span>Author : </span>${responseData.data.author}`;

  // random background image change
  const randomNumber = Math.floor(Math.random() * 10) + 1;
  main.style.backgroundImage = `url(./images/${randomNumber}.jpg)`;
  quoteBox.style.backgroundImage = `url(./images/${randomNumber}.jpg)`;
};

// function define for copy quote in clipboard
const copyQuote = () => {
  divElement.classList.add("copied-popup");
  divElement.style.display = "block";
  navigator.clipboard
    .writeText(responseData.data.content)
    .then(() => {
      // create a div element for show popup copied quote
      divElement.innerHTML = `<span> copied Quote! </span> ${responseData.data.content} <img id="cross-popup" src="./images/close.png" alt="">`;
    })
    .catch((err) => {
      divElement.innerText = err.message;
    });

  // remove popup automatic after 5sec
  setTimeout(() => {
    divElement.style.display = "none";
  }, 5 * 1000);

  main.appendChild(divElement);

  // remove popup when click on cross icon
  const crossPopup = document.getElementById("cross-popup");
  crossPopup.addEventListener("click", () => {
    divElement.style.display = "none";
  });
};

// function define for take screenshot of quote
const getScreenshot = () => {
  html2canvas(quoteBox).then(function (c) {
    const url = c.toDataURL();
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", url);
    linkElement.setAttribute("download", "quote.jpg");
    linkElement.click();
    linkElement.remove();
  });
};

// addEventListener implementation
newQuoteBtn.addEventListener("click", displayQuote);
copyQuoteBtn.addEventListener("click", copyQuote);
exportBtn.addEventListener("click", getScreenshot);

// dispalyQuote call when page load
displayQuote();
