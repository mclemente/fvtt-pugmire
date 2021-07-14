import ActorSheet5e from "../../systems/dnd5e/module/actor/sheets/base.js";

class ActorPugmire extends Actor {
	/**
	* Replace skills
	*/
	async _preCreate(data, options, user) {
		await super._preCreate(data, options, user);

		// Token size category
		const s = CONFIG.DND5E.tokenSizes[this.data.data.traits.size || "med"];
		this.data.token.update({width: s, height: s});

		// Player character configuration
		if ( this.type === "character" ) {
			this.data.token.update({vision: true, actorLink: true, disposition: 1});
		}
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
	}
	
	/**
	* Change proficiency calculation (from Math.floor((level + 7) / 4) to Math.floor((level + 3) / 2)
	*/
	_prepareCharacterData(actorData) {
		const data = actorData.data;

		// Determine character level and available hit dice based on owned Class items
		const [level, hd] = this.items.reduce((arr, item) => {
			if ( item.type === "class" ) {
				const classLevels = parseInt(item.data.data.levels) || 1;
				arr[0] += classLevels;
				arr[1] += classLevels - (parseInt(item.data.data.hitDiceUsed) || 0);
			}
			return arr;
		}, [0, 0]);
		data.details.level = level;
		data.attributes.hd = hd;

		// Character proficiency bonus
		data.attributes.prof = Math.floor((level + 3) / 2);

		// Experience required for next level
		const xp = data.details.xp;
		xp.max = this.getLevelExp(level || 1);
		const prior = this.getLevelExp(level - 1 || 0);
		const required = xp.max - prior;
		const pct = Math.round((xp.value - prior) * 100 / required);
		xp.pct = Math.clamped(pct, 0, 100);
	}
}

class ActorSheetPugmireCharacter extends ActorSheet5e {
	/**
   * Replace height from 680 to 690.
   */
	static get defaultOptions() {
	  return mergeObject(super.defaultOptions, {
      classes: ["dnd5e", "sheet", "actor", "character"],
      width: 720,
      height: 700
    });
  }
	
	/**
	* Change max level to 10.
	*/
	async _onDropItemCreate(itemData) {
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
		return super._onDropItemCreate(itemData);
	}
}

class ActorSheetPugmireNPC extends ActorSheet5e {
	/**
   * Replace height from 680 to 690.
   */
	static get defaultOptions() {
	  return mergeObject(super.defaultOptions, {
      classes: ["dnd5e", "sheet", "actor", "npc"],
      width: 600,
      height: 700
    });
  }
}

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
	CONFIG.DND5E.skills = {
		//Str
		"itm": "DND5E.SkillItm", //Intimidate
		
		//Dex
		"acr": "DND5E.SkillAcr", //Balance
		"slt": "DND5E.SkillSlt", //Steal
		"ste": "DND5E.SkillSte", //Sneak
		
		//Con
		"ath": "DND5E.SkillAth", //Traverse
		
		//Int
		"arc": "DND5E.SkillArc", //Know Arcana
		"cul": "PUGMIRE.SkillCul", //Know Culture
		"his": "DND5E.SkillHis", //Know History
		"nat": "DND5E.SkillNat", //Know Nature
		"rel": "DND5E.SkillRel", //Know Religion
		
		//Wis
		"ani": "DND5E.SkillAni", //Handle Animal
		"med": "DND5E.SkillMed", //Heal
		"prc": "DND5E.SkillPrc", //Notice
		"inv": "DND5E.SkillInv", //Search
		"ins": "DND5E.SkillIns", //Sense Motive
		"sur": "DND5E.SkillSur", //Survive
		
		//Cha
		"dec": "DND5E.SkillDec", //Bluff
		"prf": "DND5E.SkillPrf", //Perform
		"per": "DND5E.SkillPer" //Persuade
	};

	game.dnd5e.applications.ActorSheet5eCharacter.prototype.defaultOptions = ActorSheetPugmireCharacter.prototype.defaultOptions;
	game.dnd5e.applications.ActorSheet5eCharacter.prototype._onDropItemCreate = ActorSheetPugmireCharacter.prototype._onDropItemCreate;
	game.dnd5e.applications.ActorSheet5eNPC.prototype.defaultOptions = ActorSheetPugmireNPC.prototype.defaultOptions;
	game.dnd5e.entities.Actor5e.prototype._preCreate = ActorPugmire.prototype._preCreate;
	game.dnd5e.entities.Actor5e.prototype._prepareCharacterData = ActorPugmire.prototype._prepareCharacterData;

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

Hooks.on('ready', async function() {
	await game.settings.set("dnd5e", "disableExperienceTracking", true);
});