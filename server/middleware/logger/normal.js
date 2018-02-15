const log4js = require('log4js')
const ApiPerformenceController = require('../../controller/apiPerformence')

module.exports = async (ctx, status, start = 0) => {
  log4js.configure(
    {
      appenders: { normal: { type: 'dateFile', filename: 'log/normal/access.log', keepFileExt: true } },
      categories: { default: { appenders: ['normal'], level: 'info' } }
    }
  )
  
  const logger = log4js.getLogger('normal')

  const method = ctx.request.method
  const url = ctx.request.url

  // 为ctx绑定info级别logger
  !ctx.logger && (ctx.logger ={})
  ctx.logger.info = message => logger['info'](message)
  
  const responseTime = (Date.now() - start)
  logger.info(
    `
    ${method} ${url} 
    响应时间为: ${responseTime}s
    `
  )

  await ApiPerformenceController.addApiRecord({
    statusCode: status,
    method,
    requestUrl: url,
    responseTime
  })
}
