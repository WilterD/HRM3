const { Router } = require('express');
const router = new Router();
const conn = require('../Config/DatabaseConfig');
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    const sql = 'SELECT * FROM Retirados';

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
  const sql = `SELECT * FROM Retirados WHERE Cedula = ${id}`;

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
          res.send('No se ha encontrado trabajador retirado con esa cedula');
        }
      });
    }
  });
 
});

router.post('/add', (req, res) => {
  const sql = 'INSERT INTO Retirados SET ?';

  const retiredWorkerObj = {
    Cedula: req.body.Cedula,
    FechaRetiro: req.body.FechaRetiro,
    Motivo: req.body.Motivo
  };
  let arrayAux = ['Jubilado', 'Despedido'];
  // Aqui poner las verificaciones
  let regexpID = new RegExp(/^\d{1,3}\.\d{3,3}\.\d{3,3}$/,"gm");
  
  if(!(regexpID.test(String(retiredWorkerObj.Cedula)))){
    res.send('La cedula tiene que seguir el formato xx.xxx.xxx, no puede contener simbolos');
    return;
  }else if(Date(retiredWorkerObj.FechaRetiro) > Date.now()){
    res.send('La fecha de retiro no puede ser mayor a la fecha de hoy');
    return;
  }else if(!(arrayAux.indexOf(retiredWorkerObj.Motivo) > -1)){
    res.send('Ingrese una opcion valida en motivo debe estar entre las siguientes' + arrayAux);
    return;
  }


  jwt.verify(req.body.token, 'secretkey', (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      conn.query(sql, retiredWorkerObj, error => {
        if (error){
          res.send(error.sqlMessage);
          return;
        }
        res.send(`Se ha retirado al trabajador '${retiredWorkerObj.Cedula}'`);
      });
    }
  });
});

router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  let sql = `DELETE FROM Retirados WHERE Cedula = '${id}'`;

  jwt.verify(req.body.token, 'secretkey', (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      conn.query(sql, (error,result) => {
        if (error){
          res.send(error.sqlMessage);
          return;
        }if(result.affectedRows <= 0){
          res.send(`No existe un empleado con esta cedula '${id}'`);
          return;
        }
        res.send('Trabajador retirado ha sido eliminado');
      }); 
    }
  });
});


module.exports = router;