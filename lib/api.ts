import { AnalysisRequest, AnalysisResponse } from './types';
import { MOCK_DATA } from './mock-data';

// 🔧 Установите в false когда бэк будет готов
const USE_MOCK = false;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function analyzeNews(params: AnalysisRequest): Promise<AnalysisResponse> {
  // 🔧 MOCK MODE - просто измените USE_MOCK на false чтобы использовать реальный API
  if (USE_MOCK) {
    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_DATA;
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

