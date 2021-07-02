/*
Copyright ＿ 2005, Apple Computer, Inc.  All rights reserved.
NOTE:  Use of this source code is subject to the terms of the Software
License Agreement for Mac OS X, which accompanies the code.  Your use
of this source code signifies your agreement to such license terms and
conditions.  Except as expressly granted in the Software License Agreement
for Mac OS X, no other copyright, patent, or other intellectual property
license or right is granted, either expressly or by implication, by Apple.
*/

//————————————————————————————————————————————————————————————————————————————————————————
//
// Globals
//
//————————————————————————————————————————————————————————————————————————————————————————


var gDebug = 2;

var	gMinReloadTime 	= 60*60*1000;	// one hour
var gRetryTime		= 30*1000;		// thirty seconds


// Default Category is Area, and default units are:
var defaultCatIndex = 0;
var defaultFromIndex = 0;
var defaultToIndex = 4;

// Timer for ticking Time category clock
var timerTimeInterval = null;

// Timer for fetching currency rates
var timerCurrencyInterval = null;

// Flag to indicate if currency data is available
// -1 indicates data is not available, 0 indicates data is available from prefs
// and 1 indicates data is available from feed
var currencyDataAvailable  = -1;

// directInput
var directInput = false;

// is the flipper showing?
var flipShown = false;

// Was the time AM the last time we updated the clock?
//	N.B., this should actually be set before it's used
//	but it's better safe than sorry...
var wasAM = false;

// currency load tries
var currencyLoadTries = 0;

// support for apple site parser
gLastUnitConverterXMLRequest = null;


// debuging functions

function dumpToString(o,depth,newLines,indent)
{
	var retVal = "";
	if ((newLines == null) || (newLines == true))
		newLines = depth - 1;
	if (indent == null)
		indent = 1;
	if (depth == null)
		depth = 1;
	if ((typeof o == "string") || (typeof o == "number") || (typeof o == "boolean") || (typeof o == "function")) {
		if (newLines >= 0)
			for (ii = 0; ii < indent; ii++)	retVal += "    ";
		retVal += "'"+o+(newLines >= 0 ?"'\n" : "' ");
	} else if (depth > 0) {
		for (ii = 0; ii < indent; ii++)	retVal += "    ";
		retVal += (newLines > 0 ? "{\n" : "{");
		for (f in o) {
			if (newLines > 0)
				for (ii = 0; ii < indent; ii++)	retVal += "    ";
			retVal += f+":"+dumpToString(o[f],depth-1,newLines-1,indent+1);
		}
		for (ii = 0; ii < (indent-1); ii++)	retVal += "    ";
		retVal += (newLines >= 0 ? "}\n" : "}");
	} else if (newLines >= 0)
		retVal += "\n";
	return retVal;
}

function testUnits(category)
{
	alert('--------------------');
	var units = Categories[category].array;
	var length = units.length;
	for (var i = 0; i < length; i++) {
		if ( Categories[category].name == "Currency") {
			alert(units[i].name+": "+1.0*units[i].fromBase+"*"+1.0*units[i].toBase+" = "+1.0*units[i].fromBase*units[i].toBase );
		} else {
			alert(units[i].name+": "+units[i].fromBase(1.0)+" o "+units[i].toBase(1.0)+" = "+units[i].fromBase(units[i].toBase(1.0))+" and "+units[i].toBase(units[i].fromBase(1.0)));
		}
	}
}

function $(id) {
	return document.getElementById(id);
}

// main initialization

function load() {
	new AppleInfoButton($('infoButton'), $('front'), "black", "black", showbackside);

	// Set up back but do not display
	new AppleGlassButton ($('done'), getLocalizedString('Done'), selectDone);
	$('attribution-text').innerText = getLocalizedString('Attribution');

	// Initialize static string
	$('convert-label').innerText = getLocalizedString('Convert');
	$("tosLink").innerText = getLocalizedString("Terms of Service");

	loadPreferences();
}

function loadPreferences() {
	// Setup Category and unit popups
	var savedDefaultCatIndex = getCategoryFromPreferences();

	populateCategorySelect();
	convertAmount($('convertAmount-input').value,"left");

	defaultCatIndex = savedDefaultCatIndex;
	setCategory();
	$('unitCategory-popup').options[defaultCatIndex].selected = true;
}


