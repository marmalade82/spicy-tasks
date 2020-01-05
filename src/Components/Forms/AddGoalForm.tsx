import React from "react";

import { Text, TextInput, View, Picker } from "react-native";
import {
    ChoiceInput,
    StringInput,
    SaveModalInput,
    ModalInput,
    DateTimeInput,
    MultipleInput,
    NumberInput,
} from "src/Components/Inputs";
import RecurringForm from "src/Components/Forms/RecurringForm";
import StreakForm from "src/Components/Forms/AddGoalForm/StreakForm";
import Style from "src/Style/Style";

interface Props {
    navigation: Navigator
}

interface State {
    title: string;
    type: "normal" | "streak";
    recurring: boolean;
    start_date: Date;
    due_date: Date;
    reward: Reward
    penalty: Penalty
    recurData: RecurringData
    streakData: StreakData
}

interface StreakData {
    minimum: number
    type: "daily" | "weekly" | "monthly"
    day_start: Date
    week_start: number;
    month_start: number;
}

interface Navigator {
    navigate: (screen: string) => void
}

enum Reward {
    NONE = 1,
    DICE,
    ONE,
}

enum Penalty {
    NONE = 1,
    DICE,
    ONE,
}

interface LabelValue {
    label: string,
    value: string,
    key: string

}

const rewards: LabelValue[] = [
    { label: "none", value: Reward.NONE.toString(), key: Reward.NONE.toString() },
    { label: "dice", value: Reward.DICE.toString(), key: Reward.DICE.toString()},
    { label: "choose one...", value: Reward.ONE.toString(), key: Reward.ONE.toString() },
].sort((a, b) => {
    return parseInt(a.value) - parseInt(b.value)
});

const penalties: LabelValue[] = [
    { label: "none", value: Penalty.NONE.toString(), key: Penalty.NONE.toString() },
    { label: "dice", value: Penalty.DICE.toString(), key: Penalty.DICE.toString() },
    { label: "Choose one...", value: Penalty.ONE.toString(), key: Penalty.ONE.toString() },
].sort((a, b) => {
    return parseInt(a.value) - parseInt(b.value);
});

interface RecurringData {
    recurs: string
    date: Date
}


export default class AddGoalForm extends React.Component<Props, State> {
    recurForm: React.RefObject<ModalInput>
    constructor(props: Props) {
        super(props);

        const initialState: State = {
            title: "",
            type: "normal",
            recurring: false,
            start_date: new Date(),
            due_date: new Date(),
            reward: Reward.DICE,
            penalty: Penalty.NONE,
            recurData: {
                recurs: "never",
                date: new Date(),
            },
            streakData: {
                minimum: 2,
                type: "daily",
                day_start: new Date(),
                week_start: 0,
                month_start: 1,
            }
        }

        this.state = initialState;
        this.recurForm = React.createRef();
    }

    onChangeTitle = (text: string) => {
        this.setState({
            title: text
        });
    }

    renderChoices = (choices: LabelValue[]) => {
        return choices.map((choice: LabelValue) => {
            return (
                <Picker.Item label={choice.label} value={choice.value}/>
            );
        })
    }

    renderRecurData = () => {
        return this.state.recurData.recurs + " " + this.state.recurData.date.toDateString();
    }

    onRecurSave = (data: RecurringData) => {
        this.setState({
            recurData: data,
        });

        if(this.recurForm.current !== null) {
            this.recurForm.current.hideModal();
        }
    }

    onChangeStartDate = (date: Date) => {

        this.setState({
            start_date: date
        });
    }

    onChangeDueDate = (date: Date) => {
        this.setState({
            due_date: date
        });
    }

    onChangeType = (type: string) => {
        if(type === "streak" || type === "normal") {
            this.setState({
                type: type
            });
        } else {
            this.setState({
                type: "normal"
            });
        }
    }

    onChangeMinimum = (type: number) => {

    }

    renderStreak = () => {
        if(this.state.type === "streak") {
            <StreakForm>

            </StreakForm>
        }
    };

    render = () => {
        return (
            <View style={[Style.container, Style.blueBg]}>
                <StringInput
                    title={"Summary"}
                    value={this.state.title}
                    placeholder={"What do you want to achieve?"}
                    onChangeText={this.onChangeTitle}
                />

                <ChoiceInput
                    title={"Type"}
                    selectedValue={this.state.type}
                    choices={typeChoices}
                    onValueChange={this.onChangeType}
                />


                <DateTimeInput
                    title={"Starts on"}
                    type={"date"}
                    value={ this.state.start_date }
                    onValueChange={ this.onChangeStartDate }
                />

                <DateTimeInput
                    title={"Due on"} 
                    type={"date"}
                    value={ this.state.due_date }
                    onValueChange={ this.onChangeDueDate }
                />

                <ChoiceInput
                    title={"Reward"}
                    selectedValue={this.state.reward.toString()}
                    onValueChange={(itemValue, itemIndex) => {
                        this.setState({reward: parseInt(itemValue)})  
                    }}
                    choices={rewards}
                />

                <ChoiceInput
                    title={"Penalty"}
                    selectedValue={this.state.penalty.toString()}
                    onValueChange={(itemValue, itemIndex) => {
                        this.setState({penalty: parseInt(itemValue)})  
                    }}
                    choices={penalties}
                />

                <ModalInput
                    title={"Recurring?"} 
                    animationType={"fade"}
                    screenType={"grey"}
                    value={this.renderRecurData()}
                    ref={this.recurForm}
                >
                    <View style={[Style.modalContainer, {backgroundColor: "white"}]}>
                        <RecurringForm
                            data={this.state.recurData}
                            onSave={this.onRecurSave}
                        >
                        </RecurringForm>
                    </View>
                </ModalInput>
            </View>
        )
    }
}

const typeChoices = [
    { label: "Normal"
    , value: "normal"
    , key: "1"
    },
    { label: "Streak"
    , value: "streak"
    , key: "0"
    },
]