/***
 * wqw
 * 2022-8-10 、保留几位小数
 * ***/ 
export const ggToFixed = (number, m) => {
    if (typeof number !== 'number') {
      throw new Error(`number不是数字: ${number}`);
    }
    let result = Math.round(Math.pow(10, m) * number) / Math.pow(10, m);
    result = String(result);
    if (result.indexOf(".") === -1) {
      if(m !== 0){
        result += ".";
        result += new Array(m + 1).join('0');
      }
    } else {
      let arr = result.split('.');
      if (arr[1].length < m) {
        arr[1] += new Array(m - arr[1].length + 1).join('0')
      }
      result = arr.join('.')
    }
    return result
  }
  /***
 * wqw
 * 2022-8-10 、判空处理
 * ***/ 
  export const ggFormatStr = (str, sign) => {
    let tem = str ?? '';
    return tem.trim ==null || tem.trim =='' || tem.trim ==undefined ? (sign ?? '--') : tem;
  };
  
  /***
   * 时间戳转化为日期
   * ***/ 

  export const ggTimestamp =(timestamp)=>{
    var date = new Date(parseInt(timestamp)); //时间戳13位需要乘以1000
    var Year = date.getFullYear();
    var Moth = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var Day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
    var Hour = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
    var Minute = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    // var Sechond = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    // var  GMT =  Year + '-' + Moth + '-' + Day + '   '+ Hour +':'+ Minute  + ':' + Sechond;
    var  GMT =  Year + '-' + Moth + '-' + Day + '   '+ Hour +':'+ Minute;
    return GMT;
  }