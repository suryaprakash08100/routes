import { NextResponse } from 'next/server';
import { translateText, SUPPORTED_LANGUAGES } from 'my-language-translator';

export async function POST(req) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text input is required and must be a string' }, { status: 400 });
    }

    if (text.length > 1000) {
      return NextResponse.json({ error: 'Text input is too long (max 1000 characters)' }, { status: 400 });
    }

    const translations = {};
    for (const lang in SUPPORTED_LANGUAGES) {
      translations[SUPPORTED_LANGUAGES[lang]] = await translateText(text, lang);
    }

    const response = NextResponse.json({ translations });
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  } catch (error) {
    console.error('Translation Error:', error.message, error.stack);
    return NextResponse.json(
      { error: 'Translation failed', details: error.message },
      { status: 500 }
    );
  }
}
