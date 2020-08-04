var Express = require("express"),
    BodyParser = require("body-parser"),
    Request = require("request"),
    fs = require('fs'),
    app = Express(),
    html = fs.readFileSync('index.html'),
    port = process.env.PORT || 3000;

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

const RECAPTCHA_SECRET = "RECAPTCHA_SECRET";

app.post("/download", function(request, response) {
    var recaptcha_url = "https://www.google.com/recaptcha/api/siteverify?";
    recaptcha_url += "secret=" + RECAPTCHA_SECRET + "&";
    recaptcha_url += "response=" + request.body["g-recaptcha-response"] + "&";
    recaptcha_url += "remoteip=" + request.connection.remoteAddress;
    Request(recaptcha_url, function(error, resp, body) {
        body = JSON.parse(body);
        if (body.success !== undefined && !body.success) {
            return response.send({ "message": "Captcha validation failed" });
        }
        response.header("Content-Type", "application/json").send('{"status" : "Success"}');
    });
});

app.get("/", function(request, response) {
    response.writeHead(200);
    response.write(html);
    response.end();
});

var server = app.listen(port, function() {
    console.log('Server running at http://127.0.0.1:' + port + '/');
});