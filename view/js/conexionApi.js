const url = "http://localhost:3000/workers"; // datos de trabajadores, acceder con token
const url2 = "http://localhost:3000/users"; // usuarios, acceso y token
// const url3 = "http://localhost:3000/users/signin"; // registrar usuario, espera id_user,email,password

const cargarApi = async () => {
  // const respuestaTrabajadores = await fetch(`${url}`); // guardar respuesta en variable de datos de API
  // const miToken = token.respuestaTrabajadores.json();
  // console.log(miToken);
  // console.log(respuestaTrabajadores);
  // const trabajadores = await respuestaTrabajadores.json(); // guardar respuesta en variable de datos de API
  // const respuestaClientes = await fetch(`${url2}`+`/login/`+`${cedula}`+`/`+`${clave}`); // guardar respuesta en variable de datos de API

  const respuestaUsers = await fetch("http://localhost:3000/users/login/27.922.357/1234"); // guardar respuesta en variable de datos de API
  const acessoUser = await respuestaUsers.json(); // guardar si el acceso es true
  const miToken = acessoUser.token;

  if (acessoUser.acceso) {
    // si el usuario esta registrado, entonces se le permite ingresar al sistema
    localStorage.setItem("token", miToken); // guardar el token en el localStorage
    // window.location.href = './index.html';
    console.log("accedemos al sistema");
  } else {
    console.log("no accedemos al sistema");
  }

  if (respuestaUsers.status == 200) {
    console.log("buena conexion con la api Users");    
  }
};
const usuario = {
    id_user: "12345678",
    email: "correo@gmail.com",
    password_user: "1234",
  };

// await nuevoCliente(usuario);
