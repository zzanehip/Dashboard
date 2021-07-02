var kMinFontSize = 10;
var kMaxFontSize = 18;
var kMaxTextHeight = 162;
var mydiv; //mainDiv
var pdiv; //practiceDiv
var gWouldBeText;
var autoFont = true;
var saveTimer;


/* About the implementation

The main area is a content-editable div, there is another practice 
div hidden to the right. When something is typed the text that would 
be produced is placed in the practice div. Based on the resulting div 
height it grows/shrinks as needed and then copies the size to the main div.
If it won't fit it shows the don't sign, else it copies text in main div
to the practice div so they are synced. It goes between innerText and 
innerHTML in places to maintain white space. */

function load() {
	new AppleInfoButton($('infoButton'), $('front'), "black", "black", showbackside);
	new AppleGlassButton($('doneButton'), getLocalizedString('Done'), showfrontside);

/*	shrinkButton = new AppleInfoButton($('shrinkButton'), $('front'), "black", "black", startFadeOut);
    shrinkButton._flipLabel.src = "Images/__minus.png";
  	shrinkAnimator = new AppleAnimator(500,13);
  	shrinkAnimation = new AppleAnimation(1.0, 0.0, animateFade);
  	startingRect = new AppleRect (0, 0, window.innerWidth, window.innerHeight);
	finishingRect = new AppleRect (0, 0, 50, 50);
  	shrinkRectAnimation = new AppleRectAnimation( startingRect, finishingRect, animateRect);
  	growRectAnimation = new AppleRectAnimation(finishingRect, startingRect, animateRect);
*/

	mydiv = $("myDiv");
	pdiv = $("practiceDiv");
	mydiv.contentEditable = pdiv.contentEditable = true;

	localizeUI();
	loadPreferences();
	resizeIfNeedBe();
	moveCaretToEnd();
	
	window.addEventListener("click", function() {moveCaretToEnd();}, false);
	mydiv.addEventListener("click", function(e) {e.stopPropagation();}, false);
}

function unload() {
	if (!unload.canceled) {
		saveSticky();
	}
}

function onsync() {
	loadPreferences();
	resizeIfNeedBe();
}

function onremove() {
	setInstancePreferenceForKey(null, kDataKey);	
	setInstancePreferenceForKey(null, kColorKey);
	setInstancePreferenceForKey(null, kFontKey);
	setInstancePreferenceForKey(null, kSizeKey);
	unload.canceled = true;
}

if (window.widget) {
	widget.onremove = onremove;
	widget.onsync = onsync;
}

function $(id) {
	return document.getElementById(id);
}


/* ------------------------- 
	   PREFERENCES
-------------------------- */

var kColorKey = "color";
var kFontKey  = "font";
var kSizeKey  = "size";
var kDataKey  = "data";

var kDefaultData  = "";
var kDefaultColor = "Images/yellow.png";
var kDefaultFont  = "MarkerFelt-Thin";
var kDefaultSize  = "Auto";

function loadPreferences() {
	var data = preferenceForKey(kDataKey);
	mydiv.innerHTML = data;

	var color = preferenceForKey(kColorKey);
	$('frontImg').src = color;
	positioncheck(color);

	var font = preferenceForKey(kFontKey);
	mydiv.style.fontFamily = font;

 	var size = preferenceForKey(kSizeKey);
	if (size != "Auto") {
		mydiv.style.fontSize = size;
		autoFont = false;
	} else {
		mydiv.style.fontSize = "18px";
		autoFont = true;
	}

	$("font-popup").options[fontArray[font]].selected = true;
	$("size-popup").options[sizeArray[size]].selected = true;
		
	pdiv.style.fontFamily = mydiv.style.fontFamily;
	pdiv.style.fontSize = mydiv.style.fontSize;
	pdiv.innerText = mydiv.innerText;
	
	setInstancePreferenceForKey(data, kDataKey);
	setInstanceAndGlobalPreferenceForKey(color, kColorKey);
	setInstanceAndGlobalPreferenceForKey(font, kFontKey);
	setInstanceAndGlobalPreferenceForKey(size, kSizeKey);
}

function saveSticky() {
	setInstancePreferenceForKey(mydiv.innerHTML, kDataKey);
}

function createKey(key) {
	if (window.widget) {
        key = widget.identifier + "-" + key;
	}
	return key;
}

function setInstanceAndGlobalPreferenceForKey(value, key) {
	setInstancePreferenceForKey(value, key);
	setGlobalPreferenceForKey(value, key);
}

