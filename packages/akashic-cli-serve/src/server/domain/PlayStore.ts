import { AMFlowClient, Play, PlayManager } from "@akashic/headless-driver";
import { Trigger } from "@akashic/trigger";
import { Player } from "../../common/types/Player";
import {
	PlayCreateTestbedEvent,
	PlayStatusChangedTestbedEvent,
	PlayDurationStateChangeTestbedEvent,
	PlayerJoinTestbedEvent,
	PlayerLeaveTestbedEvent,
	RunnerCreateTestbedEvent,
	RunnerRemoveTestbedEvent,
	ClientInstanceAppearTestbedEvent,
	ClientInstanceDisappearTestbedEvent,
	RunnerDescription,
	ClientInstanceDescription
} from "../../common/types/TestbedEvent";
import { PlayDurationState } from "../../common/types/PlayDurationState";
import { TimeKeeper } from "../../common/TimeKeeper";
import { ServerContentLocator } from "../common/ServerContentLocator";
import { DumpedPlaylog } from "../common/types/DumpedPlaylog";
import { activePermission, passivePermission } from "./AMFlowPermisson";

export interface PlayStoreParameterObject {
	playManager: PlayManager;
}

export interface PlayEntity {
	contentLocator: ServerContentLocator;
	timeKeeper: TimeKeeper;
	clientInstances: ClientInstanceDescription[];
	runners: RunnerDescription[];
	joinedPlayers: Player[];
}

export class PlayStore {
	onPlayCreate: Trigger<PlayCreateTestbedEvent>;
	onPlayStatusChange: Trigger<PlayStatusChangedTestbedEvent>;
	onPlayDurationStateChange: Trigger<PlayDurationStateChangeTestbedEvent>;
	onPlayerJoin: Trigger<PlayerJoinTestbedEvent>;
	onPlayerLeave: Trigger<PlayerLeaveTestbedEvent>;
	onClientInstanceAppear: Trigger<ClientInstanceAppearTestbedEvent>;
	onClientInstanceDisappear: Trigger<ClientInstanceDisappearTestbedEvent>;

	private playManager: PlayManager;

	// TODO playId ごとの情報を集約して PlayEntity を作る
	private playEntities: { [playId: string]: PlayEntity };

	constructor(params: PlayStoreParameterObject) {
		this.onPlayCreate = new Trigger<PlayCreateTestbedEvent>();
		this.onPlayStatusChange = new Trigger<PlayStatusChangedTestbedEvent>();
		this.onPlayDurationStateChange = new Trigger<PlayDurationStateChangeTestbedEvent>();
		this.onPlayerJoin = new Trigger<PlayerJoinTestbedEvent>();
		this.onPlayerLeave = new Trigger<PlayerLeaveTestbedEvent>();
		this.onClientInstanceAppear = new Trigger<ClientInstanceAppearTestbedEvent>();
		this.onClientInstanceDisappear = new Trigger<ClientInstanceDisappearTestbedEvent>();
		this.playManager = params.playManager;
		this.playEntities = {};
	}

	/**
	 * Playを生成するが、返すものはPlayId
	 */
	async createPlay(loc: ServerContentLocator, playlog?: DumpedPlaylog): Promise<string> {
		const playId = await this.playManager.createPlay({
			contentUrl: loc.asAbsoluteUrl()
		});
		this.playEntities[playId] = {
			contentLocator: loc,
			timeKeeper: new TimeKeeper(),
			clientInstances: [],
			runners: [],
			joinedPlayers: []
		};
		if (playlog) {
			await this.loadPlaylog(playId, playlog);
		}
		this.onPlayCreate.fire({playId, contentLocatorData: loc});
		this.onPlayStatusChange.fire({playId, playStatus: "running"});
		return playId;
	}

	getPlay(playId: string): Play {
		return this.playManager.getPlay(playId);
	}

	getPlays(): Play[] {
		return this.playManager.getAllPlays();
	}

	async stopPlay(playId: string): Promise<void> {
		await this.playManager.deletePlay(playId);
		this.onPlayStatusChange.fire({playId, playStatus: "suspending"});
	}

	createPlayToken(playId: string, isActive: boolean): string {
		return this.playManager.createPlayToken(playId, isActive ? activePermission : passivePermission);
	}

	createAMFlow(playId: string): AMFlowClient {
		return this.playManager.createAMFlow(playId);
	}

