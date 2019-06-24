import { Store } from "../store/Store";
import { NotificationType } from "../store/NotificationType";

export class UiOperator {
	private store: Store;

	constructor(store: Store) {
		this.store = store;
	}

	showActivePlabackRateDialog = (): void => {
		// not implemented
		// this.store.ui.toolBar.showActivePlaybackRateDialog();
	}

	toggleShowAppearance = (show: boolean): void => {
		this.store.toolBarUiStore.toggleShowAppearance(show);
	}

	toggleShowDevtools = (show: boolean): void => {
		this.store.toolBarUiStore.toggleShowDevtools(show);
	}

	toggleShowBgImage = (show: boolean): void => {
		this.store.toolBarUiStore.toggleShowBgImage(show);
	}

	setDevtoolHeight = (height: number) => {
		this.store.devtoolUiStore.setHeight(height);
	}

	setActiveDevtool = (type: string): void => {
		this.store.devtoolUiStore.setActiveDevtool(type);
	}

	setEventListWidth = (width: number): void => {
		this.store.devtoolUiStore.setEventListWidth(width);
	}

	toggleShowEventList = (show: boolean): void => {
		this.store.devtoolUiStore.toggleShowEventList(show);
	}

	copyRegisteredEventToEditor = (eventName: string): void => {
		const content = JSON.stringify(this.store.sandboxConfig.events[eventName], null, 2);
		this.store.devtoolUiStore.setEventEditContent(content);
	}

	setEventEditContent = (content: string): void => {
		this.store.devtoolUiStore.setEventEditContent(content);
	}

	setInstanceArgumentListWidth = (w: number): void => {
		this.store.startupScreenUiStore.setInstanceArgumentListWidth(w);
	}

	selectInstanceArguments = (name: string | null): void => {
		const content = (name != null) ? this.store.argumentsTable[name] : "";
		const { startupScreenUiStore } = this.store;
		startupScreenUiStore.setSelectedArgumentName(name);
		startupScreenUiStore.setInstanceArgumentEditContent(content);
	}

	setInstanceArgumentEditContent = (content: string): void => {
		this.store.startupScreenUiStore.setInstanceArgumentEditContent(content);
	}

	setJoinsAutomatically = (join: boolean): void => {
		this.store.startupScreenUiStore.setJoinsAutomatically(join);
	}

	showNotification = (type: NotificationType, title: string, name: string, message: string): void => {
		this.store.notificationUiStore.setActive(type, title, name, message);
	}

	hideNotification = (): void => {
		this.store.notificationUiStore.setInactive();
	}
}
