import type { Chapter } from "../shared/types";

const chapter: Chapter = {
  slug: "decisions",
  number: 5,
  title: "Making Decisions",
  tagline: "Teach your code to choose",
  blocks: [
    {
      type: "prose",
      md: `So far every program has done the same thing on every run. Real programs *decide*: if the password matches, log in; otherwise, show an error.

Python's \`if\` reads like English:

\`\`\`python
if temperature > 30:
    print("It's hot!")
\`\`\`

Two pieces of syntax to notice: the condition ends with a **colon**, and the indented lines below it run **only when the condition is true**. That indentation isn't decoration — it's how Python knows which lines belong inside the \`if\`.

The comparison operators build conditions: \`==\` (equal), \`!=\` (not equal), \`<\`, \`>\`, \`<=\`, \`>=\`.`,
    },
    {
      type: "example",
      title: "if, elif, else",
      code: `temperature = 17

if temperature > 30:
    print("Hot! Find shade.")
elif temperature > 15:
    print("Perfect walking weather.")
else:
    print("Bring a jacket.")`,
      note: "Python checks each condition top to bottom and runs the FIRST match, then skips the rest. Try changing temperature to 35 or 5 and re-run. (elif is short for 'else if'.)",
    },
    {
      type: "prose",
      md: `Conditions can combine. Python spells its logic words out:

- \`and\` — both sides must be true
- \`or\` — at least one side must be true
- \`not\` — flips truth upside down

No cryptic symbols required: \`if age >= 18 and has_ticket:\` reads like the sentence it is.`,
    },
    {
      type: "example",
      title: "Combining conditions",
      code: `age = 25
has_ticket = True

if age >= 18 and has_ticket:
    print("Enjoy the show!")

if age < 13 or age >= 65:
    print("Discount applies")

if not has_ticket:
    print("You need a ticket!")`,
      note: "Read and as 'and also', or as 'or else'. The last block stays silent because has_ticket is True — exactly the point.",
    },
    {
      type: "prose",
      md: `One subtlety worth knowing early: in Python the values \`False\`, \`None\`, \`0\`, and empty things like \`""\` all count as *falsy* — everything else is truthy. So an empty string fails an \`if\`, which turns out to be very convenient.`,
    },
    {
      type: "exercise",
      id: "decisions-1",
      title: "The bouncer",
      prompt:
        'A club has rules: entry requires age 21 or more AND being on the guest list. Given `age` and `on_list`, print exactly one of:\n\n```\nWelcome in\n```\nor\n```\nSorry, not tonight\n```',
      starter: `age = 23
on_list = True

# One condition, two possible messages
`,
      check: { kind: "output", expect: "Welcome in" },
      hint: "Both requirements must hold together — that's a job for and.",
      solution: `age = 23
on_list = True

if age >= 21 and on_list:
    print("Welcome in")
else:
    print("Sorry, not tonight")`,
    },
    {
      type: "exercise",
      id: "decisions-2",
      title: "Grade assigner",
      prompt:
        'Given `score = 84`, print the letter grade: `A` for 90+, `B` for 80–89, `C` for 70–79, `D` for 60–69, `F` below that. Format:\n\n```\nScore 84 earns a B\n```\n\nAfter checking passes, try changing score to 95 and 12 to see each path work.',
      starter: `score = 84

# if / elif / elif / elif / else ...
`,
      check: { kind: "output", expect: "Score 84 earns a B" },
      hint: "Order matters: check the highest grade first (score >= 90), then walk down.",
      solution: `score = 84

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"Score {score} earns a {grade}")`,
    },
    {
      type: "exercise",
      id: "decisions-3",
      title: "FizzBuzz, the celebrity",
      prompt:
        "The most famous interview question of all time. For `n = 15`: if divisible by both 3 and 5 print `FizzBuzz`; if by 3 only print `Fizz`; if by 5 only print `Buzz`; otherwise print the number.\n\nWith n = 15 your program must print exactly:\n\n```\nFizzBuzz\n```\n\nTest your logic with n = 9 (`Fizz`) and n = 10 (`Buzz`) too before checking.",
      starter: `n = 15

# The classic.
`,
      check: { kind: "output", expect: "FizzBuzz" },
      hint: "Check divisibility with %: n % 3 == 0 means divisible by three. Check the BOTH case first!",
      solution: `n = 15

if n % 3 == 0 and n % 5 == 0:
    print("FizzBuzz")
elif n % 3 == 0:
    print("Fizz")
elif n % 5 == 0:
    print("Buzz")
else:
    print(n)`,
      successMessage:
        "If you got FizzBuzz working, you can genuinely pass some job interviews. No joke.",
    },
    {
      type: "prose",
      md: `Decisions let your program pick a path. But what about doing something a hundred times in a row? That needs loops — next chapter.`,
    },
  ],
};

export default chapter;
