const socket = io();
let user;
let chatBox = document.getElementById('chatBox');
Swal.fire({
    title:"¿Cómo era que te llamabas?",
    input:"text", //Indicamos que el cliente necesita escribir un txt para poder avanzar de esa alerta.
    text:"Ingresá tu nombre para que sepamos quién sos.",
    inputValidator: (value)=>{
        return !value && 'Escribí tu nombre para no ser anónimo.'
    },
    allowOutsideClick:false
}).then(result=>{
    user = result.value
    socket.emit('newUser',user)
    
});

chatBox.addEventListener('keyup',evt=>{
    if(evt.key==='Enter'){
        if(chatBox.value.trim().length>0){
            socket.emit('message',{user:user,message:chatBox.value});
            chatBox.value='';
        }
    }
})

socket.on('messageHistory',data=>{
    let log = document.getElementById('messageLogs');
    let messages = '';
    data.forEach(message=>{
        messages = messages+`${message.user} dijo: ${message.message}</br>`
    })
    log.innerHTML = messages;
})

socket.on('messageLogs',data=>{
    let log = document.getElementById('messageLogs');
    let messages = '';
    data.forEach(message=>{
        messages = messages+`${message.user} dice: ${message.message}</br>`
    })
    log.innerHTML = messages;
})

socket.on('usuarioConectado', usuario => {
    Swal.fire({
        text: usuario + ' se unió a la conversación',
        toast: true,
        position: 'top-right'
    });
});