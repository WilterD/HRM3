const { Router } = require('express');
const router = new Router();
const conn = require('../Config/DatabaseConfig');
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    const sql = 'SELECT * FROM Permisos';

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
            res.send('No hay permisos');
          }
        });
      }
    });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  console.log(id);
  const sql = `SELECT * FROM Permisos WHERE Cedula = ${id}`;
  
  jwt.verify(req.body.token, 'secretkey', (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      conn.query(sql, (error, result) => {
        if (error){
          res.send(error.sqlMessage);
          return;
        }else if (result.length > 0) {
          res.json(result);
        } else {
          res.send(`No hay permisos asociados a este trabajador '${id}'`);
        }
      });
    }
  });
});

router.post('/add', (req, res) => {
  const sql = 'INSERT INTO Permisos SET ?';

  const workRestLeaveObj = {
    Cedula: req.body.Cedula,
    FechaReposo: req.body.FechaReposo,
    Motivo: req.body.Motivo,
    DiasEnReposo: req.body.DiasEnReposo,
  };
  
  // Aqui poner las verificaciones
  let arrayMotive = ['Enfermedad','Accidente','Reposo','Maternidad'];

  let regexpID = new RegExp(/^\d{1,3}\.\d{3,3}\.\d{3,3}$/,"gm");

  if(!(regexpID.test(String(workRestLeaveObj.cedula)))){
    res.send('La cedula tiene que seguir el formato xx.xxx.xxx, no puede contener simbolos');
    return;
  }else if(Date(workRestLeaveObj.FechaReposo) > Date.now()){
    res.send('La fecha de reposo no puede ser mayor a la fecha de hoy');
    return;
  }else if(Number(workRestLeaveObj.DiasEnReposo) <= 0){
    res.send('La cantidad de dias de reposo debe ser mayor a 0');
    return;
  }else if(!(arrayMotive.indexOf(workRestLeaveObj.Motivo) > -1)){
    res.send('Ingrese un motivo valido: Enfermedad,Accidente,Reposo,Maternidad');
    return;
  }


  jwt.verify(req.body.token, 'secretkey', (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      conn.query(sql, workRestLeaveObj, error => {
        if (error) throw error;
        res.send('El permiso ha sido creado');
      });
    }
  });
});


module.exports = router;