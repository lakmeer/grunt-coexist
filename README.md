grunt-coexist
=============

Compile all your JS together regardless of source language

Use
---

Basically used like grunt-coffee or grunt-lsc, except doesn't care what source
language your files are in - they all comingle happily to produce one JS file.

Current supports Cofeescript and Livescript. Feel free to add whatever thing
you need.


Todo
----

Ideally, it'd be nice to be able to specify which language modules you want to
use for which file extensions. Currently, `cs` and `coffee` get processed by
Coffee and `ls` gets processed by Livescript, but these are hardcoded and are
both annoying dependacies to have. It'd be nice to only have the languages you
actually intend to use, and add new ones easily when you need them.
