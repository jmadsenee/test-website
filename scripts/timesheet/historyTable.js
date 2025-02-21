import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { postMessage } from '../utils/http.js';


export let historyData = {
  dataSet: 'historyData',
  day0: '1/13/2025',
  data: []
};

// retrieve time records from backend database
export async function getHistoryData() {
  const message = "sourcePage: timesheet request: getHistoryData";
  const response = await postMessage(message);

  console.log(response);
  if (response.Result === 'Success') {
    setHistoryData(response.Data);
    historyData.day0 = response.day0;
} else {
    setHistoryData([]);
    alert(response.Result);
  }
}

export function fillHistoryTable() {
  const day0 = dayjs(historyData.day0);//.format('M/D/YYYY');
  for (let i=0; i<14; i++) {
    document.querySelector(`#js-ht-day${i}`).innerText = day0.add(i, 'day').format('M/D/YYYY');
  }

  let workedHours;
  let offHours;
  let workedTotalHours = 0;
  let offTotalHours = 0;
  let text;

  for (let i=0; i<historyData.data.length; i++) {
    workedHours = historyData.data[i][0];
    workedTotalHours += workedHours;
    offHours = historyData.data[i][1];
    offTotalHours += offHours;

    if (workedHours === 0) {
      text = '-';
    } else {
      text = workedHours.toFixed(2);
    }
    document.querySelector(`#js-htwh-day${i}`).innerText = text;

    if (offHours === 0) {
      text = '-';
    } else {
      text = offHours.toFixed(2);
    }
    document.querySelector(`#js-htoh-day${i}`).innerText = text;

    if (workedHours + offHours === 0) {
      text = '-';
    } else {
      text = (workedHours + offHours).toFixed(2);
    }    document.querySelector(`#js-htth-day${i}`).innerText = text;
  }
  document.querySelector('#js-htwh-total').innerText = workedTotalHours.toFixed(2);
  document.querySelector('#js-htoh-total').innerText = offTotalHours.toFixed(2);
  document.querySelector('#js-htth-total').innerText = (workedTotalHours + offTotalHours).toFixed(2);
}

function setHistoryData(data) {
  // const copy = JSON.stringify(data);
  historyData.data = data;//JSON.parse(copy);
}

export function updateHistory(todaysHours) {
  historyData.data.pop();
  historyData.data.push(todaysHours);
  fillHistoryTable();
}