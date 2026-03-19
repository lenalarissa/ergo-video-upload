
  export function convertDuration(totalMinutes) {
    const totalSeconds = Math.round(totalMinutes * 60);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const hh = String(hours).padStart(2, "0");
    const mm = String(minutes).padStart(2, "0");
    const ss = String(seconds).padStart(2, "0");

    return `${hh}:${mm}:${ss}`;
  }

  export function formatDateTime(dateString) {
    const date = new Date(dateString);

    const formattedDate = Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);

    const formattedTime = Intl.DateTimeFormat("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC",
    }).format(date);

    return { formattedDate, formattedTime };
  }

  export function createThumbnailLink(id) {
    return `https://cdn.jwplayer.com/thumbs/${id}.jpg`;
  }