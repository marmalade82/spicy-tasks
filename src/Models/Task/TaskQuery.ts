import ModelQuery from "src/Models/base/Query";
import {
    Task, ITask, TaskParentTypes,
} from "src/Models/Task/Task";
import TaskSchema from "src/Models/Task/TaskSchema";
import { Q, Database, Model } from "@nozbe/watermelondb";
import { Conditions, findAllChildrenIn } from "src/Models/common/queryUtils"
import DB from "src/Models/Database";
import MyDate from "src/common/Date";
import StreakCycleQuery, { ChildStreakCycleQuery } from "../Group/StreakCycleQuery";
import ActiveTransaction, { DBResourceLock, CURRENT_STREAK_CYCLE_ID, InactiveTransaction } from "../common/Transaction";
import GoalQuery from "../Goal/GoalQuery";
import StreakCycle from "../Group/StreakCycle";
import { Condition } from "@nozbe/watermelondb/QueryDescription";
import { dueDate } from "src/Components/Forms/common/utils";

export class TaskQuery extends ModelQuery<Task, ITask> {
    constructor() {
        super(TaskSchema.table);
    }

    queries = () => {
        return [] as Condition[];
    }

    default = () => {
        let def: ITask = {
            title: "Default Task",
            instructions: "",
            startDate: MyDate.Now().asStartDate().toDate(),
            startTime: MyDate.Zero().asStartDate().toDate(), // defaults to start of day
            dueDate: MyDate.Now().toDate(),
            active: true,
            state: 'open',
            completedDate: MyDate.Zero().toDate(),
            createdAt: MyDate.Now().toDate(),
            remindMe: false,
            reminded: false,
            repeat: "stop",
            nextRepeatCalculated: false,
            lastRefresh: MyDate.Now().asStartDate().toDate(),
            parent: {
                id: "",
                type: TaskParentTypes.NONE,
            },
            
        };
        return def;
    }

    queryInSCycle = (cycleId: string) => {
        return this.query(
            Q.where(TaskSchema.name.PARENT, cycleId )
        )
    }

    queryStartsBetweenInclusive = (left: Date, right) => {
        return this.query(
            Q.and(...Conditions.startsOnOrAfter(left), ...Conditions.startsOnOrBefore(right))
        )
    }

    queryCreatedBetween = (left: Date, right: Date) => {
        return this.query(
            ...[ ...Conditions.createdAfter(left), ...Conditions.createdBefore(right)]
        )
    }

    createdBetween = async (left: Date, right: Date) => {
        return (await this.queryCreatedBetween(left, right).fetch()) as Task[];
    }

    queryCreatedBefore = (d: Date) => {
        return this.query(
            ...Conditions.createdBefore(d)
        );
    }

    createdBefore = async (d: Date) => {
        return (await this.queryCreatedBefore(d).fetch()) as Task[];
    }

    queryCreatedAfter = (d: Date) => {
        return this.query(
            ...Conditions.createdAfter(d)
        );
    }

    createdAfter = async (d:Date) => {
        return (await this.queryCreatedAfter(d).fetch()) as Task[];
    }

    queryCompletedToday = () => {
        return this.query(
            ...[...Conditions.completedToday(), ...Conditions.complete()]
        );
    }

    queryInProgress = () => {
        return this.query(
            Q.and(
                ...[
                    ...Conditions.active(), ...Conditions.started()
                ],
                Q.or( Q.and(...Conditions.notDue()), Q.and(...Conditions.dueToday()))
            )
        )
    }

    queryInactive = () => {
        return this.query(
            ...Conditions.inactive()
        );
    }

    queryFailed = () => {
        return this.query(...Conditions.failed());
    }

    failedTasks = async () => {
        return await this.queryFailed().fetch() as Task[];
    }



    inactiveTasks = async () => {
        return (await (this.queryInactive()).fetch());
    }

    queryCompletedTasks = () => {
        const complete = this.query(
            ...Conditions.complete()
        );

        return complete;
    }

