const Counter = require('../models/counter');
const APIFeatures = require('../features/apiFeatures');
const axios = require('axios');


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
 
  isCaptchaValid = await validateCaptcha(request)
  if (isCaptchaValid) {
    console.log('Captcha validation success');
    Count = await Counter.findOne().exec();
    console.log(`Count query: ${Count}`);

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
    return response.send('Succesfully saved.');
  } else {
    response.send(500, { "message": "Captcha validation failed" });
  }
};
