# Forgebot Rituals Canon

## Overview
This document canonizes rituals, triggers, actions, and scrolls for the ForgeBot shrine system. Each ritual binds sponsor pledges to badge emissions, audit logging, and mascot deployment based on misfireCount thresholds.

## Canonized Rituals

### Relic #067 – Headless Jester Hauler
**Type:** Badge Emission Ritual  
**Trigger:** Shrine ping with misfireCount ≥ 3  
**Actions:**
- Awards "🃏 Jester's Gambit" badge
- Deploys Headless Mascot to Discord channels
- Logs audit thread with relic metadata
- Triggers cross-platform notifications (Discord, Slack, Modmail, Email)

**Threshold Logic:**
- `misfireCount >= 3 && misfireCount < 7`: Basic badge award
- `misfireCount >= 7`: Mascot deployment + enhanced audit logging

---

### Relic #109 – Deadwood Echo  
**Type:** Badge Emission Ritual  
**Trigger:** Shrine ping with misfireCount ≥ 5  
**Actions:**
- Awards "🌲 Deadwood Echo" badge
- Deploys Echo Mascot to Discord channels  
- Logs audit thread with relic metadata
- Triggers cross-platform notifications (Discord, Slack, Modmail, Email)

**Threshold Logic:**
- `misfireCount >= 5 && misfireCount < 10`: Basic badge award
- `misfireCount >= 10`: Mascot deployment + enhanced audit logging

---

## Ritual Components

### Triggers
- **Shrine Ping**: Sponsor pledge event that activates the ritual system
- **MisfireCount**: Numerical threshold that determines ritual intensity and actions

### Actions
- **Badge Award**: Grants legendary badge across all platforms
- **Mascot Deployment**: Spawns themed mascot in Discord channels
- **Audit Logging**: Creates relic thread binding event into Kypria's canon
- **Cross-Platform Notification**: Distributes badge metadata via Discord, Slack, Modmail, and Email

### Scrolls (Data Structures)
- **Badge Metadata**: Contains badge emoji, name, tier, and sponsor information
- **Relic Thread**: Audit log structure with thread_id, timestamp, and canonical link
- **Mascot Config**: Deployment parameters for themed mascots

## Integration Points

### Badge API Integration
- **Token**: `ShrineEmitter-BadgeRelic-V1`
- **Scope**: Repository dispatch for badge emission
- **SDK**: `kypria-badge-sdk` for cross-platform badge management

### Audit System
- **Thread Creation**: Automatic relic thread generation
- **Canonical Linking**: Integration with Kypria shrine vault
- **Metadata Binding**: Links sponsor, badge, and ritual data

### Platform Notifications
- **Discord**: Role assignment and embed delivery to `#shrine-echoes`
- **Slack**: Badge notification via workspace integration
- **Modmail**: API-driven badge confirmation messaging
- **Email**: SMTP delivery of badge award summaries