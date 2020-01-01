const fs = require('fs');

let spJSON;
let fileError = "none";

let options = {encoding: 'utf8',flag: 'r'};
let paramsObj;
let spStarted = false;
let freqs = [];

let spComplete = {};
let data;
let numberOfPorts;

const spToJSON = function(filename) {
  
  var ext = filename.split(".")[filename.split(".").length-1];
  numberOfPorts = ext.replace(/[p P]/,"").replace(/[s S]/,"");
  if (ext.toLowerCase() != 's2p') {
    fileError = "Incorrect File Extension. Must be s2p.";
  }
  var stats = fs.statSync(filename);
  if (stats.size == 0) {
    fileError = "ERROR: Empty File";
  }
  if (fileError === "none") {
   
      try {data = fs.readFileSync(filename,options);}
      catch(error) {console.error("Failed to open file.")}
      //will throw system error message
      
      getS(data);
    
  }
return {fileError, spJSON};
}

function getS(data) {
    //remove blanklines
    spStarted = false;
    freqs = [];
    let s11a = [];
    let s21a = [];
    let s12a = [];
    let s22a = [];
    let s11b = [];
    let s21b = [];
    let s12b = [];
    let s22b = [];
    const text = data.split(/\n/);
    //check for definition line beginning with #
    let defLine = false;
    text.forEach((text) => {
      if (text.startsWith("#")){
        defLine = true;
      }
    })
    if (defLine === true) {
      for (let i=0;i < text.length;i++) {
        if (text[i].startsWith("!")) {
          if(spStarted) {
            i = text.length;
          }
        }
        else if (text[i].startsWith("#")) {
          if (text[i].split(/[ ]+/).length != 6) {
            fileError = "ERROR: Incorrect definition line.";
          }
          else { paramsObj = {
            freqUnits: text[i].split(/[ ]+/)[1],
            networkType: text[i].split(/[ ]+/)[2],
            dataFormat: text[i].split(/[ ]+/)[3],
            systemImpedance: text[i].split(/[ ]+/)[5].trim(),
            numPorts: numberOfPorts
            }
          }
        }
        else if (text[i].match(/^\d/)) {
          spStarted = true;
          let line = "";
          line = text[i].replace(/\s+/g, ",").split(",");           
          freqs.push(line[0]);
          s11a.push(line[1]);
          s11b.push(line[2]);
          if (numberOfPorts == 2) {
            s21a.push(line[3]);
            s21b.push(line[4]);
            s12a.push(line[5]);
            s12b.push(line[6]);
            s22a.push(line[7]);
            s22b.push(line[8]);
          }
        }
      }
      spComplete.params = paramsObj;
      spComplete.freqs = freqs;
      spComplete.s11a = s11a;
      spComplete.s11b = s11b;
      if (numberOfPorts == 2) {
        spComplete.s21a = s21a;
        spComplete.s21b = s21b;
        spComplete.s12a = s12a;
        spComplete.s12b = s12b;
        spComplete.s22a = s22a;
        spComplete.s22b = s22b;
      }
      spJSON = JSON.stringify(spComplete);
    }
    else {
      fileError = "No definition line."
    }
}

module.exports = {
  spToJSON: spToJSON
}
  

