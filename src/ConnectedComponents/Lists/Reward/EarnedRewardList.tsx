
import React, { useRef } from "react";


import EarnedReward from "src/Models/Reward/EarnedReward";
import withObservables from "@nozbe/with-observables";

import EarnedRewardQuery from "src/Models/Reward/EarnedRewardQuery";
import List from "src/Components/Lists/base/List";
import { ConnectedEarnedRewardListItem } from "src/ConnectedComponents/Lists/Reward/EarnedRewardListItem";
import { PagedList } from "src/Components/Styled/Styled";
import EmptyListItem from "src/Components/Lists/Items/EmptyListItem";
import EmptyList from "src/Components/Lists/EmptyList";
import SwipeRow from "src/Components/Basic/SwipeRow";
import { View } from "react-native";
import { PRIMARY_COLOR, ROW_CONTAINER_HEIGHT } from "src/Components/Styled/Styles";
import { OnEarnedRewardAction } from "src/Components/Lists/Items/EarnedRewardListItem";

interface Props {
    earned: EarnedReward[];
    navigation: any;
    paginate?: number;
    emptyText?: string;
    onSwipeRight?: (id: string) => void;
    onEarnedRewardAction: OnEarnedRewardAction;
}

const AdaptedEarnedRewardList: React.FunctionComponent<Props> = (props: Props) => {
    const swipeRef = useRef<SwipeRow>(null);
    
    const renderEarnedReward = (item: EarnedReward) => {
        return (
            <SwipeRow
                ref={swipeRef}
                renderSwipeRight={() => {
                    return (
                        <View style={{
                            backgroundColor: PRIMARY_COLOR,
                            flex: 0,
                            height: ROW_CONTAINER_HEIGHT,
                            width: "100%",
                        }}>
                        </View>
                    )
                }}
                onSwipeRightOpen={() => { props.onSwipeRight ? props.onSwipeRight(item.id): null }}
                key={item.id}
            >
                <ConnectedEarnedRewardListItem
                    earned={item}
                    navigation={props.navigation}
                    onAction={(id: string, action: "use") => {
                        if(action === "use" && props.onSwipeRight && swipeRef.current && swipeRef.current.swipeRight) {
                            swipeRef.current.swipeRight();
                        } else {
                            props.onEarnedRewardAction(id, action);
                        }
                    }}
                >
                </ConnectedEarnedRewardListItem>
            </SwipeRow>
        )
    }

    if(props.paginate) {
        return (
            <PagedList
                items={props.earned}
                pageMax={props.paginate}
                renderItem={renderEarnedReward}
                renderEmptyItem={() => {return <EmptyListItem></EmptyListItem>}}
                renderEmptyList={() => { 
                    return (
                        <EmptyList
                            text={props.emptyText ? props.emptyText : "You haven't earned any rewards" }
                        ></EmptyList>
                    );
                }}
            ></PagedList>
        )
    } else {
        return (
            <List
                items={props.earned} 
                renderItem={renderEarnedReward}
            >
            </List>
        )
    }
}

interface InputProps extends Omit<Props, "earned"> {
    type? : "active" | "unused",
}

/**
 * Connects the list with the database
 */
const enhance = withObservables([], (props: InputProps) => {
    const { type } = props;  
    if(type) {
        switch(type) {
            case "active": {
                return {
                    earned: new EarnedRewardQuery().queryUnused().observe()
                }
            } break;
            case "unused": {
                return {
                    earned: new EarnedRewardQuery().queryUnused().observe()
                }
            } break;
            default: {
                return {
                    earned: new EarnedRewardQuery().queryAll().observe()
                }
            }
        }
    } else {
        return {
            earned: new EarnedRewardQuery().queryAll().observe()
        }
    }
});

export const ConnectedEarnedRewardList = enhance(AdaptedEarnedRewardList);