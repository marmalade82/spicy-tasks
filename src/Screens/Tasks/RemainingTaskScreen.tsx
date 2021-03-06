import React from "react";
import { ColumnView, RowView, RowReverseView, HeaderText } from "src/Components/Basic/Basic";
import { ScreenHeader, DocumentView, ClickRow, ListPicker, ListItem } from "src/Components/Styled/Styled";
import List from "src/Components/Lists/base/List";
import TaskQuery, { TaskLogic, ActiveTaskQuery } from "src/Models/Task/TaskQuery";
import { ConnectedTaskList } from "src/ConnectedComponents/Lists/Task/TaskList";
import { MainNavigator, ScreenNavigation } from "src/common/Navigator";

interface Props {
    navigation: object;
}

interface State {
    currentList: number;
}

export default class RemainingTaskScreen extends React.Component<Props, State> {
    unsubscribe: () => void;
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Remaining Tasks',
        }
    }
    
    navigation: MainNavigator<"RemainingTasks">;
    constructor(props: Props ){
        super(props);

        this.state = {
            currentList: 0,
        }
        this.unsubscribe = () => {};
        this.navigation = new ScreenNavigation(props);
    }

    componentDidMount = () => {
        this.unsubscribe = () => {
        }
    }

    componentWillUnmount = () => {
        this.unsubscribe();
    }

    onTaskAction = (id: string, action: "complete" | "fail") => {
        switch(action) {
            case "complete": {
                void new TaskLogic(id).complete();
            } break; 
            case "fail": {
                void new TaskLogic(id).fail();
            } break;
        }
    }

    render = () => {
        return (
            <DocumentView accessibilityLabel={'remaining-tasks'}>
                <ListPicker
                    data={{
                        current: this.state.currentList
                    }}  
                    onDataChange={({ current }) => {
                        this.setState({
                            currentList: current
                        })
                    }}
                    lists={this.renderLists()}
                    layout={"top"}
                >

                </ListPicker>
            </DocumentView>
        );
    }

    renderLists = () => {
        return [
            { selector: {              
                number: 0,
                text: "Due Today",
              },
              list: () => {
                  return (
                    <ConnectedTaskList
                        navigation={this.navigation}
                        type={"active-due-soon-today"}
                        parentId={""}
                        onTaskAction={this.onTaskAction}
                        id={undefined}
                    ></ConnectedTaskList>
                  );
              }
            },
            { selector: {
                number: 0,
                text: "In Progress",
              },
              list: () => {
                  return (
                      <ConnectedTaskList
                        navigation={this.navigation}
                        type={"in-progress-but-not-due-today"}
                        parentId={""}
                        onTaskAction={this.onTaskAction}
                        id={undefined}
                      >
                      </ConnectedTaskList>
                  )
              }
            },
            { selector: {
                number: 0,
                text: "Completed",
              },
              list: () => {
                  return (
                    <ConnectedTaskList
                        navigation={this.navigation}
                        type={"completed-today"}
                        parentId={""}
                        onTaskAction={this.onTaskAction}
                        id={undefined}
                    >
                    </ConnectedTaskList>
                  )
              }
            },
        ]
    }
}