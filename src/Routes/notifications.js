const { Router } = require('express');
const router = new Router();
const conn = require('../Config/DatabaseConfig');
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    const sql = 'SELECT Nombre FROM Notificaciones WHERE FechaDeNotificacion <= CURDATE() AND Atendido = 0;';
    
    jwt.verify(req.body.token, 'secretkey', (err, authData) => {
      if(err) {
        res.sendStatus(403);
      } else {
        conn.query(sql, (error, results) => {
          if (error) throw error;
          if (results.length > 0) {
            res.json(results);
          } else {
            res.send('No hay notificaciones disponibles');
          }
          });
      }
    });
});

router.get('/:notificationName', (req, res) => {
  const { notificationName } = req.params;
  const sql = `CALL ActualizarNotificacionAVista('${notificationName}')`;

  jwt.verify(req.body.token, 'secretkey', (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      conn.query(sql, (error, result) => {
        if (error){
          res.send(error.sqlMessage);
          return;
        }
    
        if (result.affectedRows <= 0) {
          res.send(`La notificacion '${notificationName}' ya esta desactivada`);
          return;
        } else {
          res.send(`La notificacion '${notificationName}' ha sido marcada como vista`);
        }
      });
    }
  });
 
});

module.exports = router;