import os, sys, ast, argparse
DEFAULT_FORBIDDEN_IMPORTS = {
    "core": ["aiogram", "sqlalchemy", "api", "data", "services"],
    "api": ["sqlalchemy", "data.models"], 
    "data": ["aiogram", "services", "api"],
    "services": ["aiogram", "api", "sqlalchemy"]
}
def check_file_integrity(file_path, folder_name, rules, max_lines=200):
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
        if len(lines) > max_lines: return [f"File too long ({len(lines)} > {max_lines})"]
        try: tree = ast.parse("".join(lines))
        except Exception as e: return [f"Syntax Error: {e}"]
    errors = []
    forbidden = rules.get(folder_name, [])
    for node in ast.walk(tree):
        if isinstance(node, (ast.Import, ast.ImportFrom)):
            names = [node.module] if isinstance(node, ast.ImportFrom) else [n.name for n in node.names]
            for name in names:
                if name and any(name.startswith(f) for f in forbidden):
                    errors.append(f"Illegal import: {name}")
    return errors
def scan_organism(base_dir=".", max_lines=200):
    has_issues = False
    for layer in DEFAULT_FORBIDDEN_IMPORTS.keys():
        path = os.path.join(base_dir, layer)
        if not os.path.exists(path): continue
        for root, _, files in os.walk(path):
            for file in files:
                if file.endswith(".py"):
                    errs = check_file_integrity(os.path.join(root, file), layer, DEFAULT_FORBIDDEN_IMPORTS, max_lines)
                    for e in errs: print(f"[!] {os.path.join(root, file)}: {e}"); has_issues = True
    return not has_issues
if __name__ == "__main__":
    if not scan_organism(): sys.exit(1)
    print("[✓] Architecture is clean.")
