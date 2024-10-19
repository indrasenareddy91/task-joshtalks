 - install all packages using npm i 
- npm run dev to start locally
Completed task
- We don't need getServerSideProps in Next.js 14 because of the introduction of Server Components
- deployed on vercel
- used local storage to persist tasks
- The code sorts the tasks by checking two things: first, it puts all the incomplete tasks at the top and the completed ones at the bottom. Then, among the tasks that have the same completion status, it sorts them by priority—putting tasks with high priority first, followed by medium, and then low. This way, the most important and unfinished tasks appear at the top of the list.
