# Log

**Table of Contents**

- [Overview](#overview)
- [Logging Basics](#logging-basics)
- [msgFn() Callbacks](#msgFn-callbacks)
- [Object Detail](#object-detail)
- [Filters](#filters)
  - [Filter Configuration](#filter-configuration)
  - [Filter Hierarchy](#filter-hierarchy)
  - [Error Vetos](#error-vetos)
- [Probe Formatting](#probe-formatting)
- [Configuration](#configuration)




## Overview

Log is a lightweight JavaScript logging utility that promotes
filterable logging probes, similar to a number of frameworks such
as Log4J.

By default, Log is a thin layer on top of console.log(), but is
configurable (??? TODO).

Log is an isomorphic JavaScript utility, which means it will
operate BOTH in browser/node environments.



## Logging Basics

Logging probes are emitted using instances of the Log class.  Each
Log instance (e.g. log) is associated to a filter, via the Log
constructor parameter (more on filtering later).

```javascript
  const log = new Log('MyLogFilter');
```

Log levels define the severity of a probe.  By default the
following levels exist (in order of severity).

```javascript
  Log.TRACE
  Log.DEBUG
  Log.INFO
  Log.WARN
  Log.ERROR
  Log.FATAL
```

NOTE: Additional log levels may be created through configuration.

A log emits a probe at a designated severity level.  The probe is
conditionally emitted, depending on the filter setting (again, more
on this later).

```javascript
 log.debug(()=>`some complex ${probe} with bunches of ${overhead}`);
```



## msgFn() Callbacks

As you can see from above, logging probes are based on functional
callbacks.  Notice that the ES6 arrow functions are used.

The reason behind this is to minimize the overhead in message
construction when the probe is going to be thrown on the floor
(through the filtering process).  By wrapping this process in a
function, the message construction overhead is only incurred once
we determine that the probe is in fact going to be emitted.

This means that there is virtually NO overhead in leaving
diagnostic level probes in production code.

With the advent of the ES6 arrow functions, this callback function
is very much streamlined (see example above).


## Object Detail

In addition to the message defined from the msgFn() callback, an
object can be optionally passed to the logging directive, which
will be formatted and appended to the message probe.

This can be any type of object, including Error instances (which are
appropriately formatted).

```javascript
 log.error(()=>'An unexpected condition occurred.', err);
```



## Filters

Each Log instance (e.g. log) is associated to a filter (via the Log
constructor parameter), and is dynamically created when first seen.
Multiple Log instances may reference the same filter.  In this case
the log merely attaches itself to the existing filter.

Filters have a level setting, which is a high-water mark, above which
probes are either emitted, or thrown on the floor.

A log emits a probe at a designated level (INFO, ERROR, DEBUG, etc.).
This level is compared to the filter level setting to determine if the
probe is to be emitted.

Here is a simple example:

```javascript
   module1.js
   ==========
   import Log from './util/Log';

   const log = new Log('EntryExit');
   ... 
   log.info(()=>'Enter processing.');
   ... 

   module2.js
   ==========
   import Log from './util/Log';

   const log = new Log('EntryExit');
   ... 
   log.info(()=>'Exit processing.');
   ... 
```

Notice that module1 and module2 share the same filter.

Filter names are completely up to you.  You may choose to use a number
of different strategies.




### Filter Configuration

Filters are configured through the Log.configure() method.  You merely
specify a series of filterName/level settings.  These settings may be
sparsely populated, as it merely applies the settings to the master
filter.

```javascript
  Log.config({
    filter {
      'root':      Log.INFO, // special root of all filters - pre-defined by Log (merely define level here)
      'EntryExit': Log.INFO,
      'Courses':   Log.DEBUG,
      'Students':  Log.WARN,
      ... etc
    }
  });
```

Notice that Log pre-defines a 'root' filter, which is referenced when
a given filter has not been set.  This 'root' will always be defined
(either through Log, or a client configuration), and cannot be un-set
(null/undefined).



### Filter Hierarchy

You may choose to introduce a hierarchy in your filter names.  

Filter hierarchies provide more fine-grained control over the
filtering process.  When defined, a hierarchy allows a child filter to
reference it's parent, when the child setting is not defined.

We have actually seen this already through the pre-defined 'root'
filter (the root parent of ALL filters).

Filter hierarchies are very easy to implement.  The filter string name
merely contains the hierarchy delimited with a period (".")
character.  As an example:

```javascript
  Log.config({
    filter {
      'root': Log.INFO, // special root of all filters - pre-defined by Log (merely define level here)

      'entryExit.mongo':          Log.INFO,
      'entryExit.mongo.setup':    null,
      'entryExit.mongo.teardown': Log.DEBUG,
    }
  });
```

This example defines a three-tier filter hierarchy.  Because
'entryExit.mongo.setup' has NO level defined, it's parent
('entryExit.mongo') will be referenced to determine the active
setting.

This allows you to turn on a broad category of probes, by simply
adjusting a parent level filter.

Filter hierarchies introduce the concept of a filter being "unset".
When a filter is NOT set, we merely defer to the setting of it's
parent, grandparent, and so on (till we get to the top-level 'root').
A filter may be unset either by NEVER setting it or re-setting it to a
null or undefined value.

The structure of filter hierarchies are completely up to you.  You may
choose to use a number of different strategies.

Filter hierarchies are completely optional, as you may choose to
utilize a "flat" series of filters.  In many cases this is completely
sufficient.

Filter hierarchies are very powerful indeed! 



### Error Vetos

When an Error object is to be appended in the message probe, it is
given an opportunity to veto the probe emission.  This is over and
above the filtering process (defined above).  This can happen when:

  - The Error has already been logged, or
  - The Error is a recognized client issue
    ... see Error.cause defined in ErrorExtensionPolyfill.js

The reason behind this heuristic is there is no need to burden the
service log with client-based errors, because they are NOT really
service errors, rather client errors.  Of course these errors must
be communicated to the client through the normal return/throw/response
mechanism, but this is a separate issue from the service logs.

This Error veto ability is a configurable option and can be disabled
(see: allowErrorToVetoProbeEmission).


## Probe Formatting

???


## Configuration

???
