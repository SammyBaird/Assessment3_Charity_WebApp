// Import the full firebase-functions package for configuration access.
const functions = require('firebase-functions')
const { onRequest } = require('firebase-functions/v2/https')
const logger = require('firebase-functions/logger')

// SendGrid API key setup
const sgMail = require('@sendgrid/mail')
// Get the API key from Firebase environment configuration.
const sendGridApiKey = functions.config().sendgrid.key
sgMail.setApiKey(sendGridApiKey)

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.sendEmail = onRequest(async (req, res) => {
  try {
    const { to, subject, text } = req.body
    const msg = {
      to: to || 'bairdsamuel7@gmail.com', // Use provided or default recipient.
      from: 'bairdsamuel7@gmail.com', // This sender must be verified in SendGrid.
      subject: subject || 'Test Email',
      text: text || 'This is a test email sent from Firebase Functions!',
      html: `<strong>${text || 'No content provided'}</strong>`, // HTML content.
    }

    // Send the email using SendGrid.
    await sgMail.send(msg)
    res.status(200).send('Email sent successfully!')
  } catch (error) {
    console.error('Error sending email:', error)
    res.status(500).send('Failed to send email.')
  }
})
