import randomColor from "randomcolor";

const colorCache: Record<string, string> = {};

export function getColorForOrganization(org: string): string {
  if (colorCache[org]) return colorCache[org];

  // Simple deterministic hash function
  let hash = 0;
  for (let i = 0; i < org.length; i++) {
    hash = org.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;

  const color = randomColor({
    hue,
    luminosity: "bright",
  });

  colorCache[org] = color;
  return color;
}
