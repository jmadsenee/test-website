import { laborCodes } from "../scripts/timesheet/timeRecords.js";
import { removeTimeRecord, renderDialog2, closeSelectionWindow } from "../scripts/timesheet/modalWindows.js"


export const taskCatagory = {
  dataSet: 'taskCatagory',
  heading: 'Which best describes the TASK performed for this time entry?',
  list: [
    'Task for a Specific Project',
    'Task is Not Project Support',
    'Paid Time Off'
  ]
};

export const laborCatagory = {
  dataSet: 'laborCatagory',
  heading: 'Select Direct Labor Catagory',
  list: [
    'Field Tasks',
    'Office Tasks',
    'Prevailing Wage Tasks'
  ]
};

export let laborClass = {
  dataSet: 'laborClass',
  heading: 'Select a Labor Class',
  list: [
    '[View Help for "Class"]',
    'TL [Technical Labor]',
    'TFM [Technical Field Manager]'
  ]
};

export const removeDialog1 = {
  callback: renderDialog2,
  acceptButton: 'Remove',
  cancelButton: 'Do Not Remove',
  message: 'Select "Remove" to delete the Time Record.  Otherwise, select "Do Not Remove."'
}

export const removeDialog2 = {
  callback: removeTimeRecord,
  acceptButton: 'Remove This Time Entry',
  cancelButton: 'Cancel Remove Operation',
  message: 'Are you sure you want to Delete this time entry?'
}

export const timeError = {
  callback: closeSelectionWindow,
  acceptButton: 'OK',
  cancelButton: 'Cancel',
  message: 'Error entering Hours'
}

export function setLaborClass(selection) {
  const classes = selection[2].split(" ");
  console.log(classes);
  let index;
  laborClass.list = [];
  classes.forEach(element => {
    index = laborCodes[0].indexOf(element);
    laborClass.list.push([element, laborCodes[1][index], element, laborCodes[2][index]]);
  });
  console.log(laborClass.list);

}


export const testCostCode = {
  dataSet: 'costCode',
  heading: 'Select a Cost Code for "Direct Labor - Field"',
  list: [
    ['DLFAED000', 'Aerial Detail: Collect & Sketch', 'TL TFM', 'Direct Field Labor - Aerial Detail: Collect & Sketch\nValid Labor Classes - TL TFM\nCost Code - DLFAED000\n\nDescription: Labor to collect data for mapping Aerial (pole mounted utilities and related attachments). Code includes labor for creating field sketches. Local travel to and from the job site is coded to this Cost Code.  Mobilization time (overnight travel), if required, should be coded to a Direct Travel Cost Code.'],
    ['DLFDES000', 'Designating: Locate/Target & Sketch', 'TL TFM', 'Direct Field Labor - Designating: Locate/Target & Sketch\nValid Labor Classes - TL TFM\nCost Code - DLFDES000\n\nDescription: Locating using electronics and other information, demarcation of locates, field sketching and identification of utility systems. Local travel to and from the job site is coded to this Cost Code.  Mobilization time (overnight travel), if required, should be coded to a Direct Travel Cost Code.'],
    ['DLFDPL000', 'Plant Protection: Targeting', 'TL TFM', 'Direct Field Labor - Plant Protection: Targeting\nValid Labor Classes - TL TFM\nCost Code - DLFDPL000\n\nDescription: Plant protection utility stake out,  including travel time to the site, and return travel if it is the last site.'],
    ['DLFFLA000', 'Flagging & M.O.T.', 'TL TFM', 'Direct Field Labor - Flagging & M.O.T.\nValid Labor Classes - TL TFM\nCost Code - DLFFLA000\n\nDescription: Maintenance of traffic including setiing up and removing traffic control devices, and any type of active MOT such as flagging, paddle board, spotting, guide car operation, etc. Local travel to and from the job site is coded to this Cost Code.  Mobilization time (overnight travel), if required, should be coded to a Direct Travel Cost Code.'],
    ['DLFGIS000', 'GIS: Target & Attribute Collection', 'TL TFM', 'Direct Field Labor - GIS: Target & Attribute Collection\nValid Labor Classes - TL TFM\nCost Code - DLFGIS000\n\nDescription: For projects specifically field collecting data for inclusion in a GIS system. Includes labor for targeting utilities, identifying all features of interest, and documenting attributes as required. Local travel to and from the job site is coded to this Cost Code.  Mobilization time (overnight travel), if required, should be coded to a Direct Travel Cost Code.'],
    ['DLFGPR000', 'GPR: Locate & Sketch', 'TFM', 'Direct Field Labor - GPR: Locate & Sketch\nValid Labor Classes - TFM\nCost Code - DLFGPR000\n\nDescription: Labor for operating GPR equipment including interpretation and documentation of GPR results.  Local travel to and from the job site is coded to this Cost Code.  Mobilization time (overnight travel), if required, should be coded to a Direct Travel Cost Code.'],
    ['DLFMHD000', 'Manhole Detail/Blow Down', 'TL TFM', 'Direct Field Labor - Manhole Detail/Blow Down\nValid Labor Classes - TL TFM\nCost Code - DLFMHD000\n\nDescription: Labor for all types of investigations involving buried vaults and manholes, including sketches, photos and documentation, and confined space entry. Local travel to and from the job site is coded to this Cost Code.  Mobilization time (overnight travel), if required, should be coded to a Direct Travel Cost Code.'],
    ['DLFOTH000', 'Field Labor: Other (Add Note)', 'TL TFM', 'Direct Field Labor - Field Labor: Other (Add Note)\nValid Labor Classes - TL TFM\nCost Code - DLFOTH000\n\nDescription: Direct field labor for a predefined non-standard Direct Labor item specifically defined in a proposal or contract (ie, brush clearing, sample collection, etc.).  Use the "Note" section of the time sheet to enter the appropriate description or pre-determined line item name'],
    ['DLFREV000', 'QA/QC: Field Sweep & Review', 'TFM TUM TL', 'Direct Field Labor - QA/QC: Field Sweep & Review\nValid Labor Classes - TFM TUM TL\nCost Code - DLFREV000\n\nDescription: Labor for any type of field based QA/QC, grid sweeps, and field reviews.  Most review tasks involve a two person crew consisting of Labor Classes TL and TFM. Local travel to and from the job site is coded to this Cost Code.  Mobilization time (overnight travel), if required, should be coded to a Direct Travel Cost Code.'],
    ['DLFSET000', 'Test Holes: Set-Up', 'TL TFM', 'Direct Field Labor - Test Holes: Set-Up\nValid Labor Classes - TL TFM\nCost Code - DLFSET000\n\nDescription: Labor to locate the exact point where a test hole will be performed. When performed by a two person crew it will consist of a TL and a TFM. Local travel to and from the job site is coded to this Cost Code.  Mobilization time (overnight travel), if required, should be coded to a Direct Travel Cost Code.']
  ]
}