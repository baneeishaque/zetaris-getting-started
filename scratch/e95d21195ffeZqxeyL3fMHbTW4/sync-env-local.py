from pathlib import Path
import json
import re

local_path = Path('/home/ext_root/lab-data/zetaris-getting-started/.env.local')
platform_path = Path('/home/ext_root/lab-data/zetaris-platform/.env')


def parse(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    for raw in path.read_text().splitlines():
        line = raw.strip()
        if not line or line.startswith('#') or '=' not in line:
            continue
        key, value = line.split('=', 1)
        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in '"\'':
            value = value[1:-1]
        values[key.strip()] = value
    return values


platform = parse(platform_path)
updates = {
    'ZETARIS_USERNAME': platform['ZETARIS_ADMIN_EMAIL'],
    'ZETARIS_PASSWORD': platform['ZETARIS_ADMIN_PASSWORD'],
    'ZETARIS_JDBC_JAR': '/home/ext_root/lab-data/zetaris-platform/jdbc/ndp-jdbc-driver-2.4.3.1-7eff043-driver.jar',
}

lines = local_path.read_text().splitlines()
seen: set[str] = set()
output: list[str] = []
pattern = re.compile(r'^(\s*)([A-Za-z_][A-Za-z0-9_]*)(\s*=\s*)(.*)$')
for line in lines:
    match = pattern.match(line)
    if match and match.group(2) in updates:
        key = match.group(2)
        seen.add(key)
        output.append(f'{match.group(1)}{key}={json.dumps(updates[key])}')
    else:
        output.append(line)
for key, value in updates.items():
    if key not in seen:
        output.append(f'{key}={json.dumps(value)}')

local_path.write_text('\n'.join(output) + '\n')
print('updated:', ', '.join(sorted(updates)))
