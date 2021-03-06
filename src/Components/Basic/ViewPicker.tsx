import React from "react";

import ColumnView from "src/Components/Basic/ColumnView";
import RowView from "src/Components/Basic/RowView";
import { Text, TouchableHighlight, TextStyle, StyleProp, ViewStyle } from "react-native";
import DataComponent from "src/Components/base/DataComponent";
import Style from "src/Style/Style";
import { bindCallback } from "rxjs";

interface Props {
    views: ViewProps[]
    pickerHeight?: number | string;
    pickerFlex?: number;
    bodyFlex?: number;
    data: State | false
    onDataChange: (d: State) => void;
    accessibilityLabel: string;
    inactiveTitleStyle?: StyleProp<TextStyle>;
    activeTitleStyle?: StyleProp<TextStyle>;
}

interface State {
    currentView: number;
}

interface ViewProps {
    title: string
    render: () => JSX.Element
}

function Default(): State {
    return {
        currentView: 0
    }
}

export default class ViewPicker extends DataComponent<Props, State, State> {

    constructor(props: Props) {
        super(props);

        this.state = Default();
    }

    pickerStyle = () => {
        if(this.props.pickerFlex) {
            return {
                flex: this.props.pickerFlex
            }
        } else if(this.props.pickerHeight) {
            return {
                flex: 0,
                height: this.props.pickerHeight,
            }
        }
    }

    bodyStyle = () => {
        if(this.props.bodyFlex) {
            return {
                flex: this.props.bodyFlex
            }
        }
    }

    titleStyle = (index: number): StyleProp<TextStyle> => {
        if(index === this.data().currentView) {
            return [{
                fontWeight: "bold",
                color: "black",
            }, this.props.activeTitleStyle];
        } else {
            return [{
                color: "gray"
            }, this.props.inactiveTitleStyle]
        }

    }

    titleContainerStyle = (index: number): StyleProp<ViewStyle> => {
        if(index === this.data().currentView) {
            return {
                backgroundColor: "lightgray"
            };
        } else {
        }

    }

    render = () => {
        return (
            <ColumnView style={{}}
                
            >
                <RowView style={[ Style.redBg, this.pickerStyle()]}>
                    {this.renderPicker()}
                </RowView>
                <RowView style={this.bodyStyle()}>
                    {this.renderInjectedViews()}
                </RowView>
            </ColumnView>
        );
    }

    renderPicker = () => {
        return this.props.views.map((viewProps, index) => {
            return (
                <TouchableHighlight
                    accessibilityLabel={"input-view-" + (index + 1).toString() + "-" + this.props.accessibilityLabel}
                    onPress={() => { 
                        this.setData({
                            currentView: index
                        });
                    }}
                    style={{flex: 1}}
                    key={index}
                >
                    <ColumnView style={[ { alignItems: "center" }, this.titleContainerStyle(index)]}>
                        <Text style={[this.titleStyle(index)]}>{viewProps.title}</Text>
                    </ColumnView>
                </TouchableHighlight>
            );
        });
        
    }

    renderInjectedViews = () => {
        const currentViewProps = this.props.views[this.data().currentView];
        if(currentViewProps) {
            return currentViewProps.render();
        }
    }
}

export {
    ViewPicker,
    ViewProps,
    Default,
}