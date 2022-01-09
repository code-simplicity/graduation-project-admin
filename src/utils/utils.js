import moment from "moment";
import SparkMD5 from "spark-md5";
// 日期格式化
export function dateFormat(row, column) {
  const date = row[column.property];
  if (date === undefined) {
    return "";
  }
  return moment(date).format("YYYY-MM-DD HH:mm:ss");
}

// 判断是否有文件
export const hasFile = (file, size) => {
  // 每个分片的大小,设置1m
  const chunkSize = size;
  // 使用Blob.slice进行文件的切割
  const blobSlice =
    File.prototype.slice ||
    File.prototype.mozSlice ||
    File.prototype.webkitSlice;
  return new Promise((resolve, reject) => {
    const chunks = Math.ceil(file.size / chunkSize);
    let currentChunk = 0;
    const spark = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();
    const loadNext = () => {
      const start = currentChunk * chunkSize;
      const end =
        start + chunkSize >= file.size ? file.size : start + chunkSize;
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    };
    fileReader.onload = (e) => {
      spark.append(e.target.result); // Append array buffer
      currentChunk += 1;
      if (currentChunk < chunks) {
        loadNext();
      } else {
        console.log("finished loading");
        const result = spark.end();
        // 如果单纯的使用result 作为hash值的时候, 如果文件内容相同，而名称不同的时候
        // 想保留两个文件无法保留。所以把文件名称加上。
        const sparkMd5 = new SparkMD5();
        sparkMd5.append(result);
        sparkMd5.append(file.name);
        const hexHash = sparkMd5.end();
        console.log(`hexHash`, hexHash);
        resolve(hexHash);
      }
    };
    fileReader.onerror = () => {
      console.warn("文件读取失败！");
    };
    loadNext();
  }).catch((err) => {
    console.log(err);
    reject(err);
  });
};
