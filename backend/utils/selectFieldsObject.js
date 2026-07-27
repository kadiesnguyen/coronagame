const _ = require("lodash");

const selectFields = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};
const unSelectFields = ({ fields = [], object = {} }) => {
  console.log(_.omit(object, fields));
  return _.omit(object, fields);
};
module.exports = {
  selectFields,
  unSelectFields,
};
