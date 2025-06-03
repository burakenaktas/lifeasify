export default function ConvertMinutes(num: number, isUpcomingToDo?: boolean) {
  const d = Math.floor(num / 1440); // 60*24
  const h = Math.floor((num - d * 1440) / 60);
  const m = Math.round(num % 60);

  if (d > 0) {
    return d + ' days';
  }

  if (isUpcomingToDo) {
    return 'Tomorrow';
  }

  return `${h}h ${m}m`;
}
