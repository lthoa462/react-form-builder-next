/**
  * <Preview />
  */

import React from 'react';
import update from 'immutability-helper';
import store from './stores/store';
import FormElementsEdit from './form-dynamic-edit';
import SortableFormElements from './sortable-form-elements';
import CustomDragLayer from './form-elements/component-drag-layer';
import ID from './UUID';
import { ContainerList, getMaxItemNumberFromFieldCode } from './commons';

const { PlaceHolder } = SortableFormElements;

export default class Preview extends React.Component {
  state = {
    data: [],
    answer_data: {},
  };

  constructor(props) {
    super(props);

    const { onLoad, onPost } = props;
    store.setExternalHandler(onLoad, onPost);

    this.editForm = React.createRef();
    this.state = {
      data: props.data || [],
      answer_data: {},
    };
    this.seq = 0;

    this._onUpdate = this._onChange.bind(this);
    this.getDataById = this.getDataById.bind(this);
    this.moveCard = this.moveCard.bind(this);
    this.insertCard = this.insertCard.bind(this);
    this.setAsChild = this.setAsChild.bind(this);
    this.removeChild = this.removeChild.bind(this);
    this._onDestroy = this._onDestroy.bind(this);
    this.copyCard = this.copyCard.bind(this);
  }

  componentDidMount() {
    const { data, url, saveUrl, saveAlways } = this.props;
    store.subscribe(state => this._onUpdate(state.data));
    // store.dispatch('load', { loadUrl: url, saveUrl, data: data || [], saveAlways });
    this._onChange(store.state.data);
    document.addEventListener('mousedown', this.editModeOff);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.editModeOff);
  }

  editModeOff = (e) => {
    if (this.editForm.current && !this.editForm.current.contains(e.target)) {
      this.manualEditModeOff();
    }
  }

  manualEditModeOff = () => {
    const { editElement } = this.props;
    if (editElement && editElement.dirty) {
      editElement.dirty = false;
      this.updateElement(editElement);
    }
    this.props.manualEditModeOff();
  }

  _setValue(text) {
    return text.replace(/[^A-Z0-9]+/ig, '_').toLowerCase();
  }

  updateElement(element) {
    // const { data } = this.state;
    let { data } = this.state;
    let found = false;

    for (let i = 0, len = data.length; i < len; i++) {
      if (element.id === data[i].id) {
        data[i] = element;
        found = true;
      }
      if(!!data[i].parentId && !!data[i].column) {
        data[i].required = data[i].column.required;
        data[i].description = data[i].column.description;
      }
    }

    if (found) {
      this.seq = this.seq > 100000 ? 0 : this.seq + 1;
      store.dispatch('updateOrder', data);
    }
  }

  _onChange(data) {
    const answer_data = {};

    if(Array.isArray(data)) {
      data.forEach((item) => {
        if (item && item.readOnly && this.props.variables[item.variableKey]) {
          answer_data[item.field_name] = this.props.variables[item.variableKey];
        }
      });
    }

    this.setState({
      data,
      answer_data,
    });
  }

  _onDestroy(item) {
    if (item.childItems) {
      item.childItems.forEach(x => {
        const child = this.getDataById(x);
        if (child) {
          store.dispatch('delete', child);
        }
      });
    }
    store.dispatch('delete', item);
  }

  getDataById(id) {
    const { data } = this.state;
    return data.find(x => x && x.id === id);
  }

  swapChildren(data, item, child, col) {
    if (child.col !== undefined && item.id !== child.parentId) {
      return false;
    }
    if (!(child.col !== undefined && child.col !== col && item.childItems[col])) {
      // No child was assigned yet in both source and target.
      return false;
    }
    const oldId = item.childItems[col];
    const oldItem = this.getDataById(oldId);
    const oldCol = child.col;
    // eslint-disable-next-line no-param-reassign
    item.childItems[oldCol] = oldId; oldItem.col = oldCol;
    // eslint-disable-next-line no-param-reassign
    item.childItems[col] = child.id; child.col = col;
    store.dispatch('updateOrder', data);
    return true;
  }

  setAsChild(item, child, col, isBusy) {
    const { data } = this.state;
    if (this.swapChildren(data, item, child, col)) {
      return;
    } if (isBusy) {
      return;
    }
    // 9050: error add table in table
    // Những thành phần trong ContainerList thì ko thể là item con
    if (ContainerList.includes(item.element) && ContainerList.includes(child.element)) {
      return;
    }
    const oldParent = this.getDataById(child.parentId);
    const oldCol = child.col;
    // eslint-disable-next-line no-param-reassign
    item.childItems[col] = child.id; child.col = col;
    // eslint-disable-next-line no-param-reassign
    child.parentId = item.id;
    if(item.element === "TableInput") {
      child.column = item.options[parseInt(col) % parseInt(item.options.length)];
      child.required = child.column.required;
      child.description = child.column.description;
    }
    // eslint-disable-next-line no-param-reassign
    child.parentIndex = data.indexOf(item);
    if (oldParent) {
      oldParent.childItems[oldCol] = null;
    }
    const list = data.filter(x => x && x.parentId === item.id);
    const toRemove = list.filter(x => item.childItems.indexOf(x.id) === -1);
    let newData = data;
    if (toRemove.length) {
      // console.log('toRemove', toRemove);
      newData = data.filter(x => toRemove.indexOf(x) === -1);
    }
    if (!this.getDataById(child.id)) {
      newData.push(child);
    }
    store.dispatch('updateOrder', newData);
  }

  removeChild(item, col) {
    const { data } = this.state;
    const oldId = item.childItems[col];
    const oldItem = this.getDataById(oldId);
    if (oldItem) {
      const newData = data.filter(x => x !== oldItem);
      // eslint-disable-next-line no-param-reassign
      item.childItems[col] = null;
      // delete oldItem.parentId;
      this.seq = this.seq > 100000 ? 0 : this.seq + 1;
      store.dispatch('updateOrder', newData);
      this.setState({ data: newData });
    }
  }

  restoreCard(item, id) {
    const { data } = this.state;
    const parent = this.getDataById(item.data.parentId);
    const oldItem = this.getDataById(id);
    if (parent && oldItem) {
      const newIndex = data.indexOf(oldItem);
      const newData = [...data]; // data.filter(x => x !== oldItem);
      // eslint-disable-next-line no-param-reassign
      parent.childItems[oldItem.col] = null;
      delete oldItem.parentId;
      // eslint-disable-next-line no-param-reassign
      delete item.setAsChild;
      // eslint-disable-next-line no-param-reassign
      delete item.parentIndex;
      // eslint-disable-next-line no-param-reassign
      item.index = newIndex;
      this.seq = this.seq > 100000 ? 0 : this.seq + 1;
      store.dispatch('updateOrder', newData);
      this.setState({ data: newData });
    }
  }

  insertCard(item, hoverIndex, id) {
    const { data } = this.state;
    if (id) {
      this.restoreCard(item, id);
    } else {
      // 他の子コントロールを含めるで項目を確認
      if (ContainerList.includes(item.element)) {
        item.isContainer = true;
      }
      data.splice(hoverIndex, 0, item);
      this.saveData(item, hoverIndex, hoverIndex);
      store.dispatch('insertItem', item);
    }
  }

  // Copy Element
  copyElement(data, item, maxForFieldCode, columnsOld = null, columnsNew = null, parentId = null) {
    // Generate field_code
    let lastUnderscoreIndexInFieldCode = !!item.field_code ? item.field_code.lastIndexOf("_") : -1;
    let field_code_copy = item.field_code.substring(0, lastUnderscoreIndexInFieldCode) + "_" + (maxForFieldCode + 1);

    // Generate id
    let id_copy = ID.uuid();

    // Generate field_name
    let lastUnderscoreIndexInFieldName = !!item.field_name ? item.field_name.lastIndexOf("_") : -1;
    let field_name_copy = item.field_name.substring(0, lastUnderscoreIndexInFieldName) + "_" + ID.uuid();

    let item_copy = {
      ...item,
      id : id_copy,
      field_name : field_name_copy,
      field_code : field_code_copy
    }

    if(item.hasOwnProperty('parentId')) {
      item_copy.parentId = parentId;
    }

    if(item.hasOwnProperty('options')) {
      // Generate options
      let option_copy = [];
      item.options.forEach(itemOption => {
        option_copy.push({
          ...itemOption,
          key : ID.uuid()
        })
      });

      item_copy.options = option_copy;
    }

    if(Array.isArray(columnsOld) && Array.isArray(columnsNew) && item.hasOwnProperty('column')) {
      // Generate column
      let indexColumnOld = columnsOld.findIndex(itemColumnOld => itemColumnOld.key === item.column.key);
      item_copy.column = columnsNew[indexColumnOld];
    }

    return item_copy;
  }

  // Copy Card of Element
  copyCard(item) {
    const { data } = this.state;

    // Find position of item in data
    let indexItem = data.findIndex(itemData => itemData.id === item.id);
    if(indexItem < 0) {
      indexItem = 0;
    }

    let maxForFieldCode = getMaxItemNumberFromFieldCode(data);

    let item_copy = this.copyElement(data, item, maxForFieldCode);
    ++maxForFieldCode;

    let childItems_copy = [];
    if(item.hasOwnProperty('childItems')) {
      // Generate childItems Id List
      let childItems_id_copy = new Array(item.childItems.length).fill(null);
      item.childItems.forEach((child, index) => {
        if(!child) {
          childItems_id_copy[index] = null;
        } else {
          const itemChild = data.find(itemData => itemData.id === child);
          let columnsOld = item.options;
          let columnsNew = item_copy.options;
          let childItem_copy = this.copyElement(data, itemChild, maxForFieldCode, columnsOld, columnsNew, item_copy.id);
          ++maxForFieldCode;
          childItems_id_copy[index] = childItem_copy.id;
          childItems_copy.push(childItem_copy);
        }
      });
      item_copy.childItems = childItems_id_copy;
    }

    data.splice(indexItem + 1, 0, item_copy);
    this.saveData(item_copy, indexItem + 1, indexItem + 1, childItems_copy);
  }

  moveCard(dragIndex, hoverIndex) {
    const { data } = this.state;
    const dragCard = data[dragIndex];
    // happens sometimes when you click to insert a new item from the toolbox
    if (!!dragCard) {
      this.saveData(dragCard, dragIndex, hoverIndex);
    }
  }

  // eslint-disable-next-line no-unused-vars
  cardPlaceHolder(dragIndex, hoverIndex) {
    // Dummy
  }

  saveData(dragCard, dragIndex, hoverIndex, newCards = null) {
    let newData = [];
    if(Array.isArray(newCards)) {
      newData = update(this.state, {
        data: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
          $push: newCards,
        },
      });
    } else {
      newData = update(this.state, {
        data: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
        },
      });
    }
    this.setState(newData);
    store.dispatch('updateOrder', newData.data);
  }

  getElement(item, index) {
    if (item.custom) {
      if (!item.component || typeof item.component !== 'function') {
        // eslint-disable-next-line no-param-reassign
        item.component = this.props.registry.get(item.key);
      }
    }
    const SortableFormElement = SortableFormElements[item.element];

    if (SortableFormElement === null) {
      return null;
    }
    // return <SortableFormElement id={item.id} seq={this.seq} index={index} moveCard={this.moveCard} insertCard={this.insertCard} mutable={false} parent={this.props.parent} editModeOn={this.props.editModeOn} isDraggable={true} key={item.id} sortData={item.id} data={item} getDataById={this.getDataById} setAsChild={this.setAsChild} removeChild={this.removeChild} _onDestroy={this._onDestroy} />;
    return <SortableFormElement id={item.id} seq={this.seq} index={index} copyCard={this.copyCard} moveCard={this.moveCard} insertCard={this.insertCard} mutable={false} parent={this.props.parent} editModeOn={this.props.editModeOn} isDraggable={true} key={item.id} sortData={item.id} data={item} getDataById={this.getDataById} setAsChild={this.setAsChild} removeChild={this.removeChild} _onDestroy={this._onDestroy} />;
  }

  showEditForm() {
    const handleUpdateElement = (element) => this.updateElement(element);
    handleUpdateElement.bind(this);

    const formElementEditProps = {
      showCorrectColumn: this.props.showCorrectColumn,
      files: this.props.files,
      manualEditModeOff: this.manualEditModeOff,
      preview: this,
      element: this.props.editElement,
      updateElement: handleUpdateElement,
    };

    return this.props.renderEditForm(formElementEditProps);
  }

  render() {
    let classes = this.props.className;
    if (this.props.editMode) { classes += ' is-editing'; }
    const data = this.state.data.filter(x => !!x && !x.parentId);
    const items = data.map((item, index) => this.getElement(item, index));
    return (
      <div className={classes}>
        <div className="edit-form" ref={this.editForm}>
          {this.props.editElement !== null && this.showEditForm()}
        </div>
        <div className="Sortable">{items}</div>
        <PlaceHolder id="form-place-holder" show={items.length === 0} index={items.length} moveCard={this.cardPlaceHolder} insertCard={this.insertCard} />
        <CustomDragLayer/>
      </div>
    );
  }
}
Preview.defaultProps = {
  showCorrectColumn: false,
  files: [],
  editMode: false,
  editElement: null,
  className: 'col-md-9 react-form-builder-preview float-left',
  renderEditForm: props => <FormElementsEdit {...props} />,
};
