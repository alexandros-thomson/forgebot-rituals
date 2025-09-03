/**
 * SeasonalVoicePacks.js - Dynamic seasonal voice and messaging adaptation
 * Part of the multi-bot orchestration system for Kypria Codex alignment
 */

class SeasonalVoicePacks {
    constructor() {
        this.currentSeason = null;
        this.voicePacks = new Map();
        this.customVoices = new Map();
        this.seasonalOverrides = new Map();
    }

    /**
     * Initialize seasonal voice pack system
     */
    async initialize() {
        console.log('🎭 SeasonalVoicePacks initializing...');
        
        try {
            this.loadVoicePacks();
            this.detectCurrentSeason();
            this.setupSeasonalOverrides();
            this.registerWithBotOrchestration();
            
            console.log(`   ✅ Voice packs loaded for ${this.currentSeason} season`);
            
        } catch (error) {
            console.error('❌ SeasonalVoicePacks initialization failed:', error.message);
            throw error;
        }
    }

    /**
     * Load all available voice packs
     */
    loadVoicePacks() {
        // Spring Voice Pack - Renewal and Growth
        this.voicePacks.set('spring', {
            name: 'Verdant Awakening',
            theme: 'renewal',
            relicEmotes: {
                trigger: '🌱',
                success: '🌸',
                failure: '🌧️',
                critical: '⚡'
            },
            messages: {
                relicTriggered: 'The spring shrine stirs with new life as Relic {relicName} awakens...',
                badgeAwarded: '🌸 A {badgeName} blossoms forth, granted to {recipient} in the season of renewal',
                auditComplete: '🌿 The spring audit reveals: {findings} discoveries in the growing codex',
                shrineEcho: 'Fresh winds carry the shrine\'s echo across the awakening realm...',
                misfireWarning: '🌧️ Spring storms disturb the shrine - {count} disturbances detected',
                orchestrationSync: 'The seasonal harmony aligns all bots in verdant synchronization'
            },
            tonality: 'hopeful',
            mysticalTerms: ['blossoms', 'awakens', 'sprouts', 'blooms', 'flourishes', 'emerges']
        });

        // Summer Voice Pack - Power and Intensity
        this.voicePacks.set('summer', {
            name: 'Solar Dominion',
            theme: 'intensity',
            relicEmotes: {
                trigger: '☀️',
                success: '🔥',
                failure: '🌪️',
                critical: '⚡'
            },
            messages: {
                relicTriggered: 'Under the blazing sun, Relic {relicName} erupts with solar power...',
                badgeAwarded: '🔥 The {badgeName} blazes into existence, forged for {recipient} in summer\'s forge',
                auditComplete: '☀️ The solar audit burns bright: {findings} revelations illuminated',
                shrineEcho: 'Thunder echoes across the summer realm as the shrine responds...',
                misfireWarning: '🌪️ Solar storms rage - {count} disruptions in the heated codex',
                orchestrationSync: 'All bots burn in perfect solar synchronization'
            },
            tonality: 'powerful',
            mysticalTerms: ['blazes', 'erupts', 'burns', 'radiates', 'ignites', 'scorches']
        });

        // Autumn Voice Pack - Wisdom and Harvest
        this.voicePacks.set('autumn', {
            name: 'Harvest Wisdom',
            theme: 'wisdom',
            relicEmotes: {
                trigger: '🍂',
                success: '🎃',
                failure: '🌫️',
                critical: '⚡'
            },
            messages: {
                relicTriggered: 'As leaves fall, the ancient Relic {relicName} whispers forgotten wisdom...',
                badgeAwarded: '🎃 The {badgeName} manifests like autumn mist, bestowed upon {recipient}',
                auditComplete: '🍂 The harvest audit gathers: {findings} grains of wisdom from the season',
                shrineEcho: 'Autumn winds carry the shrine\'s ancient song through golden halls...',
                misfireWarning: '🌫️ Mists of confusion - {count} wayward signals in the harvest',
                orchestrationSync: 'Wisdom flows between all bots in the autumn convergence'
            },
            tonality: 'wise',
            mysticalTerms: ['whispers', 'manifests', 'gathers', 'converges', 'harvests', 'preserves']
        });

        // Winter Voice Pack - Mystery and Preservation
        this.voicePacks.set('winter', {
            name: 'Crystalline Silence',
            theme: 'mystery',
            relicEmotes: {
                trigger: '❄️',
                success: '🔮',
                failure: '🌨️',
                critical: '⚡'
            },
            messages: {
                relicTriggered: 'From winter\'s crystalline depths, Relic {relicName} emerges in silent majesty...',
                badgeAwarded: '🔮 The {badgeName} crystallizes from frost, preserved for {recipient} in eternal ice',
                auditComplete: '❄️ The winter audit reveals: {findings} secrets frozen in time',
                shrineEcho: 'Crystal echoes ring through the silent winter shrine...',
                misfireWarning: '🌨️ Blizzard chaos - {count} frozen signals lost in the storm',
                orchestrationSync: 'All bots unite in the crystalline harmony of winter'
            },
            tonality: 'mysterious',
            mysticalTerms: ['crystallizes', 'emerges', 'preserves', 'freezes', 'reflects', 'endures']
        });

        console.log(`   Loaded ${this.voicePacks.size} seasonal voice packs`);
    }

