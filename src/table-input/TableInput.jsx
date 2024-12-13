/* eslint-disable camelcase */
import React, { useEffect, useState } from "react";

import ComponentHeader from "../form-elements/component-header";
import ComponentLabel from "../form-elements/component-label";
import FieldsetDustbin from '../multi-column/dustbin';
import ItemTypes from "../ItemTypes";
import IntlMessages from "../language-provider/IntlMessages";
import { Tooltip } from "reactstrap";

const accepts = [ItemTypes.BOX, ItemTypes.CARD];

const TooltipColumn = (props) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggle = () => {
    setTooltipOpen(!tooltipOpen);
  };

  return (
    <span style={{ padding: "0 0" }}>
      <a> <span style={{ padding: "0 0" }} className="fa fa-question-circle" id={"Tooltip-" + props.id}></span> </a>
      <Tooltip
        placement={props.item.placement}
        isOpen={tooltipOpen}
        target={"Tooltip-" + props.id}
        toggle={toggle}
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 5],
            },
          },
        ]}
      >
        {props.description}
      </Tooltip>
    </span>
  );
};

export default function TableInputBase(props) {

  const [childData, setChildData] = useState({});
  const [childItems, setChildItems] = useState(null);
  const [childItemsTwoDArray, setChildItemsTwoDArray] = useState([]);

  useEffect(() => {
    const { data, class_name, ...rest } = props;
    setChildData(data);
    setChildItems(data.childItems);
    createChild(props.data.options, data);

  }, [props]);

  useEffect(() => {
    setChildItemsTwoDArray(convertTo2DArray(childItems, props.data.options.length));
    // console.log("childData", childData);
    // console.log("childItems", childItems);
    // console.log("props", props.data.options.length);
  }, [childItems])

  const convertTo2DArray = (arr, numCols) => {
    if (arr === null) return;
    const numRows = Math.ceil(arr.length / numCols);
    const twoDArray = [];

    let temp = 0;
    for (let i = 0; i < numRows; i++) {
      const row = [];
      for (let j = 0; j < numCols; j++) {
        if (temp < arr.length) {
          row.push(arr[temp]);
        } else {
          row.push(null);
        }
        temp = temp + 1;
      }
      twoDArray.push(row);
    }

    return twoDArray;
  }

  const addNewChild = () => {
    let data = props.data;
    let colCount = props.data.options.length;
    let oldChilds = data.childItems;
    data.childItems = Array.from({ length: colCount }, (v, i) => { return oldChilds[i] ? oldChilds[i] : null });

    setChildItems(data.childItems)
  }

  // const onDropSuccess = (droppedIndex) => {
  //   const totalChild = childItems ? childItems.length : 0;
  //   const isLastChild = totalChild === droppedIndex + 1;

  //   if (isLastChild) {
  //     addNewChild()
  //   }
  // }
  const onDropSuccess = (droppedIndex) => {
    addNewChild();
  }

  const createChild = (newOptions, data) => {
    const colCount = newOptions.length;
    const className = data.class_name || "col-md-12";
    if (!data.childItems) {
      // eslint-disable-next-line no-param-reassign
      data.childItems = Array.from({ length: colCount }, (v, i) => null);
      data.isContainer = true;
    } else {
      let oldChilds = data.childItems;
      data.childItems = Array.from({ length: (colCount * parseInt(data.rowCount)) }, (v, i) => { return oldChilds[i] ? oldChilds[i] : null });
    }
    setChildItems(data.childItems);
  };
  const {
    controls,
    editModeOn,
    getDataById,
    setAsChild,
    removeChild,
    seq,
    className,
    index,
    addRowTableInput,
    deleteRowTableInput,
    read_only,
    showAddDeleteRowButtons  
  } = props;
  const { pageBreakBefore } = childData;
  let baseClasses = "SortableItem rfb-item";
  if (pageBreakBefore) {
    baseClasses += " alwaysbreak";
  }

  return (
    <div style={{ ...props.style }} className={baseClasses}>
      <ComponentHeader {...props} isFieldSet={true} />
      <div className="table-responsive-sm table-responsive-md table-responsive-lg table-responsive-xl table-responsive-xxl">
        <ComponentLabel {...props} />
        <table className="table table-bordered">
          <thead>
            <tr>
              {props.data.options.map((column, index) => (
                <th key={`header_column_${index}`}>
                    { column.text }
                    &nbsp;
                    { !!column.text && !!column.required && <span className="label-required badge badge-danger has-required-label">*</span> }
                    { !!column.text && !!column.description && <TooltipColumn key={"Tooltip_" + column.key} item={{ placement: "auto" }} id={column.key} description={column.description} /> }
                </th>
              ))}
              {Array.isArray(childItemsTwoDArray) && childItemsTwoDArray.length > 0 && showAddDeleteRowButtons ? <th></th> : null}
            </tr>
          </thead>
          <tbody>
            {
              childItemsTwoDArray?.map((childItem, row) => (
                <tr key={row} >
                  {childItem?.map((x, i) => {
                    const widthPercentage = (childItem.length > 0) ? 100 / childItem.length : 100;
                    return (
                      <td key={`${row}_${i}_${x || "_"}`} style={{ minWidth: '200px', width: `${widthPercentage}%` }} className="td-form-builder">
                        {controls ? (
                          controls[parseInt(row) * childItem.length + parseInt(i)]
                        ) : (
                          <FieldsetDustbin
                            style={{ width: "100%" }}
                            data={childData}
                            accepts={accepts}
                            items={childItems}
                            key={parseInt(row) * childItem.length + parseInt(i)}
                            col={parseInt(row) * childItem.length + parseInt(i)}
                            onDropSuccess={() => onDropSuccess(parseInt(row) * childItem.length + parseInt(i))}
                            parentIndex={index}
                            editModeOn={editModeOn}
                            _onDestroy={() => removeChild(childData, parseInt(row) * childItem.length + parseInt(i))}
                            getDataById={getDataById}
                            setAsChild={setAsChild}
                            seq={seq}
                            rowNo={parseInt(row) * childItem.length + parseInt(i)}
                          />
                        )}
                      </td>
                    )
                  })}
                  { showAddDeleteRowButtons && (
                      row == 0 ? (
                          <td style={{ minWidth: '4rem' }}>
                            <button onClick={() => addRowTableInput(props.data.id, row, props.data.options.length)} disabled={read_only}
                                    className="btn btn-success btn-sm" type={"button"}><IntlMessages id="table-input.add" />
                            </button>
                          </td>
                      ) : (
                          <td style={{ minWidth: '4rem' }}>
                            <button onClick={() => addRowTableInput(props.data.id, row, props.data.options.length)} disabled={read_only}
                                    className="btn btn-success btn-sm" type={"button"}><IntlMessages id="table-input.add" />
                            </button>
                            <button onClick={() => deleteRowTableInput(props.data.id, row, props.data.options.length)} disabled={read_only}
                                    className="btn btn-danger btn-sm" type={"button"}><IntlMessages id="table-input.delete" />
                            </button>
                          </td>
                      )
                    )
                  }
                </tr>
              ))}
            <tr>
              {/* {
                childItems?.map((x, i) => (
                  <td key={`${i}_${x || "_"}`} style={{ minWidth: '200px', width: '100%' }}>
                    {controls ? (
                      controls[i]
                    ) : (
                      <FieldsetDustbin
                        style={{ width: "100%" }}
                        data={childData}
                        accepts={accepts}
                        items={childItems}
                        key={i}
                        col={i}
                        onDropSuccess={() => onDropSuccess(i)}
                        parentIndex={index}
                        editModeOn={editModeOn}
                        _onDestroy={() => removeChild(childData, i)}
                        getDataById={getDataById}
                        setAsChild={setAsChild}
                        seq={seq}
                        rowNo={i}
                      />
                    )}
                  </td>
                ))} */}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