function setInstancePreferenceForKey(value, key) {
	setGlobalPreferenceForKey(value, createKey(key));
}

function setGlobalPreferenceForKey(value, key) {
	if (window.widget) {
		widget.setPreferenceForKey(value, key);
	}
}

function preferenceForKey(key) {
	var result;
	if (window.widget) {
		result = widget.preferenceForKey(createKey(key));
		if (!result) {
			result = widget.preferenceForKey(key);
		}
	}
	if (!result) {
		result = eval("kDefault" + key.substring(0,1).toUpperCase() + key.substring(1));
	}
	return result;
}



/* ------------------------- 
	   HANDLING INPUT
-------------------------- */

function handleTyping(event)
{
	if(event.keyCode == 9) //prevent tab key
	{
		consumeEvent(event);
		return;
	}
	else if((event.keyCode >= 37 && event.keyCode <= 40) || event.metaKey)
		return; //an arrow key or meta key. Note, we leave the event alone
	
	var temp = getWouldBeText(event);
	temp = textToHTML(temp); 

	//If the text ends with a <br>, the pdiv will not expand by a line
	//as it should. It requires a character afterwards to do so. 
	if(temp && temp.substring(temp.length-4) == "<br>")
		temp +=".";

	pdiv.innerHTML = temp;
	
	resizeIfNeedBe();

	if (saveTimer != null)
		clearTimeout (saveTimer);
	saveTimer = setTimeout(saveSticky, 2000);

	return true;
}	

function handleKeyUp()
{
	pdiv.innerHTML=mydiv.innerHTML;
}

//using the keycode, returns what the text will be after the
//keypress event completes, so we can try it in the practice div
function getWouldBeText(event)
{
	var theText = mydiv.innerText;
	var charCode = event.charCode;
	var newChar = String.fromCharCode(charCode);
	var selectedText = window.getSelection().toString();

	if(theText.charCodeAt(theText.length-1) == 10)
		theText = theText.substring(0, theText.length-1);

	if(selectedText) //if text is selected
	{		
		if(charCode == 8) //delete key, replace w/nothing
			newChar = ""; 
		
		theText = theText.replace(selectedText, newChar);
	}
	else if(charCode == 8) //delete key
		theText = theText.substring(0, theText.length-1);
	else
		theText = theText + newChar;
		
	return theText;
}

function handlePaste(event)
{
	//paste the text, copy it to the practice div, and resize
	document.execCommand("InsertHTML", false, textToHTML(event.clipboardData.getData('text/plain')))
	pdiv.innerHTML = mydiv.innerHTML;
	couldFitText = resizeIfNeedBe();
	
	//if it didn't fit, revert
	if(!couldFitText)
		document.execCommand("Undo")
	
	event.preventDefault();
}

//When there's too much text and we can't shrink
function endGame(event)
{
	pdiv.innerHTML = mydiv.innerHTML;
	if(event.keyCode != 8) //the delete key
	{
		showDont();
		event.returnValue = false;
	}
}


function textToHTML(aString)
{
	if(!aString) return; //on intial load
	return aString.replace(/</g, "&lt;").replace(/>/g, "&gt;")
				  .replace(/\n/g,"<br>").replace(/\r/g, "<br>");
}



/* ------------------------- 
	     AUTO RESIZING
-------------------------- */

//returns false if it can't get any smaller, true otherwise
function resizeIfNeedBe()
{
	var currentFontSize = parseInt(mydiv.style.fontSize);

	if(pdiv.clientHeight > kMaxTextHeight)
	{
		if(currentFontSize> kMinFontSize && autoFont) //can shrink
			return shrinkToFit(event);
		else {//can't shrink, plan b
			endGame(event);
			return false;
		}
	}		
	else if(autoFont)
	{
		growPracticeTextByOnePixel();
		if(isRoomToGrow()) //room to grow
			growToFit();
		else
			shrinkPracticeTextByOnePixel();
	}
	return true;
}

function growToFit()
{
	do
	{
		growPracticeTextByOnePixel();
	} while(isRoomToGrow())
	
	shrinkPracticeTextByOnePixel();
	mydiv.style.fontSize = pdiv.style.fontSize;
}


function shrinkToFit(event)
{
	do
	{
		shrinkPracticeTextByOnePixel();
	} while(isRoomToShrink());
	
	if(pdiv.clientHeight > kMaxTextHeight)
	{
		pdiv.style.fontSize = mydiv.style.fontSize;
		endGame(event);
		return false;
	}
	
	mydiv.style.fontSize = pdiv.style.fontSize;	
	return true;
}

