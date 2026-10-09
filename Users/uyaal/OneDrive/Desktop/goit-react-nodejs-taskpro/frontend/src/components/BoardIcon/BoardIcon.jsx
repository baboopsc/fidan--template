import './BoardIcon.css';

const boardIconSymbols = {
  grid: 'icon-project',
  sparkle: 'icon-star',
  swirl: 'icon-loading',
  puzzle: 'icon-puzzle',
  cube: 'icon-cube',
  bolt: 'icon-lightning',
  circles: 'icon-colors',
  hexagon: 'icon-hexagon',
};

function BoardIcon({ iconId = 'grid', size = 18, className = 'board-icon', style }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      style={style}
    >
      <use href={`/symbol-defs.svg#${boardIconSymbols[iconId] || boardIconSymbols.grid}`} />
    </svg>
  );
}

export default BoardIcon;
