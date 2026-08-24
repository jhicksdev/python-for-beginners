import type { Chapter } from "../shared/types";

const chapter: Chapter = {
  slug: "capstone",
  number: 11,
  title: "Capstone: Pet Simulator",
  tagline: "Build it all, from scratch",
  blocks: [
    {
      type: "prose",
      md: `Time to prove what you know. In this chapter you'll build a small virtual pet — **one piece at a time**, each part leaning on an earlier chapter:

- classes and instance state *(chapter 10)*
- functions and defaults *(chapter 9)*
- decisions *(chapter 5)*
- loops and collections *(chapters 6–8)*
- f-strings everywhere

Read each task carefully. Build the smallest thing that works, run it, then extend. That rhythm *is* professional programming.`,
    },
    {
      type: "prose",
      md: `### Part 1 — The pet exists

Create a class \`EnergyPet\`:

- \`__init__(self, name)\` stores the name and starts \`self.energy\` at **5**
- \`play()\` costs 2 energy, \`feed()\` gains 2 energy
- \`status()\` returns \`"NAME the pet has ENERGY energy"\`

Build it so this script runs:`,
    },
    {
      type: "example",
      title: "Your target behavior",
      code: `# your EnergyPet class will make this work:

pixel = EnergyPet("Pixel")
print(pixel.status())
pixel.play()
pixel.play()
print(pixel.status())
pixel.feed()
print(pixel.status())`,
      note: "Expected output once Part 1 is done:\nPixel the pet has 5 energy\nPixel the pet has 3 energy\nPixel the pet has 5 energy",
    },
    {
      type: "exercise",
      id: "capstone-1",
      title: "Part 1: EnergyPet",
      prompt:
        "Write the `EnergyPet` class described above so the example script produces:\n\n```\nPixel the pet has 5 energy\nPixel the pet has 3 energy\nPixel the pet has 5 energy\n```",
      starter: `class EnergyPet:
    pass

pixel = EnergyPet("Pixel")
print(pixel.status())
pixel.play()
pixel.play()
print(pixel.status())
pixel.feed()
print(pixel.status())
`,
      check: {
        kind: "assert",
        checks: [
          { name: "name is readable", expr: 'EnergyPet("Bolt").name == "Bolt"' },
          { name: "fresh pets have 5 energy", expr: 'EnergyPet("X").status() == "X the pet has 5 energy"' },
          {
            name: "play costs exactly 2",
            expr: '(lambda p: (p.play(), p.status())[1])(EnergyPet("X")) == "X the pet has 3 energy"',
          },
          {
            name: "feed gains exactly 2",
            expr: '(lambda p: (p.feed(), p.status())[1])(EnergyPet("X")) == "X the pet has 7 energy"',
          },
        ],
        failHint:
          'status must match word-for-word: return f"{self.name} the pet has {self.energy} energy".',
      },
      hint: "__init__ stores self.name and self.energy = 5. play does self.energy -= 2, feed does self.energy += 2.",
      solution: `class EnergyPet:
    def __init__(self, name):
        self.name = name
        self.energy = 5

    def play(self, amount=2):
        self.energy -= amount

    def feed(self, amount=2):
        self.energy += amount

    def status(self):
        return f"{self.name} the pet has {self.energy} energy"

pixel = EnergyPet("Pixel")
print(pixel.status())
pixel.play()
pixel.play()
print(pixel.status())
pixel.feed()
print(pixel.status())`,
    },
    {
      type: "prose",
      md: `### Part 2 — Rules keep pets alive

Right now energy could go negative or sky-high. Real programs enforce boundaries:

- energy must stay between **0 and 10** no matter what
- add a \`happy()\` method returning \`True\` when energy is **7 or more**

Update \`play\`/\`feed\` to clamp after changing energy. Python gives you two handy built-ins: \`max(0, x)\` never goes below zero, and \`min(10, x)\` never exceeds ten — chain them.`,
    },
    {
      type: "exercise",
      id: "capstone-2",
      title: "Part 2: Boundaries & happiness",
      prompt:
        "Extend your class: energy clamps to the range 0..10, and `happy()` reports whether energy >= 7. Then verify with the script below:",
      starter: `class EnergyPet:
    pass

zoomies = EnergyPet("Zoomies")
for _ in range(5):
    zoomies.feed()
print(zoomies.energy)
for _ in range(5):
    zoomies.feed()
print(zoomies.energy)

for _ in range(8):
    zoomies.play()
print(zoomies.happy())

for _ in range(4):
    zoomies.feed()
print(zoomies.happy())
`,
      check: {
        kind: "output",
        expect: "10\n10\nFalse\nTrue",
      },
      hint: "After changing energy: self.energy = max(0, min(10, self.energy)). And happy returns self.energy >= 7.",
      solution: `class EnergyPet:
    def __init__(self, name):
        self.name = name
        self.energy = 5

    def play(self, amount=2):
        self.energy -= amount
        self.clamp()

    def feed(self, amount=2):
        self.energy += amount
        self.clamp()

    def happy(self):
        return self.energy >= 7

    def clamp(self):
        self.energy = max(0, min(10, self.energy))

zoomies = EnergyPet("Zoomies")
for _ in range(5):
    zoomies.feed()
print(zoomies.energy)
for _ in range(5):
    zoomies.feed()
print(zoomies.energy)

for _ in range(8):
    zoomies.play()
print(zoomies.happy())

for _ in range(4):
    zoomies.feed()
print(zoomies.happy())`,
      successMessage: "Clamped, guarded, and asking questions politely. This class is starting to feel real.",
    },
    {
      type: "prose",
      md: `### Part 3 — A day in the life

Now combine everything into one function. Define a standalone function \`simulate_day(pet)\` that:

1. takes a list of events, like \`["play", "feed", "play", "nap"]\`
2. applies each event to the pet — **naps add 1 energy**
3. collects a log line per event: \`"played (-2)"\`, \`"fed (+2)"\`, \`"napped (+1)"\`, or \`"huh? (0)"\` for anything else
4. returns the list of log lines`,
    },
    {
      type: "exercise",
      id: "capstone-3",
      title: "Part 3: simulate_day",
      prompt:
        "Define `simulate_day(pet)` as described. It should work like this:\n\n```\nevents = [\"play\", \"feed\", \"flying\", \"nap\"]\nlog = simulate_day(pet)\n# log == [\"played (-2)\", \"fed (+2)\", \"huh? (0)\", \"napped (+1)\"]\n```\n\nPrint the log lines joined with `, ` for the events above, then the pet's final status line.",
      starter: `class EnergyPet:
    # paste your finished Part 2 class here
    pass

def simulate_day(pet):
    pass

pet = EnergyPet("Pixel")
events = ["play", "feed", "flying", "nap"]
log = simulate_day(pet)
print(", ".join(log))
print(pet.status())
`,
      check: { kind: "output", expect: "played (-2), fed (+2), huh? (0), napped (+1)\nPixel the pet has 6 energy" },
      hint: "An if/elif/else chain shines here: if event == \"play\": ... elif ... else .... Collect strings into a result list and return it.",
      solution: `class EnergyPet:
    def __init__(self, name):
        self.name = name
        self.energy = 5

    def play(self, amount=2):
        self.energy = max(0, self.energy - amount)

    def feed(self, amount=2):
        self.energy = min(10, self.energy + amount)

    def nap(self):
        self.energy = min(10, self.energy + 1)

    def status(self):
        return f"{self.name} the pet has {self.energy} energy"

pet = EnergyPet("Pixel")

log = []
for event in ["play", "feed", "flying", "nap"]:
    if event == "play":
        pet.play()
        log.append("played (-2)")
    elif event == "feed":
        pet.feed()
        log.append("fed (+2)")
    elif event == "nap":
        pet.nap()
        log.append("napped (+1)")
    else:
        log.append("huh? (0)")

print(", ".join(log))
print(pet.status())`,
    },
    {
      type: "prose",
      md: `Hmm — notice something awkward in that solution? The event logic ended up *outside* \`simulate_day\`, which defeats the point of defining it. Classic moment in real development: spot the design smell, refactor.

**Better:** pass the events INTO the function and let \`simulate_day\` own the whole job:`,
    },
    {
      type: "example",
      title: "The refactored shape",
      code: `def simulate_day(pet, events):
    log = []

    for event in events:
        if event == "play":
            pet.play()
            log.append("played (-2)")
        elif event == "feed":
            pet.feed()
            log.append("fed (+2)")
        elif event == "nap":
            pet.nap()
            log.append("napped (+1)")
        else:
            log.append("huh? (0)")

    return log`,
      note: "The function now takes a pet plus a plan — reusable with ANY pet and ANY day.",
    },
    {
      type: "exercise",
      id: "capstone-4",
      title: "Part 4: The full simulator",
      prompt:
        "Rewrite `simulate_day(pet, events)` properly (events passed in, logic inside). Then run TWO days and print everything:\n\nDay one for Pixel: `[\"play\", \"feed\", \"flying\", \"nap\"]` — print its log joined by `, `.\nDay two for Pixel: `[\"nap\", \"nap\", \"play\"]` — same format.\nFinish with Pixel's final status.",
      starter: `class EnergyPet:
    # your Part 2 class
    pass

def simulate_day(pet, events):
    pass

pixel = EnergyPet("Pixel")

day_one = ["play", "feed", "flying", "nap"]
day_two = ["nap", "nap", "play"]

# print both logs and the final status
`,
      check: {
        kind: "output",
        expect:
          "played (-2), fed (+2), huh? (0), napped (+1)\nnapped (+1), napped (+1), played (-2)\nPixel the pet has 6 energy",
      },
      hint: 'Two calls: print(", ".join(simulate_day(pixel, day_one))) etc. Track the math by hand first — 5 → play 3 → feed 5 → huh 5 → nap 6 → then naps push to 8 → play lands on 6.',
      solution: `class EnergyPet:
    def __init__(self, name):
        self.name = name
        self.energy = 5

    def play(self, amount=2):
        self.energy = max(0, self.energy - amount)

    def feed(self, amount=2):
        self.energy = min(10, self.energy + amount)

    def nap(self):
        self.energy = min(10, self.energy + 1)

    def status(self):
        return f"{self.name} the pet has {self.energy} energy"

def simulate_day(pet, events):
    log = []

    for event in events:
        if event == "play":
            pet.play()
            log.append("played (-2)")
        elif event == "feed":
            pet.feed()
            log.append("fed (+2)")
        elif event == "nap":
            pet.nap()
            log.append("napped (+1)")
        else:
            log.append("huh? (0)")

    return log

pixel = EnergyPet("Pixel")

day_one = ["play", "feed", "flying", "nap"]
day_two = ["nap", "nap", "play"]

print(", ".join(simulate_day(pixel, day_one)))
print(", ".join(simulate_day(pixel, day_two)))
print(pixel.status())`,
      successMessage:
        "You built a working simulation with classes, functions, decisions, loops, lists, dictionaries, and f-strings. Every single chapter, in one program.",
    },
    {
      type: "prose",
      md: `## You made it

Take a breath and look back: eleven chapters ago, printing one line felt novel. Now you design classes, enforce rules, and refactor your own designs.

**Where to go next:**

- Install real Python locally (\`python --version\`) and run your files from the terminal.
- Read *Automate the Boring Stuff with Python* (free online) or the official tutorial at python.org — both famously friendly.
- Try building tiny CLI tools: a quiz game, a budget tracker, a text adventure.
- When you're ready for the web: Flask first (tiny), Django later (huge).
- Curious about data? The \`pandas\` library turns everything you learned here into superpowers.

Happy hacking — and remember: \`print("Hello!")\` is always one line away.`,
    },
  ],
};

export default chapter;
