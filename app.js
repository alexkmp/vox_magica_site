var Express = require("express"),
    BodyParser = require("body-parser"),
    Request = require("request"),
    fs = require('fs'),
    properties = require('java-properties'),
    mongo = require('mongodb'),
    app = Express(),
    html = fs.readFileSync('index.html'),
    port = process.env.PORT || 3000,
    values = properties.of('app.properties');

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

var RECAPTCHA_SECRET = values.get('RECAPTCHA_SECRET');
var url = values.get('mongodb.url');

var MongoClient = mongo.MongoClient;
var jsonResult = { "result": "Success" };

app.post("/increment", function(request, response) {
    console.log('fileType ' + request.body.fileType);
    var fileType = request.body.fileType;
    var recaptcha_url = "https://www.google.com/recaptcha/api/siteverify?";
    recaptcha_url += "secret=" + RECAPTCHA_SECRET + "&";
    recaptcha_url += "response=" + request.body["g-recaptcha-response"] + "&";
    recaptcha_url += "remoteip=" + request.connection.remoteAddress;
    Request(recaptcha_url, function(error, resp, body) {
        body = JSON.parse(body);
        if (body.success !== undefined && !body.success) {
            return response.send({ "message": "Captcha validation failed" });
        }
        increment(fileType);
        response.header("Content-Type", "application/json").send(jsonResult);
    });
});

app.get("/", function(request, response) {
    response.writeHead(200);
    response.write(html);
    response.end();
});

/**
 * Функция инкремента, увеличивает значение счетчика для типа файла переданного в параметрах
 * Пишет в базу
 * @param тип файла
 * @returns новое значение счетчика
 */
async function increment(fileType) {
    let client, db, cnt;
    try {
        client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        db = client.db("mydb");
        let dCollection = db.collection('counts');
        let result = await dCollection.findOne({ type: fileType });
        console.log(result);
        if (result == null) {
            cnt = 1;
            result = await dCollection.insertOne({ type: fileType, count: 1 });
        } else {
            cnt = result.count + 1;
            result = await dCollection.updateOne({ type: fileType }, { $set: { "count": cnt } });
        }
        console.log('count ' + cnt);
        return cnt;
    } catch (err) { console.error(err); } finally { client.close(); }
}

var server = app.listen(port, function() {
    console.log('Server running at http://127.0.0.1:' + port + '/');
});