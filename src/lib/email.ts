import nodemailer from 'nodemailer'

// Check if SMTP is configured
const isEmailConfigured = () => {
  return !!(
    process.env.SMTP_HOST && 
    process.env.SMTP_USER && 
    process.env.SMTP_PASS &&
    process.env.SMTP_HOST !== '' &&
    process.env.SMTP_USER !== ''
  )
}

// Create transporter only if SMTP is configured
let transporter: nodemailer.Transporter | null = null

if (isEmailConfigured()) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions): Promise<boolean> {
  // If email is not configured, skip sending
  if (!transporter || !isEmailConfigured()) {
    console.log(`[Email Skipped] To: ${to}, Subject: ${subject}`)
    console.log('[Email System] SMTP not configured. Messages will be managed via Admin Dashboard.')
    return false
  }

  try {
    await transporter.sendMail({
      from: `"INR99 Academy" <${process.env.SMTP_USER || 'noreply@inr99.com'}>`,
      to,
      subject,
      html,
    })
    return true
  } catch (error) {
    console.error('Email send error:', error)
    return false
  }
}

export async function sendContactNotification(
  senderName: string,
  senderEmail: string,
  subject: string,
  message: string
): Promise<boolean> {
  // Check if email is configured
  if (!isEmailConfigured()) {
    console.log(`[New Contact Message] ${senderName} (${senderEmail}): ${subject}`)
    console.log('  → View all messages at /admin/messages')
    return false
  }
  
  const adminEmail = process.env.ADMIN_EMAIL || 'support@inr.academy'
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #ea580c 0%, #dc2626 100%); padding: 30px; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">📬 New Contact Message</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Someone sent you a message!</p>
      </div>
      
      <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #64748b;">Name:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">${senderName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #64748b;">Email:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${senderEmail}" style="color: #ea580c;">${senderEmail}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #64748b;">Subject:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">${subject}</td>
          </tr>
        </table>
        
        <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 8px; border: 1px solid #e2e8f0;">
          <p style="margin: 0 0 10px 0; font-weight: bold; color: #64748b;">Message:</p>
          <p style="margin: 0; white-space: pre-wrap;">${message}</p>
        </div>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://inr99.com'}/admin/messages" style="display: inline-block; background: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View in Admin Panel</a>
        </div>
        
        <p style="margin-top: 20px; font-size: 12px; color: #94a3b8;">This email was sent from the INR99 Academy contact form.</p>
      </div>
    </body>
    </html>
  `
  
  return sendEmail({
    to: adminEmail,
    subject: `[New Message] ${subject}`,
    html,
  })
}

export async function sendUserAcknowledgment(
  userEmail: string,
  userName: string,
  subject: string
): Promise<boolean> {
  // Check if email is configured
  if (!isEmailConfigured()) {
    console.log(`[User Acknowledgment] Skipped for ${userEmail}`)
    return false
  }
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #ea580c 0%, #dc2626 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">✅ Message Received!</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Thank you for contacting INR99 Academy</p>
      </div>
      
      <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
        <p>Hi ${userName},</p>
        
        <p>We've received your message regarding "<strong>${subject}</strong>".</p>
        
        <p>Our team will review your inquiry and get back to you as soon as possible.</p>
        
        <p style="margin-top: 30px;">Best regards,<br><strong>The INR99 Academy Team</strong></p>
        
        <p style="margin-top: 30px; font-size: 12px; color: #94a3b8; text-align: center;">
          © ${new Date().getFullYear()} INR99 Academy. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `
  
  return sendEmail({
    to: userEmail,
    subject: 'We received your message - INR99 Academy',
    html,
  })
}

export async function sendReplyNotification(
  userEmail: string,
  userName: string,
  originalSubject: string,
  replyMessage: string
): Promise<boolean> {
  // Check if email is configured
  if (!isEmailConfigured()) {
    console.log(`[Reply Notification] Skipped for ${userEmail}`)
    return false
  }
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">💬 We've Replied!</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Your message has been answered</p>
      </div>
      
      <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
        <p>Hi ${userName},</p>
        
        <p>We have replied to your inquiry regarding "<strong>${originalSubject}</strong>".</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0;">
          <p style="margin: 0 0 15px 0; font-weight: bold; color: #64748b;">Our Response:</p>
          <div style="background: #f8fafc; padding: 15px; border-radius: 6px; border-left: 3px solid #ea580c;">
            <p style="margin: 0; white-space: pre-wrap;">${replyMessage}</p>
          </div>
        </div>
        
        <p style="margin-top: 30px;">Best regards,<br><strong>The INR99 Academy Team</strong></p>
      </div>
    </body>
    </html>
  `
  
  return sendEmail({
    to: userEmail,
    subject: `Re: ${originalSubject}`,
    html,
  })
}
