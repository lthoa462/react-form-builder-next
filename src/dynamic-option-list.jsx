/**
  * <DynamicOptionList />
  */

 import React from 'react';
 import ID from './UUID';
 import IntlMessages from './language-provider/IntlMessages';
 import { getMaxWithAttrName } from './commons';
 import DraggableOptions from './draggable-options';

 export default class DynamicOptionList extends React.Component {
   constructor(props) {
     super(props);
     this.state = {
       element: this.props.element,
       data: this.props.data,
       dirty: false,
     };
     this.dragDropOptions = this.dragDropOptions.bind(this);
   }

   _setValue(text) {
     return text.replace(/[^A-Z0-9]+/ig, '_').toLowerCase();
   }

   editOption(option_index, e) {
     const this_element = this.state.element;
     const val = (this_element.options[option_index].value !== this._setValue(this_element.options[option_index].text)) ? this_element.options[option_index].value : this._setValue(e.target.value);

     this_element.options[option_index].text = e.target.value;
     this_element.options[option_index].value = val;
     this.setState({
       element: this_element,
       dirty: true,
     });
   }

   editValue(option_index, e) {
     const this_element = this.state.element;
    //  const val = (e.target.value === '') ? this._setValue(this_element.options[option_index].text) : e.target.value;
     const val = e.target.value;
     this_element.options[option_index].value = val;
     this.setState({
       element: this_element,
       dirty: true,
     });
   }

   // eslint-disable-next-line no-unused-vars
   editOptionCorrect(option_index, e) {
     const this_element = this.state.element;
     if (this_element.options[option_index].hasOwnProperty('correct')) {
       delete (this_element.options[option_index].correct);
     } else {
       this_element.options[option_index].correct = true;
     }
     this.setState({ element: this_element });
     this.props.updateElement.call(this.props.preview, this_element);
   }

   // Edit Column Description
  editColumnDescription(option_index, e) {
    const this_element = this.state.element;
    const val = e.target.value;
    this_element.options[option_index].description = val;
    this.setState({
      element: this_element,
      dirty: true,
    });
  }

  // Edit Column Required
  editColumnRequired(option_index, e) {
    const this_element = this.state.element;
    if (!!this_element.options[option_index].required) {
      delete (this_element.options[option_index].required);
    } else {
      this_element.options[option_index].required = true;
    }
    this.setState({ element: this_element });
    this.props.updateElement.call(this.props.preview, this_element);
  }

   updateOption() {
     const this_element = this.state.element;
     // to prevent ajax calls with no change
     if (this.state.dirty) {
       this.props.updateElement.call(this.props.preview, this_element);
       this.setState({ dirty: false });
     }
   }

   addOption(index) {
     const this_element = this.state.element;
    //  this_element.options.splice(index + 1, 0, { value: '', text: '', key: ID.uuid() });
    let optionAdd = {
      value: '',
      text: '',
      key: ID.uuid()
     };
     if(this_element.element === "TableInput") {
      let col = this_element.options.length;
      const resChildItems = [];
      let multiple = 0;
      for (let i = 0; i < this_element.childItems.length; i++) {
        resChildItems.push(this_element.childItems[i]);
        if(i == index + col * multiple) {
          resChildItems.push(null);
          multiple++;
        }
      }
      this_element.childItems = resChildItems;
      optionAdd.value = 'column_' + (this_element.options.length + 1);
      optionAdd.required = false;
      optionAdd.description = '';
     } else {
      optionAdd.value = parseInt(getMaxWithAttrName(this_element.options, 'value')) + 1;
     }
     this_element.options.splice(index + 1, 0, optionAdd);
     this.props.updateElement.call(this.props.preview, this_element);
   }

   removeOption(index) {
     const this_element = this.state.element;
     if(this_element.element === "TableInput") {
      let col = this_element.options.length;
      const resChildItems = [];
      let multiple = 0;
      for (let i = 0; i < this_element.childItems.length; i++) {
        if(i == index + col * multiple) {
          multiple++;
        } else {
          resChildItems.push(this_element.childItems[i]);
        }
      }
      this_element.childItems = resChildItems;
     }
     this_element.options.splice(index, 1);
     this.props.updateElement.call(this.props.preview, this_element);
   }

   dragDropOptions(dragIndex, hoverIndex) {
    const this_element = this.state.element;

    // Create a copy of the list to avoid changing the original data if necessary.
    const updatedOptions = [...this_element.options];

    // Get the element at the dragIndex position.
    const draggedItem = updatedOptions[dragIndex];

    // Remove the element at dragIndex from the list.
    updatedOptions.splice(dragIndex, 1);

    // Add that element to the hoverIndex position.
    updatedOptions.splice(hoverIndex, 0, draggedItem);

    this_element.options = updatedOptions;
    this.props.updateElement.call(this.props.preview, this_element);
   }

   render() {
     if (this.state.dirty) {
       this.state.element.dirty = true;
     }
     return (
       <div className="dynamic-option-list">
         <ul>
           <li>
             <div className="row">
                {this.props.element.element === "TableInput" ? (
                  <div className="col-sm-6"><b><IntlMessages id='columns' /></b></div>
                ) : (
                  <div className="col-sm-6"><b><IntlMessages id='options' />&nbsp;<span className="text-danger">*</span></b></div>
                )}
               {/* <div className="col-sm-6"><b><IntlMessages id='options' /></b></div> */}
               { this.props.canHaveOptionValue &&
              //  <div className="col-sm-2"><b><IntlMessages id='value' /></b></div> }
               <div className="col-sm-2"><b><IntlMessages id='value' />&nbsp;<span className="text-danger">*</span></b></div> }
               { this.props.canHaveOptionValue && this.props.canHaveOptionCorrect &&
               <div className="col-sm-4"><b><IntlMessages id='correct' /></b></div> }
               {
                !!this.props.canHaveOptionDescription &&
                <div className="col-sm-2"><b><IntlMessages id='description' /></b></div>
              }
              {
                !!this.props.canHaveOptionRequired &&
                <div className="col-sm-4"><b><IntlMessages id='required' /></b></div>
              }
             </div>
           </li>
           {
             this.props.element.options.map((option, index) => {
               const this_key = `edit_${option.key}`;
              //  const val = (option.value !== this._setValue(option.text)) ? option.value : '';
              //  return (
              //    <li className="clearfix" key={this_key}>
              //      <div className="row">
              //        <div className="col-sm-6">
              //          <input tabIndex={index + 1} className="form-control" style={{ width: '100%' }} type="text" name={`text_${index}`} placeholder="Option text" value={option.text} onBlur={this.updateOption.bind(this)} onChange={this.editOption.bind(this, index)} />
              //        </div>
              //        { this.props.canHaveOptionValue &&
              //        <div className="col-sm-2">
              //          <input className="form-control" type="text" name={`value_${index}`} value={val} onChange={this.editValue.bind(this, index)} />
              //        </div> }
              //        { this.props.canHaveOptionValue && this.props.canHaveOptionCorrect &&
              //        <div className="col-sm-1">
              //          <input className="form-control" type="checkbox" value="1" onChange={this.editOptionCorrect.bind(this, index)} checked={option.hasOwnProperty('correct')} />
              //        </div> }
              //        <div className="col-sm-3">
              //          <div className="dynamic-options-actions-buttons">
              //            <button onClick={this.addOption.bind(this, index)} className="btn btn-success"><i className="fas fa-plus-circle"></i></button>
              //            { index > 0
              //              && <button onClick={this.removeOption.bind(this, index)} className="btn btn-danger"><i className="fas fa-minus-circle"></i></button>
              //            }
              //          </div>
              //        </div>
              //      </div>
              //    </li>
              //  );
              const val = option.value;
              const description = option.description || '';
              return (
              <DraggableOptions
                key={this_key}
                index={index}
                moveRow={this.dragDropOptions}
                disableDragDrop={this.props.element.element == "TableInput"}
                option={option}
                val={val}
                description={description}
                onBlurText={this.updateOption.bind(this)}
                onChangeText={this.editOption.bind(this, index)}
                canHaveOptionValue={this.props.canHaveOptionValue}
                canHaveOptionCorrect={this.props.canHaveOptionCorrect}
                onChangeValue={this.editValue.bind(this, index)}
                onChangeOptionCorrect={this.editOptionCorrect.bind(this, index)}
                onClickAddOption={this.addOption.bind(this, index)}
                onClickRemoveOption={this.removeOption.bind(this, index)}
                onChangeColumnDescription={this.editColumnDescription.bind(this, index)}
                canHaveOptionRequired={this.props.canHaveOptionRequired}
                canHaveOptionDescription={this.props.canHaveOptionDescription}
                onChangeColumnRequired={this.editColumnRequired.bind(this, index)}
                />
              );
             })
           }
         </ul>
       </div>
     );
   }
 }
