import { postMessage } from "../utils/http.js";
import { displayTableRow, initHistoryTable, recordNoRow0 } from "../timesheet.js";
import { updateHistory } from "./historyTable.js";
import { renderModalListHtml, renderModalListDescHtml, renderModalInputHtml, renderModalDialogHtml, setWindowData, openSelectionWindow, setDialog2 } from "./modalWindows.js";
import { removeDialog1, removeDialog2, taskCatagory, laborCatagory, laborClass } from "../../Data/modalData.js";
import { openTimeWindow } from "./timeEntryWindow.js";


export let timeRecords;
export let noRecords;
export let laborCodes  = [
  [
      "TL",
      "TFM",
      "TUM",
      "CAD",
      "ADM",
      "LS",
      "PE",
      "ACCT",
      "BD"
  ],
  [
      "TL [Technical Labor]",
      "TFM [Technical Field Manager]",
      "TUM [Technical Unit Manager]",
      "CAD [Computer Drafting]",
      "ADM [Clerical/Admin]",
      "LS [Licensed Surveyor]",
      "PE [Licensed Engineer]",
      "ACCT [Accounting]",
      "BD [Business Development]"
  ],
  [
      "Technical Labor\r\n\r\nDescription:  Primis interdum molestie parturient duis a. Cras potenti nulla nibh maecenas vivamus in libero phasellus. Turpis venenatis facilisis habitasse malesuada vel. Sed dolor parturient quisque vivamus commodo. Iaculis efficitur purus varius semper vulputate accumsan proin ligula. Pulvinar class potenti felis at vivamus dolor praesent blandit. Porttitor auctor sollicitudin primis sodales sem. Lacus maecenas aenean ridiculus ullamcorper euismod accumsan ridiculus convallis.",
      "Technical Field Manager\r\n\r\nDescription:  Primis interdum molestie parturient duis a. Cras potenti nulla nibh maecenas vivamus in libero phasellus. Turpis venenatis facilisis habitasse malesuada vel. Sed dolor parturient quisque vivamus commodo. Iaculis efficitur purus varius semper vulputate accumsan proin ligula. Pulvinar class potenti felis at vivamus dolor praesent blandit. Porttitor auctor sollicitudin primis sodales sem. Lacus maecenas aenean ridiculus ullamcorper euismod accumsan ridiculus convallis.",
      "Technical Unit Manager\r\n\r\nDescription:  Primis interdum molestie parturient duis a. Cras potenti nulla nibh maecenas vivamus in libero phasellus. Turpis venenatis facilisis habitasse malesuada vel. Sed dolor parturient quisque vivamus commodo. Iaculis efficitur purus varius semper vulputate accumsan proin ligula. Pulvinar class potenti felis at vivamus dolor praesent blandit. Porttitor auctor sollicitudin primis sodales sem. Lacus maecenas aenean ridiculus ullamcorper euismod accumsan ridiculus convallis.\r\n",
      "Computer Drafting\r\n\r\nDescription:  Primis interdum molestie parturient duis a. Cras potenti nulla nibh maecenas vivamus in libero phasellus. Turpis venenatis facilisis habitasse malesuada vel. Sed dolor parturient quisque vivamus commodo. Iaculis efficitur purus varius semper vulputate accumsan proin ligula. Pulvinar class potenti felis at vivamus dolor praesent blandit. Porttitor auctor sollicitudin primis sodales sem. Lacus maecenas aenean ridiculus ullamcorper euismod accumsan ridiculus convallis.\r\n",
      "Clerical/Admin\r\n\r\nDescription:  Primis interdum molestie parturient duis a. Cras potenti nulla nibh maecenas vivamus in libero phasellus. Turpis venenatis facilisis habitasse malesuada vel. Sed dolor parturient quisque vivamus commodo. Iaculis efficitur purus varius semper vulputate accumsan proin ligula. Pulvinar class potenti felis at vivamus dolor praesent blandit. Porttitor auctor sollicitudin primis sodales sem. Lacus maecenas aenean ridiculus ullamcorper euismod accumsan ridiculus convallis.\r\n",
      "Licensed Surveyor\r\n\r\nDescription:  Primis interdum molestie parturient duis a. Cras potenti nulla nibh maecenas vivamus in libero phasellus. Turpis venenatis facilisis habitasse malesuada vel. Sed dolor parturient quisque vivamus commodo. Iaculis efficitur purus varius semper vulputate accumsan proin ligula. Pulvinar class potenti felis at vivamus dolor praesent blandit. Porttitor auctor sollicitudin primis sodales sem. Lacus maecenas aenean ridiculus ullamcorper euismod accumsan ridiculus convallis.\r\n",
      "Licensed Engineer\r\n\r\nDescription:  Primis interdum molestie parturient duis a. Cras potenti nulla nibh maecenas vivamus in libero phasellus. Turpis venenatis facilisis habitasse malesuada vel. Sed dolor parturient quisque vivamus commodo. Iaculis efficitur purus varius semper vulputate accumsan proin ligula. Pulvinar class potenti felis at vivamus dolor praesent blandit. Porttitor auctor sollicitudin primis sodales sem. Lacus maecenas aenean ridiculus ullamcorper euismod accumsan ridiculus convallis.\r\n",
      "Accounting\r\n\r\nDescription:  Primis interdum molestie parturient duis a. Cras potenti nulla nibh maecenas vivamus in libero phasellus. Turpis venenatis facilisis habitasse malesuada vel. Sed dolor parturient quisque vivamus commodo. Iaculis efficitur purus varius semper vulputate accumsan proin ligula. Pulvinar class potenti felis at vivamus dolor praesent blandit. Porttitor auctor sollicitudin primis sodales sem. Lacus maecenas aenean ridiculus ullamcorper euismod accumsan ridiculus convallis.\r\n",
      "Business Development\r\n\r\nDescription:  Primis interdum molestie parturient duis a. Cras potenti nulla nibh maecenas vivamus in libero phasellus. Turpis venenatis facilisis habitasse malesuada vel. Sed dolor parturient quisque vivamus commodo. Iaculis efficitur purus varius semper vulputate accumsan proin ligula. Pulvinar class potenti felis at vivamus dolor praesent blandit. Porttitor auctor sollicitudin primis sodales sem. Lacus maecenas aenean ridiculus ullamcorper euismod accumsan ridiculus convallis.\r\n"
  ]
];
let employeeNo;


