/**
 * KypriaOrchestrator.js - Central orchestration system for multi-bot Kypria Codex alignment
 * Coordinates ForgeBot, ScrollBot, EchoBot, and SeasonalVoicePacks for unified ritual execution
 */

const ForgeBot = require('./shrinePingHandler');
const ScrollBot = require('./ScrollBot');
const EchoBot = require('./EchoBot');
const SeasonalVoicePacks = require('./SeasonalVoicePacks');
const EventEmitter = require('events');

class KypriaOrchestrator extends EventEmitter {
    constructor() {
        super();
        this.bots = new Map();
        this.alignmentMatrix = new Map();
        this.orchestrationState = 'idle';
        this.convergenceThreshold = 0.85;
        this.lastAlignment = null;
        this.ritualQueue = [];
        this.activeRituals = new Set();
    }

    /**
     * Initialize the multi-bot orchestration system
     */
    async initialize() {
        console.log('🌀 KypriaOrchestrator initializing multi-bot alignment...');
        
        try {
            // Initialize all bot components
            await this.initializeBotComponents();
            
            // Set up inter-bot communication
            this.setupInterBotCommunication();
            
            // Start orchestration monitoring
            this.startOrchestrationLoop();
            
            // Calculate initial alignment
            await this.calculateKypriaAlignment();
            
            console.log('   ✅ Multi-bot orchestration system ready');
            console.log(`   🎯 Current Kypria alignment: ${(this.lastAlignment * 100).toFixed(1)}%`);
            
        } catch (error) {
            console.error('❌ KypriaOrchestrator initialization failed:', error.message);
            throw error;
        }
    }

    /**
     * Initialize all bot components
     */
    async initializeBotComponents() {
        console.log('   Initializing bot components...');
        
        // Initialize ForgeBot (shrine ping handler)
        const forgeBot = new ForgeBot();
        this.bots.set('forgebot', {
            instance: forgeBot,
            type: 'shrine',
            status: 'active',
            alignment: 0.9, // ForgeBot is core to the system
            lastHeartbeat: Date.now()
        });
        
        // Initialize ScrollBot
        const scrollBot = new ScrollBot();
        await scrollBot.initialize();
        this.bots.set('scrollbot', {
            instance: scrollBot,
            type: 'documentation',
            status: 'active',
            alignment: 0.8,
            lastHeartbeat: Date.now()
        });
        
        // Initialize EchoBot
        const echoBot = new EchoBot();
        await echoBot.initialize();
        this.bots.set('echobot', {
            instance: echoBot,
            type: 'amplification',
            status: 'active',
            alignment: 0.85,
            lastHeartbeat: Date.now()
        });
        
        // Initialize SeasonalVoicePacks
        const voicePacks = new SeasonalVoicePacks();
        await voicePacks.initialize();
        this.bots.set('seasonalvoices', {
            instance: voicePacks,
            type: 'adaptation',
            status: 'active',
            alignment: 0.75,
            lastHeartbeat: Date.now()
        });
        
        console.log(`   ✅ ${this.bots.size} bot components initialized`);
    }

    /**
     * Set up inter-bot communication channels
     */
    setupInterBotCommunication() {
        console.log('   Setting up inter-bot communication...');
        
        // ForgeBot -> Other Bots communication
        process.on('forgebot:relic:triggered', (data) => {
            this.handleRelicTrigger(data);
        });
        
        process.on('forgebot:badge:awarded', (data) => {
            this.handleBadgeAward(data);
        });
        
        process.on('forgebot:shrine:ping', (data) => {
            this.handleShrinePing(data);
        });
        
        // EchoBot -> Other Bots communication
        const echoBot = this.bots.get('echobot').instance;
        echoBot.on('echo:created', (echo) => {
            this.propagateEcho(echo);
        });
        
        echoBot.on('echo:amplified', (echo) => {
            this.handleEchoAmplification(echo);
        });
        
        // Seasonal change events
        process.on('seasons:changed', (data) => {
            this.handleSeasonalChange(data);
        });
        
        console.log('   ✅ Inter-bot communication established');
    }

    /**
     * Start the orchestration monitoring loop
     */
    startOrchestrationLoop() {
        setInterval(async () => {
            await this.performOrchestrationCycle();
        }, 5000); // Run every 5 seconds
        
        console.log('   ✅ Orchestration loop started');
    }

