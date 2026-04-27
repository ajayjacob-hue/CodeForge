import { NextResponse } from 'next/server';
import { executeCode } from '@/lib/piston';

export async function POST(req: Request) {
  try {
    const { code, language, stdin } = await req.json();

    if (!code || !language) {
      return NextResponse.json({ error: 'Code and language are required' }, { status: 400 });
    }

    const result = await executeCode(language, code, stdin);

    if (result.compile && result.compile.code !== 0) {
      return NextResponse.json({
        success: false,
        errorType: 'Compilation Error',
        output: result.compile.output,
      });
    }

    if (result.run && result.run.code !== 0) {
      const runOutput = result.run.output || (result.run.signal ? `Process killed with signal: ${result.run.signal}` : '');
      return NextResponse.json({
        success: false,
        errorType: 'Runtime Error',
        output: runOutput,
      });
    }

    return NextResponse.json({
      success: true,
      output: result.run ? result.run.output : '',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Execution failed' }, { status: 500 });
  }
}
