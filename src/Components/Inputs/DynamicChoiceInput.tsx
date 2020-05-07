
import React from "react";
import { View, Text, Picker, StyleSheet, StyleProp, ViewStyle } from "react-native";
import Style from "src/Style/Style";
import Input from "src/Components/Inputs/base/Input";
import { ColumnView } from "src/Components/Basic/Basic";
import { Label, DynamicChoiceInput as CInput } from "src/Components/Styled/Styled";
import { Observable } from "rxjs";
import { Layout, Type, StyleSheetContext } from "src/Components/Styled/StyleSheets";
import { access } from "fs";


interface LabelValue {
    label: string,
    value: string,
    key: string,
}

export interface Props {
    title: string;
    data: string;
    choices: Observable<LabelValue[]>
    onDataChange: (itemValue: string, itemPosition?: number) => void
    accessibilityLabel: string;
    style?: StyleProp<ViewStyle>;
    success ? : boolean;
    failure ? : string;
    onBlur?: () => void;
    emptyType? : "earned-penalty" | "earned-reward";
    onEmptyPress?: () => void;
}

export interface State {

}

export default class DynamicChoiceInput extends Input<Props, State> {

    static contextType = StyleSheetContext;
    context!: React.ContextType<typeof StyleSheetContext>
    constructor(props: Props) {
        super(props);
    }

    icon = () => {
        if(this.props.failure !== undefined) {
            return "attention";
        }
    }

    render = () => {
        const { Class, Common, Custom } = this.context;
        return (
            <ColumnView style={[Class.InputContainer, this.props.style]}
            >
                <Label
                    text={this.props.title} 
                ></Label>
                <CInput
                    value={this.props.data}
                    choices={this.props.choices}
                    onValueChange={this.props.onDataChange}
                    accessibilityLabel={this.props.accessibilityLabel}
                    onBlur={this.props.onBlur}
                    icon={this.icon()}
                    emptyType={this.props.emptyType}
                    onEmptyPress={this.props.onEmptyPress}
                ></CInput>
            </ColumnView>
        )
    }
}

type ChoiceProps = {
    label: string;
    value: string
    onChange: (val: string) => void;
    accessibilityLabel: string;
    valid: ["ok", string] | ["error", string]
    readonly: boolean
    choices: Observable<LabelValue[]>
    style?: StyleProp<ViewStyle>;
    emptyType? : "earned-penalty" | "earned-reward";
    onEmptyPress?: () => void;
}

export const ADynamicChoiceInput: React.FunctionComponent<ChoiceProps> = (props: ChoiceProps) => {
    const { label, value, onChange, choices, accessibilityLabel, valid, readonly,
            style, emptyType, onEmptyPress } = props;
    return (
        <DynamicChoiceInput
            title={label}
            data={value}
            onDataChange={onChange}
            accessibilityLabel={accessibilityLabel}
            choices={choices}
            success={(() => {
                return valid[0] === "ok";
            })()}
            failure={(() => {
                return valid[0] === "ok" ? undefined : valid[1];
            })()}
            style={style}
            emptyType={emptyType}
            onEmptyPress={onEmptyPress}
        ></DynamicChoiceInput>
    )
}