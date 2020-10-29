var net = require("net");
var Location = {
  slat: "25.2591501",
  slng: "55.294197800000006",
  elat: "25.267983737910004",
  elng: "55.32920837402344",
};

var server = net.createServer(function (socket) {
  //   console.log(socket._read.toString());
  //   socket.pipe(socket);
  socket.on("data", function (data) {
    console.log(data.toString());
    // parse data
    var query = data.toString();
    if (query.startsWith("POST /")) {
      query = query.split("sLa");
      console.log("query[0]= " + query);
      //   console.log("query[1]= " + query[1]);
      var coords = query[1].split("&");

      Location.slat = coords[0].split("=")[1];
      Location.slng = coords[1].split("=")[1];
      Location.elat = coords[2].split("=")[1];
      Location.elng = coords[3].split("=")[1];
    }
    // if post then store in location
    else if (query.startsWith("GET /")) {
      var response =
        "HTTP/1.1 200 OK\n Content-type:application/json\n\n" + Location;
        
      console.log(response);
      socket.write(response);
    }
    // if get then send location
  });
});
var port = 8089;
server.listen(port, "127.0.0.1");
