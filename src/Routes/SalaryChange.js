const { Router } = require('express');
const router = new Router();
const conn = require('../Config/DatabaseConfig');
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    const sql = 'SELECT * FROM CambiosSalarios';

    jwt.verify(req.body.token, 'secretkey', (err, authData) => {
      if(err) {
        res.sendStatus(403);
      } else {
        conn.query(sql, (error, results) => {
          if (error){
            res.send(error.sqlMessage);
            return;
          }
          else if (results.length > 0) {
            res.json(results);
          } else {
            res.send('No hay cambios de salarios');
          }
          });
      }
    });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  console.log(id);
  const sql = `SELECT * FROM CambiosSalarios WHERE Cedula = ${id}`;
  
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
          res.send('No hay cambios de salarios relacionados con esta cedula');
        }
      });
    }
  });
});

router.post('/add', (req, res) => {
    const sql = 'INSERT INTO CambiosSalarios SET ?';
  
    const salaryChangeObj = {
      cedula: req.body.Cedula,
      fechaCambio: req.body.FechaCambio,
      motivo: req.body.Motivo,
      salarioSemanalNuevo: req.body.SalarioSemanalNuevo,
    };
    
    //Validaciones

    let regexpID = new RegExp(/^\d{1,3}\.\d{3,3}\.\d{3,3}$/,"gm");
    let regexpReason = RegExp(/^[A-Za-z.\s]*$/,"gm");    
    
    if(!(regexpID.test(String(salaryChangeObj.cedula)))){
      res.send('La cedula tiene que seguir el formato xx.xxx.xxx, no puede contener simbolos');
      return;
    }else if(Date(salaryChangeObj.fechaCambio) > Date.now()){
      res.send('La fecha de cambio de salario no puede ser mayor a la fecha de hoy');
      return;
    }else if(!(regexpReason.test(String(salaryChangeObj.Motivo)))){
      res.send('El motivo solo puede incluir letras, puntos y espacios');
      return;
    }else if(Number(salaryChangeObj.salarioSemanalNuevo) <= 0){
      res.send('El nuevo salario debe ser mayor a cero');
      return;
    }
    
    jwt.verify(req.body.token, 'secretkey', (err, authData) => {
      if(err) {
        res.sendStatus(403);
      } else {
        conn.query(sql, salaryChangeObj, error => {
          if (error){
            res.send(error.sqlMessage);
            return;
          }
          res.send(`El salario actual de '${salaryChangeObj.cedula}'`);
        });
      }
    });
});
/*
router.delete('/delete/:id/:date', (req, res) => {
    const { id, date } = req.params;
    const sql = `DELETE FROM CambiosSalarios WHERE Cedula = '${id}' AND FechaCambio = '${date}'`;

    jwt.verify(req.body.token, 'secretkey', (err, authData) => {
      if(err) {
        res.sendStatus(403);
      } else {
        conn.query(sql, error => {
          if (error){
            res.send(error.sqlMessage);
            return;
          }
          res.send('El salario ha sido eliminado');
        });
      }
    });
  });
  */
module.exports = router;