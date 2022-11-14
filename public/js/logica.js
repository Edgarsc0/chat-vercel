//Crear una instancia de SocketIO, recibe como parámetro el url del servidor al que se conectará
var socket = io.connect('http://localhost:8000');
var list = document.querySelector(`#not`)
let mensaje = document.getElementById('mensaje');
let usuario = document.getElementById('usuario');
let salida = document.getElementById('salida');
let notificaciones = document.getElementById('notificaciones');
let boton = document.getElementById('enviar');

var clientes = [];

boton.addEventListener('click', function(){
  var data = {
    mensaje: mensaje.value,
    usuario: usuario.value,
  };
  if(mensaje.value === '' || usuario.value === ''){
    alert('Se requiere un mensaje y un usuario para poder ingresar al chat');
  }else{
    mensaje.value = '';
    socket.emit('chat:mensaje', data);
  }
});
mensaje.addEventListener('keydown', function(){
  socket.emit('chat:escribiendo', usuario.value)
});

socket.on('chat:mensaje', function(data){
  salida.innerHTML+=`
  <br>
  <ul class="list-group">
    <li class="list-group-item active">${data.usuario}</li>
    <li class="list-group-item">${data.mensaje}</li>
  </ul>
  `
});

socket.on('chat:escribiendo', function(data){
  avisos.innerHTML = `<p><em>` + data + `</em> esta escribiendo ... </p>`
});
//Escuchar al evento 'hola' y realizar cierta accion, recibe como parámetro el id del evento y un callback con la información recibida
socket.on('conectado', function (data) {
  //Notificar al usuario el evento hola
  console.log(data);
  
  clientes.push(data);
  document.querySelector('#notificaciones').innerHTML = JSON.stringify(clientes);
});

socket.on('desconectado', function (data) {
  //Notificar al usuario el evento hola
  console.log(data);
  
  clientes.push(data);
  document.querySelector('#notificaciones').innerHTML = JSON.stringify(clientes);
});
