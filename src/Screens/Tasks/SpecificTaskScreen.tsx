import React from "react";

import { 
    ColumnView, RowView, RowReverseView, 
    HeaderText, BodyText, TouchableView,
} from "src/Components/Basic/Basic";
import { 
    ScreenHeader, DocumentView, ClickRow, 
    ListPicker, NavigationRow, Summary,
    ModalIconButton, Icon, IconButton, ModalRow,
} from "src/Components/Styled/Styled";
import { View, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

interface Props {
    navigation: any;
}

interface State {
    current: number;
    showMore: boolean;
}


export default class SpecificTaskScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Specific Task',
        }
    }
    constructor(props: Props ){
        super(props);

        this.state = {
            current: -1,
            showMore: false,
        }
    }

    render = () => {

        return (
            <DocumentView>
                <ScreenHeader>
                    {"Summary"}
                </ScreenHeader>
                <ScrollView>
                    <Summary
                        style={{}}
                        headerText={"Finish 3 Books this month, ideally with plenty of time to spare"} 
                        bodyText={() => {
                            return (
                                <Text style={{
                                }}>
                                    <BodyText style={{
                                        }}
                                    > 
                                        {"1/12/2020"}
                                        { " \u2013 "}
                                        {"1/18/2020\n\n"}
                                    </BodyText>
                                    <BodyText style={{}}>
                                        I'd like to be better read, so I've started to 
                                        read on a regular basis. Classics that I've 
                                        put off reading, like the Great Gatsby and 
                                        Shakespeare, are now first in line on my bookshelf.
                                        I'd like to be better read, so I've started to 
                                        read on a regular basis. Classics that I've 
                                        put off reading, like the Great Gatsby and 
                                        Shakespeare, are now first in line on my bookshelf.
                                        I'd like to be better read, so I've started to 
                                        read on a regular basis. Classics that I've 
                                        put off reading, like the Great Gatsby and 
                                        Shakespeare, are now first in line on my bookshelf.
                                    </BodyText>
                                </Text>
                            )
                        }}
                        footerElements={[
                            () => { return <IconButton type={"edit"}></IconButton>},
                            () => { return <IconButton type={"add"}></IconButton>},
                            () => { 
                                return (
                                    <ModalIconButton type={"more"}
                                        data={{
                                            showModal: this.state.showMore
                                        }}
                                        onDataChange={({showModal}) => {
                                            this.setState({
                                                showMore: showModal
                                            })
                                        }}

                                    >
                                        <ModalRow
                                            text={"Complete"}
                                            iconType={"complete"}
                                            onPress={() => {
                                                this.setState({
                                                    showMore: false
                                                })
                                            }}
                                        ></ModalRow>
                                        <ModalRow
                                            text={"Delete"}
                                            iconType={"delete"}
                                            onPress={() => {
                                                this.setState({
                                                    showMore: false
                                                })
                                            }}
                                        ></ModalRow>
                                    </ModalIconButton>
                                );
                            },
                        ]}
                    >
                    </Summary>
                    <NavigationRow
                        number={2}
                        text={"Active"}
                        navOptions={{
                            navigation: this.props.navigation,
                            destination: "SpecificTaskLists",
                            type: "push",
                            parameters: {
                                id: "",
                                index: 0,
                            }
                        }}
                        style={{
                            marginBottom: 0,
                            elevation: 0,
                            borderBottomWidth: 1,
                            borderBottomColor: "lightgrey",
                        }}
                    ></NavigationRow>
                    <NavigationRow
                        number={2}
                        text={"Completed"}
                        navOptions={{
                            navigation: this.props.navigation,
                            destination: "SpecificTaskLists",
                            type: "push",
                            parameters: {
                                id: "",
                                index: 1,
                            }
                        }}
                    >

                    </NavigationRow>
                </ScrollView>
            </DocumentView>
        );
    }
}