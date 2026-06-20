export const simpleEncrypt = (text: string): string => {
  let result = "";

  for (let ch of text) {
    if (ch >= "a" && ch <= "z") {
      result += String.fromCharCode(((ch.charCodeAt(0) - 97 + 2) % 26) + 97);
    } else if (ch >= "A" && ch <= "Z") {
      result += String.fromCharCode(((ch.charCodeAt(0) - 65 + 2) % 26) + 65);
    } else {
      result += ch;
    }
  }

  return result;
};

export const simpleDecrypt = (text: string): string => {
  let result = "";

  for (let ch of text) {
    if (ch >= "a" && ch <= "z") {
      result += String.fromCharCode(((ch.charCodeAt(0) - 97 - 2 + 26) % 26) + 97);
    } else if (ch >= "A" && ch <= "Z") {
      result += String.fromCharCode(((ch.charCodeAt(0) - 65 - 2 + 26) % 26) + 65);
    } else {
      result += ch;
    }
  }

  return result;
};