function isRoomToGrow()
{
	return parseInt(pdiv.style.fontSize) <= kMaxFontSize && pdiv.clientHeight <= kMaxTextHeight;
}

function isRoomToShrink()
{
	return pdiv.clientHeight > kMaxTextHeight && parseInt(pdiv.style.fontSize) > kMinFontSize;
}

function growPracticeTextByOnePixel()
{
	pdiv.style.fontSize  = parseInt(pdiv.style.fontSize) + 1 + "px"; //temp try bigger size
}

function shrinkPracticeTextByOnePixel()
{
	pdiv.style.fontSize  = parseInt(pdiv.style.fontSize) -1 + "px";
}


/* ------------------------- 
	COLOR AND FONT OPTIONS
-------------------------- */
function clickoncolor (event, color) {
	$("frontImg").src = color;
	setInstanceAndGlobalPreferenceForKey(color, kColorKey);
	positioncheck(color);
}

function positioncheck (color) {
	var elem = $("check");	
	var array = new Array;
	array["Images/yellow.png"] = {left:"19px", top:"28px"};
	array["Images/orange.png"] = {left:"58px", top:"28px"};
	array["Images/green.png"] = {left:"97px", top:"28px"};
	array["Images/green2.png"] = {left:"136px", top:"28px"};
	array["Images/blue2.png"] = {left:"175px", top:"28px"};
	array["Images/blue.png"] = {left:"19px", top:"60px"};
	array["Images/purple1.png"] = {left:"58px", top:"60px"};
	array["Images/pink.png"] = {left:"97px", top:"60px"};
	array["Images/white.png"] = {left:"136px", top:"60px"};
	array["Images/grey.png"] = {left:"175px", top:"60px"};
	
	var obj = array[color];
	if (obj == null)
		obj = {left:"19px", top:"28px"};
	
	elem.style.top = obj.top;
	elem.style.left = obj.left;
}

function fontchanged(elem) {
	var font = elem.options[elem.selectedIndex].value;
	mydiv.style.fontFamily = pdiv.style.fontFamily = font;
	setInstanceAndGlobalPreferenceForKey(font, kFontKey);
	capFontSizes();
}

function sizechanged(elem) {	
	var size = elem.options[elem.selectedIndex].value;
	if (size == "Auto") {
		handleTyping({keyCode:32, charCode:32});
		autoFont = true;
	} else {
		mydiv.style.fontSize = pdiv.style.fontSize = size;
		autoFont = false;
	}
	setInstanceAndGlobalPreferenceForKey(size, kSizeKey);
	capFonts();
}

var sizeArray = new Array;
sizeArray["Auto"] = 0;
sizeArray["10px"] = 1;
sizeArray["11px"] = 2;
sizeArray["12px"] = 3;
sizeArray["13px"] = 4;
sizeArray["14px"] = 5;
sizeArray["16px"] = 6;
sizeArray["18px"] = 7;

var fontArray = new Array;
fontArray["MarkerFelt-Thin"] = 0;
fontArray["Helvetica"] = 1;
fontArray["Lucida Grande"] = 2;
fontArray["Futura"] = 3;
fontArray["Optima"] = 4;
fontArray["Gill Sans"] = 5;
fontArray["Baskerville"] = 6;
fontArray["American Typewriter"] = 7;


function capFontSizes()
{
	for(eachSize in sizeArray)
	{	
		if(eachSize == "Auto")
			continue;
			
		pdiv.style.fontSize = eachSize;

		if(pdiv.clientHeight <= kMaxTextHeight)
			$("size-popup").options[sizeArray[eachSize]].disabled=false;
		else
			$("size-popup").options[sizeArray[eachSize]].disabled=true;
	}
		pdiv.style.fontSize = mydiv.style.fontSize;
}

function capFonts()
{
	if(autoFont)
		pdiv.style.fontSize = kMinFontSize + "px";
	else 	
		pdiv.style.fontSize = mydiv.style.fontSize;
		
	for(font in fontArray)
	{
		pdiv.style.fontFamily = font;
		if(pdiv.clientHeight <= kMaxTextHeight)
			$("font-popup").options[fontArray[font]].disabled=false;
		else
			$("font-popup").options[fontArray[font]].disabled=true;
	}
		pdiv.style.fontFamily = mydiv.style.fontFamily;
		pdiv.style.fontSize = mydiv.style.fontSize;
}

/* ------------------------- 
	     DON'T SYMBOL
-------------------------- */
var dontAnimator;
var dontTimer;

