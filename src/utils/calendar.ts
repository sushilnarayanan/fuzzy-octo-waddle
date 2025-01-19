import { format, parse, addHours } from 'date-fns';

export const generateCalendarEvent = (
  date: string,
  time: string,
  duration: number,
  developer: { name: string }
) => {
  const startDate = parse(`${date} ${time}`, 'yyyy-MM-dd HH:mm', new Date());
  const endDate = addHours(startDate, duration);

  const event = {
    title: `DevRent Session with ${developer.name}`,
    start: format(startDate, "yyyy-MM-dd'T'HH:mm:ss"),
    end: format(endDate, "yyyy-MM-dd'T'HH:mm:ss"),
    description: `Development session with ${developer.name}`,
  };

  // Generate Google Calendar URL
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    event.title
  )}&dates=${format(startDate, "yyyyMMdd'T'HHmmss'Z'")}/${format(
    endDate,
    "yyyyMMdd'T'HHmmss'Z'"
  )}&details=${encodeURIComponent(event.description)}`;

  return { event, googleUrl };
};