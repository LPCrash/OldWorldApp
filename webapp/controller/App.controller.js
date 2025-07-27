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

			onOverflowToolbarCombatResultPress(oEvent) {
				var oExpend = this.byId("idPanelCombatResult").getExpanded();

				if(oExpend) {
					this.byId("idPanelCombatResult").setExpanded(false);
					this.byId("idPanelBreaktest").setExpanded(true);
				}
				else {
					this.byId("idPanelCombatResult").setExpanded(true);
					this.byId("idPanelBreaktest").setExpanded(false);
				}
			},

			onOverflowToolbarBreaktestPress(oEvent) {
				var oExpend = this.byId("idPanelBreaktest").getExpanded();

				if(oExpend) {
					this.byId("idPanelCombatResult").setExpanded(true);
					this.byId("idPanelBreaktest").setExpanded(false);
				}
				else {
					this.byId("idPanelCombatResult").setExpanded(false);
					this.byId("idPanelBreaktest").setExpanded(true);
				}
			},

			onListItemPress(oEvent) {
				// Get List Item pressed
				// Todo

				// Get display texts
				var oDialogTitle = this.getView().getModel("i18n").getResourceBundle().getText("DialogLinkText");
				var oDialogLinkUrl = this.getView().getModel("links").getData().unsavedWounds;
				var oDialogLinkText = this.getView().getModel("i18n").getResourceBundle().getText("unsavedWoundsInflictedLong");
				

				if (!this.oInfoMessageDialog) {
					this.oInfoMessageDialog = new sap.m.Dialog({
						type: sap.m.DialogType.Message,
						title: oDialogTitle,
						state: sap.ui.core.ValueState.Information,
						content: new sap.m.Link({
							text: oDialogLinkText,
							icon: "sap-icon://globe",
							href: oDialogLinkUrl,
							target: "_blank"
						}),
						beginButton: new sap.m.Button({
							type: sap.m.ButtonType.Emphasized,
							text: this.getView()
								.getModel("i18n")
								.getResourceBundle()
								.getText("DialogButtonClose"),
							press: function () {
								this.oInfoMessageDialog.close();
							}.bind(this)
						})
					});
				}

				this.oInfoMessageDialog.open();
			},

			onButtonCalcCombatResultPressed(oEvent) {
				var oData = this.getView().getModel().getData();
				this.calculateCombatResult(oData);

				if (oData.combatResult === 0) {
					this.byId("idStatusCombatResult").setState(
						"Information"
					);
					this.byId("idStatusCombatResult").setText(
						this.getView()
							.getModel("i18n")
							.getResourceBundle()
							.getText("placeholderDraw")
					);
				}

				else if (oData.combatResult > 0) {
					this.byId("idStatusCombatResult").setState("Success");
					this.byId("idStatusCombatResult").setText(
						this.getView()
							.getModel("i18n")
							.getResourceBundle()
							.getText("placeholderWin") +
							": +" +
							oData.combatResult
					);
				} else {
					this.byId("idStatusCombatResult").setState("Error");
					this.byId("idStatusCombatResult").setText(
						this.getView()
							.getModel("i18n")
							.getResourceBundle()
							.getText("placeholderLoss") +
							": " +
							oData.combatResult
					);
				}

				this.byId("idStatusCombatResult").setVisible(true);

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
						this.byId("idStatusBreakTest").setState("Error");
						this.byId("idStatusBreakTest").setText(
							this.getView()
								.getModel("i18n")
								.getResourceBundle()
								.getText("placeholderFlee")
						);
						break;

					case "FBiGO":
						this.byId("idStatusBreakTest").setState("Warning");
						this.byId("idStatusBreakTest").setText(
							this.getView()
								.getModel("i18n")
								.getResourceBundle()
								.getText("placeholderFallBack")
						);
						break;
					
					// Give Ground
					default:
						this.byId("idStatusBreakTest").setState(
							"Information"
						);
						this.byId("idStatusBreakTest").setText(
							this.getView()
								.getModel("i18n")
								.getResourceBundle()
								.getText("placeholderGiveGround")
						);
				}

				this.byId("idStatusBreakTest").setVisible(true);
			},

			onPanelCombatResultExpand(oEvent) {
				var oExpend = oEvent.getParameter("expand");
				
				if(oExpend) {
					this.byId("idPanelBreaktest").setExpanded(false);
					// this.byId("idTextCombatResultHeader").setVisible(true);
				}
				else {
					this.byId("idPanelBreaktest").setExpanded(true);
					// this.byId("idTextCombatResultHeader").setVisible(false);
				}

			},

			onPanelBreakTestExpand(oEvent) {
				var oExpend = oEvent.getParameter("expand");
				
				if(!oExpend) {
					this.byId("idPanelCombatResult").setExpanded(true);
					// this.byId("idTextCombatResultHeader").setVisible(false);
				}
				else {
					this.byId("idPanelCombatResult").setExpanded(false);
					// this.byId("idTextCombatResultHeader").setVisible(true);
				}

			},

			onButtonClearPressed(oEvent) {
				var oModel = new JSONModel("./model/data.json");
				this.getView().setModel(oModel);

				// Clear Status Tags
				this.byId("idStatusCombatResult").setState("None");
				this.byId("idStatusCombatResult").setText("");
				this.byId("idStatusCombatResult").setVisible(false);

				this.byId("idStatusBreakTest").setState("None");
				this.byId("idStatusBreakTest").setText("");
				this.byId("idStatusBreakTest").setVisible(false);

				// Show Starting Panels
				this.byId("idPanelCombatResult").setExpanded(true);
				//this.byId("idTextCombatResultHeader").setVisible(true);
				this.byId("idPanelBreaktest").setExpanded(false);
			},

			resetDiffCalculation(oData) {
				oData.unsavedWoundsDiff = 0;
				oData.rankBonusDiff = 0;
				oData.standardDiff = 0;
				oData.battleStandardDiff = 0;
				oData.flankDiff = 0;
				oData.rearDiff = 0;
				oData.highGroundDiff = 0;
				oData.overkillDiff = 0;
				oData.closeOrderDiff = 0;
				oData.massedInfantryDiff = 0;
				oData.othersDiff = 0;

			},

			calculateCombatResult(oData) {
				this.resetDiffCalculation(oData);

				oData.unsavedWoundsDiff =
					oData.unsavedWoundsAttacker - oData.unsavedWoundsDefender;
				oData.rankBonusDiff =
					oData.rankBonusAttacker - oData.rankBonusDefender;
				oData.overkillDiff =
					oData.overkillAttacker - oData.overkillDefender;

				// Standard
				if (oData.standardAttacker > oData.standardDefender) {
					oData.standardDiff = 1;
				} else if (oData.standardAttacker < oData.standardDefender)
					oData.standardDiff = -1;

				// Battle Standard
				if (
					oData.battleStandardAttacker > oData.battleStandardDefender
				) {
					oData.battleStandardDiff = 1;
				} else if (
					oData.battleStandardAttacker < oData.battleStandardDefender
				) {
					oData.battleStandardDiff = -1;
				}

				// Flank Attack
				if (oData.flankAttacker > oData.flankDefender) {
					oData.flankDiff = 1;
				} else if (oData.flankAttacker < oData.flankDefender) {
					oData.flankDiff = -1;
				}

				// Rear Attack
				if (oData.rearAttacker > oData.rearDefender) {
					oData.rearDiff = 2;
				} else if (oData.rearAttacker < oData.rearDefender) {
					oData.rearDiff = -2;
				}

				// High Ground
				if (oData.highGroundAttacker > oData.highGroundDefender) {
					oData.highGroundDiff = 1;
				} else if (
					oData.highGroundAttacker < oData.highGroundDefender
				) {
					oData.highGroundDiff = -1;
				}

				// Close Order
				if (oData.closeOrderAttacker > oData.closeOrderDefender) {
					oData.closeOrderDiff = 1;
				} else if (
					oData.closeOrderAttacker < oData.closeOrderDefender
				) {
					oData.othersDiff = -1;
				}

				// Massed Infantry
				if (oData.massedInfantryAttacker > oData.massedInfantryDefender) {
					oData.massedInfantryDiff = 1;
				} else if (
					oData.massedInfantryAttacker < oData.massedInfantryDefender
				) {
					oData.massedInfantryDiff = -1;
				}


				// Others
				oData.othersDiff = oData.othersAttacker - oData.othersDefender;

				// Result
				oData.combatResult =
					oData.unsavedWoundsDiff +
					oData.rankBonusDiff +
					oData.standardDiff +
					oData.battleStandardDiff +
					oData.flankDiff +
					oData.rearDiff +
					oData.highGroundDiff +
					oData.overkillDiff +
					oData.closeOrderDiff +
					oData.massedInfantryDiff +
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
