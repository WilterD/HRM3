// guardar notificaciones eliminadas



const dia  = new Date();
let diaActual = dia.getDate();
let mesActual = dia.getMonth() + 1;
let semanaActual = dia.getDay();
let cantidadNotificaciones = 0;

const notificacion    = document.querySelector('.notificaciones'); // seleccionar  clase notificaciones Principal
let botonBorrar = document.querySelectorAll('.notificaciones .borrar'); // obtener con DOM BOTON BORRAR

botonBorrar = Array.from(botonBorrar); // convertir a array por que son nodos y se deben recorrer
botonBorrar.forEach(function(botonBorrar1, i){
    
    notificacion.children[i].style.display = "none"; // ocultar notificaciones inicialmente
    botonBorrar[i].addEventListener('click', function(){ // esperar un clic de cada boton de borrar
        
        let borrarNoti = confirm("¿Desea Eliminar La Notificación?"); // confirmar si se quiere eliminar la notificacion
        let claseNotificacion = botonBorrar1.parentElement.className; // obtener la clase de la notificacion
        claseNotificacion = claseNotificacion.split(" "); // separar la clase de la notificacion
        claseNotificacion = claseNotificacion[1]; // obtener la clase de la notificacion de la ultima posicion

            if (borrarNoti == true) {
                localStorage.setItem(claseNotificacion, "0"); // eliminar notificacion y guardar cambio en localStorage si presiono en aceptar
                window.location.reload(); // recargar pagina
            }
    });
});

function reportes(n){ 
    
    let ClaseNoti = document.querySelector('.notificaciones').children[n-1].className; // obtener la clase de la notificacion
            ClaseNoti = ClaseNoti.split(" "); // separar la clase de la notificacion
            ClaseNoti = ClaseNoti[2]; // obtener la clase de la notificacion de la ultima posicion
            let flag = localStorage.getItem(ClaseNoti); // obtener valor de LocalStorage
    
            if(flag == null || flag == undefined || flag!="0"){ 
                localStorage.setItem(ClaseNoti, "1"); // se crear notificacion guardada
          }
            if(flag == '1' || flag == null){ // si la notificacion esta guardada
                notificacion.children[n-1].style.display = "block";
                cantidadNotificaciones++;
            }            
}

// ejemplos de notificaciones por dias

// mesActual = 1;
// diaActual = 20;

// cambiar color dependiendo de la semana
let iconoAviso = document.querySelectorAll('.iconoAviso span'); // obtener con DOM BOTON BORRAR
iconoAviso = Array.from(iconoAviso); // convertir a array por que son nodos y se deben recorrer

if(diaActual==26){ // si ya paso la fecha de corte, limpiar localStorage
    console.log("borrando elemento de localstorage");
    window.localStorage.clear();
}


if(diaActual>=24){ // si es ultimo dia, colocar reporte en rojo
    iconoAviso[0].classList.add('bg-danger');
    iconoAviso[1].classList.add('bg-danger');
}
// fin cambiar color dependiendo de la semana

if(diaActual >= 20 && diaActual <= 25){ // PARA MOSTRAR TIUNA
    reportes(1);
    
}

if(diaActual >= 21){ // PARA MOSTRAR MINISTERIO DEL TRABAJO
    reportes(2);          
}

// MOSTRAR NOTIFICACIONES PARA INCES Y MINISTERIO DEL TRABAJO

if(mesActual==3 && diaActual>=1 && diaActual<=7){ // PARA MOSTRAR INSES Y MINISTERIO DEL TRABAJO
    reportes(3); 
    reportes(4);

    if(diaActual>=6){ // si es ultimo dia, colocar reporte en rojo
        iconoAviso[2].classList.add('bg-danger');
        iconoAviso[3].classList.add('bg-danger');
    }
    
}else if(mesActual==6 && diaActual>=1 && diaActual<=7){ // PARA MOSTRAR INSES Y MINISTERIO DEL TRABAJO
    reportes(3); 
    reportes(4);

    if(diaActual>=6){ // si es ultimo dia, colocar reporte en rojo
        iconoAviso[2].classList.add('bg-danger');
        iconoAviso[3].classList.add('bg-danger');
    }
   
}else if(mesActual==9 && diaActual>=1 && diaActual<=7){ // PARA MOSTRAR INSES Y MINISTERIO DEL TRABAJO
    reportes(3); 
    reportes(4);   

    if(diaActual>=6){ // si es ultimo dia, colocar reporte en rojo
        iconoAviso[2].classList.add('bg-danger');
        iconoAviso[3].classList.add('bg-danger');
    }

}else if(mesActual==12 && diaActual>=1 && diaActual<=7){ // PARA MOSTRAR INSES Y MINISTERIO DEL TRABAJO
    reportes(3); 
    reportes(4); 

    if(diaActual>=6){ // si es ultimo dia, colocar reporte en rojo
        iconoAviso[2].classList.add('bg-danger');
        iconoAviso[3].classList.add('bg-danger');
    }
  
}

    // MOSTRAR NOTIFICACION PARA SAID Y IVSS
if(mesActual==4 && diaActual>=1 && diaActual<=7){ // PARA MOSTRAR INCES Y MINISTERIO DEL TRABAJO
    reportes(5);    
    reportes(6);

    if(diaActual>=6){ // si es ultimo dia, colocar reporte en rojo
        iconoAviso[4].classList.add('bg-danger');
        iconoAviso[5].classList.add('bg-danger');
    }
  
}else if(mesActual==8 && diaActual>=1 && diaActual<=7){ // PARA MOSTRAR INCES Y MINISTERIO DEL TRABAJO
    reportes(5);    
    reportes(6); 

    if(diaActual>=6){ // si es ultimo dia, colocar reporte en rojo
        iconoAviso[4].classList.add('bg-danger');
        iconoAviso[5].classList.add('bg-danger');
    }
   
}
if(mesActual==12 && diaActual>=1 && diaActual<=7){ // PARA MOSTRAR INCES Y MINISTERIO DEL TRABAJO
    reportes(5);    
    reportes(6); 

    if(diaActual>=6){ // si es ultimo dia, colocar reporte en rojo
        iconoAviso[4].classList.add('bg-danger');
        iconoAviso[5].classList.add('bg-danger');
    }
 
}



// agregar numero de notificaciones pendientes
document.getElementById('notificacion').innerHTML = cantidadNotificaciones ; // Agregar numero de notificaciones pendientes
document.getElementById('notificacion3').innerHTML = cantidadNotificaciones ; // Agregar numero de notificaciones pendientes
document.getElementById('textoNotificacion2').innerHTML = "Notificaciones (" + cantidadNotificaciones +")"; // Agregar numero de notificaciones pendientes

// no mostrar numero de notificacion si es 0
let borrarNotificacion = document.getElementById('notificacion');
if(cantidadNotificaciones==0){
    borrarNotificacion.style.display = "none";  
}




