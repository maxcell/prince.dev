---
title: "Learning from your Errors"
date: "2017-09-03"
tags: ["debugging"]
---

No matter who you are, you are going to make mistakes. Everyone can make a mistake, if not
a butt ton (scientific measurement)! It is part of the learning experience. It doesn't always feel the best of course.
As long as you forgive yourself and get back up, it doesn't matter how many times you fall down. It still is a win.

It is easy to start learning something new and really only focus on your mistakes. 
Errors for developers are actually very good! Let's look at when your code doesn't execute properly. 
You'll get a message back that will shoot out a lot of information. 
The reason is because developers before you wanted to help you spot it rather than just randomly starting in places.

Let's say you were starting with this small example:

```ruby
# app.rb

def print_name(name)
  prints name
end

print_name
```

If you try to execute this, the Ruby programming language is nice and sends you an **error message** back:

```bash
app.rb:3:in `print_name': wrong number of arguments (given 0, expected 1) (ArgumentError)
	from app.rb:7:in `<main>'
```

This is known as a stack trace. Whenever your code gets read and comes across an error in the execution, this
gets sent back in the Terminal. It dictates how did you stumble to get to this error, what calls had to be
made in order for you to (potentially) run. Unlike many programming languages, Ruby does its best to give you as much
information as possible to get you on your way to fixing the code. From the bottom-up, it is saying how you got here:

- "You called print_name on line 7 but this caused an error."
- "If you look on line 3, we defined the method `print_name` to take an argument, you gave it 0
arguments but it wanted 1."

Well that hints pretty well! Try to change that last line to accept an argument of your name:

```ruby
# app.rb

def print_name(name)
  prints name
end

print_name("Prince")
```

When your program runs again...

```bash
app.rb:4:in `print_name': undefined method `prints' for main:Object (NoMethodError)
Did you mean?  print
               printf
               print_name
               sprintf
	from app.rb:7:in `<main>'
```

Gah &#8212; another error. Though once again Ruby is really nice at guiding you on fixing it. It notices
there isn't a method called `prints` (you see this from the far right by the `NoMethodError`). And Ruby
actually tries to give you many relevant, possible suggestions that it has available. Ruby considers what
data type is it currently looking at and what methods does it normally see being used with it by the similar
function by that name. If you were to change `prints` to `print`:

```ruby
# app.rb

def print_name(name)
  print name
end

print_name("Prince")
```

It should now finally read:

```ruby
Prince
```

Reading a stack trace can seem daunting at first, but can really help you understand what is happening in your program.
Being able to do this makes it easier for you to identify potential places you can also make improvements.
These types of errors can be identified quicker than most. It is the errors where Ruby doesn't give you
your expected value that are the harder ones to solve and take a lot more thinking from the developer. We 
call these logical errors. These are errors where the code is written to execute fine, but the error is logically
not correct because the value/data you get back isn't what you want. In my next blog post, we'll talk about 
strategies for debugging!