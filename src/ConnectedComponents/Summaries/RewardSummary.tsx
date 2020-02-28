
import React from "react";


import withObservables from "@nozbe/with-observables";
import {
    Reward
} from "src/Models/Reward/Reward";
import RewardSummary, {OnChoice} from "src/Components/Summaries/RewardSummary";
import { StyleProp, ViewStyle } from "react-native";



interface Props {
    reward: Reward,
    style: StyleProp<ViewStyle>;
    navigation: any;
    onChoice: OnChoice;
}

const AdaptedRewardSummary: React.FunctionComponent<Props> = (props: Props) => {
    const reward = props.reward;

    return (
        <RewardSummary
            style={props.style}
            expireDate={reward.expireDate}
            navigation={props.navigation}
            title={reward.title}
            details={reward.details}
            onChoice={props.onChoice}
        >
        </RewardSummary>
    )

}

interface InputProps {
    reward: Reward
    style: StyleProp<ViewStyle>
    navigation: any;
    onChoice: OnChoice
}

/**
 * This function ensures that the component is connected to the database
 */

const enhance = withObservables([], (props: InputProps) => {
    return {
        reward: props.reward.observe(),
    }
});

export const ConnectedRewardSummary = enhance(AdaptedRewardSummary);