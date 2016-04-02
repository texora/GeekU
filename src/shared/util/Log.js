'use strict'

import pad    from 'pad';
import moment from 'moment';

// ??? consider putting this in Log.md

/**
 * Log is a lightweight JavaScript logging utility that promotes
 * filterable logging probes, similar to many frameworks (such as
 * Log4J).
 *
 * By default, Log is a thin layer on top of console.log(), but is
 * configurable (TODO).
 *
 * Log is an isomorphic JavaScript utility, which means it will
 * operate BOTH in browser/node environments.
 *
 *
 * Logging Basics
 * ==============
 *
 * Logging probes are emitted using instances of the Log class.  Each
 * Log instance (e.g. log) is associated to a filter, via the Log
 * constructor parameter (more on filtering later).
 *
 *   const log = new Log('MyLogFilter');
 *
 * Log levels define the severity of a probe.  By default the
 * following levels exist (in order of severity).
 *
 *   Log.FATAL
 *   Log.ERROR
 *   Log.WARN
 *   Log.INFO
 *   Log.DEBUG
 *   Log.TRACE
 * 
 * NOTE: Additional log levels may be created through configuration.
 *
 * A log emits a probe at a designated severity level.  The probe is
 * conditionally emitted, depending on the filter setting (again, more
 * on this later).
 *
 *  log.debug(()=>`some complex ${stream} with bunches of ${overhead}`);
 *
 *
 * txtFn() callbacks
 * =================
 *
 * As you can see from above, logging probes are based on functional
 * callbacks.  Notice that the ES6 arrow functions are used.
 *
 * The reason behind this is to minimize the overhead in message
 * construction when the probe is going to be thrown on the floor
 * (through the filtering process).  By wrapping this process in a
 * function, the message construction overhead is only incurred once
 * we determine that the probe is in fact going to be emitted.
 *
 * This means that there is virtually NO overhead in leaving
 * diagnostic level probes in production code.
 *
 * With the advent of the ES6 arrow functions, this callback function
 * is very much streamlined (see example above).
 * 
 * 
 * Filters:
 * ========
 * 
 * Each Log instance (e.g. log) is associated to a filter (via the Log
 * constructor parameter), and is dynamically created when first seen.
 * Multiple Log instances may reference the same filter.  In this case
 * the log merely attaches itself to the existing filter.
 * 
 * Filters have a level setting, which is a high-water mark, above which
 * probes are either emitted, or thrown on the floor.
 * 
 * A log emits a probe at a designated level (INFO, ERROR, DEBUG, etc.).
 * This level is compared to the filter level setting to determine if the
 * probe is to be emitted.
 * 
 * Here is a simple example:
 * 
 *    module1.js
 *    ==========
 *    import Log from './util/Log';
 * 
 *    const log = new Log('EntryExit');
 *    ... 
 *    log.info(()=>'Enter processing.');
 *    ... 
 * 
 *    module2.js
 *    ==========
 *    import Log from './util/Log';
 * 
 *    const log = new Log('EntryExit');
 *    ... 
 *    log.info(()=>'Exit processing.');
 *    ... 
 * 
 * Notice that module1 and module2 share the same filter.
 * 
 * Filter names are completely up to you.  You may choose to use a number
 * of different strategies.
 * 
 * 
 * Filter Configuration
 * ====================
 * 
 * Filters are configured through the Log.configure() method.  You merely
 * specify a series of filterName/level settings.  These settings may be
 * sparsely populated, as it merely applies the settings to the master
 * filter.
 * 
 *   Log.config({
 *     filter {
 *       'root':      Log.INFO, // special root of all filters - pre-defined by Log (merely define level here)
 *       'EntryExit': Log.INFO,
 *       'Courses':   Log.DEBUG,
 *       'Students':  Log.WARN,
 *       ... etc
 *     }
 *   });
 * 
 * Notice that Log pre-defines a 'root' filter, which is referenced when
 * a given filter has not been set.  This 'root' will always be defined
 * (either through Log, or a client configuration), and cannot be un-set
 * (null/undefined).
 * 
 * 
 * Filter Hierarchy
 * ================
 * 
 * You may choose to introduce a hierarchy in your filter names.  
 * 
 * Filter hierarchies provide more fine-grained control over the
 * filtering process.  When defined, a hierarchy allows a child filter to
 * reference it's parent, when the child setting is not defined.
 * 
 * We have actually seen this already through the pre-defined 'root'
 * filter (the root parent of ALL filters).
 * 
 * Filter hierarchies are very easy to implement.  The filter string name
 * merely contains the hierarchy delimited with a period (".")
 * character.  As an example:
 * 
 *   Log.config({
 *     filter {
 *       'root': Log.INFO, // special root of all filters - pre-defined by Log (merely define level here)
 * 
 *       'entryExit.mongo':          Log.INFO,
 *       'entryExit.mongo.setup':    null,
 *       'entryExit.mongo.teardown': Log.DEBUG,
 *     }
 *   });
 * 
 * This example defines a three-tier filter hierarchy.  Because
 * 'entryExit.mongo.setup' has NO level defined, it's parent
 * ('entryExit.mongo') will be referenced to determine the active
 * setting.
 * 
 * This allows you to turn on a broad category of probes, by simply
 * adjusting a parent level filter.
 * 
 * Filter hierarchies introduce the concept of a filter being "unset".
 * When a filter is NOT set, we merely defer to the setting of it's
 * parent, grandparent, and so on (till we get to the top-level 'root').
 * A filter may be unset either by NEVER setting it or re-setting it to a
 * null or undefined value.
 * 
 * The structure of filter hierarchies are completely up to you.  You may
 * choose to use a number of different strategies.
 * 
 * Filter hierarchies are completely optional, as you may choose to
 * utilize a "flat" series of filters.  In many cases this is completely
 * sufficient.
 * 
 * Filter hierarchies are very powerful indeed! 
 * 
 * 
 * Probe Formatting
 * ================
 *
 * ??? 
 *
 *
 * Configuration
 * =============
 *
 * ??? 
 *
 *
 * @author Kevin Bridges
 */
