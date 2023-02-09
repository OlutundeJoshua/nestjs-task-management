import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import * as uuid from 'uuid';
// import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { NotFoundException } from '@nestjs/common/exceptions';

@Injectable()
export class TasksService {
    private tasks: Task[] =[];

    getAllTasks(): Task[] {
        return this.tasks
    }

    getTasksWithFilters(filterDto: GetTaskFilterDto): Task[] {
        const { status, search } = filterDto

        let tasks = this.getAllTasks();

        if(status) {
            tasks = tasks.filter(task => task.status === status)
        }

        if(search) {
            tasks = tasks.filter(task =>
                task.title.includes(search) ||
                task.description.includes(search)
            )
        }

        return tasks;
    }

    getTaskById(id: string): Task {
        const found = this.tasks.find(task => task.id === id)

        if (!found) {
            throw new NotFoundException(`Task with ${id} not found`)
        }

        return found;
    }

    createTask(CreateTaskDto: CreateTaskDto): Task {
        const {title, description } = CreateTaskDto


        const task: Task ={
            id: uuid.v4(),
            title,
            description,
            status: TaskStatus.OPEN
        };

        this.tasks.push(task);
        return task;
    }

    deleteTask(id: string) {
        const found = this.getTaskById(id);
        this.tasks = this.tasks.filter(task => task.id !== found.id )
    }

    updateTaskStatus(id: string, status: TaskStatus) {
        const task = this.getTaskById(id);
        task.status = status;
        return task;   
    }
}
