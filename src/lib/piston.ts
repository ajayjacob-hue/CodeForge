export const executeCode = async (language: string, code: string, stdin: string = '') => {
  // Map our languages to piston versions
  const languageMap: Record<string, { lang: string, version: string }> = {
    c: { lang: 'c', version: '10.2.0' },
    cpp: { lang: 'c++', version: '10.2.0' },
  };

  const pistonLang = languageMap[language];
  if (!pistonLang) throw new Error('Unsupported language');

  const response = await fetch('https://emkc.org/api/v2/piston/execute', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      language: pistonLang.lang,
      version: pistonLang.version,
      files: [
        {
          content: code,
        },
      ],
      stdin: stdin,
    }),
  });

  const data = await response.json();
  return data;
};
