var app = require('http').createServer()
var io = require('socket.io')(app)
const PORT = 8080

app.listen(PORT)

var userId = 0

function getDate () {
  let date = new Date(),
    year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate(),
    hours = formatDate(date.getHours()),
    minutes = formatDate(date.getMinutes()),
    seconds = formatDate(date.getSeconds())

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

function formatDate (num) {
  return ('00' + num).slice(-2)
}

io.on('connection', function (socket) {
  if (userId >= 2) {
    return socket.emit('personNumError')
  }
  
  userId++
  socket.nickname = 'user' + userId
  socket.userId = userId
  io.emit('enter', socket.nickname)
  socket.on('message', function (data) {
    let dataObj = {message: data, nickname: socket.nickname, date: getDate()}
    io.emit('message', dataObj)
  })
  socket.on('disconnect', function () {
    if (socket.userId === 1) {
      userId = 0
    } else {
      userId = 1
    }
  })
})

console.log(`服务器监听在端口：${PORT}`)