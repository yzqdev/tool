export function formatDuring(mss: number) {
  let hours =Math.floor((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes =  Math.floor((mss % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((mss % (1000 * 60)) / 1000) ;
  let ms=Math.floor(mss)
  console.log(hours,minutes,seconds);
  return (hours == 0 ? "" : `${hours}小时`) + (minutes == 0 ? "" : `${minutes}分钟`) + (seconds == 0 ? `` : `${seconds}秒`) + (seconds == 0?`${ms}毫秒`:``);
}
