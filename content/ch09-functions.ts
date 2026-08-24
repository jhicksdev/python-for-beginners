import type { Chapter } from "../shared/types";

const chapter: Chapter = {
  slug: "functions",
  number: 9,
  title: "Functions",
  tagline: "Write your own instructions",
  blocks: [
    {
      type: "prose",
      md: `You've been *calling* functions since line one — \`print\`, \`len\`, \`type\`. Now you'll write your own.

A **function** wraps a chunk of behavior behind a name, optionally taking inputs (**parameters**) and handing back an output (**return value**):

\`\`\`python
def greet(name):
    return f"Hello, {name}!"

print(greet("Sam"))
\`\`\`

Two things beginners find surprising:

1. \`def\` defines the function; nothing runs until you call it.
2. Python does **not** return the last line automatically — you must say \`return\` explicitly. Forget it and your function quietly hands back \`None\`.`,
    },
    {
      type: "example",
      title: "Parameters in and values out",
      code: `def shout(text):
    return text.upper() + "!!!"

def add(a, b):
    return a + b

print(shout("hello"))
print(add(19, 23))

message = shout("we did it")
print(len(message))`,
      note: "shout returns a NEW string; it doesn't change the original. Functions that answer yes/no questions conventionally start with is_ or has_.",
    },
    {
      type: "prose",
      md: `Parameters can have **defaults**, used when the caller leaves them out. And by convention, functions whose job is to return \`True\`/\`False\` get an \`is_\` or \`has_\` prefix:`,
    },
    {
      type: "example",
      title: "Defaults and predicate functions",
      code: `def brew(tea, minutes=3):
    return f"Brewing {tea} for {minutes} minutes"

print(brew("mint"))
print(brew("black", 5))

def is_teenager(age):
    return age >= 13 and age <= 19

print(is_teenager(15))
print(is_teenager(30))`,
      note: "Reads like English: if is_teenager(age) — you'll write lines like that constantly from now on.",
    },
    {
      type: "prose",
      md: `Why bother wrapping code up?

- **Reuse**: write once, call anywhere.
- **Naming**: \`total_price(cart)\` documents itself.
- **Testing**: you can check a function's answers directly — which is exactly how this chapter's exercises will grade you!

Scope note: variables created *inside* a function belong to that function alone. Information goes in through parameters and comes out through the return value.`,
    },
    {
      type: "exercise",
      id: "functions-1",
      title: "Do the math",
      prompt:
        'Define a function `add(a, b)` that returns the sum of two numbers, and a function `multiply(a, b)`. Then print:\n\n```\n12\n35\n```',
      starter: `# define add and multiply, then print add(5, 7) and multiply(5, 7)

`,
      check: {
        kind: "assert",
        checks: [
          { name: "add(5, 7) == 12", expr: "add(5, 7) == 12" },
          { name: "multiply(5, 7) == 35", expr: "multiply(5, 7) == 35" },
          { name: "add works with other numbers too", expr: "add(-3, 3) == 0" },
        ],
        failHint:
          "def add(a, b):\n    return a + b\n— Python needs the explicit return.",
      },
      hint: "Each function is two lines: def name(params): and a return statement.",
      solution: `def add(a, b):
    return a + b

def multiply(a, b):
    return a * b

print(add(5, 7))
print(multiply(5, 7))`,
    },
    {
      type: "exercise",
      id: "functions-2",
      title: "The greeting factory",
      prompt:
        'Define `greet(name, greeting="Hello")`. With no second argument it should produce `"Hello, Sam!"`; with one, e.g. `greet("Sam", "Howdy")`, it produces `"Howdy, Sam!"`. Print:\n\n```\nHello, Ada!\nHowdy, Ada!\n```',
      starter: `# define greet with a default parameter, then:
# print(greet("Ada")) and print(greet("Ada", "Howdy"))

`,
      check: {
        kind: "assert",
        checks: [
          { name: 'greet("Ada")', expr: 'greet("Ada") == "Hello, Ada!"' },
          { name: 'greet("Ada", "Howdy")', expr: 'greet("Ada", "Howdy") == "Howdy, Ada!"' },
          { name: 'greet("Bo", "Yo")', expr: 'greet("Bo", "Yo") == "Yo, Bo!"' },
        ],
        failHint: 'def greet(name, greeting="Hello"): — the default kicks in when the caller skips it.',
      },
      hint: 'One f-string inside the function covers both cases: f"{greeting}, {name}!"',
      solution: `def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Ada"))
print(greet("Ada", "Howdy"))`,
    },
    {
      type: "exercise",
      id: "functions-3",
      title: "Palindrome detector",
      prompt:
        'Define `palindrome(text)` that returns True when the text reads the same forwards and backwards, ignoring case. It should work like this: `palindrome("Racecar")` → True, `palindrome("ruby")` → False.\n\nThen print:\n\n```\nracecar? True\nruby? False\n```',
      starter: `# define palindrome, then print both example lines
`,
      check: {
        kind: "assert",
        checks: [
          { name: 'palindrome("Racecar")', expr: 'palindrome("Racecar") is True' },
          { name: 'palindrome("ruby")', expr: 'palindrome("ruby") is False' },
          { name: 'palindrome("Noon")', expr: 'palindrome("Noon") is True' },
        ],
        failHint:
          "lower() first so \"Racecar\" matches case-insensitively, then compare to text[::-1] (the backwards slice).",
      },
      hint: "clean = text.lower(), then return clean == clean[::-1] — the comparison already evaluates to True or False.",
      mustUseMethods: ["lower"],
      solution: `def palindrome(text):
    clean = text.lower()
    return clean == clean[::-1]

print(f"racecar? {palindrome('racecar')}")
print(f"ruby? {palindrome('ruby')}")`,
      successMessage:
        "A real algorithm with a real edge case handled. You're thinking like a programmer now.",
    },
    {
      type: "prose",
      md: `Functions organize *behavior*. But what about bundling behavior together with the data it belongs to — a dog knowing how to bark, a bank account knowing its own balance? That idea changes everything. Classes are next.`,
    },
  ],
};

export default chapter;
