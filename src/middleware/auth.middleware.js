const jwt = require('jsonwebtoken')

const {JWT_SECRET} = require('../config/config.default')
const { tokenExpiredError, invalidToken } = require('../constants/err.type')

const auth = async (ctx, next) => {
  const { authorization } = ctx.request.header
  const token = authorization.replace('Bearer ', '')
  console.log('authorization: ', token)
  try {
    // 包含了id，user_name，is_admin
    const user = jwt.verify(token, JWT_SECRET)
    ctx.state.user = user
  } catch (err) {
    switch(err.name) {
      case 'TokenExpiredError': 
        console.error('token已过期', err)
        return ctx.app.emit('error', tokenExpiredError, ctx)
      case 'JsonWebTokenError': 
        console.error('无效token', err)
        return ctx.app.emit('error', invalidToken, ctx)
    }
  }
  await next()
}

module.exports = {
  auth
}
