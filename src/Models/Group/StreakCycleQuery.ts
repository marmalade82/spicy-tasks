import ModelQuery from "src/Models/base/Query";
import { StreakCycle, IStreakCycle } from "src/Models/Group/StreakCycle";
import { Q } from "@nozbe/watermelondb";
import { GroupSchema } from "src/Models/Group/GroupSchema";
import { startDate, dueDate } from "src/Components/Forms/common/utils";
import { Conditions } from "../common/queryUtils";
import GoalQuery from "../Goal/GoalQuery";




export class StreakCycleQuery extends ModelQuery<StreakCycle, IStreakCycle> {

    constructor() {
        super(GroupSchema.table);
    }

    default = () => {
        return {
            type: "streak_cycle",
            parentGoalId: "",
            startDate: startDate(new Date()),
            endDate: dueDate(new Date()),
        } as const;
    }

    queries = () => {
        return [
            Q.where(GroupSchema.name.TYPE, "streak_cycle"),
        ];
    }

    queryInGoal = (goalId: string) => {
        return this.query(
            Q.where(GroupSchema.name.PARENT, goalId)
        );
    }

    queryBefore = (date: Date) => {
        return this.query(
            ...Conditions.startsBefore(date),
        )
    }

    latestInGoal = async (goalId: string) => {
        const cycles = await new StreakCycleQuery().queryInGoal(goalId).fetch();
        const sorted = cycles.sort((a, b) => {
            return b.startDate.valueOf() - a.startDate.valueOf()
        })

        return sorted[0] ? sorted[0] : null;
    }

    inGoalCurrentCycle = async (goalId: string) => {
        const goal = await new GoalQuery().get(goalId);
        if(goal) {
            const cycles = await this.query(
                Q.and(...Conditions.startsOnOrAfter(goal.currentCycleStart())),
                Q.and(...Conditions.startsBefore(goal.currentCycleEnd()))
            ).fetch();

            if(cycles[0]) {
                return cycles[0];
            }
        }

        return null;
    }
}

export default StreakCycleQuery;

export class StreakCycleLogic {
    id: string;

    constructor(id: string) {
        this.id = id;
    }
}