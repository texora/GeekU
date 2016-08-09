'use strict';

import React            from 'react';
import {DragSource}     from 'react-dnd';
import DragHandleIcon   from 'material-ui/lib/svg-icons/action/settings-ethernet';
import Log              from '../../../shared/util/Log';

const log = new Log('DnD');


/**
 * The OptionDragHandle component supports the re-positioning of a
 * 'react-select' option through DnD.
 *
 * This component is required in order to resolve conflicts between
 * react-select mouse-down behavior and the DnD functionality.  It is
 * not possible to directly configure the 'react-select' value option
 * component to be 'draggable', because the mouse down event is
 * interpreted as opening the select options.  This sub-component
 * avoids this conflict by directly intercepting the onMouseDown
 * event.
 */

@DragSource((p) => p.dndItemType,    // the DnD item type we are working on behalf of
            {                        // our DnD drag source contract ... defining how the drag source reacts to the drag and drop events
              beginDrag(p, monitor) {  // ... drag started: return data describing the drag item (only info available to the drop targets)
                log.debug(() => `OptionDragHandle.beginDrag() type: '${p.dndItemType}', option: [${p.optionIndex}] ${p.option.value} / ${p.option.label}`);
                return {
                  option:      p.option,
                  optionIndex: p.optionIndex,
                };
              },
              endDrag(p, monitor) {  // ... drag ended: potential spot to issue a flux action (via monitor.didDrop() / monitor.getDropResult() )
                log.debug(() => `OptionDragHandle.endDrag() type: '${p.dndItemType}', option: [${p.optionIndex}] ${p.option.value} / ${p.option.label}`);
              }
            },
            (connect, monitor) => {  // our DnD Collecting function ... props that are injected on our component
              return {
                connectDragSource:  connect.dragSource(),
                connectDragPreview: connect.dragPreview(),
              };
            })

export default class OptionDragHandle extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  // TODO: drag preview only works with images (within componentDidMount()) ... use react-dnd-text-dragpreview (may still NOT work in IE)
  // componentDidMount() {
  //   const p = this.props;
  //   p.connectDragPreview(<span>WowZee WowZee WooWoo</span>);
  // }

  render () {
    const p = this.props;

    return p.connectDragPreview(
      <span>
        <span className="Select-value-label">{p.option.label}</span>
        {p.connectDragSource(
          <span className="Select-value-icon"
                style={iconContainerStyle}
                title="Drag to re-position"
                onMouseDown={ e => e.stopPropagation() }>
            <DragHandleIcon style={iconStyle}/>
          </span>)}
      </span>
    );
  }
  
}

// define expected props
OptionDragHandle.propTypes = {
  dndItemType: React.PropTypes.string.isRequired, // the DnD itemType on which behalf we are working
  option:      React.PropTypes.object.isRequired, // the 'react-select' option we are working on behalf of (value/label attributes)
  optionIndex: React.PropTypes.number.isRequired  // the zero-based index offset of the option we are working on behalf of
};

const iconContainerStyle = {
  padding: '1'
};

const iconStyle = {
  width:  12,
  height: 12,
};

export default OptionDragHandle;
