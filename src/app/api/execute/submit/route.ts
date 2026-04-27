import { NextResponse } from 'next/server';
import { executeCode } from '@/lib/piston';
import connectDB from '@/lib/db';
import Question from '@/models/Question';
import User from '@/models/User';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    const { code, language, questionId } = await req.json();

    if (!code || !language || !questionId) {
      return NextResponse.json({ error: 'Code, language, and questionId are required' }, { status: 400 });
    }

    let testcases = [];
    
    try {
      await connectDB();
      const question = await Question.findById(questionId);
      if (!question) {
        return NextResponse.json({ error: 'Question not found' }, { status: 404 });
      }
      testcases = question.testcases;
    } catch (dbError) {
      console.warn('Database failed in submit route, using mock testcases', dbError);
      // Fallback to mock testcases
      testcases = [
        { input: '5\n1 2 3 4 5', expectedOutput: '15' },
        { input: '3\n10 20 30', expectedOutput: '60' },
        { input: '1\n100', expectedOutput: '100' },
        { input: '4\n5 5 5 5', expectedOutput: '20' },
        { input: '6\n1 1 1 1 1 1', expectedOutput: '6' },
      ];
    }

    // Step 1: Pre-flight compile check
    const compileCheck = await executeCode(language, code, '');
    if (compileCheck.compile && compileCheck.compile.code !== 0) {
      // Safe save submission
      if (userId) {
        try {
          await User.findByIdAndUpdate(userId, {
            $push: {
              submissions: {
                questionId,
                code,
                language,
                verdict: 'Compilation Error',
                passedCount: 0,
                totalCount: testcases.length,
                submittedAt: new Date()
              }
            }
          });
        } catch (e) {}
      }

      return NextResponse.json({
        success: false,
        verdict: 'Compilation Error',
        passedCount: 0,
        totalCount: testcases.length,
        output: compileCheck.compile.output,
      });
    }

    // Step 2: Run all testcases
    let passedCount = 0;
    let verdict = 'Passed';
    let firstFailedOutput = '';

    for (let i = 0; i < testcases.length; i++) {
      const tc = testcases[i];
      const result = await executeCode(language, code, tc.input);

      if (result.run.code !== 0) {
        verdict = 'Runtime Error';
        firstFailedOutput = result.run.output || (result.run.signal ? `Process killed with signal: ${result.run.signal}` : '');
        break;
      }

      // Simple trim and comparison. More robust would handle \r\n vs \n
      const actualOutput = result.run.output.trim().replace(/\r\n/g, '\n');
      const expectedOutput = tc.expectedOutput.trim().replace(/\r\n/g, '\n');

      if (actualOutput === expectedOutput) {
        passedCount++;
      } else {
        verdict = 'Wrong Answer';
        firstFailedOutput = `Input:\n${tc.input}\n\nExpected:\n${expectedOutput}\n\nActual:\n${actualOutput}`;
        break; // Stop at first failed testcase
      }
    }

    // Step 3: Update User Progress
    if (userId) {
      try {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        const now = new Date();
        const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
        
        let newStreak = user.streak || 0;
        
        if (!lastActive) {
          newStreak = 1;
        } else {
          const diffInMs = now.setHours(0,0,0,0) - lastActive.setHours(0,0,0,0);
          const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

          if (diffInDays === 1) {
            newStreak += 1; // Successive day!
          } else if (diffInDays > 1) {
            newStreak = 1; // Missed a day, reset.
          }
          // If diffInDays === 0, they already active today, keep same streak.
        }

        const submissionData = {
          questionId,
          code,
          language,
          verdict,
          passedCount,
          totalCount: testcases.length,
          submittedAt: new Date()
        };

        const updateData: any = {
          $push: { submissions: submissionData },
          $set: { 
            lastActiveDate: new Date(),
            streak: newStreak
          }
        };

        // If passed, add to solvedQuestions (if not already there)
        if (verdict === 'Passed') {
          updateData.$addToSet = { solvedQuestions: questionId };
        }

        await User.findByIdAndUpdate(userId, updateData);
      } catch (e) {
        console.warn('Could not update user submissions', e);
      }
    }

    return NextResponse.json({
      success: verdict === 'Passed',
      verdict,
      passedCount,
      totalCount: testcases.length,
      output: verdict !== 'Passed' ? firstFailedOutput : 'All testcases passed successfully!',
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Submission failed' }, { status: 500 });
  }
}
