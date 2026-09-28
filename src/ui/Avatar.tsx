/** Initials in a tinted square. Used where no verified photo exists, so no one's face is shown as someone else. */
export function Avatar({ name, size = 48 }: { name: string; size?: number }) {
  const initials =
    name
      .replace(/\(.*?\)/g, '')
      .split(/\s+/)
      .filter((w) => /^[A-Za-z]/.test(w) && !/^(shri|smt|dr|sample)$/i.test(w))
      .slice(0, 2)
      .map((w) => w[0]!.toUpperCase())
      .join('') || name.trim().slice(-1).toUpperCase();
  return (
    <span className="avatar" aria-hidden="true" style={{ width: size, height: size, fontSize: size * 0.36 }}>
      {initials}
    </span>
  );
}
