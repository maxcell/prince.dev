---
title: 'Day 2 - Inventory Management System'
date: '2018-12-02'
slug: 'aoc-2018-day-2'
tags: ['Advent of Code']
---

Advent of Code has been a ton of fun. Trying these problems lets me find out cool
algorithms out there as well as write about different techniques one can use.
The biggest thing about it as well is avoiding the trap of over optimizations.
Sometimes a solution may not be computationly fast in realtime, but as far as
readability much better.

Let's take a look at Day Two - [Inventory Management System][1]!

## Part 1

The first part of our problem essentially is asking us to help
out and find the lost prototype fabric that helps Mr. Claus down
any sort of chimney. The problem is the warehouse is **ENORMOUS**.
Good thing we're a smarty-pants programmer and will solve this!

With this problem, we want to make sure we keep a count of the box ids that contain
either **exactly** two or **exactly** three of any letter appearing.
From there, we will take these two numbers and multiply them together for a checksum.
For this problem, it wants us to count it for both if it has an occurrence for two
of the same letter and an occurrence for three of another same set of letters.
So if we had the string `aabbbcde`, it would mean both the counts of two (since
`a` appears twice) and counts of three (since `b` appears thrice).

So they give us an example of how to parse a small list:

- `abcdef` contains no letters that appear exactly two or three times
- `bababc` contains two `a` and three `b`, so it counts for both
- `abbcde` contains two `b`, but no letters thrice
- `ababab` contains three `a` and three `b`, but only counts once

So if we were to translate this down to an algorithm:

1. We need to initialize some count of occurrences for two
   letters and another for count of occurrences for three letters
2. We iterate over our list and check each string for letter occurrences
3. As soon as it sees something that occurs twice or thrice, increment the count as appropriate
4. Repeat until the end of our list
5. Once finished with the list, we multiply the counts together

Not too shabby, let's see the first solution:

```js
function part1(input) {
  let numOfTwos = 0
  let numOfThrees = 0
  for (let i = 0; i < input.length; i++) {
    let occurrence = {}
    for (let j = 0; j < input[i].length; j++) {
      if (occurrence[input[i][j]] !== undefined) {
        occurrence[input[i][j]]++
      } else {
        occurrence[input[i][j]] = 1
      }
    }

    if (Object.values(occurrence).includes(2)) {
      numOfTwos++
    }
    if (Object.values(occurrence).includes(3)) {
      numOfThrees++
    }
  }
  return numOfTwos * numOfThrees
}
```

Which first time around is pretty rough to read. There are not
many algorithmic improvements we can make here. But we can
definitely improve the readability with a few ES6 goodies.

```js
function part1(inputs) {
  let numOfTwos = 0
  let numOfThrees = 0

  for (let currStr of inputs) {
    let occurrences = {}
    for (let currChar of currStr) {
      occurrences[currChar] = occurrences[currChar]
        ? ++occurrences[currChar]
        : 1
    }

    if (Object.values(occurrences).includes(2)) ++numOfTwos
    if (Object.values(occurrences).includes(3)) ++numOfThrees
  }

  return numOfThrees * numOfTwos
}
```

I will say that this is not necessarily faster in realtime computation. However,
tradeoffs can be made that we focus more about the readability of our code rather
than focusing on speediness. I'm down for it if you are!

### Part 2

This part of the problem wants us to go and find the resulting substring
of two strings with an one-character difference. This problem is slightly tricky
because we have to go through the list and check for each string against one another.

1. Start with the first word being our `str1`
2. Start with the second word being our `str2`
3. Iterate through the characters to see which match/overlap
   - If they match add them to a string keeping track of matches
4. Repeat until all strings have been checked against `str1`
5. Move starting `str1` and starting `str2` by one position and repeat 3 & 4 until the end of input

I am going to just show my initial solution which is rather redundant:

```js
function part2(input) {
  for (var i = 0; i < input.length; i++) {
    for (var j = i + 1; j < input.length; j++) {
      let subString = overlap(input[i], input[j])
      if (
        subString.length === input[i].length - 1 ||
        subString.length === input[j].length - 1
      ) {
        return subString
      }
    }
  }
}

function overlap(str1, str2) {
  var newString = ''
  for (var i = 0; i < str1.length; i++) {
    if (str1[i] == str2[i]) {
      newString += str1[i]
    }
  }

  return newString
}
```

You'll notice that in my `part2` function that I have places where I can avoid
repeating myself. As this was my initial solution, I also realized I am checking
both strings to verify its length and for this particular problem, I'd say we could
assume they are the same length, given our input. For the second time around,
I actually made a bit easier to follow solution:

```js
function part2(input) {
  for (var i = 0; i < input.length; i++) {
    for (var j = i + 1; j < input.length; j++) {
      let [hammingDistance, subString] = overlap(input[i], input[j])
      if (hammingDistance === 1) return subString
    }
  }
}

function overlap(str1, str2) {
  var subString = ''
  var hammingDistance = 0
  for (var i = 0; i < str1.length; i++) {
    if (str1[i] == str2[i]) {
      subString += str1[i]
    } else {
      ++hammingDistance
    }
  }

  return [hammingDistance, subString]
}
```

Now this was fun research I did. Turns out there is an algorithm for this particular
problem that I did by hand effectively already. Efficiently calcuating number of
substitutions between strings (replacement of characters) is known as the [Hamming Distance][2]
between two strings. With our new overlap, rather than recalculating the length of our string,
I'm taking advantage of just maintaining a count of the differences. Because of that,
when I use this method back in the rest of the algorithm it is easier to
read and compute. You might be wondering what that fancy pants array assignment
looking thing is, that's from ES6 known as [Destructuring Assignment][3]. It allows us
to break apart our array from `overlap` and assign it to a list of variables matching
values in position of the array. With that being done, we want to see where our count
of substitutions is equal to exactly 1, and then we have a match!

[1]: https://adventofcode.com/2018/day/2
[2]: https://en.wikipedia.org/wiki/Hamming_distance
[3]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
