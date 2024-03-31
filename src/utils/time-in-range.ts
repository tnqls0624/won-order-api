export default function isCurrentTimeInRange(
  start_time_str: string,
  end_time_str: string,
  country: string
): boolean {
  // 국가별 타임존 매핑
  const time_zone_map: { [key: string]: string } = {
    CAMBODIA: 'Asia/Phnom_Penh',
    KOREA: 'Asia/Seoul',
    AMERICA: 'America/New_York'
  };

  const timeZone = time_zone_map[country] || 'UTC';

  const current_date = new Date();
  const formatter = new Intl.DateTimeFormat('en', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone
  });

  const [current_hours, current_minutes] = formatter
    .format(current_date)
    .split(':')
    .map(Number);

  const [start_hours, start_minutes] = start_time_str.split(':').map(Number);
  const [end_hours, end_minutes] = end_time_str.split(':').map(Number);

  const current_time_in_minutes = current_hours * 60 + current_minutes;
  const start_time_in_minutes = start_hours * 60 + start_minutes;
  const end_time_in_minutes = end_hours * 60 + end_minutes;

  if (start_time_in_minutes < end_time_in_minutes) {
    return (
      current_time_in_minutes >= start_time_in_minutes &&
      current_time_in_minutes <= end_time_in_minutes
    );
  } else {
    return (
      current_time_in_minutes >= start_time_in_minutes ||
      current_time_in_minutes <= end_time_in_minutes
    );
  }
}
