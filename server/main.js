var app = require('http').createServer()
var io = require('socket.io')(app)
const PORT = 8080

app.listen(PORT)

var userId = 0

io.on('connection', function (socket) {
  userId++
  if (userId > 2) {
    userId = 1
    return socket.emit('personNumError', '满员')
  }
  socket.nickname = 'user' + userId
  io.emit('enter', socket.nickname)
  socket.on('message', function (data) {
    let dataObj = {message: data, nickname: socket.nickname}
    io.emit('message', `${socket.nickname}说：${dataObj}`)
  })
  socket.on('disconnect', function () {
    io.emit('leave', socket.nickname + '走了')
  })
  socket.on('disconnect', function () {
    userId--
  })
})

console.log(`服务器监听在端口：${PORT}`)