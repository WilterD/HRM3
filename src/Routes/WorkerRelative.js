const { Router } = require('express');
const router = new Router();
const conn = require('../Config/DatabaseConfig');
const age = require('../Helpers/ageCalculator');
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    const sql = 'SELECT * FROM Familiares';

    jwt.verify(req.body.token, 'secretkey', (err, authData) => {
      if(err) {
        res.sendStatus(403);
      } else {
        conn.query(sql, (error, results) => {
          if (error){
            res.send(error.sqlMessage);
            return;
          }
          if (results.length > 0) {
            res.json(results);
          } else {
            res.send('No se han encontrado familiares');
          }
        });
      }
    });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM Familiares WHERE Cedula = ${id}`;
  
  jwt.verify(req.body.token, 'secretkey', (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      conn.query(sql, (error, result) => {
        if (error){
          res.send(error.sqlMessage);
          return;
        }
        if (result.length > 0) {
          res.json(result);
        } else {
          res.send('no se han encontrado familiares asociados a esta cedula');
        }
      });
    }
  });
  
});

router.post('/add', (req, res) => {
    const sql = 'INSERT INTO Familiares SET ?';
  
    const workerRelativeObj = {
      CedulaTrabajador: req.body.CedulaTrabajador,
      Cedula: req.body.Cedula,
      COD: req.body.COD,
      PrimerNombre: req.body.PrimerNombre,
      SegundoNombre: req.body.SegundoNombre,
      PrimerApellido: req.body.PrimerApellido,
      SegundoApellido: req.body.SegundoApellido,
      FechaNacimiento: req.body.FechaNacimiento,
      Genero: req.body.Genero,
      Parentesco: req.body.Parentesco,
    };
    
    // Aqui poner las verificaciones

    let arrayGenre = ['M', 'F'];
    let arrayRelationship = ['Hijo', 'Conyuge'];
    let arrayCOD = ['V', 'E'];
  
    let regexpID = new RegExp(/^\d{1,3}\.\d{3,3}\.\d{3,3}$/,"gm");
    let regexpName = RegExp(/^[A-Za-z]*$/,"gm");    
      
    if(!(regexpID.test(String(workerRelativeObj.cedula)))){
      res.send('La cedula tiene que seguir el formato xx.xxx.xxx, no puede contener simbolos');
      return;
    }else if(!(regexpID.test(String(workerRelativeObj.CedulaTrabajador)))){
      res.send('La cedula del trabajador tiene que seguir el formato xx.xxx.xxx, no puede contener simbolos');
      return;
    }else if(Date(workerRelativeObj.FechaNacimiento) > Date.now()){
      res.send('La fecha de nacimiento no puede ser mayor a la fecha de hoy');
      return;
    }else if(!(regexpName.test(workerRelativeObj.PrimerNombre))){
      res.send('El primer nombre solo puede incluir letras, sin espacios blancos, numeros o caracteres especiales');
      return;
    }else if(!(regexpName.test(workerRelativeObj.SegundoNombre))){
      res.send('El segundo nombre solo puede incluir letras, sin espacios blancos, numeros o caracteres especiales');
      return;
    }else if(!(regexpName.test(workerRelativeObj.PrimerApellido))){
      res.send('El primer apellido solo puede incluir letras, sin espacios blancos, numeros o caracteres especiales');
      return;
    }else if(!(regexpName.test(workerRelativeObj.SegundoApellido))){
      res.send('El segundo apellido solo puede incluir letras, sin espacios blancos, numeros o caracteres especiales');
      return;
    }else if(!(arrayRelationship.indexOf(workerRelativeObj.COD) > -1)){
      res.send('Ingrese una relacion valida (Hijo, Conyuge)');
      return;
    }else if(!(arrayGenre.indexOf(workerRelativeObj.Genero) > -1)){
      res.send('El genero debe ser "M", "F"');
      return;
    }else if(!(arrayCOD.indexOf(COD) > -1)){
      res.send('El COD, tiene que ser "V","E"');
      return;
    }
    
    jwt.verify(req.body.token, 'secretkey', (err, authData) => {
      if(err) {
        res.sendStatus(403);
      } else {
        conn.query(sql, workerRelativeObj, error => {
          if (error){
            res.send(error.sqlMessage);
            return;
          }
          res.send('El familiar ha sido  creado');
        });
      }
    });
});

router.delete('/delete/:id', (req, res) => {
    const { id, date } = req.params;
    const sql = `DELETE FROM Familiares WHERE Cedula = '${id}'`;

    jwt.verify(req.body.token, 'secretkey', (err, authData) => {
      if(err) {
        res.sendStatus(403);
      } else {
        conn.query(sql, error => {
          if (error){
            res.send(error.sqlMessage);
            return;
          }else if(result.affectedRows <= 0){
            res.send(`No existe un familiar con esta cedula '${id}'`);
            return;
          }
          res.send('Familiar eliminado');
        });
      }
    });
});

router.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { CedulaTrabajador, Cedula, COD, PrimerNombre, SegundoNombre, PrimerApellido, SegundoApellido,Genero,FechaNacimiento, Parentesco} = req.body;
    const sql = 'UPDATE Familiares SET '  +
    `COD='${COD}',` + 
    `PrimerNombre='${PrimerNombre}',`+
    `SegundoNombre='${SegundoNombre}',`+
    `PrimerApellido='${PrimerApellido}',`+
    `SegundoApellido='${SegundoApellido}',`+
    `Genero='${Genero}',`+
    `FechaNacimiento='${FechaNacimiento}',`+
    `Ocupacion='${Parentesco}',`+
    `WHERE Cedula='${id}'`;

    let arrayGenre = ['M', 'F'];
    let arrayCOD = ['V', 'E'];

    let regexpID = new RegExp(/^\d{1,3}\.\d{3,3}\.\d{3,3}$/,"gm");
    let regexpName = RegExp(/^[A-Za-z]*$/,"gm");    

    let birthdate = new Date(FechaNacimiento);
    if(Date(FechaNacimiento) > Date.now()){
      res.send('La fecha de nacimiento no puede ser mayor a la fecha de hoy');
      return;
    }else if(!(regexpName.test(PrimerNombre))){
      res.send('El primer nombre solo puede incluir letras, sin espacios blancos, numeros o caracteres especiales');
      return;
    }else if(!(regexpName.test(SegundoNombre))){
      res.send('El segundo nombre solo puede incluir letras, sin espacios blancos, numeros o caracteres especiales');
      return;
    }else if(!(regexpName.test(PrimerApellido))){
      res.send('El primer apellido solo puede incluir letras, sin espacios blancos, numeros o caracteres especiales');
      return;
    }else if(!(regexpName.test(SegundoApellido))){
      res.send('El segundo apellido solo puede incluir letras, sin espacios blancos, numeros o caracteres especiales');
      return;
    }else if(!(arrayCOD.indexOf(COD) > -1)){
      res.send('El COD, tiene que ser "V","E"');
      return;
    }else if(!(arrayGenre.indexOf(Genero) > -1)){
      res.send('El genero debe ser "M", "F"');
      return;
    }

    jwt.verify(req.body.token, 'secretkey', (err, authData) => {
      if(err) {
        res.sendStatus(403);
      } else {
        conn.query(sql, error => {
          if (error){
            res.send(error.sqlMessage);
            return;
          }
          res.send(`El trabajador con la cedula '${id}'`);
        });
      }
    });
});

module.exports = router;