import React, { useState } from 'react';
import { DragSource } from 'react-dnd';
import ItemTypes from '../ItemTypes';
import { Tooltip } from 'reactstrap';
import ID from '../UUID';

const style = {
  // display: 'inline-block',
  // border: '1px dashed gray',
  // padding: '0.5rem 1rem',
  // backgroundColor: 'white',
  cursor: 'move',
};

const gripSource = {
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
      <a><span  className="is-isolated fas fa-arrows-alt" id={"Tooltip-" + props.id}></span> </a>
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

const id = ID.uuid();
const Grip = ({ connectDragSource }) => connectDragSource(
  <div className="btn is-isolated" style={style} >
    <TooltipItemDragDrop key={"Tooltip_" + id} item={{ placement: "top" }} id={id} />
  </div>,
);

export default DragSource(
  ItemTypes.BOX,
  gripSource,
  (connect) => ({
    connectDragSource: connect.dragSource(),
  }),
)(Grip);
