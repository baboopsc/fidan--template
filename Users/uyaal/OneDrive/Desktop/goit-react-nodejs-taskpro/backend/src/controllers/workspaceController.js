import { Workspace } from '../db/models/Workspace.js';

export const getWorkspaceController = async (req, res, next) => {
  try {
    const workspace = await Workspace.findOne({ owner: req.user._id });

    res.status(200).json({
      status: 200,
      message: 'Workspace retrieved successfully',
      data: workspace || { boards: [], activeBoardId: null },
    });
  } catch (error) {
    next(error);
  }
};

export const saveWorkspaceController = async (req, res, next) => {
  try {
    const { boards = [], activeBoardId = null } = req.body;

    const workspace = await Workspace.findOneAndUpdate(
      { owner: req.user._id },
      { boards, activeBoardId, owner: req.user._id },
      { new: true, upsert: true, runValidators: true },
    );

    res.status(200).json({
      status: 200,
      message: 'Workspace saved successfully',
      data: workspace,
    });
  } catch (error) {
    next(error);
  }
};
