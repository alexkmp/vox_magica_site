const Counter = require('../models/counter');
const APIFeatures = require('../utils/apiFeatures');
const axios = require('axios');


async function validateCaptcha(req) {
  let RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;

  let recaptcha_url = "https://www.google.com/recaptcha/api/siteverify?";
    recaptcha_url += "secret=" + RECAPTCHA_SECRET + "&";
    recaptcha_url += "response=" + req.body["g-recaptcha-response"] + "&";
    recaptcha_url += "remoteip=" + req.connection.remoteAddress;
    console.log('recaptcha_url: ', recaptcha_url);

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

exports.incCounters = async (req, res, next) => {
  let Count,
      isCaptchaValid; 
  /*
  const features = new APIFeatures(Counter.findOne(), req.query);
  const counters = await features.query;
  */
 
  let isValid = await validateCaptcha(req)
  if (isValid) {
  console.log('Captcha validation success');
  Count = await Counter.findOne().exec();
  console.log('srv-count', Count);

  let { count } = Count;
  console.log('srv-count1', count);
  count = Number.parseInt(count);
  count += 1;
  console.log('srv-count2', count);

  try {
    await Counter.findOneAndUpdate(
      { _id: Count._id },
      { $set: { count: count } },
      { upsert: true }
    );
  } catch (err) {
    res.send(500, { "message": "Something wrong happened!" });
  }

  return res.send('Succesfully saved.');
  } else {
    res.send(500, { "message": "Captcha validation failed" });
  }
};
