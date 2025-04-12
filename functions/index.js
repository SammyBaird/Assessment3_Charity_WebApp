const { onRequest } = require('firebase-functions/v2/https')
const logger = require('firebase-functions/logger')
const validator = require('validator')
const rateLimiter = require('express-rate-limit')
const admin = require('firebase-admin')
const cors = require('cors')({ origin: true })
const sgMail = require('@sendgrid/mail')
const { InferenceClient } = require('@huggingface/inference')

admin.initializeApp()

// SendGrid and Hugging Face Requirements
const sendGridApiKey = process.env.SENDGRID_KEY
const HUGGING_FACES_API_KEY = process.env.HUGGING_FACES_API_KEY
const AI_PROMPT = process.env.AI_PROMPT
const hfClient = new InferenceClient(HUGGING_FACES_API_KEY)

sgMail.setApiKey(sendGridApiKey)

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
      // Attempt to submit form and send email reply
      try {
        await admin.firestore().collection('contactForms').add(submission)
        // Dynamic template from SendGrid! Finally have this working OMG!
        const replyMsg = {
          to: email,
          from: 'bairdsamuel7@gmail.com',
          template_id: 'd-f6bb867b65684688a676b5403f60c564',
          dynamic_template_data: {
            name: safeName,
            message: safeMessage,
          },
        }
        await sgMail.send(replyMsg)
        res
          .status(200)
          .send(
            'Submission received and email sent. Please check your inbox and/or spam folder for confirmation.',
          )
      } catch (firestoreError) {
        logger.error('Error processing submission', firestoreError)
        return res.status(500).send('Failed to process submission.')
      }
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
      // Getting all documents from the spending collection
      const snapshot = await db.collection('spending').get()

      console.log(`Found ${snapshot.size} documents in the spending collection.`)

      // Setting CSV header
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

      // Validating fields and adding to CSV
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

      // Setting the response for CSV download
      res.set('Content-Type', 'text/csv')
      res.set('Content-Disposition', 'attachment; filename="spending_data.csv"')
      res.status(200).send(csvContent)
    } catch (error) {
      logger.error('Error generating CSV', error)
      res.status(500).send('Error generating CSV')
    }
  })
})

// Super simple version of a chatbot using hugging face
// Below approach was leveraged from the hugging face deepseek model page
// I do this a bit at work so should be cool if it works :)
exports.hfChatbot = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed')
    }

    const { prompt } = req.body
    if (!prompt) {
      return res.status(400).send('Prompt is required.')
    }

    // Doing some basic AI alignment with system prompt
    const messagesArray = [
      { role: 'system', content: AI_PROMPT },
      { role: 'user', content: prompt },
    ]

    try {
      // Use HF client to call endpoint
      const chatCompletion = await hfClient.chatCompletion({
        provider: 'nebius',
        model: 'deepseek-ai/DeepSeek-V3-0324',
        messages: messagesArray,
        max_tokens: 512,
      })

      // Returning just the bot message with some basic error handling
      const botMessage =
        chatCompletion?.choices &&
        chatCompletion.choices.length > 0 &&
        chatCompletion.choices[0].message.content
          ? chatCompletion.choices[0].message.content
          : 'No response from bot.'

      res.status(200).json(botMessage)
    } catch (error) {
      logger.error(
        'Error calling Hugging Face API:',
        error.response ? error.response.data : error.message,
      )
      res.status(500).send('Failed to generate response.')
    }
  })
})

// test function
exports.helloWorld = onRequest((req, res) => {
  logger.info('Hello logs!', { structuredData: true })
  res.send('Hello from Firebase!')
})
