/**
  * <Toolbar />
  */

import React from 'react';
import { injectIntl } from 'react-intl';
import ToolbarItem from './toolbar-draggable-item';
import ToolbarGroupItem from './toolbar-group-item';

import ID from './UUID';
import store from './stores/store';
import { groupBy } from './functions';
import { getMaxItemNumberFromFieldCode } from './commons';

// function isDefaultItem(item) {
//   const keys = Object.keys(item);
//   return keys.filter(x => x !== 'element' && x !== 'key' && x !== 'group_name').length === 0;
// }

function buildItems(items, defaultItems) {
  if (!items) {
    return defaultItems;
  }
  return items.map(x => {
    let found = defaultItems.find(y => (x.element === y.element && y.key === x.key));
    if (!found) {
      found = defaultItems.find(y => (x.element || x.key) === (y.element || y.key));
    }
    if (found) {
      if (x.inherited !== false) {
        found = { ...found, ...x };
      } else if (x.group_name) {
        found.group_name = x.group_name;
      }
    }
    return found || x;
  });
}

function buildGroupItems(allItems) {
  const items = allItems.filter(x => !x.group_name);
  const gItems = allItems.filter(x => !!x.group_name);
  const grouped = groupBy(gItems, x => x.group_name);
  const groupKeys = gItems.map(x => x.group_name)
    .filter((v, i, self) => self.indexOf(v) === i);
  return { items, grouped, groupKeys };
}

