import {generateActions} from 'action-u';
import assert            from 'assert';
import SelCrit           from '../../shared/domain/SelCrit';

/**
 * @constant {app-node} 'selCrit'
 * @function
 * @description Actions rooted in 'selCrit' (selection criteria).
 */
export default generateActions.root({

  selCrit: {

    /**
     * @function 'selCrit.edit'
     *
     * @description
     * Start an edit dialog session of the supplied selCrit.
     *
     * @intent #byUser, #reducer
     *
     * @param {SelCrit} selCrit the selCrit to edit.
     *
     * @param {boolean} isNew indicator as to whether the supplied selCrit
     * is new (true), or previously existed (false) ... DEFAULT: false
     *
     * @param {SelCrit.SyncDirective} syncDirective a directive that indicates
     * how selCrit changes should be synced in selCrit-based views
     * ... DEFAULT: SelCrit.SyncDirective.default
     * 
     * @return {Action}
     */
    edit: {
            actionMeta: {
              traits: ['selCrit', 'isNew', 'syncDirective'],
              ratify(selCrit,
                     isNew=false,
                     syncDirective=SelCrit.SyncDirective.default) {
                assert(SelCrit.isSelCrit(selCrit),
                       `actions.selCrit.edit() Invalid selCrit param: ${FMT(selCrit)}`);
                assert(SelCrit.SyncDirective[syncDirective],
                       `actions.selCrit.edit() Invalid syncDirective param: ${FMT(syncDirective)}`);
                return [selCrit, isNew, syncDirective];
              }
            },
      change: { // various selCrit attribute changes ... #byUser, #reducer
        name:   { actionMeta: {
                  traits: ['name'],
                },
        },
        desc:   { actionMeta: {
                  traits: ['desc'],
                },
        },
        fields: { actionMeta: {
                  traits: ['selectedFieldOptions'],
                },
        },
        sort:   { actionMeta: {
                  traits: ['selectedSortOptions'],
                },
        },
        filter: { actionMeta: {
                  traits: ['newFilter'],
                },
        },
        distinguishMajorSortField:
                { actionMeta: {
                  traits: ['value'],
                },
        },
      }, // end of ... change

      use: { // use selCrit (completing edit session) without persisting to DB (subject to validation)
             // ... #byUser,  #noReducer
             actionMeta: {
             },
      },

      save: { // save/use selCrit (completing edit session) (subject to validation)
              // ... #byUser,  #noReducer
              actionMeta: {
              },
      },

      close: { // close out edit session dialog (completing edit session)
               // used BOTH to cancel edit session
               //           or complete edit session from use/save
               // ... #byUser, #byLogic, #reducer
               actionMeta: {
               },
      },

    }, // end of ... edit

    /**
     * @function 'selCrit.changed'
     *
     * @description
     * A central notification that the supplied selCrit has changed (and
     * is in a completed/valid state).
     *
     * This is emitted by various logic points under any circumstance of
     * a completed/valid change (ex: edit dialog completion, save,
     * etc.), and is of interest to reducers to to maintain overall
     * state.
     *
     * @intent #byLogic, #reducer
     *
     * @param {SelCrit} selCrit the selCrit that has changed.
     *
     * @param {SelCrit.SyncDirective} syncDirective a directive that indicates
     * how selCrit changes should be synced in selCrit-based views.
     * ... DEFAULT: SelCrit.SyncDirective.default
     * 
     * @return {Action}
     */
    changed: {
               actionMeta: {
                 traits: ['selCrit', 'syncDirective'],
                 ratify(selCrit,
                        syncDirective=SelCrit.SyncDirective.default) {
                   assert(SelCrit.isSelCrit(selCrit),
                          `actions.selCrit.changed() Invalid selCrit param: ${FMT(selCrit)}`);
                   assert(SelCrit.SyncDirective[syncDirective],
                          `actions.selCrit.changed() Invalid syncDirective param: ${FMT(syncDirective)}`);
                   return [selCrit, syncDirective];
                 }
               },
    },

    /**
     * @function 'selCrit.save'
     *
     * @description
     * Save the supplied selCrit.
     * 
     * Any view that is based on this selCrit is automatically updated.
     *
     * @intent #byUser, #byLogic, #reducer(spinner only)
     *
     * @param {SelCrit} selCrit the selCrit to save.
     *
     * @param {SelCrit.SyncDirective} syncDirective a directive that indicates
     * how selCrit changes should be synced in selCrit-based views.
     * ... DEFAULT: SyncDirective.default
     * 
     * @return {Action}
     */
    save: {
            actionMeta: {
              traits: ['selCrit', 'syncDirective'],
              ratify(selCrit,
                     syncDirective=SelCrit.SyncDirective.default) {
                assert(SelCrit.isSelCrit(selCrit),
                       `actions.selCrit.save() Invalid selCrit param: ${FMT(selCrit)}`);
                assert(SelCrit.SyncDirective[syncDirective],
                       `actions.selCrit.save() Invalid syncDirective param: ${FMT(syncDirective)}`);
                return [selCrit, syncDirective];
              }
            },
      complete: { // #byLogic, #reducer(spinner only - NOTE: monitor selCrit.changed for overall changes)
                  actionMeta: {
                    traits: ['selCrit'],
                  },
      },
      fail: {     // #byLogic, #reducer(spinner only)
                  actionMeta: {
                    traits: ['selCrit', 'err'],
                  },
      },

    }, // end of ... save

    /**
     * @function 'selCrit.delete'
     *
     * @description
     * Delete the supplied selCrit, after obtaining a user confirmation.
     * 
     * Any view that is based on this selCrit is automatically updated (see impactView).
     *
     * @intent #byUser, #reducer(spinner only)
     *
     * @param {SelCrit} selCrit the selCrit to delete.  This can either be a local in-memory
     * representation -or- on persisted in the DB.
     * 
     * @return {Action}
     */
    delete: {
            actionMeta: {
              traits: ['selCrit'],
            },
      complete: { // #byLogic, #reducer ... impactView is the itemType of an impacted view if any (null indicates NO view was impacted)
                  actionMeta: {
                    traits: ['selCrit', 'impactView'],
                  },
      },
      fail: {     // #byLogic, #reducer(spinner only)
                  actionMeta: {
                    traits: ['selCrit', 'err'],
                  },
      },
    }, // end of ... delete

  } // end of ... selCrit

});
