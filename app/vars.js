'use strict';

const dropZoneEl = document.getElementById('dropzoneSection');
const dropInstructionEl = document.getElementById('dropInstruction');

const readingProgressEl   = document.getElementById('readingProgress');
const writingProgressEl   = document.getElementById('writingProgress');
const verifyingProgressEl = document.getElementById('verifyingProgress');
const statusEl            = document.getElementById('status');

const updateButtonEl = document.getElementById('updateButton');
const cancelButtonEl = document.getElementById('cancelButton');

const portListEl = document.getElementById('portList');
const refreshPortListButtonEl = document.getElementById('refreshPortListButton');

const completeOutputEl = document.getElementById("completeOutput");

const clipboard = new Clipboard('#copyOutputButton');

let hexPath;

let state = {
	off      : 0,
	reading  : 1,
	writing  : 2,
	checking : 3,
	timeout  : 4,
	mismatch : 5,
	success  : 6,
	noport   : 7,
	noconnection : 8,
};

let currentState = state.off;
let cmd;

let ports = [];
let selectedPort;

let timeoutCount = 0;
let maxTimeoutCount = 5;

function output(data) {
	console.log(data);
	completeOutputEl.innerHTML += '<br>' + data + '<br>';
}

function status(status) {
	statusEl.innerHTML = status;
}
