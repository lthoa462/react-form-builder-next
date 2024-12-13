import React, { useState, useEffect } from 'react';

const boxStyles = {
  border: '1px dashed grey',
  padding: '0.5rem 1rem',
  cursor: 'move',
};


const styles = {
  display: 'inline-block',
};

const Box = ({ item, color }) => {
  const { index,
    option,
    val,
    onBlurText,
    onChangeText,
    canHaveOptionValue,
    canHaveOptionCorrect,
    canHaveOptionRequired = false,
    canHaveOptionDescription = false,
    description
  } = item.data;

  const backgroundColor = color ? '#059862' : 'red';
  return <div style={{ ...boxStyles, backgroundColor }}>
    <li className="clearfix" >
      <div className="row">
        <div className="col-sm-6">
          <input tabIndex={index + 1} className="form-control" style={{ width: '100%' }} type="text" name={`text_${index}`} placeholder="Option text" value={option.text} onBlur={onBlurText} onChange={onChangeText} />
        </div>
        {canHaveOptionValue &&
          <div className="col-sm-2">
            <input className="form-control" type="text" name={`value_${index}`} onChange={() => {}} value={val}/>
          </div>}
        {canHaveOptionValue && canHaveOptionCorrect &&
          <div className="col-sm-1">
            <input className="form-control" type="checkbox" value="1" checked={option.hasOwnProperty('correct')} onChange={() => {}}/>
          </div>}
        {
          !!canHaveOptionDescription &&
          <div className="col-sm-2">
            <input className="form-control" type="text" name={`value_${index}`} onChange={() => {}} value={description} />
          </div>
        }
        {
          !!canHaveOptionRequired &&
          <div className="col-sm-1">
            <input className="form-control" type="checkbox" value="1" checked={!!option.required} onChange={() => {}} />
          </div>
        }
        <div className="col-sm-3">
          <div className="dynamic-options-actions-buttons">
            <button className="btn btn-success"><i className="fas fa-plus-circle"></i></button>
            {index > 0
              && <button className="btn btn-danger"><i className="fas fa-minus-circle"></i></button>
            }
          </div>
        </div>
      </div>
    </li>
  </div>;
};

export const BoxDragPreview = ({ item }) => {
  const [tickTock, setTickTock] = useState(false);
  return (<div style={styles} role="BoxPreview">
    <Box item={item} color={tickTock} />
  </div>);
};
