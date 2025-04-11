const { onDocumentCreated } = require('firebase-functions/v2/firestore')
const logger = require('firebase-functions/logger')
const sgMail = require('@sendgrid/mail')
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const cors = require('cors')({ origin: true })

admin.initializeApp()

// Get the SendGrid API
const sendGridApiKey = functions.config().sendgrid.key
sgMail.setApiKey(sendGridApiKey)

// This was a nightmare to set up! 10/10 annoying.
exports.sendEmail = onDocumentCreated(
  { document: 'contactForms/{docId}', region: 'australia-southeast1' },
  async (event) => {
    const data = event.data.data()
    const msg = {
      from: 'bairdsamuel7@gmail.com',
      to: data.email,
      subject: 'Thank you for contacting New Horizons',
      text: `Hi ${data.user_name},\n\nThank you for your message. We have received your enquiry and will get back to you shortly.\n\nBest regards,\nThe New Horizons Team`,
      html: `<p>Hi ${data.user_name},</p>
             <p>Thank you for your message. We have received your enquiry and will get back to you shortly.</p>
             <p>Best regards,<br>The New Horizons Team</p>`,
    }

    try {
      cors((req, res) => {
        sgMail
          .send(msg)
          .then(() => {
            logger.info('Email sent successfully to:', data.email)
            res.status(200).send('Email sent successfully.')
          })
          .catch((error) => {
            logger.error('Error sending email:', error)
            res.status(500).send('Error sending email.')
          })
      })
    } catch (error) {
      logger.error('Unexpected error:', error)
    }
    return null
  },
)
