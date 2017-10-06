'use strict';

const os = require('os');
const {exec} = require('child_process');

function setCommand() {
	let command;

	if (os.type() == 'Darwin') {
		const avrdude = './bin/avrdude';
		const conf    = '-C ./bin/osx-avrdude.conf'
		const flags   = '-v -p atmega2560 -D -c wiring -b 115200 -P /dev/tty.usbmodem*'
		const flash   = '-U flash:w:' + hexPath + ':i';
		command = [avrdude, conf, flags, flash].join(" ");
	}

	if (os.type() == 'Windows_NT') {
		const avrdude = './bin/avrdude.exe';
		const conf    = '-C ./bin/windows-avrdude.conf'
		const flags   = '-v -p atmega2560 -D -c wiring -b 115200 -P COM*'
		const flash   = '-U flash:w:' + hexPath + ':i';
		command = [avrdude, conf, flags, flash].join(" ");
	}

	return command;
}

function update() {
	const command = setCommand();

	console.log(command);

	exec(command, (err, stdout, stderr) => {
		if (err) {
			console.error(err);
			return;
		}
		if (stdout) {
			console.log('stdout: ' + stdout);
		}
		if (stderr) {
			console.log('stderr: ' + stderr);
		}
	});
}

updateButtonEl.addEventListener('click', update);
