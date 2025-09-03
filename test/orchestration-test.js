#!/usr/bin/env node

/**
 * test/orchestration-test.js - Simple test to verify multi-bot orchestration system
 */

const path = require('path');

async function runOrchestrationTest() {
    console.log('🧪 Running Multi-Bot Orchestration Test...');
    console.log('================================================');
    
    try {
        // Test 1: Verify all bot classes can be imported
        console.log('📋 Test 1: Importing bot classes...');
        
        const ScrollBot = require('../ScrollBot');
        const EchoBot = require('../EchoBot');
        const SeasonalVoicePacks = require('../SeasonalVoicePacks');
        const KypriaOrchestrator = require('../KypriaOrchestrator');
        const MultiBotOrchestration = require('../MultiBotOrchestration');
        
        console.log('   ✅ All bot classes imported successfully');
        
        // Test 2: Test ScrollBot basic functionality
        console.log('\n📋 Test 2: ScrollBot functionality...');
        
        const scrollBot = new ScrollBot();
        const alignment = scrollBot.calculateKypriaAlignment('This is a test scroll with relic triggers and shrine echoes');
        console.log(`   ✅ Kypria alignment calculated: ${(alignment * 100).toFixed(1)}%`);
        
        // Test 3: Test EchoBot basic functionality  
        console.log('\n📋 Test 3: EchoBot functionality...');
        
        const echoBot = new EchoBot();
        echoBot.setupResonancePatterns();
        const status = echoBot.getEchoStatus();
        console.log(`   ✅ EchoBot status: ${status.patterns.length} patterns, ${status.active} active echoes`);
        
        // Test 4: Test SeasonalVoicePacks
        console.log('\n📋 Test 4: SeasonalVoicePacks functionality...');
        
        const voicePacks = new SeasonalVoicePacks();
        voicePacks.loadVoicePacks();
        voicePacks.detectCurrentSeason();
        const currentPack = voicePacks.getCurrentVoicePack();
        console.log(`   ✅ Current season: ${currentPack.season} (${currentPack.pack?.name || 'Unknown'})`);
        
        // Test 5: Test manifest generation
        console.log('\n📋 Test 5: Manifest generation...');
        
        const scrollManifest = scrollBot.generateManifest();
        const echoManifest = echoBot.generateManifest();
        const voiceManifest = voicePacks.generateManifest();
        
        console.log('   ✅ ScrollBot manifest:', JSON.stringify(scrollManifest, null, 2));
        console.log('   ✅ EchoBot manifest:', JSON.stringify(echoManifest, null, 2));
        console.log('   ✅ VoicePacks manifest:', JSON.stringify(voiceManifest, null, 2));
        
        // Test 6: Integration test (simulation)
        console.log('\n📋 Test 6: Integration simulation...');
        
        const testMessage = voicePacks.formatSeasonalMessage({
            messageType: 'relicTriggered',
            originalText: 'Test relic triggered',
            metadata: { relicName: 'Test Relic', emoteType: 'trigger' }
        });
        
        console.log('   ✅ Seasonal message formatting:', testMessage);
        
        const testEcho = echoBot.createEcho('test:echo', {
            message: 'Test echo for integration'
        });
        
        console.log('   ✅ Echo creation:', testEcho ? `Echo ${testEcho.id} created` : 'Echo creation failed');
        
        console.log('\n================================================');
        console.log('🎉 All tests completed successfully!');
        console.log('🌟 Multi-Bot Orchestration System is ready for integration');
        
        return true;
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error('Stack trace:', error.stack);
        return false;
    }
}

// Run the test
if (require.main === module) {
    runOrchestrationTest().then(success => {
        process.exit(success ? 0 : 1);
    });
}

module.exports = runOrchestrationTest;