// retrieve time records from backend database
export async function getTimeRecords() {
  const message = "sourcePage: timesheet request: getTimeRecords";
  const response = await postMessage(message);

  console.log(response);
  if (response.Result === 'Success') {
    setTimeRecords(response.Data);
    employeeNo = response.EmployeeNo;
} else {
  setTimeRecords([]);
  alert(response.Result);
  }
}

// retrieve labor codes from backend
export async function getLaborCodes() {
  const message = "sourcePage: timesheet request: getLaborCodes";
  const response = await postMessage(message);

  console.log(response);
  if (response.Result === 'Success') {
    laborCodes = response.laborClassData;
  } else {
    laborCodes = [
      [
          "TL",
          "TFM",
          "TUM",
          "CAD",
          "ADM",
          "LS",
          "PE",
          "ACCT",
          "BD"
      ],
      [
          "TL [Technical Labor]",
          "TFM [Technical Field Manager]",
          "TUM [Technical Unit Manager]",
          "CAD [Computer Drafting]",
          "ADM [Clerical/Admin]",
          "LS [Licensed Surveyor]",
          "PE [Licensed Engineer]",
          "ACCT [Accounting]",
          "BD [Business Development]"
      ],
      [
          "Technical Labor\r\n\r\nDescription:  Primis interdum molestie parturient duis a. Cras potenti nulla nibh maecenas vivamus in libero phasellus. Turpis venenatis facilisis habitasse malesuada vel. Sed dolor parturient quisque vivamus commodo. Iaculis efficitur purus varius semper vulputate accumsan proin ligula. Pulvinar class potenti felis at vivamus dolor praesent blandit. Porttitor auctor sollicitudin primis sodales sem. Lacus maecenas aenean ridiculus ullamcorper euismod accumsan ridiculus convallis.",
          "Technical Field Manager\r\n\r\nDescription:  Primis interdum molestie parturient duis a. Cras potenti nulla nibh maecenas vivamus in libero phasellus. Turpis venenatis facilisis habitasse malesuada vel. Sed dolor parturient quisque vivamus commodo. Iaculis efficitur purus varius semper vulputate accumsan proin ligula. Pulvinar class potenti felis at vivamus dolor praesent blandit. Porttitor auctor sollicitudin primis sodales sem. Lacus maecenas aenean ridiculus ullamcorper euismod accumsan ridiculus convallis.",
          "Technical Unit Manager\r\n\r\nDescription:  Primis interdum molestie parturient duis a. Cras potenti nulla nibh maecenas vivamus in libero phasellus. Turpis venenatis facilisis habitasse malesuada vel. Sed dolor parturient quisque vivamus commodo. Iaculis efficitur purus varius semper vulputate accumsan proin ligula. Pulvinar class potenti felis at vivamus dolor praesent blandit. Porttitor auctor sollicitudin primis sodales sem. Lacus maecenas aenean ridiculus ullamcorper euismod accumsan ridiculus convallis.\r\n",
          "Computer Drafting\r\n\r\nDescription:  Primis interdum molestie parturient duis a. Cras potenti nulla nibh maecenas vivamus in libero phasellus. Turpis venenatis facilisis habitasse malesuada vel. Sed dolor parturient quisque vivamus commodo. Iaculis efficitur purus varius semper vulputate accumsan proin ligula. Pulvinar class potenti felis at vivamus dolor praesent blandit. Porttitor auctor sollicitudin primis sodales sem. Lacus maecenas aenean ridiculus ullamcorper euismod accumsan ridiculus convallis.\r\n",
          "Clerical/Admin\r\n\r\nDescription:  Primis interdum molestie parturient duis a. Cras potenti nulla nibh maecenas vivamus in libero phasellus. Turpis venenatis facilisis habitasse malesuada vel. Sed dolor parturient quisque vivamus commodo. Iaculis efficitur purus varius semper vulputate accumsan proin ligula. Pulvinar class potenti felis at vivamus dolor praesent blandit. Porttitor auctor sollicitudin primis sodales sem. Lacus maecenas aenean ridiculus ullamcorper euismod accumsan ridiculus convallis.\r\n",
          "Licensed Surveyor\r\n\r\nDescription:  Primis interdum molestie parturient duis a. Cras potenti nulla nibh maecenas vivamus in libero phasellus. Turpis venenatis facilisis habitasse malesuada vel. Sed dolor parturient quisque vivamus commodo. Iaculis efficitur purus varius semper vulputate accumsan proin ligula. Pulvinar class potenti felis at vivamus dolor praesent blandit. Porttitor auctor sollicitudin primis sodales sem. Lacus maecenas aenean ridiculus ullamcorper euismod accumsan ridiculus convallis.\r\n",
          "Licensed Engineer\r\n\r\nDescription:  Primis interdum molestie parturient duis a. Cras potenti nulla nibh maecenas vivamus in libero phasellus. Turpis venenatis facilisis habitasse malesuada vel. Sed dolor parturient quisque vivamus commodo. Iaculis efficitur purus varius semper vulputate accumsan proin ligula. Pulvinar class potenti felis at vivamus dolor praesent blandit. Porttitor auctor sollicitudin primis sodales sem. Lacus maecenas aenean ridiculus ullamcorper euismod accumsan ridiculus convallis.\r\n",
          "Accounting\r\n\r\nDescription:  Primis interdum molestie parturient duis a. Cras potenti nulla nibh maecenas vivamus in libero phasellus. Turpis venenatis facilisis habitasse malesuada vel. Sed dolor parturient quisque vivamus commodo. Iaculis efficitur purus varius semper vulputate accumsan proin ligula. Pulvinar class potenti felis at vivamus dolor praesent blandit. Porttitor auctor sollicitudin primis sodales sem. Lacus maecenas aenean ridiculus ullamcorper euismod accumsan ridiculus convallis.\r\n",
          "Business Development\r\n\r\nDescription:  Primis interdum molestie parturient duis a. Cras potenti nulla nibh maecenas vivamus in libero phasellus. Turpis venenatis facilisis habitasse malesuada vel. Sed dolor parturient quisque vivamus commodo. Iaculis efficitur purus varius semper vulputate accumsan proin ligula. Pulvinar class potenti felis at vivamus dolor praesent blandit. Porttitor auctor sollicitudin primis sodales sem. Lacus maecenas aenean ridiculus ullamcorper euismod accumsan ridiculus convallis.\r\n"
      ]
  ];
    alert(response.Result);
  }
}

