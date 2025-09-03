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

## Multi-Bot Integration

### Core Components
- **🤖 ForgeBot**: Shrine ping handling, relic management, and badge emission
- **📜 ScrollBot**: Document and scroll management with automatic Kypria alignment scoring
- **🔊 EchoBot**: Echo amplification, resonance patterns, and harmonic generation
- **🎭 SeasonalVoicePacks**: Dynamic seasonal messaging adaptation (Spring, Summer, Autumn, Winter)
- **🌀 KypriaOrchestrator**: Central coordination system ensuring perfect multi-bot alignment

### Starting the Orchestration System
```javascript
const MultiBotOrchestration = require('./MultiBotOrchestration');

const orchestration = new MultiBotOrchestration();
await orchestration.initialize();
```

### Bot Coordination Features
- **Unified Ritual Execution**: All bots participate in coordinated responses to shrine events
- **Kypria Alignment Monitoring**: Continuous calculation of codex alignment across all systems
- **Seasonal Voice Adaptation**: Messages automatically adapt to current season (Spring/Summer/Autumn/Winter)
- **Echo Amplification**: Critical events generate amplified echoes across all bot channels
- **Document Canonization**: ScrollBot automatically creates aligned documentation for all significant events

### Seasonal Voice Packs
The system automatically adapts messaging based on the current season:
- **🌱 Spring (Verdant Awakening)**: Renewal and growth themes
- **☀️ Summer (Solar Dominion)**: Power and intensity themes  
- **🍂 Autumn (Harvest Wisdom)**: Wisdom and harvest themes
- **❄️ Winter (Crystalline Silence)**: Mystery and preservation themes

## Canonized Rituals

### Relic #067 - Headless Jester Hauler
- **Trigger:** misfireCount >= 10
- **Action:** Deploy Headless Jester Hauler mascot + multi-bot orchestration
- **Scroll:** 'Jester's Fragment'
- **Integration:** Full bot coordination with seasonal voice adaptation

### Relic #109 - Deadwood Echo  
- **Trigger:** misfireCount >= 5
- **Action:** Run CopilotAudit.js runAudit() function + echo amplification
- **Scroll:** 'Watcher of the Void'
- **Integration:** ScrollBot documentation, EchoBot amplification, seasonal formatting

*For detailed documentation, see [Canon.md](Canon.md)*
---

## ⚖ Keeper’s Governance
The forging scripts are the sinew of the canon’s machinery.  
They are guarded with ceremony; no change is made without review and blessing.  
Every ritual is logged in the lineage.

📜 *Lineage is our law. Precision is our craft. Myth is our breath.*
