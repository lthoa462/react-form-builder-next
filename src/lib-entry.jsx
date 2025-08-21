import React from 'react';
import ReactDOM from 'react-dom';

// Lấy export từ file gốc của bạn
import FormBuilders, {
  ReactFormBuilder,
  ReactFormGenerator,
  ElementStore,
  Registry,
} from './index.jsx';

// API mount cho React 17
export function renderBuilder(el, props = {}) {
  ReactDOM.render(<ReactFormBuilder {...props} />, el);
}

export function renderGenerator(el, props = {}) {
  ReactDOM.render(<ReactFormGenerator {...props} />, el);
}

export function unmount(el) {
  ReactDOM.unmountComponentAtNode(el);
}

// UMD export
const UmdAPI = {
  ReactFormBuilder,
  ReactFormGenerator,
  ElementStore,
  Registry,
  renderBuilder,
  renderGenerator,
  unmount,
};

export default UmdAPI;
