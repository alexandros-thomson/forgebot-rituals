/**
 * EchoBot.js - Echo amplification and response integration for ForgeBot rituals
 * Part of the multi-bot orchestration system for Kypria Codex alignment
 */

const EventEmitter = require('events');

class EchoBot extends EventEmitter {
    constructor() {
        super();
        this.echoChambers = new Map();
        this.resonancePatterns = new Map();
        this.activeEchoes = 0;
        this.maxEchoes = 10; // Prevent echo overflow
    }

    /**
     * Initialize EchoBot with resonance patterns
     */
    async initialize() {
        console.log('🔊 EchoBot initializing...');
        
        try {
            this.setupResonancePatterns();
            this.registerWithForgeBot();
            this.startEchoMonitoring();
            
            console.log('   ✅ EchoBot ready for echo amplification');
            
        } catch (error) {
            console.error('❌ EchoBot initialization failed:', error.message);
            throw error;
        }
    }

    /**
     * Set up resonance patterns for different types of shrine events
     */
    setupResonancePatterns() {
        // Relic trigger patterns
        this.resonancePatterns.set('relic:deadwood', {
            frequency: 'low',
            amplitude: 0.7,
            decay: 5000, // 5 seconds
            harmonics: ['audit', 'investigation', 'vigilance']
        });
        
        this.resonancePatterns.set('relic:jester', {
            frequency: 'chaotic',
            amplitude: 0.9,
            decay: 8000, // 8 seconds
            harmonics: ['chaos', 'comedy', 'failure']
        });
        
        // Badge emission patterns
        this.resonancePatterns.set('badge:emission', {
            frequency: 'high',
            amplitude: 0.8,
            decay: 3000, // 3 seconds
            harmonics: ['achievement', 'honor', 'recognition']
        });
        
        // Shrine ping patterns
        this.resonancePatterns.set('shrine:ping', {
            frequency: 'pure',
            amplitude: 1.0,
            decay: 2000, // 2 seconds
            harmonics: ['connection', 'response', 'acknowledgment']
        });
        
        console.log(`   Loaded ${this.resonancePatterns.size} resonance patterns`);
    }

    /**
     * Register integration with ForgeBot shrine system
     */
    registerWithForgeBot() {
        console.log('🔗 Registering EchoBot integration with ForgeBot...');
        
        // Listen for ForgeBot events to echo
        process.on('forgebot:relic:triggered', this.handleRelicEcho.bind(this));
        process.on('forgebot:badge:awarded', this.handleBadgeEcho.bind(this));
        process.on('forgebot:shrine:ping', this.handleShrineEcho.bind(this));
        process.on('forgebot:audit:complete', this.handleAuditEcho.bind(this));
        
        console.log('   ✅ EchoBot integration registered');
    }

    /**
     * Start monitoring for echo resonance
     */
    startEchoMonitoring() {
        setInterval(() => {
            this.updateEchoResonance();
            this.cleanupExpiredEchoes();
        }, 1000); // Check every second
    }

    /**
     * Create an echo for a given event
     */
    createEcho(eventType, data, options = {}) {
        if (this.activeEchoes >= this.maxEchoes) {
            console.warn('🔊⚠️  Echo chamber overflow - dropping echo');
            return null;
        }

        const pattern = this.resonancePatterns.get(eventType) || this.getDefaultPattern();
        const echoId = this.generateEchoId();
        
        const echo = {
            id: echoId,
            type: eventType,
            data,
            pattern,
            created: Date.now(),
            expires: Date.now() + pattern.decay,
            amplitude: pattern.amplitude,
            resonating: true,
            responses: []
        };
        
        this.echoChambers.set(echoId, echo);
        this.activeEchoes++;
        
        console.log(`🔊 Echo created: ${eventType} (${echoId}) - Amplitude: ${pattern.amplitude}`);
        
        // Emit the echo for other systems to respond
        this.emit('echo:created', echo);
        
        // Generate harmonics if configured
        if (pattern.harmonics && pattern.harmonics.length > 0) {
            this.generateHarmonics(echo);
        }
        
        return echo;
    }

    /**
     * Generate harmonic responses for an echo
     */
    generateHarmonics(echo) {
        const { harmonics } = echo.pattern;
        
        setTimeout(() => {
            harmonics.forEach((harmonic, index) => {
                const harmonicEcho = {
                    id: `${echo.id}-h${index}`,
                    type: `harmonic:${harmonic}`,
                    parent: echo.id,
                    created: Date.now(),
                    amplitude: echo.amplitude * 0.6, // Harmonics are quieter
                    resonating: true
                };
                
                console.log(`   🎵 Harmonic echo: ${harmonic} (${harmonicEcho.id})`);
                this.emit('echo:harmonic', harmonicEcho);
            });
        }, 500); // Slight delay for harmonic generation
    }

