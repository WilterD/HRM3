const url = "http://localhost:3000/users/signin";
const url2 = "http://localhost:3000/workers";
const url3 = "http://localhost:3000/workers/add";
const url5 = "http://localhost:3000/users/delete";
const url6 = "http://localhost:3000/workers/active";
const url7 = "http://localhost:3000/users";



export const nuevoCliente = async cliente => {
    try {
        await fetch(url, {
            method: 'POST', 
            body: JSON.stringify(cliente), // data puede ser string o un objeto
            headers:{
              'Content-Type': 'application/json' // Y le decimos que los datos se enviaran como JSON
            }
        });
        console.log("todo bien 2 nuevo cliente API");
        console.log(cliente);
    } catch (error) {
        console.log(error);
    }
}

export const obtenerClientes = async () => {
    try {
        const resultado = await fetch(url);
        const clientes = await resultado.json();
        return clientes;
    } catch (error) {
        console.log(error);
    }
}

export const obtenerCliente = async id => {
    try {
        const resultado = await fetch(`${url}/${id}`);
        const cliente = await resultado.json();
        console.log(cliente);
        return cliente;
    } catch (error) {
        console.log(error);
    }
}


export const editarCliente = async cliente => {
    try {
        await fetch(`${url}/${cliente.id}`, {
            method: 'PUT', 
            body: JSON.stringify(cliente), // data puede ser string o un objeto
            headers:{
              'Content-Type': 'application/json' // Y le decimos que los datos se enviaran como JSON
            }
        });
    } catch (error) {
        console.log(error);
    }
}

export const obtenerTrabajadores = async cliente => {
    try {
        await fetch(`${url6}`,{
            method: 'GET', 
            body: JSON.stringify(cliente), // data puede ser string o un objeto
            headers:{
              'Content-Type': 'application/json' // Y le decimos que los datos se enviaran como JSON
            }
        });
        console.log("todo bien2 obtener trabajadores");
        console.log(cliente);
        
    } catch (error) {
        console.log(error);
    }
}

export const eliminarCliente = async id => {
    try {
        
        await fetch(`${url5}/${id}/1234`, {
            method: 'DELETE'
        });
    } catch (error) {
        console.log(error);
    }
}

export const addTrabajador = async cliente => {
    try {
        await fetch(`${url}/${cliente.id}`, {
            method: 'PUT', 
            body: JSON.stringify(cliente), // data puede ser string o un objeto
            headers:{
              'Content-Type': 'application/json' // Y le decimos que los datos se enviaran como JSON
            }
        });
        console.log("todo bien2 add trabajador");
    } catch (error) {
        console.log(error);
    }
}

export const pruebas = async cliente => {
    try {
        await fetch("http://localhost:3000/users/login/27.922.357/1234", {
            method: 'POST', 
            body: JSON.stringify(cliente), // data puede ser string o un objeto
            headers:{
              'Content-Type': 'application/json' // Y le decimos que los datos se enviaran como JSON
            }
        });
        console.log(cliente);
        console.log("para ver si funciona");
    } catch (error) {
        console.log(error);
    }
}