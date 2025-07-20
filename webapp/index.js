sap.ui.define([
	"sap/ui/core/mvc/XMLView"
], (XMLView) => {
	"use strict";

	XMLView.create({
		viewName: "zgr.combatcalc.App"
	}).then((oView) => oView.placeAt("content"));
});