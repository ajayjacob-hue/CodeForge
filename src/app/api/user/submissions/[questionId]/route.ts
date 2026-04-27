import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ questionId: string }> }
) {
  try {
    const { questionId } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Filter submissions for this question and sort by date descending
    const submissions = user.submissions
      .filter((s: any) => s.questionId.toString() === questionId)
      .sort((a: any, b: any) => b.submittedAt - a.submittedAt);

    return NextResponse.json(submissions);

  } catch (error: any) {
    console.error('Submissions API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
