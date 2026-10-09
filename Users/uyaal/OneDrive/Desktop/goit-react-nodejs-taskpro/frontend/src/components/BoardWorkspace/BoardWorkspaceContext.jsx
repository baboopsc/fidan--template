import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import BoardModal from '../BoardModal/BoardModal.jsx';
import ColumnModal from '../ColumnModal/ColumnModal.jsx';
import TaskModal from '../TaskModal/TaskModal.jsx';
import WorkspaceLoader from '../WorkspaceLoader/WorkspaceLoader.jsx';
import { BoardWorkspaceContext } from './useBoardWorkspace.js';

const createId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const normalizeWorkspace = (workspace) => {
  const boards = Array.isArray(workspace?.boards)
    ? workspace.boards.map((board) => ({
        ...board,
        columns: Array.isArray(board.columns)
          ? board.columns.map((column) => ({
              ...column,
              cards: Array.isArray(column.cards)
                ? column.cards
                : [],
            }))
          : [],
      }))
    : [];

  const savedActiveBoardId = workspace?.activeBoardId || null;

  const activeBoardId = boards.some(
    (board) => board.id === savedActiveBoardId,
  )
    ? savedActiveBoardId
    : boards[0]?.id || null;

  return { boards, activeBoardId };
};

export function BoardWorkspaceProvider({ children }) {
  const { boardId } = useParams();
  const { token, isLoggedIn } = useAuth();
  const [boards, setBoards] = useState([]);
  const [activeBoardId, setActiveBoardId] = useState(null);
  const [isWorkspaceLoading, setIsWorkspaceLoading] = useState(Boolean(isLoggedIn));
  const hasLoadedWorkspace = useRef(false);
  const [boardModal, setBoardModal] = useState({ isOpen: false, mode: 'create', board: null });
  const [columnModal, setColumnModal] = useState({ isOpen: false, mode: 'create', column: null });
  const [taskModal, setTaskModal] = useState({
    isOpen: false,
    mode: 'add',
    columnId: null,
    task: null,
  });

  const activeBoard = boards.find((board) => board.id === activeBoardId) || null;

  useEffect(() => {
    if (!isLoggedIn || !token) {
      queueMicrotask(() => {
        setBoards([]);
        setActiveBoardId(null);
        setIsWorkspaceLoading(false);
      });
      hasLoadedWorkspace.current = false;
      return;
    }

    const controller = new AbortController();

    const loadWorkspace = async () => {
      hasLoadedWorkspace.current = false;
      setIsWorkspaceLoading(true);

      try {
        const response = await fetch(`${API_URL}/workspace`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Workspace could not be loaded');
        }

        const result = await response.json();
        const workspace = normalizeWorkspace(result.data);

        setBoards(workspace.boards);
        setActiveBoardId(workspace.activeBoardId);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error(error);
        }
      } finally {
        if (!controller.signal.aborted) {
          hasLoadedWorkspace.current = true;
          setIsWorkspaceLoading(false);
        }
      }
    };

    loadWorkspace();

    return () => controller.abort();
  }, [isLoggedIn, token]);

  useEffect(() => {
    if (!isLoggedIn || !token || !hasLoadedWorkspace.current) return;

    const timeoutId = setTimeout(async () => {
      try {
        await fetch(`${API_URL}/workspace`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ boards, activeBoardId }),
        });
      } catch (error) {
        console.error(error);
      }
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [activeBoardId, boards, isLoggedIn, token]);

  useEffect(() => {
    if (!boardId || !hasLoadedWorkspace.current) return;

    const routeBoard = boards.find((board) => board.id === boardId);
    if (routeBoard && activeBoardId !== boardId) {
      queueMicrotask(() => setActiveBoardId(boardId));
    }
  }, [activeBoardId, boardId, boards]);

  const openCreateBoard = () => setBoardModal({ isOpen: true, mode: 'create', board: null });
  const openEditBoard = (board) => setBoardModal({ isOpen: true, mode: 'edit', board });
  const closeBoardModal = () => setBoardModal({ isOpen: false, mode: 'create', board: null });

  const openCreateColumn = () => setColumnModal({ isOpen: true, mode: 'create', column: null });
  const openEditColumn = (column) => setColumnModal({ isOpen: true, mode: 'edit', column });
  const closeColumnModal = () => setColumnModal({ isOpen: false, mode: 'create', column: null });
  const openCreateTask = (columnId) => setTaskModal({ isOpen: true, mode: 'add', columnId, task: null });
  const openEditTask = (columnId, task) => setTaskModal({ isOpen: true, mode: 'edit', columnId, task });
  const closeTaskModal = () => setTaskModal({ isOpen: false, mode: 'add', columnId: null, task: null });

  const createBoard = ({ title, iconId, backgroundId, customBackgroundColor, customBackgroundEffect, customBackgroundImage }) => {
    const board = {
      id: createId('board'),
      title,
      iconId,
      backgroundId,
      customBackgroundColor,
      customBackgroundEffect,
      customBackgroundImage,
      columns: [],
    };

    setBoards((currentBoards) => [...currentBoards, board]);
    setActiveBoardId(board.id);
    closeBoardModal();
  };

  const updateBoard = ({ id, title, iconId, backgroundId, customBackgroundColor, customBackgroundEffect, customBackgroundImage }) => {
    setBoards((currentBoards) =>
      currentBoards.map((board) =>
        board.id === id
          ? {
              ...board,
              title,
              iconId,
              backgroundId,
              customBackgroundColor,
              customBackgroundEffect,
              customBackgroundImage,
            }
          : board,
      ),
    );
    closeBoardModal();
  };

  const updateBoardBackground = ({ id, backgroundId, customBackgroundColor, customBackgroundEffect, customBackgroundImage }) => {
    setBoards((currentBoards) =>
      currentBoards.map((board) =>
        board.id === id
          ? {
              ...board,
              backgroundId,
              customBackgroundColor,
              customBackgroundEffect,
              customBackgroundImage,
            }
          : board,
      ),
    );
  };

  const deleteBoard = (boardId) => {
    setBoards((currentBoards) => {
      const nextBoards = currentBoards.filter((board) => board.id !== boardId);

      if (activeBoardId === boardId) {
        setActiveBoardId(nextBoards[0]?.id || null);
      }

      return nextBoards;
    });
  };

  const createColumn = ({ title }) => {
    if (!activeBoardId) return;

    const column = {
      id: createId('column'),
      title,
      cards: [],
    };

    setBoards((currentBoards) =>
      currentBoards.map((board) =>
        board.id === activeBoardId
          ? { ...board, columns: [...board.columns, column] }
          : board,
      ),
    );
    closeColumnModal();
  };

  const updateColumn = ({ id, title }) => {
    setBoards((currentBoards) =>
      currentBoards.map((board) =>
        board.id === activeBoardId
          ? {
              ...board,
              columns: board.columns.map((column) =>
                column.id === id ? { ...column, title } : column,
              ),
            }
          : board,
      ),
    );
    closeColumnModal();
  };

  const deleteColumn = (columnId) => {
    setBoards((currentBoards) =>
      currentBoards.map((board) =>
        board.id === activeBoardId
          ? { ...board, columns: board.columns.filter((column) => column.id !== columnId) }
          : board,
      ),
    );
  };

  const createTask = async ({ columnId, title, description, labelColor, deadline }) => {
    if (!activeBoardId || !columnId) return;
    console.log('TASK CREATE TOKEN:', token);

    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description, labelColor, deadline, boardId: activeBoardId, columnId }),
    });

    if (!response.ok) {
      throw new Error('Task could not be created');
    }

    const result = await response.json();
    const savedTask = result.data || {};
    const task = {
      id: savedTask._id || savedTask.id,
      boardId: activeBoardId,
      columnId,
      title: savedTask.title || title,
      description: savedTask.description || description,
      labelColor: savedTask.labelColor || labelColor,
      deadline: savedTask.deadline || deadline,
    };

    setBoards((currentBoards) =>
      currentBoards.map((board) =>
        board.id === activeBoardId
          ? {
              ...board,
              columns: board.columns.map((column) =>
                column.id === columnId
                  ? { ...column, cards: [...column.cards, task] }
                  : column,
              ),
            }
          : board,
      ),
    );
    closeTaskModal();
  };

  const updateTask = async ({
    id,
    columnId,
    title,
    description,
    labelColor,
    deadline,
  }) => {
    if (!activeBoardId || !columnId) return;

    const previousBoards = structuredClone(boards);

    // Optimistically update the UI
    setBoards((currentBoards) =>
      currentBoards.map((board) =>
        board.id === activeBoardId
          ? {
              ...board,
              columns: board.columns.map((column) =>
                column.id === columnId
                  ? {
                      ...column,
                      cards: column.cards.map((card) =>
                        card.id === id
                          ? {
                              ...card,
                              title,
                              description,
                              labelColor,
                              deadline,
                            }
                          : card,
                      ),
                    }
                  : column,
              ),
            }
          : board,
      ),
    );

    closeTaskModal();

    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          labelColor,
          deadline,
          columnId,
          boardId: activeBoardId,
        }),
      });

      if (!response.ok) {
        throw new Error('Task could not be updated');
      }
    } catch (error) {
      console.error(error);
      setBoards(previousBoards);
    }
  };

  const deleteTask = async (columnId, taskId) => {
    if (!activeBoardId) return;

    const previousBoards = structuredClone(boards);

    setBoards((currentBoards) =>
      currentBoards.map((board) =>
        board.id === activeBoardId
          ? {
              ...board,
              columns: board.columns.map((column) =>
                column.id === columnId
                  ? {
                      ...column,
                      cards: column.cards.filter((card) => card.id !== taskId),
                    }
                  : column,
              ),
            }
          : board,
      ),
    );

    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Task could not be deleted');
      }
    } catch (error) {
      console.error(error);
      setBoards(previousBoards);
    }
  };

  const moveTask = async (sourceColumnId, targetColumnId, taskId) => {
    if (!activeBoardId || sourceColumnId === targetColumnId) return;

    const previousBoards = structuredClone(boards);

    setBoards((currentBoards) =>
      currentBoards.map((board) => {
        if (board.id !== activeBoardId) return board;

        const sourceColumn = board.columns.find(
          (column) => column.id === sourceColumnId,
        );

        const movingTask = sourceColumn?.cards.find(
          (card) => card.id === taskId,
        );

        if (!movingTask) return board;

        return {
          ...board,
          columns: board.columns.map((column) => {
            if (column.id === sourceColumnId) {
              return {
                ...column,
                cards: column.cards.filter(
                  (card) => card.id !== taskId,
                ),
              };
            }

            if (column.id === targetColumnId) {
              return {
                ...column,
                cards: [
                  ...column.cards,
                  {
                    ...movingTask,
                    columnId: targetColumnId,
                  },
                ],
              };
            }

            return column;
          }),
        };
      }),
    );

    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          boardId: activeBoardId,
          columnId: targetColumnId,
        }),
      });

      if (!response.ok) {
        throw new Error('Task could not be moved');
      }
    } catch (error) {
      console.error(error);
      setBoards(previousBoards);
    }
  };

  const value = {
    boards,
    activeBoard,
    activeBoardId,
    isWorkspaceLoading,
    setActiveBoardId,
    openCreateBoard,
    openEditBoard,
    updateBoardBackground,
    deleteBoard,
    openCreateColumn,
    openEditColumn,
    deleteColumn,
    openCreateTask,
    openEditTask,
    deleteTask,
    moveTask,
  };

  return (
    <BoardWorkspaceContext.Provider value={value}>
      {isWorkspaceLoading ? <WorkspaceLoader /> : children}
      {boardModal.isOpen && (
        <BoardModal
          key={`${boardModal.mode}-${boardModal.board?.id || 'new'}`}
          mode={boardModal.mode}
          board={boardModal.board}
          onClose={closeBoardModal}
          onCreate={createBoard}
          onUpdate={updateBoard}
        />
      )}
      {columnModal.isOpen && (
        <ColumnModal
          key={`${columnModal.mode}-${columnModal.column?.id || 'new'}`}
          mode={columnModal.mode}
          column={columnModal.column}
          onClose={closeColumnModal}
          onCreate={createColumn}
          onUpdate={updateColumn}
        />
      )}
      {taskModal.isOpen && (
        <TaskModal
          key={`${taskModal.mode}-${taskModal.task?.id || taskModal.columnId}`}
          mode={taskModal.mode}
          columnId={taskModal.columnId}
          initialData={taskModal.task}
          onClose={closeTaskModal}
          onSubmit={taskModal.mode === 'edit' ? updateTask : createTask}
        />
      )}
    </BoardWorkspaceContext.Provider>
  );
}
