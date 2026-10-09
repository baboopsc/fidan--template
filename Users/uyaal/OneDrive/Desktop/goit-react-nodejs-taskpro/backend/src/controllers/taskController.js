import { Task } from '../db/models/Tasks.js';
// kart ekleme
export const createTaskController = async (req, res, next) => {
  try {
    const {
      title,
      description,
      labelColor,
      deadline,
      columnId,
      boardId,
    } = req.body;

    const newTask = await Task.create({
      title,
      description,
      labelColor,
      deadline,
      columnId,
      boardId,
      owner: req.user._id,
    });

    res.status(201).json({
      status: 201,
      message: 'Task created successfully!',
      data: newTask,
    });
  } catch (error) {
    next(error); // Hatayı projedeki errorHandler middleware'ine paslıyoruz
  }
};

// kart güncelleme
export const updateTaskController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { title, description, labelColor, deadline, columnId, boardId } = req.body;

    const updates = {};

    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (labelColor !== undefined) updates.labelColor = labelColor;
    if (deadline !== undefined) updates.deadline = deadline;
    if (columnId !== undefined) updates.columnId = columnId;
    if (boardId !== undefined) updates.boardId = boardId;

    const updatedTask = await Task.findOneAndUpdate(
      {
        _id: id,
        owner: req.user._id,
      },
      {
        title,
        description,
        labelColor,
        deadline,
        columnId,
        boardId,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedTask) {
      return res.status(404).json({
        status: 404,
        message: 'Task cannot be found!',
      });
    }

    res.status(200).json({
      status: 200,
      message: 'Task updated successfully!',
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// kart silme
export const deleteTaskController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedTask = await Task.findOneAndDelete({
    _id: id,
    owner: req.user._id,
    });

    if (!deletedTask) {
      return res.status(404).json({
        status: 404,
        message: 'Task does not exist!',
      });
    }

    res.status(200).json({
      status: 200,
      message: 'Task deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
};
export const getTasksController = async (req, res, next) => {
  try {
    const { boardId, columnId } = req.query;

    const query = {
        owner: req.user._id,
    };

    if (boardId) {
        query.boardId = boardId;
    }

    if (columnId) {
        query.columnId = columnId;
    }

    const tasks = await Task.find(query);  // Kullanıcıya ait tüm kartları çekiyoruz

    res.status(200).json({
      status: 200,
      message: 'All tasks retrieved successfully',
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};
