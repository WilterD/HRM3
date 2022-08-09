const { Router } = require('express');
const router = new Router();
const conn = require('../Config/DatabaseConfig');
const age = require('../Helpers/ageCalculator');
const jwt = require('jsonwebtoken');


router.get('/', (req, res) => {
    const sql = 'SELECT * FROM Trabajadores';

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
            res.send('No hay trabajadores');
          }
        });
      }
    });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  console.log(id);
  const sql = `SELECT * FROM Trabajadores WHERE Cedula = ${id}`;
  
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
          res.send(`No hay trabajadores con esta cedula '${id}'`);
        }
      });
    }
  });
});

router.get('/active', (req, res) => {
  const sql = 'SELECT * FROM TrabajadoresActivos';

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
          res.send('No hay trabajadores');
        }
      });
    }
  });
});

router.post('/add', (req, res) => {
  const sql = 'INSERT INTO Trabajadores SET ?';

  const workerObj = {
    cedula: req.body.Cedula,
    COD: req.body.COD,
    PrimerNombre: req.body.PrimerNombre,
    SegundoNombre: req.body.SegundoNombre,
    PrimerApellido: req.body.PrimerApellido,
    SegundoApellido: req.body.SegundoApellido,
    Genero: req.body.Genero,
    Direccion: req.body.Direccion,
    FechaNacimiento: req.body.FechaNacimiento,
    Ocupacion: req.body.Ocupacion,
    SalarioSemanal: req.body.SalarioSemanal,
    FechaIngreso: req.body.FechaIngreso,
    esZurdo: req.body.esZurdo,
  };
  
  // Aqui poner las verificaciones
  let arrayGenre = ['M', 'F'];
  let arrayCOD = ['V', 'E'];

  let regexpID = new RegExp(/^\d{1,3}\.\d{3,3}\.\d{3,3}$/,"gm");
  let regexpName = RegExp(/^[A-Za-z]*$/,"gm");    

  let birthdate = new Date(workerObj.FechaNacimiento);
    
  if(!(regexpID.test(String(workerObj.cedula)))){
    res.send('La cedula tiene que seguir el formato xx.xxx.xxx, no puede contener simbolos');
    return;
  }else if(Date(workerObj.FechaIngreso) > Date.now()){
    res.send('La fecha de ingreso no puede ser mayor a la fecha de hoy');
    return;
  }else if(age.calculate_age(birthdate.getMonth,birthdate.getDay,birthdate.getFullYear) < 18){
    res.send('El trabajador debe ser mayor de edad');
    return;
  }else if(!(regexpName.test(workerObj.PrimerNombre))){
    res.send('El primer nombre solo puede incluir letras, sin espacios blancos, numeros o caracteres especiales');
    return;
  }else if(!(regexpName.test(workerObj.SegundoNombre))){
    res.send('El segundo nombre solo puede incluir letras, sin espacios blancos, numeros o caracteres especiales');
    return;
  }else if(!(regexpName.test(workerObj.PrimerApellido))){
    res.send('El primer apellido solo puede incluir letras, sin espacios blancos, numeros o caracteres especiales');
    return;
  }else if(!(regexpName.test(workerObj.SegundoApellido))){
    res.send('El segundo apellido solo puede incluir letras, sin espacios blancos, numeros o caracteres especiales');
    return;
  }else if(Number(workerObj.salarioSemanal) <= 0){
    res.send('El salario debe ser mayor a cero');
    return;
  }else if(!(arrayCOD.indexOf(workerObj.COD) > -1)){
    res.send('El COD, tiene que ser "V","E"');
    return;
  }else if(!(arrayGenre.indexOf(workerObj.Genero) > -1)){
    res.send('El genero debe ser "M", "F"');
    return;
  }

  jwt.verify(req.body.token, 'secretkey', (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      conn.query(sql, workerObj, error => {
        if (error){
          res.send(error.sqlMessage);
          return;
        }
        res.send('Trabajador creado');
      });
    }
  });
});

router.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { Cedula, COD, PrimerNombre, SegundoNombre, PrimerApellido, SegundoApellido,Genero,Direccion,FechaNacimiento,
    Ocupacion, SalarioSemanal, FechaIngreso, esZurdo} = req.body;
    const sql = 'UPDATE Trabajadores SET '  +
    `COD='${COD}',` + 
    `PrimerNombre='${PrimerNombre}',`+
    `SegundoNombre='${SegundoNombre}',`+
    `PrimerApellido='${PrimerApellido}',`+
    `SegundoApellido='${SegundoApellido}',`+
    `Genero='${Genero}',`+
    `Direccion='${Direccion}',`+
    `FechaNacimiento='${FechaNacimiento}',`+
    `Ocupacion='${Ocupacion}',`+
    `SalarioSemanal='${SalarioSemanal}',`+
    `FechaIngreso='${FechaIngreso}',`+
    `esZurdo='${esZurdo}' `+
    `WHERE Cedula='${id}'`;

    let arrayGenre = ['M', 'F'];
    let arrayCOD = ['V', 'E'];

    let regexpID = new RegExp(/^\d{1,3}\.\d{3,3}\.\d{3,3}$/,"gm");
    let regexpName = RegExp(/^[A-Za-z]*$/,"gm");    

    let birthdate = new Date(workerObj.FechaNacimiento);

    if(Date(workerObj.FechaIngreso) > Date.now()){
      res.send('La fecha de ingreso no puede ser mayor a la fecha de hoy');
      return;
    }else if(age.calculate_age(birthdate.getMonth,birthdate.getDay,birthdate.getFullYear) < 18){
      res.send('El trabajador debe ser mayor de edad');
      return;
    }else if(!(regexpName.test(workerObj.PrimerNombre))){
      res.send('El primer nombre solo puede incluir letras, sin espacios blancos, numeros o caracteres especiales');
      return;
    }else if(!(regexpName.test(workerObj.SegundoNombre))){
      res.send('El segundo nombre solo puede incluir letras, sin espacios blancos, numeros o caracteres especiales');
      return;
    }else if(!(regexpName.test(workerObj.PrimerApellido))){
      res.send('El primer apellido solo puede incluir letras, sin espacios blancos, numeros o caracteres especiales');
      return;
    }else if(!(regexpName.test(workerObj.SegundoApellido))){
      res.send('El segundo apellido solo puede incluir letras, sin espacios blancos, numeros o caracteres especiales');
      return;
    }else if(Number(workerObj.salarioSemanal) <= 0){
      res.send('El salario debe ser mayor a cero');
      return;
    }else if(!(arrayCOD.indexOf(workerObj.COD) > -1)){
      res.send('El COD, tiene que ser "V","E"');
      return;
    }else if(!(arrayGenre.indexOf(workerObj.Genero) > -1)){
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

router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM Trabajadores WHERE Cedula = ${id}`;

  jwt.verify(req.body.token, 'secretkey', (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      conn.query(sql, (error,result) => {
        if (error){
          res.send(error.sqlMessage);
          return;
        }else if(result.affectedRows <= 0){
          res.send(`No existe un empleado con esta cedula '${id}'`);
          return;
        }
        res.send('Trabajador ha sido eliminado');
      }); 
    }
  });
});


module.exports = router;