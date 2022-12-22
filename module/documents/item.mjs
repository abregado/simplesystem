/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class SimplesystemItem extends Item {
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    // As with the actor class, items are documents that can have their data
    // preparation methods overridden (such as prepareBaseData()).
    super.prepareData();
  }

  /**
   * Prepare a data object which is passed to any Roll formulas which are created related to this Item
   * @private
   */
   getRollData() {
    // If present, return the actor's roll data.
    if ( !this.actor ) return null;
    const rollData = this.actor.getRollData();
    // Grab the item's system data as well.
    rollData.item = foundry.utils.deepClone(this.system);

    return rollData;
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async roll() {
    const item = this;

    if (this.type === 'action') {
      this._postDescription();
      return;
    };

    if (this.type === 'roll') {
      this._rollRoll(item.system.formula);
      return;
    }

    if (this.type === 'check') {
      this._rollRoll('d20'+item.system.checkmod);
      return;
    }
  }

  async rolladv() {
    const item = this;
    if (this.type === 'check'){
      this._rollRoll('2d20dl'+item.system.checkmod);
      return;
    }

    return roll();
  }

  async rolldis() {
    const item = this;
    if (this.type === 'check'){
      this._rollRoll('2d20dh'+item.system.checkmod);
      return;
    }

    return roll();
  }

  async _postDescription(speaker, rollMode, label) {
    const item = this;
    //Send the description as a chat message.
    ChatMessage.create({
      speaker: speaker,
      rollMode: rollMode,
      flavor: label,
      content: item.system.description ?? ''
    });
  }

  async _rollRoll(rollString = 'd20') {
    const item = this;
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const rollMode = game.settings.get('core', 'rollMode');
    const label = `[${item.type}] ${item.name}`;

    // Retrieve roll data.
    const rollData = this.getRollData();

    // Invoke the roll and submit it to chat.
    const roll = new Roll(rollString, rollData);
    roll.toMessage({
      speaker: speaker,
      rollMode: rollMode,
      flavor: label,
    });
    return roll;
  }

}