    completedTasks = async() => {
        return (await this.queryCompletedTasks().fetch()) as Task[];
    }

    queryInStreakCycle = (cycleId: string) => {
        return this.queryInSCycle(cycleId);
    }

    inStreakCycle = async (cycleId: string) => {
        return await this.queryInStreakCycle(cycleId).fetch() as Task[];
    }

    queryLastDays = (count: number) => {
        let date = MyDate.Now().subtract(count - 1, "days").toDate();
        return this.query(
            ...Conditions.dueOnOrAfter(date)
        );
    }

    queryLastDaysComplete = (count: number) => {
        let date = MyDate.Now().subtract(count - 1, "days").toDate();
        return this.query(
            ...Conditions.dueOnOrAfter(date),
            ...Conditions.complete()
        );
    }

    queryLastWeeks = (count: number) => {
        let date = MyDate.Now().subtract(count, "weeks").toDate();
        return this.query(
            ...Conditions.dueOnOrAfter(date)
        );
    }

    queryLastWeeksComplete = (count: number) => {
        let date = MyDate.Now().subtract(count, "weeks").toDate();
        return this.query(
            ...Conditions.dueOnOrAfter(date),
            ...Conditions.complete()
        );
    }

    queryLastMonths = (count: number) => {
        let date = MyDate.Now().subtract(count, "months").toDate();
        return this.query(
            ...Conditions.dueOnOrAfter(date)
        );
    }

    queryLastMonthsComplete = (count: number) => {
        let date = MyDate.Now().subtract(count, "months").toDate();
        return this.query(
            ...Conditions.dueOnOrAfter(date),
            ...Conditions.complete()
        );
    }

    inMinutes = (minutes: number) => {
        const now = MyDate.Now();
        const then = now.clone().add(30, "minutes");

        const nowTime = MyDate.Zero().setTime(now);
        const thenTime = MyDate.Zero().setTime(then);

        return this.query(
            Q.where(TaskSchema.name.START_TIME_ON, Q.lte(thenTime.toDate().valueOf())),
            Q.where(TaskSchema.name.START_TIME_ON, Q.gte(nowTime.toDate().valueOf())),
            Q.where(TaskSchema.name.REMIND, true),
            Q.where(TaskSchema.name.REMINDED, false),
            Q.or(
                Q.and(
                    ...Conditions.startsOn(now.toDate())
                ),
                Q.and(
                    ...Conditions.startsOn(then.toDate())
                )
            )
        ).fetch();
    }

    /**
     * Queries all the repeating tasks that have no successor, were not yet processed today,
     * and started before today.
     */
    unprocessed = () => {
        return this.query(
            ...Conditions.startsBefore(MyDate.Now().asStartDate().toDate()),
            Q.where(TaskSchema.name.LAST_REFRESH, Q.lte(MyDate.Now().asStartDate().toDate().valueOf())),
            Q.where(TaskSchema.name.NEXT_REPEAT, false),
            Q.where(TaskSchema.name.REPEAT, Q.notEq("stop")),
        ).fetch()
    }

}

export default TaskQuery;

export class ActiveTaskQuery extends ModelQuery<Task, ITask> {
    constructor() {
        super(TaskSchema.table);
    }
    default = () => {
        let def = new TaskQuery().default();
        def.active = true;
        return def;
    }

    queries = () => {
        return new TaskQuery().queries().concat([
            ...Conditions.active()
        ])
    }

    queryOpen = () => {
        return this.query(
            Q.where('state', 'open')
        );
    }

    queryHasParent = (parentId: string) => {
        return this.query(
            Q.where('parent_id', parentId)
        );
    }

    queryDueToday = () => {
        return this.query(
            ...[ ...Conditions.dueToday()]
        );
    }

    queryDueSoonToday = () => {
        return this.query(
            ...[ ...Conditions.dueToday(), ...Conditions.dueInFuture()]
        );
    }

