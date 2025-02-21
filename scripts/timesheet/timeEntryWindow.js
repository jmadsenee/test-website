import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { postMessage } from "../utils/http.js";
import { noRecords, setTimeRecords, timeRecords } from "./timeRecords.js";
import { recordNoRow0, displayTableRow, clearTableRow, initHistoryTable } from "../timesheet.js";
import { timeError } from '../../Data/modalData.js';
import { renderModalDialogHtml, openSelectionWindow } from './modalWindows.js';


// open window
export function openTimeWindow() {
  const timeText = document.querySelector('#js-row1-column5').innerText;
  if (timeText === '') {return;}
  fillTimes(timeText);
  document.getElementById('js-time-window').style.display = "block";
}

// close window
export function closeTimeWindow() {
  document.getElementById('js-time-window').style.display = "none";
}


export function setupTimeListeners() {
  const startTimeDisplay = document.querySelector('#js-start-time');
  const endTimeDisplay = document.querySelector('#js-end-time');

  document.querySelector('#js-start-set-button').addEventListener('click', () => {
    const now = dayjs();
    const time = now.format('hh:mm A');
    startTimeDisplay.value = time;
  });

  document.querySelector('#js-end-set-button').addEventListener('click', () => {
    const now = dayjs();
    const time = now.format('hh:mm A');
    endTimeDisplay.value = time;
  });

  document.querySelector('.js-time-accept-button').addEventListener('mouseup', async () => {
    await timeAccept();
  });

  startTimeDisplay.addEventListener('click', () => {
    selectArea(startTimeDisplay)
  });
  
  startTimeDisplay.addEventListener('dblclick', () => {
    const cursorPosn = startTimeDisplay.selectionStart;
    console.log(cursorPosn);
    switch (cursorPosn) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        startTimeDisplay.selectionStart = 0;
        startTimeDisplay.selectionEnd = 5;
        break;

      case 6:
      case 7:
      case 8:
        startTimeDisplay.selectionStart = 6;
        startTimeDisplay.selectionEnd = 8;
        break;
    }
  });

  startTimeDisplay.addEventListener('focusout', () => {
    checkTime(startTimeDisplay);
  });

  startTimeDisplay.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      checkTime(startTimeDisplay);
      startTimeDisplay.blur();
    }
  });

  document.querySelector('#js-start-time-inc-button').addEventListener('click', () => {
    timeIncDec(startTimeDisplay, 'inc');
  });

  document.querySelector('#js-start-time-dec-button').addEventListener('click', () => {
    timeIncDec(startTimeDisplay, 'dec');
  });

  endTimeDisplay.addEventListener('click', () => {
    selectArea(endTimeDisplay)
  });
  
  endTimeDisplay.addEventListener('dblclick', () => {
    const cursorPosn = endTimeDisplay.selectionStart;
    console.log(cursorPosn);
    switch (cursorPosn) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        endTimeDisplay.selectionStart = 0;
        endTimeDisplay.selectionEnd = 5;
        break;

      case 6:
      case 7:
      case 8:
        endTimeDisplay.selectionStart = 6;
        endTimeDisplay.selectionEnd = 8;
        break;
    }
  });

  endTimeDisplay.addEventListener('focusout', () => {
    checkTime(endTimeDisplay);
  });

  endTimeDisplay.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      checkTime(endTimeDisplay);
      endTimeDisplay.blur();
    }
  });

  document.querySelector('#js-end-time-inc-button').addEventListener('click', () => {
    timeIncDec(endTimeDisplay, 'inc');
  });

  document.querySelector('#js-end-time-dec-button').addEventListener('click', () => {
    timeIncDec(endTimeDisplay, 'dec');
  });
}

