import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Topic from '@/models/Topic';

const MOCK_TOPICS = [
  { _id: '1', name: '1D Array', order: 1, theory: { syntax: '', explanation: '', commonMistakes: '', importantNotes: '' } },
  { _id: '2', name: '2D Array', order: 2, theory: { syntax: '', explanation: '', commonMistakes: '', importantNotes: '' } },
  { _id: '3', name: 'Strings', order: 3, theory: { syntax: '', explanation: '', commonMistakes: '', importantNotes: '' } },
  { _id: '4', name: 'Functions', order: 4, theory: { syntax: '', explanation: '', commonMistakes: '', importantNotes: '' } },
  { _id: '5', name: 'Pointers', order: 5, theory: { syntax: '', explanation: '', commonMistakes: '', importantNotes: '' } },
];

export async function GET() {
  try {
    try {
      await connectDB();
      const topics = await Topic.find({}).sort({ order: 1 });
      if (topics.length > 0) {
        return NextResponse.json(topics);
      }
    } catch (dbError) {
      console.warn('Database connection failed, falling back to mock topics', dbError);
    }
    
    // Fallback to mock data if DB is down or empty
    return NextResponse.json(MOCK_TOPICS);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
