import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Question from '@/models/Question';

const MOCK_QUESTION_DETAILS = {
  _id: 'q1',
  topicId: '1',
  title: 'Sum of Array Elements',
  difficulty: 'Easy',
  statement: 'Given an array of integers, find the sum of its elements.\n\nWrite a program that takes an integer N followed by N space-separated integers, and prints their sum.',
  constraints: '1 <= N <= 1000\n1 <= A[i] <= 1000',
  inputFormat: 'The first line contains an integer N, the size of the array.\nThe second line contains N space-separated integers.',
  outputFormat: 'Print a single integer, the sum of the array elements.',
  sampleInput: '5\n1 2 3 4 5',
  sampleOutput: '15',
  explanation: '1 + 2 + 3 + 4 + 5 = 15.',
  hints: ['Iterate through the array and maintain a sum variable.'],
  testcases: [
    { input: '5\n1 2 3 4 5', expectedOutput: '15' },
    { input: '3\n10 20 30', expectedOutput: '60' },
  ]
};

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  // Fix Next.js dynamic params bug in Next.js 15: wait for params
  const { id } = await params;

  try {
    try {
      await connectDB();
      const question = await Question.findById(id).populate('topicId');
      if (question) {
        return NextResponse.json(question);
      }
    } catch (dbError) {
      console.warn('Database connection failed, falling back to mock question details', dbError);
    }
    
    // Fallback
    if (id === 'q1' || id) {
      return NextResponse.json({ ...MOCK_QUESTION_DETAILS, _id: id });
    }
    return NextResponse.json({ error: 'Question not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
