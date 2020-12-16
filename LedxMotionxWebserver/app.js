const express = require('express'); 
const app = express();
const port = 4000;
const path = require('path');
const { sendMail } = require('./reportSender');
const cron = require('node-cron');
const os = require( 'os' );
const networkInterfaces = os.networkInterfaces( );
const linkLocal = networkInterfaces['wlan0'][0]['address'] ;

const gpio = require('onoff').Gpio;
const pir = new gpio(18, 'in', 'both');
const led = new gpio(26, 'out');
let mode = 0;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    res.render('index',{status:"Press Button To change Status of Led !!"});
});
app.post("/led/on", (req, res) => {
    led.writeSync(1, (err) => {
        if (err) throw err;
        console.log('Written True to pin '+ led);
        console.log(path.join(__dirname, 'public'));
        return res.render('index', {status: "Led is On"});
    });
});
app.post("/led/off", (req, res) => {
    led.writeSync(0, (err) => {
        if (err) throw err;
        console.log('Written False to pin '+ led);
        console.log(path.join(__dirname, 'public'));
        return res.render('index',{status: "Led is Off"});
    });
});

pir.watch((err, value) => {
    if (value == 1) {
        console.log('Motion Detected!')
        led.writeSync(1);
        sendMail("INTRUDER WARNING!", `Somebody got into your house, you can watch from camera via this links:${linkLocal}:${port}`)
        // if (mode == 0) mode = 1;
        // else mode = 0;
    } else {
        console.log('Motion Stopped');
    }
    // led.writeSync(mode);
});

app.listen(port, function () {
    console.log(`Simple LED Control Server Started on Port: ${port}!`)
  })