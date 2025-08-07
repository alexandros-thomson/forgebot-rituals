# Canonized Relics - ForgeBot Rituals

## Overview
This document contains the official canonization of relics within the ForgeBot ritual system. Each relic represents a specific trigger-action pattern that binds events into Kypria's living canon.

## Relic #067 - Headless Jester Hauler

**Trigger:** When `misfireCount >= 10` in shrine ping handler
**Action:** Deploy the Headless Jester Hauler mascot and award badge
**Associated Scroll:** 'Jester's Fragment'

### Description
The Headless Jester Hauler manifests when the shrine system experiences persistent failures (10+ misfires). This relic serves as both a warning mechanism and a humorous acknowledgment of system instability. The jester mascot acts as a herald of chaos, while the Jester's Fragment badge marks the bearer as one who has witnessed the shrine's comedic failures.

### Implementation Details
- **Misfire Threshold:** 10
- **Badge Awarded:** 'Jester's Fragment'
- **Visual Manifestation:** Headless Jester Hauler mascot deployment
- **Logging:** Event recorded as relic thread with full misfire context

---

## Relic #109 - Deadwood Echo

**Trigger:** When `misfireCount >= 5` in shrine ping handler
**Action:** Invoke CopilotAudit.js runAudit() function and award badge
**Associated Scroll:** 'Watcher of the Void'

### Description
The Deadwood Echo emerges from moderate shrine instability (5+ misfires), serving as an early warning system. This relic triggers an automated audit process to investigate the root causes of failures. The Watcher of the Void badge signifies vigilance in the face of system degradation.

### Implementation Details
- **Misfire Threshold:** 5
- **Badge Awarded:** 'Watcher of the Void'
- **Action Trigger:** CopilotAudit.js `runAudit()` function
- **Purpose:** Early detection and automated investigation of shrine failures
- **Logging:** Audit results bound to relic thread for canonical preservation

---

## Canonization Process
Both relics have been integrated into the shrine ping handler system to provide automated responses to different levels of system instability, ensuring that failures become part of the living narrative rather than silent errors.