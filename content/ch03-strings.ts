import type { Chapter } from "../shared/types";

const chapter: Chapter = {
  slug: "strings",
  number: 3,
  title: "Strings & F-Strings",
  tagline: "Make your text do tricks",
  blocks: [
    {
      type: "prose",
      md: `Strings showed up in chapter one, quietly doing their job. Time to see what they can really do.

The headline feature is the **f-string**, and it's why Python programmers smile a lot: put an \`f\` before the quotes, then drop any variable (or any expression!) into \`{...}\` holes inside the string.`,
    },
    {
      type: "example",
      title: "Weave variables into sentences",
      code: `name = "Maya"
snacks = 3

print(f"Hi, {name}! You have {snacks} snacks.")
print(f"In five years you'll have {snacks * 12} snack-related memories.")`,
      note: "Everything inside {} is real Python. Math, function calls, other strings — anything goes. Note: the f prefix is required. Without it, {} prints literally.",
    },
    {
      type: "prose",
      md: `Compare that to gluing strings together with \`+\`, which works but gets clunky fast:

\`\`\`python
"Hi, " + name + "! You have " + str(snacks) + " snacks."
\`\`\`

(That \`str(...)\` means "**str**ing" — \`+\` refuses to mix text and numbers without it.)

F-strings are almost always the cleaner choice. Now meet some classic string *methods* — actions strings know how to perform on themselves.`,
    },
    {
      type: "example",
      title: "A tour of string methods",
      code: `word = "python"

print(word.upper())
print(word.capitalize())
print(len(word))
print(word * 3)`,
      note: "word * 3 repeats the string three times. Python doesn't stop you from having fun. And len() counts characters — note it's a function, not word.length.",
    },
    {
      type: "prose",
      md: `Two more everyday moves:

- \`.strip()\` removes stray spaces from both ends — lifesaver when cleaning input.
- \`"x" in word\` answers whether the string contains something, giving you \`True\` or \`False\`.

Methods chain nicely, too: \`"  python ".strip().upper()\` gives \`"PYTHON"\`. Read chains left to right — each step transforms the result of the previous one.`,
    },
    {
      type: "example",
      title: "Chaining and replacing",
      code: `messy = "  Python is Fun  "

print(messy.strip())
print("Fun" in messy.strip())
print(messy.strip().replace("Fun", "Fantastic"))`,
      note: "replace swaps every occurrence of the first piece for the second. The in operator asks a yes/no question about membership.",
    },
    {
      type: "exercise",
      id: "strings-1",
      title: "The postcard",
      prompt:
        'Remember your travel plans? Create `city` and `year` again (`city` as a string, `year` as a number), then use an f-string to print this exact postcard:\n\n```\nSee you in Kyoto in 2027!\n```',
      starter: `city =
year =

# Print the postcard line with an f-string
`,
      check: { kind: "output", expect: "^See you in .+ in \\d{4}!$", mode: "regex", displayExpect: "See you in Kyoto in 2027!" },
      hint: 'One print with two {} holes: print(f"See you in {city} in {year}!")',
      solution: `city = "Kyoto"
year = 2027

print(f"See you in {city} in {year}!")`,
      successMessage:
        "Chapter 2's awkward problem, solved in one elegant line. That's f-strings for you.",
    },
    {
      type: "exercise",
      id: "strings-2",
      title: "Stadium chant",
      prompt:
        'Given `team = "united"` (all lowercase), print exactly:\n\n```\nUNITED! UNITED! UNITED!\n```',
      starter: `team = "united"

# Print the chant
`,
      check: { kind: "output", expect: "UNITED! UNITED! UNITED!" },
      hint: "Upper-case the team, then either multiply a '!'-ful string or build it three times.",
      mustUseMethods: ["upper"],
      solution: `team = "united"

chant = team.upper() + "! "
print(chant * 2 + team.upper() + "!")`,
    },
    {
      type: "exercise",
      id: "strings-3",
      title: "String lab",
      prompt:
        'Using the given `secret` string, make the program print exactly:\n\n```\n12\nsTAY cURIOUS\nSt?y C?r???s\n```\n\nLine 1 is its length. Line 2: the **swapcase** version (lower becomes upper and vice versa). Line 3: every vowel replaced with `"?"` — chain `.replace()` calls, one per vowel.',
      starter: `secret = "Stay Curious"

# Line 1: its length
# Line 2: swapcase version
# Line 3: vowels replaced with "?" — chain .replace() calls
`,
      check: { kind: "output", expect: "12\nsTAY cURIOUS\nSt?y C?r???s" },
      hint: "Line 1: len(secret). Line 2: secret.swapcase(). Line 3: replace a, e, i, o and u one at a time — each .replace() feeds the next.",
      mustUseMethods: ["swapcase", "replace"],
      solution: `secret = "Stay Curious"

print(len(secret))
print(secret.swapcase())
print(secret.replace("a", "?").replace("e", "?").replace("i", "?").replace("o", "?").replace("u", "?"))`,
    },
    {
      type: "prose",
      md: `You now handle text like a pro: interpolate with f-strings, transform, chain, ask questions.

Next: numbers — including one division surprise that trips up every newcomer.`,
    },
  ],
};

export default chapter;
