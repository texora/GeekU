# Log

**Table of Contents**

- [Overview](#overview)
- [Logging Basics](#logging-basics)
- [msgFn() Callbacks](#msgfn-callbacks)
- [Object Detail](#object-detail)
- [Filters](#filters)
  - [Filter Configuration](#filter-configuration)
  - [Configuring Filters](#configuring-filters)
  - [Error Vetos](#error-vetos)
- [Configuration](#configuration)
  - [Filter Configuration](#filter-configuration)
  - [Format Configuration](#format-configuration)


## Overview

Log is a lightweight JavaScript logging utility that provides
filterable logging probes, similar to a number of frameworks such
as Log4J.

By default, Log is a thin layer on top of console.log(), but is
configurable.

Log is an isomorphic JavaScript utility, as it will operate BOTH in
browser/node environments.



## Logging Basics

Logging probes are emitted using instances of the Log class.  Each
Log instance (e.g. log) is associated to a filter, via the Log
constructor parameter (more on filtering later).

```javascript
  const log = new Log('MyLogFilter');
```

Log levels define the severity of a probe.  By default the following
levels exist in order of severity:

```javascript
  Log.TRACE
  Log.DEBUG
  Log.INFO
  Log.WARN
  Log.ERROR
  Log.FATAL
```

The set of Log levels are configurable, so you can choose different
levels to meet your needs.

A log emits a probe at a designated severity level.  The probe is
conditionally emitted, depending on the filter setting (again, we will
discuss filters in just a bit).

```javascript
 log.debug(()=>`Some complex '${probe}' with bunches of '${overhead}'`);
```

**sample output:**
```
DEBUG 2016-04-04 18:07:50 MyLogFilter:
      Some complex 'Kool Output' with bunches of 'Very Nice Pizzazz'
```


## msgFn() Callbacks

As you can see from the example above, logging probes are based on
functional callbacks.  Notice that the example is using ES6 arrow
functions with template string literals.

The reason behind this is to minimize the overhead in message
construction when the probe is going to be thrown on the floor
(by the filtering process).  By wrapping this process in a
function, the message construction overhead is only incurred once
it is determined that the probe is in fact going to be emitted.

This means that there is virtually NO overhead in leaving
diagnostic level probes in production code.

With the advent of the ES6 arrow functions, this callback function
is very much streamlined.


## Object Detail

In addition to the message defined from the msgFn() callback, an
object can be optionally passed to the logging directive, which
will be formatted and appended to the message probe.

This can be any type of object, including Error instances (which are
appropriately formatted).

```javascript
 log.error(()=>'An unexpected condition occurred.', err);
```

**sample output:**
```
ERROR 2016-04-05 17:16:19 MyLogFilter:
      An unexpected condition occurred.
      Error:
        Name:       TypeError
        Status:     500
        StatusMsg:  Internal Server Error
        Client Msg: Unexpected Condition
        Message:    Cannot read property 'collection' of null
        URL:        /api/courses/CS-1132
        LogId:      4kXU_XTCl
        Stack Trace:
         TypeError: Cannot read property 'collection' of null
    at C:\data\devGitHub\GeekU\dist\webpack:\src\server\route\courses.js:73:23
    at Layer.handle [as handle_request] (C:\data\devGitHub\GeekU\node_modules\express\lib\router\layer.js:95:5)
    at next (C:\data\devGitHub\GeekU\node_modules\express\lib\router\route.js:131:13)
    at Route.dispatch (C:\data\devGitHub\GeekU\node_modules\express\lib\router\route.js:112:3)
    at Layer.handle [as handle_request] (C:\data\devGitHub\GeekU\node_modules\express\lib\router\layer.js:95:5)
    at C:\data\devGitHub\GeekU\node_modules\express\lib\router\index.js:277:22
    at param (C:\data\devGitHub\GeekU\node_modules\express\lib\router\index.js:349:14)
    at param (C:\data\devGitHub\GeekU\node_modules\express\lib\router\index.js:365:14)
    at Function.process_params (C:\data\devGitHub\GeekU\node_modules\express\lib\router\index.js:410:3)
    at next (C:\data\devGitHub\GeekU\node_modules\express\lib\router\index.js:271:10)
```

Notice that a unique LogId is added to the Error object and shown in
the logs.  This information should communicated to the client, so as
to be able to correlate the condition within the service logs.

**Sidebar**: Notice that the Error has a distinction between a
`clientMsg` and the normal `message`.  This ability is provided
through a light-weight Error object extension (see:
ErrorExtensionPolyfill.js).  Client-specific messages are applicable
for client consumption:

- both in meaning, 
- and in sanitization (so as to not reveal any internal architecture).


## Filters

Each Log instance (e.g. log) is associated to a filter (via the Log
constructor parameter), and is dynamically created when first seen.
Multiple Log instances may reference the same filter.  In this case
the log merely attaches itself to the existing filter.

Filters have a level setting, which are high-water marks, above which
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

   const log = new Log('Processor');
   ... 
   log.debug(()=>`Here are the details: ${details}`);
   ... 

   module3.js
   ==========
   import Log from './util/Log';

   const log = new Log('EntryExit');
   ... 
   log.info(()=>'Exit processing.');
   ... 
```

Assuming all the filter settings are at INFO, the following output
would occur:

**Output:**
```
INFO  2016-04-06 08:59:41 EntryExit:
      Enter processing.

INFO  2016-04-06 08:59:41 EntryExit:
      Exit processing.
```

Notice that module1.js and module3.js share the same filter. Also
notice that the DEBUG log from module2.js was not emitted, because it
did not pass the filter's high-water mark of INFO.

Filter names are completely up to you.  You may choose to use a number
of different strategies (for example: module-based or functional-logic, etc.)




### Configuring Filters

Filters are configured through the Log.config() method.  You merely
specify a series of filterName/level settings.  These settings may be
sparsely populated, as it merely applies the supplied settings to the master
filter.

```javascript
  Log.config({
    filter: {
      'root':      Log.INFO, // special root of all filters - pre-defined by Log (merely define level here)
      'EntryExit': Log.INFO,
      'Courses':   Log.DEBUG,
      'Students':  Log.WARN,
    }
  });
```

You may specify the filter values with either the Log defined
constants (e.g. Log.DEBUG), or their cooresponding string
representation (e.g. "DEBUG").

**Notice that Log pre-defines a 'root' filter**, which is referenced
when a given filter has not been set.  This 'root' will always be
defined (either by Log heuristics, or a client configuration), and
cannot be un-set (null/undefined).

For more details on Log.config(), please refer to the
[Configuration](#configuration) section.


### Filter Hierarchy

You may choose to introduce a hierarchy in your filter names.  

Filter hierarchies provide more fine-grained control over the
filtering process.  When defined, a hierarchy allows a child filter to
reference it's parent, when the child setting is not defined.

We have actually seen this already through the pre-defined 'root'
filter (the root parent of ALL filters).

Filter hierarchies are very easy to implement.  Simply place dots
(".") in the filter name to delimit the parent/child relationship.
For example:

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
A filter may be unset either by never setting it or re-setting it to a
null (or undefined or 'none') value.

The structure of filter hierarchies are completely up to you.  You may
choose to use a number of different strategies.

**Filter hierarchies are very powerful indeed!**  However, they are
completely optional, as you may choose to utilize a "flat" series of
filters.  It's completely up to you.



### Error Vetos

When an Error object is to be appended in the message probe, the Error
object (in certain conditions) can actually cause the probe emission to
be excluded.  This is over and above the filtering process (defined
above).

This veto can happen when:

- The Error has already been logged, or
- The Error is recognized to be a client issue

The reason behind this heuristic is there is no need to burden the
service logs with client-based errors.  These errors are NOT service
errors, because the service successfully recognized and responded to
the condition.  Rather they are client errors, that must be addressed
by the client logic.  If we logged client errors, our service logs
would be flooded with needless tracebacks.

Of course these errors must be communicated to the client through the
normal return/throw/response mechanism, but that is a separate issue
from the service logs.

This is predicated on the service logic marking the Error.cause
appropriately.  This ability is provided by a light-weight extension to
the Error object (see: ErrorExtensionPolyfill.js).

This Error veto ability is a configurable Log option and can be
disabled (see: Log Configuration: excludeClientErrors).

As an example, consider the following probes, taken from a
Service transactional exit point:

```javascript
log.info(()=> {
  const isClientErr   = (err.cause === Error.Cause.RECOGNIZED_CLIENT_ERROR);
  const clientQual    = isClientErr ? 'Client ' : '';
  const clarification = (isClientErr && Log.areClientErrorsExcluded())
          ? "\n      NOTE: To see Client Error details, re-configure Log: excludeClientErrors"
          : "";
  return `${clientQual}Error Condition: - Sending error: ${err.message}${clarification}`;
});

// log our error (depending on cause [e.g. if client condition] may NOT LOGGED)
log.error(()=>'Following exception encountered ...', err);
```

This example shows two log probes:

1. The first probe is an INFO level probe, stating that an exception
   was encountered, and an error response was sent to the client.
   This probe is merely a parallel INFO message that correlates with
   all other exit points (not shown here ... i.e. success, not-found,
   etc.).

   **Sidebar**: Notice that this message probe has some complexity,
   implemented in a number of conditional logic points.  Because this
   logic is encapsulated directly in the msgFn() callback, the msg
   construction overhead is ONLY incurred when the probe will in fact
   be emitted (i.e. the INFO filter is active).

2. The second probe is an ERROR level showing the details of the
   exception (including the traceback).  Technicians would use this
   information to diagnose a problem in the service.  By default this
   probe will not be emitted when it is a client error - even if the
   DEBUG filter is in effect.  In other words, the Error object has
   "vetoed" the log emission.


Initially, the following output would occur:

**Output:**
```
INFO  2016-04-06 08:59:41 GeekApp:
      Client Error Condition: - Sending error: Invalid field ('ouch') specified in request query field parameter: 'courseNum,ouch,courseDesc'
      NOTE: To see Client Error details, re-configure Log: excludeClientErrors
```

If however, the excludeClientErrors Log configuration was disabled,
the following output would take place:

**Output:**
```
INFO  2016-04-06 09:00:16 GeekApp:
      Client Error Condition: - Sending error: Invalid field ('ouch') specified in request query field parameter: 'courseNum,ouch,courseDesc'

ERROR 2016-04-06 08:59:41 GeekApp:
      Following exception encountered ...
      Error:
        Name:       Error
        Status:     500
        StatusMsg:  Internal Server Error
        Client Msg: Invalid field ('ouch') specified in request query field parameter: 'courseNum,ouch,courseDesc'
        Message:    Invalid field ('ouch') specified in request query field parameter: 'courseNum,ouch,courseDesc'
        URL:        /api/courses?fields=courseNum,ouch,courseDesc
        LogId:      E1RDHZRAl
        Stack Trace:
         Error: Invalid field ('ouch') specified in request query field parameter: 'courseNum,ouch,courseDesc'
    at Object.mongoFields (C:\data\devGitHub\GeekU\dist\webpack:\src\server\util\MongoUtil.js:27:13)
    at C:\data\devGitHub\GeekU\dist\webpack:\src\server\route\courses.js:37:35
    at Layer.handle [as handle_request] (C:\data\devGitHub\GeekU\node_modules\express\lib\router\layer.js:95:5)
    at next (C:\data\devGitHub\GeekU\node_modules\express\lib\router\route.js:131:13)
    at Route.dispatch (C:\data\devGitHub\GeekU\node_modules\express\lib\router\route.js:112:3)
    at Layer.handle [as handle_request] (C:\data\devGitHub\GeekU\node_modules\express\lib\router\layer.js:95:5)
    at C:\data\devGitHub\GeekU\node_modules\express\lib\router\index.js:277:22
    at Function.process_params (C:\data\devGitHub\GeekU\node_modules\express\lib\router\index.js:330:12)
    at next (C:\data\devGitHub\GeekU\node_modules\express\lib\router\index.js:271:10)
    at Function.handle (C:\data\devGitHub\GeekU\node_modules\express\lib\router\index.js:176:3)
```



## Configuration

Log configuration is accomplished through the static Log.config() method:

```javascript
  + Log.config(config): config
```

The config method is used to both retrieve and/or update Log
configuration.  The most common usage is to maintain the filter,
but many other options are supported.

A configuration object is always returned, detailing the current
configuration.  

- When NO config param is supplied, config() it is used strictly as
  a retrieval mechanism. 

- If a config param is supplied, updates are applied, and then the
  most current configuration is returned.

  The config param drives the configuration updates.  The properties
  of this object are consistent with what is retrieved, but can be
  sparsely populated - setting only selected configuration options.

The configuration object is a JSON structure, with the following
format:

```javascript
{
  filter: {                      // update Log filters
    <filter-name>:       <level> // ex: Log.DEBUG or "DEBUG"
    ... ex:
    "root":              "INFO", // notice you can set the root of all filters
    "GeekApp":           "WARN",
    "ProcessFlow":       "DEBUG",
    "ProcessFlow.Enter": "none",
    "ProcessFlow.Exit":  "none",
  },

  excludeClientErrors: true, // exclude logged Errors that are caused by client

  format: {         // various formatting options (currently all function hooks)
    "fmtProbe":     function(filterName, levelName, msgFn, obj): String,
    "fmtLevel":     function(levelName): String,
    "fmtTimeStamp": function(): String,
    "fmtFilter":    function(filterName): String,
    "fmtMsg":       function(msgFn): String,
    "fmtObj":       function(obj): String,
    "fmtError":     function(err): String,
  },

  more: ??$$,

}
```

### Filter Configuration

Filters are configured by specifying a series of filterName/level
settings within the filter node of the config parameter.  These
settings may be sparsely populated, as it merely applies the supplied
settings to the master filter.

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

You may specify the filter values with either the Log defined
constants (e.g. Log.DEBUG), or their cooresponding string
representation (e.g. "DEBUG").

**Notice that Log pre-defines a 'root' filter**, which is referenced
when a given filter has not been set.  This 'root' will always be
defined (either by Log heuristics, or a client configuration), and
cannot be un-set (null/undefined).

This example defines a three-tier filter hierarchy.  Because
'entryExit.mongo.setup' has NO level defined, it's parent
('entryExit.mongo') will be referenced to determine the active
setting.


### Format Configuration

Formatting options are configured by specifying a series of functions
within the format node of the config parameter.  These settings may be
sparsely populated, as it merely applies the supplied settings.

The various fmt functions (and their parameters) are enumerated in the
[Configuration](#configuration) section.

Here is an example to re-format all probes on a sinlge line:

```javascript
Log.config({
  format: {
    // formats everything on one line:
    fmtProbe: (filterName, levelName, msgFn, obj)=>`${curFmt.fmtLevel(levelName)} ${curFmt.fmtTimeStamp()} ${curFmt.fmtFilter(filterName)}: ${curFmt.fmtMsg(msgFn)}${curFmt.fmtObj(obj)}`
  }
});
```

**Before:**
```
INFO  2016-04-08 11:12:50 GeekApp:
      Starting GeekU Server.

INFO  2016-04-08 11:12:51 GeekApp:
      createRunningApp(): DB connection established, and app is listening on port: 8080
```

**After:**
```
INFO  2016-04-08 11:11:48 GeekApp: Starting GeekU Server.
INFO  2016-04-08 11:11:49 GeekApp: createRunningApp(): DB connection established, and app is listening on port: 8080
```

Here is an example that turns off all date/time stamps:

```javascript
Log.config({
  format: {
    fmtTimeStamp: () => '',
  }
});
```

**Before:**
```
INFO  2016-04-08 11:11:48 GeekApp: Starting GeekU Server.
INFO  2016-04-08 11:11:49 GeekApp: createRunningApp(): DB connection established, and app is listening on port: 8080
```

**After:**
```
INFO  GeekApp: Starting GeekU Server.
INFO  GeekApp: createRunningApp(): DB connection established, and app is listening on port: 8080
```


??? Log.registerLevel()
