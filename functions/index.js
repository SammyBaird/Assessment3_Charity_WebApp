const { onRequest } = require('firebase-functions/v2/https')
const logger = require('firebase-functions/logger')
const validator = require('validator')
const rateLimiter = require('express-rate-limit')
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const cors = require('cors')({ origin: true })

admin.initializeApp()

const limiter = rateLimiter({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Too many form submissions from this IP, please try again later.',
})

exports.contactFormSecure = onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed')
    }
    limiter(req, res, async () => {
      const { name, email, message } = req.body
      if (!name || !email || !message) {
        return res.status(400).send('All fields (name, email, message) are required.')
      }
      if (!validator.isEmail(email)) {
        return res.status(400).send('Invalid email address.')
      }
      const safeName = validator.escape(name)
      const safeMessage = validator.escape(message)
      logger.info('Sanitized contact form submission', {
        name: safeName,
        email,
        message: safeMessage,
      })
      res.status(200).send('Submission received.')
    })
  })
})

exports.helloWorld = onRequest((req, res) => {
  logger.info('Hello logs!', { structuredData: true })
  res.send('Hello from Firebase!')
})
