const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const { GoogleAuth } = require('google-auth-library');
const conn = require('../Config/DatabaseConfig');

/**
 * Esta funcion insertara en la base de datos toda la informacion que se encuentre en los googlesheets dentro del drive
 * @param {GoogleAuth} auth 
 * 
 */
function insertDataInDatabaseFromSpreedsheets(auth) {
    const drive = google.drive({version: 'v3', auth});
    drive.files.list({  //Se listan todos los archivos dentro del drive
      pageSize: 10,
      fields: 'nextPageToken, files(id, name)', //Te devolvera todos los nombres y IDs de los archivos
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const files = res.data.files;
      if (files.length) { //Si recibio archvios, entonces los listara
        console.log('Files:');
        files.map((file) => {
          console.log(`${file.name} (${file.id})`);
          if(file.name == 'Prueba 1'){
            extractDataFromSpreedSheetFormat1(file.id, auth);
          }else if(file.name == 'Prueba 2'){
            extractDataFromSpreedSheetFormat2(file.id, auth);
          }else if(file.name == 'Prueba 3'){
            extractDataFromSpreedSheetFormat3(file.id,auth);
          }
        });
      } else {
        console.log('No files found.');
      }
    });
}
/**
 * Extraera toda la informacion del google sheet con el formato "1 FORMATO INCLUSIÓN SEGURO SOCIAL"
 * @param {String} spreadsheetID 
 * @param {GoogleAuth} auth 
 */
function extractDataFromSpreedSheetFormat1(spreadsheetID,auth) {
  //console.log(spreadsheetID);
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetID,
    range: "FORMATO INGRESO AL IVSS!A11:U", //El rango especifico para este formato
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    if(typeof rows === 'undefined') return console.log('No hay informacion en el spreedsheet '+ spreadsheetID); //En caso de que el spreedsheet este vacio
    if (rows.length) {
      rows.map((row) => {
        //console.log(`${row[0]}, ${row[1]}, ${row[2]},${row[3]}, ${row[4]}, ${row[5]},${row[6]}, ${row[7]}, ${row[8]},${row[9]}, ${row[10]}, ${row[11]},${row[12]}, ${row[13]}, ${row[14]}`);
        if(!(row[0] || row[1]) == ""){
          uploadFormat1(row) //Envia cada fila a que se suba a la base de datos
        }
      });
    } else {
      console.log('No data found.');
    }
  });
}
/**
 * Extraera toda la informacion del google sheet con el formato "3 FORMATO ACTUALIZACIÓN DE SALARIOS"
 * @param {String} spreadsheetID 
 * @param {GoogleAuth} auth 
 */
function extractDataFromSpreedSheetFormat2(spreadsheetID,auth) {
  //console.log(spreadsheetID);
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetID,
    range: "ACTUALIZACIÓN DE SALARIOS!A13:L", //El rango especifico para este formato
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    if(typeof rows === 'undefined') return console.log('No hay informacion en el spreedsheet '+ spreadsheetID);
    if (rows.length) {
      rows.map((row) => {
        //console.log(`${row[0]}, ${row[1]}, ${row[2]},${row[3]}, ${row[4]}, ${row[5]},${row[6]}, ${row[7]}, ${row[8]},${row[9]}, ${row[10]}, ${row[11]}`);
        if(!(row[0] || row[1]) == ""){
          uploadFormat2(row)
        }
      });
    } else {
      console.log('No data found.');
    }
  });
}
/**
 * Extraera toda la informacion del google sheet con el formato "4 FORMATO CARGA DE FAMILIARES- MASIVAMENTE"
 * @param {String} spreadsheetID 
 * @param {GoogleAuth} auth 
 */
function extractDataFromSpreedSheetFormat3(spreadsheetID,auth) {
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetID,
    range: "Hoja1!A12:U",
  },  (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    if(typeof rows === 'undefined') return console.log('No hay informacion en el spreedsheet '+ spreadsheetID); //El rango especifico para este formato
    if (rows.length) {
      rows.map((row) => {
        //console.log(`${row[0]}, ${row[1]}, ${row[2]},${row[3]}, ${row[4]}, ${row[5]},${row[6]}, ${row[7]}, ${row[8]},${row[9]}, ${row[10]}, ${row[11]}`);
        if(!(row[0] || row[1]) == ""){
          uploadFormat3(row)
        }
      });
    } else {
      console.log('No data found.');
    }
  });
}

