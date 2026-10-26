import sys
path = sys.argv[1]
s = open(path, encoding='utf-8').read()
def rep(old, new, count=1, label=''):
    global s
    c = s.count(old); assert c == count, f"[{label}] expected {count}, found {c}: {old[:70]!r}"
    s = s.replace(old, new)
rep("const canPush = pageHasContent || (colName === 'left' && rCol.children.length > 0);",
    "const canPush = pageHasContent || (colName === 'left' && rCol.children.length > 0)\n"
    "                                    || Array.from(pageLayout.bodyFlow.querySelectorAll('p')).some(x => x !== pElem);", label='canpush')
rep("                           && (targetCol.children.length > 1 || colName === 'left')) {",
    "                           && (targetCol.children.length > 1 || colName === 'left' || pageLayout.bodyFlow.querySelector('p'))) {", label='trailing-cond')
open(path, 'w', encoding='utf-8').write(s)
print('patch8 applied')