    /**
     * Handle relic trigger echoes
     */
    async handleRelicEcho(data) {
        const { relicType, misfireCount, timestamp } = data;
        
        let echoType = 'relic:unknown';
        if (relicType.includes('Deadwood')) echoType = 'relic:deadwood';
        if (relicType.includes('Jester')) echoType = 'relic:jester';
        
        const echo = this.createEcho(echoType, {
            relic: relicType,
            misfireCount,
            timestamp,
            message: `Relic ${relicType} echo - ${misfireCount} misfires detected`
        });
        
        // Special handling for high misfire counts
        if (misfireCount >= 10) {
            this.amplifyEcho(echo.id, 1.5); // Boost amplitude for critical failures
        }
    }

    /**
     * Handle badge award echoes
     */
    async handleBadgeEcho(data) {
        const { badgeName, recipient, metadata } = data;
        
        const echo = this.createEcho('badge:emission', {
            badge: badgeName,
            recipient,
            metadata,
            message: `Badge '${badgeName}' awarded - echo across all channels`
        });
        
        // Create additional echoes for special badges
        if (badgeName.includes('Fragment') || badgeName.includes('Void')) {
            setTimeout(() => {
                this.createEcho('badge:special', {
                    originalBadge: badgeName,
                    message: `Special badge echo: ${badgeName} resonance detected`
                });
            }, 1000);
        }
    }

    /**
     * Handle shrine ping echoes
     */
    async handleShrineEcho(data) {
        const { eventType, success, timestamp } = data;
        
        const echo = this.createEcho('shrine:ping', {
            event: eventType,
            success,
            timestamp,
            message: success ? 'Shrine ping successful - echo acknowledged' : 'Shrine ping failed - distress echo'
        });
        
        // Failed pings get amplified to alert systems
        if (!success) {
            this.amplifyEcho(echo.id, 1.3);
        }
    }

    /**
     * Handle audit completion echoes
     */
    async handleAuditEcho(data) {
        const { auditId, findings, recommendations } = data;
        
        this.createEcho('audit:complete', {
            audit: auditId,
            findings: findings.length,
            recommendations: recommendations.length,
            message: `Audit ${auditId} complete - ${findings.length} findings, ${recommendations.length} recommendations`
        });
    }

    /**
     * Amplify an existing echo
     */
    amplifyEcho(echoId, multiplier = 1.5) {
        const echo = this.echoChambers.get(echoId);
        if (echo) {
            echo.amplitude = Math.min(echo.amplitude * multiplier, 2.0); // Cap at 2.0
            console.log(`🔊⬆️  Echo amplified: ${echoId} - New amplitude: ${echo.amplitude.toFixed(2)}`);
            this.emit('echo:amplified', echo);
        }
    }

    /**
     * Update echo resonance over time
     */
    updateEchoResonance() {
        const now = Date.now();
        
        for (const [id, echo] of this.echoChambers) {
            if (echo.resonating && now < echo.expires) {
                // Natural decay
                const age = now - echo.created;
                const decay = echo.pattern.decay;
                echo.amplitude = echo.pattern.amplitude * (1 - (age / decay));
                
                if (echo.amplitude <= 0.1) {
                    echo.resonating = false;
                }
            }
        }
    }

    /**
     * Clean up expired echoes
     */
    cleanupExpiredEchoes() {
        const now = Date.now();
        const toRemove = [];
        
        for (const [id, echo] of this.echoChambers) {
            if (now >= echo.expires || echo.amplitude <= 0.05) {
                toRemove.push(id);
            }
        }
        
        toRemove.forEach(id => {
            this.echoChambers.delete(id);
            this.activeEchoes--;
            console.log(`🔊🗑️  Echo expired: ${id}`);
        });
    }

    /**
     * Get default resonance pattern
     */
    getDefaultPattern() {
        return {
            frequency: 'medium',
            amplitude: 0.5,
            decay: 3000,
            harmonics: []
        };
    }

    /**
     * Generate unique echo ID
     */
    generateEchoId() {
        return 'echo-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36);
    }

    /**
     * Get current echo status
     */
    getEchoStatus() {
        const activeEchoes = Array.from(this.echoChambers.values())
            .filter(echo => echo.resonating);
        
        return {
            active: activeEchoes.length,
            total: this.echoChambers.size,
            averageAmplitude: activeEchoes.length > 0 
                ? activeEchoes.reduce((sum, echo) => sum + echo.amplitude, 0) / activeEchoes.length 
                : 0,
            chambers: Array.from(this.echoChambers.keys()),
            patterns: Array.from(this.resonancePatterns.keys())
        };
    }

    /**
     * Generate echo manifest for orchestration
     */
    generateManifest() {
        const status = this.getEchoStatus();
        
        return {
            echobot: {
                version: '1.0.0',
                status,
                patterns: this.resonancePatterns.size,
                chambers: this.echoChambers.size,
                maxEchoes: this.maxEchoes,
                lastUpdate: new Date().toISOString()
            }
        };
    }
}

module.exports = EchoBot;