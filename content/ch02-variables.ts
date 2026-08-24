import type { Chapter } from "../shared/types";

const chapter: Chapter = {
  slug: "variables",
  number: 2,
  title: "Variables & Data Types",
  tagline: "Teach your programs to remember things",
  blocks: [
    {
      type: "prose",
      md: `A **variable** is a name that points at a value. Think of it as a labelled box: you put something in, and later you use the label to get it back.

Creating one is blissfully simple in Python. No types to declare, no ceremony. Just \`name = value\`.`,
    },
    {
      type: "example",
      title: "Boxes with labels",
      code: `name = "Ada"
age = 36
print(name)
print(age)`,
      note: "The = sign doesn't mean 'equals' like in math. It means 'put the value on the right into the variable on the left.'",
    },
    {
      type: "prose",
      md: `Variables can hold different *types* of values:

- **String**, text in quotes: \`"hello"\`
- **Integer**, whole numbers: \`42\`
- **Float**, decimal numbers: \`3.14\`
- **Boolean**, \`True\` or \`False\` (capitalized!)
- **None**, "nothing here" (Python's version of empty)

Curious what's inside a variable? Ask it! Wrap any value in \`type(...)\` and Python tells you its type.`,
    },
    {
      type: "example",
      title: "Ask a value for its type",
      code: `print(type(42))
print(type("hello"))
print(type(3.14))
print(type(True))
print(type(None))`,
      note: "Notice str, int and float are lowercase here but print wrapped in <class '...'>. They're actual things (classes) in Python, which you'll meet properly much later.",
    },
    {
      type: "prose",
      md: `Here's where variables earn their keep: **reusing and changing** values. You can do math with them, swap them around, and build new values from old ones.

Also notice what happens when you print \`None\`: it literally prints \`None\`, because that's the value: "nothing to see".`,
    },
    {
      type: "example",
      title: "Variables are made for reuse",
      code: `apples = 3
oranges = 5
fruit = apples + oranges

print(fruit)

fruit = fruit + 2
print(fruit)`,
      note: "Reassigning overwrites the old value. The line fruit = fruit + 2 means 'take what fruit has, add 2, store it back.'",
    },
    {
      type: "prose",
      md: `A couple of naming ground rules (Python will complain loudly if you break them):

- Use lowercase letters and underscores: \`first_name\`, not \`FirstName\` or \`first name\`.
- Names can't start with a number.
- Make names descriptive. \`score\` beats \`s\` every time.

This style is called \`snake_case\`, a style Python loves so much it's literally named after Monty Python's preference for silly, readable names.`,
    },
    {
      type: "exercise",
      id: "vars-1",
      title: "Make the boxes",
      prompt:
        'Create two variables: `city` holding the name of a city you\'d love to visit (as a string), and `year` holding the year you\'ll go (a whole number). Then print them on two separate lines:\n\n```\nKyoto\n2027\n```\n\n(Any city and year count. What matters is that both values live in variables.)',
      starter: `# Create city and year, then print both
`,
      check: {
        kind: "assert",
        checks: [
          { name: "city is set", expr: '"city" in vars()' },
          { name: "city is a string", expr: "isinstance(city, str)" },
          { name: "year is set", expr: '"year" in vars()' },
          { name: "year is an int", expr: "isinstance(year, int)" },
        ],
        failHint:
          'Strings need quotes: city = "Kyoto". Numbers don\'t take quotes: year = 2027.',
      },
      hint: 'First assign: city = "...", year = .... Then print(city) and print(year).',
      solution: `city = "Kyoto"
year = 2027
print(city)
print(year)`,
      successMessage:
        "Variables created and printed. Chapter 3 will show you how to weave them into sentences!",
    },
    {
      type: "exercise",
      id: "vars-2",
      title: "Type detective",
      prompt:
        "Without changing the values, make this program print each value's type, one per line, in order:\n\n```\n<class 'int'>\n<class 'str'>\n<class 'float'>\n```",
      starter: `mystery_one = 7
mystery_two = "seven"
mystery_three = 7.0

# Print each mystery's type below
`,
      check: { kind: "output", expect: "<class 'int'>\n<class 'str'>\n<class 'float'>" },
      hint: "Wrap each variable in type(...) and print the result.",
      solution: `mystery_one = 7
mystery_two = "seven"
mystery_three = 7.0
print(type(mystery_one))
print(type(mystery_two))
print(type(mystery_three))`,
    },
    {
      type: "exercise",
      id: "vars-3",
      title: "The swap",
      prompt:
        "Swap the values of `left_hand` and `right_hand`, then print both lines:\n\n```\nLeft holds: ring\nRight holds: coin\n```\n\n(Python actually has a one-line swap trick. Try the temporary-variable way first, then ask a search engine about 'python tuple swap' if you're curious.)",
      starter: `left_hand = "coin"
right_hand = "ring"

# Swap their values here
`,
      check: {
        kind: "assert",
        checks: [
          { name: "left_hand now holds ring", expr: 'left_hand == "ring"' },
          { name: "right_hand now holds coin", expr: 'right_hand == "coin"' },
        ],
        failHint:
          "Create a temporary variable to hold one value while you shuffle the other two.",
      },
      hint: "pocket = left_hand, then left_hand = right_hand, then right_hand = pocket.",
      solution: `left_hand = "coin"
right_hand = "ring"

pocket = left_hand
left_hand = right_hand
right_hand = pocket

print(f"Left holds: {left_hand}")
print(f"Right holds: {right_hand}")`,
    },
    {
      type: "prose",
      md: `You now know how programs remember things. Coming up: strings get the spotlight, including f-strings, the magic that makes mixing text and variables painless.`,
    },
  ],
};

export default chapter;
