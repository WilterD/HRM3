const { Router } = require('express');
const router = new Router();
const conn = require('../Config/DatabaseConfig');
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    const sql = 'SELECT * FROM NuevosIngresos';

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
          res.send('No se ha encontrado resultado');
        }
        });
      }
    });
  
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  console.log(id);
  const sql = `SELECT * FROM NuevosIngresos WHERE Cedula = '${id}'`;

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
          res.send('No se ha encontrado trabajador nuevo con esa cedula');
        }
      });
    }
  });
});

module.exports = router;