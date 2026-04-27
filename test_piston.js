const code = `
#include <stdio.h>

int main() {
    int n,sum;
    scanf("%d",&n);
    int arr[n];
    for(int i=0;i<n;i++){
        scanf("%d",&arr[i]);
        sum += arr[i];
    }
    printf("%d",sum);
    return 0;
}
`;

async function test() {
  const response = await fetch('https://emkc.org/api/v2/piston/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language: 'c',
      version: '10.2.0',
      files: [{ content: code }],
      stdin: '5\n1 2 3 4 5'
    }),
  });
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}

test();
