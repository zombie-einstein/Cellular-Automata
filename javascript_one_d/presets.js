'use strict';

// Object containing preset CA rules adding a preset using here will make it appear in the menus
// as long as you add a name object to the preset object

// ******** NOTE ******** //
// Currently the rule sets are stored as values in arrays. Ideally this could be done using image files which are then
// easily imported into the rule texture. Need a means of sorting cross site loading though.

var presets = { rule101: new ruleSet(1,2), rule90: new ruleSet(1,2), rule184: new ruleSet(1,2), three: new ruleSet(1,3) };

	// ====== RULE 101 ======
	presets.rule101.name = "Rule 101";
	presets.rule101.setStateValue(0, 255, 0, 0, 255);
	presets.rule101.permuations();

	presets.rule101.setResultValue(1,255, 0, 0, 255);
	presets.rule101.setResultValue(2,255, 0, 0, 255);
	presets.rule101.setResultValue(4,255, 0, 0, 255);
	presets.rule101.setResultValue(5,255, 0, 0, 255);
	presets.rule101.setResultValue(6,255, 0, 0, 255);

	// ====== RULE 90 ======
	presets.rule90.name = "Rule 90";
	presets.rule90.setStateValue(0, 255, 0, 0, 255);
	presets.rule90.permuations();

	presets.rule90.setResultValue(1,255, 0, 0, 255);
	presets.rule90.setResultValue(3,255, 0, 0, 255);
	presets.rule90.setResultValue(4,255, 0, 0, 255);
	presets.rule90.setResultValue(6,255, 0, 0, 255);

	// ====== RULE 184 ======
	presets.rule184.name = "Rule 184";
	presets.rule184.setStateValue(0, 255, 0, 0, 255);
	presets.rule184.permuations();

	presets.rule184.setResultValue(0,255, 0, 0, 255);
	presets.rule184.setResultValue(2,255, 0, 0, 255);
	presets.rule184.setResultValue(3,255, 0, 0, 255);
	presets.rule184.setResultValue(4,255, 0, 0, 255);

	// ====== THREE COLOR STATES =======
	presets.three.name = "3 States";
	presets.three.setStateValue(0,255,0,0,255);
	presets.three.setStateValue(1,0,255,0,255);
	presets.three.permuations();

// Create a dropdown menu of presets
for ( var x in presets ){
document.getElementById("loadpreset").innerHTML = document.getElementById("loadpreset").innerHTML+'<option value='+x.toString()+'> '+presets[x].name+' </option>';
}
