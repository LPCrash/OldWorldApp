sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageToast",
		"sap/ui/model/json/JSONModel",
	],
	(Controller, MessageToast, JSONModel) => {
		"use strict";

		return Controller.extend("zgr.combatcalc.controller.App", {
			onInit(oEvent) {},

			onButtonCalcCombatResultPressed(oEvent) {
				var oData = this.getView().getModel().getData();

				// Reset data before calculating result
				this.resetInputData(oData);
				this.byId("idInputCombatResult").setValueState("None");
				this.byId("idInputCombatResult").setValue("");

				// Calculate Combat Result
				this.calculateCombatResult(oData);

				if (oData.combatResult == 0) {
					this.byId("idInputCombatResult").setValueState(
						"Information"
					);
					this.byId("idInputCombatResult").setValue(
						this.getView()
							.getModel("i18n")
							.getResourceBundle()
							.getText("placeholderDraw")
					);
				} else if (oData.combatResult > 0) {
					this.byId("idInputCombatResult").setValueState("Success");
					this.byId("idInputCombatResult").setValue(
						this.getView()
							.getModel("i18n")
							.getResourceBundle()
							.getText("placeholderWin") +
							": +" +
							oData.combatResult
					);
				} else {
					this.byId("idInputCombatResult").setValueState("Error");
					this.byId("idInputCombatResult").setValue(
						this.getView()
							.getModel("i18n")
							.getResourceBundle()
							.getText("placeholderLoss") +
							": " +
							oData.combatResult
					);
				}

				this.byId("idInputCombatResult").setVisible(true);

				if (oData.combatResult !== 0) {
					this.byId("idPanelCombatResult").setExpanded(false);
					this.byId("idPanelBreaktest").setExpanded(true);
				}
			},

			onButtonCalcBreakTestPressed(oEvent) {
				var oData = this.getView().getModel().getData();

				// Reset data before calculating result
				oData.breaktestModifiedDiceroll = 0;

				var oBreakTestResult = this.calculateBreaktest(oData);
				switch(oBreakTestResult) {
					case "Flee":
						this.byId("idInputBreakTest").setValueState("Error");
						this.byId("idInputBreakTest").setValue(
							this.getView()
								.getModel("i18n")
								.getResourceBundle()
								.getText("placeholderFlee")
						);
						this.byId("idInputBreakTest").setVisible(true);
						break;

					case "FBiGO":
						this.byId("idInputBreakTest").setValueState("Warning");
						this.byId("idInputBreakTest").setValue(
							this.getView()
								.getModel("i18n")
								.getResourceBundle()
								.getText("placeholderFallBack")
						);
						this.byId("idInputBreakTest").setVisible(true);
						break;
					
					// Give Ground
					default:
						
						this.byId("idInputBreakTest").setValueState(
							"Information"
						);
						this.byId("idInputBreakTest").setValue(
							this.getView()
								.getModel("i18n")
								.getResourceBundle()
								.getText("placeholderGiveGround")
						);
						this.byId("idInputBreakTest").setVisible(true);
				}
			},

			onPanelCombatResultExpand(oEvent) {
				var oExpend = oEvent.getParameter("expand");
				
				if(oExpend) {
					this.byId("idPanelBreaktest").setExpanded(false);
				}
				else {
					this.byId("idPanelBreaktest").setExpanded(true);
				}

			},

			onPanelBreakTestExpand(oEvent) {
				var oExpend = oEvent.getParameter("expand");
				
				if(!oExpend) {
					this.byId("idPanelCombatResult").setExpanded(true);
				}
				else {
					this.byId("idPanelCombatResult").setExpanded(false);
				}

			},

			resetInputData(oData) {
				oData.unsavedWoundsDiff = 0;
				oData.rankBonusDiff = 0;
				oData.standardDiff = 0;
				oData.battleStandardDiff = 0;
				oData.flankDiff = 0;
				oData.rearDiff = 0;
				oData.highGroundDiff = 0;
				oData.overkillDiff = 0;
				oData.othersDiff = 0;
			},

			calculateCombatResult(oData) {
				oData.unsavedWoundsDiff =
					oData.unsavedWoundsAttacker - oData.unsavedWoundsDefender;
				oData.rankBonusDiff =
					oData.rankBonusAttacker - oData.rankBonusDefender;
				oData.overkillDiff =
					oData.overkillAttacker - oData.overkillDefender;
				oData.othersDiff = oData.othersAttacker - oData.othersDefender;

				if (oData.standardAttacker > oData.standardDefender) {
					oData.standardDiff = 1;
				} else if (oData.standardAttacker < oData.standardDefender)
					oData.standardDiff = -1;

				if (
					oData.battleStandardAttacker > oData.battleStandardDefender
				) {
					oData.battleStandardDiff = 1;
				} else if (
					oData.battleStandardAttacker < oData.battleStandardDefender
				) {
					oData.battleStandardDiff = -1;
				}

				if (oData.flankAttacker > oData.flankDefender) {
					oData.flankDiff = 1;
				} else if (oData.flankAttacker < oData.flankDefender) {
					oData.flankDiff = -1;
				}

				if (oData.rearAttacker > oData.rearDefender) {
					oData.rearDiff = 2;
				} else if (oData.rearAttacker < oData.rearDefender) {
					oData.rearDiff = -2;
				}

				if (oData.highGroundAttacker > oData.highGroundDefender) {
					oData.highGroundDiff = 1;
				} else if (
					oData.highGroundAttacker < oData.highGroundDefender
				) {
					oData.highGroundDiff = -1;
				}

				oData.combatResult =
					oData.unsavedWoundsDiff +
					oData.rankBonusDiff +
					oData.standardDiff +
					oData.battleStandardDiff +
					oData.flankDiff +
					oData.rearDiff +
					oData.highGroundDiff +
					oData.overkillDiff +
					oData.othersDiff;
			},

			calculateBreaktest(oData) {
				// If the result of the natural roll is higher than the unit's Leadership, the unit 'Breaks' and flees.
				// If the result of the natural roll is equal to or lower than the unit's Leadership,
				// but the modified result is higher than the unit's Leadership, the unit Falls Back in Good Order.
				// If the modified result is equal to or lower than the unit's Leadership,
				// or if the roll is a natural double 1, the unit Gives Ground.
				var oBreakTestResult = {
					Flee: 	"Flee",
					Fbigo:	"FBiGO",
					Give:	"GG"
				};

				if(oData.unbreakable)
					return oBreakTestResult.Give;

				if(oData.stubborn)
					return oBreakTestResult.Fbigo;

				if(oData.breaktestNaturalDiceroll > oData.leadershipLoser &&
					oData.breaktestNaturalDiceroll > 2 &&
					!oData.unbreakable) {
						return oBreakTestResult.Flee;
				}
				else {
					var oCombatResult = 0;

					if (Math.sign(oData.combatResult) == 1)
						oCombatResult = oData.combatResult;
					else if (Math.sign(oData.combatResult) == -1)
						oCombatResult = oData.combatResult * -1;

					oData.breaktestModifiedDiceroll =
						oData.breaktestNaturalDiceroll + oCombatResult;

					if (
						oData.breaktestModifiedDiceroll >
							oData.leadershipLoser &&
						oData.breaktestNaturalDiceroll > 2 &&
						!oData.unbreakable
					)
						return oBreakTestResult.Fbigo;
					
					else
						return oBreakTestResult.Give;
				}
			}
		});
	}
);