//————————————————————————————————————————————————————————————————————————————————————————
//
// Global Events
//
//————————————————————————————————————————————————————————————————————————————————————————


function onshow () {
	if (Categories[defaultCatIndex].name == 'Time') {
		drawClockBackground();
		installTimeTimer();
	}
	if (Categories[defaultCatIndex].name == 'Currency') {
		loadCurrencyExchangeRates();
	}
}

function onhide() {
	removeTimeTimer();
	removeCurrencyTimer();
}

function onremove() {
	if (window.widget)
	{
		// Remove all preferences
		widget.setPreferenceForKey(null, instanceKey("defaultCategory"));

		var numCat = Categories.length;
		for (var j = 0; j < numCat; j++)
		{
			widget.setPreferenceForKey(null, instanceKey(Categories[j].name + "UnitTo"));
			widget.setPreferenceForKey(null, instanceKey(Categories[j].name + "UnitFrom"));
		}
	}
}

function onsync() {
	loadPreferences();
}

if (window.widget) {
	widget.onhide = onhide;
	widget.onshow = onshow;
	widget.onsync = onsync;
	widget.onremove = onremove;
}

//————————————————————————————————————————————————————————————————————————————————————————
//
// Functions to populate popup menus
//
//————————————————————————————————————————————————————————————————————————————————————————


function populateCategorySelect()
{
	var select = $('unitCategory-popup');
	var numCat = Categories.length;

	for (var j = 0; j < numCat; j++)
	{
	    var element = document.createElement("option");
        element.innerText = getLocalizedString(Categories[j].name);
        element.setAttribute("name",Categories[j].name);
        select.appendChild(element);
     }

    select.options[defaultCatIndex].selected = true;
}

function populateUnitSelect(select)
{
	// remove all children
	while (select.hasChildNodes())
		select.removeChild(select.firstChild);

	var units = Categories[defaultCatIndex].array;

	var length = units.length;

	// Treat Currency a bit different since the names are localized by
	// the system and we are appending the symbol to the currency name
	if ( Categories[defaultCatIndex].name == "Currency")
	{
		units.sort(function (a, b) {
			if (a.iso == "USD") return -1;
			else if (b.iso == "USD") return 1;
 			else if (a.name < b.name) return -1;
			else if (b.name < a.name) return 1;
			return 0;
		});
		for (var i = 0; i < length; ++i)
		{
			var element = document.createElement("option");
			var symbol;
			if (window.ConverterPlugin) {
				symbol = ConverterPlugin.currencySymbolForCode( units[i].iso );
			}

			element.innerText = units[i].name + " (" + symbol + ")";
			element.setAttribute("name",units[i].name);
			select.appendChild (element);
		}

	}
	else {
		for (var i = 0; i < length; ++i)
		{
			var element = document.createElement("option");

			element.innerText = getLocalizedString(units[i].name);
			element.setAttribute("name",units[i].name);
			select.appendChild (element);
		}
	}
}

//————————————————————————————————————————————————————————————————————————————————————————
//
// Functions to handle selection of a category or unit
//
//————————————————————————————————————————————————————————————————————————————————————————


//————————————————————————————————————————————————————————————————————————————————————————
//	• unitCategoryChanged
//
//	Resets the data for the text field popups and clears the text fields.
//  Selects the default units for the left (from) and right (to) menu.
//————————————————————————————————————————————————————————————————————————————————————————

function unitCategoryChanged (select)
{
    if (defaultCatIndex != select.selectedIndex)
	{
		// remove timer if old category was time and new one is not
		// clear live clock
		if (Categories[defaultCatIndex].name == 'Time')
		{
			removeTimeTimer();
			$('time-hour').innerText = "";
    		$('time-minutes').innerText = "";
    		$('time-seconds').innerText = "";
    		$('time-monospaced').innerText = "";
    	}

    	// remove timer if old category was currency and the new one if not
    	if (Categories[defaultCatIndex].name == 'Currency')
    	{
			removeCurrencyTimer();
    	}

		defaultCatIndex = select.selectedIndex;
		setCategory();
	}
}



