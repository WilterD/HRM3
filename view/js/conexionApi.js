const url = 'http://localhost:3000/workers';
const url2 = 'http://localhost:3000/users';

// let cedula= "28.215.217";
// let clave= "1234";

// $('#enviar').click(function(){
    
//     cedula = $('#cedula').val();
//     clave = $('#clave').val();
//     cargarApi();

//     $.ajax({
//         url: `${url}`,
//         type: 'POST',
//         data: {
//             cedula: cedula,
//             clave: clave
//         },
//         success: function(data){
//             console.log("todo excelente");
//         }

// })
// });

console.log(cedula);
console.log(clave);

export const nuevoCliente = async() => {

    try{
       await fetch(`${url}`, {
            method: 'POST',
            body: JSON.stringify(cliente),
            headers:{
                'Content-Type': 'application/json'
                }
            }).then(res => res.json())
            window.location.href = './index.html';
            console.log("hola loogin");
            
    }catch(error){
        console.log(error);
    }
}


const cargarApi= async() => {
    const respuestaTrabajadores = await fetch(`${url}`); // guardar respuesta en variable de datos de API

    const trabajadores = await respuestaTrabajadores.json(); // guardar respuesta en variable de datos de API
    // const respuestaClientes = await fetch(`${url2}`+`/login/`+`${cedula}`+`/`+`${clave}`); // guardar respuesta en variable de datos de API
      
    // const respuesta2 = await fetch('http://localhost:3000/users/login/28.215.217/1234'); // guardar respuesta en variable de datos de API
    try{
            if(respuestaTrabajadores.status==200){
               const datos = await respuesta1.json(); // convierte la respuesta a json
                console.log(datos);
                
               cantidadEmpleados = datos.length;
               totalEmpleados = document.getElementById('totalEmpleados'); // total de empleados
               totalEmpleados.innerText = cantidadEmpleados; // remplazar el texto del elemento totalEmpleados     
}
    }catch(error){
            console.log(error);
        }
    }

    cargarApi();
    
