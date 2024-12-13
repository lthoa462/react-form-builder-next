import React, { useState } from "react";
import myxss from './myxss';
import { Tooltip } from "reactstrap";

const TooltipItem = (props) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggle = () => {
    setTooltipOpen(!tooltipOpen);
  };

  return (
    <span className="py-0 ps-0 pe-2">
      <a> <span className="fa fa-question-circle p-0" id={"Tooltip-" + props.id}></span> </a>
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

const ComponentLabel = (props) => {
  const hasRequiredLabel = (props.data.hasOwnProperty('required') && props.data.required === true && !props.read_only);
  const description = props.data?.description?.trim();
  const labelText = myxss.process(props.data.label);
  // Thêm điều kiện nếu element có column và có parentId : là element nằm trong table => ẩn label
  if (!labelText || (!!props.data.column && !!props.data.parentId)) {
    return null;
  }
  return (
    <label className={props.className || 'form-label'}>
      {
        !!description ? <>
          <span dangerouslySetInnerHTML={{ __html: labelText }} className="py-1 px-2"/>
          { hasRequiredLabel && <span className="label-required badge badge-danger has-required-label" dangerouslySetInnerHTML={{ __html: "*" }} /> }
          <TooltipItem key={"Tooltip_" + props.data?.id} item={{ placement: "auto" }} id={props.data?.id} description={description} />
        </> : <>
          <span dangerouslySetInnerHTML={{ __html: labelText }} className="py-1 px-2" />
          { hasRequiredLabel &&
            <>
              <span className="label-required badge badge-danger has-required-label">*</span>
              <span className="pe-1"></span>
            </>
          }
        </>
      }
    </label>
  );
};

export default ComponentLabel;
