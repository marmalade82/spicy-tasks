
import React from "react";


import Penalty from "src/Models/Penalty/Penalty";
import withObservables from "@nozbe/with-observables";

import PenaltyQuery from "src/Models/Penalty/PenaltyQuery";
import List from "src/Components/Lists/base/List";
import ClickNavigation from "src/Components/Navigation/ClickNavigation";
import { ConnectedPenaltyListItem } from "src/ConnectedComponents/Lists/Penalty/PenaltyListItem";
import { Navigation, ScreenParams } from "src/common/Navigator";

interface Props {
    penalties: Penalty[];
    navigation: Navigation<ScreenParams>;
}

const AdaptedPenaltyList: React.FunctionComponent<Props> = (props: Props) => {
    
    const renderPenalty = (item: Penalty) => {
        return (
            <ConnectedPenaltyListItem
                penalty={item}
                navigation={props.navigation}
            >
            </ConnectedPenaltyListItem>
        )
    }

    return (
        <List
            items={props.penalties} 
            renderItem={renderPenalty}
        >
        </List>
    )
}


interface InputProps extends Omit<Props, "penalties"> {
}

/**
 * Connects the list with the database
 */
const enhance = withObservables([], (_props: InputProps) => {
    return {
        penalties: new PenaltyQuery().queryAll().observe()
    }
});

export const ConnectedPenaltyList = enhance(AdaptedPenaltyList);
