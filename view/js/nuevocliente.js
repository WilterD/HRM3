import { nuevoCliente } from './API.js';
import {addTrabajador } from './API.js';
import {pruebas } from './API.js';
// import {obtenerTrabajadores } from './API.js';
import { mostrarAlerta } from './funciones.js';

(function() {
    const formulario = document.querySelector('#formulario');
    formulario.addEventListener('submit', validarCliente);

    async function validarCliente(e) {
        e.preventDefault();

        

        // const id_user= document.querySelector('#password_confirm').value;
        const email = document.querySelector('#email').value;
        const password_user = document.querySelector('#password_user').value;

        console.log(email);
        console.log(password_user);
        

        const cliente = {
            id_user: "6",
            email, 
            password_user
        }

        // const trabajador = {
        //     Cedula: "6",
        //     COD: "123", 
        //     PrimerNombre: "123", 
        //     SegundoNombre: "123", 
        //     PrimerApellido: "123", 
        //     SegundoApellido: "123", 
        //     Genero: "123", 
        //     Direccion: "123", 
        //     FechaNacimiento: "123", 
        //     Ocupacion: "123", 
        //     SalarioSemanal: "123", 
        //     FechaIngreso: "123", 
        //     esZurdo: "123", 
        //     token: `${miToken}` 
        // }
        
        if( validar(cliente) ) {
            mostrarAlerta('Todos los campos son obligatorios');
            return;
        }

        const respuestaUsers = await fetch("http://localhost:3000/users/login/27.922.357/1234"); // guardar respuesta en variable de datos de API
        const acessoUser = await respuestaUsers.json(); // guardar si el acceso es true
        const miToken = acessoUser.token;
        console.log(miToken);

        

        await pruebas(); // crear nuevo usuario
        // await obtenerTrabajadores(miToken); // verificar trabajadores activos
        // await nuevoCliente(cliente); // crear nuevo usuario
        // await addTrabajador(trabajador); // crear nuevo usuario
        // window.location.href = 'index.html';
        console.log("todo bien? 1 despues de hacer peticiones");
    }


    function validar(obj) {
        return !Object.values(obj).every(input => input !== '') ;
    }
   
})();