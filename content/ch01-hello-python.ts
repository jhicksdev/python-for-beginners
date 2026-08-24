import type { Chapter } from "../shared/types";

const chapter: Chapter = {
  slug: "hello-python",
  number: 1,
  title: "Hello, Python!",
  tagline: "Say hello and make your computer talk back",
  blocks: [
    {
      type: "prose",
      md: `Welcome aboard! You're about to learn **Python**, a programming language famous for reading almost like English. It's one of the most popular languages in the world — used by beginners, scientists, and the biggest companies on the planet.

Every program you'll ever write boils down to giving the computer instructions. Let's start with the most famous instruction of all: printing something on the screen.`,
    },
    {
      type: "example",
      title: "Your very first line of Python",
      code: `print("Hello, World!")`,
      note: 'Click Run and watch what happens. `print` tells Python to show something on the screen, then move to a new line. The quotes turn `Hello, World!` into a *string* — a piece of text.',
    },
    {
      type: "prose",
      md: `That's it — you just ran real code! A few things worth noticing:

- \`print\` is the instruction that prints whatever is inside its parentheses.
- The quotation marks matter. They tell Python "this is text, not an instruction."
- Every line is an instruction. Python reads your file top to bottom and does each thing in order.

Try adding more lines below — Python will obey them all, in order.`,
    },
    {
      type: "example",
      title: "Python obeys in order",
      code: `print("First")
print("Second")
print("Third")`,
      note: "Change the words, add lines, experiment. Nothing you do here can break anything.",
    },
    {
      type: "prose",
      md: `One last trick for this chapter: comments. A comment is a note *for humans* that Python completely ignores. Start a line with the \`#\` symbol and Python skips right past it.

Programmers use comments to explain *why* code exists. Future-you will thank present-you.`,
    },
    {
      type: "example",
      title: "Comments are for humans",
      code: `# This line is ignored by Python
print("But this one runs!")

print("Comments can also sit at the end of a line") # like this`,
      note: "The # only comments out the rest of ITS line. Everything else still runs.",
    },
    {
      type: "exercise",
      id: "hello-1",
      title: "Introduce yourself",
      prompt:
        'Use `print` to print a friendly greeting that includes your name. For example, if your name is Sam, your program should print exactly:\n\n```\nHello, I am Sam!\n```',
      starter: `# Introduce yourself below!
`,
      check: { kind: "output", expect: "^Hello, I am .+!$", mode: "regex", displayExpect: "Hello, I am Sam!" },
      hint: "Start with print(\"Hello, I am ...\" and don't forget the closing quote and parenthesis!",
      solution: `print("Hello, I am Sam!")`,
      successMessage: "You're officially a Python programmer. Onward!",
    },
    {
      type: "exercise",
      id: "hello-2",
      title: "Three cheers",
      prompt:
        "Print these three lines, in exactly this order:\n\n```\nHip hip!\nHip hip!\nHooray!\n```",
      starter: `# Print three lines
`,
      check: { kind: "output", expect: "Hip hip!\nHip hip!\nHooray!" },
      hint: "Call print three times, once per line.",
      solution: `print("Hip hip!")
print("Hip hip!")
print("Hooray!")`,
    },
    {
      type: "exercise",
      id: "hello-3",
      title: "Comment out the bug",
      prompt:
        "This program has a line that would crash it. Comment that line out (put a `#` in front of it) so only the good output prints.\n\nKeep the working line exactly as it is — it should print `Everything is fine.`",
      starter: `print("Everything is fine.")
pritn("This line is broken on purpose")`,
      check: { kind: "output", expect: "Everything is fine." },
      hint: "Put # at the very start of the broken line. (Yes, pritn was a typo — typos are the #1 beginner bug, so now you know what one looks like.)",
      solution: `print("Everything is fine.")
# pritn("This line is broken on purpose")`,
    },
    {
      type: "prose",
      md: `You've learned how every Python program starts: instructions, one per line, executed top to bottom — plus comments to leave notes for humans.

Next up: variables, the way programs remember things.`,
    },
  ],
};

export default chapter;
