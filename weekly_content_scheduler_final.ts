
// supabase/functions/weekly-content-scheduler/index.ts
// Production-optimized weekly content scheduler with dynamic posting time optimization

import { createClient } from "npm:@supabase/supabase-js@2.34.0";

// Environment validation at module level
const REQUIRED_ENV = {
  SUPABASE_URL: Deno.env.get("SUPABASE_URL"),
  SUPABASE_SERVICE_ROLE_KEY: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
  PATREON_ACCESS_TOKEN: Deno.env.get("PATREON_ACCESS_TOKEN"),
  OPENAI_API_KEY: Deno.env.get("OPENAI_API_KEY"),
  ZAPIER_WEBHOOK_URL: Deno.env.get("ZAPIER_WEBHOOK_URL"),
  BITLY_ACCESS_TOKEN: Deno.env.get("BITLY_ACCESS_TOKEN"),
  BUFFER_ACCESS_TOKEN: Deno.env.get("BUFFER_ACCESS_TOKEN"),
  HOOTSUITE_ACCESS_TOKEN: Deno.env.get("HOOTSUITE_ACCESS_TOKEN")
} as const;

const missingEnvVars = Object.entries(REQUIRED_ENV)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingEnvVars.length > 0) {
  console.error(`Missing environment variables: ${missingEnvVars.join(', ')}`);
}

// Singleton Supabase client with service role for full access
const supabase = createClient(
  REQUIRED_ENV.SUPABASE_URL!,
  REQUIRED_ENV.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

// Platform configuration
const PLATFORMS = ['facebook', 'instagram', 'youtube', 'twitter'] as const;
type Platform = typeof PLATFORMS[number];

// Default posting schedules (fallback if no historical data)
const DEFAULT_SCHEDULES: Record<Platform, { dayOfWeek: number; hour: number }[]> = {
  facebook: [
    { dayOfWeek: 1, hour: 15 }, // Monday 3 PM
    { dayOfWeek: 3, hour: 14 }, // Wednesday 2 PM
    { dayOfWeek: 5, hour: 13 }  // Friday 1 PM
  ],
  instagram: [
    { dayOfWeek: 2, hour: 11 }, // Tuesday 11 AM
    { dayOfWeek: 4, hour: 17 }, // Thursday 5 PM
    { dayOfWeek: 6, hour: 10 }  // Saturday 10 AM
  ],
  youtube: [
    { dayOfWeek: 1, hour: 14 }, // Monday 2 PM
    { dayOfWeek: 4, hour: 16 }, // Thursday 4 PM
    { dayOfWeek: 0, hour: 15 }  // Sunday 3 PM
  ],
  twitter: [
    { dayOfWeek: 1, hour: 9 },  // Monday 9 AM
    { dayOfWeek: 3, hour: 12 }, // Wednesday 12 PM
    { dayOfWeek: 5, hour: 17 }  // Friday 5 PM
  ]
};

// CTA variants for A/B testing
const CTA_VARIANTS = [
  'Join the Sacred Circle',
  'Enter the Shrine',
  'Unlock the Mysteries', 
  'Access Sacred Knowledge',
  'Begin the Convergence'
] as const;

// Content templates with mystical DevOps theming
const CONTENT_TEMPLATES: Record<Platform, (count: number, cta: string) => string> = {
  facebook: (count, cta) => `⚡ Sacred Weekly Convergence ⚡

The Kypria Shrine grows stronger with ${count} devoted patrons! This week's deployment ceremonies revealed new monitoring mysteries and webhook wisdom.

The inner circle gains access to:
🔮 Advanced deployment rituals
⚙️ Sacred monitoring ceremonies  
🛡️ Webhook validation mysteries
📊 Infrastructure blessing protocols

${cta}: {UTM_LINK}

#SacredShrine #KypriaLLC #DevOps #TechCeremony`,

  instagram: (count, cta) => `🔮 WEEKLY SHRINE UPDATE 🔮

${count} patrons strong! ✨

New sacred ceremonies unlocked:
• Advanced monitoring rituals
• Webhook validation mysteries
• Deployment blessing protocols
• Infrastructure convergence wisdom

${cta}: {UTM_LINK}

#SacredShrine #KypriaLLC #TechMysteries #DevOps`,

  youtube: (count, cta) => `🎯 Sacred Weekly Update: ${count} Patrons!

This week's technical convergence brings new mysteries to the inner circle. Exclusive deployment ceremonies, advanced monitoring tutorials, and webhook wisdom await those who seek deeper knowledge.

What the inner circle receives:
🚀 Exclusive deployment ceremonies
📈 Advanced monitoring deep-dives  
⚡ Real-time troubleshooting rituals
🔧 Sacred DevOps configurations

${cta}: {UTM_LINK}

💭 What DevOps ceremony should we explore next?

#DevOps #SacredShrine #TechCeremony #Patreon`,

  twitter: (count, cta) => `⚡ WEEKLY CONVERGENCE ⚡

${count} souls have joined the Kypria technical mysteries! 🚀

This week: New deployment rituals, monitoring ceremonies, and webhook wisdom revealed to the inner circle.

Sacred knowledge awaits: deployment automation, infrastructure mysteries, and DevOps enlightenment.

${cta}: {UTM_LINK}

#SacredShrine #DevOps #KypriaLLC #TechCeremony`
};

/**
 * Calculate the best posting times for a given platform based on historical engagement data.
 */
async function calculateBestPostingTimes(
  platform: Platform,
  historicalData: { dayOfWeek: number; hour: number; engagement: number }[]
): Promise<{ dayOfWeek: number; hour: number; score: number }[]> {
  if (!historicalData || historicalData.length === 0) {
    return DEFAULT_SCHEDULES[platform].map(slot => ({ ...slot, score: 0 }));
  }

  // Aggregate engagement by day and hour
  const engagementMap: Record<string, number[]> = {};

  for (const entry of historicalData) {
    const key = `${entry.dayOfWeek}-${entry.hour}`;
    if (!engagementMap[key]) engagementMap[key] = [];
    engagementMap[key].push(entry.engagement);
  }

  // Calculate average engagement score for each (day, hour) slot
  const scoredSlots = Object.entries(engagementMap).map(([key, engagements]) => {
    const [dayOfWeek, hour] = key.split('-').map(Number);
    const score = engagements.reduce((a, b) => a + b, 0) / engagements.length;
    return { dayOfWeek, hour, score };
  });

  // Sort by score descending and return top 3
  return scoredSlots.sort((a, b) => b.score - a.score).slice(0, 3);
}

// Enhanced retry utility with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelayMs = 500
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries - 1) {
        const delay = baseDelayMs * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}