// called when date cell is clicked
export async function clickDate() {
  if (recordNoRow0 === noRecords-1) {         // new record
    const message = "sourcePage: timesheet request: createTimeRecord";
    const response = await postMessage(message);

    console.log(response);
    if (response.Result === 'Success') {
      setTimeRecords(response.Data);
    } else {
      setTimeRecords([]);
      alert(response.Result);
    }
    displayTableRow(1, timeRecords[recordNoRow0+1]);

  } else {
    setDialog2(removeDialog2);
    renderModalDialogHtml(removeDialog1);
    openSelectionWindow();
  }
}

// called when charge to cell is clicked
export async function clickChargeTo() {
  if (recordNoRow0 === noRecords-1) {         // new record
    const message = "sourcePage: timesheet request: createTimeRecord";
    const response = await postMessage(message);

    console.log(response);
    if (response.Result === 'Success') {
      setTimeRecords(response.Data);
    } else {
      setTimeRecords([]);
      alert(response.Result);
    }
    displayTableRow(1, timeRecords[recordNoRow0+1]);
  
  }
  setWindowData(taskCatagory);
  renderModalListHtml();
  openSelectionWindow();
}

// called when cost code cell is clicked
export async function clickCostCode() {
  if (recordNoRow0 === noRecords-1) {         // new record
    const message = "sourcePage: timesheet request: createTimeRecord";
    const response = await postMessage(message);

    console.log(response);
    if (response.Result === 'Success') {
      setTimeRecords(response.Data);
    } else {
      setTimeRecords([]);
      alert(response.Result);
    }
    displayTableRow(1, timeRecords[recordNoRow0+1]);
    setWindowData(taskCatagory);

  } else {
    setWindowData(laborCatagory);
  }
  renderModalListHtml();
  openSelectionWindow();
}