    /**
     * Detect current season based on date
     */
    detectCurrentSeason() {
        const now = new Date();
        const month = now.getMonth(); // 0-11
        const day = now.getDate();

        // Determine season (Northern Hemisphere)
        if ((month === 2 && day >= 20) || month === 3 || month === 4 || (month === 5 && day < 21)) {
            this.currentSeason = 'spring';
        } else if ((month === 5 && day >= 21) || month === 6 || month === 7 || (month === 8 && day < 23)) {
            this.currentSeason = 'summer';
        } else if ((month === 8 && day >= 23) || month === 9 || month === 10 || (month === 11 && day < 21)) {
            this.currentSeason = 'autumn';
        } else {
            this.currentSeason = 'winter';
        }

        console.log(`   Current season detected: ${this.currentSeason}`);
    }

    /**
     * Set up seasonal message overrides
     */
    setupSeasonalOverrides() {
        const currentPack = this.voicePacks.get(this.currentSeason);
        if (!currentPack) return;

        // Override default bot messages with seasonal variants
        this.seasonalOverrides.set('relic.deadwood.message', 
            currentPack.messages.relicTriggered.replace('{relicName}', 'Deadwood Echo'));
        this.seasonalOverrides.set('relic.jester.message', 
            currentPack.messages.relicTriggered.replace('{relicName}', 'Headless Jester Hauler'));
        
        console.log(`   Applied ${this.seasonalOverrides.size} seasonal overrides`);
    }

    /**
     * Register with bot orchestration system
     */
    registerWithBotOrchestration() {
        console.log('🔗 Registering SeasonalVoicePacks with orchestration...');
        
        // Listen for bot events to apply seasonal voice
        process.on('forgebot:message:format', this.formatSeasonalMessage.bind(this));
        process.on('echobot:echo:format', this.formatSeasonalEcho.bind(this));
        process.on('scrollbot:scroll:format', this.formatSeasonalScroll.bind(this));
        
        console.log('   ✅ SeasonalVoicePacks orchestration registered');
    }

    /**
     * Format a message with current seasonal voice
     */
    formatSeasonalMessage(data) {
        const { messageType, originalText, metadata = {} } = data;
        const currentPack = this.voicePacks.get(this.currentSeason);
        
        if (!currentPack) return originalText;

        let seasonalText = originalText;

        // Apply seasonal emotes
        if (metadata.emoteType && currentPack.relicEmotes[metadata.emoteType]) {
            seasonalText = `${currentPack.relicEmotes[metadata.emoteType]} ${seasonalText}`;
        }

        // Apply seasonal message templates
        if (currentPack.messages[messageType]) {
            seasonalText = this.replaceMessageTemplate(
                currentPack.messages[messageType], 
                metadata
            );
        }

        // Enhance with seasonal mystical terms
        seasonalText = this.enhanceWithSeasonalTerms(seasonalText, currentPack.mysticalTerms);

        console.log(`🎭 Applied ${this.currentSeason} voice: ${messageType}`);
        
        return {
            original: originalText,
            seasonal: seasonalText,
            season: this.currentSeason,
            pack: currentPack.name
        };
    }

