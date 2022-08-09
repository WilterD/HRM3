const { Router } = require('express');
const router = new Router();
const conn = require('../Config/DatabaseConfig');
const jwt = require('jsonwebtoken');

/*LogIn*/
router.get('/login/:id/:password', (req, res) => {
    const { id } = req.params;
    const { password } = req.params;
   
    const sql = `SELECT * FROM Usuarios WHERE id_user = '${id}' AND password_user = '${password}'`;
    conn.query(sql, (error, result) => {
      if (error) throw error;
  
      if (result.length > 0) {
        jwt.sign({result}, 'secretkey', (err, token) => {
          console.log(token);
          res.json({
            "acceso": true,
            token
          });
        });
      } else {
        res.json({"acceso": false});
      }
    });
});

router.post('/signin', (req, res) => {
    const sql = 'INSERT INTO Usuarios SET ?';
  
    const userObj = {
      id_user: req.body.cedula,
      email: req.body.email,
      password_user: req.body.contraseña,
    };
    
    // Aqui poner las verificaciones
    
    conn.query(sql, userObj, error => {
      if (error) throw error;
      res.send('Usuario creado!');
    });
});

router.delete('/delete/:id/:password',(req, res) => {
    const { id, password } = req.params;
    const sql = `DELETE FROM Usuarios WHERE id_user = '${id}' AND password_user = '${password}'`;
    
    jwt.verify(req.body.token, 'secretkey', (err, authData) => {
      if(err) {
        res.sendStatus(403);
      } else {
        conn.query(sql, error => {
          if (error) throw error;
          
          res.send('Usuario Eliminado');
        });
      }
    });
  });

router.put('/update/:id/:password', (req, res) => {
    const { id, password } = req.params;
    const {email,password_user} = req.body;
      const sql = 'UPDATE Usuarios SET '  +
      `email='${email}',` + 
      `password_user='${password_user}'` +
      ` WHERE id_user = '${id}' AND password_user = '${password}'`;

    jwt.verify(req.body.token, 'secretkey', (err, authData) => {
      if(err) {
        res.sendStatus(403);
      } else {
        conn.query(sql, error => {
          if (error) throw error;
          res.send('Worker updated!');
        });
      }
    });    
});

module.exports = router;