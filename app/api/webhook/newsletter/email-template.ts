interface EmailTemplateProps {
  title: string;
  excerpt: string;
  link: string;
  siteName: string;
  siteUrl: string;
}

export function generateEmailTemplate({
  title,
  excerpt,
  link,
  siteName,
  siteUrl,
}: EmailTemplateProps): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Post Notification</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .content {
            background: #fff;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .content div {
            width: 100%;
            margin-bottom: 20px;
            text-align: center;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #2b2b2b;
            color: #fff !important;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            font-size: 0.875rem;
            color: #666;
          }
          .unsubscribe {
            color: #666;
            font-size: 0.75rem;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${siteName}</h1>
        </div>
        <div class="content">
          <div>
            <h2>Hi! I just drafted something new!</h2>
          </div>
          <div>
            <h3>${title}</h3>
          </div>
          <div>
            <p>${excerpt}</p>
          </div>
          <a href="${link}" class="button">Visit site</a>
        </div>
        <div class="footer">
          <p>Thanks for subscribing to ${siteName}</p>
        </div>
      </body>
    </html>
  `;
}
