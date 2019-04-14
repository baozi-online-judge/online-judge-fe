export const randomColors = [
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
];
export const mapper = {};

export const getRandomColor = tag => {
  if (mapper[tag]) {
    return mapper[tag];
  }
  let sum = 0;
  for (let i = 0; i < tag.length; i += 1) {
    const charCode = tag.charCodeAt(i);
    sum += charCode * 7;
  }
  mapper[tag] = randomColors[sum % randomColors.length];
  return mapper[tag];
};
