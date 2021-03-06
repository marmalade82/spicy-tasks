
import { Q, Database, Model } from "@nozbe/watermelondb";
import { ChildSchema, ActiveSchema, StateSchema } from "src/Models/base/SharedSchema";
import { TaskSchema } from "src/Models/Task/TaskSchema";
import DB from "src/Models/Database";
import MyDate from "src/common/Date";
import GoalSchema from "src/Models/Goal/GoalSchema";
import { GoalType } from "../Goal/GoalLogic";
import { dueDate, startDate } from "src/Components/Forms/common/utils";

const name = TaskSchema.name;
const goalName = GoalSchema.name ;

function inactiveConditions() {
    return [
        Q.where(name.ACTIVE, false)
    ]
}

function inactiveChildConditions(parent_id: string) {
    return flat([
        inactiveConditions(),
        childConditions(parent_id),
    ])
}

function activeConditions() {
    return [
        Q.where(name.ACTIVE, true)
    ]
}

function activeChildConditions(parent_id: string) {
    return flat([
        activeConditions(),
        childConditions(parent_id),
    ])
}

function childConditions(parent_id: string) {
    return [
        Q.where(name.PARENT, parent_id)
    ]
}

function openConditions() {
    return [
        Q.where(name.STATE, 'open')
    ]
}

function completeConditions() {
    return [
        Q.where(name.STATE, 'complete'),
        Q.where(name.ACTIVE, false),
    ]
}

function dueTodayConditions() {
    return [
        Q.where(name.DUE_ON, Q.lt(MyDate.Now().nextMidnight().toDate().valueOf())),
        Q.where(name.DUE_ON, Q.gte(MyDate.Now().prevMidnight().toDate().valueOf())),
    ]
}

function dueInFutureConditions() {
    return [
        Q.where(name.DUE_ON, Q.gte(MyDate.Now().toDate().valueOf()))
    ]
}

function overdueConditions() {
    return [
        Q.where(name.DUE_ON, Q.lt(MyDate.Now().prevMidnight().toDate().valueOf())),
    ];
}

function startedConditions() {
    return [
        Q.where(name.STARTS_ON, Q.lte(MyDate.Now().toDate().valueOf())),
    ]
}

function notDueConditions() {
    return [
        Q.where(name.DUE_ON, Q.gte(MyDate.Now().nextMidnight().toDate().valueOf()))
    ]
}

function notStartedConditions() {
    return [
        Q.where(name.STARTS_ON, Q.gt(MyDate.Now().toDate().valueOf())),
    ]
}

function completedTodayConditions() {
    return [
        Q.where(name.COMPLETED_ON, Q.lt(MyDate.Now().nextMidnight().toDate().valueOf())),
        Q.where(name.COMPLETED_ON, Q.gte(MyDate.Now().prevMidnight().toDate().valueOf())),
    ]
}

function notOverdueConditions() {
    return [
        Q.where(name.DUE_ON, Q.gte(MyDate.Now().toDate().valueOf()))
    ]
}

function streakConditions() {
    return [
        Q.where(goalName.TYPE, GoalType.STREAK)
    ]
}

function failedConditions() {
    return [
        Q.where(name.ACTIVE, false),
        Q.where(name.STATE, "cancelled"),
    ]
}

function createdAfterConditions(d: Date) {
    return [
        Q.where(name.CREATED_ON, Q.gt(d.valueOf()))
    ]
}

function createdBeforeConditions(d: Date) {
    return [
        Q.where(name.CREATED_ON, Q.lt(d.valueOf()))
    ]
}

function lastRefreshedOnOrBeforeConditions(d: Date) {
    let endOfDay = new MyDate(d).nextMidnight();
    return [
        Q.where(goalName.LAST_REFRESHED, Q.lt(endOfDay.toDate().valueOf()))
    ]
}

function startsOnOrAfterConditions(d: Date) {
    let yesterday = new MyDate(d).subtract(1, "days").asDueDate().toDate();
    return [
        Q.where(goalName.STARTS_AT, Q.gt(yesterday.valueOf()))
    ]
}

function startsBeforeConditions(d: Date) {
    return [
        Q.where(goalName.STARTS_AT, Q.lt(d.valueOf()))
    ]
}

function startsOnOrBeforeConditions(d: Date) {
    let tmr = new MyDate(d).nextMidnight().toDate();
    return [
        Q.where(goalName.STARTS_AT, Q.lt(tmr.valueOf()))
    ]
}

function dueOnOrBeforeConditions(d: Date) {
    let tmr = new MyDate(d).nextMidnight().toDate();
    return [
        Q.where(goalName.DUE_AT, Q.lt(tmr.valueOf()))
    ]
}

function dueAfterConditions(d: Date) {
    return [
        Q.where(goalName.DUE_AT, Q.gt(d.valueOf()))
    ]
}

function dueOnOrAfterConditions(d: Date) {
    let yesterday = new MyDate(d).subtract(1, "days").asDueDate().toDate();
    return [
        Q.where(goalName.DUE_AT, Q.gt(yesterday.valueOf()))
    ]
}

function startsOnConditions(d: Date) {
    return [
        ...startsOnOrAfterConditions(d),
        ...startsOnOrBeforeConditions(d),
    ]
}

export const Conditions = {
    active: activeConditions,
    activeChild: activeChildConditions,
    child: childConditions,
    inactive: inactiveConditions,
    inactiveChild: inactiveChildConditions,
    open: openConditions,
    complete: completeConditions,
    dueToday: dueTodayConditions,
    dueInFuture: dueInFutureConditions,
    overdue: overdueConditions,
    started: startedConditions,
    notDue: notDueConditions,
    notStarted: notStartedConditions,
    completedToday: completedTodayConditions,
    failed: failedConditions,
    isStreak: streakConditions,
    notOverdue: notOverdueConditions,
    createdAfter: createdAfterConditions,
    createdBefore: createdBeforeConditions,
    lastRefreshedOnOrBefore: lastRefreshedOnOrBeforeConditions,
    startsOnOrAfter: startsOnOrAfterConditions,
    startsBefore: startsBeforeConditions,
    startsOnOrBefore: startsOnOrBeforeConditions,
    dueOnOrBefore: dueOnOrBeforeConditions,
    dueAfter: dueAfterConditions,
    dueOnOrAfter: dueOnOrAfterConditions,
    startsOn: startsOnConditions,
}



export async function findAllChildrenIn<M extends Model>(table: string, parentId: string, models: M[]): Promise<M[]> {
    if(parentId === '') {
        return models;
    }

    const children = await DB.get().collections.get(table).query(
        Q.where('parent_id', parentId)
    ).fetch()

    const descendants = await Promise.all(children.map(async (child: M) => {
        return await findAllChildrenIn(table, child.id, [child])
    }));

    return flat(descendants).concat(models);
}

function flat<T>(arr : T[][]) {
    let newArr: T[] = [];

    arr.forEach((a) => {
        newArr = newArr.concat(a);
    })
    return newArr;
}