function updateUIElements()
{
	var catName = Categories[defaultCatIndex].name;
	// For Currency show status text and flipper, for other categories
	// hide the text and the flipped
	if (catName == 'Currency') {
		displayCurrencyStatusText();
		$('infoButton').style.display = "block";
		flipShown = true;
	} else {
		$('currency-status').innerText = "";
		$('infoButton').style.display = "none";
		flipShown = false;
	}

	populateUnitSelect($('fromUnit-popup'));
	populateUnitSelect($('toUnit-popup'));
	// if currency data is not available, only update Category
	// so user can switch if data is not available.
	if (catName == 'Currency' && currencyDataAvailable == -1) {
		updatePopupLabels(false);
	} else {
		// select the default or preferred units for the given category
		setUnitsFromPreferences();

		$('fromUnit-popup').options[defaultFromIndex].selected = true;
		$('toUnit-popup').options[defaultToIndex].selected = true;
		updatePopupLabels(true);
		$('convertAmount-input').focus();
	}
}


function updateCurrencyUIElements() {
	var catName = Categories[defaultCatIndex].name;
	// For Currency show status text and flipper, for other categories
	// hide the text and the flipped
	if (catName == 'Currency') {
		displayCurrencyStatusText();
		$('infoButton').style.display = "block";
		flipShown = true;
	} else {
		$('currency-status').innerText = "";
		$('infoButton').style.display = "none";
		flipShown = false;
	}
	// if currency data is not available, only update Category
	// so user can switch if data is not available.
	if( catName == 'Currency' && currencyDataAvailable == -1) {
		populateUnitSelect($('fromUnit-popup'));
		populateUnitSelect($('toUnit-popup'));
		updatePopupLabels(false);
	} else {
		populateUnitSelect($('fromUnit-popup'));
		populateUnitSelect($('toUnit-popup'));
		// select the default or preferred units for the given category
		setUnitsFromPreferences();
		$('fromUnit-popup').options[defaultFromIndex].selected = true;
		$('toUnit-popup').options[defaultToIndex].selected = true;
		updatePopupLabels(true);
		$('convertAmount-input').focus();
	}
}



function setCategory ()
{
	var catName = Categories[defaultCatIndex].name;
	saveCategoryToPreferences();

	// Show the image for the current category
	// Time has a live clock, install timer and get the clock ticking...
	if (catName == 'Time') {
		drawClockBackground();
		installTimeTimer();
	} else {
		$('catImage').src = "Images/"+Categories[defaultCatIndex].name+".png";
	}

	// clear the input fields
	$('converted-input').value = "";
	$('convertAmount-input').value ="" ;
	if (catName == 'Currency') {
		loadCurrencyExchangeRates();
	}
	updateUIElements();
}

function displayCurrencyStatusText()
{

	var currency = Categories[defaultCatIndex].array;
	var statusText = "";

	if( currency.length == 0 )
	{
		statusText = getLocalizedString("Retrieving data.");
	}
	else
	{
		var statusDateFrom = currency[defaultFromIndex].lastUpdated;
		var statusDateTo = currency[defaultToIndex].lastUpdated;

		if ( (statusDateFrom == 0) || (statusDateTo == 0))
		{
			statusText = getLocalizedString("CurrencyNotAvailable");
		}
		else {
			var statusDateFromMS = statusDateFrom.valueOf();
			var statusDateToMS = statusDateTo.valueOf();
			var statusDateMS = (statusDateFromMS<statusDateToMS ? statusDateFromMS : statusDateToMS);
			var statusDate = new Date(statusDateMS);
			var dateStr = statusDate.toLocaleDateString("short");
			var timeStr = statusDate.toLocaleTimeString("short");
			if ((timeStr.toLowerCase() == "invalid date") || (dateStr.toLowerCase() == "invalid date")) {
				statusText = getLocalizedString("CurrencyNotAvailable");
			} else {
				statusText = getLocalizedString("CurrencyLastUpdated") + " " + getLocalizedString(dateStr) + " "+ getLocalizedString(timeStr);
			}
		}
	}

	$('currency-status').innerText = statusText;
}


