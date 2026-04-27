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
  const response = await fetch('https://wandbox.org/api/compile.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      compiler: 'gcc-13.2.0-c',
      code: code,
      stdin: '5\n1 2 3 4 5',
      save: false
    }),
  });
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}

test();
