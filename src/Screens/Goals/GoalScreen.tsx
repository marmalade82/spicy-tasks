import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import Style from "src/Style/Style";
import { ConnectedTaskList } from "src/ConnectedComponents/Lists/Task/TaskList"
import { ConnectedGoalSummary } from "src/ConnectedComponents/Summaries/GoalSummary";
import Goal from "src/Models/Goal/Goal";
import GoalQuery from "src/Models/Goal/GoalQuery";
import {
    ColumnView, RowView,
} from "src/Components/Basic/Basic";
import NavigationButton from "src/Components/Navigation/NavigationButton";


interface Props {
    navigation: any
}

interface State {
    goal?: Goal;
}

const localStyle = StyleSheet.create({
    container: {
    },
    summary: {
        flex: 1,
    },
    actionHeader: {
        flex: 0.3,
    },
    actionItem: {
        backgroundColor: "lightyellow"
    },
    list: {
        flex: 2.7,
    },
    button: {
        position: 'absolute',
        right: 25,
        top: 25,
    }
});


export default class GoalScreen extends React.Component<Props, State> {

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Goal',
        }
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            goal: undefined
        }
    }

    componentDidMount = async () => {
        const id = this.props.navigation.getParam('id', '');
        const goal = await GoalQuery.get(id); 

        if(goal) {
            this.setState({
                goal: goal
            })

        } else {
            this.setState({
                goal: undefined
            });
        }
    }

    onEditGoal = () => {
        const params = {
            id: this.props.navigation.getParam('id', ''),
        };
        this.props.navigation.navigate('AddGoal', params);
    }

    onAddTask = () => {
        const params = {

        };
    }

    render = () => {
        return (
            <ColumnView style={[localStyle.container, Style.redBg]}>
                <ColumnView
                    style={[localStyle.summary, Style.yellowBg]}
                >
                    {this.renderSummary()}
                </ColumnView>
                <RowView style={[localStyle.actionHeader, Style.greenBg]}>
                    <ColumnView style={[localStyle.actionItem]}>
                    </ColumnView>
                    <ColumnView style={[localStyle.actionItem]}>
                        <NavigationButton
                            title={"+"}
                            navigation={this.props.navigation}
                            parameters={{
                                id: "", // The task is new, so no id.
                                goal_id: this.props.navigation.getParam("id", ""), // the goal this task is associated with.
                                // But is this a parent or what?
                            }}
                            destination={'AddTask'}
                        ></NavigationButton>
                    </ColumnView>
                    <ColumnView style={[localStyle.actionItem]}>
                        <Button
                            title={"..."}
                            onPress={() => {}}
                        />
                    </ColumnView>
                </RowView>
                <ColumnView style={[Style.container, localStyle.list]}>
                    <ConnectedTaskList
                        navigation={this.props.navigation}
                    ></ConnectedTaskList>
                </ColumnView>
                <RowView style={[localStyle.button]}>
                    <NavigationButton
                        title={"edit"} 
                        navigation={this.props.navigation}
                        parameters={{
                            id: this.props.navigation.getParam('id', ''),
                        }}
                        color={"purple"}
                        destination={"AddGoal"}
                    ></NavigationButton>
                </RowView>
            </ColumnView>
        );
    }

    renderSummary = () => {
        if(this.state.goal) {
            return (
                    <ConnectedGoalSummary
                        goal={this.state.goal} 
                    ></ConnectedGoalSummary>
            );
        }
    }
}