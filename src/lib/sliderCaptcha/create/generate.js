const randInt = (min = 0, max = 2147483646) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randShade = (hue) => ({
  h: hue,
  s: randInt(50, 70),
  l: randInt(50, 60),
});

const hslString = (color) => `hsl(${color.h}, ${color.s}%, ${color.l}%)`;

const randScheme = (base) => [
  randShade(base),
  randShade((base + 60) % 360),
  randShade((base - 30) % 360),
  randShade((base + 30) % 360),
  randShade((base - 60) % 360),
].map((color) => hslString(color));

const svgRect = (x, y, gridWidth, gridHeight, color) =>
  `<rect filter="url(#noise)" x="${x}" y="${y}" width="${gridWidth}" height="${gridHeight}" fill="${color}"/>`;

const svgGridPattern = (width, height, gridWidth, gridHeight, scheme) =>
  [...Array(Math.floor(height / gridHeight)).keys()].map((y) =>
    [...Array(Math.floor(width / gridWidth)).keys()].map((x) =>
      svgRect(x * gridWidth, y * gridHeight, gridWidth, gridHeight, scheme[x % 2])))
  .flat()
  .join('');

const backgroundSvg = (
  width,
  height,
  {
    gridWidth = randInt(5, 50),
    gridHeight = randInt(5, 50),
    scheme = randScheme(randInt(0, 360)),
    seeds = [randInt(), randInt()],
  } = {},
) => `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><filter id="noise"><feTurbulence type="turbulence" baseFrequency="0.005" seed="${seeds[0]}" numOctaves="2" result="turbulence"/><feDisplacementMap in2="turbulence" in="SourceGraphic" scale="30" xChannelSelector="R" yChannelSelector="G"/></filter><filter id="heavy"><feTurbulence type="turbulence" baseFrequency="0.005" seed="${seeds[1]}" numOctaves="2" result="turbulence"/><feDisplacementMap in2="turbulence" in="SourceGraphic" scale="100" xChannelSelector="R" yChannelSelector="G"/></filter><rect width="${width}" height="${height}" fill="${scheme[4]}"/><rect filter="url(#heavy)"  width="${width / 2}" height="${height}" x="${width / 5}" fill="${scheme[2]}"/><rect filter="url(#heavy)" width="${width / 2}" height="${height}" x="${width / 2}" fill="${scheme[3]}"/>${svgGridPattern(width, height, gridWidth, gridHeight, scheme)}</svg>`; // eslint-disable-line

const puzzlePieceSvg = ({
  distort = false,
  rotate = false,
  fill = '#000',
  stroke = '#fff',
  seed = 0,
  opacity = '0.5',
  strokeWidth = '0.25',
} = {}) => `<svg viewBox="0 0 20 20" height="60" width="60"><filter id="noise"><feTurbulence type="turbulence" baseFrequency="0.05" seed="${seed}" numOctaves="2" result="turbulence"/><feDisplacementMap in2="turbulence" in="SourceGraphic" scale="2.5" xChannelSelector="R" yChannelSelector="G"/></filter><path ${distort ? 'filter="url(#noise)"' : ''} ${rotate ? `transform="rotate(${seed}, 10, 10)"` : ''} d="M5.56.56a2.305 2.305 0 00-2.296 2.304 2.305 2.305 0 00.801 1.747H.135v4.295a2.305 2.305 0 011.8-.865 2.305 2.305 0 012.304 2.306 2.305 2.305 0 01-2.305 2.304 2.305 2.305 0 01-1.8-.865v4.226H11.26v-4.258a2.305 2.305 0 001.781.842 2.305 2.305 0 002.305-2.305 2.305 2.305 0 00-2.305-2.305 2.305 2.305 0 00-1.78.841V4.611H7.072a2.305 2.305 0 00.801-1.747A2.305 2.305 0 005.57.559a2.305 2.305 0 00-.009 0z" opacity="${opacity}" stroke="${stroke}" fill="${fill}" stroke-width="${strokeWidth}" stroke-linejoin="round"/></svg>`; // eslint-disable-line

module.exports = {
  puzzlePieceSvg,
  backgroundSvg,
  randInt,
};
