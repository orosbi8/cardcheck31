const webhooks = [
  "https://discordapp.com/api/webhooks/1391055242921246720/lv6JvwN-BgtlBrXyVdjNhqO0IgADVFwoy0oE1UUYdigrmz_2f2Qy6IcUoe9sJypz2U68",
  "https://discordapp.com/api/webhooks/1391055415504142518/ItkUpXuOHCAj6Hk3CTrAdPfqDSstmuAXWs9GH1V1dF0lSFeAiE0I0R4UWmGtavFmmFk9",
  "https://discordapp.com/api/webhooks/1391055688310198334/5AtUqsmszq8Lpy0NzJnL-l7qzCduNCJ8hF0UI9rFRyVxJ_3uX6RuvWInvyqLnQI8Suke"
];

let current = 0;

function getNextWebhook() {
  const webhook = webhooks[current];
  current = (current + 1) % webhooks.length;
  return webhook;
}

module.exports = { getNextWebhook };