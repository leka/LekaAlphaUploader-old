const os = require('os');
const path = require('path');
const {exec, spawn} = require('child_process');

function refreshPortList() {
	var command;

	portListEl.innerHTML = '<option value="">Choose port</option>';

	if (os.type() == 'Darwin') {
		command = 'ls /dev/tty*';
		// command = 'ls /dev/tty.usb*';
	}
	else if (os.type() == 'Windows_NT') {
		command = 'powershell.exe [System.IO.Ports.SerialPort]::getportnames()';
	}

	exec(command, (error, stdout, stderr) => {
		if (error) {
			output('error', error);
			return;
		}

		if (stdout) {
			ports = stdout.replace(/^\s+|\s+$/g, '').split('\n');
			output('info', ports);
		}

		if (stderr) {
			output('error', stderr);
		}

		ports.forEach(function(port) {
			portListEl.innerHTML += '<option value="' + port + '">' + port + '</option>';
		});
	});
}

function getSelectedPort() {
	if (portListEl.value != undefined || portListEl.value != 'Choose port') {
		setButtonsState('ready');
		selectedPort = portListEl.value;
		output('info', selectedPort + ' selected')
		status('You can now press the update button');
	}
	else {
		alert("Port not correct");
		output('error', selectedPort + ' not correct')
		return
	}
}

refreshPortListButtonEl.addEventListener('click', refreshPortList);
portListEl.addEventListener('change', getSelectedPort);
