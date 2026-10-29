import sys
path = sys.argv[1]
s = open(path, encoding='utf-8').read()
old = "rawText = rawText.replace(new RegExp('\\\\s+(' + escO + ')', 'g'), '$1');"
assert s.count(old) == 1, s.count(old)
s = s.replace(old, "// רק רווחים אופקיים (לא מעברי שורה!): אחרת שורה שמתחילה בסימן הערה מודבקת לשורה הקודמת\n        rawText = rawText.replace(new RegExp('[ \\\\t\\\\u00A0]+(' + escO + ')', 'g'), '$1');")
open(path, 'w', encoding='utf-8').write(s)
print('patch12 applied')
