sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], (Controller, MessageToast, JSONModel) => {
	"use strict";

	return Controller.extend("zgr.combatcalc.App", {
		onButtonCalcPressed() {
			MessageToast.show("Button pressed");
		},

		onInit() {
			
		},

		onChange(oEvent) {

		}
	});

});