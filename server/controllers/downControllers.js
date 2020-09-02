const Counter = require('../models/counter');
const APIFeatures = require('../features/apiFeatures');
const axios = require('axios');
const fs = require('fs')

async function downdoad(response) {
  let readStream, stat;
  readStream = fs.createReadStream('/home/vox/Git/vox_magica_site/server/download/test.txt');
  stat = fs.statSync('/home/vox/Git/vox_magica_site/server/download/test.txt');

  response.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-Length': stat.size
  });
  readStream.pipe(response);
}

async function validateCaptcha(request) {
  let RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;

  let recaptcha_url = "https://www.google.com/recaptcha/api/siteverify?";
    recaptcha_url += "secret=" + RECAPTCHA_SECRET + "&";
    recaptcha_url += "response=" + request.body["g-recaptcha-response"] + "&";
    recaptcha_url += "remoteip=" + request.connection.remoteAddress;
    console.log(`recaptcha_url: ${recaptcha_url}`);

    let result = await (async () => {
      try {
        const response = await axios.get(recaptcha_url)
        return response.data.success == true ? true : false;
      } catch (error) {
        console.log(error.response.body);
      }
    })();

    return result;
}

exports.getCounters = async (req, res, next) => {
  const features = new APIFeatures(Counter.find(), req.query);
  const counters = await features.query;

  res.status(200).json({
    status: 'success',
    data: {
      counters,
    },
  });
};

exports.incCounters = async (request, response, next) => {
  let Count,
      isCaptchaValid;
  let {file_type} = request.body;     
  console.log(`file_type: ${file_type}`)
  isCaptchaValid = await validateCaptcha(request)
  if (isCaptchaValid) {
    console.log('Captcha validation success');
    Count = await Counter.findOne().exec();
    let { count } = Count;
    console.log(`current count: ${count}`);
    count = Number.parseInt(count);
    count += 1;
    console.log(`new count: ${count}`);

    try {
      await Counter.findOneAndUpdate(
        { _id: Count._id },
        { $set: { count: count } },
        { upsert: true }
      );
    } catch (err) {
      response.send(500, { "message": "Something wrong happened!" });
    }
    //downdoad(response);
    return response.send('Succesfully saved.');
  } else {
    response.send(500, { "message": "Captcha validation failed" });
  }
};
