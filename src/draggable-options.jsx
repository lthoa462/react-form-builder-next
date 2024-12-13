// draggable-options.jsx
// Implement the drag drop option function
// [Dropdown, MultiSelect, Checkboxes, RadioButtons, Tags]
import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import ItemTypes from './ItemTypes';
import CustomDragLayer from './custom-drag-layer-option/CustomDragLayer';
const DraggableOptions = ({ 
    index
    , moveRow
    , disableDragDrop
    , option 
    , val
    , onBlurText
    , onChangeText
    , canHaveOptionValue
    , canHaveOptionCorrect
    , onChangeValue
    , onChangeOptionCorrect
    , onClickAddOption
    , onClickRemoveOption
    , canHaveOptionRequired = false
    , canHaveOptionDescription = false
    , onChangeColumnDescription
    , onChangeColumnRequired
    , description
}) => {
    const ref = React.useRef(null);

    const [{ isDragging }, drag, preview] = useDrag({
        type: ItemTypes.BOX,
        item: { type: ItemTypes.BOX, index, data: { 
            index,
            moveRow,
            disableDragDrop,
            option,
            val,
            onBlurText,
            onChangeText,
            canHaveOptionValue,
            canHaveOptionCorrect,
            onChangeValue,
            onChangeOptionCorrect,
            onClickAddOption,
            onClickRemoveOption,
            canHaveOptionRequired,
            canHaveOptionDescription,
            onChangeColumnDescription,
            onChangeColumnRequired,
            description
         } },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        canDrag: !disableDragDrop,
    });

    const [, drop] = useDrop({
        accept: ItemTypes.BOX,
        hover(item, monitor) {
            if (!ref.current || disableDragDrop) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }

            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            if (typeof moveRow === 'function') {
                moveRow(dragIndex, hoverIndex);
            }

            item.index = hoverIndex;
        },
        drop: () => {},
    });

    if (!disableDragDrop) {
        drag(drop(ref));
    }

    preview(null);

    const liItemStyle = disableDragDrop ? {} : {
        opacity: isDragging ? 0.5 : 1,
        padding: "10px",
        border: "1px solid #ccc",
        marginBottom: "5px",
    };

    return (
        <>
            <CustomDragLayer />
            <li className="clearfix" ref={ref} style={liItemStyle} >
                <div className="row">
                    <div className="col-sm-6">
                        <input tabIndex={index + 1} className="form-control" style={{ width: '100%' }} type="text" name={`text_${index}`} placeholder="Option text" value={option.text} onBlur={onBlurText} onChange={onChangeText} />
                    </div>
                    {canHaveOptionValue &&
                        <div className="col-sm-2">
                            <input className="form-control" type="text" name={`value_${index}`} value={val} onChange={onChangeValue} />
                        </div>}
                    {canHaveOptionValue && canHaveOptionCorrect &&
                        <div className="col-sm-1">
                            <input className="form-control" type="checkbox" value="1" onChange={onChangeOptionCorrect} checked={option.hasOwnProperty('correct')} />
                        </div>}
                    {
                        !!canHaveOptionDescription &&
                        <div className="col-sm-2">
                            <input className="form-control" type="text" name={`value_${index}`} value={description} onChange={onChangeColumnDescription} />
                        </div>
                    }
                    {
                        !!canHaveOptionRequired &&
                        <div className="col-sm-1">
                            <input className="form-control" type="checkbox" value="1" onChange={onChangeColumnRequired} checked={!!option.required} />
                        </div>
                    }
                    <div className="col-sm-3">
                        <div className="dynamic-options-actions-buttons">
                            <button onClick={onClickAddOption} className="btn btn-success"><i className="fas fa-plus-circle"></i></button>
                            {index > 0
                                && <button onClick={onClickRemoveOption} className="btn btn-danger"><i className="fas fa-minus-circle"></i></button>
                            }
                        </div>
                    </div>
                </div>
            </li>
        </>
    );
};

export default DraggableOptions;
