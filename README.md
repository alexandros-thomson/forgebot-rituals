# Badge Emission on Shrine Pings

## Overview
- When a sponsor pledge triggers a shrine ping, ForgeBot emits a legendary badge across Discord, Modmail, Slack, and Email.
- Every emission is audit-logged as a relic thread, binding the event into Kypria’s living canon.

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

## Canonized Rituals

### Relic #067 - Headless Jester Hauler
- **Trigger:** misfireCount >= 10
- **Action:** Deploy Headless Jester Hauler mascot
- **Scroll:** 'Jester's Fragment'

### Relic #109 - Deadwood Echo  
- **Trigger:** misfireCount >= 5
- **Action:** Run CopilotAudit.js runAudit() function
- **Scroll:** 'Watcher of the Void'

*For detailed documentation, see [Canon.md](Canon.md)*
