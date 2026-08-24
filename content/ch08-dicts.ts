import type { Chapter } from "../shared/types";

const chapter: Chapter = {
  slug: "dicts",
  number: 8,
  title: "Dictionaries",
  tagline: "Labels on everything",
  blocks: [
    {
      type: "prose",
      md: `Lists answer "what's at position 3?" Dictionaries answer a better question: "**what's the value for this key?**"

A dictionary pairs keys with values, like an actual dictionary pairs words with definitions:

\`\`\`python
capitals = {"Japan": "Tokyo", "France": "Paris"}
print(capitals["Japan"])
\`\`\`

Keys are usually strings, values can be anything. One rule: each key appears once.`,
    },
    {
      type: "example",
      title: "Keys and values",
      code: `character = {"name": "Luna", "species": "cat", "lives": 9}

print(character["name"])
print(character["species"])
print(character["lives"])

print(len(character))
print(character.keys())`,
      note: "len() counts PAIRS (3). .keys() shows what labels exist; dicts remember the order you put them in.",
    },
    {
      type: "prose",
      md: `Working with dictionaries:

- Read with \`d[key]\`, but a **missing key raises an error** (a \`KeyError\`), unlike some languages that quietly hand back nothing.
- Safer reads use \`.get(key)\`, which gives back \`None\` instead of exploding, or \`.get(key, fallback)\` to choose your own default.
- Write with \`d[key] = value\`; this adds or overwrites.
- \`key in d\` asks whether a key exists.
- Looping hands you each **pair**:`,
    },
    {
      type: "example",
      title: "Updating and looping",
      code: `inventory = {"rope": 1, "torch": 3}

inventory["rope"] = 2
inventory["map"] = 1

if "sword" in inventory:
    print("Armed!")
else:
    print("Unarmed. Careful.")

for item, count in inventory.items():
    print(f"{count} x {item}")`,
      note: ".items() yields key AND value into two loop variables. Very tidy.",
    },
    {
      type: "prose",
      md: `Dictionaries can hold *anything* as values, including lists, numbers, even other dictionaries. That's how real programs describe rich things like users, songs, or game characters.

One more treat: \`.get("key", fallback)\` in action: read a key but supply a default when it's missing:`,
    },
    {
      type: "example",
      title: "Nested treasure",
      code: `hero = {
    "name": "Ada",
    "stats": {"hp": 30, "mp": 12},
    "gear": ["sword", "lantern"],
}

print(hero["stats"]["hp"])
print(hero["gear"][-1])
print(hero.get("gold", 0))
print(hero.get("name", "???"))`,
      note: "Chain lookups through nested structures: ['stats']['hp']. get('gold', 0) returns 0 because there's no gold key.",
    },
    {
      type: "exercise",
      id: "dicts-1",
      title: "ID card",
      prompt:
        'Create a dict called `person` with keys `name` ("Rae"), `city` ("Oslo"), and `age` (29). Print exactly:\n\n```\nRae, age 29\nBased in Oslo\n```',
      starter: `# build person, then print the two lines
`,
      check: {
        kind: "assert",
        checks: [
          { name: "person is a dict", expr: "isinstance(person, dict)" },
          { name: 'person has "name"', expr: 'person.get("name") == "Rae"' },
          { name: 'person has "city"', expr: 'person.get("city") == "Oslo"' },
          { name: 'person has "age"', expr: 'person.get("age") == 29' },
        ],
        failHint: 'Syntax reminder: person = {"name": "Rae", "city": "Oslo", "age": 29}',
      },
      hint: 'Build the dict first, then print(f"{person[\'name\']}, age {person[\'age\']}") and friends.',
      solution: `person = {"name": "Rae", "city": "Oslo", "age": 29}

print(f"{person['name']}, age {person['age']}")
print(f"Based in {person['city']}")`,
    },
    {
      type: "exercise",
      id: "dicts-2",
      title: "Scoreboard",
      prompt:
        "Start from the given scores dict. Mira just scored 15 more points. Then print every player and score in the format below:\n\n```\nMira: 40\nJuno: 33\nSol: 21\n```",
      starter: `scores = {"mira": 25, "juno": 33, "sol": 21}

# give Mira +15, then loop and print "Name: score"
`,
      check: { kind: "output", expect: "Mira: 40\nJuno: 33\nSol: 21" },
      hint: 'scores["mira"] += 15 updates one player. The items() loop gives name, points; capitalize() tidies the display name.',
      solution: `scores = {"mira": 25, "juno": 33, "sol": 21}

scores["mira"] += 15

for name, points in scores.items():
    print(f"{name.capitalize()}: {points}")`,
    },
    {
      type: "exercise",
      id: "dicts-3",
      title: "Word counter",
      prompt:
        "Count how many times each word appears in the list, printing words in their first-seen order:\n\n```\nroses: 1\nare: 2\nred: 2\nviolets: 1\nblue: 1\n```",
      starter: `words = ["roses", "are", "red", "violets", "are", "blue", "red"]

counts = {}

# loop the words; for each one add 1 to its count (starting from 0)
# then print "word: count" lines
`,
      check: { kind: "output", expect: "roses: 1\nare: 2\nred: 2\nviolets: 1\nblue: 1" },
      hint: "counts[word] explodes on words it hasn't seen yet! Use counts.get(word, 0) + 1 so unseen words start from zero.",
      solution: `words = ["roses", "are", "red", "violets", "are", "blue", "red"]

counts = {}
for word in words:
    counts[word] = counts.get(word, 0) + 1

for word, count in counts.items():
    print(f"{word}: {count}")`,
      successMessage:
        "You just built a frequency counter, the heart of word clouds, analytics, and spam filters.",
    },
    {
      type: "prose",
      md: `You now hold both great collections: lists for ordered data, dictionaries for labelled data.

But here's the question good programmers always ask: *can I wrap this pattern up and reuse it?* That's functions, next chapter.`,
    },
  ],
};

export default chapter;