//————————————————————————————————————————————————————————————————————————————————————————
//	• updatePopupLabels
//
//	Set the label for the popup menus.
//  If no data if available (currency) then set the label to empty string
//————————————————————————————————————————————————————————————————————————————————————————
function updatePopupLabels(unitLabelsAvailable) {
    $('convertCat-label').innerText = $('unitCategory-popup').options[defaultCatIndex].value;

	if (unitLabelsAvailable) {
    	$('fromUnit-label').innerText = $('fromUnit-popup').options[defaultFromIndex].value;
		$('toUnit-label').innerText = $('toUnit-popup').options[defaultToIndex].value;
		saveUnitsToPreferences();
	} else {
	    $('fromUnit-label').innerText = "";
		$('toUnit-label').innerText = "";
	}
}

function switchUnits(event)
{
    var temp = defaultFromIndex;
    defaultFromIndex = defaultToIndex;
    defaultToIndex = temp;

    $('fromUnit-popup').options[defaultFromIndex].selected = true;
    $('toUnit-popup').options[defaultToIndex].selected = true;

    updatePopupLabels(true);
    convertAmount ($('convertAmount-input').value, "left");
}

function fromUnitChanged (select)
{
	if (defaultFromIndex != select.selectedIndex)
	{
		defaultFromIndex = select.selectedIndex;
		updatePopupLabels(true);
		convertAmount ($('converted-input').value, "right");
		$('convertAmount-input').focus();
		saveUnitsToPreferences();
	}
}

function toUnitChanged (select)
{
	if (defaultToIndex != select.selectedIndex)
	{
		defaultToIndex = select.selectedIndex;
		updatePopupLabels(true);
		convertAmount ($('convertAmount-input').value, "left");
		$('convertAmount-input').focus();
		saveUnitsToPreferences();
	}
}

//————————————————————————————————————————————————————————————————————————————————————————
//
//  Functions to convert
//
//————————————————————————————————————————————————————————————————————————————————————————


function doConvertAmountLater(el, dir)
{
	var id = el.id;
	var code = "convertAmount($('"+id+"').value, '"+dir+"');";
	setTimeout(code, 0);
}

//————————————————————————————————————————————————————————————————————————————————————————
//	• convertAmount
//
//	Converts amounts between fields. If amount is not a number then result is set to the
//  empty string
//————————————————————————————————————————————————————————————————————————————————————————

function convertAmount(amount, from)
{
    var unitArray = Categories[defaultCatIndex].array;
    var c = unitArray.length;
    var convertedValue = "";
   	var fromIndex = (from=="left"?defaultFromIndex:defaultToIndex);
   	var toIndex = (from=="left"?defaultToIndex:defaultFromIndex);

	var floatAmount;
	if ( Categories[defaultCatIndex].name == 'Currency' ) {
		var	currencyCode = unitArray[fromIndex].iso;
		if (window.ConverterPlugin) {
			floatAmount = ConverterPlugin.valueForFormattedString(amount,unitArray[fromIndex].iso);
		}
	} else {
		if (window.ConverterPlugin) {
			floatAmount = ConverterPlugin.valueForFormattedString(amount,null);
		}
	}
floatAmount = parseFloat(amount); //A quick fix saves the day!
    if (isNaN(floatAmount) == false)
    {
			console.log("not nan");
			console.log(floatAmount);
    	var baseValue ="";

    	// avoid conversion errors if from and to index are the same
    	if( fromIndex == toIndex )
    		convertedValue = floatAmount;

    	else {
     		if( Categories[defaultCatIndex].name == 'Currency' )
    		{
    			if(window.event && window.event.which == 9) //don't update which focus comes from tab
					return;

    			if ( (unitArray[toIndex].lastUpdated != null ) && (unitArray[fromIndex].lastUpdated != null ))
    			{
    				var fromData = unitArray[fromIndex];
    				var toData = unitArray[toIndex];
    		    	var baseValue = floatAmount * fromData.toBase;
    				convertedValue = baseValue * toData.fromBase;

    				var fromPrec = (fromData.precision == null ? 8 : fromData.precision);
    				var toPrec = (toData.precision == null ? 8 : toData.precision);

    				precision = (fromPrec < toPrec ? fromPrec : toPrec);
//    				convertedValue = ConverterPlugin.formattedStringForCurrencyValue(convertedValue,precision,unitArray[toIndex].iso);
//					use the above once we fix the problem with currency symbols on input
					if (window.ConverterPlugin) {
    					convertedValue = ConverterPlugin.formattedStringForCurrencyValue(convertedValue,precision,3,null);
    				}
    			}
    		}
    		else {
    			var baseValue = unitArray[fromIndex].toBase(floatAmount);
    			convertedValue = unitArray[toIndex].fromBase(baseValue);
				var precision = Categories[defaultCatIndex].precision;
				if (window.ConverterPlugin) {
	    			convertedValue = ConverterPlugin.formattedStringForValue(convertedValue,precision);
	    		}
    		}
    	}
  	}
    var elem = (from=="left"?$('converted-input'):$('convertAmount-input'));
    elem.value = convertedValue;
}

