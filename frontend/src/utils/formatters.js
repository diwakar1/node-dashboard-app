// Date Formatter
export const formatDate = (date, format = "MM/DD/YYYY") => {
  if (!date) return "";
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  const formatMap = {
    DD: day,
    MM: month,
    YYYY: year,
    HH: hours,
    mm: minutes,
  };

  return format.replace(/DD|MM|YYYY|HH|mm/g, (match) => formatMap[match]);
};

// Relative Time (e.g., "2 hours ago")
export const getRelativeTime = (date) => {
  if (!date) return "";
  
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  
  return formatDate(date);
};

// Currency Formatter
export const formatCurrency = (amount, currency = "USD", locale = "en-US") => {
  if (amount == null || isNaN(amount)) return "";
  
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
};

// Number Formatter
export const formatNumber = (number, decimals = 0) => {
  if (number == null || isNaN(number)) return "";
  return Number(number).toFixed(decimals);
};

// Truncate Text
export const truncateText = (text, maxLength = 50, suffix = "...") => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + suffix;
};

// Capitalize First Letter
export const capitalize = (text) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Title Case
export const toTitleCase = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
