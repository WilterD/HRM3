const { Router } = require('express');
const router = new Router();
const conn = require('../Config/DatabaseConfig');
const jwt = require('jsonwebtoken');

router.get('/AnualSalaryChanges', (req, res) => {
    const sql = 'CALL totalCambiosSalariosAnual();';

    jwt.verify(req.body.token, 'secretkey', (err, authData) => {
      if(err) {
        res.sendStatus(403);
      } else {
        conn.query(sql, (error, results) => {
          if (error) throw error;
          if (results.length > 0) {
            res.json(results);
          } else {
            res.send('No hay resultados');
          }
        });
      }
    });
});

router.get('/AnualRetiredWorkers', (req, res) => {
  const sql = 'CALL totalEmpleadosRetiradosAnual();';

  jwt.verify(req.body.token, 'secretkey', (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      conn.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
          res.json(results);
        } else {
          res.send('No hay resultados');
        }
      });
    }
  });
});

router.get('/AnualRetiredWorkersByGender', (req, res) => {
  const sql = 'CALL totalEmpleadosRetiradosAnual();';

  jwt.verify(req.body.token, 'secretkey', (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      conn.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
          res.json(results);
        } else {
          res.send('No hay resultados');
        }
      });
    }
  });
});

router.get('/AnualNewWorkers', (req, res) => {
  const sql = 'CALL totalNuevoIngresosAnual();';

  jwt.verify(req.body.token, 'secretkey', (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      conn.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
          res.json(results);
        } else {
          res.send('No hay resultados');
        }
      });
    }
  });
});


router.get('/AnualNewWorkersByGender', (req, res) => {
  const sql = 'CALL totalNuevoIngresosAnualPorGenero();';

  jwt.verify(req.body.token, 'secretkey', (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      conn.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
          res.json(results);
        } else {
          res.send('No hay resultados');
        }
        });
    }
  });

});

module.exports = router;