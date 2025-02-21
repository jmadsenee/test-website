import { postMessage } from "../utils/http.js";
import { setTimeRecords, timeRecords, noRecords } from "./timeRecords.js";
import { recordNoRow0, displayTableRow, clearTableRow } from "../timesheet.js";
import { setLaborClass } from "../../Data/modalData.js";


let windowData;
let selectedIndex = null;
let dataSet;
let acceptCallback = '';
let dialog2;

const acceptButton = document.getElementById('js-accept-button');
const cancelButton = document.getElementById('js-cancel-button');



// open window
export function openSelectionWindow() {
  document.getElementById('js-selection-window').style.display = "block";
}

// close window
export function closeSelectionWindow() {
  // reset visibilty of body & footer
  document.getElementById('js-selection-window-body').style.display = "block";
  document.getElementById('js-modal-footer').style.display = "block";
  // close window
  document.getElementById('js-selection-window').style.display = "none";
  // remove callback if set
  if (acceptCallback !== '') {
    acceptButton.removeEventListener('click', acceptCallback);
    acceptCallback = '';
  }
}

// set window data for resident data
export function setWindowData(data) {
  const copy = JSON.stringify(data);
  windowData = JSON.parse(copy);
}

// set second dialog data
export function setDialog2(data) {
  dialog2 = data;
}


// render modal list window HTML
export function renderModalListHtml() {
  let modalHTML = '<div class="list-window-wide">';
  selectedIndex = null;
  dataSet = windowData.dataSet;

  windowData.list.forEach((item, index) => {
    modalHTML += `
      <div id="js-li${index}" class="list-item js-li" data-list-item="${index}">
        ${item}
      </div>
    `
  });
  modalHTML += '</div>';

  // create heading & list
  document.querySelector('#js-selection-window-heading').innerText = windowData.heading;
  document.querySelector('#js-selection-window-body-list').innerHTML=modalHTML;
  document.getElementById('js-modal-footer').style.display = "none";


  // create listeners for list items
  document.querySelectorAll('.js-li').forEach((item) => {
    item.addEventListener('click', () => {
      const index = item.dataset.listItem;
      // listItemHighlighting(index);
      listItemSelection(index);
    })
  });
}

// render modal list/description window HTML
export function renderModalListDescHtml() {
  let modalHTML = '<div class="list-window">';
  selectedIndex = null;
  dataSet = windowData.dataSet;

  windowData.list.forEach((item, index) => {
    modalHTML += `
      <div id="js-li${index}" class="list-item js-li" data-list-item="${index}">
        ${item[1]}
      </div>
    `
  });
  modalHTML += '</div><div class="description-window" id="list-item-description"></div>';

  // create heading & list
  document.querySelector('#js-selection-window-heading').innerText = windowData.heading;
  document.querySelector('#js-selection-window-body-list').innerHTML = modalHTML;
  document.getElementById('js-modal-footer').style.display = "none";

  // create listeners for list items
  document.querySelectorAll('.js-li').forEach((item) => {
    item.addEventListener('click', () => {
      const index = item.dataset.listItem;
      listItemSelection(index);
    });
    item.addEventListener('mouseover', () => {
      const index = item.dataset.listItem;
      listItemDescription(index);
    });
  });
}

// render modal input window HTML
export function renderModalInputHtml() {
  const modalHTML = '<div contenteditable="true" class="inputBox"></div>';

  // create heading & list
  document.querySelector('#js-selection-window-heading').innerText = 'Add Note';
  document.querySelector('#js-selection-window-body-list').innerHTML = modalHTML;
  // document.getElementById('js-modal-footer').style.display = "block";


  // make sure buttons have correct names
  acceptButton.innerText = 'Accept';
  cancelButton.innerText = 'Cancel';

  // create listeners for list items
  acceptCallback = textInputAccept;
  acceptButton.addEventListener('click', acceptCallback);
}

// render modal dialog window HTML
export function renderModalDialogHtml(data) {
  // create heading & insert html
  document.querySelector('#js-selection-window-heading').innerText = data.message;
  document.getElementById('js-selection-window-body').style.display = "none";

  // make sure buttons have correct names
  acceptButton.innerText = data.acceptButton;
  cancelButton.innerText = data.cancelButton;

  // create listeners for list items
  acceptCallback = data.callback;
  acceptButton.addEventListener('click', acceptCallback);
}