// fill in times before opening window
function fillTimes(timeText) {
  const endTimeDisplay = document.querySelector('#js-end-time')
  let times = timeText.split('\n');
  if (times[0].indexOf(':') === 1) {
    times[0] = '0' + times[0];
  }
  document.querySelector('#js-start-time').value = times[0];
  if (times[2] === '?') {
    // const now = dayjs();
    // const time = now.format('hh:mm A');
    // endTimeDisplay.value = time;
    endTimeDisplay.value = '?';
  } else {
    if (times[2].indexOf(':') === 1) {
      times[2] = '0' + times[2];
    }
    endTimeDisplay.value = times[2];
  }
}

// send time
async function timeAccept() {
  // build & send message
  const transactionKey = timeRecords[recordNoRow0+1][9];
  let selection;
  const startTimeDisplay = document.querySelector('#js-start-time').value;
  const startTime = dayjs(`1/1/1 ${startTimeDisplay}`);
  const endTimeDisplay = document.querySelector('#js-end-time').value;
  if (endTimeDisplay === '?') {
    selection = [startTime.format('HH:mm'), endTimeDisplay];
  } else {
    const endTime = dayjs(`1/1/1 ${endTimeDisplay}`);
    selection = [startTime.format('HH:mm'), endTime.format('HH:mm')];
  }

  const data = JSON.stringify({transactionKey, dataSet: 'timeInOut', index:'0', selection});
  console.log(data);
  const message = `sourcePage: timesheet request: acceptSelection data: ${data}`;
  const response = await postMessage(message);

  // handle response
  console.log(response);
  if (response.Result === 'Success') {
    switch (response.dataSet) {

      case 'tableData':
        closeTimeWindow();
        setTimeRecords(response.Data);
        if (noRecords === 0) {
          clearTableRow(1);
          initHistoryTable();
        } else {
          displayTableRow(1, timeRecords[recordNoRow0+1]);
        }
        break;

      case 'timeError':
        closeTimeWindow();
        renderModalDialogHtml(timeError);
        openSelectionWindow();
        break;

      default:

    }
  } else {
    alert(response.Result);
  }
}

// check time to make sure it is valid, reformat if necessary
function checkTime(control) {
  let time = control.value;

  if (time.length === 4) {
    const timeNum = Number(time);
    if (timeNum >= 0 && timeNum <= 2400) {
      time = time.slice(0,2) + ':' + time.slice(2);
    }
  }

  time = dayjs(`1/1/1 ${time}`);
  if (time.isValid()) {
    control.value = time.format('hh:mm A');
  }
}

// select appropriate part of input
function selectArea(control) {
  if (Math.abs(control.selectionEnd - control.selectionStart) === 8) {return;}

  const cursorPosn = control.selectionStart;
  switch (cursorPosn) {
    case 0:
    case 1:
    case 2:
      control.selectionStart = 0;
      control.selectionEnd = 2;
      break;

    case 3:
    case 4:
    case 5:
      control.selectionStart = 3;
      control.selectionEnd = 5;
      break;

    case 6:
    case 7:
    case 8:
      control.selectionStart = 6;
      control.selectionEnd = 8;
      break;
  }
}

function timeIncDec(control, direction) {
  const start = control.selectionStart;
  const end =  control.selectionEnd;    
  if (start === end) {return;}

  const time = dayjs(`1/1/1 ${control.value}`);
  let newTime;

  if (direction === 'dec') {
    if (end === 2) {
      newTime = time.subtract(1, 'hour').format('hh:mm A');
    } else if (end === 5) {
      newTime = time.subtract(1, 'minute').format('hh:mm A');
    } else if (end === 8) {
      newTime = time.subtract(12, 'hour').format('hh:mm A');
    }
  } else if (direction === 'inc') {
    if (end === 2) {
      newTime = time.add(1, 'hour').format('hh:mm A');
    } else if (end === 5) {
      newTime = time.add(1, 'minute').format('hh:mm A');
    } else if (end === 8) {
      newTime = time.add(12, 'hour').format('hh:mm A');
    }
  }

  control.value = newTime;
  control.focus();
  control.selectionStart = start;
  control.selectionEnd = end;
}