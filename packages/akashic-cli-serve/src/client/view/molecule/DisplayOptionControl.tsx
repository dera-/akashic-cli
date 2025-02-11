import * as React from "react";
import { observer } from "mobx-react";
import { ToolIconButton } from "../atom/ToolIconButton";
import * as styles from "./DisplayOptionControl.css";

export interface DisplayOptionControlPropsData {
	showsDisplayOptionPopover: boolean;
	showsBackgroundImage: boolean;
	showsGrid: boolean;
	onClickDisplayOptionPopover: (show: boolean) => void;
	onChangeShowBackgroundImage: (show: boolean) => void;
	onChangeShowGrid: (show: boolean) => void;
}

export interface DisplayOptionControlProps {
	makeProps: () => DisplayOptionControlPropsData;
}

@observer
export class DisplayOptionControl extends React.Component<DisplayOptionControlProps, {}> {
	private _lastProps: DisplayOptionControlPropsData | null = null;
	private _ref: HTMLDivElement | null = null;
	private _watchingWindowClick: boolean = false;

	render(): React.ReactNode {
		this._lastProps = this.props.makeProps();
		const {
			showsDisplayOptionPopover,
			showsBackgroundImage,
			showsGrid,
			onClickDisplayOptionPopover,
			onChangeShowBackgroundImage,
			onChangeShowGrid
		} = this._lastProps!;

		return <div ref={this._onRef} style={{position: "relative"}}>
			<ToolIconButton
				icon="image"
				title={"表示オプション"}
				pushed={showsDisplayOptionPopover}
				onClick={onClickDisplayOptionPopover} />
			{
				showsDisplayOptionPopover ?
					<div className={styles["popover"]}>
						<h3 className={styles["caption"]}>Display Options</h3>
						<div className={styles["controls"]}>
							<div className={styles["label"]}>
								<label>
									<input
										className={styles["checkbox"]}
										type="checkbox"
										checked={showsBackgroundImage}
										onChange={() => onChangeShowBackgroundImage(!showsBackgroundImage)}
									/>
									Show backgorund image
								</label>
							</div>
							<div className={styles["label"]}>
								<label>
									<input
										className={styles["checkbox"]}
										type="checkbox"
										checked={showsGrid}
										onChange={() => onChangeShowGrid(!showsGrid)}
									/>
									Show grid
								</label>
							</div>
						</div>
					</div> :
					null
			}
		</div>;
	}

	componentDidMount(): void {
		this._updateClickWatchStatus();
	}

	componentDidUpdate(): void {
		this._updateClickWatchStatus();
	}

	componentWillUnmount(): void {
		window.removeEventListener("mousedown", this._handleWndowMouseDown);
	}

	private _onRef = (ref: HTMLDivElement): void => {
		this._ref = ref;
	}

	private _updateClickWatchStatus(): void {
		if (this._lastProps && this._lastProps.showsDisplayOptionPopover) {
			if (!this._watchingWindowClick) {
				window.addEventListener("mousedown", this._handleWndowMouseDown);
				this._watchingWindowClick = true;
			}
		} else {
			if (this._watchingWindowClick) {
				window.removeEventListener("mousedown", this._handleWndowMouseDown);
				this._watchingWindowClick = false;
			}
		}
	}

	private _handleWndowMouseDown = (ev: MouseEvent): void => {
		const ref = this._ref;
		const lastProps = this._lastProps;
		const target = ev.target;
		if (!ref || !lastProps || !(target instanceof Element))
			return;
		if (lastProps.showsDisplayOptionPopover && !ref.contains(target as Element)) {
			lastProps.onClickDisplayOptionPopover(false);
		}
	}
}
