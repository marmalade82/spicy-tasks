import React from "react";
import { Rewards, RewardType } from "src/Models/Reward/RewardLogic";
import TwoDice, { RewardChoice as TwoDiceRewardChoice } from "src/Components/EarnedRewards/TwoDice/TwoDice";
import RewardQuery from "src/Models/Reward/RewardQuery";
import PenaltyQuery from "src/Models/Penalty/PenaltyQuery";
import { random } from "src/common/random";


interface Props {
    earnedRewardType: RewardType;
}

interface State {
    twoDiceRewardChoices: TwoDiceRewardChoice[];
}


export default class EarnedRewardWizard extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            twoDiceRewardChoices : []
        }
    }

    componentDidMount = async () => {
        const rewards = await new RewardQuery().all();
        const penalties = await new PenaltyQuery().all();

        const rewardChoices: TwoDiceRewardChoice[] = [];
        const penaltyChoices: TwoDiceRewardChoice[] = [];

        // Randomly select 9 rewards and 2 penalties from what is returned.
        for(let i = 0; i < 9; i++) {
            if(rewards.length > 0) {
                let reward = rewards[random(0, rewards.length - 1)]
                rewardChoices.push({
                    text: reward.title,
                    number: (i + 3).toString(), // rewards are numbered 3 through 11
                    key: reward.id,
                    rewardId: reward.id,
                });
            } else {
                rewardChoices.push({
                    text: "No reward",
                    number: (i + 3).toString(),
                    key: (i + 3).toString(),
                    rewardId: undefined,
                })
            }
        }

        for(let i = 0; i < 2; i++) {
            if(penalties.length > 0) {
                let penalty = penalties[random(0, penalties.length - 1)]
                penaltyChoices.push({
                    text: penalty.title,
                    number: i === 0 ? "2" : "12",
                    key: penalty.id,
                    penaltyId: penalty.id
                });
            } else {
                penaltyChoices.push({
                    text: "No penalty",
                    number: i === 0 ? "2" : "12",
                    key: i === 0 ? "2" : "12",
                    penaltyId: undefined,
                });
            }
        }

        this.setState({
            twoDiceRewardChoices: [...rewardChoices, ...penaltyChoices].sort((a, b) => {
                return (
                    parseInt(a.number) - parseInt(b.number)
                );
            })
        })

    }

    render = () => {
        switch(this.props.earnedRewardType) {
            case Rewards.TWO_DICE: {
                return (
                    <TwoDice 
                        style={{
                            flex: 16
                        }}
                        controlHeight={50}
                        accessibilityLabel={"two-dice-wizard"}
                        rewardChoices={this.state.twoDiceRewardChoices}
                    >

                    </TwoDice>

                )
            } break;
            default: {
                return undefined;
            }
        }
    }

}