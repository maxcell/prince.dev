---
title: 'Day 3 - No Matter How You Slice It'
date: '2018-12-03'
slug: 'aoc-2018-day-3'
tags: ['Advent of Code']
draft: true
---

This was probably the hardest problem I've had to work on since college. The problem
isn't so much "hard" as I'm very weak at graph/coordinate based problems. Things
that involve calculating anything spatial is my weakness, not only in programming
but also in general mathematics as well. So when I saw [Day 3][1]'s visual diagram,
I knew I was going to be in for severe challenge. So for this problem, we are given
a list of inputs that represent "claims" into a fabric that could be cuts for Santa's
suit. The example input they give:

```
#1 @ 1,3: 4x4
#2 @ 3,1: 4x4
#3 @ 5,5: 2x2
```

Results in this:

```
........
...2222.
...2222.
.11XX22.
.11XX22.
.111133.
.111133.
........
```

Where the `.` represents empty spaces, the numbers represent the elf's id who claims
this would be a great spot to cut in for Santa's suit, and `X` represents where
two or more claims overlap. Now this particular problem has a lot of complexities.

1. We have to be very good at making sure our data is parsed for each claim;
   It must be able to read the id, the distances from top and left and the width and height
   for each line.
2. It must be able to maintain a running count of all the crossed points in our claims

## Part 1

My first attack at this problem was extremely brute force. Being able to push out
code effectively I couldn't see anything easier in front of me. I would do what
many do, enumerate every point and keep a running note of these overlaps. The naive
algorithm:

1. Parse the input and generate a claim per iteration
2. Iterate through each point of the square
3. Generate a running list of points and their respective number of overlaps
4. Count up all the points who have 2 or more claims at that point

To go into parsing the input, I just wrote the parse logic separate from everything else:

```js
function parseInput(string) {
  // string example:
  // #1 @ 1,3: 4x4
  let parsedInput = string.split(' ')

  let id = parsedInput[0]
  let left = +parsedInput[2].split(',')[0]
  let top = +parsedInput[2].split(',')[1].slice(0, -1)

  let width = +parsedInput[3].split('x')[0]
  let height = +parsedInput[3].split('x')[1]
  return { id, left, top, width, height }
}
```

Then to make maintaining this information slightly easier for myself,
I decided to create a `Claim` class using ES5 syntax just because
I wanted slightly more practice in the older version:

```js
function Claim({ id, left, top, width, height}) {
    this.id = id
    this.left = left
    this.top = top
    this.width = width
    this.height = height
    this.coordinates = new Set()
  }
}
```

Now the solution is here!

```javascript
function part1(input) {
  let record = new Map()

  for (let n = 0; n < input.length; n++) {
    let newClaim = new Claim(parseInput(input[n]))

    for (let i = newClaim.left; i < newClaim.left + newClaim.width; i++) {
      for (let j = newClaim.top; j < newClaim.top + newClaim.height; j++) {
        newClaim.coordinates.add(`${i}x${j}`)
        if (!record.has(`${i}x${j}`)) {
          record.set(`${i}x${j}`, 1)
        } else {
          record.set(`${i}x${j}`, record.get(`${i}x${j}`) + 1)
        }
      }
    }
  }

  let count = 0
  for (let val of record.values()) {
    if (val >= 2) {
      count++
    }
  }
  return count
}
```

I have `record` exist to keep a running list of points as keys and the value being
the number of times it has been claimed. As we iterate through each claim, we add
each point to a running list of points for that particular claim so we can see
the number of times we have overlap. Then after we've done that, we go and see
the number of points that have two or more claims to them. Though the big question is,
was this the best we could do?

## Part 2

The second part of the problem actually was much easier than the first for me!
Though it is was **exceptionally** inefficient. It would take about 20-30 seconds
for me to get an answer.

```js
function part2(input) {
  let record = new Map()
  let someList = []

  for (let n = 0; n < input.length; n++) {
    let newClaim = new Claim(parseInput(input[n]))

    someList.push(newClaim)
    for (let i = newClaim.left; i < newClaim.left + newClaim.width; i++) {
      for (let j = newClaim.top; j < newClaim.top + newClaim.height; j++) {
        newClaim.coordinates.add(`${i}x${j}`)
        if (!record.has(`${i}x${j}`)) {
          record.set(`${i}x${j}`, 1)
        } else {
          record.set(`${i}x${j}`, record.get(`${i}x${j}`) + 1)
          someList.forEach(x => {
            if (x.coordinates.has(`${i}x${j}`)) {
              x.overLap = true
            }
          })
        }
      }
    }
  }

  return someList.find(x => x.overLap === false).id
}
```

With this approach, I ended up changing my algorithm. It is because I needed to
somehow maintain which points haven't had overlap and make sure to denote they
now do. With this flow, I also had to somehow keep a running list of all the claims
otherwise I would lose track of them after I created them. But I just added a simple
`overLap` flag to each claim. When I go test a claim for no overlap, I see if it
has no overlap with any other claims after it. This works but is \*very\*\*

After reflecting the next day, I thought of a different approach. I took advantage
of my definition and changed it around slightly. Now it will include the calculation of the
right and bottom point. The reason is because I went back to math! I went and drew out
the relationship between the rectangles and saw how could I actually make sure that
there is an overlap. Fortunately, we are working in a 2D plane so this becomes
a less dauting approach.

My `Claim` class changed like so:

```js{2,7-8,11-12,15-19}
const Claim = (function() {
  let all = []
  let newClaim = function({ id, left, top, width, height }) {
    this.id = id
    this.left = left
    this.top = top
    this.right = left + width
    this.bottom = top + height
    this.width = width
    this.height = height
    this.overLap = false
    all.push(this)
  }

  newClaim.all = function() {
    return all.slice()
  }

  return newClaim
})()
```

We will now be utilizing a closure for our `Claim` so we can maintain a running
list within the class. I also compute the `right` and `bottom` of the box so I know
each point

[1]: https://adventofcode.com/2018/day/3
