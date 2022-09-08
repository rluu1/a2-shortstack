const http = require("http"),
  fs = require("fs"),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library used in the following line of code
  mime = require("mime"),
  dir = "public/",
  port = 3000;

const appdata = [
  {
    name: "Chris",
    date: "09/07/2022",
    subject: "Math",
    assignment: "Assignment 1",
  },
];

const server = http.createServer(function (request, response) {
  if (request.method === "GET") {
    handleGet(request, response);
  } else if (request.method === "POST") {
    handlePost(request, response);
  }
});

const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1);

  if (request.url === "/") {
    sendFile(response, "public/index.html");
  } else if (request.url === "/getFormData"){
    response.writeHeader(200, {"Content-Type": "text/plain"});
    response.end(JSON.stringify(appdata));
  } else {
    const html =
      /*`
    <html>
    <body>
      ${ appdata.map( item => JSON.stringify(item) ) } 
    </body>
    </html>
    `
    response.end( html )*/
      sendFile(response, filename);
  }
};

const handlePost = function (request, response) {
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    console.log(JSON.parse(dataString));
    let newInfoData = JSON.parse(dataString);
    // ... do something with the data here!!!
    if(request.url === "/submit"){
      console.log("New INFO DATA: ", newInfoData);
      appdata.push(newInfoData);
    }
      response.writeHead(200, "OK", { "Content-Type": "text/plain" });
      response.end(JSON.stringify(appdata));
    
});
}

const sendFile = function (response, filename) {
  const type = mime.getType(filename);

  fs.readFile(filename, function (err, content) {
    // if the error = null, then we've loaded the file successfully
    if (err === null) {
      // status code: https://httpstatuses.com
      response.writeHeader(200, { "Content-Type": type });
      response.end(content);
    } else {
      // file not found, error code 404
      response.writeHeader(404);
      response.end("404 Error: File Not Found");
    }
  });
};

server.listen(process.env.PORT || port);