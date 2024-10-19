"use client"

import React, { useState  , useEffect} from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
type Priority = 'high' | 'medium' | 'low';

type Task = {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  completed: boolean;
};

type NewTask = Omit<Task, 'id' | 'completed'>;

const TaskManagementApp: React.FC<{ initialTasks: Task[] }> = ({ initialTasks }) => {
  
  const [tasks, setTasks] = useState<Task[]>(() => {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : initialTasks;
  });
    const [newTask, setNewTask] = useState<NewTask>({ title: '', description: '', priority: 'medium' });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)



  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.title.trim() !== '') {
      setTasks([...tasks, { ...newTask, id: Date.now(), completed: false }]);
      setNewTask({ title: '', description: '', priority: 'medium' });
    }
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));

  };


  const toggleComplete = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const editTask = (task: Task) => {
    setEditingTask(task);
    setIsEditDialogOpen(true)

  };

  const updateTask = () => {
    if (editingTask) {
      setTasks(tasks.map(task =>
        task.id === editingTask.id ? editingTask : task
      ));
      setEditingTask(null);
      setIsEditDialogOpen(false)

    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder: { [key in Priority]: number } = { high: 0, medium: 1, low: 2 };
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const filteredTasks = sortedTasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const priorityColors: { [key in Priority]: string } = {
    high: 'text-red-500',
    medium: 'text-yellow-500',
    low: 'text-green-500'
  };

  return (
    
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Management App</h1>
      
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Add New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="mb-2"
          />
          <Input
            type="text"
            placeholder="Task Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="mb-2"
          />
          <Select
            value={newTask.priority}
            onValueChange={(value: Priority) => setNewTask({ ...newTask, priority: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
        <CardFooter>
          <Button onClick={addTask}>Add Task</Button>
        </CardFooter>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Search Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>


<div className="space-y-4">
  {filteredTasks && filteredTasks.length > 0 ? (
    filteredTasks.map(task => (
      <Card key={task.id} className={task.completed ? 'bg-gray-100' : ''}>
        <CardHeader>
          <CardTitle className={`${priorityColors[task.priority]}`}>{task.title}</CardTitle>
          <CardDescription>{task.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Priority: {task.priority}</p>
          <p>Status: {task.completed ? 'Completed' : 'Pending'}</p>
        </CardContent>
        <CardFooter className="space-x-2">
          <Button onClick={() => toggleComplete(task.id)}>
            {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
          </Button>
          <Button onClick={() => editTask(task)}>

            Edit</Button>
          <Button variant="destructive" onClick={() => deleteTask(task.id)}>Delete</Button>
        </CardFooter>
      </Card>
    ))
  ) : (
    <p>No tasks available.</p>
  )}
</div>


      {editingTask && (
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Task</DialogTitle>
              </DialogHeader>
              {editingTask && (
                <>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">Title</Label>
                      <Input
                        id="title"
                        value={editingTask.title}
                        onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">Description</Label>
                      <Input
                        id="description"
                        value={editingTask.description}
                        onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="priority" className="text-right">Priority</Label>
                      <Select
                        value={editingTask.priority}
                        onValueChange={(value: Priority) => setEditingTask({ ...editingTask, priority: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={updateTask}>Update Task</Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
    
      )}
    </div>
  );
};

export default TaskManagementApp;