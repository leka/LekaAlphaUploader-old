/*jslint node: true, esversion: 6 */
'use strict';

const os = require('os');
const path = require('path');
const {exec, spawn} = require('child_process');

let state = {
	off      : 0,
	reading  : 1,
	writing  : 2,
	checking : 3,
	timeout  : 4,
	mismatch : 5,
	success  : 6,
};

let currentState = state.off;
let cmd;

function getAvrdudeCommand() {
	let command;

	if (os.type() == 'Darwin') {
		const avrdude = path.join(__dirname, 'bin/avrdude');
		const conf    = '-C' + ' ' + path.join(__dirname, './bin/osx-avrdude.conf');
		const flags   = '-v -p atmega2560 -D -c wiring -b 115200 -P /dev/tty.usbmodem*';
		const flash   = '-U flash:w:' + hexPath + ':i';
		command = [avrdude, conf, flags, flash].join(" ");
	}

	if (os.type() == 'Windows_NT') {
		const avrdude = path.join(__dirname, 'bin/avrdude.exe');
		const conf    = '-C' + path.join(__dirname, './bin/windows-avrdude.conf');
		const flags   = '-v -p atmega2560 -D -c wiring -b 115200 -P COM*';
		const flash   = '-U flash:w:' + hexPath + ':i';
		command = [avrdude, conf, flags, flash].join(" ");
	}

	return command;
}

function updateProgress(data, currentState) {
	let progress = (data.match(/#/g) || []).length / 50 * 100;

	switch (currentState) {
		case state.reading:
		readingProgressEl.value += progress;
		break;
		case state.writing:
		writingProgressEl.value += progress;
		break;
		case state.verifying:
		verifyingProgressEl.value += progress;
		break;
	}
}

function resetProgress() {
	document.getElementById('readingProgress').value = 0;
	document.getElementById('writingProgress').value = 0;
	document.getElementById('verifyingProgress').value = 0;
	currentState = state.off;
}

function analyze(data) {
	if (data.includes('Reading |') && currentState == state.off) {
		currentState = state.reading;
		statusEl.innerHTML = 'Reading...';
		return;
	}

	if (data.includes('Writing | ')) {
		currentState = state.writing;
		statusEl.innerHTML = 'Writing...';
		return;
	}

	if (data.includes('reading on-chip flash data') && currentState == state.writing) {
		currentState = state.verifying;
		statusEl.innerHTML = 'Verifying...';
		return;
	}

	if (data.includes('timeout')) {
		console.log('Timeout, let\'s try again!');
		statusEl.innerHTML = 'Timeout, let\'s try again!';
		currentState = state.timeout;
		cmd.kill();
		return;
	}

	if (data.includes('mismatch')) {
		console.log('Mismatch, let\'s try again!');
		statusEl.innerHTML = 'Mismatch, let\'s try again!';
		currentState = state.mismatch;
		cmd.kill();
		return;
	}

	if (data.includes('bytes of flash verified')) {
		console.log('Success!');
		statusEl.innerHTML = 'Success!';
		currentState = state.success;
		return;
	}

	if (data.includes('#')) {
		updateProgress(data.toString(), currentState);
		return;
	}
}

function flash() {
	updateButtonEl.disabled = true;
	cancelButtonEl.disabled = false;

console.log(cmd);
	resetProgress();

	console.log(getAvrdudeCommand());
	cmd = spawn(getAvrdudeCommand(), [], {shell: true});

	cmd.on('error', function( err ){
		alert(err);
		throw err
	});

	cmd.stdout.on('data', (data) => {
		console.log(`stdout: ${data}`);
	});

	cmd.stderr.on('data', (data) => {
		console.log(`stderr: ${data}`);
		analyze(data);
	});

	cmd.on('close', (code) => {
		console.log(`child process exited with code ${code}`);

		if (code == 0 && currentState == state.success) {
			statusEl.innerHTML = 'Everything seems to be okay! You can now test the robot';
			updateButtonEl.disabled = false;
			cancelButtonEl.disabled = true;
		}

		if (currentState == state.timeout || currentState == state.mismatch) {
			console.log("restart after closing");
			flash();
		}
	});
}

function cancel() {
	cmd.kill();
	console.log('Cancelling upload...');
	updateButtonEl.disabled = false;
	cancelButtonEl.disabled = true;
}

function showCompleteOutput() {
	if (completeOutput.style.display === "none") {
		completeOutput.style.display = "block";
	} else {
		completeOutput.style.display = "none";
	}
}

updateButtonEl.addEventListener('click', flash);
cancelButtonEl.addEventListener('click', cancel);
// showCompleteOutputEl.addEventListener('click', showCompleteOutput);