    /**
     * Perform a complete orchestration cycle
     */
    async performOrchestrationCycle() {
        try {
            // Update bot heartbeats
            this.updateBotHeartbeats();
            
            // Process ritual queue
            await this.processRitualQueue();
            
            // Calculate current alignment
            await this.calculateKypriaAlignment();
            
            // Check for convergence opportunities
            await this.checkConvergenceOpportunities();
            
            // Emit orchestration status
            this.emit('orchestration:cycle', {
                alignment: this.lastAlignment,
                state: this.orchestrationState,
                activeBots: this.getActiveBots().length,
                queuedRituals: this.ritualQueue.length
            });
            
        } catch (error) {
            console.error('Orchestration cycle error:', error.message);
        }
    }

    /**
     * Handle relic trigger events across all bots
     */
    async handleRelicTrigger(data) {
        console.log(`🌀 Orchestrating relic trigger: ${data.relicType}`);
        
        // Create unified ritual
        const ritual = {
            id: this.generateRitualId(),
            type: 'relic_trigger',
            data,
            participants: ['forgebot'],
            started: Date.now(),
            status: 'active'
        };
        
        // Add ScrollBot documentation
        const scrollBot = this.bots.get('scrollbot').instance;
        const scrollData = await scrollBot.createScroll(
            `Relic Activation - ${data.relicType}`,
            `Relic ${data.relicType} was triggered with ${data.misfireCount} misfires at ${data.timestamp}`,
            { ritual: ritual.id, relic: data.relicType }
        );
        ritual.participants.push('scrollbot');
        
        // Trigger EchoBot amplification
        process.emit('forgebot:relic:triggered', data);
        ritual.participants.push('echobot');
        
        // Apply seasonal voice formatting
        const voicePacks = this.bots.get('seasonalvoices').instance;
        const seasonalMessage = voicePacks.formatSeasonalMessage({
            messageType: 'relicTriggered',
            originalText: `Relic ${data.relicType} triggered`,
            metadata: { relicName: data.relicType, emoteType: 'trigger' }
        });
        ritual.participants.push('seasonalvoices');
        
        // Store ritual
        this.activeRituals.add(ritual);
        
        console.log(`   🌀 Unified ritual ${ritual.id} orchestrated with ${ritual.participants.length} bots`);
        
        // Schedule ritual completion
        setTimeout(() => {
            this.completeRitual(ritual.id);
        }, 10000); // Complete after 10 seconds
    }

    /**
     * Handle badge award events across all bots
     */
    async handleBadgeAward(data) {
        console.log(`🌀 Orchestrating badge award: ${data.badgeName}`);
        
        const ritual = {
            id: this.generateRitualId(),
            type: 'badge_award',
            data,
            participants: ['forgebot'],
            started: Date.now(),
            status: 'active'
        };
        
        // Document in ScrollBot
        const scrollBot = this.bots.get('scrollbot').instance;
        await scrollBot.createScroll(
            `Badge Awarded - ${data.badgeName}`,
            `Badge '${data.badgeName}' was awarded to ${data.recipient} with metadata: ${JSON.stringify(data.metadata)}`,
            { ritual: ritual.id, badge: data.badgeName }
        );
        ritual.participants.push('scrollbot');
        
        // Echo amplification
        process.emit('forgebot:badge:awarded', data);
        ritual.participants.push('echobot');
        
        // Seasonal formatting
        const voicePacks = this.bots.get('seasonalvoices').instance;
        voicePacks.formatSeasonalMessage({
            messageType: 'badgeAwarded',
            originalText: `Badge ${data.badgeName} awarded`,
            metadata: { badgeName: data.badgeName, recipient: data.recipient, emoteType: 'success' }
        });
        ritual.participants.push('seasonalvoices');
        
        this.activeRituals.add(ritual);
        
        setTimeout(() => {
            this.completeRitual(ritual.id);
        }, 8000);
    }

    /**
     * Handle shrine ping events
     */
    async handleShrinePing(data) {
        console.log(`🌀 Orchestrating shrine ping response`);
        
        // Only create full ritual for significant pings
        if (!data.success || data.misfireCount > 0) {
            const ritual = {
                id: this.generateRitualId(),
                type: 'shrine_response',
                data,
                participants: ['forgebot', 'echobot'],
                started: Date.now(),
                status: 'active'
            };
            
            // Amplify failed pings
            process.emit('forgebot:shrine:ping', data);
            
            this.activeRituals.add(ritual);
            
            setTimeout(() => {
                this.completeRitual(ritual.id);
            }, 5000);
        }
    }

