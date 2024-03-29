Hooks.on("init", function () {
	CONFIG.DND5E.conditionTypes = {
		anosmic: "PUGMIRE.ConAnosmic",
		confused: "PUGMIRE.ConConfused",
		immobile: "PUGMIRE.ConImmobile",
		possessed: "PUGMIRE.ConPossessed",
		repelled: "PUGMIRE.ConRepelled",
		blinded: "DND5E.ConBlinded",
		charmed: "DND5E.ConCharmed",
		deafened: "DND5E.ConDeafened",
		// "diseased": "DND5E.ConDiseased",
		// "exhaustion": "DND5E.ConExhaustion",
		frightened: "DND5E.ConFrightened",
		// "grappled": "DND5E.ConGrappled",
		incapacitated: "DND5E.ConIncapacitated",
		invisible: "DND5E.ConInvisible",
		paralyzed: "DND5E.ConParalyzed",
		petrified: "DND5E.ConPetrified",
		poisoned: "DND5E.ConPoisoned",
		prone: "DND5E.ConProne",
		// "restrained": "DND5E.ConRestrained",
		stunned: "DND5E.ConStunned",
		unconscious: "DND5E.ConUnconscious",
	};
	CONFIG.DND5E.languages = {
		common: "DND5E.LanguagesCommon",
	};
	CONFIG.DND5E.skills.ath.ability = "con";
	CONFIG.DND5E.skills.cul = { label: "PUGMIRE.SkillCul", ability: "int" };
	CONFIG.DND5E.skills.inv.ability = "wis";
	CONFIG.DND5E.skills.itm.ability = "str";
	CONFIG.DND5E.maxLevel = 10;

	/**
	 * Disable experience tracking and remove it from the config menu.
	 */
	game.settings.register("dnd5e", "disableExperienceTracking", {
		name: "SETTINGS.5eNoExpN",
		hint: "SETTINGS.5eNoExpL",
		scope: "world",
		config: false,
		default: true,
		type: Boolean,
	});
});

Hooks.on("setup", () => {
	dnd5e.documents.Proficiency.calculateMod = (level) => {
		return Math.floor((level + 3) / 2);
	};
});

Hooks.on("ready", async () => {
	await game.settings.set("dnd5e", "disableExperienceTracking", true);
});
