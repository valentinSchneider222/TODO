import { Task } from "./task";

export interface TodoGroup {
    entities: Task[];
    title: string;
    id: string;
}
