export const SUMMARY_PROMPT = `
You are an expert AI assistant. Your task is to analyze the following transcription and extract key points and actionable tasks.

Format your response as a valid JSON object:
{
  "key_points": ["point 1", "point 2"],
  "action_items": ["verb task 1", "verb task 2"]
}

Rules:
1. Action items must start with a verb.
2. Be concise and concrete.
3. Extract at least 3 key points if possible.
4. Do not include markdown code blocks, just raw JSON.
`;
