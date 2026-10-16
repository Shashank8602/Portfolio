/**
 * Ways to start an email to the portfolio owner. A bare `mailto:` link silently
 * does nothing on machines with no default mail app, so web-mail links are offered too.
 */
export const DEFAULT_SUBJECT = "Hello from your portfolio";

const enc = encodeURIComponent;

export const mailtoUrl = (to: string, subject = DEFAULT_SUBJECT) => `mailto:${to}?subject=${enc(subject)}`;

export const gmailComposeUrl = (to: string, subject = DEFAULT_SUBJECT) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${enc(to)}&su=${enc(subject)}`;

export const outlookComposeUrl = (to: string, subject = DEFAULT_SUBJECT) =>
  `https://outlook.office.com/mail/deeplink/compose?to=${enc(to)}&subject=${enc(subject)}`;
