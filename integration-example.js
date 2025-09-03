/**
 * integration-example.js - Example of how to integrate the multi-bot system with existing ForgeBot
 */

const ShrinePingHandler = require('./shrinePingHandler');
const MultiBotOrchestration = require('./MultiBotOrchestration');

class IntegratedForgeBot {
    constructor() {
        this.shrinePingHandler = new ShrinePingHandler();
        this.orchestration = null;
        this.initialized = false;
    }

    /**
     * Initialize the integrated system
     */
    async initialize() {
        console.log('🚀 Initializing Integrated ForgeBot with Multi-Bot Orchestration...');
        
        try {
            // Initialize the orchestration system first
            this.orchestration = new MultiBotOrchestration();
            await this.orchestration.initialize();
            
            // Connect shrine ping handler to orchestration
            this.connectShrineToOrchestration();
            
            this.initialized = true;
            console.log('🚀 ✅ Integrated ForgeBot system ready!');
            
        } catch (error) {
            console.error('❌ Integration initialization failed:', error.message);
            throw error;
        }
    }

    /**
     * Connect shrine ping handler to the orchestration system
     */
    connectShrineToOrchestration() {
        console.log('🔗 Connecting shrine ping handler to orchestration...');
        
        // Override the shrine ping handler's existing methods to emit events
        const originalProcessShrineEvent = this.shrinePingHandler.processShrineEvent.bind(this.shrinePingHandler);
        
        this.shrinePingHandler.processShrineEvent = async (event) => {
            try {
                // Process the event normally
                const result = await originalProcessShrineEvent(event);
                
                // Emit success event for orchestration
                process.emit('forgebot:shrine:ping', {
                    eventType: event.type || 'unknown',
                    success: true,
                    misfireCount: this.shrinePingHandler.misfireCount,
                    timestamp: new Date().toISOString()
                });
                
                return result;
                
            } catch (error) {
                // Emit failure event for orchestration
                process.emit('forgebot:shrine:ping', {
                    eventType: event?.type || 'unknown',
                    success: false,
                    misfireCount: this.shrinePingHandler.misfireCount,
                    timestamp: new Date().toISOString(),
                    error: error.message
                });
                
                throw error;
            }
        };
        
        // Override relic trigger methods to emit orchestration events
        const originalTriggerDeadwoodEcho = this.shrinePingHandler.triggerDeadwoodEcho.bind(this.shrinePingHandler);
        const originalTriggerHeadlessJesterHauler = this.shrinePingHandler.triggerHeadlessJesterHauler.bind(this.shrinePingHandler);
        
        this.shrinePingHandler.triggerDeadwoodEcho = async () => {
            // Emit relic trigger event for orchestration
            process.emit('forgebot:relic:triggered', {
                relicType: 'Deadwood Echo',
                misfireCount: this.shrinePingHandler.misfireCount,
                timestamp: new Date().toISOString()
            });
            
            return await originalTriggerDeadwoodEcho();
        };
        
        this.shrinePingHandler.triggerHeadlessJesterHauler = async () => {
            // Emit relic trigger event for orchestration
            process.emit('forgebot:relic:triggered', {
                relicType: 'Headless Jester Hauler',
                misfireCount: this.shrinePingHandler.misfireCount,
                timestamp: new Date().toISOString()
            });
            
            return await originalTriggerHeadlessJesterHauler();
        };
        
        // Override badge award method to emit orchestration events
        const originalAwardBadge = this.shrinePingHandler.awardBadge.bind(this.shrinePingHandler);
        
        this.shrinePingHandler.awardBadge = async (badgeName, metadata = {}) => {
            // Emit badge award event for orchestration
            process.emit('forgebot:badge:awarded', {
                badgeName,
                recipient: metadata.recipient || 'Unknown',
                metadata,
                timestamp: new Date().toISOString()
            });
            
            return await originalAwardBadge(badgeName, metadata);
        };
        
        console.log('🔗 ✅ Shrine ping handler connected to orchestration');
    }

    /**
     * Process a shrine event with full orchestration
     */
    async processEvent(event) {
        if (!this.initialized) {
            throw new Error('IntegratedForgeBot not initialized');
        }
        
        console.log(`🌟 Processing event with full orchestration: ${JSON.stringify(event)}`);
        
        try {
            const result = await this.shrinePingHandler.processShrineEvent(event);
            
            console.log('🌟 ✅ Event processed successfully with orchestration');
            return result;
            
        } catch (error) {
            console.error('🌟 ❌ Event processing failed:', error.message);
            throw error;
        }
    }

    /**
     * Get system status including orchestration
     */
    getSystemStatus() {
        if (!this.initialized) {
            return { status: 'not_initialized' };
        }
        
        const orchestrationStatus = this.orchestration.getSystemStatus();
        
        return {
            ...orchestrationStatus,
            shrinePingHandler: {
                misfireCount: this.shrinePingHandler.misfireCount,
                relicTriggers: this.shrinePingHandler.relicTriggers
            }
        };
    }

    /**
     * Demonstrate the integrated system
     */
    async runDemo() {
        console.log('\n🎬 Running Integrated ForgeBot Demo...');
        
        // Test normal event
        console.log('\n📍 Demo: Processing normal event...');
        await this.processEvent({ type: 'test_event', data: 'test' });
        
        await this.delay(2000);
        
        // Test event that triggers misfire (null event)
        console.log('\n📍 Demo: Processing null event (triggers misfire)...');
        try {
            await this.processEvent(null);
        } catch (error) {
            console.log(`   Expected error: ${error.message}`);
        }
        
        await this.delay(2000);
        
        // Trigger multiple misfires to test relic triggers
        console.log('\n📍 Demo: Triggering multiple misfires...');
        for (let i = 0; i < 12; i++) {
            try {
                await this.processEvent(null);
            } catch (error) {
                // Expected failures
            }
        }
        
        await this.delay(3000);
        
        // Show final status
        console.log('\n📍 Demo: Final system status...');
        const status = this.getSystemStatus();
        console.log(JSON.stringify(status, null, 2));
        
        console.log('\n🎬 ✅ Integrated ForgeBot Demo Complete!');
    }

    /**
     * Utility: Delay execution
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// If this file is run directly, start the demo
if (require.main === module) {
    const integratedBot = new IntegratedForgeBot();
    
    integratedBot.initialize()
        .then(() => integratedBot.runDemo())
        .catch(error => {
            console.error('💥 Demo failed:', error.message);
            process.exit(1);
        });
}

module.exports = IntegratedForgeBot;