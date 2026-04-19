import OpenAI from 'openai'

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function attempt(systemPrompt: string, userPrompt: string, jsonSchema?: Record<string, unknown>) {
  const response_format = jsonSchema
    ? { type: 'json_schema' as const, json_schema: { name: 'response', schema: jsonSchema, strict: true } }
    : { type: 'json_object' as const }

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.7,
    response_format,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  })

  return JSON.parse(completion.choices[0].message.content ?? '')
}

export async function callOpenAI(systemPrompt: string, userPrompt: string, jsonSchema?: Record<string, unknown>) {
  try {
    return await attempt(systemPrompt, userPrompt, jsonSchema)
  } catch {
    try {
      return await attempt(systemPrompt, userPrompt, jsonSchema)
    } catch {
      throw new Error('AI response could not be parsed. Please try again.')
    }
  }
}
