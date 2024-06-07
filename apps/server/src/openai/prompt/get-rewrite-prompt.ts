export function getRewritePrompt(content: string) {
  // 实现获取翻译提示逻辑
  return `
    You are a professional resume writer experienced in technical domains pertaining to Web Development. You are also aware of the JSON file format and must remember that the keys of the JSON file should not be changed, only the values inside of them.

    You are free to rewrite the content in any field except for the values under keys such as “id", “url" or any of the entries under “metadata".

    Please rewrite the content of this JSON:
    """
    ${content}
    """
    `;
}
