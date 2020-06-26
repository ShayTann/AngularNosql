const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/',(req,res)=> {
    res.send('<n1> Hello Hell </h>');
})

http.listen(3000,()=>{
    console.log('Positive !')
})

io.on('connection',(socket) => {
    console.log("Connection Done");
    dataUpdate(socket)

});
function dataUpdate(socket){
    socket.emit('dataupdate',[7000,8000,3000,5000,4000,6000,800,2000,14,155]);
    setTimeout(() => {
        dataUpdate(socket)
    },2000)

}