/**
 * Con una fila de informacion, la interpreta segun el formato "1 FORMATO INCLUSIÓN SEGURO SOCIAL" y la sube a la base de datos
 * @param {Array[]} row 
 */
function uploadFormat1(row){
  //Separamos el nombre completo del trabajador en partes
  const workerCompleteName = String(row[3]).split(" ");
  //es zurdo
  let islefthanded;
  if(String(row[8]).length){
    islefthanded = true;
  }else if(String(row[9]).length){
    islefthanded = false;
  }
  //Fecha de nacimiento
  const birthDate = String(row[10]) +"-"+ String(row[11]) +"-"+ String(row[12]);
  //Creacion del JSON
  var worker = {
    entryDateIVSS: row[0],
    COD: row[1],
    ID: row[2],
    firstName: workerCompleteName[0],
    middleName: workerCompleteName[1],
    surname: workerCompleteName[2],
    secondSurname: workerCompleteName[3],
    secureNumber: row[5],
    birthDate: row[6],
    genre: row[7],
    isLeftHanded: islefthanded,
    birthdate: birthDate,
    weeklySalary: row[13],
    ocupation: row[14],
    address: row[17]
  }
  let jsonWorker = JSON.stringify(worker);

  const sql = 'INSERT INTO Trabajadores SET ?';


}
/**
 * Con una fila de informacion, la interpreta segun el formato "3 FORMATO ACTUALIZACIÓN DE SALARIOS" y la sube a la base de datos
 * @param {Array[]} row 
 */
function uploadFormat2(row){
//No recojo nombre ya que no lo necesito para la bbdd
  let date = new Date(row[8]);
  dateInFormat = `${date.getFullYear}-${date.getDay}-${date.getMonth}`
  console.log(Number(row[6].replace(',','.'))); 
  var salaryChangeObj = {
    Cedula: row[0],
    salarioSemanalNuevo: Number(row[6].replace(',','.')),
    fechaCambio: date,
    Motivo:row[10]
  }
  let json = JSON.stringify(salaryChangeObj);
  const sql = 'INSERT INTO CambiosSalarios SET ?';

  /*conn.query(sql, salaryChangeObj, error => {
    if (error) throw error;
  });*/
}
/**
 * Con una fila de informacion, la interpreta segun el formato "4 FORMATO CARGA DE FAMILIARES- MASIVAMENTE" y la sube a la base de datos
 * @param {Array[]} row 
 */
function uploadFormat3(row){
  const workerRelativeCompleteName = String(row[14]).split(" ");

  let genre;

  if(String(row[12]).length && row[13].length == 0 ){
    genre = 'M';
  }else if(String(row[13]).length && row[12].length == 0){
    genre = 'F';
  }else if(row[12].length && row[13].length){
    console.log('Las dos casillas de genero estan marcadas, por favor, solo marque una');
  }

  const birthdate = String(row[20]) +"-"+ String(row[19]) +"-"+ String(row[18]);

    var workerRelativeObj = {
      CedulaTrabajador: row[0],
      Cedula: row[9],
      PrimerNombre: workerRelativeCompleteName[0],
      SegundoNombre:workerRelativeCompleteName[1],
      PrimerApellido: workerRelativeCompleteName[2],
      SegundoApellido: workerRelativeCompleteName[3],
      FechaNacimiento: birthdate,
      Genero: genre,
      Parentesco: row[7], 
    }
    let json = JSON.stringify(workerRelativeObj);

    const sql = 'INSERT INTO Familiares SET ?';

   /* conn.query(sql, workerRelativeObj, error => {
      if (error) throw error;
    });*/
  }

exports.insertDataInDatabaseFromSpreedsheets = insertDataInDatabaseFromSpreedsheets;