    queryOverdue = () => {
        return this.query(
            ...[...Conditions.overdue()]
        );
    }

    queryInSCycle = (cycleId: string) => {
        return this.query(
            Q.where(TaskSchema.name.PARENT, cycleId )
        )
    }

    /**
     * Query for tasks that are active, and due either today, or in the past (overdue).
     */
    queryDueOrOverdue = () => {
        return this.query(
            Q.or(
                Q.and(
                    ...[ ...Conditions.overdue()]
                ),
                Q.and(
                    ...[ ...Conditions.dueToday()]
                )
            )
        )
    }

    queryStartedButNotDue = () => {
        return this.query(
            ...[ ...Conditions.started(), ...Conditions.notDue()]
        )
    }

    queryNotStarted = () => {
        return this.query(
            ...[ ...Conditions.notStarted()]
        );
    }

    queryRemainingToday = () => {
        return this.query(
            Q.or(
                Q.and(
                    ...[...Conditions.dueToday()]
                ),
                Q.and(
                    ...[...Conditions.started(), ...Conditions.notDue()]
                ),
            )
        )
    }

}

export class ChildTaskQuery extends ModelQuery<Task, ITask> { 
    parent: string;
    constructor(parent: string) {
        super(TaskSchema.table);
        this.parent = parent;
    }

    default = () => {
        let def = new TaskQuery().default();
        def.parent = {
            id: this.parent,
            type: TaskParentTypes.NONE,
        }
        return def;
    }

    queries = () => {
        return new TaskQuery().queries().concat([
            Q.where(TaskSchema.name.PARENT, this.parent)
        ]);
    }

    queryInactive = () => {
        return this.query(
            ...Conditions.inactive()
        );
    }

    queryCompleted = () => {
        return this.query(
            ...[...Conditions.complete()]
        )
    }

    queryActive = () => {
        return new ActiveTaskQuery().queryHasParent(this.parent);
    }

    queryOverdue = () => {
        return this.query(
            ...Conditions.overdue()
        )
    }
}

export class ChildOfTaskQuery extends ModelQuery<Task, ITask> { 
    parents: string[];
    constructor(parents: string[]) {
        super(TaskSchema.table);
        this.parents = parents;
    }

    default = () => {
        let def = new TaskQuery().default();
        def.parent = {
            id: "",
            type: TaskParentTypes.NONE,
        }
        return def;
    }

    queries = () => {
        let qs = this.parents.map((parentId: string) => {
            return Q.where(TaskSchema.name.PARENT, parentId)
        }).concat(Q.where(TaskSchema.name.PARENT, "")); // last line ensures that the query is not ever EMPTY.
        return new TaskQuery().queries().concat([
            Q.or(...qs)
        ]);
    }

    queryOverdue = () => {
        return this.query(
            Q.and(...Conditions.overdue())
        )
    }

    queryActiveOverdue = () => {
        return this.query(
            Q.and(...Conditions.overdue()),
            Q.and(...Conditions.active()),
        )
    }

}

export {
    Task,
    ITask,
}

export class TaskLogic {
    id: string;
    constructor(id: string) {
        this.id = id;
    }

