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

    const [user, topics, allQuestions] = await Promise.all([
      User.findById(userId, 'solvedQuestions'),
      Topic.find().sort({ order: 1 }),
      Question.find({}, 'topicId').lean()
    ]);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const solvedSet = new Set(user.solvedQuestions.map(id => id.toString()));
    const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-rose-500', 'bg-indigo-500'];
    
    const questionsByTopic: Record<string, string[]> = {};
    allQuestions.forEach(q => {
      const tId = q.topicId.toString();
      if (!questionsByTopic[tId]) questionsByTopic[tId] = [];
      questionsByTopic[tId].push(q._id.toString());
    });

    const topicMastery = topics.map((topic, i) => {
      const topicQuestionIds = questionsByTopic[topic._id.toString()] || [];
      const solvedInTopic = topicQuestionIds.filter(id => solvedSet.has(id)).length;

      return {
        name: topic.name,
        total: topicQuestionIds.length,
        solved: solvedInTopic,
        color: colors[i % colors.length]
      };
    }).filter(t => t.total > 0);

    return NextResponse.json(topicMastery);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
