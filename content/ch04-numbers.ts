import type { Chapter } from "../shared/types";

const chapter: Chapter = {
  slug: "numbers",
  number: 4,
  title: "Numbers & Math",
  tagline: "Arithmetic is a Python superpower",
  blocks: [
    {
      type: "prose",
      md: `Python handles the usual arithmetic with the symbols you'd expect, and throws in a few bonuses.

\`+\` \`-\` \`*\` do what you think. The interesting ones:

- \`/\` division, with a *surprise* (below)
- \`//\` floor division, divide and round *down*
- \`%\` modulo, the remainder after dividing
- \`**\` exponent, powers of things`,
    },
    {
      type: "example",
      title: "The operators",
      code: `print(7 + 3)
print(7 - 3)
print(7 * 3)
print(7 % 3)
print(2 ** 10)`,
      note: "7 % 3 is 1 because 3 fits into 7 twice (6), leaving a remainder of 1. Modulo is everywhere in real programs. Even/odd checks, cycling through options, you name it.",
    },
    {
      type: "prose",
      md: `Now the surprise, and it's the *opposite* of some other languages. What's \`10 / 3\`?

In Python, dividing with \`/\` **always gives you a decimal** (a float): \`3.333...\`. Even \`10 / 5\` gives \`2.0\`, not \`2\`.

If you want the whole-number part, use floor division \`//\`: \`10 // 3\` is \`3\`. Forgetting which slash does what is a rite of passage for every programmer.`,
    },
    {
      type: "example",
      title: "The division surprise",
      code: `print(10 / 3)
print(10 / 5)
print(10 // 3)

pizza = 10
friends = 3
print(pizza % friends, "slice(s) left over")`,
      note: "10 / 5 prints 2.0, a float! The // operator chops off the decimal part instead.",
    },
    {
      type: "prose",
      md: `Normal math precedence rules apply (\`*\` before \`+\`), and parentheses win over everything.

Python also ships a whole toolbox of extra math under the name \`math\`. You unlock it with one line, \`import math\`, and then call things like \`math.ceil(...)\` (always round up) or \`math.floor(...)\` (always round down). Imports are how every Python program reaches beyond the basics; you'll meet them properly later.`,
    },
    {
      type: "example",
      title: "Rounding helpers",
      code: `import math

print(round(3.7))
print(math.floor(3.2))
print(math.ceil(3.2))
print(abs(-8))`,
      note: "round() is built in; ceil and floor live in the math module. abs() (distance from zero) is built in too.",
    },
    {
      type: "exercise",
      id: "nums-1",
      title: "Trip calculator",
      prompt:
        "A road trip is 940 km. You drive 8 hours per day at an average of 82 km/h. Using variables and math (no hardcoding answers!), print exactly:\n\n```\nDaily distance: 656\nDays needed: 2\n```",
      starter: `import math

trip_km = 940
hours_per_day = 8
speed = 82

# daily = speed * hours_per_day
# days = trip_km split across days, rounded UP. math.ceil will help
`,
      check: { kind: "output", expect: "Daily distance: 656\nDays needed: 2" },
      hint: "math.ceil(trip_km / daily) rounds up any leftover fraction. 940/656 = 1.43… → 2 days.",
      solution: `import math

trip_km = 940
hours_per_day = 8
speed = 82

daily = speed * hours_per_day
days = math.ceil(trip_km / daily)

print(f"Daily distance: {daily}")
print(f"Days needed: {days}")`,
    },
    {
      type: "exercise",
      id: "nums-2",
      title: "Clock arithmetic",
      prompt:
        'A movie starts at hour `start = 22` and runs `length = 5` hours. What hour does it end? Print:\n\n```\nThe movie ends at hour 3\n```\n\nUse `%` so the answer wraps around midnight correctly.',
      starter: `start = 22
length = 5

# (22 + 5) % 24 ...?
`,
      check: { kind: "output", expect: "The movie ends at hour 3" },
      hint: "There are 24 hours in a day; modulo 24 wraps anything past midnight back around.",
      solution: `start = 22
length = 5

ends_at = (start + length) % 24
print(f"The movie ends at hour {ends_at}")`,
    },
    {
      type: "exercise",
      id: "nums-3",
      title: "Even split check",
      prompt:
        "Write a program that sets `cookies = 13` and `people = 4`, then prints whether the cookies divide evenly:\n\n```\nEven split? False\n```\n\n(Mind Python's capitalization of booleans!) Then change ONLY the values to `cookies = 12`, run again, and confirm it prints `True`. (Leave the values at 13 before checking.)",
      starter: `cookies = 13
people = 4

# print Even split? followed by True or False
`,
      check: { kind: "output", expect: "Even split? False" },
      hint: "The remainder after division tells you: cookies % people == 0 is either True or False.",
      solution: `cookies = 13
people = 4

print(f"Even split? {cookies % people == 0}")`,
    },
    {
      type: "prose",
      md: `Notice what crept in there: comparing things with \`==\` produced \`True\`/\`False\`. That comparison superpower is exactly what the next chapter is about: teaching programs to make decisions.`,
    },
  ],
};

export default chapter;
