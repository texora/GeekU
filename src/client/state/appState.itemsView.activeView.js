import {AT}           from '../actions';
import {reducerHash}  from 'astx-redux-util';
import Log            from '../../shared/util/Log';

const log = new Log('appState.itemsView.activeView');

export default reducerHash.withLogging(log, {
  [AT.itemsView.activate]: (activeView, action) => [action.itemType,
                                                    ()=>`set activeView to action.itemType: '${action.itemType}'`],
}, ''); // initialState


//***
//*** Selectors ...
//***

export const getActiveView = (activeView) => activeView;
