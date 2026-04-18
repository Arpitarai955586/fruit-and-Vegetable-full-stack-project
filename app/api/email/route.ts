import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

interface EmailRequest {
  to: string
  subject: string
  message: string
}

export async function POST(request: NextRequest) {
  try {
    const body: EmailRequest = await request.json()
    const { to, subject, message } = body

    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: "Email, subject, and message are required" },
        { status: 400 }
      )
    }

    // For demo purposes, we'll simulate email sending
    // In production, you would integrate with actual email services like:
    // - Nodemailer with SMTP
    // - SendGrid
    // - AWS SES
    // - Resend
    // - EmailJS

    console.log('Email Request:', { to, subject, message })

    // Simulate email API call
    const emailData = {
      to: to,
      subject: subject,
      message: message,
      from: 'FreshVeg <noreply@freshveg.com>',
      sentAt: new Date().toISOString()
    }

    // For actual email sending, replace the mock implementation below with:
    // Option 1: Nodemailer with SMTP
    /*
    import nodemailer from 'nodemailer'
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
    
    const mailOptions = {
      from: 'FreshVeg <noreply@freshveg.com>',
      to: to,
      subject: subject,
      text: message
    }
    
    const result = await transporter.sendMail(mailOptions)
    */

    // Option 2: SendGrid
    /*
    import sgMail from '@sendgrid/mail'
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const result = await sgMail.send({ to, subject, text: message, from: 'noreply@freshveg.com' })
    */

    // Option 3: Resend
    /*
    import { Resend } from 'resend'
    const resend = new Resend(process.env.RESEND_API_KEY)
    const result = await resend.emails.send({ from: 'noreply@freshveg.com', to, subject, text: message })
    */

    // Real email sending with Nodemailer and Gmail SMTP
    try {
      // Check if environment variables are set
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        return NextResponse.json({
          success: false,
          error: "Gmail credentials not configured. Please set EMAIL_USER and EMAIL_PASS in environment variables."
        }, { status: 500 })
      }

      console.log('Attempting to send email with user:', process.env.EMAIL_USER?.substring(0, 5) + '***')

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        debug: true // Enable debug logging
      })

      const mailOptions = {
        from: 'FreshVeg <noreply@freshveg.com>',
        to: to,
        subject: subject,
        text: message,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
              <h2 style="color: #28a745; margin-bottom: 20px;">Order Confirmation</h2>
              <p style="color: #333; line-height: 1.6;">${message}</p>
              <hr style="margin: 20px 0; border: 1px solid #dee2e6;">
              <p style="color: #6c757d; font-size: 14px;">Thank you for shopping with FreshVeg!</p>
            </div>
          </div>
        `
      }

      const result = await transporter.sendMail(mailOptions)

      console.log('Email actually sent:', result)

      return NextResponse.json({
        success: true,
        message: "Email sent successfully",
        data: {
          messageId: result.messageId,
          sentAt: new Date().toISOString()
        }
      })

    } catch (emailError: any) {
      console.error('Email sending failed:', emailError)
      return NextResponse.json({
        success: false,
        error: emailError.message || "Failed to send email"
      }, { status: 500 })
    }

  } catch (error: any) {
    console.error('Email Error:', error)
    return NextResponse.json(
      { error: error.message || "Failed to send email" },
      { status: 500 }
    )
  }
}
