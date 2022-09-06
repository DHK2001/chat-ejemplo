$(function (actual){
    const socket=io();

    //obteniendo elementos del dom desde la interfaz
    const messageForm = $('#message-form');
    const messageBox = $('#message');
    const chat = $('#chat');

    //obteniendo elementos del dom desde la nickname from
    const nickForm = $('#nickForm');
    const nickError = $('#nickError');
    const nickname = $('#nickname');
    const user = $('#usernames');
    const user_header = $('#user_header');

    nickForm.submit(e=>{
        e.preventDefault();
        
        if(!nickname.val()){
            nickError.html('<div class="alert alert-danger"> Ingrese un Nombre.</div>')
            return;
        }

        socket.emit('new user', nickname.val(), data=>{
            if(data){
                actual=nickname.val();
                
                $('#nickWrap').hide();
                $('#contentWrap').show();
            }else{
                nickError.html('<div class="alert alert-danger"> Ese usuario ya existe.</div>')
            }
            nickname.val('');
        });
    });

    //events
    messageForm.submit( e => {
        e.preventDefault();
        socket.emit('send message', messageBox.val(), data=>{
            chat.append(`<p class="error">${data}</p>`);//append para agregar al chat.
        });
        messageBox.val('');
    });

    socket.on('new message', function(data){
        if(!data.msg){
            return;
        }
        if(data.anuncio==='entro')
            chat.append('<i><b> '+data.nick+' </b>'+ data.msg +'<br/></i>');
        else if(data.anuncio==='salio')
            chat.append('<i><b> '+data.nick+' </b>'+ data.msg +'<br/></i>');
        else{
            if(actual===data.nick){
                chat.append('<div align="right"><b>'+data.nick + '</b><br/>'+ data.msg + '</div>');
            }else{
                chat.append('<b>'+data.nick + '</b><br/>'+ data.msg + '<br/>');
            }
        }
            
    });

    socket.on('username', data=>{
        let html='';
        let html2='';

        for(let i=0; i<data.length; i++){
            html += `<p><i class="fa fa-user" aria-hidden="true"></i> ${data[i]} <br/></p>`;
        }
        user.html(html);
        user_header.html(`Usuario: ${actual}`);

    });

    socket.on('whisper', function(data){

        if(actual===data.nick){
            chat.append('<div align="right">'+`<p class="whisper"><b>${data.nick}</b><br/> ${data.msg}<p>`+ '</div>');
        }else{
            chat.append(`<p class="whisper"><b>${data.nick}</b><br/> ${data.msg}<p>`);
        }
    });

    socket.on('load old msgs', data=>{
        for(let i = 0; i<data.length; i++){
            if(actual===data[i].nick){
                chat.append('<div align="right"><b>'+data[i].nick + '</b><br/>'+ data[i].msg + '</div>');
            }else{
                chat.append('<b>'+data[i].nick + '</b><br/>'+ data[i].msg + '<br/>');
            }
        }
    })
 
});