//————————————————————————————————————————————————————————————————————————————————————————
//
// • Functions to manage clock in Time category
//
//————————————————————————————————————————————————————————————————————————————————————————

function removeTimeTimer()
{
	if (timerTimeInterval != null) {
		clearInterval(timerTimeInterval);
		timerTimeInterval = null;
	}
}

function installTimeTimer()
{
	if (timerTimeInterval == null)
		timerTimeInterval = setInterval("updateClock();", 1000);
}

function updateClock()
{
	var timeString;
	if (window.ConverterPlugin) {
		timeString = ConverterPlugin.currentTimeString();
	}
	if ( timeString == null || timeString.match( /^[0-9]{2}:[0-9]{2}:[0-9]{2}$/ ) ) {
		var now = new Date();
		if ( wasAM != isAM(now) )
			drawClockBackground();
		else {
			// drawClockBackground() calls updateClock(), so if we
			//	call it, we've just done all this and don't need
			//	to do it again
			var time = now.getHours();

			if ( window.ConverterPlugin && ConverterPlugin.isUserTimeFormatTwelveHours() )
				if ( time > 12 )
					time = time - 12;
				else if ( time == 0 )
					time = 12;

			   $('time-hour').innerText = time;

				time = now.getMinutes();
				if (time < 10 )
					$('time-minutes').innerText = "0" + time;
				else
					$('time-minutes').innerText = time;

				time = now.getSeconds();
				if (time < 10 )
					$('time-seconds').innerText = "0" + time;
				else
					$('time-seconds').innerText = time;
			}
	}
	else
		$('time-monospaced').innerText = timeString;
}

function drawClockBackground()
{

	// Clear the time strings
	$('time-monospaced').innerText = "";
	$('time-hour').innerText = "";
	$('time-minutes').innerText = "";
	$('time-seconds').innerText = "";

	// Determine which background to use and use it
	var now = new Date();
	var timeString;
	if (window.ConverterPlugin) {
		timeString = ConverterPlugin.currentTimeString();
	}
	if ( timeString == null || timeString.match( /^[0-9]{2}:[0-9]{2}:[0-9]{2}$/ ) ) {
		wasAM = isAM(now);
		if ( window.ConverterPlugin && ConverterPlugin.isUserTimeFormatTwelveHours() ) {
			if (isAM(now))
				$('catImage').src = "Images/Time_am.png";
			else
				$('catImage').src = "Images/Time_pm.png";
		}
		else
			$('catImage').src = "Images/Time_24.png";
	}
	else
		$('catImage').src = "Images/Time_wide.png";

	// Draw the time strings for the current time
	updateClock();
}

function isAM (date)
{
	return date.getHours() < 12;
}

//————————————————————————————————————————————————————————————————————————————————————————
//
// • Functions to manage Currency category
//
//————————————————————————————————————————————————————————————————————————————————————————

function computeSymmetricPrecision(from,to)
{
	// we look at the accuracy of the symetric operation
	var product = from*to;
	var deviation = Math.abs(product-1);
	var precision = -Math.log(deviation)/Math.log(10);
	return Math.floor(precision)+1;
}

function removeCurrencyTimer()
{
	if (timerCurrencyInterval != null) {
		clearInterval(timerCurrencyInterval);
		timerCurrencyInterval = null;
	}
}