    /**
     * Propagate echo across all relevant systems
     */
    propagateEcho(echo) {
        // Apply seasonal characteristics to echo
        const voicePacks = this.bots.get('seasonalvoices').instance;
        const seasonalEcho = voicePacks.formatSeasonalEcho(echo);
        
        // Log echo in ScrollBot if it's significant
        if (echo.amplitude > 0.8) {
            const scrollBot = this.bots.get('scrollbot').instance;
            scrollBot.createScroll(
                `Significant Echo - ${echo.type}`,
                `High-amplitude echo detected: ${JSON.stringify(seasonalEcho)}`,
                { echo: echo.id, amplitude: echo.amplitude }
            );
        }
        
        console.log(`🌀 Echo propagated: ${echo.type} (amplitude: ${echo.amplitude.toFixed(2)})`);
    }

    /**
     * Handle echo amplification events
     */
    handleEchoAmplification(echo) {
        // Amplified echoes trigger additional documentation
        if (echo.amplitude > 1.5) {
            console.log(`🌀 Critical echo amplification detected - triggering emergency documentation`);
            
            const scrollBot = this.bots.get('scrollbot').instance;
            scrollBot.createScroll(
                `Critical Echo Alert - ${echo.type}`,
                `CRITICAL: Echo amplified beyond normal parameters - immediate attention required`,
                { critical: true, echo: echo.id, amplitude: echo.amplitude }
            );
        }
    }

    /**
     * Handle seasonal change events
     */
    async handleSeasonalChange(data) {
        console.log(`🌀 Orchestrating seasonal transition: ${data.previous} → ${data.current}`);
        
        // Notify all bots of seasonal change
        for (const [name, bot] of this.bots) {
            if (bot.instance.handleSeasonalChange) {
                await bot.instance.handleSeasonalChange(data);
            }
        }
        
        // Recalculate alignment after seasonal change
        await this.calculateKypriaAlignment();
        
        // Create seasonal transition scroll
        const scrollBot = this.bots.get('scrollbot').instance;
        await scrollBot.createScroll(
            `Seasonal Transition - ${data.current.charAt(0).toUpperCase() + data.current.slice(1)}`,
            `The realm transitions from ${data.previous} to ${data.current}. All bots adapt their resonance to the new seasonal patterns.`,
            { seasonal: true, transition: `${data.previous}_to_${data.current}` }
        );
    }

    /**
     * Process queued rituals
     */
    async processRitualQueue() {
        while (this.ritualQueue.length > 0 && this.activeRituals.size < 5) {
            const ritual = this.ritualQueue.shift();
            await this.executeRitual(ritual);
        }
    }

    /**
     * Execute a queued ritual
     */
    async executeRitual(ritual) {
        console.log(`🌀 Executing queued ritual: ${ritual.type}`);
        
        ritual.status = 'executing';
        ritual.started = Date.now();
        
        // Execute based on ritual type
        switch (ritual.type) {
            case 'alignment_convergence':
                await this.performAlignmentConvergence();
                break;
            case 'bot_synchronization':
                await this.performBotSynchronization();
                break;
            case 'codex_update':
                await this.performCodexUpdate(ritual.data);
                break;
        }
        
        this.activeRituals.add(ritual);
        
        setTimeout(() => {
            this.completeRitual(ritual.id);
        }, ritual.duration || 15000);
    }

    /**
     * Complete a ritual and clean up
     */
    completeRitual(ritualId) {
        const ritual = Array.from(this.activeRituals).find(r => r.id === ritualId);
        if (ritual) {
            ritual.status = 'completed';
            ritual.completed = Date.now();
            ritual.duration = ritual.completed - ritual.started;
            
            console.log(`🌀 Ritual completed: ${ritual.type} (${ritual.duration}ms)`);
            
            this.activeRituals.delete(ritual);
            
            // Emit completion event
            this.emit('ritual:completed', ritual);
        }
    }

    /**
     * Calculate overall Kypria Codex alignment
     */
    async calculateKypriaAlignment() {
        let totalAlignment = 0;
        let activeBotsCount = 0;
        
        for (const [name, bot] of this.bots) {
            if (bot.status === 'active') {
                totalAlignment += bot.alignment;
                activeBotsCount++;
                
                // Update bot-specific alignment if the bot supports it
                if (bot.instance.generateManifest) {
                    const manifest = bot.instance.generateManifest();
                    // Update alignment based on manifest data
                    if (manifest.scrollbot && manifest.scrollbot.averageAlignment) {
                        bot.alignment = manifest.scrollbot.averageAlignment;
                    }
                }
            }
        }
        
        this.lastAlignment = activeBotsCount > 0 ? totalAlignment / activeBotsCount : 0;
        
        // Store in alignment matrix
        this.alignmentMatrix.set(Date.now(), this.lastAlignment);
        
        // Keep only last 100 measurements
        if (this.alignmentMatrix.size > 100) {
            const oldest = Math.min(...this.alignmentMatrix.keys());
            this.alignmentMatrix.delete(oldest);
        }
        
        return this.lastAlignment;
    }

