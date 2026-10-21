#!/usr/bin/env python3
"""Hash final inputs/export separately from mutable evidence and documentation."""
from pathlib import Path
import hashlib, json, subprocess, sys
root = Path(__file__).resolve().parents[2]
out = root / 'docs/validation/steps-brand-v1'
protected_prefixes = ('src/', 'sdk/', 'cli/', 'abi/', 'config/', 'test/', 'test-sdk/', 'lib/')
protected_names = {'foundry.toml','foundry.lock','remappings.txt','.gitmodules','package.json','package-lock.json','frontend/package-lock.json','frontend/vite.config.ts','frontend/tsconfig.json','frontend/vitest.config.ts','frontend/playwright.config.ts'}
excluded = {'node_modules', '.git', '.cache', '.vite', 'scratch', 'test-results', 'playwright-report'}
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def collect(paths):
    files = set()
    for name in paths:
        p = root / name
        for f in p.rglob('*') if p.is_dir() else [p]:
            if f.is_file() and not (set(f.relative_to(root).parts) & excluded): files.add(f)
    return {str(p.relative_to(root)): {'bytes':p.stat().st_size,'sha256':sha(p)} for p in sorted(files)}
def categories():
    return {
        'runtime-source': collect(['frontend/src','frontend/index.html','frontend/package.json','frontend/package-lock.json','frontend/tsconfig.json','frontend/vite.config.ts','frontend/public','sdk','abi','config']),
        'test-source': collect(['frontend/tests','frontend/scripts','frontend/playwright.config.ts','frontend/vitest.config.ts','test','test-sdk']),
        'assets': collect(['brand','frontend/public']),
        'dist': collect(['dist']),
    }
def protected():
    files = subprocess.check_output(['git','ls-tree','-r','--name-only','d29eedf8e7d6608ed109972c179b367ac07ce91f'], cwd=root).decode().splitlines()
    pins = {}
    for name in files:
        if name in protected_names or name.startswith(protected_prefixes):
            expected = hashlib.sha256(subprocess.check_output(['git','show','d29eedf8e7d6608ed109972c179b367ac07ce91f:'+name],cwd=root)).hexdigest()
            actual = sha(root / name)
            if actual != expected: raise SystemExit('Protected predecessor mismatch: '+name)
            pins[name] = actual
    return {'status':'PASS','pinnedDelivery':'d29eedf8e7d6608ed109972c179b367ac07ce91f','acceptedStartingHead':subprocess.check_output(['git','rev-parse','HEAD'],cwd=root).decode().strip(),'files':pins}
mode = sys.argv[1] if len(sys.argv)>1 else 'verify'
if mode == 'capture':
    for kind,files in categories().items(): (out/(kind+'-sha256.json')).write_text(json.dumps({'algorithm':'SHA-256','files':files},indent=2)+'\n')
    (out/'protected-core-sha256.json').write_text(json.dumps(protected(),indent=2)+'\n')
    print('PASS: captured runtime, test, asset, export and protected predecessor hashes')
elif mode == 'verify':
    for kind,files in categories().items():
        expected = json.loads((out/(kind+'-sha256.json')).read_text())['files']
        if files != expected:
            changed = [n for n in files.keys() | expected.keys() if files.get(n)!=expected.get(n)]
            raise SystemExit('Changed since final test capture: '+kind+' '+str(changed))
    protected()
    print('PASS: exact captured runtime/test/assets/export bytes unchanged; protected predecessor bytes match')
else: raise SystemExit('Use capture or verify')
