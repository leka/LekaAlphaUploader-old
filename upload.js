'use strict';

const os = require('os');
const { exec, spawn } = require('child_process');

let avrdude = undefined;
let args   = [];

function setupCommand() {
	if (os.type() == 'Darwin') {
		const conf    = ('-C ./bin/osx-avrdude.conf').split(' ');
		const flags   = ('-v -p atmega2560 -D -c wiring -b 115200 -P /dev/tty.usbmodem1421').split(' ');
		const flash   = ('-U flash:w:' + hexPath + ':i').split(' ');

		avrdude = './bin/avrdude';
		args = args.concat(conf, flags, flash);
	}

	if (os.type() == 'Windows_NT') {
		const conf    = ('-C ./bin/windows-avrdude.conf').split(' ');
		const flags   = ('-v -p atmega2560 -D -c wiring -b 115200 -P COM*').split(' ');
		const flash   = ('-U flash:w:' + hexPath + ':i').split(' ');

		avrdude = './bin/avrdude.exe';
		args = args.concat(conf, flags, flash);
	}
}


function setCommand() {
	if (os.type() == 'Darwin') {
		const avrdude = './bin/avrdude';
		const conf    = '-C ./bin/osx-avrdude.conf'
		const flags   = '-v -p atmega2560 -D -c wiring -b 115200 -P /dev/tty.usbmodem*'
		const flash   = '-U flash:w:' + hexPath + ':i';

		return [avrdude, conf, flags, flash].join(" ");
	}

	if (os.type() == 'Windows_NT') {
		const avrdude = './bin/avrdude.exe';
		const conf    = '-C ./bin/windows-avrdude.conf'
		const flags   = '-v -p atmega2560 -D -c wiring -b 115200 -P COM*'
		const flash   = '-U flash:w:' + hexPath + ':i';

		return [avrdude, conf, flags, flash].join(" ");
	}
}

function update() {
	const command = setCommand();

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

function spawnUpdate() {
	setupCommand();
	const cmd = spawn(avrdude, args);

	cmd.on('error', function( err ){ throw err })

	cmd.stdout.on('data', (data) => {
		console.log(`stdout: ${data}`);
	});

	cmd.stderr.on('data', (data) => {
		console.log(`stderr: ${data}`);
		if (data.includes('timeout')) {
			cmd.kill();
			console.log('process killed');
		}
		if (data.includes('mismatch')) {
			cmd.kill();
			spawnUpdate();
		}
	});

	cmd.on('close', (code) => {
		console.log(`child process exited with code ${code}`);
		cmd.kill();
		console.log('process killed');
	});
}

updateButtonEl.addEventListener('click', spawnUpdate);