// render 2nd dialog
export function renderDialog2() {
  acceptButton.removeEventListener('click', acceptCallback);
  renderModalDialogHtml(dialog2);
}



// handle list item selection
async function listItemSelection(index) {
  // highlight current selection
  document.querySelector(`#js-li${index}`).style.background = "rgb(0, 207, 187)";
  // build & send message
  const transactionKey = timeRecords[recordNoRow0+1][9];
  let selection = windowData.list[index];
  if (!Array.isArray(selection)) {
    selection = Array.from([selection]); }
  // console.log(selection);
  const data = JSON.stringify({transactionKey, dataSet, index, selection});
  if (dataSet.substring(0,11) === 'directLabor')
    setLaborClass(selection);

  const message = `sourcePage: timesheet request: acceptSelection data: ${data}`;
  const response = await postMessage(message);

  // handle response
  console.log(response);
  if (response.Result === 'Success') {
    switch (response.dataSet) {
      case 'jobNumbers':
      case 'offices':
        windowData.dataSet = response.dataSet;
        windowData.heading = response.officeName;
        windowData.list = response.jobNumbers;
        renderModalListHtml();
        openSelectionWindow();
        break;

      case 'tableData':
        closeSelectionWindow();
        setTimeRecords(response.Data);
        displayTableRow(1, timeRecords[recordNoRow0+1]);
        break;

      case 'indirectLaborSupport':
      case 'indirectLaborPTO':
      case 'directLaborField':
      case 'directLaborOffice':
      case 'directLaborPrevailing':
        windowData.dataSet = response.dataSet;
        windowData.heading = response.laborExpenseType;
        windowData.list = response.directOfficeLabor;
        renderModalListDescHtml();
        openSelectionWindow();
        break;

      default:

    }

  } else {
    windowData = [];
    alert(response.Result);
  }
  
}

// handle text input
async function textInputAccept() {
  // build & send message
  const transactionKey = timeRecords[recordNoRow0+1][9];
  dataSet = 'noteText';
  const selection = Array.from([document.querySelector('.inputBox').innerText]);
  const data = JSON.stringify({transactionKey, dataSet, index:'0', selection});
  console.log(data);
  const message = `sourcePage: timesheet request: acceptSelection data: ${data}`;
  const response = await postMessage(message);

  // handle response
  console.log(response);
  if (response.Result === 'Success') {
    switch (response.dataSet) {
      case 'tableData':
        setTimeRecords(response.Data);
        displayTableRow(1, timeRecords[recordNoRow0+1]);
        break;

      default:

    }
  } else {
    alert(response.Result);
  }
  closeSelectionWindow();
}

// handle remove time record
export async function removeTimeRecord() {
  // build & send message
  const transactionKey = timeRecords[recordNoRow0+1][9];
  const selection = Array.from([transactionKey]);
  const data = JSON.stringify({transactionKey, dataSet:'', index:'0', selection});
  console.log(data);
  const message = `sourcePage: timesheet request: removeTimeRecord data: ${data}`;  
  const response = await postMessage(message);

  // handle response
  console.log(response);
  if (response.Result === 'Success') {
    setTimeRecords(response.Data);
    if (noRecords > recordNoRow0+1) {
      displayTableRow(1, timeRecords[recordNoRow0+1]);
    } else {
      clearTableRow(1);
    }
    if (noRecords > recordNoRow0+2) {
      displayTableRow(2, timeRecords[recordNoRow0+2]);
    } else {
      clearTableRow(2);
    }
  } else {
    alert(response.Result);
  }
  closeSelectionWindow();
}

// display description for list item mouseover
function listItemDescription(index) {
  document.querySelector('#list-item-description').innerText = windowData.list[index][3];
}

// find dimension of array
function checkArrayDimension (array) {
  let dimension = 0;

  while (1) {
    if (Array.isArray(array)) {
      dimension++;
      array = array[0];
    } else {
      break;
    }
  }
  return dimension;
}



// handle list selection highlighting
function listItemHighlighting(index) {
  // clear old highlighting
  document.querySelectorAll('.js-li').forEach((item) => {
    item.style.background = "#f1f1f1";
  });

  // highlight current selection
  document.querySelector(`#js-li${index}`).style.background = "rgb(0, 207, 187)";
  selectedIndex = index;
  console.log(selectedIndex);
}