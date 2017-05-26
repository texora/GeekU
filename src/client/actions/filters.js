import {generateActions} from 'action-u';
import assert            from 'assert';

/**
 * @constant {app-node} 'filters'
 * @function
 * @description Actions rooted in 'filters' (i.e. selCrit objects).
 */
export default generateActions.root({

  filters: {

    /**
     * @function 'filters.retrieve'
     *
     * @description
     * Retrieve filters ... a list of selCrit objects.
     *
     * @intent #byLogic, #reducer(spinner only)
     *
     * **Note**: The **Action Type** is promoted through a string
     * coercion of this action creator (it's toString() has been
     * overloaded).
     *
     * @return {Action}
     */
    retrieve: {
                  actionMeta: {
                  },

      complete: { // @intent #byLogic, #reducer
                  actionMeta: {
                    traits: ['filters'],
                  },
      },

      fail: {     // @intent #byLogic, #reducer(spinner only)
                  actionMeta: {
                    traits: ['err'],
                  },
      },

    }, // end of ... retrieve

  }, // end of ... filters
});
