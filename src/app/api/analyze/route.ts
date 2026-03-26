import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import getDb from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Please log in first' }, { status: 401 });
    }

    const { image } = await request.json();
    if (!image) {
      return NextResponse.json({ error: 'Please upload an image' }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a nutrition expert AI. Analyze food images and provide detailed nutritional information. 
          
          ALWAYS respond with valid JSON in this exact format:
          {
            "food_name": "Name of the overall dish/meal",
            "serving_size": "Estimated serving size (e.g., '1 plate', '1 bowl', '250g')",
            "total": {
              "calories": number,
              "protein": number (in grams),
              "carbs": number (in grams),
              "fat": number (in grams),
              "fiber": number (in grams),
              "sugar": number (in grams)
            },
            "items": [
              {
                "name": "Individual food item name",
                "portion": "estimated portion",
                "calories": number,
                "protein": number,
                "carbs": number,
                "fat": number
              }
            ],
            "health_note": "A brief, encouraging health tip about this food (1-2 sentences)"
          }
          
          Be as accurate as possible with your estimates. If you see multiple food items, break them down individually.
          All numbers should be realistic estimates. Always return ONLY valid JSON, no other text.`
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this food image and provide the full nutritional breakdown in JSON format.',
            },
            {
              type: 'image_url',
              image_url: {
                url: image,
                detail: 'high',
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content || '';
    
    // Parse JSON from the response (handle markdown code blocks)
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }
    
    const analysis = JSON.parse(jsonStr);

    // Save to database
    const db = getDb();
    const result = db.prepare(`
      INSERT INTO scans (user_id, image_data, food_name, calories, protein, carbs, fat, fiber, sugar, serving_size, items_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      user.id,
      image.substring(0, 200), // Store thumbnail reference only
      analysis.food_name,
      analysis.total.calories,
      analysis.total.protein,
      analysis.total.carbs,
      analysis.total.fat,
      analysis.total.fiber,
      analysis.total.sugar,
      analysis.serving_size,
      JSON.stringify(analysis.items)
    );

    return NextResponse.json({
      id: result.lastInsertRowid,
      ...analysis,
    });
  } catch (error: any) {
    console.error('Analyze error:', error);
    
    if (error?.message?.includes('JSON')) {
      return NextResponse.json(
        { error: 'Could not analyze the food in this image. Please try a clearer photo.' },
        { status: 422 }
      );
    }
    
    return NextResponse.json(
      { error: 'Something went wrong analyzing your food. Please try again.' },
      { status: 500 }
    );
  }
}