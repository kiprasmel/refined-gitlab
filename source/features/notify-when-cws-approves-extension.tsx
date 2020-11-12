import "./notify-when-cws-approves-extension.scss";

import React from "react";
import Bowser, { BROWSER_MAP } from "bowser";
import axios from "axios";

import select from "select-dom";
import { Feature, features } from "../Features";
import { renderNextTo } from "../utils/render";

const matchesRequirements = (requirements: (() => boolean)[]): boolean =>
	!!requirements.every((doesSatisfy) => doesSatisfy());

export const notifyWhenCWSApprovesExtension: Feature = ({}) => {
	const doNotShowLSKey: string = "rgl_do-not-show-chrome-web-store-popup";

	const doNotShow: boolean = !!(localStorage.getItem(doNotShowLSKey) === "true");

	const bowser = Bowser.getParser(window.navigator.userAgent);
	const isChrome: boolean = !!bowser.satisfies({ [BROWSER_MAP.chrome]: ">=0" });

	const requirements = [() => !doNotShow, () => __isBuiltForBetaTesters, () => isChrome];

	if (!matchesRequirements(requirements)) {
		return;
	}

	const indicationUrl: string = "https://kipras.org/refined-gitlab-chrome-yet";

	axios.get(indicationUrl).then((res) => {
		const CWSExtensionUrl: string | undefined = (res.data as string | undefined)?.trim();
		console.log("CWSExtensionUrl", CWSExtensionUrl);

		if (!CWSExtensionUrl || !(CWSExtensionUrl?.length >= 5)) {
			return;
		}

		const SpinningIcons = () => (
			<div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
				<div className="rgl_psa__icon-container">
					<img
						src="https://gitlab.com/kiprasmel/refined-gitlab/-/raw/master/assets/refined-gitlab.png"
						alt=""
						className="rgl_psa__icon"
					/>
				</div>

				<div className="rgl_psa__icon-container">
					<img
						src="https://gitlab.com/kiprasmel/refined-gitlab/-/raw/master/assets/refined-gitlab.png"
						alt=""
						className="rgl_psa__icon"
					/>
				</div>
			</div>
		);

		const PSA = () => (
			<div className="rgl_psa__content">
				<SpinningIcons />

				<h1>
					[Refined GitLab] Good news, early tester! The extension is now officially available on the chrome
					web store -- <a href={`//${CWSExtensionUrl}`}>Get it Now</a>!
				</h1>
				<p className="rgl_psa__trouble">
					(if there's anything wrong - create an issue at{" "}
					<a href="https://gitlab.com/kiprasmel/refined-gitlab/-/issues/new">
						https://gitlab.com/kiprasmel/refined-gitlab/-/issues/new
					</a>
					)
				</p>

				<div>
					<p>
						There's something wrong with this pop-up? Save <a href={`//${CWSExtensionUrl}`}>the link</a> for
						the chrome web store extension, click "hide" and reload the page.
					</p>
					<div style={{ textAlign: "right" }}>
						<button
							type="button"
							onClick={async (): Promise<void> => {
								localStorage.setItem(doNotShowLSKey, "true");
								await browser?.tabs?.reload();
							}}
							className="btn gl-button btn-default"
						>
							Hide (reload the page yourself)
						</button>
					</div>
				</div>

				<SpinningIcons />
			</div>
		);

		renderNextTo(
			/** @ts-ignore */
			select("body"),
			<>
				<PSA />
			</>,
			{
				rootNodeClassName: "rgl_psa__container", //
			}
		);
	});
};

features.add({
	id: __filebasename,
	feature: notifyWhenCWSApprovesExtension,
	waitForDomLoaded: true,
	waitForPageLoaded: true,
	needsApi: true,
});
