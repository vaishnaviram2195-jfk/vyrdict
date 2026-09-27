// The unapproved growth pages were removed. Preserve a 410 response for old links.
module.exports = function handler(req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=60');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  return res.status(410).send('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>Page removed | VYRDICT</title><body><p>This page is no longer available.</p><a href="/">Return to VYRDICT</a></body></html>');
};
