import './LogoComponent.css';

function LogoComponent() {
  return (
    <div className="logo">
      <span className="logo__icon" aria-hidden="true">
        <svg width="22" height="22">
          <use href="/symbol-defs.svg#icon-logo" />
        </svg>
      </span>
      <span className="logo__text">Task Pro</span>
    </div>
  );
}

export default LogoComponent;
