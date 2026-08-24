import type { Chapter } from "../shared/types";

const chapter: Chapter = {
  slug: "lists",
  number: 7,
  title: "Lists",
  tagline: "Collections of things, tamed",
  blocks: [
    {
      type: "prose",
      md: `A **list** is an ordered collection of values in a single variable. Square brackets, commas between items:

\`\`\`python
planets = ["Mercury", "Venus", "Earth", "Mars"]
\`\`\`

Each item sits at a numbered position called an **index**, and here's the big one: **counting starts at 0**. The first item is \`planets[0]\`, the second is \`planets[1]\`. Every programmer has been burned by this. You'll get used to it faster than we did.`,
    },
    {
      type: "example",
      title: "Indexes and negative indexes",
      code: `planets = ["Mercury", "Venus", "Earth", "Mars"]

print(planets[0])
print(planets[2])
print(planets[-1])

print(len(planets))
print(planets[0])
print(planets[-1])`,
      note: "Negative indexes count from the end; [-1] is the last item. len() counts items (4, not 3!).",
    },
    {
      type: "prose",
      md: `Lists grow and shrink at will:

- \`.append(item)\` adds to the end
- \`.pop()\` removes and returns the last item
- \`.remove(item)\` removes a specific item
- \`item in my_list\` asks if something's in there

And lists loop beautifully with \`for\`, no index bookkeeping needed.`,
    },
    {
      type: "example",
      title: "Growing and looping",
      code: `todo = ["learn lists"]
todo.append("loop over them")
todo.append("feel powerful")

for task in todo:
    print(f"- {task}")

print(f"{len(todo)} things to do")`,
      note: "for hands you one item per pass. This pattern, loop over a collection and do something with each item, is half of all programming.",
    },
    {
      type: "prose",
      md: `Quick answers about a whole list:

- \`sum(numbers)\`, \`max(numbers)\`, \`min(numbers)\`, \`sorted(numbers)\`
- \`.count(item)\`: how many times does it appear?

One more tool you'll need constantly: **\`.join\`** stitches list items into ONE string. It's a string method that takes the list, and everything must be text first:

\`\`\`python
words = ["code", "sleep", "repeat"]
print(", ".join(words))        # code, sleep, repeat
\`\`\`

For a list of numbers, turn each into a string on the fly: \`", ".join(str(n) for n in numbers)\`. Read it as "join these, making each n a string."`,
    },
    {
      type: "example",
      title: "sum, sorted, join",
      code: `numbers = [4, 8, 15, 16, 23, 42]

print(sum(numbers))
print(max(numbers))
print(sorted(numbers))
print(", ".join(str(n) for n in numbers))

words = ["python", "sparkles", "brightly"]
print(" ".join(words))`,
      note: "sorted() hands back a NEW list arranged low to high; your original stays untouched.",
    },
    {
      type: "exercise",
      id: "lists-1",
      title: "Queue check",
      prompt:
        'Given `line = ["Ana", "Bo", "Cy"]`, print exactly:\n\n```\nFirst: Ana\nLast: Cy\nWaiting: 3\n```',
      starter: `line = ["Ana", "Bo", "Cy"]

`,
      check: { kind: "output", expect: "First: Ana\nLast: Cy\nWaiting: 3" },
      hint: "Three print lines with f-strings: line[0], line[-1], len(line).",
      solution: `line = ["Ana", "Bo", "Cy"]

print(f"First: {line[0]}")
print(f"Last: {line[-1]}")
print(f"Waiting: {len(line)}")`,
    },
    {
      type: "exercise",
      id: "lists-2",
      title: "Grocery run",
      prompt:
        "Start with `basket = [\"eggs\"]`. Add `\"milk\"` and `\"bread\"`, then remove `\"eggs\"` (it got squashed). Print the remaining items one per line:\n\n```\nmilk\nbread\n```",
      starter: `basket = ["eggs"]

# add milk and bread, deal with the eggs
`,
      check: { kind: "output", expect: "milk\nbread" },
      hint: ".append adds to the end; .remove(\"eggs\") takes eggs back out wherever it sits.",
      solution: `basket = ["eggs"]
basket.append("milk")
basket.append("bread")
basket.remove("eggs")

for item in basket:
    print(item)`,
    },
    {
      type: "exercise",
      id: "lists-3",
      title: "Number cruncher",
      prompt:
        "Given the scores below, print:\n\n```\nTotal: 405\nBest: 91\nPassing: 88, 91, 80, 91\nSorted low to high: 55, 80, 88, 91, 91\n```",
      starter: `scores = [88, 55, 91, 80, 91]

# sum, max, filter with if inside join, sorted
`,
      check: {
        kind: "output",
        expect: "Total: 405\nBest: 91\nPassing: 88, 91, 80, 91\nSorted low to high: 55, 80, 88, 91, 91",
      },
      hint: 'Passing needs ", ".join(str(s) for s in scores if s > 70); an if can ride along inside the join. Sorting ascending is plain sorted(scores).',
      solution: `scores = [88, 55, 91, 80, 91]

print(f"Total: {sum(scores)}")
print(f"Best: {max(scores)}")
print(f'Passing: {", ".join(str(s) for s in scores if s > 70)}')
print(f'Sorted low to high: {", ".join(str(s) for s in sorted(scores))}')`,
    },
    {
      type: "prose",
      md: `Lists handle *ordered collections of things*. But often you want to attach labels to values, a name paired with an age, a word paired with a definition. That's a job for dictionaries, next chapter.`,
    },
  ],
};

export default chapter;
