const express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'));
server.listen(process.env.PORT||8000, () => console.log(`SERVER ON PORT ${process.env.PORT||8000}`));

app.get("/",(req,res)=>{
  res.send(`
  <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Socket Basico</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js"></script>
      </head>
      <body>
        <div class="container-fluid p-5 bg-primary text-white text-center">
          <h1>Chat node js Socket.IO</h1>
          <p>Introduce tu nombre de usuario</p> 
        </div>
        <form method="post" action="/chat">
          <div class="container p-5 my-5 border">
            <h1>Username</h1>
            <div class="form-floating mb-3 mt-3">
              <input type="text" class="form-control" id="name" placeholder="Enter email" name="username">
              <label for="email">Nombre con el que apareceras en la conversacion</label>
            </div>
            <input type="submit" class="btn btn-primary" value="Unirse">
          </div> 
        </form>   
      </body>
    </html>
  `)
})
app.post("/chat",(req,res)=>{
  res.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Socket Basico</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js"></script>
      </head>
      <body>
        <div class="container p-5 my-5 bg-primary text-white">
          <h1>Chat</h1>
          <p>Bienvenido al chat ${req.body.username}</p>
        </div>
        <div class="container mt-5">
          <div class = 'contenedor1'>
            <h1 class = 'encabezado'>USUARIOS</h1>
            <input type="text" class = 'usuario' id = 'usuario' placeholder = 'USUARIO' readonly value=${req.body.username}>
            <hr>
            <div id = 'notificaciones' class = 'notificaciones'>
            </div>
          </div>
          <div class = 'contenedor2'>
            <h1 class = 'encabezado'>CHAT</h1>
            <input type="text" class = 'mensaje' id = 'mensaje' placeholder = 'MENSAJE' required>
            <button class = 'botonEnvio' id = 'enviar'>
              ENVIAR
            </button>
            <div class = 'contenedorChat' id = 'salida'>
              <div class = 'avisos' id = 'avisos'>
              </div>
            </div>
          </div>
        </div>
        <script src="js/socket.io.js"></script>
        <script src="js/logica.js" charset="utf-8"></script>
      </body>
    </html>
  `)
  res.end();
})
io.on('connection', function (socket) {
  console.log('socket conectado',socket.id);
  io.emit('conectado', {texto: 'Nuevo socket conectado: ' + socket.id +`<br>`} );

  socket.on('disconnect', () => {
  	console.log('socket desconectado',socket.id);
    io.emit('desconectado', {texto: 'Socket desconectado.'+ socket.id +`<br>`});
  
  });
  
  socket.on('chat:mensaje' , (data) =>{

      io.emit('chat:mensaje' , data);

  });

  socket.on('chat:escribiendo' , (usuario) =>{

      socket.broadcast.emit('chat:escribiendo' , usuario);

  });

});
