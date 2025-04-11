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

// Function to handle contact form submissions
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
      const submission = {
        name: safeName,
        email,
        message: safeMessage,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      }
      try {
        await admin.firestore().collection('contactForms').add(submission)
      } catch (firestoreError) {
        logger.error('Error saving submission to Firestore', firestoreError)
        return res.status(500).send('Failed to save submission.')
      }
      res.status(200).send('Submission received.')
    })
  })
})

// Function to handle donation form submissions
exports.doantionFormSecure = onRequest((req, res) => {
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
      logger.info('Sanitized donation form submission', {
        name: safeName,
        email,
        message: safeMessage,
      })
      const submission = {
        name: safeName,
        email,
        message: safeMessage,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      }
      try {
        await admin.firestore().collection('donations').add(submission)
      } catch (firestoreError) {
        logger.error('Error saving submission to Firestore', firestoreError)
        return res.status(500).send('Failed to save submission.')
      }
      res.status(200).send('Submission received.')
    })
  })
})

// Funciton Generates CSV file of Spending Data
exports.exportSpendingCSV = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const db = admin.firestore()
      const snapshot = await db.collection('spending').get()

      console.log(`Found ${snapshot.size} documents in the spending collection.`)

      const header = [
        'Month',
        'Administrative',
        'Programs',
        'Fundraising',
        'Operations',
        'Outreach',
        'Grants',
      ]
      let csvContent = header.join(',') + '\n'

      snapshot.forEach((doc) => {
        const data = doc.data()
        const row = [
          data.month ? `"${data.month}"` : '""',
          typeof data.administrative !== 'undefined' ? data.administrative.toString() : '""',
          typeof data.programs !== 'undefined' ? data.programs.toString() : '""',
          typeof data.fundraising !== 'undefined' ? data.fundraising.toString() : '""',
          typeof data.operations !== 'undefined' ? data.operations.toString() : '""',
          typeof data.outreach !== 'undefined' ? data.outreach.toString() : '""',
          typeof data.grants !== 'undefined' ? data.grants.toString() : '""',
        ]
        csvContent += row.join(',') + '\n'
      })

      res.set('Content-Type', 'text/csv')
      res.set('Content-Disposition', 'attachment; filename="spending_data.csv"')
      res.status(200).send(csvContent)
    } catch (error) {
      logger.error('Error generating CSV', error)
      res.status(500).send('Error generating CSV')
    }
  })
})

// test function
exports.helloWorld = onRequest((req, res) => {
  logger.info('Hello logs!', { structuredData: true })
  res.send('Hello from Firebase!')
})
