import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Question from '@/models/Question';

const MOCK_QUESTIONS = [
  { _id: 'q1', topicId: '1', title: 'Sum of Array Elements', difficulty: 'Easy' },
  { _id: 'q2', topicId: '1', title: 'Find Maximum Element', difficulty: 'Medium' },
  { _id: 'q3', topicId: '3', title: 'Reverse a String', difficulty: 'Easy' },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const topicId = searchParams.get('topicId');

  try {
    try {
      await connectDB();
      const query = topicId ? { topicId } : {};
      const questions = await Question.find(query).select('-testcases -explanation -hints');
      if (questions.length > 0) {
        return NextResponse.json(questions);
      }
    } catch (dbError) {
      console.warn('Database connection failed, falling back to mock questions', dbError);
    }
    
    // Fallback
    const filteredMocks = topicId ? MOCK_QUESTIONS.filter(q => q.topicId === topicId) : MOCK_QUESTIONS;
    return NextResponse.json(filteredMocks);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
