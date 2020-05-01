import React from "react";
import { Layout, Type, Class } from "src/Components/Styled/StyleSheets";
import IconButton from "src/Components/Styled/IconButton";
import { ScrollView, View, Modal as ReactModal, TouchableWithoutFeedback } from "react-native";
import { LEFT_FIRST_MARGIN, LEFT_SECOND_MARGIN, RIGHT_SECOND_MARGIN, OVERLAY, MODAL_VERTICAL_PADDING } from "./Styles";

interface Props {
    visible: boolean;
    onRequestClose: () => void;
    height? : number;
    accessibilityLabel? : string;
}

interface State {

}

export default class Modal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {

        };
    }

    render = () => {
        return (
            <ReactModal
                visible={this.props.visible}
                transparent={true}
                onRequestClose={ this.props.onRequestClose }
                animationType={ "fade" }
            >
                <TouchableWithoutFeedback
                    style={{
                        flex: 1
                    }}
                    onPress={(event) => {
                        event.preventDefault();
                        this.props.onRequestClose();
                    }}
                >
                    <View style={[{
                            flex: 1,
                            backgroundColor: OVERLAY,
                            paddingLeft: RIGHT_SECOND_MARGIN,
                            paddingRight: RIGHT_SECOND_MARGIN,
                        }, Layout.CENTERED]}
                    >
                        <TouchableWithoutFeedback
                            style={{
                                flex:0
                            }}
                            onPress={(event) => {
                                event.preventDefault()
                            }}
                            touchSoundDisabled={true}
                        >
                            <View style={{
                                    flex: 0,
                                    maxHeight: "80%",
                                    height: this.props.height,
                                    justifyContent: "flex-start",
                                    alignItems: "stretch",
                                    backgroundColor: "white",
                                    width: "100%",
                                    paddingTop: MODAL_VERTICAL_PADDING,
                                    paddingBottom: MODAL_VERTICAL_PADDING,
                                    overflow: "visible"
                                }}
                                accessibilityLabel={this.props.accessibilityLabel ? "modal-" + this.props.accessibilityLabel : undefined}
                            >
                                <ScrollView>
                                    {this.props.children}
                                </ScrollView>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </ReactModal>
        );
    }
}