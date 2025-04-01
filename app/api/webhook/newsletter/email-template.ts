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
  return `<!DOCTYPE html>
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
      background-color: #f5f5f5;
    }
    .header, .footer {
      text-align: center;
      margin-bottom: 20px;
    }
    .content {
      background: #fff;
      border-radius: 8px;
      padding: 20px;
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
    .footer p, .unsubscribe {
      font-size: 0.875rem;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${siteName}</h1>
  </div>
  <table class="content" role="presentation" width="100%">
    <tr><td><h2>Hi! I just drafted something new!</h2></td></tr>
    <tr><td><h3>${title}</h3></td></tr>
    ${excerpt ? `<tr><td><p>${excerpt}</p></td></tr>` : ""}
    <tr><td><a href="${link}" class="button">Visit site</a></td></tr>
  </table>
  <div class="footer">
    <p>Thanks for subscribing to ${siteName}</p>
  </div>
</body>
</html>
`;
}
