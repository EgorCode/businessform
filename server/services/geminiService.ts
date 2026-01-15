import dotenv from 'dotenv';
dotenv.config();

interface GeminiMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

interface GeminiRequest {
  contents: GeminiMessage[];
  systemInstruction?: { parts: { text: string }[] };
  generationConfig: {
    temperature: number;
    maxOutputTokens: number;
  };
}

interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
  }[];
}

class GeminiService {
  private apiKey: string;
  private apiUrl: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    this.apiUrl = process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta';
    this.model = process.env.GEMINI_MODEL || 'gemini-2.5-flash-preview-09-2025';
    
    // Логирование для отладки
    console.log('GeminiService initialized with:', {
      apiKey: this.apiKey ? 'configured' : 'not configured',
      apiUrl: this.apiUrl,
      model: this.model
    });
  }

  async generateContent(request: GeminiRequest): Promise<string> {
    const url = `${this.apiUrl}/models/${this.model}:generateContent?key=${this.apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data: GeminiResponse = await response.json();
    
    // Добавляем логирование для отладки
    console.log('Gemini API Response:', JSON.stringify(data, null, 2));
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No candidates returned from Gemini API');
    }

    const candidate = data.candidates[0];
    if (!candidate || !candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      throw new Error('Invalid candidate structure in Gemini API response');
    }

    const text = candidate.content.parts[0]?.text;
    if (!text) {
      throw new Error('No text content returned from Gemini API');
    }

    return text;
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  getApiKey(): string {
    return this.apiKey;
  }
}

export const geminiService = new GeminiService();