    /**
     * Format an echo with seasonal characteristics
     */
    formatSeasonalEcho(data) {
        const { echoType, amplitude, harmonics } = data;
        const currentPack = this.voicePacks.get(this.currentSeason);
        
        if (!currentPack) return data;

        // Modify echo characteristics based on season
        let seasonalAmplitude = amplitude;
        let seasonalHarmonics = [...harmonics];

        switch (this.currentSeason) {
            case 'spring':
                seasonalAmplitude *= 1.1; // Slightly amplified for growth
                seasonalHarmonics.push('renewal', 'growth');
                break;
            case 'summer':
                seasonalAmplitude *= 1.2; // Most amplified for intensity
                seasonalHarmonics.push('power', 'intensity');
                break;
            case 'autumn':
                seasonalAmplitude *= 0.9; // Slightly muted for wisdom
                seasonalHarmonics.push('wisdom', 'harvest');
                break;
            case 'winter':
                seasonalAmplitude *= 0.8; // Most muted for mystery
                seasonalHarmonics.push('mystery', 'preservation');
                break;
        }

        return {
            ...data,
            amplitude: seasonalAmplitude,
            harmonics: seasonalHarmonics,
            seasonalTheme: currentPack.theme
        };
    }

    /**
     * Format a scroll with seasonal styling
     */
    formatSeasonalScroll(data) {
        const { title, content } = data;
        const currentPack = this.voicePacks.get(this.currentSeason);
        
        if (!currentPack) return data;

        const seasonalHeader = `# ${title} - ${currentPack.name} Edition\n\n`;
        const seasonalFooter = `\n\n---\n*Inscribed during the ${this.currentSeason} season with ${currentPack.theme} resonance*\n`;
        
        return {
            ...data,
            content: seasonalHeader + content + seasonalFooter,
            seasonalTheme: currentPack.theme
        };
    }

    /**
     * Replace message template variables
     */
    replaceMessageTemplate(template, metadata) {
        let message = template;
        
        // Replace common variables
        if (metadata.relicName) message = message.replace(/{relicName}/g, metadata.relicName);
        if (metadata.badgeName) message = message.replace(/{badgeName}/g, metadata.badgeName);
        if (metadata.recipient) message = message.replace(/{recipient}/g, metadata.recipient);
        if (metadata.findings) message = message.replace(/{findings}/g, metadata.findings);
        if (metadata.count) message = message.replace(/{count}/g, metadata.count);
        
        return message;
    }

    /**
     * Enhance text with seasonal mystical terms
     */
    enhanceWithSeasonalTerms(text, mysticalTerms) {
        if (!mysticalTerms || mysticalTerms.length === 0) return text;
        
        // Randomly select a mystical term to incorporate (10% chance)
        if (Math.random() < 0.1) {
            const randomTerm = mysticalTerms[Math.floor(Math.random() * mysticalTerms.length)];
            
            // Try to naturally incorporate the term
            if (text.includes('activates')) {
                text = text.replace('activates', randomTerm);
            } else if (text.includes('triggers')) {
                text = text.replace('triggers', randomTerm);
            } else {
                text += ` The power ${randomTerm} throughout the realm.`;
            }
        }
        
        return text;
    }

    /**
     * Force season change (for testing or special events)
     */
    setSeason(season) {
        if (this.voicePacks.has(season)) {
            const previousSeason = this.currentSeason;
            this.currentSeason = season;
            this.setupSeasonalOverrides();
            
            console.log(`🎭 Season manually changed: ${previousSeason} → ${season}`);
            
            // Emit season change event
            process.emit('seasons:changed', {
                previous: previousSeason,
                current: season,
                pack: this.voicePacks.get(season)
            });
        } else {
            console.error(`❌ Unknown season: ${season}`);
        }
    }

    /**
     * Get current voice pack information
     */
    getCurrentVoicePack() {
        return {
            season: this.currentSeason,
            pack: this.voicePacks.get(this.currentSeason),
            overrides: Array.from(this.seasonalOverrides.keys()),
            availableSeasons: Array.from(this.voicePacks.keys())
        };
    }

    /**
     * Create custom voice override
     */
    createCustomVoice(name, config) {
        this.customVoices.set(name, {
            ...config,
            created: new Date().toISOString(),
            custom: true
        });
        
        console.log(`🎭 Custom voice created: ${name}`);
    }

    /**
     * Generate voice pack manifest for orchestration
     */
    generateManifest() {
        const currentPack = this.voicePacks.get(this.currentSeason);
        
        return {
            seasonalvoices: {
                version: '1.0.0',
                currentSeason: this.currentSeason,
                currentPack: currentPack ? currentPack.name : null,
                availablePacks: this.voicePacks.size,
                customVoices: this.customVoices.size,
                overrides: this.seasonalOverrides.size,
                lastUpdate: new Date().toISOString()
            }
        };
    }
}

module.exports = SeasonalVoicePacks;