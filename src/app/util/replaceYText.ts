import * as Y from "yjs";

export function replaceYText(yText: Y.Text, value: string) {
  yText.doc?.transact(() => {
    while (yText.length) {
      yText.delete(0, yText.length);
    }
    yText.insert(0, value);
  });
}