class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    const { intl } = this.props;
    const items = buildItems(props.items, this._defaultItems(intl));
    this.state = {
      items,
    };
    this.create = this.create.bind(this);
  }

  componentDidMount() {
    store.subscribe(state => this.setState({ store: state }));
  }

  static _defaultItemOptions(element, intl) {
    switch (element) {
      case 'Dropdown':
        return [
          { value: '1', text: intl.formatMessage({ id: 'sample-1' }), key: `${ID.uuid()}` },
          { value: '2', text: intl.formatMessage({ id: 'sample-2' }), key: `${ID.uuid()}` },
          { value: '3', text: intl.formatMessage({ id: 'sample-3' }), key: `${ID.uuid()}` },
        ];
      case 'MultiSelect':
        return [
          { value: '1', text: intl.formatMessage({ id: 'sample-1' }), key: `${ID.uuid()}` },
          { value: '2', text: intl.formatMessage({ id: 'sample-2' }), key: `${ID.uuid()}` },
          { value: '3', text: intl.formatMessage({ id: 'sample-3' }), key: `${ID.uuid()}` },
        ];
      case 'TableInput':
        return [
          { value: 'column_1', text: intl.formatMessage({ id: 'column-1' }), key: `${ID.uuid()}`, required : false, description : '' },
          { value: 'column_2', text: intl.formatMessage({ id: 'column-2' }), key: `${ID.uuid()}`, required : false, description : '' },
          { value: 'column_3', text: intl.formatMessage({ id: 'column-3' }), key: `${ID.uuid()}`, required : false, description : '' },
        ];
      case 'Tags':
        return [
          { value: '1', text: intl.formatMessage({ id: 'place-holder-tag-1' }), key: `${ID.uuid()}` },
          { value: '2', text: intl.formatMessage({ id: 'place-holder-tag-2' }), key: `${ID.uuid()}` },
          { value: '3', text: intl.formatMessage({ id: 'place-holder-tag-3' }), key: `${ID.uuid()}` },
        ];
      case 'Checkboxes':
        return [
          { value: '1', text: intl.formatMessage({ id: 'sample-1' }), key: `${ID.uuid()}` },
          { value: '2', text: intl.formatMessage({ id: 'sample-2' }), key: `${ID.uuid()}` },
          { value: '3', text: intl.formatMessage({ id: 'sample-3' }), key: `${ID.uuid()}` },
        ];
      case 'RadioButtons':
        return [
          { value: '1', text: intl.formatMessage({ id: 'sample-1' }), key: `${ID.uuid()}` },
          { value: '2', text: intl.formatMessage({ id: 'sample-2' }), key: `${ID.uuid()}` },
          { value: '3', text: intl.formatMessage({ id: 'sample-3' }), key: `${ID.uuid()}` },
        ];
      default:
        return [];
    }
  }

  _defaultItems(intl) {
    return [
      {
        key: 'Header',
        name: intl.formatMessage({ id: 'header-text' }),
        icon: 'fas fa-heading',
        static: true,
        content: intl.formatMessage({ id: 'place-holder-text' }),
        field_name: 'header_',
        field_code : intl.formatMessage({ id: 'header-text' }).replace(/\s+/g, '') + '_',
      },
      {
        key: 'Label',
        name: intl.formatMessage({ id: 'label' }),
        static: true,
        icon: 'fas fa-font',
        content: intl.formatMessage({ id: 'place-holder-text' }),
        field_name: 'label_',
        field_code : intl.formatMessage({ id: 'label' }).replace(/\s+/g, '') + '_',
      },
      {
        key: 'Paragraph',
        name: intl.formatMessage({ id: 'paragraph' }),
        static: true,
        icon: 'fas fa-paragraph',
        content: intl.formatMessage({ id: 'place-holder-text' }),
        field_name: 'paragraph_',
        field_code : intl.formatMessage({ id: 'paragraph' }).replace(/\s+/g, '') + '_',
      },
      {
        key: 'LineBreak',
        name: intl.formatMessage({ id: 'line-break' }),
        static: true,
        icon: 'fas fa-arrows-alt-h',
        field_name: 'line_break_',
        field_code : intl.formatMessage({ id: 'line-break' }).replace(/\s+/g, '') + '_',
      },
      {
        key: 'TableInput',
        canHaveAnswer: true,
        canPopulateFromApi : false,
        canHaveOptionValue : false,
        canHaveOptionRequired : true,
        canHaveOptionDescription : true,
        name: intl.formatMessage({ id: 'table-input' }),
        label: intl.formatMessage({ id: 'table-input' }),
        icon: 'fas fa-table',
        field_name: 'table_input_',
        field_code : intl.formatMessage({ id: 'table-input' }).replace(/\s+/g, '') + '_',
        options: [],
        rowCount: 1,
        prevRowCount: 1,
      },
      {
        key: 'Dropdown',
        canHaveAnswer: true,
        name: intl.formatMessage({ id: 'dropdown' }),
        icon: 'far fa-caret-square-down',
        label: intl.formatMessage({ id: 'place-holder-label' }),
        field_name: 'dropdown_',
        options: [],
        field_code : intl.formatMessage({ id: 'dropdown' }).replace(/\s+/g, '') + '_',
      },
      {
        key: 'MultiSelect',
        canHaveAnswer: true,
        name: intl.formatMessage({ id: 'multiselect' }),
        icon: 'fas fa-caret-square-down',
        label: intl.formatMessage({ id: 'multiselect' }),
        field_name: 'multiselect_',
        field_code : intl.formatMessage({ id: 'multiselect' }).replace(/\s+/g, '') + '_',
        options: [],
        overrideStrings : {
          search : intl.formatMessage({ id: 'search' }),
          allItemsAreSelected: intl.formatMessage({ id: 'allItemsAreSelected' }),
          clearSearch: intl.formatMessage({ id: 'clearSearch' }),
          clearSelected: intl.formatMessage({ id: 'clearSelected' }),
          noOptions: intl.formatMessage({ id: 'noOptions' }),
          selectAll: intl.formatMessage({ id: 'selectAll' }),
          selectAllFiltered: intl.formatMessage({ id: 'selectAllFiltered' }),
          selectSomeItems: intl.formatMessage({ id: 'selectSomeItems' }),
          create: intl.formatMessage({ id: 'create' }),
        },
      },
      {
        key: 'Tags',
        canHaveAnswer: true,
        name: intl.formatMessage({ id: 'tags' }),
        icon: 'fas fa-tags',
        label: intl.formatMessage({ id: 'place-holder-label' }),
        field_name: 'tags_',
        options: [],
        field_code : intl.formatMessage({ id: 'tags' }).replace(/\s+/g, '') + '_',
      },
      {
        key: 'Checkboxes',
        canHaveAnswer: true,
        name: intl.formatMessage({ id: 'checkboxes' }),
        icon: 'far fa-check-square',
        label: intl.formatMessage({ id: 'place-holder-label' }),
        field_name: 'checkboxes_',
        options: [],
        field_code : intl.formatMessage({ id: 'checkboxes' }).replace(/\s+/g, '') + '_',
      },
      {
        key: 'RadioButtons',
        canHaveAnswer: true,
        name: intl.formatMessage({ id: 'multiple-choice' }),
        icon: 'far fa-dot-circle',
        label: intl.formatMessage({ id: 'place-holder-label' }),
        field_name: 'radiobuttons_',
        options: [],
        field_code : intl.formatMessage({ id: 'multiple-choice' }).replace(/\s+/g, '') + '_',
      },
      {
        key: 'TextInput',
        canHaveAnswer: true,
        name: intl.formatMessage({ id: 'text-input' }),
        label: intl.formatMessage({ id: 'place-holder-label' }),
        icon: 'fas fa-font',
        field_name: 'text_input_',
        field_code : intl.formatMessage({ id: 'text-input' }).replace(/\s+/g, '') + '_',
      },
      {
        key: 'EmailInput',
        canHaveAnswer: true,
        name: intl.formatMessage({ id: 'email-input' }),
        label: intl.formatMessage({ id: 'place-holder-email' }),
        icon: 'fas fa-envelope',
        field_name: 'email_input_',
        field_code : intl.formatMessage({ id: 'email-input' }).replace(/\s+/g, '') + '_',
      },
      {
        key: 'NumberInput',
        canHaveAnswer: true,
        name: intl.formatMessage({ id: 'number-input' }),
        label: intl.formatMessage({ id: 'place-holder-label' }),
        icon: 'fas fa-plus',
        field_name: 'number_input_',
        field_code : intl.formatMessage({ id: 'number-input' }).replace(/\s+/g, '') + '_',
      },
      {
        key: 'PhoneNumber',
        canHaveAnswer: true,
        name: intl.formatMessage({ id: 'phone-input' }),
        label: intl.formatMessage({ id: 'place-holder-phone-number' }),
        icon: 'fas fa-phone',
        field_name: 'phone_input_',
        field_code : intl.formatMessage({ id: 'phone-input' }).replace(/\s+/g, '') + '_',
      },
      {
        key: 'TextArea',
        canHaveAnswer: true,
        name: intl.formatMessage({ id: 'multi-line-input' }),
        label: intl.formatMessage({ id: 'place-holder-label' }),
        icon: 'fas fa-text-height',
        field_name: 'text_area_',
        field_code : intl.formatMessage({ id: 'multi-line-input' }).replace(/\s+/g, '') + '_',
      },
      {
        key: 'FieldSet',
        canHaveAnswer: false,
        name: intl.formatMessage({ id: 'fieldset' }),
        label: intl.formatMessage({ id: 'fieldset' }),
        icon: 'fas fa-bars',
        field_name: 'fieldset-element',
        field_code : intl.formatMessage({ id: 'fieldset' }).replace(/\s+/g, '') + '_',
      },
      {
        key: 'TwoColumnRow',
        canHaveAnswer: false,
        name: intl.formatMessage({ id: 'two-columns-row' }),
        label: '',
        icon: 'fas fa-columns',
        field_name: 'two_col_row_',
        field_code : intl.formatMessage({ id: 'two-columns-row' }).replace(/\s+/g, '') + '_',
      },
      {
        key: 'ThreeColumnRow',
        canHaveAnswer: false,
        name: intl.formatMessage({ id: 'three-columns-row' }),
        label: '',
        icon: 'fas fa-columns',
        field_name: 'three_col_row_',
        field_code : intl.formatMessage({ id: 'three-columns-row' }).replace(/\s+/g, '') + '_',
      },
      {
        key: 'FourColumnRow',
        element: 'MultiColumnRow',
        canHaveAnswer: false,
        name: intl.formatMessage({ id: 'four-columns-row' }),
        label: '',
        icon: 'fas fa-columns',
        field_name: 'four_col_row_',
        col_count: 4,
        class_name: 'col-md-3',
        field_code : intl.formatMessage({ id: 'four-columns-row' }).replace(/\s+/g, '') + '_',
      },
      {
        key: 'FiveColumnRow',
        element: 'MultiColumnRow',
        canHaveAnswer: false,
        name: intl.formatMessage({ id: 'five-columns-row' }),
        label: '',
        icon: 'fas fa-columns',
        field_name: 'five_col_row_',
        col_count: 5,
        class_name: 'col',
        field_code : intl.formatMessage({ id: 'five-columns-row' }).replace(/\s+/g, '') + '_',
      },
      {
        key: 'SixColumnRow',
        element: 'MultiColumnRow',
        canHaveAnswer: false,
        name: intl.formatMessage({ id: 'six-columns-row' }),
        label: '',
        icon: 'fas fa-columns',
        field_name: 'six_col_row_',
        col_count: 6,
        class_name: 'col-md-2',
        field_code : intl.formatMessage({ id: 'six-columns-row' }).replace(/\s+/g, '') + '_',
      },
      {
        key: 'Image',
        name: intl.formatMessage({ id: 'image' }),
        label: '',
        icon: 'far fa-image',
        field_name: 'image_',
        src: '',
        field_code : intl.formatMessage({ id: 'image' }).replace(/\s+/g, '') + '_',
      },
      {
        key: 'Rating',
        canHaveAnswer: true,
        name: intl.formatMessage({ id: 'rating' }),
        label: intl.formatMessage({ id: 'place-holder-label' }),
        icon: 'fas fa-star',
        field_name: 'rating_',
        field_code : intl.formatMessage({ id: 'rating' }).replace(/\s+/g, '') + '_',
      },
      {
        key: 'DatePicker',
        canDefaultToday: true,
        canReadOnly: true,
        dateFormat: 'MM/dd/yyyy',
        timeFormat: 'hh:mm aa',
        showTimeSelect: false,
        showTimeSelectOnly: false,
        showTimeInput: false,
        name: intl.formatMessage({ id: 'date' }),
        icon: 'far fa-calendar-alt',
        label: intl.formatMessage({ id: 'place-holder-label' }),
        field_name: 'date_picker_',
        field_code : intl.formatMessage({ id: 'date' }).replace(/\s+/g, '') + '_',
      },
      {
        key: 'TimeInput',
        canHaveAnswer: true,
        name: intl.formatMessage({ id: 'time-input' }),
        label: intl.formatMessage({ id: 'time-input' }),
        icon: 'fas fa-clock',
        field_name: 'time_input_',
        field_code : intl.formatMessage({ id: 'time-input' }).replace(/\s+/g, '') + '_',
      },
      {
        key: 'Signature',
        canReadOnly: true,
        name: intl.formatMessage({ id: 'signature' }),
        icon: 'fas fa-pen-square',
        label: intl.formatMessage({ id: 'signature' }),
        field_name: 'signature_',
        field_code : intl.formatMessage({ id: 'signature' }).replace(/\s+/g, '') + '_',
      },
      {
        key: 'HyperLink',
        name: intl.formatMessage({ id: 'website' }),
        icon: 'fas fa-link',
        static: true,
        content: intl.formatMessage({ id: 'place-holder-website-link' }),
        href: 'http://www.example.com',
        field_name: 'hyper_link_',
        field_code : intl.formatMessage({ id: 'website' }).replace(/\s+/g, '') + '_',
      },
      {
        key: 'Download',
        name: intl.formatMessage({ id: 'file-attachment' }),
        icon: 'fas fa-file',
        static: true,
        content: intl.formatMessage({ id: 'place-holder-file-name' }),
        field_name: 'download_',
        file_path: '',
        _href: '',
        field_code : intl.formatMessage({ id: 'file-attachment' }).replace(/\s+/g, '') + '_',
      },
      {
        key: 'Range',
        name: intl.formatMessage({ id: 'range' }),
        icon: 'fas fa-sliders-h',
        label: intl.formatMessage({ id: 'place-holder-label' }),
        field_name: 'range_',
        step: 1,
        default_value: 3,
        min_value: 1,
        max_value: 5,
        min_label: intl.formatMessage({ id: 'easy' }),
        max_label: intl.formatMessage({ id: 'difficult' }),
        field_code : intl.formatMessage({ id: 'range' }).replace(/\s+/g, '') + '_',
      },
      {
        key: 'Camera',
        name: intl.formatMessage({ id: 'camera' }),
        icon: 'fas fa-camera',
        label: intl.formatMessage({ id: 'place-holder-label' }),
        field_name: 'camera_',
        field_code : intl.formatMessage({ id: 'camera' }).replace(/\s+/g, '') + '_',
      },
      {
        key: 'FileUpload',
        name: intl.formatMessage({ id: 'file-upload' }),
        icon: 'fas fa-file',
        label: intl.formatMessage({ id: 'place-holder-label' }),
        field_name: 'file_upload_',
        field_code : intl.formatMessage({ id: 'file-upload' }).replace(/\s+/g, '') + '_',
      },
    ];
  }

  addCustomOptions(item, elementOptions) {
    if (item.type === 'custom') {
      const customOptions = Object.assign({}, item, elementOptions);
      customOptions.custom = true;
      customOptions.component = item.component || null;
      customOptions.custom_options = item.custom_options || [];
      return customOptions;
    }
    return elementOptions;
  }

  create(item) {
    const { intl } = this.props;
    const elementKey = item.element || item.key;
    const elementOptions = this.addCustomOptions(item, {
      id: ID.uuid(),
      element: elementKey,
      text: item.name,
      group_name: item.group_name,
      static: item.static,
      required: false,
      showDescription: item.showDescription,
    });

    if (this.props.showDescription === true && !item.static) {
      elementOptions.showDescription = true;
    }

    if (item.static) {
      elementOptions.bold = false;
      elementOptions.italic = false;
    }

    if (item.canHaveAnswer) { elementOptions.canHaveAnswer = item.canHaveAnswer; }

    if (item.canReadOnly) { elementOptions.readOnly = false; }

    if (item.canDefaultToday) { elementOptions.defaultToday = false; }

    if (item.content) { elementOptions.content = item.content; }

    if (item.href) { elementOptions.href = item.href; }

    if (item.inherited !== undefined) { elementOptions.inherited = item.inherited; }

    elementOptions.canHavePageBreakBefore = item.canHavePageBreakBefore !== false;
    elementOptions.canHaveAlternateForm = item.canHaveAlternateForm !== false;
    elementOptions.canHaveDisplayHorizontal = item.canHaveDisplayHorizontal !== false;
    if (elementOptions.canHaveDisplayHorizontal) {
      elementOptions.inline = item.inline;
    }
    elementOptions.canHaveOptionCorrect = item.canHaveOptionCorrect !== false;
    elementOptions.canHaveOptionValue = item.canHaveOptionValue !== false;
    elementOptions.canPopulateFromApi = item.canPopulateFromApi !== false;
    elementOptions.canHaveOptionRequired = !!item.canHaveOptionRequired;
    elementOptions.canHaveOptionDescription = !!item.canHaveOptionDescription;

    if (item.class_name) {
      elementOptions.class_name = item.class_name;
    }

    if (elementKey === 'Image') {
      elementOptions.src = item.src;
    }

    if (elementKey === 'DatePicker') {
      elementOptions.dateFormat = item.dateFormat;
      elementOptions.timeFormat = item.timeFormat;
      elementOptions.showTimeSelect = item.showTimeSelect;
      elementOptions.showTimeSelectOnly = item.showTimeSelectOnly;
      elementOptions.showTimeInput = item.showTimeInput;
    }

    if (elementKey === 'Download') {
      elementOptions._href = item._href;
      elementOptions.file_path = item.file_path;
    }

    if (elementKey === 'Range') {
      elementOptions.step = item.step;
      elementOptions.default_value = item.default_value;
      elementOptions.min_value = item.min_value;
      elementOptions.max_value = item.max_value;
      elementOptions.min_label = item.min_label;
      elementOptions.max_label = item.max_label;
    }

    if (item.element === 'MultiColumnRow') {
      elementOptions.col_count = item.col_count;
    }

    if(elementKey === 'TableInput') {
      elementOptions.rowCount = item.rowCount;
      elementOptions.prevRowCount = item.prevRowCount;
    }

    if(elementKey === 'MultiSelect') {
      elementOptions.overrideStrings = item.overrideStrings ;
    }

    if(elementKey === 'NumberInput') {
      elementOptions.canDisplayThousandSeparators = item.canDisplayThousandSeparators !== false ;
      elementOptions.numberOfDecimalPlace = item.numberOfDecimalPlace || 0;
      elementOptions.unitSymbol = item.unitSymbol || '';
      elementOptions.unitSymbolPrefix = item.unitSymbolPrefix !== false;
      elementOptions.unitSymbolSuffix = item.unitSymbolSuffix || false;
    }

    if (item.defaultValue) { elementOptions.defaultValue = item.defaultValue; }

    if (item.field_name) { elementOptions.field_name = item.field_name + ID.uuid(); }

    let maxItemNumberFromFieldCode = getMaxItemNumberFromFieldCode(this.state.store?.data);
    elementOptions.field_code = item.field_code + (maxItemNumberFromFieldCode + 1);

    elementOptions.description = "";

    if (item.label) { elementOptions.label = item.label; }

    if (item.options) {
      if (item.options.length > 0) {
        elementOptions.options = item.options.map(x => ({ ...x, key: `custom_option_${ID.uuid()}` }));
      } else {
        elementOptions.options = Toolbar._defaultItemOptions(elementOptions.element, intl);
      }
    }

    return elementOptions;
  }

  _onClick(item) {
    // ElementActions.createElement(this.create(item));
    store.dispatch('create', this.create(item));
  }

  renderItem = (item) => (<ToolbarItem data={item} key={item.key} onClick={this._onClick.bind(this, item)} onCreate={this.create} />)

  render() {
    const { items, grouped, groupKeys } = buildGroupItems(this.state.items);
    return (
      <div className="col-md-3 react-form-builder-toolbar float-right">
        <h4>{this.props.intl.formatMessage({ id: 'toolbox' })}</h4>
        <ul>
          {
            items.map(this.renderItem)
          }
          {
            groupKeys.map(k => <ToolbarGroupItem key={k} name={k} group={grouped.get(k)} renderItem={this.renderItem} />)
          }
        </ul>
      </div>
    );
  }
}

export default injectIntl(Toolbar);