function setCurrencyTimer()
{
// setCurrencyTimer should not be called;
}

function loadCurrencyExchangeRates()
{
	removeCurrencyTimer();
	var now = new Date().valueOf();
	var nextUpdateTime = Categories[defaultCatIndex].nextUpdate;
	if ((nextUpdateTime == null) || (nextUpdateTime < now)) {
		currencyLoadTries = 0;
		currencyDataAvailable = -1;
		fetchCurrencyData();
	}
}

function fetchCurrencyData()
{
	if (gLastUnitConverterXMLRequest != null)
		gLastUnitConverterXMLRequest.abort();

	gLastUnitConverterXMLRequest = performXMLRequest (exchangeRatesLoaded);

}

function exchangeRatesLoaded(object) {
	removeCurrencyTimer();	// do this here as well just cuz we're paranoid
	gLastUnitConverterXMLRequest = null;
	var currencyCategory = Categories[currencyCatIndex];
	var now = new Date().valueOf();
	if (!object.error && object.data) {
		currencyCategory.array = object.data;
		currencyDataAvailable = 1;
		updateCurrencyUIElements();
		var nextUpdateTime = object.nextUpdate;
		if (nextUpdateTime >  (now+gMinReloadTime)) {
			currencyCategory.nextUpdate = object.nextUpdate;
		} else {
			currencyCategory.nextUpdate = now+gMinReloadTime;
		}
		// save the rates once they are available, in case we need them later
		saveRatesToPreferences();
	} else {
		// there was an error
		// check if we already loaded the exchange rates from preferences
		if (currencyDataAvailable == -1) {
			currencyDataAvailable = ratesFromPreferences();
			if (currencyDataAvailable == 0) {
				updateCurrencyUIElements();
				currencyCategory.nextUpdate = now+gMinReloadTime;
			}
		}
		// is data still not available then display messages
		if (currencyDataAvailable == -1) {
			if (currencyLoadTries < 8) {
				$('currency-status').innerText = getLocalizedString("Data unavailable.");
				timerCurrencyInterval = setInterval("loadCurrencyExchangeRates()",gRetryTime);
			}
			Categories[currencyCatIndex].nextUpdate = null;
		}
	}
}



//————————————————————————————————————————————————————————————————————————————————————————
//
// • Functions to handle preferences
//
//————————————————————————————————————————————————————————————————————————————————————————

function saveCategoryToPreferences()
{
	setInstanceAndGlobalPreferenceForKey(defaultCatIndex.toString(), "defaultCategory");
}

function saveUnitsToPreferences()
{
	if (window.widget)
	{
		var	unitKey = Categories[defaultCatIndex].name + "UnitFrom";

		setInstanceAndGlobalPreferenceForKey(defaultFromIndex.toString(), unitKey);

		unitKey = Categories[defaultCatIndex].name + "UnitTo";

		setInstanceAndGlobalPreferenceForKey(defaultToIndex.toString(), unitKey);
	}
}

function getCategoryFromPreferences()
{

	var catIndex = defaultCatIndex;

	catIndex = getPreferenceForKey ("defaultCategory");
	if ( catIndex == null )
		catIndex = defaultCatIndex;

	return catIndex;
}


function setUnitsFromPreferences()
{
	// set default values
	defaultFromIndex = Categories[defaultCatIndex].defaultFrom;
	defaultToIndex = Categories[defaultCatIndex].defaultTo;

	// check preferences and set values if available
	if (window.widget)
	{
		var unitKey = Categories[defaultCatIndex].name + "UnitFrom";
		// get instance or global value
		var unitValue = getPreferenceForKey(unitKey);
		if (unitValue != null)
			defaultFromIndex = unitValue;

		unitKey = Categories[defaultCatIndex].name + "UnitTo";
		// get instance or global value
		unitValue = getPreferenceForKey(unitKey);
		if (unitValue != null)
			defaultToIndex = unitValue;
	}
}

/**
 * Returns instance key for given key
 */
function instanceKey(key)
{
	return widget.identifier + "-" + key;
}


/**
 * Looks for instance value for given key. if instance value doesn't exist,
 * returns global value for key instead. Retrns null if neither exists.
 */
