import type { Chapter } from "../shared/types";

const chapter: Chapter = {
  slug: "classes",
  number: 10,
  title: "Classes & Objects",
  tagline: "Blueprints for your own ideas",
  blocks: [
    {
      type: "prose",
      md: `Here's the secret you've been building toward: everything in Python, strings, numbers, lists, even \`None\`, is an **object**. Each one bundles data with the methods that make sense for it. (Remember \`type(42)\` printing \`<class 'int'>\`? You were peeking behind the curtain.)

A **class** is the blueprint; an **instance** (created by calling it like a function) is one actual thing built from it:

\`\`\`python
class Dog:
    def bark(self):
        return "Woof!"

rex = Dog()
print(rex.bark())
\`\`\`

The method \`bark\` belongs to dogs. Strings don't have it, numbers don't have it; only instances of \`Dog\` do.

That odd \`self\`? It's the instance itself, handed in automatically on every call. Every method takes \`self\` first; it's how the method knows *which* dog is barking.`,
    },
    {
      type: "prose",
      md: `Most objects need to remember things about *themselves*. Attributes, attached with dot notation, belong to each individual object:

- \`rex.name\` can be "Rex" while another dog has its own.

The special \`__init__\` method runs automatically at creation time, perfect for setting up those attributes.`,
    },
    {
      type: "example",
      title: "__init__ and attributes",
      code: `class Dog:
    def __init__(self, name):
        self.name = name

    def introduce(self):
        return f"{self.name} says woof"

rex = Dog("Rex")
fido = Dog("Fido")

print(rex.introduce())
print(fido.introduce())`,
      note: 'Two dogs, two separate names. Each instance keeps its own state. self.name = name means "store the name parameter ON THIS INSTANCE."',
    },
    {
      type: "prose",
      md: `Unlike some languages, Python attributes are readable and writable from outside by default, no getter ceremony. \`rex.name\` just works, and you can assign to it directly.

Methods that change the object update its attributes; that's called *mutating* state:`,
    },
    {
      type: "example",
      title: "State that changes",
      code: `class Cat:
    def __init__(self, name):
        self.name = name
        self.lives = 9

    def lose_a_life(self):
        if self.lives > 0:
            self.lives -= 1

mochi = Cat("Mochi")
mochi.lose_a_life()
mochi.lose_a_life()

print(mochi.name)
print(mochi.lives)`,
      note: "Methods that CHANGE the object's state are called just like any other. After two mishaps, Mochi has 7 lives left.",
    },
    {
      type: "exercise",
      id: "classes-1",
      title: "Build a Book",
      prompt:
        'Create a class `Book`:\n\n- `__init__(self, title, pages)` stores both as `self.title` and `self.pages`\n- a `summary` method returns `"TITLE (PAGES pages)"`, e.g. `"Snow Crash" (440 pages)"`\n\nThen create `snow_crash = Book("Snow Crash", 440)` and print `snow_crash.summary()`.',
      starter: `class Book:
    pass

snow_crash = Book("Snow Crash", 440)
print(snow_crash.summary())
`,
      check: {
        kind: "assert",
        checks: [
          { name: "title readable", expr: 'Book("Dune", 412).title == "Dune"' },
          { name: "pages readable", expr: "Book(\"Dune\", 412).pages == 412" },
          { name: "summary format", expr: 'Book("Dune", 412).summary() == "Dune (412 pages)"' },
        ],
        failHint:
          'Inside summary: return f"{self.title} ({self.pages} pages)". Mind the exact spacing!',
      },
      hint: "Two ingredients: an __init__ storing self.title and self.pages, plus a summary method using self.",
      solution: `class Book:
    def __init__(self, title, pages):
        self.title = title
        self.pages = pages

    def summary(self):
        return f"{self.title} ({self.pages} pages)"

snow_crash = Book("Snow Crash", 440)
print(snow_crash.summary())`,
    },
    {
      type: "exercise",
      id: "classes-2",
      title: "A counter that counts",
      prompt:
        'Create class `Counter` whose instances start at zero and support `increment` (adds 1), `reset` (back to zero), and reading `.value`. The program should print:\n\n```\n3\n0\n```',
      starter: `class Counter:
    pass

c = Counter()
for _ in range(3):
    c.increment()
print(c.value)
c.reset()
print(c.value)
`,
      check: {
        kind: "assert",
        checks: [
          { name: "starts at zero", expr: "Counter().value == 0" },
          {
            name: "counts up",
            expr: "(lambda c1: (c1.increment(), c1.increment(), c1.value)[2])(Counter()) == 2",
          },
          {
            name: "independent counters",
            expr: "(lambda a, b: (a.increment(), b.value)[1])(Counter(), Counter()) == 0",
          },
        ],
        failHint: "self.value starts at 0 inside __init__. increment does self.value += 1.",
      },
      hint: "Don't share state between instances; each Counter() gets its own fresh self.value set inside __init__.",
      solution: `class Counter:
    def __init__(self):
        self.value = 0

    def increment(self):
        self.value += 1

    def reset(self):
        self.value = 0

c = Counter()
for _ in range(3):
    c.increment()
print(c.value)
c.reset()
print(c.value)`,
      successMessage:
        "Independent instances, mutable state, clean interface, that's object-oriented programming's core move.",
    },
    {
      type: "prose",
      md: `Look how far you've come: output, variables, text, math, decisions, loops, lists, dictionaries, functions, and now your own blueprints.

One chapter left, and it ties every single one of these together into one little world you'll build yourself.`,
    },
  ],
};

export default chapter;