class Log {

  /**
   * Construct a new Log instance.
   * 
   * @param {String} filterName the probe identifier defined within this
   * log instance, used in the Log filters.  This filterName can be re-used
   * crossing JS module boundaries.
   * 
   * @api public
   */
  constructor(filterName) {

    if (!filterName) {
      throw new Error('Log() contructor requires a filterName.');
    }

    // retain filterName in self
    this.filterName = filterName;

    // inject filterName in the Log filter
    // ... simply share existing filters (found in different Log
    //     instances [typically in different JS modules])
    if (!Log.filter[filterName]) {
      Log.filter[filterName] =  Log.DEFAULT_FILTER_LEVEL;
    }
  }

  /**
   * Various logging shortcut methods, machine generated by
   * registerLevel(levelName, level).
   * 
   * EXAMPLE: debug(txtFn)
   *
   * @param {int} level the log level for this probe (e.g. Log.DEBUG).
   * 
   * @api public
   */
  // example (machine generated) ...
//debug(txtFn) {
//  this.log(Log.DEBUG, txtFn);
//}

  /**
   * Conditionally log a message, when enabled within our filter.
   *
   * @param {int} level the log level for this probe (e.g. Log.DEBUG).
   * @param {function} txtFn a callback function returning the txt string to log. 
   * 
   * @api public
   */
  log(level, txtFn) {
    // validate params ... TODO: may want to turn validation off for performance
    const levelName = Log.levelName[level];
    if (!levelName) {
      throw new Error(`Invalid log level: ${level}`);
    }
    if (typeof txtFn !== 'function') {
      throw new Error(`Log.log: expecting txtFn param to be a function, but is a: ${typeof txtFn}`);
    }

    // conditionally log this message when enabled within our filter
    if ( this.isEnabled(level, this.filterName) ) {
      console.log( Log.formatLog(this, levelName, txtFn) );
    }
  }

  /**
   * Is the supplied level enabled in Log's filter (defined by self's filterName).
   *
   * @param {int} level the log level for this probe (e.g. Log.DEBUG).

   * @return {boolean}
   * 
   * @api public ... however only needed in rare conditions
   */
  isEnabled(level) {
    // TODO: enhance to support filter hierarchies (with last resort to pre-defined 'root')
    const filterLevel = Log.filter[this.filterName];
    return filterLevel <= level;
  }


  // *** 
  // *** Configuration Related ...
  // *** 

  /**
   * Register a logging level.  This method is typically invoked
   * internally to establish the standard base levels, however
   * additional levels can be registered.
   *
   * @param {String} levelName the level name (e.g. DEBUG, WARN, etc)
   * @param {int} level the cooresponding numeric log level.  The
   * greater the level the more severe (e.g. ERROR of 500 is more
   * severe than INFO of 300).
   *
   * @api public
   */
  static registerLevel(levelName, level) {
    const levelNameUpper = levelName.toUpperCase();
    Log[levelNameUpper]  = level;
    Log.levelName[level] = levelNameUpper;

    const levelNameLower = levelName.toLowerCase();
    Log.prototype[levelNameLower] = function(txtFn) {
      this.log(Log[levelNameUpper], txtFn);
    };
  }

  /**
   * Configure the Log filter by applying the settings of the supplied filter.
   *
   * @param {Object} filter the filter to apply ... ex: 
   * {'Initialization': Log.DEBUG, 'Foo Service': Log.TRACE}
   *
   * @api public (configuration related)
   */
  static applyFilter(filter) {
    Object.assign(Log.filter, filter);
    // TODO: validate filter content of string/int
    // ? Log.filter = {
    // ?   'Initialization': 200,
    // ?   'Foo Service':    400
    // ? };
  }

}


/**
 * Log Level defined constants - programmatically set via Log.registerLevel()
 * @api public
 */
// ex ...
// Log.DEBUG = 200;

/**
 * Log Level names - programmatically set via Log.registerLevel()
 * @api private
 */
Log.levelName = {
  // ex ...
  // 200: 'DEBUG'
};

/**
 * Log filter - programmatically set via Log() constructor
 * @api private
 */
Log.filter = {
  // ex ...
  // 'Initialization': 200
  // 'Foo Service':    400
};

/**
 * Format the log entry to emit.
 * @api private (however can be re-set in initial Log configuration)
 */
Log.formatLog = function(log, levelName, txtFn) {
  return `
${pad(levelName, 5)} ${moment().format('YYYY-MM-DD HH:mm:ss')} (${log.filterName}):
      ${txtFn()}`;
};


/**
 * Default Filter Level, for initial filter registration.
 * @api private (however can be re-set in initial Log configuration)
 */
// TODO: eliminate DEFAULT_FILTER_LEVEL in favor of a run-time reference to pre-defined 'root' filter
Log.DEFAULT_FILTER_LEVEL = Log.INFO;


// register our initial standard base levels
Log.registerLevel('OFF',   999);
Log.registerLevel('FATAL', 600);
Log.registerLevel('ERROR', 500);
Log.registerLevel('WARN',  400);
Log.registerLevel('INFO',  300);
Log.registerLevel('DEBUG', 200);
Log.registerLevel('TRACE', 100);


export default Log