function getPreferenceForKey(key)
{
	var res = null;
	if (window.widget) {
		res = widget.preferenceForKey(instanceKey(key));

		if (null == res) {
			res = widget.preferenceForKey(key);
		}
	}
	return res;
}


/**
 * Sets both global and istance preferece for key to value
 */
function setInstanceAndGlobalPreferenceForKey(value, key)
{
	if (window.widget) {
		widget.setPreferenceForKey(value, instanceKey(key));
		widget.setPreferenceForKey(value, key);
	}
}


function saveRatesToPreferences()
{
	if( window.widget )
	{
		var str = "["
		var currencyData = Categories[currencyCatIndex].array;
		var length = currencyData.length;

		for (var i = 0; i < length; ++i)
		{
			var data = currencyData[i];
			if (i != 0)
				str += ",";
			var dateInMilliseconds = data.lastUpdated.valueOf();
			str += "{iso:'" + data.iso + "',toBase:'" + data.toBase + "',fromBase:'" + data.fromBase + "',lastUpdated:'" + dateInMilliseconds + "'}";
		}

		str += "];";

		widget.setPreferenceForKey (str, "currencies");
	}
}


function ratesFromPreferences()
{
	var dataAvailable = -1;			// no data is available (see documentation for currencyDataAvailable)

	if( window.widget )
	{
		try {
			var currencyData = widget.preferenceForKey("currencies");
			var newAllData = new Array;

			currencyData = eval(currencyData);
			var length = currencyData.length;

			if (length > 0)
			{
				for (var i = 0; i < length; ++i)
				{
					var data = currencyData[i];
					var name;
					if (window.ConverterPlugin) {
						name = ConverterPlugin.currencyNameForCode(data.iso);
					}
					var time = new Date(data.lastUpdated);
					// just in case we have old prefs that don't have this would be bad to blow up
					var precision = computeSymmetricPrecision(data.toBase,data.fromBase);
					newAllData[newAllData.length]
						= {name:name, iso:data.iso, lastUpdated:time, toBase:data.toBase, fromBase:data.fromBase, precision:precision};

				}

				Categories[currencyCatIndex].array = newAllData;
				dataAvailable = 0;
			}

		} catch(ex)
		{
		}
	}
	return dataAvailable;
}


//————————————————————————————————————————————————————————————————————————————————————————
//
// • Functions to handle backside
//
//————————————————————————————————————————————————————————————————————————————————————————

function showbackside(event)
{
		var front = $("front");
		var back = $("back");

		if (window.widget)
			widget.prepareForTransition("ToBack");

		front.style.display="none";
		back.style.display="block";

		if (window.widget)
			setTimeout ('widget.performTransition();', 0);

}

function selectDone ()
{
	var front = $("front");
	var back = $("back");

	if (window.widget)
		widget.prepareForTransition("ToFront");

	front.style.display="block";
	back.style.display="none";

	if (window.widget)
		setTimeout ('widget.performTransition();', 0);

	if( Categories[defaultCatIndex].name == 'Currency' )
	{
		flipShown = true;
	}

	onshow();
}


function getLocalizedString (key)
{
	try {
		var ret = localizedStrings[key];
		if (ret === undefined)
			ret = key;
		return ret;
	} catch (ex) {}

	return key;
}


function clickOnProvider(event)
{
    if (window.widget)
        widget.openURL("http://api.apple.go.yahoo.com/appledwuc/");
}


function debug(msg) {
	if (!debug.box) {
		debug.box = document.createElement("div");
		debug.box.setAttribute("style", "background-color: white; " +
										"font-family: monospace; " +
										"border: solid black 3px; " +
										"position: absolute;top:300px;" +
										"padding: 10px;");
		document.body.appendChild(debug.box);
		debug.box.innerHTML = "<h1 style='text-align:center'>Debug Output</h1>";
	}

	var p = document.createElement("p");
	p.appendChild(document.createTextNode(msg));
	debug.box.appendChild(p);
}

function tosClick(evt) {
	if (window.widget) {
		widget.openURL("http://info.yahoo.com/legal/us/yahoo/utos/utos-173.html");
	}
}
