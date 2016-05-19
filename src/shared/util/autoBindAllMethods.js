'use strict';

import Log  from './Log';

const log = new Log('autoBindAllMethods');

/**
 * A class decorator that enhances (i.e. wraps) a supplied class's
 * constructor to autobind each of it's method with it's instances.
 *
 * This is a convenience for frameworks like React components who's
 * event registration uses function references (with the object
 * instance pre-bound).
 *
 * This utility can be invoked in two different ways:
 *
 *  1. As a Class Decorator:
 *
 *     This will wrap the supplied target class's constructor to
 *     autobind each of it's method with it's instances
 *     ... accomplished in one of two ways:
 *     
 *     1a. Decorator (ES7):
 *     
 *           @autoBindAllMethods
 *           class MyComp extends React.Component {
 *              ...
 *           }
 *     
 *     1b. Wrapper (any JS):
 *     
 *           class MyComp extends React.Component {
 *              ...
 *           }
 *           MyComp = autoBindAllMethods(MyComp);
 *     
 *     NOTE: One side-effect of this usage is that all your classes
 *           will be overridden to be AutoBindClassDecorator, because
 *           the constructor function is actually wrapped.  If this is
 *           unacceptable, simply use the second invocation technique.
 *
 *  2. Per object instance (typically invoked in constructor):
 *
 *     This technique merely post-processes a supplied object instance.
 *     It is typically invoked in the class constructor.  While this
 *     is not as "sexy" as a decorator, it does NOT cover up the
 *     original class name (see NOTE above).
 *
 *           class MyComp extends React.Component {
 *              constructor(...args) {
 *                super(...args);
 *                ...
 *                autoBindAllMethods(this);
 *              }
 *              ...
 *           }
 *
 *
 * @param {Class or object} target the target class or object to
 * apply autobind heuristics.
 *
 * @return {Class} for Class Decorator invocation, undefined otherwise.
 */
function autoBindAllMethods(target) {

  // Invokation Type 1 (Class Decorator)
  if (typeof target === 'function') {
    const targetClass = target;

    function AutoBindClassDecorator(...args) {
      log.debug(()=>'in AutoBindClassDecorator (extended constructor)');

      // invoke our original constructor (which we are wrapping)
      targetClass.constructor.apply(this, ...args);

      _autoBindAllMethods(this);
    }
    
    // make our prototype an instance of the targetClass
    AutoBindClassDecorator.prototype = targetClass.prototype;

    return AutoBindClassDecorator;
  }

  // Invokation Type 2 (Object Instance)
  else {
    _autoBindAllMethods(target);
  }
}

export default autoBindAllMethods;

/**
 * Internal method to bind each method of supplied obj.
 */
function _autoBindAllMethods(obj) {

  // NOTE: current logic only locates methods of the concrete class
  //       ... to support a multi-level class hierarchy, we must walk the prototype chain
  const propNames = Object.getOwnPropertyNames( Object.getPrototypeOf(obj) );
  for (const propName of propNames) {
    const propValue = obj[propName];
    if (typeof propValue === "function" && propName !== "constructor") {
      log.debug(()=>`autobinding ${propName}() method`);
      obj[propName] = propValue.bind(obj);
    }
  }

}
