'use strict'

import * as ReactRedux from 'react-redux';

/**
 * Various Redux convenience utilities.
 */
const ReduxUtil = {

  /**
   * Wraps the supplied React comp with a new React component that can
   * inject properties (both data and behavior) from the Redux store.
   *
   * This is merely a convenience method that promotes a bit more concise 
   * usage syntax.
   * 
   * The mapping parm is an object which may optionally contain:
   *   - mapStateToProps,
   *   - mapDispatchToProps,
   *   - mergeProps, and
   *   - options
   * per the react-redux documentation
   * ... https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options
   */
  wrapCompWithInjectedProps(comp, mapping) {
    mapping = mapping || {};
    return ReactRedux.connect(mapping.mapStateToProps, 
                              mapping.mapDispatchToProps,
                              mapping.mergeProps,
                              mapping.options) (comp);
  },


  /**
   * Resolve the reducer function, from the supplied set of reducers
   * with the standard redux state/action, providing an alternative to
   * the switch statement.
   *
   * The reducers is a simple object with reducer functions of the
   * same name as the action.type.
   */
  resolveReducer(reducers, state, action) {
    const  reducer = reducers[action.type];
    return reducer ? reducer(state, action) : state;
  }

};

export default ReduxUtil;
