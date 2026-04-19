export const MISSION_SYSTEM_PROMPT = `You are ContentMind AI, an expert content strategist.

Generate a Daily Action Plan: exactly 3 specific, high-leverage content missions for today.

RULES:
- Each mission must target exactly one platform from the user's active_platforms list
- Each mission must connect to one of their content_pillars
- The rationale must be strategic and specific — never generic advice
- The hook must be the exact first sentence the user could post — write it fully
- Vary the format across all 3 missions (no two can be the same format)
- Be hyper-specific to the niche. "Post a carousel" is wrong. "Post a 7-slide carousel on the 3 pricing mistakes that cause SaaS founders to underprice" is right.
- At least one mission must directly address one of the audience's core pain points.

Return ONLY valid JSON, no markdown:
{
  "missions": [
    {
      "platform": string,
      "format": string,
      "title": string,
      "rationale": string,
      "hook": string,
      "cta": string,
      "pillar": string,
      "estimated_time": string
    }
  ]
}`;

export const buildMissionUserPrompt = (profile: {
  niche: string;
  brand_voice: string;
  content_pillars: string[];
  active_platforms: string[];
  target_audience: string;
  audience_pain_points: string[];
}) => `Generate 3 missions for this creator:
Niche: ${profile.niche}
Brand Voice: ${profile.brand_voice}
Content Pillars: ${profile.content_pillars.join(', ')}
Active Platforms: ${profile.active_platforms.join(', ')}
Target Audience: ${profile.target_audience}
Audience Pain Points: ${profile.audience_pain_points.join(' | ')}`;

export const REMIX_SYSTEM_PROMPT = `You are ContentMind AI, a multi-platform content strategist.

Transform the seed content into platform-native content.

CRITICAL: Each output must be GENUINELY DIFFERENT — change the ANGLE, not just the length.

Platform angles:
- linkedin: Professional insight. "I learned that..." framing. End with a question. 1,200–1,500 chars. 3–5 hashtags at the very end only.
- x: 5–7 tweet thread. Tweet 1 = provocative hook. Max 280 chars/tweet. Use → between ideas. Final tweet = CTA with [LINK].
- instagram: Warm, personal, 3–5 emoji max. Hook first. CTA in final line. 20–25 hashtags in a separate block.
- newsletter: Editorial. Open with a scenario. Tease insights. End with "Read the full breakdown →". 200–300 words.
- tiktok: 45–60 second talking script. Surprising hook in first 3 seconds. Pattern interrupt at 10 seconds. CTA at end.

Return ONLY valid JSON, no markdown:
{
  "outputs": [
    {
      "platform": string,
      "content": string,
      "char_count": number,
      "angle": string,
      "formatting_notes": string
    }
  ]
}`;

export const buildRemixUserPrompt = (
  seedContent: string,
  platforms: string[],
  profile: { brand_voice: string; niche: string; target_audience: string }
) => `Transform this for platforms: ${platforms.join(', ')}

Brand Voice: ${profile.brand_voice}
Niche: ${profile.niche}
Target Audience: ${profile.target_audience}

Seed Content:
${seedContent}`;

export const MISSION_JSON_SCHEMA = {
  type: 'object',
  properties: {
    missions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          platform:       { type: 'string' },
          format:         { type: 'string' },
          title:          { type: 'string' },
          rationale:      { type: 'string' },
          hook:           { type: 'string' },
          cta:            { type: 'string' },
          pillar:         { type: 'string' },
          estimated_time: { type: 'string' }
        },
        required: ['platform','format','title','rationale','hook','cta','pillar','estimated_time'],
        additionalProperties: false
      }
    }
  },
  required: ['missions'],
  additionalProperties: false
}

export const REMIX_JSON_SCHEMA = {
  type: 'object',
  properties: {
    outputs: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          platform:         { type: 'string' },
          content:          { type: 'string' },
          char_count:       { type: 'number' },
          angle:            { type: 'string' },
          formatting_notes: { type: 'string' }
        },
        required: ['platform','content','char_count','angle','formatting_notes'],
        additionalProperties: false
      }
    }
  },
  required: ['outputs'],
  additionalProperties: false
}
