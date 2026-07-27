export const isNumberKey = (evt) => {
  var charCode = evt.which ? evt.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
};

export const validateNumber = (event) => {
  var key = window.event ? event.keyCode : event.which;
  if (event.keyCode === 8 || event.keyCode === 46) {
    return true;
  } else if (key < 48 || key > 57) {
    return false;
  } else {
    return true;
  }
};

/**
 * Chuyển giá trị chuỗi từ input thành số.
 * Chuỗi rỗng giữ "" để input clear số 0 khi focus (không ép về 0 ngay).
 * @param {String} value
 * @return {Number|String}
 */
export const convertInputTienCuoc = (value) => {
  if (value === "" || value === null || value === undefined) {
    return "";
  }
  const parseValue = parseInt(value, 10);
  if (isNaN(parseValue)) {
    return "";
  }
  return parseValue;
};
