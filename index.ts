import { readFileSync } from "fs"

import nodemailer from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"

import juice from "juice"

type Config = {
  host?: string
  auth?: boolean
  user: string
  pass: string
  secure?: string
  port?: number
  recipients?: string
  from?: string
  subject?: string
}

async function sendMail(config?: Config) {
  const data = readFileSync("./src/index.html", { encoding: "utf-8" })
  const html = juice(data)

  const nodemailerConfig: SMTPTransport.Options = {
    host: config?.host ?? "smtp.ethereal.email",
    port: config?.port ?? 587,
    secure: config?.secure === "ssl",
    auth: {
      user: config?.user,
      pass: config?.pass,
    },
  }

  const recipients = config?.recipients ?? "bar@example.com"
  const transporter = nodemailer.createTransport(nodemailerConfig)
  const info = await transporter.sendMail({
    from: config?.from ?? "\"Mailing tester\" <noreply@mailing.test>",
    to: recipients,
    subject: config?.subject ?? "Mailing test",
    text: "You need an HTML compatible email client to read this email",
    html: html,
  })
  console.log("Message sent")
  const url = nodemailer.getTestMessageUrl(info)
  if (url) {
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
  }
}

async function email() {
  let config: nodemailer.TestAccount | undefined
  try {
    config = JSON.parse(readFileSync("./config.json").toString())
  } catch (e) {
    console.log("No config file found, using Etheral test SMTP service")
    config = await nodemailer.createTestAccount()
  }

  sendMail(config)
}

email()
