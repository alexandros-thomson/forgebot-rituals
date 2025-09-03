/**
 * ScrollBot.js - Scroll and document management integration for ForgeBot rituals
 * Part of the multi-bot orchestration system for Kypria Codex alignment
 */

const fs = require('fs').promises;
const path = require('path');

class ScrollBot {
    constructor() {
        this.scrolls = new Map();
        this.alignmentThreshold = 0.75; // Kypria Codex alignment threshold
    }

    /**
     * Initialize ScrollBot with existing scrolls
     */
    async initialize() {
        console.log('📜 ScrollBot initializing...');
        
        try {
            await this.loadExistingScrolls();
            console.log(`   Loaded ${this.scrolls.size} canonical scrolls`);
            
            // Register integration with ForgeBot system
            this.registerWithForgeBot();
            
        } catch (error) {
            console.error('❌ ScrollBot initialization failed:', error.message);
            throw error;
        }
    }

    /**
     * Load existing scrolls from the metadata/relics directory
     */
    async loadExistingScrolls() {
        const relicsDir = path.join(__dirname, 'metadata', 'relics');
        
        try {
            const files = await fs.readdir(relicsDir);
            
            for (const file of files) {
                if (file.endsWith('.md') || file.endsWith('.json')) {
                    const scrollPath = path.join(relicsDir, file);
                    const content = await fs.readFile(scrollPath, 'utf8');
                    
                    this.scrolls.set(file, {
                        path: scrollPath,
                        content,
                        lastModified: new Date(),
                        alignment: this.calculateKypriaAlignment(content)
                    });
                }
            }
        } catch (error) {
            console.error('Failed to load existing scrolls:', error.message);
        }
    }

    /**
     * Calculate Kypria Codex alignment score for content
     */
    calculateKypriaAlignment(content) {
        let alignmentScore = 0.5; // Base alignment
        
        // Check for canonical elements
        if (content.includes('Relic #')) alignmentScore += 0.1;
        if (content.includes('trigger') || content.includes('Trigger')) alignmentScore += 0.1;
        if (content.includes('badge') || content.includes('Badge')) alignmentScore += 0.1;
        if (content.includes('canon') || content.includes('Canon')) alignmentScore += 0.1;
        if (content.includes('ritual') || content.includes('Ritual')) alignmentScore += 0.1;
        
        // Mystical terminology bonus
        if (content.includes('shrine') || content.includes('Shrine')) alignmentScore += 0.05;
        if (content.includes('echo') || content.includes('Echo')) alignmentScore += 0.05;
        if (content.includes('fragment') || content.includes('Fragment')) alignmentScore += 0.05;
        
        return Math.min(alignmentScore, 1.0);
    }

    /**
     * Create a new scroll with Kypria Codex alignment
     */
    async createScroll(title, content, metadata = {}) {
        console.log(`📜 Creating new scroll: ${title}`);
        
        const alignment = this.calculateKypriaAlignment(content);
        
        if (alignment < this.alignmentThreshold) {
            console.warn(`⚠️  Low Kypria alignment detected (${alignment.toFixed(2)}). Enhancing...`);
            content = this.enhanceAlignment(content, metadata);
        }
        
        const scrollData = {
            title,
            content,
            metadata,
            created: new Date().toISOString(),
            alignment: this.calculateKypriaAlignment(content),
            canonized: alignment >= this.alignmentThreshold
        };
        
        // Save scroll to relics directory
        const fileName = `scroll-${title.toLowerCase().replace(/\s+/g, '-')}.md`;
        const scrollPath = path.join(__dirname, 'metadata', 'relics', fileName);
        
        await fs.writeFile(scrollPath, this.formatScrollContent(scrollData));
        
        this.scrolls.set(fileName, {
            path: scrollPath,
            content: scrollData.content,
            lastModified: new Date(),
            alignment: scrollData.alignment
        });
        
        console.log(`   ✅ Scroll created with ${(scrollData.alignment * 100).toFixed(1)}% Kypria alignment`);
        
        return scrollData;
    }

    /**
     * Enhance content for better Kypria Codex alignment
     */
    enhanceAlignment(content, metadata) {
        let enhanced = content;
        
        // Add canonical framing if missing
        if (!content.includes('#')) {
            enhanced = `# ${metadata.title || 'Untitled Scroll'}\n\n${enhanced}`;
        }
        
        // Add ritual context if missing
        if (!content.includes('ritual') && !content.includes('Ritual')) {
            enhanced += '\n\n---\n*This scroll is bound to the canonical ritual system.*';
        }
        
        return enhanced;
    }

    /**
     * Format scroll content for storage
     */
    formatScrollContent(scrollData) {
        return `# ${scrollData.title}

${scrollData.content}

---

**Metadata:**
- Created: ${scrollData.created}
- Kypria Alignment: ${(scrollData.alignment * 100).toFixed(1)}%
- Canonized: ${scrollData.canonized ? 'Yes' : 'Pending'}

*Inscribed by ScrollBot - Multi-bot Orchestration System*
`;
    }

    /**
     * Register integration with ForgeBot shrine system
     */
    registerWithForgeBot() {
        console.log('🔗 Registering ScrollBot integration with ForgeBot...');
        
        // This would integrate with the existing shrine ping handler
        // For now, we'll register event listeners for scroll creation
        process.on('forgebot:scroll:create', this.handleScrollCreationRequest.bind(this));
        process.on('forgebot:scroll:align', this.handleAlignmentRequest.bind(this));
        
        console.log('   ✅ ScrollBot integration registered');
    }

    /**
     * Handle scroll creation requests from ForgeBot
     */
    async handleScrollCreationRequest(data) {
        try {
            await this.createScroll(data.title, data.content, data.metadata);
        } catch (error) {
            console.error('ScrollBot failed to handle creation request:', error.message);
        }
    }

    /**
     * Handle alignment check requests
     */
    async handleAlignmentRequest(data) {
        const alignment = this.calculateKypriaAlignment(data.content);
        console.log(`📐 Kypria alignment calculated: ${(alignment * 100).toFixed(1)}%`);
        
        return {
            alignment,
            aligned: alignment >= this.alignmentThreshold,
            suggestions: alignment < this.alignmentThreshold ? [
                'Add canonical relic references',
                'Include ritual trigger patterns',
                'Enhance mystical terminology'
            ] : []
        };
    }

    /**
     * Get all scrolls with high Kypria alignment
     */
    getAlignedScrolls() {
        const aligned = [];
        
        for (const [name, scroll] of this.scrolls) {
            if (scroll.alignment >= this.alignmentThreshold) {
                aligned.push({
                    name,
                    alignment: scroll.alignment,
                    path: scroll.path
                });
            }
        }
        
        return aligned.sort((a, b) => b.alignment - a.alignment);
    }

    /**
     * Generate scroll manifest for orchestration
     */
    generateManifest() {
        const manifest = {
            scrollbot: {
                version: '1.0.0',
                scrolls: this.scrolls.size,
                aligned: this.getAlignedScrolls().length,
                averageAlignment: this.calculateAverageAlignment(),
                lastUpdate: new Date().toISOString()
            }
        };
        
        return manifest;
    }

    /**
     * Calculate average Kypria alignment across all scrolls
     */
    calculateAverageAlignment() {
        if (this.scrolls.size === 0) return 0;
        
        let totalAlignment = 0;
        for (const scroll of this.scrolls.values()) {
            totalAlignment += scroll.alignment;
        }
        
        return totalAlignment / this.scrolls.size;
    }
}

module.exports = ScrollBot;