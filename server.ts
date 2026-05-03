import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Proxy Route (Replicating api/generate.js logic)
  app.post("/api/generate", async (req, res) => {
    const { system, messages, max_tokens = 1500, provider = 'claude', model } = req.body;
    
    if (!messages) return res.status(400).json({ error: 'Missing messages' });

    try {
      let text = '';
      if (provider === 'deepseek' && process.env.DEEPSEEK_API_KEY) {
        const response = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
          },
          body: JSON.stringify({
            model: model || 'deepseek-chat',
            max_tokens,
            messages: [
              ...(system ? [{ role: 'system', content: system }] : []),
              ...messages
            ]
          })
        });
        const data: any = await response.json();
        if (data.error) throw new Error(data.error.message);
        text = data.choices[0].message.content;
      } else {
        // Claude (default)
        const claudeModel = model || (provider === 'haiku' 
          ? 'claude-3-haiku-20240307' 
          : 'claude-3-5-sonnet-20240620');
          
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.CLAUDE_API_KEY || '',
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: claudeModel,
            max_tokens,
            system: system || '',
            messages
          })
        });
        const data: any = await response.json();
        if (data.error) throw new Error(data.error.message);
        text = data.content[0].text;
      }
      return res.status(200).json({ text, provider });
    } catch (error: any) {
      console.error('AI generation error:', error);
      return res.status(500).json({ error: error.message || 'Generation failed' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
