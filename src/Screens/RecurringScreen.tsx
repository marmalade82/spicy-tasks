import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Style from "src/Style/Style";
import { RecurringForm } from "src/Components";

interface Props {

}

interface State {}

const localStyle = StyleSheet.create({
    container: {
    },
})

export default class RecurringScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Recurring',
        }
    }

    render = () => {
        return (
            <View style={[Style.container, Style.greenBg, localStyle.container]}>
                <RecurringForm
                    onSave={() => {}}
                ></RecurringForm>
            </View>
        )
    }
}