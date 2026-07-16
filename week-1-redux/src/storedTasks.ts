export type Task = {
    id: number;
    title: string;
    done: boolean;
};

export const storedTasks: Task[] = [
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