    /**
     * Check for convergence opportunities
     */
    async checkConvergenceOpportunities() {
        if (this.lastAlignment >= this.convergenceThreshold) {
            if (this.orchestrationState !== 'converged') {
                console.log('🌀 ✨ KYPRIA CONVERGENCE ACHIEVED ✨');
                this.orchestrationState = 'converged';
                await this.performConvergenceRitual();
            }
        } else {
            if (this.orchestrationState === 'converged') {
                console.log('🌀 Convergence lost - realigning systems...');
                this.orchestrationState = 'realigning';
                this.queueRitual({
                    type: 'alignment_convergence',
                    data: { targetAlignment: this.convergenceThreshold },
                    priority: 'high'
                });
            }
        }
    }

    /**
     * Perform convergence ritual
     */
    async performConvergenceRitual() {
        console.log('🌀 Performing Kypria Convergence Ritual...');
        
        // Synchronize all bots
        const syncRitual = {
            id: this.generateRitualId(),
            type: 'convergence_ritual',
            data: { alignment: this.lastAlignment },
            participants: Array.from(this.bots.keys()),
            started: Date.now(),
            status: 'active'
        };
        
        // Create convergence scroll
        const scrollBot = this.bots.get('scrollbot').instance;
        await scrollBot.createScroll(
            'Kypria Convergence Achieved',
            `All bots have achieved perfect alignment with the Kypria Codex. Convergence level: ${(this.lastAlignment * 100).toFixed(1)}%`,
            { convergence: true, alignment: this.lastAlignment, timestamp: new Date().toISOString() }
        );
        
        // Amplify convergence echo
        const echoBot = this.bots.get('echobot').instance;
        echoBot.createEcho('convergence:achieved', {
            alignment: this.lastAlignment,
            participants: syncRitual.participants,
            message: 'Perfect Kypria alignment achieved across all orchestrated systems'
        });
        
        this.activeRituals.add(syncRitual);
        
        setTimeout(() => {
            this.completeRitual(syncRitual.id);
        }, 20000); // Convergence rituals take longer
    }

    /**
     * Queue a ritual for execution
     */
    queueRitual(ritual) {
        ritual.id = ritual.id || this.generateRitualId();
        ritual.queued = Date.now();
        
        // Insert based on priority
        if (ritual.priority === 'high') {
            this.ritualQueue.unshift(ritual);
        } else {
            this.ritualQueue.push(ritual);
        }
        
        console.log(`🌀 Ritual queued: ${ritual.type} (priority: ${ritual.priority || 'normal'})`);
    }

    /**
     * Update bot heartbeats
     */
    updateBotHeartbeats() {
        for (const [name, bot] of this.bots) {
            if (bot.status === 'active') {
                bot.lastHeartbeat = Date.now();
            }
        }
    }

    /**
     * Get active bots
     */
    getActiveBots() {
        return Array.from(this.bots.entries())
            .filter(([name, bot]) => bot.status === 'active')
            .map(([name, bot]) => ({ name, ...bot }));
    }

    /**
     * Generate unique ritual ID
     */
    generateRitualId() {
        return 'ritual-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36);
    }

    /**
     * Generate orchestration status manifest
     */
    generateManifest() {
        const activeBots = this.getActiveBots();
        
        return {
            kypriaorchestrator: {
                version: '1.0.0',
                state: this.orchestrationState,
                alignment: this.lastAlignment,
                convergenceThreshold: this.convergenceThreshold,
                activeBots: activeBots.length,
                totalBots: this.bots.size,
                activeRituals: this.activeRituals.size,
                queuedRituals: this.ritualQueue.length,
                bots: activeBots.map(bot => ({
                    name: bot.name,
                    type: bot.type,
                    alignment: bot.alignment,
                    status: bot.status
                })),
                lastUpdate: new Date().toISOString()
            }
        };
    }

    /**
     * Force alignment recalculation
     */
    async forceRealignment() {
        console.log('🌀 Forcing system realignment...');
        
        this.orchestrationState = 'realigning';
        
        for (const [name, bot] of this.bots) {
            if (bot.instance.initialize) {
                await bot.instance.initialize();
            }
        }
        
        await this.calculateKypriaAlignment();
        
        console.log(`🌀 Realignment complete - new alignment: ${(this.lastAlignment * 100).toFixed(1)}%`);
    }
}

module.exports = KypriaOrchestrator;