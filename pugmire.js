import ActorSheet5eCharacter from "../../systems/dnd5e/module/actor/sheets/character.js";
import ActorSheet5eNPC from "../../systems/dnd5e/module/actor/sheets/npc.js";

Hooks.on('init', function() {
	CONFIG.DND5E.conditionTypes = {
		"anosmic": "PUGMIRE.ConAnosmic",
		"confused": "PUGMIRE.ConConfused",
		"immobile": "PUGMIRE.ConImmobile",
		"possessed": "PUGMIRE.ConPossessed",
		"repelled": "PUGMIRE.ConRepelled",
		"blinded": "DND5E.ConBlinded",
		"charmed": "DND5E.ConCharmed",
		"deafened": "DND5E.ConDeafened",
		// "diseased": "DND5E.ConDiseased",
		// "exhaustion": "DND5E.ConExhaustion",
		"frightened": "DND5E.ConFrightened",
		// "grappled": "DND5E.ConGrappled",
		"incapacitated": "DND5E.ConIncapacitated",
		"invisible": "DND5E.ConInvisible",
		"paralyzed": "DND5E.ConParalyzed",
		"petrified": "DND5E.ConPetrified",
		"poisoned": "DND5E.ConPoisoned",
		"prone": "DND5E.ConProne",
		// "restrained": "DND5E.ConRestrained",
		"stunned": "DND5E.ConStunned",
		"unconscious": "DND5E.ConUnconscious"
	};
	CONFIG.DND5E.languages = {
		"common": "DND5E.LanguagesCommon"
	};
	CONFIG.DND5E.skills["cul"] = "PUGMIRE.SkillCul";

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

Hooks.on('setup', () => {
	patchActor5ePreCreate();
	patchActor5ePrepareCharacterData();
	patchActorSheet5eDefaultOptions();
	patchActorSheet5eOnDropItemCreate();
	patchActorSheet5eNPCDefaultOptions();
});

Hooks.on('ready', async function() {
	await game.settings.set("dnd5e", "disableExperienceTracking", true);
});

function patchActor5ePreCreate() {
	libWrapper.register("pugmire", "CONFIG.Actor.entityClass.prototype._preCreate", function patchedPreCreate(wrapped, ...args) {
		wrapped(...args);

		this.data.update({
			data: {
				skills: {
					ath: {ability: "con"},
					cul: {
						value: 0,
						ability: "int"
					},
					inv: {ability: "wis"},
					itm: {ability: "str"},
				}
			}
		});
	}, "WRAPPER");
}

function patchActor5ePrepareCharacterData() {
	libWrapper.register("pugmire", "CONFIG.Actor.entityClass.prototype._prepareCharacterData", function patchedPrepareCharacterData(wrapped, ...args) {
		wrapped(...args);
		
		const data = this.data.data;
		const level = data.details.level;
		data.attributes.prof = Math.floor((level + 3) / 2);
	}, "WRAPPER");
}

function patchActorSheet5eDefaultOptions() {
	libWrapper.register("pugmire", "game.dnd5e.applications.ActorSheet5eCharacter.defaultOptions", function patchedDefaultOptions(...args) {
		return mergeObject(Object.getPrototypeOf(ActorSheet5eCharacter).defaultOptions, {
			classes: ["dnd5e", "sheet", "actor", "character"],
			width: 720,
			height: 700
		});
	}, "OVERRIDE");
}

function patchActorSheet5eOnDropItemCreate() {
	libWrapper.register("pugmire", "game.dnd5e.applications.ActorSheet5eCharacter.prototype._onDropItemCreate", async function patchedOnDropItemCreate(itemData) {
		// Increment the number of class levels a character instead of creating a new item
		if ( itemData.type === "class" ) {
			const cls = this.actor.itemTypes.class.find(c => c.name === itemData.name);
			let priorLevel = cls?.data.data.levels ?? 0;
			if ( !!cls ) {
				const next = Math.min(priorLevel + 1, 10 + priorLevel - this.actor.data.data.details.level);
				if ( next > priorLevel ) {
					itemData.levels = next;
					return cls.update({"data.levels": next});
				}
			}
		}

		// Default drop handling if levels were not added
		return Object.getPrototypeOf(ActorSheet5eCharacter).prototype._onDropItemCreate.apply(this, [itemData]);
	}, "OVERRIDE");
}

function patchActorSheet5eNPCDefaultOptions() {
	libWrapper.register("pugmire", "game.dnd5e.applications.ActorSheet5eNPC.defaultOptions", function patchedDefaultOptions(...args) {
		return mergeObject(Object.getPrototypeOf(ActorSheet5eNPC).defaultOptions, {
			classes: ["dnd5e", "sheet", "actor", "npc"],
			width: 600,
			height: 700
		});
	}, "OVERRIDE");
}
