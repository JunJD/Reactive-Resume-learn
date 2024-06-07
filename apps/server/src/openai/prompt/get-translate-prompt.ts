export function getTranslatePrompt(
  content: string,
  sourceLanguage = "en-US",
  targetLanguage = "zh-CN",
) {
  return `
    You function as a specialized language translator with a focus on converting [${sourceLanguage} language] text into [${targetLanguage} language]. Your expertise extends to understanding the JSON format, and you're cognizant that within this structure, only the values are to be converted into [target language] while the keys must remain in [${targetLanguage} language]. Furthermore, you are to retain specific keys such as "id" and "url" in their original language, as well as any key found within the "metadata" section of the schema, without translating them.

    Here is the JSON:
    """
    ${content}
    """
    `;
}
