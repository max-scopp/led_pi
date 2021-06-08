export function print(line: any) {
  setTimeout(() => {
    const str = String(line);
    process.stdout.write(str);
    if (!str.endsWith("\r")) {
      process.stdout.write("\n");
    }
  });
}
