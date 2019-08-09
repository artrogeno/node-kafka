import { Server } from './server'
import { Config } from './config'

const { port } = Config

new Server().start().then((server) => {
  server.listen(port)
  server.on('error', (error) => {
    if (error.syscall !== 'listen') { throw error }
    switch (error.code) {
      case 'EACCES':
        console.error('Port requires elevated privileges')
        process.exit(1)
        break
      case 'EADDRINUSE':
        console.log('Port is already in use')
        process.exit(1)
        break
      default:
        throw error
    }
  })
  server.on('listening', () => {
    console.log(`Server is running in process ${process.pid} listening on PORT ${port}\n`)
  })
})
