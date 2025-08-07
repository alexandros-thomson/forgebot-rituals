# Badge Emission on Shrine Pings

## Overview
- When a sponsor pledge triggers a shrine ping, ForgeBot emits a legendary badge across Discord, Modmail, Slack, and Email.
- Every emission is audit-logged as a relic thread, binding the event into Kypria’s living canon.
## Canonized Rituals

### Relic #067 – Headless Jester Hauler
- **Trigger**: Shrine ping with misfireCount ≥ 3
- **Badge**: 🃏 Jester's Gambit
- **Actions**: Badge award, mascot deployment (misfireCount ≥ 7), audit logging

### Relic #109 – Deadwood Echo
- **Trigger**: Shrine ping with misfireCount ≥ 5  
- **Badge**: 🌲 Deadwood Echo
- **Actions**: Badge award, mascot deployment (misfireCount ≥ 10), audit logging

*For detailed ritual specifications, see [Canon.md](Canon.md)*

## Prerequisites
- **GitHub Token:** `ShrineEmitter-BadgeRelic-V1` (repo scope for `repository_dispatch`)
- **Node.js ≥16**
- **Env Vars & Secrets**  
  • `DISCORD_TOKEN`  
  • `SLACK_TOKEN`  
  • `MODMAIL_API_KEY`  
  • `EMAIL_SMTP_URL`, `EMAIL_SMTP_USER`, `EMAIL_SMTP_PASS`  
  • `BADGE_API_TOKEN`  
- **Packages**  
  ```bash
  npm install discord.js @octokit/rest kypria-badge-sdk nodemailer js-yaml axios
