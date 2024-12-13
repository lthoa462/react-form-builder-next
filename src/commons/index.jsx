export const isNumeric = (value) => {
    return /^-?\d+$/.test(value);
};

export const getMaxWithAttrName = (data, attrName) => {
    let res = 0;
    if (Array.isArray(data)) {
        const numericItemNos = data
            .filter(item => isNumeric(item[attrName]))  // Check if the value of attrName is a number
            .map(item => parseInt(item[attrName], 10)); // Convert the value to an integer

        // Find the largest value if there are valid values
        const itemNo = numericItemNos.length > 0 ? Math.max(...numericItemNos) : null;
        return res = itemNo || 0;
    }
    return res;
}

// 他のコントロールを含める　でコントロール一覧（ドラッグ・ドロップ　する）
export const ContainerList = [
    "TwoColumnRow",
    "ThreeColumnRow",
    "MultiColumnRow",
    "FieldSet",
    "FourColumnRow",
    "FiveColumnRow",
    "SixColumnRow",
    "MultiColumnRow",
    "TableInput",
];

// removeDuplicates
export const removeDuplicates = (list) => {
    const uniqueList = [...new Set(list)];
    return uniqueList.sort();
}

// TaskData
// After adding a row for 'TableInput', it is necessary to check and ensure that the elements are unique
export const taskDataIsUnique = (taskData) => {
  var idDeletes = [];
  taskData.forEach((item) => {
    if (Array.isArray(item.options) && item.element === "TableInput") {
      taskData.forEach((itemChild) => {
        if (itemChild.parentId == item.id) {
          var filteredOptions = item.options.filter(s => s.key === itemChild.columnKey);
          if(filteredOptions.length <= 0) {
            idDeletes.push(itemChild.id);
          }
        }
      });
    }
  });
  let res = taskData.filter(item => !idDeletes.includes(item.id));
  return res;
}

// Retrieve the last numeric value in fieldCode
export const getMaxItemNumberFromFieldCode = (data) => {
  if(!Array.isArray(data)) return 0;
  const maxNumber = Math.max(
    ...data
      .map(item => {
        const parts = item.field_code.split('_');
        return parts.length > 1 ? parseInt(parts.pop(), 10) : -Infinity;
      })
      .filter(num => !isNaN(num))
  );
  return maxNumber === -Infinity ? 0 : maxNumber;
}

export const isValidURL = (string) => {
  try {
      new URL(string);
      return true;
  } catch (_) {
      return false;
  }
}