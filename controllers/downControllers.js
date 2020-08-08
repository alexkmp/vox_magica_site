const Counter = require('../models/counter');
const APIFeatures = require('../utils/apiFeatures');
const Request = require("request");

async function validateCaptcha(req) {
  //Запихать это все в отдельную функцию
  let RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;

  let recaptcha_url = "https://www.google.com/recaptcha/api/siteverify?";
    recaptcha_url += "secret=" + RECAPTCHA_SECRET + "&";
    recaptcha_url += "response=" + req.body["g-recaptcha-response"] + "&";
    recaptcha_url += "remoteip=" + req.connection.remoteAddress;
    console.log('recaptcha_url: ', recaptcha_url);
    Request(recaptcha_url, function(error, resp, body) {
        body = JSON.parse(body);
        if (body.success !== undefined && !body.success) {
            console.log('Captcha validation failed');
            return false;
        } else {
          console.log('Captcha validation success');
          return true;
        }
    });
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
 isCaptchaValid = await validateCaptcha(req);
 console.log('isCaptchaValid ', isCaptchaValid);

 if (isCaptchaValid == true) {
  Count = await Counter.findOne().exec();
  console.log('srv-count', Count);

  let { count } = Count;
  console.log('srv-count1', count);
  count = Number.parseInt(count);
  count += 1;
  console.log('srv-count2', count);
  /*
  Counter.findOneAndUpdate(
    { _id: Count._id },
    { $set: { count: count } },
    { upsert: true },
    function (err, doc) {
      if (err) return res.send(500, { error: err });
      return res.send('Succesfully saved.');
    }
  );
  */

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
