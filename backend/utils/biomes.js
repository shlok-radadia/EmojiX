const REGION_SIZE = 4;

const noise2D = (x, y) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return s - Math.floor(s);
};

export const getBiome = (x, y) => {
  const rx = Math.floor(x / REGION_SIZE);
  const ry = Math.floor(y / REGION_SIZE);

  const scale = REGION_SIZE / 12;

  const n1 = noise2D(rx * 0.08 * scale, ry * 0.08 * scale);
  const n2 = noise2D(rx * 0.02 * scale + 100, ry * 0.02 * scale + 100);

  const n = n1 * 0.7 + n2 * 0.3;

  const volcanoNoise = noise2D(
    rx * 0.01 * scale + 999,
    ry * 0.01 * scale + 999,
  );

  if (volcanoNoise > 0.985) return "Volcano";

  if (n < 0.18) return "Water";
  if (n < 0.28) return "Swamp";
  if (n < 0.42) return "Grass";
  if (n < 0.58) return "Forest";
  if (n < 0.72) return "Desert";
  return "Snow";
};
