const id = '1GqJfbPYwLsAPW3XKSOgCLZy5QXeci-0IG331Ak34rNc';

const sheetName1 = 'Players';
const sheetName2 = 'TeamPoints';
const ss1 = SpreadsheetApp.openById(id);

const sheet1 = ss1.getSheetByName(sheetName1);
const sheet2= ss1.getSheetByName(sheetName2);

function outputPlayers(type) {
  const range = sheet1.getDataRange();
  const data = range.getValues();

  const headings = data[0].map((col)=>{
    return col.toString().toLowerCase();
  });

  const rows = data.slice(1); // removing 1st row i.e heading row

  if(type == 'unsoldPlayers')
    return (convertToObjectArray(rows, headings));
  else if(type == 'players' || type == 'all')
    return (convertToObjectArray2(rows, headings));
  else if(type == 'teams'){
    return (convertToObjectArray3());
  }

}

function convertToObjectArray(rows, headings){
   const temp = [];
   rows.map((row)=>{
     const myObj = {};
     headings.forEach((heading,index)=>{
       myObj[heading] =  row[index];
     });

      if(myObj.soldto == 'none')
        temp.push( myObj);
   });

  Logger.log(temp);
   return temp;
}

function convertToObjectArray2(rows, headings){
   const temp = [];
   rows.map((row)=>{
     const myObj = {};
     headings.forEach((heading,index)=>{
       myObj[heading] =  row[index];
     });
      
      temp.push( myObj);
   });

  Logger.log(temp);
   return temp;
}

function convertToObjectArray3(){
  const range = sheet2.getDataRange();
  const data = range.getValues();

  const headings = data[0].map((col)=>{
    return col.toString().toLowerCase();
  });

  const rows = data.slice(1); // removing 1st row i.e heading row

   const temp = [];
   rows.map((row)=>{
     const myObj = {};
     headings.forEach((heading,index)=>{
       myObj[heading] =  row[index];
     });
      
      temp.push( myObj);
   });

  Logger.log(temp);
   return temp;
}

function doGet(e){

  // const body = e.getData.contents;
  // const bodyJSON = JSON.parse(body);

  const type = e.parameter.requestType;
  const output = JSON.stringify({
        status: 'success',
        data: outputPlayers(type),
    });

  return ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.JSON);
}


//_____________________________________________________________________________________________
//Post requests below:

function updateRowInPlayers(bodyJSON){
  var lastRowEdit = sheet1.getLastRow();
  
  for(var i = 2; i <= lastRowEdit; i++)
  {  
   
   if(sheet1.getRange(i,1).getValue() == bodyJSON.id)
   {
     sheet1.getRange('G' + i).setValues([[bodyJSON.soldto]]);     
   }    
  }  
}

function updateRowInTeams(bodyJSON){
  var lastRowEdit = sheet2.getLastRow();
  
  for(var i = 2; i <= lastRowEdit; i++)
  {  
   
   if(sheet2.getRange(i,1).getValue() == bodyJSON.name)
   {
     sheet2.getRange('B' + i).setValues([[bodyJSON.pointsused]]);     
   }    
  }  
}

function editTeamPlayerList(teamname,bodyJSON){

  const sheet= ss1.getSheetByName(teamname);
  sheet.appendRow([bodyJSON.id,bodyJSON.name,bodyJSON.dept, bodyJSON.year,bodyJSON.speciality, bodyJSON.wk, bodyJSON.point, bodyJSON.contact,bodyJSON.email]);  

}

function addLogs(bodyJSON){

  const sheet= ss1.getSheetByName('logs');
  sheet.appendRow([bodyJSON.id,bodyJSON.name,bodyJSON.dept, bodyJSON.year,bodyJSON.speciality, bodyJSON.wk,bodyJSON.soldto, bodyJSON.point]);  

}


function doPost(e){
  const body = e.postData.contents;
  const bodyJSON = JSON.parse(body);

  const type = e.parameter.requestType;

  if(type == 'updatePlayer'){
    updateRowInPlayers(bodyJSON);
    return ContentService.createTextOutput(JSON.stringify({status: "success", data: "good boi"})).setMimeType(ContentService.MimeType.JSON);
  }
  else if(type == 'updateTeam'){
    updateRowInTeams(bodyJSON);
  }
  else if(type == 'editTeamPlayerList'){
    const teamname = e.parameter.teamname;
    editTeamPlayerList(teamname,bodyJSON);
  }
  else if(type == 'addLogs'){
    addLogs(bodyJSON);
  }


  return ContentService.createTextOutput(JSON.stringify({status: "success", data: "my-data"})).setMimeType(ContentService.MimeType.JSON);
}


//Temps:

// function doPost(e){
//   const body = e.postData.contents;
//   const bodyJSON = JSON.parse(body);

//   const id = '1GqJfbPYwLsAPW3XKSOgCLZy5QXeci-0IG331Ak34rNc';

//   const sheetName = 'Sheet1';
//   const ss = SpreadsheetApp.openById(id);

//   const sheet = ss.getSheetByName(sheetName);

//   sheet.appendRow([bodyJSON.email,bodyJSON.pwd]);
//   return ContentService.createTextOutput(JSON.stringify({status: "success", "data": "my-data"})).setMimeType(ContentService.MimeType.JSON);
  
// }

// function clearRow() {
  
//   var ss = SpreadsheetApp.getActiveSpreadsheet();  
//   var editSheet = ss.getSheetByName("EDIT"); 
//   var lastRowEdit = editSheet.getLastRow();
  
//   for(var i = 2; i <= lastRowEdit; i++)
//   {  
   
//    if(editSheet.getRange(i,1).getValue() == 'TRAIN')
//    {
//      editSheet.getRange('A' + i + ':C' + i).clear();     
//    }    
//   }    
// }

// function deleteRow() {
  
//   var ss = SpreadsheetApp.getActiveSpreadsheet(); 
//   var editSheet = ss.getSheetByName("EDIT"); 
//   var lastRowEdit = editSheet.getLastRow();
  
//   for(var i = 2; i <= lastRowEdit; i++)
//   {  
   
//    if(editSheet.getRange(i,1).getValue() == 'TRAIN')
//    {
//      editSheet.deleteRow(i);    
//    }
    
//   }    
// }

// function insertRow() {
  
//   var ss = SpreadsheetApp.getActiveSpreadsheet(); 
//   var editSheet = ss.getSheetByName("EDIT"); 
//   var lastRowEdit = editSheet.getLastRow();
  
//   for(var i = 2; i <= lastRowEdit; i++)
//   {  
   
//    if(editSheet.getRange(i,1).getValue() == 'TRAIN')
//    {
//      editSheet.insertRowAfter(i);    
//    }
    
//   }   
// }

// function replaceRow() {
  
//   var ss = SpreadsheetApp.getActiveSpreadsheet();  
//   var editSheet = ss.getSheetByName("EDIT"); 
//   var lastRowEdit = editSheet.getLastRow();
  
//   for(var i = 2; i <= lastRowEdit; i++)
//   {  
   
//    if(editSheet.getRange(i,1).getValue() == 'TRAIN')
//    {
//      editSheet.getRange('A' + i + ':C' + i).setValues([['AIRPLANE', 'ORANGE', 30]]);     
//    }    
//   }   
// }

