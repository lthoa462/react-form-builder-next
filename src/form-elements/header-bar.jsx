/**
  * <HeaderBar />
  */

import React, { useState } from 'react';
// import Grip from '../multi-column/grip';
import DragHandle from './component-drag-handle';
import { Tooltip } from 'reactstrap';
import ID from '../UUID';
import { injectIntl } from 'react-intl';

// Tooltip for the edit section and delete section
const TooltipItem = (props) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggle = () => {
    setTooltipOpen(!tooltipOpen);
  };

  return (
    <span >
      <a><span className={props.classNameIcon} id={"Tooltip-" + props.id}></span> </a>
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
        { props.description }
      </Tooltip>
    </span>
  );
};

class HeaderBar extends React.Component {
  constructor(props) {
    super(props);
    this.intl = props.intl;
  }

  render() {
    const idDelete = ID.uuid();
    const idEdit = ID.uuid();
    const idCopy = ID.uuid();

    return (
      <div className="toolbar-header">
        <span className="badge badge-secondary">{this.props.data.text}</span>
        <div className="toolbar-header-buttons">
          {this.props.data.element !== 'LineBreak' &&
            <div className="btn is-isolated" onClick={this.props.editModeOn.bind(this.props.parent, this.props.data)}>
              <TooltipItem key={"Tooltip_" + idEdit} item={{ placement: "top" }} id={idEdit} description={this.intl.formatMessage({ id: "react-form-builder.edit-tooltip" })} classNameIcon="is-isolated fas fa-edit"/>
            </div>
          }
          {
            (typeof this.props.copyCard === 'function') && <div className="btn is-isolated" onClick={this.props.copyCard.bind(this, this.props.data)}>
              <TooltipItem key={"Tooltip_" + idCopy} item={{ placement: "top" }} id={idCopy} description={this.intl.formatMessage({ id: "react-form-builder.copy-tooltip" })} classNameIcon="is-isolated fas fa-copy"/>
            </div>
          }
          <div className="btn is-isolated" onClick={this.props.onDestroy.bind(this, this.props.data)}>
            <TooltipItem key={"Tooltip_" + idDelete} item={{ placement: "top" }} id={idDelete} description={this.intl.formatMessage({ id: "react-form-builder.delete-tooltip" })} classNameIcon="is-isolated fas fa-trash"/>
          </div>
          {/* {!this.props.data.isContainer &&
            <DragHandle data={this.props.data} index={this.props.index} onDestroy={this.props.onDestroy} setAsChild={this.props.setAsChild} />
          } */}

          <DragHandle data={this.props.data} index={this.props.index} onDestroy={this.props.onDestroy} setAsChild={this.props.setAsChild} />
        </div>
      </div>
    );
  }
}
export default injectIntl(HeaderBar);