	registerClientInstance(playId: string, desc: ClientInstanceDescription): void {
		this.playEntities[playId].clientInstances.push(desc);
		this.onClientInstanceAppear.fire(desc);
	}

	unregisterClientInstance(playId: string, desc: ClientInstanceDescription): void {
		this.playEntities[playId].clientInstances = this.playEntities[playId].clientInstances.filter(i => i.id !== desc.id);
		this.onClientInstanceDisappear.fire(desc);
	}

	registerRunner(param: RunnerCreateTestbedEvent): void {
		const playId = param.playId;
		this.playEntities[playId].runners.push(param);
	}

	unregisterRunner(param: RunnerRemoveTestbedEvent): void {
		const playId = param.playId;
		this.playEntities[playId].runners = this.playEntities[playId].runners.filter(i => i.runnerId !== param.runnerId);
	}

	join(playId: string, player: Player): void {
		this.playEntities[playId].joinedPlayers.push(player);
		this.onPlayerJoin.fire({playId, player});
	}

	leave(playId: string, playerId: string): void {
		this.playEntities[playId].joinedPlayers = this.playEntities[playId].joinedPlayers.filter(player => player.id !== playerId);
		this.onPlayerLeave.fire({playId, playerId});
	}

	pausePlayDuration(playId: string): void {
		this.playEntities[playId].timeKeeper.pause();
		this.onPlayDurationStateChange.fire({playId, isPaused: true});
	}

	resumePlayDuration(playId: string): void {
		const timeKeeper = this.playEntities[playId].timeKeeper;
		timeKeeper.start();
		this.onPlayDurationStateChange.fire({playId, isPaused: false, duration: timeKeeper.now() });
	}

	getJoinedPlayers(playId: string): Player[] {
		return this.playEntities[playId].joinedPlayers;
	}

	getContentLocator(playId: string): ServerContentLocator {
		return this.playEntities[playId].contentLocator;
	}

	getRunners(playId: string): RunnerDescription[] {
		return this.playEntities[playId].runners;
	}

	getClientInstances(playId: string): ClientInstanceDescription[] {
		return this.playEntities[playId].clientInstances;
	}

	getPlayDurationState(playId: string): PlayDurationState {
		const timeKeeper = this.playEntities[playId].timeKeeper;
		return { duration: timeKeeper.now(), isPaused: timeKeeper.isPausing() };
	}

	private async loadPlaylog(playId: string, playlog: DumpedPlaylog): Promise<void> {
		const token = this.createPlayToken(playId, true);
		const amflow = this.createAMFlow(playId);
		await new Promise((resolve, reject) => amflow.open(playId, (e: Error) => e ? reject(e) : resolve()));
		await new Promise((resolve, reject) => amflow.authenticate(token, (e: Error) => e ? reject(e) : resolve()));
		await new Promise((resolve, reject) => amflow.putStartPoint(playlog.startPoints[0], (e: Error) => e ? reject(e) : resolve()));
		playlog.tickList[2].forEach((tick) => {
			amflow.sendTick(tick);
		});
		amflow.destroy();

		// クライアント側にdurationとしてplaylogに記録されている終了時間を渡す必要があるので、そのための設定を行う
		const timeKeeper = this.playEntities[playId].timeKeeper;
		const finishedTime = this.calculataFinishedTime(playlog);
		timeKeeper.setTime(finishedTime);
	}

	// コンテンツの終了時間をplaylogから算出する
	private calculataFinishedTime(playlog: DumpedPlaylog): number {
		const fps = playlog.startPoints[0].data.fps;
		const replayStartTime = playlog.startPoints[0].timestamp;
		const replayLastAge = playlog.tickList[1];
		const ticksWithEvents = playlog.tickList[2];
		let replayLastTime = null;
		loop: for (let i = ticksWithEvents.length - 1; i >= 0; --i) {
			const tick = ticksWithEvents[i];
			const pevs = tick[1] || [];
			for (let j = 0; j < pevs.length; ++j) {
				if (pevs[j][0] === 2) { // TimestampEvent
					const timestamp = pevs[j][3]; // Timestamp
					// Timestamp の時刻がゲームの開始時刻より小さかった場合は相対時刻とみなす
					replayLastTime = (timestamp < replayStartTime ? timestamp + replayStartTime : timestamp) + (replayLastAge - tick[0]) * 1000 / fps;
					break loop;
				}
			}
		}
		return (replayLastTime == null) ? (replayLastAge * 1000 / fps) : (replayLastTime - replayStartTime);
	}
}
