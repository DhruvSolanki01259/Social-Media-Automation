import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "My App",
  },
});

export const automationController = async (req, res) => {
  const { prompt, field } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt missing" });

  // Updated instruction based on field
  const instruction =
    field === "title"
      ? `Generate 3 short, catchy post titles for social media based on: ${prompt}.
       Use a friendly, engaging style suitable for Instagram, LinkedIn, or Facebook.
       Return them as a comma-separated list. Do not use quotes at start or end.`
      : `Generate a single detailed post caption/description for social media based on: ${prompt}.
       Make it at least 30-50 words long.
       Use a friendly, engaging style suitable for Instagram, LinkedIn, or Facebook.
       Do NOT include any hashtags, @mentions, or tags.
       Return plain text without quotes at the start or end.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o",
      messages: [{ role: "user", content: instruction }],
      temperature: 0.7,
      max_tokens: 400, // increased to allow longer descriptions
    });

    let text = completion.choices?.[0]?.message?.content || "";

    // Split suggestions by newline or comma and clean extra quotes
    const suggestions = text
      .split(/\n|,/) // handle both newlines and commas
      .map((s) => s.trim().replace(/^"+|"+$/g, ""))
      .filter(Boolean);

    res.json({ suggestions });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
