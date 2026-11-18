import { ART } from './art'

// Still scenes built from the recolored freesvg art. Each fills the screen with
// a charcoal sky with a faint warm tint that ends on surface-1 (the bottom bar's color), and pins its
// subject to the lower right, clear of the words. Nothing moves.

type Key = keyof typeof ART

// Measured bounding boxes of each piece in its own coordinates: x, y, w, h.
const BOX: Record<Key, [number, number, number, number]> = {
  fuji1: [643.97, 727.12, 2603.39, 844],
  torii1: [2196.97, 1193.12, 377, 381],
  hills1: [3193.97, 1506.12, 206, 184],
  tree_g10078: [2763.61, 1152.47, 443.36, 438.65],
  tree_g10008: [171.89, 1136.47, 470.08, 486.65],
  tree_g10026: [719.58, 991.63, 357.25, 643.49],
  tree_g10052: [1146.76, 1086.31, 820.21, 550.81],
  ink3: [0, 0.01, 140.87, 59.56],
  fuji12: [-8.85, 38.57, 2783, 1174],
}

// Puts a piece `w` wide with its bottom-left corner at (x, bottom).
const place = (key: Key, x: number, bottom: number, w: number, extra = '', flip = false) => {
  const [bx, by, bw, bh] = BOX[key]
  const s = w / bw
  const tx = flip ? x + w + bx * s : x - bx * s
  const ty = bottom - (by + bh) * s
  const { svg, tr } = ART[key]
  const inner = tr === '' ? svg : `<g transform="${tr}">${svg}</g>`
  return `<g transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${flip ? -s.toFixed(5) : s.toFixed(5)} ${s.toFixed(5)})"${extra}>${inner}</g>`
}

const moon = (cx: number, cy: number, r: number) =>
  `<circle cx="${cx}" cy="${cy}" r="${r * 3}" fill="url(#halo)"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="#e6dccf" opacity=".85"/>`

const sun = (cx: number, cy: number, r: number) =>
  `<circle cx="${cx}" cy="${cy}" r="${r * 2.6}" fill="url(#ember)"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="#a4473b" opacity=".5"/>`

const wrap = (subject: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#221a1d"/><stop offset=".5" stop-color="#18151a"/><stop offset="1" stop-color="#141415"/></linearGradient>
<radialGradient id="haze" cx=".78" cy=".72" r=".55"><stop offset="0" stop-color="#9a3a3a" stop-opacity=".07"/><stop offset="1" stop-color="#9a3a3a" stop-opacity="0"/></radialGradient>
<linearGradient id="fadeL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000"/><stop offset=".3" stop-color="#fff"/></linearGradient><mask id="fade" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="url(#fadeL)"/></mask>
<radialGradient id="halo"><stop offset="0" stop-color="#e6dccf" stop-opacity=".22"/><stop offset="1" stop-color="#e6dccf" stop-opacity="0"/></radialGradient>
<radialGradient id="ember"><stop offset="0" stop-color="#c0463c" stop-opacity=".2"/><stop offset="1" stop-color="#c0463c" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1600" height="900" fill="url(#sky)"/><rect width="1600" height="900" fill="url(#haze)"/>
<svg x="0" y="0" width="1600" height="900" viewBox="0 0 900 900" preserveAspectRatio="xMaxYMax meet" overflow="visible">${subject}</svg>
</svg>`

const GROUND = `<rect x="-2000" y="868" width="4000" height="40" fill="#121115"/>`

export const SCENES = [
  {
    id: 'torii-dusk',
    alt: 'A dark Fuji under the moon, a red torii and dusky cherry trees',
    svg: wrap(
      moon(650, 190, 44) +
        place('fuji1', 150, 872, 760) +
        place('tree_g10052', 10, 884, 400) +
        place('torii1', 600, 874, 150) +
        place('tree_g10078', 700, 888, 210) +
        GROUND,
    ),
  },
  {
    id: 'red-fuji',
    alt: 'A red Fuji slope under a blood-red sun, a small torii below',
    svg: wrap(
      sun(330, 240, 56) +
        place('fuji12', -520, 900, 1420, ' mask="url(#fade)"') +
        place('torii1', 330, 884, 70) +
        place('tree_g10078', 560, 902, 190),
    ),
  },
  {
    id: 'ink-sea',
    alt: 'A pale ink sketch of Fuji over the sea with a red sun behind the peak',
    svg: wrap(sun(470, 500, 58) + place('ink3', 10, 860, 880, ' opacity=".26"') + GROUND),
  },
  {
    id: 'blossom-ridge',
    alt: 'A distant Fuji framed by cherry trees, a torii and a crescent moon',
    svg: wrap(
      `<mask id="cut"><rect x="0" y="0" width="900" height="900" fill="#fff"/><circle cx="216" cy="198" r="32" fill="#000"/></mask>` +
        `<circle cx="200" cy="210" r="100" fill="url(#halo)"/><circle cx="200" cy="210" r="34" fill="#e6dccf" opacity=".85" mask="url(#cut)"/>` +
        place('fuji1', 260, 840, 560, ' opacity=".85"') +
        place('tree_g10078', 40, 900, 280, '', true) +
        place('torii1', 520, 884, 110) +
        place('tree_g10078', 650, 900, 250) +
        GROUND,
    ),
  },
] as const
