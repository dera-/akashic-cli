import * as React from "react";
import { observer } from "mobx-react";
import { ServiceType } from "../../../common/types/ServiceType";
import { PlayEntity } from "../../store/PlayEntity";
import { LocalInstanceEntity } from "../../store/LocalInstanceEntity";
import { ToolBarUiStore } from "../../store/ToolBarUiStore";
import { Operator } from "../../operator/Operator";
import { PlayControlPropsData } from "../molecule/PlayControl";
import { InstanceControlPropsData } from "../molecule/InstanceControl";
import { PlayerControlPropsData } from "../molecule/PlayerControl";
import { DisplayOptionControlPropsData } from "../molecule/DisplayOptionControl";
import { ToolBar } from "../organism/ToolBar";

export interface ToolBarContainerProps {
	play: PlayEntity;
	localInstance: LocalInstanceEntity;
	operator: Operator;
	toolBarUiStore: ToolBarUiStore;
	targetService: ServiceType;
}

@observer
export class ToolBarContainer extends React.Component<ToolBarContainerProps, {}> {
	render(): React.ReactNode {
		const { operator, localInstance, toolBarUiStore, targetService } = this.props;
		return <ToolBar
			makePlayControlProps={this._makePlayControlProps}
			makeInstanceControlProps={this._makeInstanceControlProps}
			makePlayerControlProps={this._makePlayerControlProps}
			makeDisplayOptionControlProps={this._makeDisplayOptionControlProps}
			showsAppearance={toolBarUiStore.showsAppearanceMenu}
			showsDevtools={toolBarUiStore.showsDevtools}
			showsInstanceControl={(localInstance.executionMode === "replay") || toolBarUiStore.showsDevtools}
			targetService={targetService}
			onToggleAppearance={operator.ui.setShowAppearance}
			onClickDevTools={operator.ui.setShowDevtools}
		/>;
	}

	private _makePlayControlProps = (): PlayControlPropsData => {
		const { play, operator } = this.props;
		return {
			playbackRate: play.activePlaybackRate,
			isActivePausing: play.isActivePausing,
			onClickReset: operator.restartWithNewPlay,
			onClickActivePause: operator.play.togglePauseActive,
			onClickAddInstance: operator.play.openNewClientInstance
		};
	}

	private _makeInstanceControlProps = (): InstanceControlPropsData => {
		const { play, localInstance, operator, toolBarUiStore } = this.props;
		return {
			currentTime: (
				(localInstance.executionMode !== "replay") ? play.duration :
				(toolBarUiStore.isSeeking) ? toolBarUiStore.currentTimePreview : localInstance.targetTime
			),
			duration: play.duration,
			isPaused: localInstance.isPaused,
			isProgressActive: toolBarUiStore.isSeeking,
			enableFastForward: (localInstance.executionMode === "replay"),
			onProgressChange: operator.localInstance.previewSeekTo,
			onProgressCommit: operator.localInstance.seekTo,
			onClickPause: operator.localInstance.togglePause,
			onClickFastForward: operator.localInstance.switchToRealtime
		};
	}

	private _makePlayerControlProps = (): PlayerControlPropsData => {
		const { localInstance, operator, targetService } = this.props;
		const joinEnabled = targetService !== ServiceType.NicoLive;
		return {
			selfId: localInstance.player.id,
			isJoined: localInstance.isJoined,
			isJoinEnabled: (localInstance.executionMode === "passive" && joinEnabled),
			onClickJoinLeave: operator.play.toggleJoinLeaveSelf
		};
	}

	private _makeDisplayOptionControlProps = (): DisplayOptionControlPropsData => {
		const { operator, toolBarUiStore } = this.props;
		return {
			showsDisplayOptionPopover: toolBarUiStore.showsDisplayOptionPopover,
			showsBackgroundImage: toolBarUiStore.showsBackgroundImage,
			showsGrid: toolBarUiStore.showsGrid,
			onClickDisplayOptionPopover: operator.ui.setShowDisplayOptionPopover,
			onChangeShowBackgroundImage: operator.ui.setShowBackgroundImage,
			onChangeShowGrid: operator.ui.setShowGrid
		};
	}
}
