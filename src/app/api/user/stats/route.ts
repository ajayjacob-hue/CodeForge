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

    // 1. Get user data with populated submissions
    const user = await User.findById(userId).populate({
      path: 'submissions.questionId',
      select: 'title topicId'
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 2. Get total questions count
    const totalQuestions = await Question.countDocuments();

    // 3. Solved questions count
    const solvedQuestionsCount = user.solvedQuestions.length;

    // 4. Get recent activity from user.submissions
    const recentActivity = [...user.submissions]
      .sort((a: any, b: any) => b.submittedAt - a.submittedAt)
      .slice(0, 5)
      .map(s => ({
        title: (s.questionId as any)?.title || 'Unknown Problem',
        topic: 'C++', 
        status: s.verdict,
        time: s.submittedAt ? new Date(s.submittedAt).toLocaleDateString() : 'Recently'
      }));

    // 5. Get topic mastery (All Topics)
    const topics = await Topic.find().sort({ order: 1 });
    const topicMastery = [];
    const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-rose-500', 'bg-indigo-500'];

    const solvedSet = new Set(user.solvedQuestions.map(id => id.toString()));

    for (let i = 0; i < topics.length; i++) {
      const topic = topics[i];
      const topicQuestions = await Question.find({ topicId: topic._id }).distinct('_id');
      const solvedInTopic = topicQuestions.filter(id => solvedSet.has(id.toString())).length;

      topicMastery.push({
        name: topic.name,
        total: topicQuestions.length || 3,
        solved: solvedInTopic,
        color: colors[i % colors.length]
      });
    }

    return NextResponse.json({
      totalQuestions: totalQuestions || 108,
      solvedQuestions: solvedQuestionsCount,
      streak: user?.streak || 0,
      topicMastery: topicMastery.length > 0 ? topicMastery : [
        { name: '1D Array', total: 3, solved: 0, color: 'bg-emerald-500' }
      ],
      recentActivity: recentActivity.length > 0 ? recentActivity : [
        { title: 'No submissions yet', topic: '-', status: '-', time: '-' }
      ]
    });

  } catch (error: any) {
    console.error('Stats API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
