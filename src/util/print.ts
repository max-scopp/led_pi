export function print(...args: any[]) {
  new Promise((resolve) => {
    console.log(...args);
    resolve(true);
  });
}
