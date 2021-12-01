import moment from "moment";
// 日期格式化
export function dateFormat(row, column) {
  const date = row[column.property];
  if (date === undefined) {
    return "";
  }
  return moment(date).format("YYYY-MM-DD HH:mm:ss");
}
