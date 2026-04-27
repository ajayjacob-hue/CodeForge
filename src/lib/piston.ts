export const executeCode = async (language: string, code: string, stdin: string = '') => {
  // Map our languages to Wandbox compilers
  const languageMap: Record<string, string> = {
    c: 'gcc-13.2.0-c',
    cpp: 'gcc-13.2.0',
  };

  const compiler = languageMap[language];
  if (!compiler) throw new Error('Unsupported language');

  const response = await fetch('https://wandbox.org/api/compile.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      compiler: compiler,
      code: code,
      stdin: stdin,
      save: false
    }),
  });

  const data = await response.json();

  // Map Wandbox response to Piston format to avoid changing API routes
  const hasCompilerError = data.compiler_error && data.compiler_error.trim().length > 0;
  
  return {
    compile: {
      code: hasCompilerError ? 1 : 0,
      output: data.compiler_error || data.compiler_message || '',
    },
    run: {
      code: parseInt(data.status || '0'),
      output: (data.program_output || '') + (data.program_error || ''),
      signal: data.signal || null,
    }
  };
};
