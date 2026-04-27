import { NextResponse } from 'next/server';
import { executeCode } from '@/lib/piston';
import connectDB from '@/lib/db';
import Question from '@/models/Question';
import Submission from '@/models/Submission';

// Remove the mock user ID in production and get it from NextAuth session
const MOCK_USER_ID = '60d5ecb8b392d700153ee612'; 

export async function POST(req: Request) {
  try {
    await connectDB();
    const { code, language, questionId } = await req.json();

    if (!code || !language || !questionId) {
      return NextResponse.json({ error: 'Code, language, and questionId are required' }, { status: 400 });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Step 1: Pre-flight compile check
    const compileCheck = await executeCode(language, code, '');
    if (compileCheck.compile && compileCheck.compile.code !== 0) {
      // Save submission
      await Submission.create({
        userId: MOCK_USER_ID,
        questionId,
        code,
        language,
        verdict: 'Compilation Error',
        passedCount: 0,
        totalCount: question.testcases.length
      });

      return NextResponse.json({
        success: false,
        verdict: 'Compilation Error',
        passedCount: 0,
        totalCount: question.testcases.length,
        output: compileCheck.compile.output,
      });
    }

    // Step 2: Run all testcases
    let passedCount = 0;
    let verdict = 'Passed';
    let firstFailedOutput = '';

    for (let i = 0; i < question.testcases.length; i++) {
      const tc = question.testcases[i];
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

    // Save submission
    await Submission.create({
      userId: MOCK_USER_ID, // Use real user ID in production
      questionId,
      code,
      language,
      verdict,
      passedCount,
      totalCount: question.testcases.length
    });

    return NextResponse.json({
      success: verdict === 'Passed',
      verdict,
      passedCount,
      totalCount: question.testcases.length,
      output: verdict !== 'Passed' ? firstFailedOutput : 'All testcases passed successfully!',
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Submission failed' }, { status: 500 });
  }
}