// called when est & budget class cell is clicked
export async function clickEstBudClass() {
  if (recordNoRow0 === noRecords-1) {         // new record
    const message = "sourcePage: timesheet request: createTimeRecord";
    const response = await postMessage(message);

    console.log(response);
    if (response.Result === 'Success') {
      setTimeRecords(response.Data);
    } else {
      setTimeRecords([]);
      alert(response.Result);
    }
    displayTableRow(1, timeRecords[recordNoRow0+1]);
    setWindowData(taskCatagory);
    renderModalListHtml();

  } else if (document.querySelector('#js-row1-column2').innerText === '') {
    setWindowData(laborCatagory);
    renderModalListHtml();
  } else {
    setWindowData(laborClass);
    renderModalListDescHtml();
  }
  openSelectionWindow();
}

// called when time cell is clicked
export async function clickTime() {
  if (recordNoRow0 === noRecords-1) {         // new record
    const message = "sourcePage: timesheet request: createTimeRecord";
    const response = await postMessage(message);

    console.log(response);
    if (response.Result === 'Success') {
      setTimeRecords(response.Data);
    } else {
      setTimeRecords([]);
      alert(response.Result);
    }
    displayTableRow(1, timeRecords[recordNoRow0+1]);

  }
  openTimeWindow();
}

// called when notes cell is clicked
export async function clickNotes() {
  if (recordNoRow0 === noRecords-1) {         // new record
    const message = "sourcePage: timesheet request: createTimeRecord";
    const response = await postMessage(message);

    console.log(response);
    if (response.Result === 'Success') {
      setTimeRecords(response.Data);
    } else {
      setTimeRecords([]);
      alert(response.Result);
    }
    displayTableRow(1, timeRecords[recordNoRow0+1]);

  }
  renderModalInputHtml();
  openSelectionWindow();
}

// set timeRecords for returned data
export function setTimeRecords(data) {
  timeRecords = data;
  if (timeRecords.length === 0){
    noRecords = 0;
  } else if (timeRecords[0].length) {
    noRecords = timeRecords.length;
    if (crossMidnight()) {
      initHistoryTable();
    } else {
      sumHours();
    }
  } else {
    noRecords = 0;
  }
}

// add all hours worked and display
function sumHours() {
  let hours;
  let totalHours = 0;
  let workedHours = 0;
  let ptoHours = 0;

  timeRecords.forEach((record) => {
    hours = Number(record[6]);
    totalHours += hours;
    if (record[2].includes('PTO:')) {
      ptoHours += hours;
    } else {
      workedHours += hours;
    }
  });
  document.querySelector('#js-total-hours-display').innerText = totalHours.toFixed(2);
  updateHistory([workedHours, ptoHours]);
}

// check if hours worked crossed midnight
function crossMidnight() {
  const times = timeRecords[0][5].split('\n');
  return (noRecords === 1 && times[0] === '12:00 AM');
}
