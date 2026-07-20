export type Task = {
    id: number;
    title: string;
    done: boolean;
};

const initialTasks: Task[] = [
    {
        id: 1,
        title: "Complete assignment 1 original",
        done: true,
    },
    {
        id: 2,
        title: "Watch movie",
        done: false,
    },
    {
        id: 3,
        title: "Play game",
        done: false,
    },
];

// in-memory storage
export const storedTasks: Task[] = [];

// needed for testing
export const reset = () => {
    storedTasks.length = 0;
    initialTasks.forEach((obj) => {
        storedTasks.push(structuredClone(obj));
    });
};

reset();
