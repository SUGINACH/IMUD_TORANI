import sys
path = sys.argv[1]
s = open(path, encoding='utf-8').read()
def rep(old, new, count=1, label=''):
    global s
    c = s.count(old); assert c == count, f"[{label}] expected {count}, found {c}: {old[:70]!r}"
    s = s.replace(old, new)
rep("    const dropWords = words.slice(0, Math.min(wordCount, words.length)).map(displayOf).join(' ');",
    "    const dropWords = words.slice(0, Math.min(wordCount, words.length)).join(' ').replace(/\\uE000/g, ' ');\n"
    "    const dropWordsDisplay = words.slice(0, Math.min(wordCount, words.length)).map(displayOf).join(' ');", label='dropWords')
rep("        html += `<span class=\"first-word-window\" id=\"mw-0\">${dropWords}</span> `;",
    "        html += `<span class=\"first-word-window\" id=\"mw-0\">${dropWordsDisplay}</span> `;", label='html')
open(path, 'w', encoding='utf-8').write(s)
print('patch11 applied')
