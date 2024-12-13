import React, { PureComponent, useState } from 'react';
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import ItemTypes from '../ItemTypes';
import { Tooltip } from 'reactstrap';
import ID from '../UUID';
import IntlMessages from '../language-provider/IntlMessages';

const style = {
  // display: 'inline-block',
  // border: '1px dashed gray',
  // padding: '0.5rem 1rem',
  // backgroundColor: 'white',
  cursor: 'move',
};

const dragHandleSource = {
  beginDrag(props) {
    const {
      data, index, onDestroy, setAsChild, getDataById,
    } = props;
    return {
      itemType: ItemTypes.BOX,
      index: data.parentId ? -1 : index,
      parentIndex: data.parentIndex,
      id: data.id,
      col: data.col,
      onDestroy,
      setAsChild,
      getDataById,
      data,
    };
  },
};

// Tooltip for the drag-drop section
const TooltipItemDragDrop = (props) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggle = () => {
    setTooltipOpen(!tooltipOpen);
  };

  return (
    <span >
      <a><span className="is-isolated fas fa-arrows-alt" id={"Tooltip-" + props.id}></span> </a>
      <Tooltip
        placement={props.item.placement}
        isOpen={tooltipOpen}
        target={"Tooltip-" + props.id}
        toggle={toggle}
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 10],
            },
          },
        ]}
      >
        <IntlMessages id="react-form-builder.drag-drop-tooltip" />
      </Tooltip>
    </span>
  );
};

class DragHandle extends PureComponent {
  componentDidMount() {
    const { connectDragPreview } = this.props;
    if (connectDragPreview) {
      // Use empty image as a drag preview so browsers don't draw it
      // and we can draw whatever we want on the custom drag layer instead.
      connectDragPreview(getEmptyImage(), {
        // IE fallback: specify that we'd rather screenshot the node
        // when it already knows it's being dragged so we can hide it with CSS.
        captureDraggingState: true,
      });
    }
  }

  render() {
    const { connectDragSource } = this.props;
    const id = ID.uuid();
    return connectDragSource(
      <div className="btn is-isolated" style={style} >
        <TooltipItemDragDrop key={"Tooltip_" + id} item={{ placement: "top" }} id={id} />
      </div>
    );
  }
}

export default DragSource(
  ItemTypes.BOX,
  dragHandleSource,
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  }),
)(DragHandle);
