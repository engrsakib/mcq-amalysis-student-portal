/** Crawlers that fetch link previews (OG tags) without a user session. */
const PREVIEW_BOT_UA =
  /facebookexternalhit|Facebot|Twitterbot|WhatsApp|TelegramBot|LinkedInBot|Slackbot|Discordbot|Googlebot|bingbot|Applebot|Pinterestbot/i;

export function isPreviewBot(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  return PREVIEW_BOT_UA.test(userAgent);
}
