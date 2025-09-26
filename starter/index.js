const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");
const replaceTemplate = require("./modules/replaceTemplate");


// FILES

// Blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log("File content:", textIn);
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}\n\n`;
// console.log("Writing to file:", textOut);
// fs.appendFileSync('./txt/output.txt', textOut);

// // Non-blocking, asynchronous way
// fs.readFile('./txt/input.txt', 'utf-8', (err, data) => {
//   if (err) return console.error("Error reading file:", err);
//   console.log("File content (async):", data);
// })
// console.log("Reading file...");

// Server

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");


let dataObj = JSON.parse(data);
 dataObj = dataObj.map((el) =>{
  return {
    ...el,
    productName: slugify(el.productName, { lower: true })
  };  
});

  
  





//console.log(slugify("Fresh Avocados", { lower: true }));

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);


  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%CARDS%}", cardsHtml);
    res.end(output);
  }

  // Product page
  if (pathname === "/product") {
   const product = dataObj[query.id];
     
   const output = replaceTemplate(tempProduct, product);
   res.end(output);
  }

  // API
  if (pathname === "/api") {
    res.end(data);
  }

  //  res.end('<h1>Hello from the server!</h1>');
});
server.listen(8000, "127.0.0.1", () => {
  console.log("Server is running on http://127.0.0.1:8000");
});
