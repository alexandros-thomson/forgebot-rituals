/**
 * MultiBotOrchestration.js - Main entry point for multi-bot orchestration system
 * Integrates ForgeBot, ScrollBot, EchoBot, and SeasonalVoicePacks under Kypria Codex alignment
 */

const KypriaOrchestrator = require('./KypriaOrchestrator');

class MultiBotOrchestration {
    constructor() {
        this.orchestrator = null;
        this.initialized = false;
        this.startTime = null;
    }

    /**
     * Initialize the complete multi-bot orchestration system
     */
    async initialize() {
        console.log('🌟 Starting Multi-Bot Orchestration System for Kypria Codex Alignment...');
        console.log('================================================================================');
        
        try {
            this.startTime = Date.now();
            
            // Initialize the main orchestrator
            this.orchestrator = new KypriaOrchestrator();
            await this.orchestrator.initialize();
            
            // Set up global event handlers
            this.setupGlobalEventHandlers();
            
            // Register cleanup handlers
            this.registerCleanupHandlers();
            
            this.initialized = true;
            
            const initTime = Date.now() - this.startTime;
            console.log('================================================================================');
            console.log(`🌟 ✅ Multi-Bot Orchestration System Ready (${initTime}ms)`);
            console.log('🌟 🤖 ForgeBot: Shrine ping handling and relic management');
            console.log('🌟 📜 ScrollBot: Document and scroll management with Kypria alignment');
            console.log('🌟 🔊 EchoBot: Echo amplification and resonance patterns');
            console.log('🌟 🎭 SeasonalVoicePacks: Dynamic seasonal messaging adaptation');
            console.log('🌟 🌀 KypriaOrchestrator: Unified multi-bot coordination');
            console.log('================================================================================');
            
            // Start demonstration if requested
            if (process.env.DEMO_MODE === 'true') {
                await this.runDemonstration();
            }
            
        } catch (error) {
            console.error('❌ Multi-Bot Orchestration initialization failed:', error.message);
            throw error;
        }
    }

    /**
     * Set up global event handlers for monitoring
     */
    setupGlobalEventHandlers() {
        // Monitor orchestration cycles
        this.orchestrator.on('orchestration:cycle', (data) => {
            if (data.alignment < 0.7) {
                console.log(`⚠️  Low Kypria alignment detected: ${(data.alignment * 100).toFixed(1)}%`);
            }
        });

        // Monitor ritual completions
        this.orchestrator.on('ritual:completed', (ritual) => {
            console.log(`✅ Ritual completed: ${ritual.type} (${ritual.participants.join(', ')})`);
        });

        // Monitor critical events
        process.on('uncaughtException', (error) => {
            console.error('💥 Uncaught exception in orchestration system:', error.message);
            this.emergencyShutdown();
        });

        process.on('unhandledRejection', (reason, promise) => {
            console.error('💥 Unhandled rejection in orchestration system:', reason);
            this.emergencyShutdown();
        });
    }

    /**
     * Register cleanup handlers for graceful shutdown
     */
    registerCleanupHandlers() {
        process.on('SIGINT', () => {
            console.log('\n🌟 Gracefully shutting down Multi-Bot Orchestration System...');
            this.gracefulShutdown();
        });

        process.on('SIGTERM', () => {
            console.log('\n🌟 Received SIGTERM - shutting down Multi-Bot Orchestration System...');
            this.gracefulShutdown();
        });
    }

