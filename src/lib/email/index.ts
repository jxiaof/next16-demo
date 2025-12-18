// 邮件服务配置
// 注意：生产环境需要配置真实的 SMTP 服务（如 Resend、SendGrid、Nodemailer 等）

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export interface SendEmailResult {
  success: boolean;
  message: string;
}

/**
 * 发送邮件
 * 开发环境：仅打印日志，不实际发送
 * 生产环境：需要配置真实的邮件服务
 */
export async function sendEmail(options: EmailOptions): Promise<SendEmailResult> {
  const { to, subject, html } = options;

  // 开发环境：模拟发送
  if (process.env.NODE_ENV === "development") {
    console.log("📧 [DEV] Email sent:");
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Content: ${html.substring(0, 200)}...`);
    return { success: true, message: "Email sent (development mode)" };
  }

  // 生产环境：需要实现真实的邮件发送逻辑
  // 可以使用 Resend、SendGrid、Nodemailer 等
  try {
    // TODO: 实现真实的邮件发送
    // 示例使用 Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'noreply@yourdomain.com',
    //   to,
    //   subject,
    //   html,
    // });
    
    console.log("📧 Email would be sent in production:", { to, subject });
    return { success: true, message: "Email sent" };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, message: "Failed to send email" };
  }
}

/**
 * 发送密码重置邮件
 */
export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
  username: string
): Promise<SendEmailResult> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>重置密码</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">密码重置请求</h1>
      </div>
      <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          你好，<strong>${username}</strong>！
        </p>
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          我们收到了你的密码重置请求。请点击下面的按钮重置你的密码：
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
            重置密码
          </a>
        </div>
        <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
          如果按钮无法点击，请复制以下链接到浏览器：
        </p>
        <p style="color: #6b7280; font-size: 12px; word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 4px;">
          ${resetUrl}
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #9ca3af; font-size: 12px; line-height: 1.6;">
          此链接将在 1 小时后过期。如果你没有请求重置密码，请忽略此邮件。
        </p>
        <p style="color: #9ca3af; font-size: 12px;">
          — Coconut 团队
        </p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: "重置你的密码 - Coconut",
    html,
  });
}

/**
 * 发送密码修改成功通知邮件
 */
export async function sendPasswordChangedEmail(
  email: string,
  username: string
): Promise<SendEmailResult> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>密码已修改</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">密码修改成功</h1>
      </div>
      <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          你好，<strong>${username}</strong>！
        </p>
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          你的密码已成功修改。如果这不是你本人的操作，请立即联系我们。
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #9ca3af; font-size: 12px;">
          — Coconut 团队
        </p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: "你的密码已修改 - Coconut",
    html,
  });
}
