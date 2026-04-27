import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Question from '@/models/Question';
import Topic from '@/models/Topic';
import User from '@/models/User';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    await connectDB();

    // 1. Parallelize basic data fetching
    const [user, totalQuestions] = await Promise.all([
      User.findById(userId).populate({
        path: 'submissions.questionId',
        select: 'title topicId'
      }),
      Question.countDocuments()
    ]);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 2. Solved questions count
    const solvedQuestionsCount = user.solvedQuestions.length;

    // 3. Get recent activity from user.submissions
    const recentActivity = [...user.submissions]
      .sort((a: any, b: any) => b.submittedAt - a.submittedAt)
      .slice(0, 5)
      .map(s => ({
        questionId: s.questionId?._id || s.questionId,
        title: (s.questionId as any)?.title || 'Unknown Problem',
        topic: 'C++', 
        status: s.verdict,
        code: s.code,
        language: s.language,
        time: s.submittedAt ? new Date(s.submittedAt).toLocaleDateString() : 'Recently'
      }));

    return NextResponse.json({
      totalQuestions: totalQuestions || 108,
      solvedQuestions: solvedQuestionsCount,
      streak: user?.streak || 0,
      recentActivity: recentActivity.length > 0 ? recentActivity : [
        { title: 'No submissions yet', topic: '-', status: '-', time: '-' }
      ]
    });

  } catch (error: any) {
    console.error('Stats API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
