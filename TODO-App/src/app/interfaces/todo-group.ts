import { Task } from "./task";

export interface TodoGroup {
    tasks: Task[];
    title: string;
    _id?: string;
}
