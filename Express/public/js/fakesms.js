const token = " 25653:17341f39f5a7697043271ee083b04897";

var postObj = {
    sender_id: 'Jeff',
    text: 'Kauf bei Amazon',
    service_code: 'direct',
    phone: '+4915112903256',
    delivery_at: 15,
    is_unicode: true,
    callback_data: "123456",
    voice_lang: "DE"
};

var postdata = JSON.stringify(postObj);
exports.postd = postdata

const https = require('https');
const options = {
    hostname: 'api.lox24.eu',
    path: '/sms',
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': postdata.length,
        'X-LOX24-AUTH-TOKEN': token
    }
}

const req = https.request(options, res => {
    if (res.statusCode == 201) {
        console.log("Success: code = 201 - sms resource created");
        res.on('data', d => { process.stdout.write(d) })
    }
    else if (res.statusCode == 400) console.log("Error: code = 400 - Invalid input");
    else if (res.statusCode == 401) console.log("Error: code = 401 - Client ID or API key isn't active or invalid!");
    else if (res.statusCode == 402) console.log("Error: code = 402 - There are not enough funds on your account!");
    else if (res.statusCode == 403) console.log("Error: code = 403 - Account isn't activated. Please wait or contact to support!");
})
exports.reque = req
req.on('error', error => {
    console.error(error)
})
req.write(postdata);
req.end();