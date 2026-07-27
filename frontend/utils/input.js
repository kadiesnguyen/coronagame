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
 * Chuyển giá trị chuỗi từ input thành số
 * @param {String} value
 * @return {Number} value
 */
export const convertInputTienCuoc = (value) => {
  let parseValue = parseInt(value);
  if (isNaN(parseValue)) {
    parseValue = 0;
  }
  return parseValue;
};
