#!/usr/bin/env python3
"""Recover indexed historical evidence only; never execute recovered content."""
import argparse, hashlib, io, json, pathlib, tarfile, urllib.request
here = pathlib.Path(__file__).resolve().parent
parser = argparse.ArgumentParser()
parser.add_argument('--out', required=True, type=pathlib.Path, help='Empty destination outside the delivery, e.g. /tmp/steps-history')
parser.add_argument('--predecessor-tar', type=pathlib.Path, help='Optional already downloaded pinned GitHub archive')
args = parser.parse_args()
index = json.loads((here / 'original-path-sha256.json').read_text())
args.out.mkdir(parents=True, exist_ok=True)
if any(args.out.iterdir()):
    raise SystemExit('Destination must be empty; no existing files will be overwritten')
archive = args.predecessor_tar.read_bytes() if args.predecessor_tar else urllib.request.urlopen(index['immutableArchiveURL'], timeout=90).read()
# GitHub can regenerate gzip headers. Individual SHA-256 values, rather than a tar encoding,
# authenticate every recovered file against the delivered original-path index.
verified = 0
with tarfile.open(fileobj=io.BytesIO(archive), mode='r:gz') as remote, tarfile.open(here / 'accepted-brand-additions.tar.xz', 'r:xz') as local:
    remote_members = {m.name.split('/', 1)[1]: m for m in remote.getmembers() if m.isfile() and '/' in m.name}
    for name, entry in index['files'].items():
        path = pathlib.PurePosixPath(name)
        if path.is_absolute() or '..' in path.parts or not name.startswith('docs/validation/'):
            raise SystemExit('Invalid indexed evidence path')
        source = local if 'archive' in entry['recovery'] else remote
        member = local.getmember(name) if source is local else remote_members[name]
        data = source.extractfile(member).read()
        if len(data) != entry['bytes'] or hashlib.sha256(data).hexdigest() != entry['sha256']:
            raise SystemExit('Byte recovery mismatch: ' + name)
        target = args.out.joinpath(*path.parts)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
        verified += 1
print(json.dumps({'status': 'PASS', 'recoveredFiles': verified, 'verifiedBytes': sum(e['bytes'] for e in index['files'].values()), 'method': 'all original paths recovered and SHA-256 checked'}))
