const { Router } = require('express');
const router = new Router();
const conn = require('../Config/DatabaseConfig');
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    const sql = 'SELECT * FROM PermisosContinuos';

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
            res.send('No hay permisos continuos');
          }
        });
      }
    });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  console.log(id);
  const sql = `SELECT * FROM PermisosContinuos WHERE Cedula = ${id}`;
  
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
          res.send(`No hay permisos continuos asociados a este trabajador '${id}'`);
        }
      });
    }
  });
});

router.get('/:id/:date', (req, res) => {
    const { id,date } = req.params;
    console.log(id);
    const sql = `SELECT * FROM PermisosContinuos WHERE Cedula = '${id}' AND FechaInicio = '${date}'`;
    
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
            res.send(`No hay permisos continuos asociados a este trabajador '${id}', en esta fecha '${date}'`);
          }
        });
      }
    });
});

router.get('/workReastLeave/:id/:date', (req, res) => {
  const { id,date } = req.params;
  console.log(id);
  const sql = `CALL PermisosDentroDePermisoContinuo('${date}','${id}');`;
  
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
          res.send(`No hay permisos continuos asociados a este trabajador '${id}', en esta fecha '${date}'`);
        }
      });
    }
  });
});


module.exports = router;