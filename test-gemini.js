const { geminiService } = require('./dist/server/services/geminiService');

async function testGeminiAPI() {
  console.log('Тестирование API Gemini с моделью gemini-2.5-flash-preview-09-2025...');
  
  try {
    const testRequest = {
      contents: [
        {
          role: 'user',
          parts: [{ text: 'Привет! Расскажи кратко о самозанятости в РФ в 2025 году.' }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800
      }
    };

    console.log('Отправка запроса...');
    const response = await geminiService.generateContent(testRequest);
    
    console.log('Ответ получен успешно:');
    console.log('=====================================');
    console.log(response);
    console.log('=====================================');
    console.log('Тест пройден успешно!');
    
  } catch (error) {
    console.error('Ошибка при тестировании API Gemini:');
    console.error('=====================================');
    console.error(error.message);
    console.error('=====================================');
    console.log('Тест не пройден!');
  }
}

// Проверка конфигурации
console.log('Проверка конфигурации:');
console.log('API ключ настроен:', geminiService.isConfigured());
console.log('Модель:', process.env.GEMINI_MODEL || 'gemini-2.5-flash-preview-09-2025');
console.log('URL API:', process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta');
console.log('');

testGeminiAPI();