    static create = async (d: Partial<ITask>) => {
        const parentId = d.parent ? d.parent.id : ""
        const parentGoal = await new GoalQuery().get(parentId);
        const tx = await ActiveTransaction.new();

        // Default is that dueDate is calculated from start date where possible.
        if(d.startDate) {
            d.dueDate = dueDate(d.startDate);
        }

        if(parentGoal && parentGoal.isStreak()) {
            // We need to create a task, and add it to the current cycle
            // We should create the CURRENT cycle if it doesn't exist yet,
            // but we won't mark it as the LATEST cycle because this isn't generated through
            // the automatic processing.
            //
            // We won't have transaction conflicts, because only one transaction is allowed to be 
            // active at a time.

            let currentCycle = await new ChildStreakCycleQuery(parentGoal.id).inCurrentCycle();
            let finalCurrentCycle: StreakCycle;
            if(!currentCycle) {
                finalCurrentCycle = tx.addCreate(new StreakCycleQuery(), {
                    parentGoalId: parentGoal.id,
                    startDate: parentGoal.currentCycleStart(),
                    endDate: parentGoal.currentCycleEnd(),
                })
            } else {
                finalCurrentCycle = currentCycle; 
                d.parent = { // reassign the parent field to the cycle where it belongs.
                    id: finalCurrentCycle.id,
                    type: TaskParentTypes.CYCLE
                }
            }


            tx.addCreate(new TaskQuery(), d);
        } else {
            //If the parent is a task instead, we inherit start and due dates from the parent. ALWAYS.
            const parentTask = await new TaskQuery().get(parentId);
            if(parentTask) {
                d.startDate = parentTask.startDate;
                d.dueDate = parentTask.dueDate;
            }

            // We need to create a normal single task based on the data.
            // So we don't need to do anything here.
            tx.addCreate(new TaskQuery(), d);
        }
        tx.commitAndReset();
    }

    update = async (d: Partial<ITask>) => {
        const task = await new TaskQuery().get(this.id);
        const tx = await ActiveTransaction.new();

        // Default is that dueDate is calculated from start date where possible.
        if(d.startDate) {
            d.dueDate = dueDate(d.startDate);
        }

        if(task) {
            // For now, every update to the task requires updating all the children's child dates as well.
            tx.addUpdate(new TaskQuery(), task, d);
            tx.consume(await this._actionTaskAndDescendants("updateDates", task.id, true))
        }
        tx.commitAndReset();
    }

    //Cloning should always also reproduce the children.

    static cloneRelativeTo = async (oldDate: Date, newDate: Date, task: Task, parent: { id: string, type: TaskParentTypes}) => {
        const tx = new InactiveTransaction();
        const newStart = new MyDate(newDate).add( new MyDate(task.startDate).diff(oldDate, "minutes"), "minutes")
        const newTask : Omit<ITask, "createdAt" | "completedDate"> = {
            title: task.title,
            instructions: task.instructions,
            active: true,
            state: 'open',
            startDate: newStart.clone().asStartDate().toDate(),
            startTime: task.startTime,
            remindMe: task.remindMe,
            dueDate: newStart.clone().asDueDate().toDate(),
            parent: parent,
            reminded: false,
            repeat: task.repeat,
            nextRepeatCalculated: false,
            lastRefresh: MyDate.Now().asStartDate().toDate(),
        }

        let newParent = tx.addCreate(new TaskQuery(), newTask);

        tx.consume(await TaskLogic.cloneChildren(task, newParent))


        return tx;
    }

    static cloneWithStart = async (start: Date, task: Task) => {
        const tx = new InactiveTransaction();
        const newStart = new MyDate(start);
        const newTask : Omit<ITask, "createdAt" | "completedDate"> = {
            title: task.title,
            instructions: task.instructions,
            active: true,
            state: 'open',
            startDate: newStart.clone().asStartDate().toDate(),
            startTime: task.startTime,
            remindMe: task.remindMe,
            dueDate: newStart.clone().asDueDate().toDate(),
            parent: task.parent,
            reminded: false,
            repeat: task.repeat,
            nextRepeatCalculated: false,
            lastRefresh: MyDate.Now().asStartDate().toDate(),
        }
        const newParent = tx.addCreate(new TaskQuery(), newTask);
        tx.consume(await TaskLogic.cloneChildren(task, newParent) );

        return tx;
    }

