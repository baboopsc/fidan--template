import { createContext, useContext } from 'react';

export const BoardWorkspaceContext = createContext(null);

export function useBoardWorkspace() {
  const context = useContext(BoardWorkspaceContext);

  if (!context) {
    throw new Error('useBoardWorkspace must be used inside BoardWorkspaceProvider');
  }

  return context;
}