// Fetch current patron count with caching
let patronCountCache: { count: number; timestamp: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

async function fetchPatronCount(): Promise<number> {
  if (patronCountCache && Date.now() - patronCountCache.timestamp < CACHE_TTL_MS) {
    return patronCountCache.count;
  }

  const count = await retryWithBackoff(async () => {
    const response = await fetch('https://www.patreon.com/api/oauth2/v2/campaigns', {
      headers: {
        'Authorization': `Bearer ${REQUIRED_ENV.PATREON_ACCESS_TOKEN}`,
        'User-Agent': 'KypriaLLC-ContentScheduler/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Patreon API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const patronCount = data?.data?.[0]?.attributes?.patron_count;

    if (typeof patronCount !== 'number') {
      throw new Error('Invalid patron count format from Patreon API');
    }

    return patronCount;
  });

  patronCountCache = { count, timestamp: Date.now() };
  return count;
}

// Fetch historical engagement data for optimal timing
async function fetchHistoricalEngagementData(platform: Platform) {
  try {
    const { data, error } = await supabase
      .from('social_campaigns')
      .select('scheduled_date, engagement_metrics')
      .eq('platform', platform)
      .not('engagement_metrics', 'is', null)
      .gte('scheduled_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // Last 30 days

    if (error) {
      console.error(`Error fetching historical data for ${platform}:`, error);
      return [];
    }

    return (data || []).map(row => {
      const date = new Date(row.scheduled_date);
      const engagement = row.engagement_metrics?.total_engagement || 0;
      return {
        dayOfWeek: date.getDay(),
        hour: date.getHours(),
        engagement
      };
    });
  } catch (error) {
    console.error(`Failed to fetch historical data for ${platform}:`, error);
    return [];
  }
}

// Generate UTM parameters with A/B testing
function generateUTMParams(platform: Platform, date: Date, variant: string) {
  const dateStr = date.toISOString().split('T')[0];
  return {
    utm_source: platform,
    utm_medium: platform === 'instagram' ? 'story' : 'social',
    utm_campaign: `weekly_${platform}_${dateStr}`,
    utm_content: `auto_${variant.toLowerCase().replace(/\s+/g, '_')}`,
    utm_term: 'weekly_content'
  };
}

// Create UTM link and shorten with Bitly
async function createTrackedLink(utmParams: any): Promise<string> {
  const params = new URLSearchParams(utmParams);
  const longUrl = `https://patreon.com/kypria?${params.toString()}`;

  if (!REQUIRED_ENV.BITLY_ACCESS_TOKEN) {
    return longUrl;
  }

  try {
    return await retryWithBackoff(async () => {
      const response = await fetch('https://api-ssl.bitly.com/v4/shorten', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${REQUIRED_ENV.BITLY_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          long_url: longUrl,
          domain: 'bit.ly'
        })
      });

      if (!response.ok) {
        throw new Error(`Bitly API error: ${response.status}`);
      }

      const data = await response.json();
      return data.link || longUrl;
    });
  } catch (error) {
    console.error('Bitly shortening failed:', error);
    return longUrl;
  }
}

// Concurrent execution utility
async function executeConcurrently<T, R>(
  items: T[],
  fn: (item: T, index: number) => Promise<R>,
  concurrency = 6
): Promise<(R | Error)[]> {
  const results: (R | Error)[] = new Array(items.length);
  const executing: Promise<void>[] = [];
  let index = 0;

  while (index < items.length || executing.length > 0) {
    while (executing.length < concurrency && index < items.length) {
      const currentIndex = index++;
      const task = fn(items[currentIndex], currentIndex)
        .then(result => {
          results[currentIndex] = result;
        })
        .catch(error => {
          results[currentIndex] = error instanceof Error ? error : new Error(String(error));
        })
        .finally(() => {
          const taskIndex = executing.indexOf(task);
          if (taskIndex > -1) executing.splice(taskIndex, 1);
        });

      executing.push(task);
    }

    if (executing.length > 0) {
      await Promise.race(executing);
    }
  }

  return results;
}

// Platform-specific content optimization
function optimizeContentForPlatform(content: string, platform: Platform): string {
  switch (platform) {
    case 'twitter':
      return content.length > 280 ? content.substring(0, 250) + '... 🔗' : content;
    case 'instagram':
      return content + '\n\n👆 Link in Story for exclusive access!';
    case 'youtube':
      return content;
    case 'facebook':
      return content + '\n\n💭 Share your thoughts below!';
    default:
      return content;
  }
}

// Schedule posts via external APIs (Buffer/Hootsuite)
async function schedulePost(
  platform: Platform,
  content: string,
  scheduledDate: Date
): Promise<{ success: boolean; id?: string; error?: string }> {
  // Placeholder for actual API integration
  // In production, implement Buffer and Hootsuite API calls here
  console.log(`Scheduling ${platform} post for ${scheduledDate.toISOString()}`);

  // Simulate API success for now
  return {
    success: true,
    id: `mock_${platform}_${Date.now()}`
  };
}

// Main Edge Function
console.info('Weekly Content Scheduler initialized with optimal posting times');

Deno.serve(async (req: Request) => {
  const startTime = performance.now();

  try {
    // Validate environment variables
    if (missingEnvVars.length > 0) {
      return new Response(JSON.stringify({
        success: false,
        error: `Missing required environment variables: ${missingEnvVars.join(', ')}`
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Method validation
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.info('Starting optimized weekly content generation...');

    // Fetch current patron count
    const patronCount = await fetchPatronCount();
    console.info(`Current patron count: ${patronCount}`);

    // Generate all posts with optimal timing
    const allPosts = [];
    const now = new Date();

    for (const platform of PLATFORMS) {
      // Fetch historical data and calculate optimal times
      const historicalData = await fetchHistoricalEngagementData(platform);
      const optimalTimes = await calculateBestPostingTimes(platform, historicalData);

      console.info(`Optimal times for ${platform}:`, optimalTimes);

      // Create posts for the next 7 days using optimal times
      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const optimalSlot = optimalTimes[dayOffset % optimalTimes.length] || DEFAULT_SCHEDULES[platform][0];

        const scheduledDate = new Date(now);
        scheduledDate.setDate(now.getDate() + dayOffset);
        scheduledDate.setHours(optimalSlot.hour, 0, 0, 0);

        // Ensure we don't schedule in the past
        if (scheduledDate <= now) {
          scheduledDate.setDate(scheduledDate.getDate() + 1);
        }

        // Random CTA variant for A/B testing
        const ctaVariant = CTA_VARIANTS[Math.floor(Math.random() * CTA_VARIANTS.length)];

        allPosts.push({
          platform,
          scheduledDate,
          ctaVariant,
          optimalScore: optimalSlot.score || 0,
          dayOffset
        });
      }
    }

    console.info(`Generated ${allPosts.length} optimally-timed posts`);

    // Process all posts concurrently
    const results = await executeConcurrently(allPosts, async (post) => {
      const utmParams = generateUTMParams(post.platform, post.scheduledDate, post.ctaVariant);
      const shortLink = await createTrackedLink(utmParams);

      const content = CONTENT_TEMPLATES[post.platform](patronCount, post.ctaVariant)
        .replace('{UTM_LINK}', shortLink);

      const optimizedContent = optimizeContentForPlatform(content, post.platform);

      // Schedule the post
      const scheduleResult = await schedulePost(post.platform, optimizedContent, post.scheduledDate);

      return {
        ...post,
        content: optimizedContent,
        shortLink,
        utmParams,
        scheduleResult
      };
    }, 8); // Higher concurrency for better performance

    // Process results and batch insert successful posts
    const successfulPosts = results
      .filter((result): result is any => !(result instanceof Error) && result.scheduleResult.success)
      .map(result => ({
        campaign_name: `weekly_${result.platform}_${result.scheduledDate.toISOString().split('T')[0]}`,
        platform: result.platform,
        post_content: result.content,
        utm_params: result.utmParams,
        scheduled_date: result.scheduledDate.toISOString(),
        short_link: result.shortLink,
        status: 'scheduled',
        optimal_score: result.optimalScore
      }));

    // Batch insert all successful posts
    if (successfulPosts.length > 0) {
      const { error: insertError } = await supabase
        .from('social_campaigns')
        .insert(successfulPosts);

      if (insertError) {
        console.error('Database insert error:', insertError);
      }
    }

    // Update CTA variant usage statistics
    const variantUsage = successfulPosts.reduce((acc, post) => {
      const variant = post.utm_params.utm_content.replace('auto_', '').replace(/_/g, ' ');
      acc[variant] = (acc[variant] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    for (const [variant, count] of Object.entries(variantUsage)) {
      await supabase
        .from('cta_variants')
        .update({ usage_count: supabase.raw('usage_count + ?', [count]) })
        .eq('variant_text', variant);
    }

    // Log execution results
    const executionTime = performance.now() - startTime;
    const failedPosts = results.filter(result => result instanceof Error || !result.scheduleResult?.success);

    await supabase.from('automation_logs').insert({
      function_name: 'weekly-content-scheduler',
      execution_date: now.toISOString(),
      posts_scheduled: successfulPosts.length,
      posts_failed: failedPosts.length,
      details: {
        execution_time_ms: Math.round(executionTime),
        patron_count: patronCount,
        total_posts_attempted: allPosts.length,
        platform_breakdown: successfulPosts.reduce((acc, post) => {
          acc[post.platform] = (acc[post.platform] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        average_optimal_score: successfulPosts.reduce((sum, post) => sum + post.optimal_score, 0) / successfulPosts.length || 0,
        errors: failedPosts.map(result => 
          result instanceof Error ? result.message : result.scheduleResult?.error
        ).filter(Boolean)
      }
    });

    console.info(`Content scheduling completed in ${Math.round(executionTime)}ms`);

    return new Response(JSON.stringify({
      success: true,
      execution_time_ms: Math.round(executionTime),
      patron_count: patronCount,
      posts_scheduled: successfulPosts.length,
      posts_failed: failedPosts.length,
      total_posts: allPosts.length,
      platform_breakdown: successfulPosts.reduce((acc, post) => {
        acc[post.platform] = (acc[post.platform] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    const executionTime = performance.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);

    console.error('Weekly content scheduler error:', errorMessage);

    // Log error to database
    try {
      await supabase.from('automation_logs').insert({
        function_name: 'weekly-content-scheduler',
        execution_date: new Date().toISOString(),
        posts_scheduled: 0,
        posts_failed: 0,
        details: {
          error: errorMessage,
          execution_time_ms: Math.round(executionTime)
        }
      });
    } catch (logError) {
      console.error('Failed to log error to database:', logError);
    }

    return new Response(JSON.stringify({
      success: false,
      error: errorMessage,
      execution_time_ms: Math.round(executionTime)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
