export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(input) {
  if (!input) return "";
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function timeAgo(input) {
  if (!input) return "";
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return "";
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const steps = [
    ["tahun", 31536000],
    ["bulan", 2592000],
    ["hari", 86400],
    ["jam", 3600],
    ["menit", 60],
  ];
  for (const [label, secs] of steps) {
    const value = Math.floor(seconds / secs);
    if (value >= 1) return `${value} ${label} lalu`;
  }
  return "Baru saja";
}

export function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function truncate(text = "", max = 220) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

export function levelFromXp(xp = 0) {
  const level = Math.floor(xp / 100) + 1;
  const currentLevelXp = xp % 100;
  return { level, currentLevelXp, nextLevelXp: 100 };
}
