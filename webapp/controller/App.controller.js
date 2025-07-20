sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], (Controller, MessageToast, JSONModel) => {
	"use strict";

	return Controller.extend("zgr.combatcalc.controller.App", {
		onInit(oEvent) {
		},

		onButtonCalcCombatResultPressed(oEvent) {
			MessageToast.show("Button pressed");

			var oData = this.getView().getModel().getData();
			MessageToast.show("Unsaved Attacker: " + oData.unsavedWoundsAttacker);
		},

		onButtonCalcBreakTestPressed(oEvent) {
			MessageToast.show("Button2 pressed");
		}
	});

});