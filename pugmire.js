Hooks.on("init", function () {
	const newConditions = {
		anosmic: {
			icon: "systems/dnd5e/icons/svg/statuses/diseased.svg",
			label: "PUGMIRE.ConAnosmic",
		},
		confused: {
			icon: "modules/pugmire/icons/confused.webp",
			label: "PUGMIRE.ConConfused",
		},
		possessed: {
			icon: "modules/pugmire/icons/possessed.webp",
			label: "PUGMIRE.ConPossessed",
		},
		repelled: {
			icon: "modules/pugmire/icons/fleeing.webp",
			label: "PUGMIRE.ConRepelled",
		},
	};
	delete CONFIG.DND5E.conditionTypes.diseased;
	delete CONFIG.DND5E.conditionTypes.grappled;
	CONFIG.DND5E.conditionTypes.restrained.label = "PUGMIRE.ConImmobile";

	Object.entries(newConditions).forEach(([key, data]) => {
		CONFIG.DND5E.conditionTypes[key] = data;
		CONFIG.statusEffects.push({
			_id: dnd5e.utils.staticID(`pugmire${key}`),
			id: key,
			img: data.icon,
			name: data.label,
		});
	});

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
