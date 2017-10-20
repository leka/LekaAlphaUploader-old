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
			output(`Error (exec): ${error}`);
			return;
		}

		if (stdout) {
			output('Info: Refreshing port list');
			ports = stdout.replace(/^\s+|\s+$/g, '').split('\n');
			output('Info: Ports available - ' + ports);
		}

		if (stderr) {
			output(`Error: ${stderr}`);
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
		output('Info: ' + selectedPort + ' selected')
		status('You can now press the update button');
	}
	else {
		alert("Port not correct");
		output('Error: ' + selectedPort + ' not correct')
		return
	}
}

refreshPortListButtonEl.addEventListener('click', refreshPortList);
portListEl.addEventListener('change', getSelectedPort);
