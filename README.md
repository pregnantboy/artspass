ARTSPASS

Read, write rules
{
  "rules": {
    ".read": "auth.token.email_verified == true && auth.token.email.matches(/.*@asiarisktransfer.com$/)",
    ".write": "auth.token.email_verified == true && auth.token.email.matches(/.*@asiarisktransfer.com$/)"
  }
}