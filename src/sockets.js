const Chat = require('./models/chat');

module.exports=function(io){

    let users={

    };

    io.on('connection', async socket=>{

        socket.on('disconnect', data=>{

            
            io.sockets.emit('new message', {
                msg: 'Se salio del chat',
                nick: socket.nickname,
                anuncio: 'salio'
            });
            

            if(!socket.nickname) return;
            delete users[socket.nickname];
            io.sockets.emit('username', Object.keys(users));
        });

      
        socket.on('new user', async (data, cb)=>{

            if(data in users){
                cb(false);
            }else{
                cb(true);
                socket.nickname=data;
                io.sockets.emit('new message', {
                    msg: 'Se unio al chat',
                    nick: socket.nickname,
                    anuncio: 'entro'
                });
                users[socket.nickname]=socket;
                io.sockets.emit('username', Object.keys(users));

                let messages = await Chat.find({});
                socket.emit('load old msgs', messages);//se cargan los viejos mensajes.
            }
        });

        socket.on('send message', async (data, cb)=>{

            var msg = data.trim();

            if(msg.substr(0,3)==='/w '){//so los primeros 3 caracteres lucen asi /w .
                msg = msg.substr(3);
                const index = msg.indexOf(' ');

                if(index !==-1){
                    let name = msg.substring(0,index);
                    var mens = msg.substring(index+1);

                    if(name in users){//si el nombre esta en el objeto users
                        users[name].emit('whisper',{
                            msg: mens,
                            nick: socket.nickname
                        })

                        users[socket.nickname].emit('whisper',{
                            msg: mens,
                            nick: socket.nickname
                        })
                    }else{
                        cb('Error! Usuario no valido.');
                    }
                }else{
                    cb('Error! Ingrese un mensaje');
                }
            } else{

                var newMsg = await new Chat({
                    msg: data,
                    nick:socket.nickname
                });
                await newMsg.save();//se guarda el esquema en la base de datos.

                io.sockets.emit('new message', {
                    msg: data,
                    nick: socket.nickname
                });
            }
            
        });
        
    }); 
    
}