    /**
     * Run a demonstration of the multi-bot system
     */
    async runDemonstration() {
        console.log('\n🎬 Running Multi-Bot Orchestration Demonstration...');
        
        try {
            // Simulate relic trigger
            console.log('\n📍 Demo Step 1: Simulating relic trigger...');
            process.emit('forgebot:relic:triggered', {
                relicType: 'Deadwood Echo',
                misfireCount: 7,
                timestamp: new Date().toISOString()
            });

            await this.delay(3000);

            // Simulate badge award
            console.log('\n📍 Demo Step 2: Simulating badge award...');
            process.emit('forgebot:badge:awarded', {
                badgeName: 'Watcher of the Void',
                recipient: 'DemoUser',
                metadata: { demo: true, relic: 'Deadwood Echo' }
            });

            await this.delay(3000);

            // Simulate shrine ping failure
            console.log('\n📍 Demo Step 3: Simulating shrine ping failure...');
            process.emit('forgebot:shrine:ping', {
                eventType: 'sponsor_pledge',
                success: false,
                misfireCount: 12,
                timestamp: new Date().toISOString()
            });

            await this.delay(3000);

            // Force seasonal change
            console.log('\n📍 Demo Step 4: Demonstrating seasonal voice adaptation...');
            const voicePacks = this.orchestrator.bots.get('seasonalvoices').instance;
            const currentSeason = voicePacks.currentSeason;
            const newSeason = currentSeason === 'winter' ? 'spring' : 'winter';
            voicePacks.setSeason(newSeason);

            await this.delay(3000);

            // Show final status
            console.log('\n📍 Demo Complete - Final System Status:');
            const manifest = this.orchestrator.generateManifest();
            console.log(JSON.stringify(manifest, null, 2));

        } catch (error) {
            console.error('❌ Demonstration failed:', error.message);
        }
    }

    /**
     * Get current system status
     */
    getSystemStatus() {
        if (!this.initialized) {
            return { status: 'not_initialized' };
        }

        const manifest = this.orchestrator.generateManifest();
        const uptime = Date.now() - this.startTime;

        return {
            status: 'operational',
            uptime: uptime,
            uptimeHuman: this.formatDuration(uptime),
            orchestration: manifest.kypriaorchestrator,
            initialized: this.initialized
        };
    }

    /**
     * Manually trigger a test ritual
     */
    async triggerTestRitual(type = 'test') {
        if (!this.initialized) {
            throw new Error('System not initialized');
        }

        console.log(`🧪 Triggering test ritual: ${type}`);

        switch (type) {
            case 'relic':
                process.emit('forgebot:relic:triggered', {
                    relicType: 'Test Relic',
                    misfireCount: 5,
                    timestamp: new Date().toISOString()
                });
                break;
            case 'badge':
                process.emit('forgebot:badge:awarded', {
                    badgeName: 'Test Badge',
                    recipient: 'TestUser',
                    metadata: { test: true }
                });
                break;
            case 'shrine':
                process.emit('forgebot:shrine:ping', {
                    eventType: 'test_ping',
                    success: Math.random() > 0.5,
                    timestamp: new Date().toISOString()
                });
                break;
            case 'convergence':
                await this.orchestrator.forceRealignment();
                break;
        }
    }

    /**
     * Graceful shutdown
     */
    async gracefulShutdown() {
        try {
            if (this.orchestrator) {
                // Complete any active rituals
                const activeRituals = Array.from(this.orchestrator.activeRituals);
                if (activeRituals.length > 0) {
                    console.log(`⏳ Waiting for ${activeRituals.length} active rituals to complete...`);
                    await this.delay(5000); // Give rituals time to complete
                }

                // Save final state
                const finalManifest = this.orchestrator.generateManifest();
                console.log('💾 Final system state:', JSON.stringify(finalManifest, null, 2));
            }

            console.log('🌟 Multi-Bot Orchestration System shutdown complete');
            process.exit(0);

        } catch (error) {
            console.error('❌ Error during graceful shutdown:', error.message);
            process.exit(1);
        }
    }

    /**
     * Emergency shutdown
     */
    emergencyShutdown() {
        console.error('🚨 EMERGENCY SHUTDOWN - Multi-Bot Orchestration System');
        process.exit(1);
    }

    /**
     * Utility: Delay execution
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Utility: Format duration
     */
    formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }
}

// If this file is run directly, start the orchestration system
if (require.main === module) {
    const orchestration = new MultiBotOrchestration();
    
    orchestration.initialize().catch(error => {
        console.error('💥 Failed to start Multi-Bot Orchestration System:', error.message);
        process.exit(1);
    });
}

module.exports = MultiBotOrchestration;