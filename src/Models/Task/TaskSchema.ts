
import { ColumnType } from "@nozbe/watermelondb"
import { 
    ActiveSchema, ChildSchema, Schema, 
    StateSchema,
} from "src/Models/base/SharedSchema"


const TaskName = {
    TITLE: 'title',
    STARTS_ON: 'starts_at',
    DUE_ON: 'due_on',
    INSTRUCTIONS: 'instructions',
    PARENT: 'parent_id',
    ACTIVE: 'is_active',
    STATE: 'state',
} as const;

const TaskType = {
    TITLE: 'string',
    STARTS_ON: 'number',
    DUE_ON: 'number',
    INSTRUCTIONS: 'string',
    PARENT: 'string',
    ACTIVE: 'boolean',
    STATE: 'string',
} as const

export const TaskSchema: ChildSchema & StateSchema & ActiveSchema & Schema<typeof TaskName> = {
    table: 'tasks',
    name: TaskName,
    type: TaskType,
} as const;

export default TaskSchema