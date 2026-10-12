import re, string, base64

with open(r'Tvinahentai\src\toc.js', 'r', encoding='utf8') as f:
    s = f.read().strip()

for t in ['x0P1Xx','x0P2Xx','x0P3Xx','x1Xx','x2Xx','x3Xx','x4Xx','x5Xx','x6Xx','x7Xx','x8Xx','x9Xx']:
    print(f'{t}: {s.count(t)}')
print('unique long tokens sample', len(set(re.findall(r'x[^x]*Xx', s))))
filtered = re.sub(r'x[^x]*Xx', '', s)
print('filtered len', len(filtered))
print('bad chars', sum(1 for c in filtered if c not in string.ascii_letters+string.digits+'+/='))
print('filtered prefix', filtered[:120])
try:
    decoded = base64.b64decode(filtered)
    print('base64 ok, decoded len', len(decoded))
    print('decoded prefix', decoded[:120])
except Exception as e:
    print('base64 fail', e)
