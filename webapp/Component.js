sap.ui.define([
	"sap/ui/core/UIComponent"
], (UIComponent) => {
	"use strict";

	return UIComponent.extend("zgr.combatcalc.Component", {
		metadata: {
			interfaces: ["sap.ui.core.IAsyncContentCreation"],
			manifest: "json"
		}
	});
});