    private static cloneChildren = async (oldParent: Task, newParent: Task) => {
        const tx = new InactiveTransaction();

        const directChildren: Task[] = await new ChildTaskQuery(oldParent.id).queryAll().fetch();

        const promises = directChildren.map(async (child) => {
            const newStart = new MyDate(newParent.startDate);
            const newChild : Omit<ITask, "createdAt" | "completedDate"> = {
                title: child.title,
                instructions: child.instructions,
                active: true,
                state: 'open',
                startDate: newStart.clone().asStartDate().toDate(),
                startTime: child.startTime,
                remindMe: child.remindMe,
                dueDate: newStart.clone().asDueDate().toDate(),
                parent: {
                    id: newParent.id,
                    type: TaskParentTypes.TASK,
                },
                reminded: false,
                repeat: child.repeat,
                nextRepeatCalculated: false,
                lastRefresh: MyDate.Now().asStartDate().toDate(),
            }
            const newChildParent = tx.addCreate(new TaskQuery(), newChild);
            tx.consume(await TaskLogic.cloneChildren(child, newChildParent));
        })

        // Force all child transactions to finish building for consumption.
        await Promise.all(promises);

        return tx;
    }

    markReminded = async () => {
        const task = await new TaskQuery().get(this.id);
        if(task) {
            const tx = await ActiveTransaction.new();
            tx.addUpdate(new TaskQuery(), task, {
                reminded: true
            });
            tx.commitAndReset();
        }
    }

    complete = async () => {
        await this.actionTaskAndDescendants("complete", this.id)
    }

    fail = async () => {
        await this.actionTaskAndDescendants("fail", this.id);
    }


    private actionTaskAndDescendants = async (action: "complete" | "fail", id: string) => {
        const tx = await ActiveTransaction.new();
        tx.consume(await this._actionTaskAndDescendants(action, id))
        await tx.commitAndReset();
    }
    
    private _actionTaskAndDescendants = async (action: "complete" | "fail" | "updateDates", id: string, onlyChildren?: true) => {
        const task: Task | null = await new TaskQuery().get(id);
        const tx = await InactiveTransaction.new();
        if(task) {
            const allTasks: Task[] = await findAllChildrenIn(TaskSchema.table, task.id, onlyChildren ? [] : [task]);
            const update = getUpdate(action, task);
            allTasks.forEach((task: Task) => {
                tx.addUpdate(new TaskQuery(), task, update)
            });
        }
        return tx;

        function getUpdate(action: "complete" | "fail" | "updateDates", task: Task) {
            switch(action) {
                case "complete": {
                    return {
                        active: false,
                        state: "complete",
                        completedDate: MyDate.Now().toDate(),
                    } as const;
                } 
                case "fail": {
                    return {
                        active: false,
                        state: "cancelled",
                    } as const;
                }
                case "updateDates": {
                    return {
                        startDate: task.startDate,
                        dueDate: task.dueDate,
                    } as const;
                }
            }
        }
    }
}

type RepeatTaskData = {
    name: string,
    description: string,
    starts: Date,
    time: Date,
    remindMe: boolean,
    repeats: "daily" | "weekly" | "monthly" | "stop",
}

export class RepeatTaskLogic {
    id: string;
    constructor(id: string) {
        this.id = id;
    }

    // Creates initial repeat record and then runs refresh to create it if it's for today.
    static create = async (data: RepeatTaskData) => {
        // Create the repeat record.
        const tx = await ActiveTransaction.new();

        // Create the task record. The logic will scan for all repeats that haven't been calculated,
        // and check if they should be calculated today.
        // WE HAVE TO CLONE SUBTASKS TOO
        tx.addCreate(new TaskQuery(), {
            title: data.name,
            instructions: data.description,
            startDate: new MyDate(data.starts).asStartDate().toDate(),
            startTime: data.time,
            dueDate: new MyDate(data.starts).asDueDate().toDate(),
            remindMe: data.remindMe,
            reminded: false,
            repeat: data.repeats,
            nextRepeatCalculated: false,
            lastRefresh: MyDate.Now().asStartDate().toDate(),
            parent: {
                id: "",
                type: TaskParentTypes.NONE,
            },
        })


        tx.commitAndReset();
    }
}