export const copyTextToClipboard = async (text: string): Promise<void> => {
  if ('clipboard' in navigator) {
    await navigator.clipboard.writeText(text);
  } else {
    await document.execCommand('copy', true, text);
  }
};
