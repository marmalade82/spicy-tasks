
import React from "react";

import {
    ConnectedRecurListItem
} from "src/ConnectedComponents/Lists/Recur/RecurListItem";

import Recur from "src/Models/Recurrence/Recur";
import withObservables from "@nozbe/with-observables";

import RecurQuery from "src/Models/Recurrence/RecurQuery";
import List from "src/Components/Lists/base/List";
import { View } from "react-native";
import { Navigation, ScreenParams } from "src/common/Navigator";

interface Props {
    recurs: Recur[];
    navigation: Navigation<ScreenParams>;
}

const AdaptedRecurList: React.FunctionComponent<Props> = (props: Props) => {
    
    const renderRecur = (item: Recur) => {
        return (
            <ConnectedRecurListItem
                recur={item}
                navigation={props.navigation}
            ></ConnectedRecurListItem>
        );
    }

    return (
        <List
            items={props.recurs} 
            renderItem={renderRecur}
        >
        </List>
    )
}

interface InputProps extends Omit<Props, "recurs"> {
}


const enhance = withObservables([], (_props: InputProps) => {
    return {
        recurs: new RecurQuery().queryAll().observe()
    }
});

export const ConnectedRecurList = enhance(AdaptedRecurList);
