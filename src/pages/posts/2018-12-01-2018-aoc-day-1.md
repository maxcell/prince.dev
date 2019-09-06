---
title: "Day 1 - Chronal Calibration"
date: "2018-12-01"
tags: ["Advent of Code"]
---

I genuinely love the end of the year and that's because every December marks a 
new series of problems for the website [Advent of Code][1]. If you have never
participated, a short synopsis is that every day up until Christmas (December 25th),
a set of new problems are published for programmers to solve. They progressively 
get more challenging each day. They are fun and holiday-themed programming puzzles.

Let's talk about the first day's problems in [Chronal Calibration][2]!

## Part 1
The first part of the problem asks us to calculate the final frequency after 
given a series of frequency changes. They will have frequency displayed such as
`+3` which increases the current frequency by `3` or `-1` which decreases the
current frequency by `1`. The problem begins with a frequency of 0 and then 
provides an example of changes:

```
+1, -2, +3, +1
```

This would translate to these transformations:

- We start with `0`, a change of `+1`; resulting frequency `1`.
- Current frequency `1`, change of `-2`; resulting frequency `-1`.
- Current frequency `-1`, change of `+3`; resulting frequency `+2`.
- Current frequency `2`, change of `+1`; resulting frequency `+3`.

This means that the final resulting frequency is `3`.

If we were to break this down to an algorithm:

1. Start with a current frequency of `0`
2. Add the change of frequency to our current frequency
3. Repeat step 2 till the end of input
4. Return the result

Now this problem doesn't sound too bad to do and can be done a multitude of ways.
I will show a naive solution and then show another solution that takes advantage
of alternative tools.

```js
// You make need to ingest your input in various 
// ways but let's assume it is available as an array of changes
// Example: input -> ['+1', '-2', '+3', '+1']
function part1(input){
  let result = 0;
  for(let i = 0; i < input.length; i++){
    let currentVal = parseInt(input[i])
    result += currentVal
  }

  return result
}
```

Each participant will have a different result given their input. However, this
matches our algorithm! You'll notice for my solution, I chose to use `parseInt`,
that's because all of the elements in `input` are strings but can be converted
to a number. If I don't do the step of converting it into a number, JavaScript
will try to concatenate strings (and we don't want that).

Now this is very simple solution but we can utilize another tool that makes it 
a bit more eloquent. This will utilize the `reduce` function.

```js
function part1(input){
  return input.reduce((accumulator, currentVal) => {
    return accumulator + parseInt(currentVal)
  }, 0)
}
```

`reduce` is a powerful higher order function that allows us to describe
what should happen to our array as it iterates over each element. You'll notice
that I am using the `accumulator` variable, that is going to keep track of
the sum as the function iterates. `reduce` takes in two parameters, a callback
function and an optional initial value. The reason why we want to do this
for our problem is that we need to make sure we start with an integer `0`. If 
we were to omit this, it would say the first element is the initial value which
might concate all of the strings together.

That's all for part 1! Let's see how they change up the problem for part 2. The
input will be exactly the same but the problem will be slightly different than
before.

## Part 2
The problem now is saying we need to notice a repetition of frequencies. We need
to see which is the first resulting frequency that repeats throughout the sequence.
They also mention that you may have to go through the sequence a few times. This
will mean we need to make sure we go back to the beginning of our list after we
hit the end.

Let's say we used the same list as the example before, now we'd have to look at
our problem like this:

- We start with `0`, a change of `+1`; resulting frequency `1`.
- Current frequency `1`, change of `-2`; resulting frequency `-1`.
- Current frequency `-1`, change of `+3`; resulting frequency `+2`.
- Current frequency `2`, change of `+1`; resulting frequency `+3`.
- (At this point, the device continues from the start of the list)
- Current frequnecy `3`, change of `+1`; resulting frequency `+4`.
- Current frequency `4`, change of `-2`; resulting frequency `+2`,
which has already been seen.

Now our result is supposed to be `2`.

Let's see how the algorithm has changed:

1. Start with a current frequency of `0`
2. Start an empty list of resulting frequencies
3. Check if our current frequency exists in our list
  - If it does, immediately break out of our loop and return the value
  - If it doesnt, add it to our list
4. Add the change of frequency to our current frequency
5. Repeat steps 3 and 4 over the inputs

Let's start with our initial solution!

```js
// Same input as before
function part2(input){
  let result = 0
  let frequencies = []
  while(true){
    for(let i = 0; i < input.length; i++){
      if(frequencies.includes(result)){
         return result
      } else {
        frequencies.push(result)
      }

    result += parseInt(markup[i])
    }
  }
}
```

Honestly, this was my first solution. It has quite a bit
of optimizations that we can make to it. For instance, the two loops
are not necessary. We can change the running condition for our for loop
so it moves better and is a bit more readable. To someone else, it might
not be clear why we had a while loop running till `true`. Another optimization
in this case would be taking advantage of a `Set`. In most languages, a [lookup
in a Set][4] would be an `O(1)` in average case rather than an array's `include()` 
which iterates over the entire list no matter what. Also a TIL, `parseInt` is 
[slooooooow][3], let's change it to `+str` or `Number()`.

Let's take a look at the changed solution here:
```js
function part2(input){
  let result = 0;
  let frequencies = new Set()
  for(let i = 0; !frequencies.has(result); i = (i+1) % input.length){
    frequencies.add(result)
    result += (+input[i]) // could be result += Number(input[i]) and be just as fast
  }
  
  return result
}
```

If you were to compare these two solutions, there would be almost a 50% increase
of speed due to the optimizations we made. This is why using different data
structures can be super valuable.


And that's it! Welcome to a writeup for the first day. I hope that you share your
solutions with me and let me know what you come up with. I'd love to see any
language and any other thoughts you might have about my work.


[1]: https://adventofcode.com/2018
[2]: https://adventofcode.com/2018/day/1
[3]: http://phrogz.net/js/string_to_number.html
[4]: http://bigocheatsheet.com/