function showDont() {

	dontAnimator = new AppleAnimator(750, 13, 1.0, 0.0, animateDont);
	//garbage collect animator when done
	dontAnimator.oncomplete = function() {dontAnimator = null;} 
	
	$('dont').style.opacity = 1.0;

	if(dontTimer != null) //prevents blinking dont if key is held down
		clearTimeout(dontTimer);
	
	dontTimer = setTimeout('dontAnimator.start();', 300);
}

function animateDont(animation, dif, start, finish) {
	$('dont').style.opacity = dif;
}	

/* ----------------- 
      Shrinking
------------------- */
/*
Ready to go when uncommented.

function startFadeOut(event)
{
      $('shrinkButton').style.display = "none";
      $('infoButton').style.display = "none";
      $('tearOffCorner').style.display = "none";
      shrinkAnimator.addAnimation(shrinkAnimation);
      shrinkAnimator.oncomplete = function() {mydiv.style.display="none"; startShrink();}
      shrinkAnimation.to = 0;
      shrinkAnimation.from = 1;
      shrinkAnimator.start();
      event.stopPropagation();
}

function startFadeIn()
{
      mydiv.style.display="block"; 
      shrinkAnimation.to = 1;
      shrinkAnimation.from = 0;
      shrinkAnimator.animations[0] = shrinkAnimation;
      shrinkAnimator.oncomplete = resetFromShrink;
      shrinkAnimator.start();
}

function startShrink()
{
      shrinkAnimator.animations[0] = shrinkRectAnimation;
      shrinkAnimator.oncomplete = function(){window.onclick=function() {startGrow();}}
      shrinkAnimator.start();
}

function startGrow()
{
      shrinkAnimator.animations[0] = growRectAnimation;
      shrinkAnimator.oncomplete = startFadeIn;
      shrinkAnimator.start();
}

function animateFade (animation, now, start, done)
{
      mydiv.style.opacity = now;
}

function animateRect( rectAnimation, currentRect, startingRect, finishingRect )
{
      $("front").style.height = (currentRect.bottom);
      $("front").style.width = (currentRect.right);
      window.resizeTo(currentRect.right, currentRect.bottom);
}

function resetFromShrink()
{
      window.onclick= function() {moveCaretToEnd();};
      $('shrinkButton').style.display = "block";
      $('infoButton').style.display = "block";
      $('tearOffCorner').style.display = "block";      
}

*/

/* ------------------------- 
	  HELPER FUNCTIONS
-------------------------- */

function moveCaretToEnd()
{
	mydiv.focus();
	window.getSelection().setPosition(mydiv, mydiv.childNodes.length);
}

function consumeEvent(event)
{
	event.stopPropagation();
	event.preventDefault();
}

/*
function makeNewSticky()
{
	widget.system("/usr/bin/open /Library/Widgets/Stickies.wdgt", null);
}
*/

/* ------------------------- 
	 NORMAL WIDGET STUFF
-------------------------- */

function showbackside(event)
{
	var front = $("front");
	var back = $("back");
	
	if (window.widget)
		widget.prepareForTransition("ToBack");

	capFontSizes();
	capFonts();
	
	front.style.display="none";
	back.style.display="block";
	
	if (window.widget)		
		setTimeout ('widget.performTransition();', 0);	

	saveSticky();
}

function showfrontside(event)
{
	var front = $("front");
	var back = $("back");
	
	if (window.widget)
		widget.prepareForTransition("ToFront");
	
	front.style.display="block";
	back.style.display="none";
	
	if (window.widget)
		setTimeout ('widget.performTransition();', 0);
	
	if(autoFont)
		resizeIfNeedBe();
	
	saveSticky();
}

function getLocalizedString (key)
{
	try {
		var ret = localizedStrings[key];
		if (ret == undefined)
			ret = key;
		return ret;
	} catch (ex) {}

	return key;
}

function localizeUI() {
	//localize strings	
	$('papercolor').innerText = getLocalizedString('Paper Color:');
	$('font').innerText = getLocalizedString('Font:');
	$('size-popup').options[0].text = getLocalizedString('Auto');
	// add localizedFonts to pop-up menu
	try {
		if (localizedFonts) {
			var fontPopup = $('font-popup');
			for (var i = 0; i < localizedFonts.length; i++) {
				var fontName = localizedFonts[i];
				var localizedName = localizedFonts[fontName];
				if (!localizedName)
					continue;
				var optionElement = document.createElement('option');
				optionElement.setAttribute('value', fontName);
				optionElement.innerHTML = localizedName;
				
				fontPopup.appendChild(optionElement);
			}
		}
	} catch(ex) {}	
}

