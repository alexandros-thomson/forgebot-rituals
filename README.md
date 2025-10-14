# ⚔️ Forgebot Rituals

<p align="center">
  <a href="https://github.com/alexandros-thomson/forgebot-rituals/stargazers">
    <img src="https://img.shields.io/github/stars/alexandros-thomson/forgebot-rituals?style=flat-square&color=d4af37" alt="GitHub Stars" />
  </a>
  <a href="https://github.com/alexandros-thomson/forgebot-rituals/network/members">
    <img src="https://img.shields.io/github/forks/alexandros-thomson/forgebot-rituals?style=flat-square&color=d4af37" alt="GitHub Forks" />
  </a>
  <a href="https://github.com/alexandros-thomson/forgebot-rituals/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/alexandros-thomson/forgebot-rituals?style=flat-square&color=d4af37" alt="License" />
  </a>
  <img src="https://img.shields.io/badge/Language-TypeScript-d4af37?style=flat-square" alt="Language" />
</p>

<p align="center">
  <strong>Automated ceremonial workflows for contributor recognition and badge emission</strong>
</p>

<p align="center">
  <em>— ϟ — Where automation meets mythology, badges become blessings — ϟ —</em>
</p>

---

## 🔱 Overview

**Forgebot Rituals** is the automated ceremonial engine that powers the Kypria ecosystem. When sponsor pledges trigger shrine pings, ForgeBot springs to life—emitting legendary badges across Discord, Modmail, Slack, and Email. Every emission is audit-logged as a relic thread, binding the event into Kypria's living canon.

### Core Purpose:

- ✨ **Badge Emission** — Automatically generate and distribute ceremonial badges
- 🔔 **Multi-Platform Delivery** — Send badges to Discord, Slack, Modmail, and Email
- 📜 **Audit Logging** — Create relic threads for every ceremonial event
- 🎯 **Ritual Automation** — Execute predefined ceremonies based on triggers
- 🔥 **Lineage Preservation** — Bind all events into the living canon

---

## ⚡ Key Features

### 🎖️ Badge Emission System

When a sponsor pledge is detected:
1. **Reception** — ForgeBot receives the shrine ping
2. **Verification** — Validates the pledge against Keeper's seals
3. **Emission** — Generates and distributes legendary badges
4. **Archival** — Creates audit logs and relic threads

### 🕹️ Multi-Platform Integration

- **Discord** — Rich embeds with ceremonial formatting
- **Slack** — Formatted messages with badge attachments
- **Modmail** — Automated ticket creation with badges
- **Email** — HTML-formatted ceremonial notifications

---

## 🛠️ Tech Stack

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Discord.js](https://img.shields.io/badge/Discord.js-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

---

## 💻 Prerequisites

### Required:

- **Node.js** ≥ 16.x
- **GitHub Token:** `ShrineEmitter-BadgeRelic-V1` (repo scope for `repository_dispatch`)

### Environment Variables:

```bash
DISCORD_TOKEN=your_discord_bot_token
SLACK_TOKEN=your_slack_bot_token
MODMAIL_API_KEY=your_modmail_api_key
EMAIL_SMTP_URL=smtp.example.com
EMAIL_SMTP_USER=your_email@example.com
EMAIL_SMTP_PASS=your_smtp_password
BADGE_API_TOKEN=your_badge_api_token
```

### Installation:

```bash
# Clone the repository
git clone https://github.com/alexandros-thomson/forgebot-rituals.git
cd forgebot-rituals

# Install dependencies
npm install discord.js @octokit/rest kypria-badge-sdk nodemailer js-yaml axios

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Run the bot
npm start
```

---

## 📜 Canonized Rituals

### 🎭 Relic #067 - Headless Jester Hauler

- **Trigger:** `misfireCount >= 10`
- **Action:** Deploy Headless Jester Hauler mascot
- **Scroll:** 'Jester's Fragment'
- **Purpose:** Error recovery and debugging assistance

### 🌲 Relic #109 - Deadwood Echo

- **Trigger:** `misfireCount >= 5`
- **Action:** Run `CopilotAudit.js runAudit()` function
- **Scroll:** 'Watcher of the Void'
- **Purpose:** Audit trail verification and integrity check

*For detailed ritual documentation, see [Canon.md](Canon.md)*

---

## 📊 Usage Example

```javascript
const { ForgeBot } = require('./src/forgebot');
const { RitualEmitter } = require('./src/rituals');

// Initialize ForgeBot
const bot = new ForgeBot({
  discord: process.env.DISCORD_TOKEN,
  slack: process.env.SLACK_TOKEN,
  modmail: process.env.MODMAIL_API_KEY,
  email: {
    host: process.env.EMAIL_SMTP_URL,
    user: process.env.EMAIL_SMTP_USER,
    pass: process.env.EMAIL_SMTP_PASS
  }
});

// Register ritual emitter
const emitter = new RitualEmitter(bot);

// Emit badge on shrine ping
emitter.on('shrine-ping', async (payload) => {
  await bot.emitBadge(payload);
  await bot.createRelicThread(payload);
});

// Start listening
bot.start();
```

---

## ⚖️ Keeper's Governance

**The forging scripts are the sinew of the canon's machinery.**

They are guarded with ceremony; no change is made without review and blessing. Every ritual is logged in the lineage.

### Contribution Guidelines:

1. 🔍 **Review Required** — All ritual additions must be reviewed by the Keeper
2. 📐 **Lineage Tracking** — Document the origin and purpose of each ritual
3. 🧪 **Testing Ceremonies** — All rituals must pass ceremonial tests
4. 📝 **Canon Inscription** — Update Canon.md with new ritual details

> 📜 *Lineage is our law. Precision is our craft. Myth is our breath.*

---

## 🤝 Contributing

We welcome contributions to the Forgebot Rituals! To add or enhance a ritual:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-ritual`)
3. Add your ceremonial ritual with proper documentation
4. Ensure all tests pass
5. Submit a pull request with detailed lineage notes
6. Await Keeper's blessing

**All contributions become part of the eternal canon.**

---

## 🌟 Become a Sponsor

[![Sponsor Badge](https://img.shields.io/badge/Sponsor-Become%20a%20Legend-d4af37?style=for-the-badge&logo=github-sponsors&logoColor=white)](https://github.com/sponsors/alexandros-thomson)

By sponsoring this work, you:
- 🏺 Gain your name inscribed in the Eternal Artifact Log
- 🎖️ Receive a ceremonial Discord role
- ⚡ Trigger legendary badge emissions
- 📜 Become part of the living canon

**Every pledge forges a legend.**

---

## 🔗 Related Shrines

- 🌌 [Shrine Watcher](https://github.com/alexandros-thomson/shrine-watcher) — Discord bot that consumes canon artifacts
- 🏺 [Shrine Canon](https://github.com/alexandros-thomson/shrine-canon) — Living repository of ceremonial badges and relics
- 💎 [Sponsor IPN Discord](https://github.com/alexandros-thomson/sponsor-ipn-discord) — PayPal sponsorship webhook handler
- 🏛️ [Alexandros Thomson](https://github.com/alexandros-thomson) — Main profile and Basilica Gate

---

## 📜 License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.

---

<p align="center">
  <strong>— ϟ — May your rituals be ever precise, your ceremonies ever sacred — ϟ —</strong>
</p>

<p align="center">
  <em>Part of the Kypria — Shrine of the Sealed Canon</em>
</p>
