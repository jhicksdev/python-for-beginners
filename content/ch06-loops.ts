import type { Chapter } from "../shared/types";

const chapter: Chapter = {
  slug: "loops",
  number: 6,
  title: "Loops",
  tagline: "Repeat yourself without repeating yourself",
  blocks: [
    {
      type: "prose",
      md: `Computers never get bored — that's their superpower and ours to exploit. Need something done ten times? You write the instruction *once*.

Python's friendliest loop walks through a **range** of numbers:

\`\`\`python
for i in range(3):
    print("Echo!")
\`\`\`

\`range(3)\` produces 0, 1, 2 — three turns. The \`for\` line ends in a colon, and the indented block below is the loop body.`,
    },
    {
      type: "example",
      title: "for and range, with a counter",
      code: `for i in range(3):
    print("Echo!")

for i in range(5):
    print(f"Lap {i + 1}")`,
      note: "The loop variable i receives the counter starting at 0. Since humans count laps from 1, we add 1 for display.",
    },
    {
      type: "prose",
      md: `\`range\` is more flexible than it looks:

- \`range(5)\` — 0 up to (but not including) 5
- \`range(1, 6)\` — 1 through 5
- \`range(0, 10, 2)\` — even numbers: 0, 2, 4, 6, 8

And when you need to keep going until a condition flips, there's \`while\`:`,
    },
    {
      type: "example",
      title: "while counts down",
      code: `fuel = 3

while fuel > 0:
    print(f"T-{fuel}...")
    fuel = fuel - 1

print("Liftoff!")`,
      note: "The loop re-checks fuel > 0 before every pass. Forgetting to change fuel inside the loop means it never becomes False — the infamous infinite loop. (Our playground will stop you after a few seconds, so don't worry.)",
    },
    {
      type: "prose",
      md: `Two escape hatches for loops:

- \`break\` — leave the loop immediately.
- \`continue\` — skip to the next turn.

Also worth meeting early: \`+=\` shorthand. \`fuel -= 1\` means \`fuel = fuel - 1\`; \`count += 1\` adds one. Programmers are professionally lazy.`,
    },
    {
      type: "example",
      title: "break and continue",
      code: `for n in range(1, 11):
    if n % 2 == 0:
        continue
    if n > 7:
        break
    print(n)`,
      note: "continue jumps straight to the next turn (skipping evens); break leaves the loop entirely once n passes 7.",
    },
    {
      type: "exercise",
      id: "loops-1",
      title: "Countdown",
      prompt:
        "Print a launch countdown from **5 down to 1**, one number per line, then the word:\n\n```\n5\n4\n3\n2\n1\nLiftoff!\n```",
      starter: `# range can count down if you give it a negative step: range(5, ?, ?)
`,
      check: { kind: "output", expect: "5\n4\n3\n2\n1\nLiftoff!" },
      hint: "range(5, 0, -1) counts 5, 4, 3, 2, 1 — start at 5, stop before 0, step by -1.",
      solution: `for n in range(5, 0, -1):
    print(n)
print("Liftoff!")`,
    },
    {
      type: "exercise",
      id: "loops-2",
      title: "The sum of all fears",
      prompt:
        "Add up every whole number from 1 to 100 using a loop (no cheating with sum() yet!), then print:\n\n```\nThe total is 5050\n```",
      starter: `total = 0

# loop from 1 to 100, adding each number into total
# then print the sentence
`,
      check: { kind: "output", expect: "The total is 5050" },
      hint: "total += n inside the loop accumulates the sum. Start total at 0 before the loop.",
      solution: `total = 0

for n in range(1, 101):
    total += n

print(f"The total is {total}")`,
    },
    {
      type: "exercise",
      id: "loops-3",
      title: "Times table row",
      prompt:
        "Print the 7-times table from 1 through 5, in the format shown:\n\n```\n7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35\n```",
      starter: `# One loop does it
`,
      check: { kind: "output", expect: "7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35" },
      hint: 'Loop i through range(1, 6) and let an f-string build each line: f"7 x {i} = {7 * i}"',
      solution: `for i in range(1, 6):
    print(f"7 x {i} = {7 * i}")`,
    },
    {
      type: "prose",
      md: `Loops + decisions + variables already make you dangerous. Next chapter: lists — how to handle a *collection* of things without inventing fifty variable names.`,
    },
  ],
};

export default chapter;
