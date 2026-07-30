# Security policy

Please report suspected vulnerabilities privately through GitHub's security
advisory feature. Do not include credentials, payment tokens, personal data, or
exploit details in a public issue.

The maintainers support the latest commit on `main`. Rotate any exposed Openpay
key or `PAYMENT_SIGNING_SECRET` immediately and review provider activity.

Payment amounts, stay rules, descriptions, due dates, and redirect parameters
are derived on the server. Browser-supplied pricing fields are rejected.
