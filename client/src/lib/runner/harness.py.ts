// The Python-side execution contract, mirroring wrap.ts's role in the Ruby original.
//
// `_run_exercise` receives learner source plus an optional JSON array of
// [name, expression] pairs. It executes the learner code in a FRESH namespace
// (state isolation between runs), captures stdout, evaluates each check
// expression inside the learner's namespace (passing only when the value is
// exactly True), and returns ONE JSON string:
//
//   { ok, output, error?, checks?, methodChecks? }
//
// `must_use_json` is an optional JSON object { methods: [...], functions: [...] }.
// When present, after a successful run the source is parsed with `ast` and
// actual *call* nodes are inspected: a method requirement passes iff the code
// contains an `obj.name(...)` call anywhere; a function requirement passes iff
// it contains a `name(...)` call. Detection is structural (AST nodes only), so
// comments and string literals never satisfy a requirement.
//
// Because results travel back as a return value (never stdout), no sentinel
// splitting is needed and learner output stays pristine.

export const HARNESS_SOURCE = `
import ast
import io
import json
import sys
import traceback

_PLAYGROUND = "<playground>"
_MAX_FRAMES = 4


def _friendly_error(exc):
    if isinstance(exc, SyntaxError):
        lineno = exc.lineno or 0
        prefix = "line {}: ".format(lineno) if lineno else ""
        return "{}{}: {}".format(prefix, type(exc).__name__, exc.msg)
    frames = [
        frame
        for frame in traceback.extract_tb(exc.__traceback__)
        if frame.filename == _PLAYGROUND
    ]
    lines = []
    for frame in frames[-_MAX_FRAMES:]:
        if frame.name == "<module>":
            lines.append("line {}".format(frame.lineno))
        else:
            lines.append("line {}: in {}()".format(frame.lineno, frame.name))
    message = str(exc)
    lines.append("{}: {}".format(type(exc).__name__, message) if message else type(exc).__name__)
    return "\\n".join(lines)


def _collect_calls(src):
    """Return (methods, functions) actually called anywhere in the source.

    Methods are attribute calls obj.name(...); functions are bare name calls
    name(...). Detection is structural: strings and comments are never nodes,
    so typing a method name as text does not count.
    """
    methods = set()
    functions = set()
    try:
        tree = ast.parse(src)
    except SyntaxError:
        return methods, functions
    for node in ast.walk(tree):
        if not isinstance(node, ast.Call):
            continue
        if isinstance(node.func, ast.Attribute):
            methods.add(node.func.attr)
        elif isinstance(node.func, ast.Name):
            functions.add(node.func.id)
    return methods, functions


def _check_must_use(src, must_use):
    """Map required callables to {name, ok, error?} entries."""
    methods, functions = _collect_calls(src)
    checks = []
    for name in must_use.get("methods") or []:
        checks.append({"name": name, "ok": name in methods})
    for name in must_use.get("functions") or []:
        checks.append({"name": name, "ok": name in functions})
    return checks


def _run_exercise(src, checks_json, must_use_json=None):
    buffer = io.StringIO()
    namespace = {"__name__": "__main__"}
    ok = True
    error = None
    saved_stdout = sys.stdout
    sys.stdout = buffer
    try:
        try:
            exec(compile(src, _PLAYGROUND, "exec"), namespace)
        except BaseException as exc:
            ok = False
            error = _friendly_error(exc)
    finally:
        sys.stdout = saved_stdout

    output = buffer.getvalue()
    checks = None
    method_checks = None
    if ok and checks_json:
        checks = []
        for name, expr in json.loads(checks_json):
            entry = {"name": name, "ok": False}
            try:
                value = eval(expr, namespace)
                if value is True:
                    entry["ok"] = True
                else:
                    entry["got"] = repr(value)
            except BaseException as exc:
                entry["error"] = "{}: {}".format(type(exc).__name__, exc)
            checks.append(entry)
    if ok and must_use_json:
        try:
            must_use = json.loads(must_use_json)
        except (ValueError, TypeError):
            must_use = {}
        method_checks = _check_must_use(src, must_use)

    return json.dumps({
        "ok": ok,
        "output": output,
        "error": error,
        "checks": checks,
        "methodChecks": method_checks,
    })
`.trim();
