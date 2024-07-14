export function findValidJSON(str: string) {
  const results = [];
  let start = -1;
  let brackets = 0;
  let inString = false;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    if (char === '"' && (i === 0 || str[i - 1] !== "\\")) {
      inString = !inString;
    }

    if (!inString) {
      if (char === "{" || char === "[") {
        if (start === -1) {
          start = i;
        }
        brackets++;
      } else if (char === "}" || char === "]") {
        brackets--;
        if (brackets === 0 && start !== -1) {
          const potentialJSON = str.slice(start, i + 1);
          try {
            const parsed = JSON.parse(potentialJSON);
            results.push(parsed);
          } catch {
            // 解析失败，不是有效的 JSON
          }
          start = -1;
        }
      }
    }
  }

  return results;
}
