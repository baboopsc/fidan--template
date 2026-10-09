import './WorkspaceLoader.css';

function WorkspaceLoader() {
  return (
    <div className="workspace-loader" role="status" aria-live="polite">
      <span className="workspace-loader-spinner" aria-hidden="true" />
      <span className="workspace-loader-text">Loading workspace...</span>
    </div>
  );
}

export default WorkspaceLoader;
