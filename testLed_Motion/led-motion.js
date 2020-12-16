const gpio = require('onoff').Gpio;
const pir = new gpio(18, 'in', 'both');
const led = new gpio(26, 'out');
let mode = 0;

pir.watch((err, value) => {
    if (value == 1) {
        console.log('Motion Detected!')
        if (mode == 0) mode = 1;
        else mode = 0;
    } else {
        console.log('Motion Stopped');
    }
    led.writeSync(mode);
});