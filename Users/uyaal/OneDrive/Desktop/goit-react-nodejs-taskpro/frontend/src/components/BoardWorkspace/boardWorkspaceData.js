export const boardIconOptions = [
  { id: 'grid', label: 'Grid' },
  { id: 'sparkle', label: 'Sparkle' },
  { id: 'swirl', label: 'Swirl' },
  { id: 'puzzle', label: 'Puzzle' },
  { id: 'cube', label: 'Cube' },
  { id: 'bolt', label: 'Bolt' },
  { id: 'circles', label: 'Circles' },
  { id: 'hexagon', label: 'Hexagon' },
];

// Replace these preview values with the background image payload returned by the backend.
export const boardBackgroundOptions = [
  { id: 'none', label: 'No background', preview: 'linear-gradient(135deg, #1b1b1b, #111)', color: '#bedbb0', background: null },
  { id: 'sakura', label: 'Sakura', preview: 'linear-gradient(135deg, #f7b7c9, #c9eef1)', color: '#f7b7c9', background: 'linear-gradient(135deg, #f7b7c9, #c9eef1)' },
  { id: 'night', label: 'Night hills', preview: 'linear-gradient(135deg, #07111f, #385169)', color: '#385169', background: 'linear-gradient(135deg, #07111f, #385169)' },
  { id: 'garden', label: 'Garden', preview: 'linear-gradient(135deg, #ffb36c, #5c7f54)', color: '#5c7f54', background: 'linear-gradient(135deg, #ffb36c, #5c7f54)' },
  { id: 'moon', label: 'Moon sky', preview: 'linear-gradient(135deg, #14213d, #e56b6f)', color: '#e56b6f', background: 'linear-gradient(135deg, #14213d, #e56b6f)' },
  { id: 'leaves', label: 'Leaves', preview: 'linear-gradient(135deg, #153a2f, #b8df8e)', color: '#b8df8e', background: 'linear-gradient(135deg, #153a2f, #b8df8e)' },
  { id: 'clouds', label: 'Clouds', preview: 'linear-gradient(135deg, #d8f1ff, #7db6c9)', color: '#7db6c9', background: 'linear-gradient(135deg, #d8f1ff, #7db6c9)' },
  { id: 'coast', label: 'Coast', preview: 'linear-gradient(135deg, #3a4f63, #d7d3c4)', color: '#d7d3c4', background: 'linear-gradient(135deg, #3a4f63, #d7d3c4)' },
  { id: 'prism', label: 'Prism', preview: 'linear-gradient(135deg, #f8f4ff, #7cc7ff, #f8e77e)', color: '#7cc7ff', background: 'linear-gradient(135deg, #f8f4ff, #7cc7ff, #f8e77e)' },
  { id: 'planet', label: 'Planet', preview: 'linear-gradient(135deg, #050505, #d86436)', color: '#d86436', background: 'linear-gradient(135deg, #050505, #d86436)' },
  { id: 'mist', label: 'Mist', preview: 'linear-gradient(135deg, #dcecff, #f7d0a2)', color: '#f7d0a2', background: 'linear-gradient(135deg, #dcecff, #f7d0a2)' },
  { id: 'balloon', label: 'Balloon', preview: 'linear-gradient(135deg, #f4e2c6, #526982)', color: '#526982', background: 'linear-gradient(135deg, #f4e2c6, #526982)' },
  { id: 'canyon', label: 'Canyon', preview: 'linear-gradient(135deg, #243b53, #e07a5f)', color: '#e07a5f', background: 'linear-gradient(135deg, #243b53, #e07a5f)' },
  { id: 'reef', label: 'Reef', preview: 'linear-gradient(135deg, #075985, #67e8f9)', color: '#67e8f9', background: 'linear-gradient(135deg, #075985, #67e8f9)' },
  { id: 'harbor', label: 'Harbor', preview: 'linear-gradient(135deg, #e8dcc8, #465a64)', color: '#465a64', background: 'linear-gradient(135deg, #e8dcc8, #465a64)' },
  { id: 'aurora', label: 'Aurora', preview: 'linear-gradient(135deg, #1f2937, #84cc16, #38bdf8)', color: '#84cc16', background: 'linear-gradient(135deg, #1f2937, #84cc16, #38bdf8)' },
];

export const customBackgroundEffects = [
  { id: 'solid', label: 'Solid' },
  { id: 'glow', label: 'Glow' },
  { id: 'mesh', label: 'Mesh' },
];

export function getBoardAccentColor(board) {
  if (board?.backgroundId === 'custom-color') return board.customBackgroundColor || '#bedbb0';
  if (board?.backgroundId === 'custom-image') return board.customBackgroundColor || '#bedbb0';

  return boardBackgroundOptions.find((option) => option.id === board?.backgroundId)?.color || '#bedbb0';
}

export function getCustomColorBackground(color = '#bedbb0', effect = 'solid') {
  if (effect === 'glow') {
    return `radial-gradient(circle at 20% 20%, ${color}99, transparent 34%), radial-gradient(circle at 82% 72%, ${color}66, transparent 30%), #1f1f1f`;
  }

  if (effect === 'mesh') {
    return `linear-gradient(135deg, ${color} 0%, transparent 45%), linear-gradient(225deg, ${color}99 0%, transparent 45%), #1f1f1f`;
  }

  return color;
}

export function getBoardDashboardStyle(board) {
  if (!board) return {};

  if (board.backgroundId === 'custom-image' && board.customBackgroundImage) {
    return {
      backgroundImage: `linear-gradient(rgba(31, 31, 31, 0.35), rgba(31, 31, 31, 0.35)), url("${board.customBackgroundImage}")`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
    };
  }

  if (board.backgroundId === 'custom-color') {
    return {
      background: getCustomColorBackground(board.customBackgroundColor, board.customBackgroundEffect),
    };
  }

  const selectedPreset = boardBackgroundOptions.find((option) => option.id === board.backgroundId);
  return selectedPreset?.background ? { background: selectedPreset.background } : {};
}
