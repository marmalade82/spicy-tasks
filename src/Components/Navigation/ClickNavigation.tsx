
import React from "react";
import { View, TouchableOpacity, TouchableHighlight, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { Navigation, ScreenParams } from "src/common/Navigator";

interface Props {
    navigation: Navigation<ScreenParams>;
    parameters: object;
    destination: string;
    navType: "navigate" | "push";
    style?: StyleProp<ViewStyle>
}

interface State {}

const localStyle = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "pink",
        justifyContent: "center",
        alignItems: "stretch",
    },
});

export default class ClickNavigation extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }


    render = () => {
        return (
                <TouchableOpacity 
                    style={[localStyle.row, this.props.style]}
                    onPress={() => {
                        if(this.props.navType === "push") {
                            this.props.navigation.push(this.props.destination, this.props.parameters);
                        } else {
                            this.props.navigation.navigate(this.props.destination, this.props.parameters);
                        }
                    }}
                >
                    {this.props.children}
                </TouchableOpacity>
        );
    }
}