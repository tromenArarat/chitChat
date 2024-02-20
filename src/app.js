import express from 'express';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import {Server} from 'socket.io';

const app = express();

app.use('/src/public/js', express.static('public/js', { 'extensions': ['js'], 'Content-Type': 'application/javascript' }));

const httpServer = app.listen(8080,()=>console.log("Al aire en 8080"));

const io = new Server(httpServer);

app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');
app.use(express.static(__dirname+'/public'));
app.use('/',viewsRouter);

let messages = [];
let usuarios = [];
io.on('connection',socket=>{
    console.log('Nuevo cliente conectado')

    socket.on('newUser', usuario => {
        console.log(usuario)
        socket.broadcast.emit('usuarioConectado',usuario)
    });

    io.emit('messageHistory',messages)

    socket.on('message',data=>{ //Escucha el evento del emit del cliente (en index.js)
        messages.push(data) //Guarda el objeto en la base interna
        io.emit('messageLogs',messages) //Reenvía los logs actualizados
        // el evento messageLogs no está programado del lado del cliente
    })
})
