export const JUST_NOW = 3000; //3s内
export const IN_SECOND = 1000 * 60; //一分钟
export const IN_MINUTE = 1000 * 60 * 60; //一小时
export const IN_HOUR = 1000 * 60 * 60 * 12; //12小时
export const IN_DAY = 1000 * 60 * 60 * 24 * 1; //1天
export const IN_MONTH = 1000 * 60 * 60 * 24 * 30; //1个月

export function updateTimeShow(time) {
  let localTime = new Date(); //当前系统时间
  let createTime = new Date(time) //消息创建时间
  let diff = localTime - createTime;
  if (diff <= JUST_NOW)
    return '刚刚';
  else if (diff <= IN_SECOND)
    return "1分钟内";
  else if (diff <= IN_MINUTE)
    return parseInt(diff / IN_SECOND) + '分钟前';
  else if (diff <= IN_MINUTE)
    return parseInt(diff / IN_MINUTE) + '小时前';
  else if (diff <= IN_HOUR * 2) {
    const list = createTime.toString().split(" ");
    const lastIndex = list[4].lastIndexOf(":")
    const realtime = list[4].toString().substring(0, lastIndex);
    return realtime;
  } else if (diff < IN_DAY * 7) {
    if (diff < IN_DAY) {
      return parseInt(diff / IN_HOUR) + '天前';
    }
    const t = createTime.toString().slice(0, 3);
    switch (t) {
      case "Mon":
        return '星期一';
      case "Tue":
        return '星期二';
      case "Wed":
        return '星期三';
      case "Thu":
        return '星期四';
      case "Fri":
        return '星期五';
      case "Sat":
        return '星期六';
      case "Sun":
        return '星期日';
    }
  } else if (diff < IN_MONTH * 24) {
    const list = createTime.toString().split(" ");
    const month = list[1];
    var realtime = "";
    if (diff < IN_MONTH) {
      realtime += getNumberMonth(month);
    } else {
      realtime = list[3] + "-" + getNumberMonth(month);
    }
    return realtime + "-" + list[2];
  }
}

export function getNumberMonth(month) {
  switch (month) {
    case "Jan":
      return "1";
    case "Feb":
      return "2";
    case "Mar":
      return "3";
    case "Apr":
      return "4";
    case "May":
      return "5";
    case "June":
      return "6";
    case "July":
      return "7";
    case "Aug":
      return "8";
    case "Sept":
      return "9";
    case "Oct":
      return "10";
    case "Nov":
      return "11";
    case "Dec":
      return "12";
  }
}