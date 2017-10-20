'use strict';

function getAvrdudeCommand() {
	let command;

	if (os.type() == 'Darwin') {
		const avrdude = path.join(__dirname, 'bin/avrdude');
		const conf    = '-C' + ' ' + path.join(__dirname, 'bin/osx-avrdude.conf');
		const flags   = '-v -p atmega2560 -D -c wiring -b 115200 -P ' + selectedPort;
		const flash   = '-U flash:w:' + hexPath + ':i';
		command = [avrdude, conf, flags, flash].join(" ");
	}

	if (os.type() == 'Windows_NT') {
		const avrdude = path.join(__dirname, 'bin/avrdude.exe');
		const conf    = '-C' + path.join(__dirname, 'bin/windows-avrdude.conf');
		const flags   = '-v -patmega2560 -cwiring -b115200 -D -P' + selectedPort;
		const flash   = '-Uflash:w:' + hexPath + ':i';
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

function setButtonsState(buttonState) {
	if (buttonState.includes('off')) {
		updateButtonEl.disabled = true;
		cancelButtonEl.disabled = true;
	}
	if (buttonState.includes('ready')) {
		updateButtonEl.disabled = false;
		cancelButtonEl.disabled = true;
	}
	if (buttonState.includes('uploading')) {
		updateButtonEl.disabled = true;
		cancelButtonEl.disabled = false;
	}
}

function resetProgress() {
	document.getElementById('readingProgress').value = 0;
	document.getElementById('writingProgress').value = 0;
	document.getElementById('verifyingProgress').value = 0;
	currentState = state.off;
}

function analyze(data) {
	if (data.includes('#')) {
		updateProgress(data.toString(), currentState);
	}

	if (data.includes('avrdude: AVR device initialized')) {
		currentState = state.reading;
		status('Reading...');
		return;
	}

	if (data.includes('avrdude: writing flash')) {
		currentState = state.writing;
		status('Writing...');
		return;
	}

	if (data.includes('avrdude: reading on-chip flash data')) {
		currentState = state.verifying;
		status('Verifying...');
		return;
	}

	if (data.includes('timeout')) {
		status('Timeout, let\'s try again!');
		currentState = state.timeout;

		timeoutCount += 1;

		if (timeoutCount >= maxTimeoutCount) {
			currentState = state.noconnection;
		}

		cmd.kill();
		return;
	}

	if (data.includes('avrdude: verification error, first mismatch at byte')) {
		status('Mismatch, let\'s try again!');
		currentState = state.mismatch;
		cmd.kill();
		return;
	}

	if (data.includes('can\'t open device')) {
		status('Port not found, cancelling the upload...');
		currentState = state.noport;
		cmd.kill();
		return;
	}

	if (data.includes('bytes of flash verified')) {
		status('Success!');
		currentState = state.success;
		return;
	}
}

function upload() {
	setButtonsState('uploading');

	resetProgress();

	output("Info: " + getAvrdudeCommand());
	cmd = spawn(getAvrdudeCommand(), [], {shell: true});

	cmd.on('error', function( err ){
		completeOutputEl.innerHTML += err.toString()
		throw err
	});

	cmd.stdout.on('data', (data) => {
		console.log(`stdout: ${data}`);
		completeOutputEl.innerHTML += data.toString()
	});

	cmd.stderr.on('data', (data) => {
		console.log(`stderr: ${data}`);
		completeOutputEl.innerHTML += data.toString()
		analyze(data);
	});

	cmd.on('close', (code) => {
		output(`Info: child_process exited with code "${code}"`);

		if (code == 0 && currentState == state.success) {
			status('Everything seems to be okay! You can now test the robot');
			output('Success: Upload complete');
			setButtonsState('ready');
			timeoutCount = 0;
		}

		if (currentState == state.noport) {
			output('Error: No port was found');
			setButtonsState('ready');
		}

		if (currentState == state.timeout || currentState == state.mismatch) {
			output('Info: Timeout or mismatch encountered, restart the upload process');
			upload();
		}

		if (currentState == state.noconnection) {
			status('There has been too many timeouts, check your connection and try again.');
			output('Error: Too many timeouts, issue with the connection');
			setButtonsState('ready');
		}
	});
}

function cancel() {
	cmd.kill();
	timeoutCount = 0;
	resetProgress();
	setButtonsState('ready');
	output('Info: Cancel button pressed');
	status('Cancel button pressed... Want to try again?')
}

updateButtonEl.addEventListener('click', upload);
cancelButtonEl.addEventListener('click', cancel);
