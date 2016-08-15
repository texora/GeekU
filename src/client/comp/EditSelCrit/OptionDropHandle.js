'use strict';

import React            from 'react';
import { DropTarget }   from 'react-dnd';
import DropHandleIcon   from 'material-ui/lib/svg-icons/file/file-download';
import colors           from 'material-ui/lib/styles/colors';
import Log              from '../../../shared/util/Log';

const log = new Log('DnD');


/**
 * The OptionDropHandle component provides a visual drop-zone for the
 * re-positioning of a 'react-select' option through DnD.  This component 
 * is required to delineate drop-zones between two options.
 *
 * Drop handles should be instantiated to accommodate both sides of
 * each option, supporting a precise location between specific options
 * (and on end points)
 */

@DropTarget((p) => p.dndItemType,    // the DnD item type we are working on behalf of
            {                        // our DnD drop target contract
              drop(p, monitor) {     // ... a drop has occurred

                const draggedItem = monitor.getItem(); // the dragged item (returned from drag source beginDrag()

                log.debug(() => `OptionDropHandle.drop() type: '${p.dndItemType}', DROPPED: [${draggedItem.optionIndex}] ${draggedItem.option.value} / ${draggedItem.option.label} ... AFTER: [${p.dropAfterIndex}]`);

                // re-position item via function that issues flux action
                // TODO: Issuing flux actions here (even though the doc says you can)
                //       intermittently causes the DnD drag to NEVER end (leaving our drop-zone up).
                //       This happens in all browsers (Chrome, IE).
                //       The timeout appears to help, as long as it is long enough (IE requires more time)
                //       I must be doing somethin wrong :-(
                setTimeout(()=> {
                  log.debug(() => 'OptionDropHandle.drop() handled flux action after 250 milli-secs timeout');
                  p.handleRepositionFn(draggedItem.optionIndex,                     // moveIndx
                                       p.afterOption ? p.afterOption.value : null); // afterValue (null for start)
                }, 250);

              },

              // NOTE: canDrop() not really needed ... because we pro-actively visibly promote ONLY drop-zones
              //       ... normally this is used to highlight displayed components that are droppable
              // canDrop(p, monitor) {
              //   return droppable(monitor.getItem(), p.dropAfterIndex, p.draggedItemType, p.dndItemType);
              // }
            },
            (connect, monitor) => {  // our DnD Collecting function ... props that are injected on our component


              const FMT2 = JSON.stringify;
              
              return {
                connectDropTarget: connect.dropTarget(), // function to connect my drop target node
                draggedItem:       monitor.getItem(),
                draggedItemType:   monitor.getItemType(),
              };
            })


export default class OptionDropHandle extends React.Component {

  static propTypes = { // expected component props
    dndItemType:        React.PropTypes.string.isRequired,  // the DnD itemType on which behalf we are working
    dropAfterIndex:     React.PropTypes.number.isRequired,  // the zero-based index to drop AFTER (-1 for the start)
    afterOption:        React.PropTypes.object,             // the 'react-select' option representing dropAfterIndex (null for start)
    handleRepositionFn: React.PropTypes.func.isRequired     // re-position function(move-selected-options-index, to-after-value-null-for-start)
  }

  constructor(p, context) {
    super(p, context);
  }

  render () {
    const p = this.props;

    const iconContainerStyle = {
      padding:         '1',
      backgroundColor: 'yellow'
    };
    // because this is a dedicated icon for drop purposes, we can completely hide it if we are NOT droppable
    if (!droppable(p.draggedItem, p.dropAfterIndex, p.draggedItemType, p.dndItemType)) {

      // option 1: retain consistent spacing by using visibility (hidden visibility sttill takes space)
      iconContainerStyle.visibility = 'hidden'; // space still taken

      // option 2: collapse when un-used (display: none)
      // iconContainerStyle.display    = 'none';
      // TODO: hmmmm For some reason this technique causes the endDrag to fire immediatly
      //            - the weird thing is the first item CAN be dragged
      //            - IT WORKS IN IE (so it appears to be Chrome Specific)
      //            - May be a Chrome BUG:
      //              ... https://github.com/gaearon/react-dnd/issues/245
      //                  Chrome wont pick up the element if its position has changed
      //                  in ui,(previous element height changed and dragged element
      //                  position changes). As a temporary workaround you can add a
      //                  react-transition to that element so that the style will be applied
      //                  gradually.
    }

    return p.connectDropTarget(
      <span className="Select-value-icon"
            style={iconContainerStyle}>
        <DropHandleIcon color={colors.red900} style={iconStyle}/>
      </span>
    );
  }
  
}

const iconStyle = {
  width:  12,
  height: 12
};

function droppable(draggedItem, dropAfterIndex, draggedItemType, dndItemType) {
  return draggedItem && 
         draggedItemType === dndItemType &&
         draggedItem.optionIndex   !== dropAfterIndex &&
         draggedItem.optionIndex-1 !== dropAfterIndex;
}
