'use strict';

// Object containing preset CA rules adding a preset using here will make it appear in the menus
// as long as you add a name object to the preset object

// ******** NOTE ******** //
// Currently the rule sets are stored as values in arrays. Ideally this could be done using image files which are then
// easily imported into the rule texture. Need a means of sorting cross site loading though.

var presets = {  rule30: new ruleSet(1,2),
								 rule90: new ruleSet(1,2),
								 rule101: new ruleSet(1,2),
								 rule184: new ruleSet(1,2),
								 R1S3: new ruleSet(1,3),
								 R1S4: new ruleSet(1,4),
								 R2S2: new ruleSet(2,2),
								 R2S3: new ruleSet(2,3) };

	// ====== RULE 30 ======
	presets.rule30.name = "Rule 30";
	presets.rule30.setStateValue(1, 255, 0, 0, 255);
	presets.rule30.permuations();

	presets.rule30.setResultValue(1,255, 0, 0, 255);
	presets.rule30.setResultValue(2,255, 0, 0, 255);
	presets.rule30.setResultValue(3,255, 0, 0, 255);
	presets.rule30.setResultValue(4,255, 0, 0, 255);

	// ====== RULE 101 ======
	presets.rule101.name = "Rule 110";
	presets.rule101.setStateValue(1, 255, 0, 0, 255);
	presets.rule101.permuations();

	presets.rule101.setResultValue(1,255, 0, 0, 255);
	presets.rule101.setResultValue(2,255, 0, 0, 255);
	presets.rule101.setResultValue(3,255, 0, 0, 255);
	presets.rule101.setResultValue(5,255, 0, 0, 255);
	presets.rule101.setResultValue(6,255, 0, 0, 255);


	// ====== RULE 90 ======
	presets.rule90.name = "Rule 90";
	presets.rule90.setStateValue(1, 255, 0, 0, 255);
	presets.rule90.permuations();

	presets.rule90.setResultValue(1,255, 0, 0, 255);
	presets.rule90.setResultValue(3,255, 0, 0, 255);
	presets.rule90.setResultValue(4,255, 0, 0, 255);
	presets.rule90.setResultValue(6,255, 0, 0, 255);

	// ====== RULE 184 ======
	presets.rule184.name = "Rule 184";
	presets.rule184.setStateValue(1, 255, 0, 0, 255);
	presets.rule184.permuations();

	presets.rule184.setResultValue(3,255, 0, 0, 255);
	presets.rule184.setResultValue(4,255, 0, 0, 255);
	presets.rule184.setResultValue(5,255, 0, 0, 255);
	presets.rule184.setResultValue(7,255, 0, 0, 255);

	// ====== THREE COLOR STATES =======
	presets.R1S3.name = "R=1, S=3 (blank)";
	presets.R1S3.setStateValue(1,255,0,0,255);
	presets.R1S3.setStateValue(2,0,255,0,255);
	presets.R1S3.permuations();

	// ====== FOUR COLOR STATES =======
	presets.R1S4.name = "R=1, S=4 (blank)";
	presets.R1S4.setStateValue(1,255,0,0,255);
	presets.R1S4.setStateValue(2,0,255,0,255);
	presets.R1S4.setStateValue(3,0,0,255,255);
	presets.R1S4.permuations();

	// ====== RANGE TWO ======
	presets.R2S2.name = "R=2, S=2 (blank)";
	presets.R2S2.setStateValue(1,255,0,0,255);
	presets.R2S2.permuations();

	// ====== RANGE TWO, THREE STATES ======
	presets.R2S3.name = "R=2, S=3 (blank)";
	presets.R2S3.setStateValue(1,255,0,0,255);
	presets.R2S3.setStateValue(2,0,255,0,255);
	presets.R2S3.permuations();

// Create a dropdown menu of presets
for ( var x in presets ){
document.getElementById("loadpreset").innerHTML = document.getElementById("loadpreset").innerHTML+'<option value='+x.toString()+'> '+presets[x].name+' </option>';
}
