
import React from "react";


import withObservables from "@nozbe/with-observables";
import {
    Recur
} from "src/Models/Recurrence/Recur";
import RecurSummary, { ModalChoices } from "src/Components/Summaries/RecurSummary";
import GoalQuery, { Goal } from "src/Models/Goal/GoalQuery";

interface Props {
    recur: Recur,
    navigation: any,
    onModalChoice: (s: ModalChoices) => void;
    goals: Goal[];
}

const AdaptedRecurSummary: React.FunctionComponent<Props> = (props: Props) => {
    const recur = props.recur;
    const latestGoal = props.goals.sort((a, b) => {
        return b.startDate.valueOf() - a.startDate.valueOf();
    })[0];

    const mappedRecur = {
        active: recur.active,
        type: recur.type,
        title: latestGoal ? latestGoal.title : "",
        details: latestGoal ? latestGoal.details: "",
    }

    return (
        <RecurSummary
            recur={mappedRecur}
            navigation={props.navigation}
            onModalChoice={props.onModalChoice}
        >
        </RecurSummary>
    )

}


interface InputProps {
    recur: Recur,
    navigation: any,
    onModalChoice: (s: ModalChoices) => void;
}

/**
 * This function ensures that the component is connected to the database
 */

const enhance = withObservables(['recur'], (props: InputProps) => {
    return {
        recur: props.recur.observe(),
        goals: new GoalQuery().queryInRecurrence(props.recur.id).observe(),
    }
});

export const ConnectedRecurSummary = enhance(AdaptedRecurSummary);