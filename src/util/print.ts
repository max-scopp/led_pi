export function print(line: any) {
  setTimeout(() => {
    const str = typeof line !== "string" ? JSON.stringify(line) : line;
    process.stdout.write(str);

    if (!str.endsWith("\r")) {
      process.stdout.write("\n");
    }
  });
}
