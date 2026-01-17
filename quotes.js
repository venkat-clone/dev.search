
// import quotes from "./quotes.json" with {type: "json"}


fetch("quotes.json").then(async (value) => {
    const quote = document.getElementsByClassName('quote')[0];
    const author = document.getElementsByClassName('author')[0];
    const quotes = await value.json();

    const dateTime = new Date().getMilliseconds()
    const selectedQuote = quotes[dateTime % (quotes.length - 1)]


    quote.innerHTML = selectedQuote.text;
    author.innerHTML = `- ${selectedQuote.author}`;

})