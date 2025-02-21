import { timeRecords, noRecords, getTimeRecords, getLaborCodes, clickDate, clickChargeTo, clickCostCode, clickEstBudClass, clickTime, clickNotes } from "./timesheet/timeRecords.js";
import { closeSelectionWindow } from "./timesheet/modalWindows.js";
import { closeTimeWindow, setupTimeListeners } from "./timesheet/timeEntryWindow.js";
import { getHistoryData, fillHistoryTable } from "./timesheet/historyTable.js";


export let recordNoRow0;
let editing = false;


async function initTimeRecords() {
  await getTimeRecords();

  recordNoRow0 = noRecords - 1;

  if (noRecords >= 1) {
    displayTableRow(0, timeRecords[recordNoRow0]);
    clearTableRow(1);
    clearTableRow(2);
  }
}

export async function initHistoryTable() {
  await getHistoryData();
  fillHistoryTable();
}

async function initLaborCodes() {
  await getLaborCodes();
}

function moveTableRows(direction) {
  let recordNo;

  if (editing) {
    return;
  }

  if (direction === 'down' && recordNoRow0 >= 0) {
    recordNoRow0--;
  } else if (direction === 'up' && recordNoRow0 < noRecords - 1) {
    recordNoRow0++;
  }

  for (let i = 0; i < 3; i++) {
    recordNo = recordNoRow0 + i;
    if (recordNo >= 0 && recordNo < noRecords) {
      displayTableRow(i, timeRecords[recordNoRow0 + i]);
    } else {
      clearTableRow(i);
    }      
  }
}

export function displayTableRow(row, rowData) {
  const noCells = rowData.length-1;
  for (let i = 0; i < noCells; i++) {
    document.querySelector(`#js-row${row}-column${i}`).innerText = rowData[i];
  }
}

export function clearTableRow(row) {
  for (let i = 0; i < 9; i++) {
    document.querySelector(`#js-row${row}-column${i}`).innerText='';
  }
  if (row === 1) {
    const cell = document.querySelector('#js-row1-column0');
    cell.innerText='Click to enter new record';
  }
}

initTimeRecords();
initHistoryTable();
initLaborCodes();
setupTimeListeners();


// handle up button
document.querySelector('#js-button-up').addEventListener('click', () => {
  moveTableRows('up');
});

// handle down button
document.querySelector('#js-button-down').addEventListener('click', () => {
  moveTableRows('down');
});

// date column - add new record
document.querySelector('#js-row1-column0').addEventListener('click', async () => {
  await clickDate();
});

// charge to column - open task catagory window
document.querySelector('#js-row1-column1').addEventListener('click', async () => {
  await clickChargeTo();
})

// cost code column - open cost code window
document.querySelector('#js-row1-column2').addEventListener('click', async () => {
  clickCostCode();
})

// est and budget class column - 
document.querySelector('#js-row1-column3').addEventListener('click', async () => {
  clickEstBudClass();
})

// time in/out column - 
document.querySelector('#js-row1-column5').addEventListener('click', () => {
  clickTime();
})

// notes column - 
document.querySelector('#js-row1-column8').addEventListener('click', () => {
  clickNotes();
})

// modal X button - selection window
document.querySelector('#js-close-selection').addEventListener('click', () => {
  closeSelectionWindow();
});

// modal X button - time window
document.querySelector('#js-close-time').addEventListener('click', () => {
  closeTimeWindow();
});

// modal cancel button
document.querySelector('#js-cancel-button').addEventListener('click', () => {
  closeSelectionWindow();
});
