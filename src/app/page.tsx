import TaskManagementApp from "@/components/TaskManagementApp";
// This type represents the shape of our task objects
type Task = {
  id: number;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
};

// This function would typically fetch data from an API or database
async function getTasks(): Promise<Task[]> {
  // For demonstration, we're returning static data
  // In a real app, you'd fetch this data from an API or database
  return [
    { id: 1, title: 'IndVsNz', description: 'Need to watch cricket match', priority: 'high', completed: false },
    { id: 2, title: 'Reels', description: 'Need to watch reels', priority: 'medium', completed: false },
    { id: 3, title: 'Gate', description: 'Procastinate to start discrete maths for gate', priority: 'low', completed: false },
  ];
}

export default async function Home() {
  const initialTasks:Task[] = await getTasks();

  return (
    <div>
      <TaskManagementApp initialTasks={initialTasks} />
    </div>
  );
}