/*
Copyright ＿ 2005, Apple Computer, Inc.  All rights reserved.
NOTE:  Use of this source code is subject to the terms of the Software
License Agreement for Mac OS X, which accompanies the code.  Your use
of this source code signifies your agreement to such license terms and
conditions.  Except as expressly granted in the Software License Agreement
for Mac OS X, no other copyright, patent, or other intellectual property
license or right is granted, either expressly or by implication, by Apple.
*/

var gDefaultCity = 8;
var gDefaultContinent = 5;
var gDefaultGeoID = 5341145;
var gDefaultLocale = "San Francisco";
var SouthAmerica = [
	{city:'Asuncion', offset:-240, timezone:'America/Asuncion', id:"3439389"},
	{city:'Bogota', offset:-300, timezone:'America/Bogota', id:"3688689"},
	{city:'Brasalia', offset:-180, timezone:'Brazil/East', id:"3469058"},
	{city:'Buenos Aires', offset:-180, timezone:'America/Buenos_Aires', id:"3435910"},
	{city:'Caracas', offset:-240, timezone:'America/Caracas', id:"3646738"},
	{city:'Cayenne', offset:-180, timezone:'America/Cayenne', id:"3382160"},
	{city:'Georgetown', offset:-240, timezone:'America/Guyana', id:"3378644"},
	{city:'La Paz', offset:-240, timezone:'America/La_Paz', id:"3911925"},
	{city:'Lima', offset:-300, timezone:'America/Lima', id:"3936456"},
	{city:'Montevideo', offset:-180, timezone:'America/Montevideo', id:"3441575"},
	{city:'Paramaribo', offset:-180, timezone:'America/Paramaribo', id:"3383330"},
	{city:'Quito', offset:-300, timezone:'America/Guayaquil', id:"3652462"},
	{city:'Recife', offset:-180, timezone:'America/Recife', id:"3390760"},
	{city:'Rio de Janeiro', offset:-180, timezone:'Brazil/East', id:"3451190"},
	{city:'San Juan', offset:-240, timezone:'America/Puerto_Rico', id:"4568127"},
	{city:'Santiago', offset:-240, timezone:'America/Santiago', id:"3871336"},
	{city:'Sao Paulo', offset:-180, timezone:'America/Sao_Paulo', id:"3448439"}
];
var Pacific = [
	{city:'Guam', offset:600, timezone:'Pacific/Guam', id:"4044012"},
	{city:'Honolulu', offset:-600, timezone:'Pacific/Honolulu', id:"5856195"},
	{city:'Noumea', offset:660, timezone:'Pacific/Noumea', id:"2139521"},
	{city:'Pago Pago', offset:-660, timezone:'Pacific/Pago_Pago', id:"5881576"},
	{city:'Wellington', offset:720, timezone:'Pacific/Auckland', id:"2179537"}
];
var Atlantic = [
	{city:'Tbilisi', offset:-120, timezone:'Atlantic/South_Georgia', id:"611717"},
	{city:'Ponta Delgada', offset:0, timezone:'Atlantic/Azores', id:"3372783"},
	{city:'Reykjavik', offset:0, timezone:'Atlantic/Reykjavik', id:"3413829"}
];
var Europe = [
	{city:'Amsterdam', offset:120, timezone:'Europe/Amsterdam', id:"2759794"},
	{city:'Athens', offset:180, timezone:'Europe/Athens', id:"264371"},
	{city:'Belgrade', offset:180, timezone:'Europe/Belgrade', id:"792680"},
	{city:'Berlin', offset:120, timezone:'Europe/Berlin', id:"2950159"},
	{city:'Brussels', offset:120, timezone:'Europe/Brussels', id:"2800866"},
	{city:'Bucharest', offset:180, timezone:'Europe/Bucharest', id:"683506"},
	{city:'Budapest', offset:120, timezone:'Europe/Budapest', id:"3054643"},
	{city:'Cardiff', offset:60, timezone:'Europe/London', id:"2653822"},
	{city:'Copenhagen', offset:120, timezone:'Europe/Copenhagen', id:"2618425"},
	{city:'Cork', offset:60, timezone:'Europe/Dublin', id:"2965140"},
	{city:'Dublin', offset:60, timezone:'Europe/Dublin', id:"2964574"},
	{city:'Edinburgh', offset:60, timezone:'Europe/London', id:"2650225"},
	{city:'Geneva', offset:120, timezone:'Europe/Zurich', id:"4893591"},
	{city:'Helsinki', offset:180, timezone:'Europe/Helsinki', id:"658225"},
	{city:'Istanbul', offset:180, timezone:'Asia/Istanbul', id:"745044"},
	{city:'Kiev', offset:180, timezone:'Europe/Kiev', id:"703448"},
	{city:'Lisbon', offset:60, timezone:'Europe/Lisbon', id:"2267057"},
	{city:'Ljubljana', offset:120, timezone:'Europe/Ljubljana', id:"3196359"},
	{city:'London', offset:60, timezone:'Europe/London', id:"2643743"},
	{city:'Madrid', offset:120, timezone:'Europe/Madrid', id:"3117735"},
	{city:'Moscow', offset:240, timezone:'Europe/Moscow', id:"524901"},
	{city:'Munich', offset:120, timezone:'Europe/Berlin', id:"2867714"},
	{city:'Oslo', offset:120, timezone:'Europe/Oslo', id:"3143244"},
	{city:'Paris', offset:120, timezone:'Europe/Paris', id:"2988507"},
	{city:'Prague', offset:120, timezone:'Europe/Prague', id:"3067696"},
	{city:'Rome', offset:120, timezone:'Europe/Rome', id:"3169070"},
	{city:'Sofia', offset:180, timezone:'Europe/Sofia', id:"727011"},
	{city:'St. Petersburg', offset:240, timezone:'Europe/Moscow', id:"498817"},
	{city:'Stockholm', offset:120, timezone:'Europe/Stockholm', id:"2673730"},
	{city:'Vienna', offset:120, timezone:'Europe/Vienna', id:"2761369"},
	{city:'Volgograd', offset:240, timezone:'Europe/Moscow', id:"472757"},
	{city:'Warsaw', offset:120, timezone:'Europe/Warsaw', id:"756135"},
	{city:'Zagreb', offset:120, timezone:'Europe/Zagreb', id:"3186886"},
	{city:'Zurich', offset:120, timezone:'Europe/Zurich', id:"2657896"}
];
var Africa = [
	{city:'Accra', offset:0, timezone:'Africa/Accra', id:"2306104"},
	{city:'Addis Ababa', offset:180, timezone:'Africa/Addis_Ababa', id:"344979"},
	{city:'Algiers', offset:60, timezone:'Africa/Algiers', id:"2507480"},
	{city:'Asmera', offset:180, timezone:'Africa/Asmera', id:"343300"},
	{city:'Bamako', offset:0, timezone:'Africa/Bamako', id:"2460596"},
	{city:'Bangui', offset:60, timezone:'Africa/Bangui', id:"2389853"},
	{city:'Cairo', offset:180, timezone:'Africa/Cairo', id:"360630"},
	{city:'Cape Town', offset:120, timezone:'Africa/Johannesburg', id:"3369157"},
	{city:'Conakry', offset:0, timezone:'Africa/Conakry', id:"2422465"},
	{city:'Dakar', offset:0, timezone:'Africa/Dakar', id:"2253354"},
	{city:'Dar es Salaam', offset:180, timezone:'Africa/Dar_es_Salaam', id:"160263"},
	{city:'Djibouti', offset:180, timezone:'Africa/Djibouti', id:"223817"},
	{city:'Douala', offset:60, timezone:'Africa/Douala', id:"2232593"},
	{city:'Freetown', offset:0, timezone:'Africa/Freetown', id:"2409306"},
	{city:'Harare', offset:120, timezone:'Africa/Harare', id:"890299"},
	{city:'Kampala', offset:180, timezone:'Africa/Kampala', id:"232422"},
	{city:'Khartoum', offset:180, timezone:'Africa/Khartoum', id:"379252"},
	{city:'Kinshasa', offset:60, timezone:'Africa/Kinshasa', id:"2314302"},
	{city:'Lagos', offset:60, timezone:'Africa/Lagos', id:"2332459"},
	{city:'Luanda', offset:60, timezone:'Africa/Luanda', id:"2240449"},
	{city:'Lusaka', offset:120, timezone:'Africa/Lusaka', id:"909137"},
	{city:'Maputo', offset:120, timezone:'Africa/Maputo', id:"1040652"},
	{city:'Mogadishu', offset:180, timezone:'Africa/Mogadishu', id:"53654"},
	{city:'Monrovia', offset:0, timezone:'Africa/Monrovia', id:"2274895"},
	{city:'Nairobi', offset:180, timezone:'Africa/Nairobi', id:"184745"},
	{city:'Ndjamena', offset:60, timezone:'Africa/Ndjamena', id:"2427123"},
	{city:'Nouakchott', offset:0, timezone:'Africa/Nouakchott', id:"2377450"},
	{city:'Ouagadougou', offset:0, timezone:'Africa/Ouagadougou', id:"2357048"},
	{city:'Rabat', offset:0, timezone:'Africa/Casablanca', id:"2538475"},
	{city:'Tripoli', offset:120, timezone:'Africa/Tripoli', id:"2210247"},
	{city:'Tunis', offset:60, timezone:'Africa/Tunis', id:"2464470"}
];
var NorthAmerica = [
	{city:'Adak', offset:-540, timezone:'America/Adak', id:"1253605"},
	{city:'Anchorage', offset:-480, timezone:'America/Anchorage', id:"5879400"},
	{city:'Atlanta', offset:-240, timezone:'US/Eastern', id:"4180439"},
	{city:'Austin', offset:-300, timezone:'US/Central', id:"4671654"},
	{city:'Boston', offset:-240, timezone:'US/Eastern', id:"4930956"},
	{city:'Calgary', offset:-360, timezone:'Canada/Mountain', id:"5913490"},
	{city:'Chicago', offset:-300, timezone:'America/Chicago', id:"4887398"},
	{city:'Columbus', offset:-240, timezone:'US/Eastern', id:"4509177"},
	{city:'Cupertino', offset:-420, timezone:'US/Pacific', id:"5341145"},
	{city:'Dallas', offset:-300, timezone:'US/Central', id:"4684888"},
	{city:'Denver', offset:-360, timezone:'America/Denver', id:"5419384"},
	{city:'Detroit', offset:-240, timezone:'America/Detroit', id:"4990729"},
	{city:'Guatemala', offset:-360, timezone:'America/Guatemala', id:"3598132"},
	{city:'Halifax', offset:-180, timezone:'Canada/Atlantic', id:"6324729"},
	{city:'Havana', offset:-240, timezone:'America/Havana', id:"3553478"},
	{city:'Indianapolis', offset:-300, timezone:'America/Indianapolis', id:"4259418"},
	{city:'Knoxville', offset:-240, timezone:'US/Eastern', id:"4634946"},
	{city:'Los Angeles', offset:-420, timezone:'America/Los_Angeles', id:"5368361"},
	{city:'Managua', offset:-360, timezone:'America/Managua', id:"3617763"},
	{city:'Manchester', offset:-240, timezone:'US/Eastern', id:"5089178"},
	{city:'Memphis', offset:-300, timezone:'US/Central', id:"4641239"},
	{city:'Mexico City', offset:-300, timezone:'America/Mexico_City', id:"3530597"},
	{city:'Miami', offset:-240, timezone:'US/Eastern', id:"4164138"},
	{city:'Minneapolis', offset:-300, timezone:'US/Central', id:"5037649"},
	{city:'Montreal', offset:-240, timezone:'America/Montreal', id:"6077243"},
	{city:'New York', offset:-240, timezone:'America/New_York', id:"5128581"},
	{city:'Nuuk', offset:-120, timezone:'America/Godthab', id:"3421319"},
	{city:'Ottawa', offset:-240, timezone:'Canada/Eastern', id:"6094817"},
	{city:'Panama', offset:-300, timezone:'America/Panama', id:"3703443"},
	{city:'Philadelphia', offset:-240, timezone:'US/Eastern', id:"4560349"},
	{city:'Phoenix', offset:-420, timezone:'America/Phoenix', id:"5308655"},
	{city:'Port-au-Prince', offset:-300, timezone:'America/Port-au-Prince', id:"3718426"},
	{city:'Portland', offset:-420, timezone:'US/Pacific', id:"5746545"},
	{city:'Regina', offset:-360, timezone:'Canada/Saskatchewan', id:"6119109"},
	{city:'Salt Lake City', offset:-360, timezone:'US/Mountain', id:"5780993"},
	{city:'San Diego', offset:-420, timezone:'US/Pacific', id:"5391811"},
	{city:'San Francisco', offset:-420, timezone:'US/Pacific', id:"5391959"},
	{city:'San Jose', offset:-360, timezone:'America/Costa_Rica', id:"3621849"},
	{city:'San Salvador', offset:-360, timezone:'America/El_Salvador', id:"3583361"},
	{city:'Santo Domingo', offset:-240, timezone:'America/Santo_Domingo', id:"3492908"},
	{city:'Seattle', offset:-420, timezone:'US/Pacific', id:"5809844"},
	{city:'St. John\'s', offset:-150, timezone:'Canada/Newfoundland', id:"6324733"},
	{city:'St. Louis', offset:-300, timezone:'US/Central', id:"4407066"},
	{city:'Tegucigalpa', offset:-360, timezone:'America/Tegucigalpa', id:"3600949"},
	{city:'Toronto', offset:-240, timezone:'Canada/Eastern', id:"6167865"},
	{city:'Vancouver', offset:-420, timezone:'America/Vancouver', id:"6173331"},
	{city:'Washington, D.C.', offset:-240, timezone:'US/Eastern', id:"4140963"},
	{city:'Winnipeg', offset:-300, timezone:'America/Winnipeg', id:"6183235"}
];
var Asia = [
	{city:'Abu Dhabi', offset:240, timezone:'Asia/Dubai', id:"292968"},
	{city:'Amman', offset:180, timezone:'Asia/Amman', id:"250441"},
	{city:'Anadyr', offset:780, timezone:'Asia/Anadyr', id:"2127202"},
	{city:'Ankara', offset:180, timezone:'Europe/Istanbul', id:"323786"},
	{city:'Antananarivo', offset:180, timezone:'Indian/Antananarivo', id:"1070940"},
	{city:'Baghdad', offset:240, timezone:'Asia/Baghdad', id:"98182"},
	{city:'Bangkok', offset:420, timezone:'Asia/Bangkok', id:"1609350"},
	{city:'Beijing', offset:480, timezone:'Asia/Shanghai', id:"1816670"},
	{city:'Beirut', offset:180, timezone:'Asia/Beirut', id:"276781"},
	{city:'Guangzhou', offset:480, timezone:'Asia/Shanghai', id:"1809858"},
	{city:'Chennai (Madras)', offset:330, timezone:'Asia/Calcutta', id:"1264527"},
	{city:'Colombo', offset:360, timezone:'Asia/Colombo', id:"1248991"},
	{city:'Dhaka', offset:360, timezone:'Asia/Dhaka', id:"1185241"},
	{city:'Damascus', offset:180, timezone:'Asia/Damascus', id:"170654"},
	{city:'Doha', offset:180, timezone:'Asia/Qatar', id:"290030"},
	{city:'Hanoi', offset:420, timezone:'Asia/Saigon', id:"1581130"},
	{city:'Hong Kong', offset:480, timezone:'Asia/Hong_Kong', id:"1819729"},
	{city:'Islamabad', offset:300, timezone:'Asia/Karachi', id:"1176615"},
	{city:'Jakarta', offset:420, timezone:'Asia/Jakarta', id:"1642911"},
	{city:'Jerusalem', offset:180, timezone:'Asia/Jerusalem', id:"281184"},
	{city:'Kabul', offset:270, timezone:'Asia/Kabul', id:"1138958"},
	{city:'Kathmandu', offset:345, timezone:'Asia/Katmandu', id:"1283240"},
	{city:'Kolkata (Calcutta)', offset:330, timezone:'Asia/Calcutta', id:"1275004"},
	{city:'Krasnoyarsk', offset:480, timezone:'Asia/Krasnoyarsk', id:"1502026"},
	{city:'Kuala Lumpur', offset:480, timezone:'Asia/Kuala_Lumpur', id:"1735161"},
	{city:'Kuwait', offset:180, timezone:'Asia/Kuwait', id:"285787"},
	{city:'Magadan', offset:720, timezone:'Asia/Magadan', id:"2123628"},
	{city:'Male', offset:300, timezone:'Indian/Maldives', id:"1282027"},
	{city:'Manama', offset:180, timezone:'Asia/Bahrain', id:"290340"},
	{city:'Manila', offset:480, timezone:'Asia/Manila', id:"1701668"},
	{city:'Mecca', offset:180, timezone:'Asia/Riyadh', id:"104515"},
	{city:'Mumbai (Bombay)', offset:330, timezone:'Asia/Calcutta', id:"1275339"},
	{city:'Muscat', offset:240, timezone:'Asia/Muscat', id:"287286"},
	{city:'New Delhi', offset:330, timezone:'Asia/Calcutta', id:"1261481"},
	{city:'Novosibirsk', offset:420, timezone:'Asia/Novosibirsk', id:"1496747"},
	{city:'Omsk', offset:420, timezone:'Asia/Omsk', id:"1496153"},
	{city:'Osaka', offset:540, timezone:'Asia/Tokyo', id:"1853909"},
	{city:'Phnom Penh', offset:420, timezone:'Asia/Phnom_Penh', id:"1821306"},
	{city:'Port Louis', offset:240, timezone:'Indian/Mauritius', id:"934154"},
	{city:'Pyongyang', offset:540, timezone:'Asia/Pyongyang', id:"1871859"},
	{city:'Rangoon', offset:390, timezone:'Asia/Rangoon', id:"1298824"},
	{city:'Riyadh', offset:180, timezone:'Asia/Riyadh', id:"108410"},
	{city:'Sanaa', offset:180, timezone:'Asia/Aden', id:"71137"},
	{city:'Seoul', offset:540, timezone:'Asia/Seoul', id:"1835848"},
	{city:'Shanghai', offset:480, timezone:'Asia/Shanghai', id:"1796236"},
	{city:'Singapore', offset:480, timezone:'Asia/Singapore', id:"1880252"},
	{city:'Taipei', offset:480, timezone:'Asia/Taipei', id:"1668341"},
	{city:'Tashkent', offset:300, timezone:'Asia/Tashkent', id:"1512569"},
	{city:'Tehran', offset:270, timezone:'Asia/Tehran', id:"112931"},
	{city:'Thanh Pho Ho Chi Minh', offset:420, timezone:'Asia/Saigon', id:"1566083"},
	{city:'Tianjin', offset:480, timezone:'Asia/Shanghai', id:"1792947"},
	{city:'Tokyo', offset:540, timezone:'Japan', id:"1850147"},
	{city:'Ulaanbaatar', offset:480, timezone:'Asia/Ulaanbaatar', id:"2028462"},
	{city:'Victoria', offset:240, timezone:'Indian/Mahe', id:"241131"},
	{city:'Vladivostok', offset:660, timezone:'Asia/Vladivostok', id:"2013348"},
	{city:'Yakutsk', offset:600, timezone:'Asia/Yakutsk', id:"2013159"},
	{city:'Yekaterinburg', offset:360, timezone:'Asia/Yekaterinburg', id:"1486209"}
];
var Australia = [
	{city:'Adelaide', offset:570, timezone:'Australia/Adelaide', id:"2078025"},
	{city:'Brisbane', offset:600, timezone:'Australia/Brisbane', id:"2174003"},
	{city:'Canberra', offset:600, timezone:'Australia/Canberra', id:"2172517"},
	{city:'Darwin', offset:570, timezone:'Australia/Darwin', id:"2073124"},
	{city:'Hobart', offset:600, timezone:'Australia/Hobart', id:"2163355"},
	{city:'Melbourne', offset:600, timezone:'Australia/Melbourne', id:"2158177"},
	{city:'Perth', offset:480, timezone:'Australia/Perth', id:"2063523"},
	{city:'Sydney', offset:600, timezone:'Australia/Sydney', id:"2147714"}
];

var continents = [
	{name:"Africa", array:Africa},
	{name:"Asia", array:Asia},
	{name:"Atlantic", array:Atlantic},
	{name:"Australia", array:Australia},
	{name:"Europe", array:Europe},
	{name:"North America", array:NorthAmerica},
	{name:"Pacific", array:Pacific},
	{name:"South America", array:SouthAmerica}
];

var kNoSweepbackMask = 0x01;
var kNoFaceAnimationMask = 0x02;

//==========================================================
//  Constants that control second hand "sproing" animation
//==========================================================
//  To simulate a mechanical second hand motion, we will:
//    - Go to T+n
//    - Go to T-n
//    - Go to T+(n/2)
//    - Go to T-(n/2)
//    - Go to T+(n/4)
//    - Go to T-(n/4)
//    - Go to T
var secondsSweepbackAnimateInterval = 35;
var secondsSweepbackMax = 0.15;
var secondsSweepbackAmounts = new Array( -2*secondsSweepbackMax, 1.5*secondsSweepbackMax,
										 -secondsSweepbackMax, 0.75*secondsSweepbackMax,
										 -0.5*secondsSweepbackMax, 0.25*secondsSweepbackMax );
var secondSweepbackAnimation = {step:0, timer:null, originalSeconds:0};

// vars needed for hand spin animation
var spinHandsAnimation = {preAnimationDelay:800, incrementDelay:15, displayedTime:{hours:0, minutes:0, seconds:0}, targetTime:{hours:0, minutes:0, seconds:0}, forwards:true, minutesDifference:0, minutesPassed:0, incrementMin:1, incrementMax:6, incrementCurrent:.5, rampUpPeriod:30, rampDownPeriod:60};

var clockFaceAnimation = {duration:450, starttime:0, to:1.0, now:0.0, from:0.0, element:null, timer:null};

var clockTimerInterval = null;

var currentTimezone;
var minutesAngle;
var hoursAngle;
var secondsAngle;

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
		result = eval("gDefault" + key.substring(0,1).toUpperCase() + key.substring(1));
	}
	return result;
}

var kContinentIndexKey = "continent";
var kCityIndexKey = "city";
var kLocaleKey = "locale";
var kGeoIDIndexKey = "geoID";

function onshow() {
	if (clockTimerInterval == null) {
		startClockTimer();
	}
	updateTime(null,kNoSweepbackMask|kNoFaceAnimationMask);
}

function onhide() {
	stopClockTimer();
	clearHands();
}

function onsync() {
	loadPreferences();
	startClockTimer();
	// TODO call this instead???
	//onshow();
}

function onremove() {
	setInstancePreferenceForKey(null, kContinentIndexKey);
	setInstancePreferenceForKey(null, kCityIndexKey);
	setInstancePreferenceForKey(null, kGeoIDIndexKey);
}

function savePreferences() {
	setInstanceAndGlobalPreferenceForKey(gDefaultContinent.toString(), kContinentIndexKey);
	setInstanceAndGlobalPreferenceForKey(gDefaultCity.toString(), kCityIndexKey);
	setInstanceAndGlobalPreferenceForKey(gDefaultGeoID.toString(), kGeoIDIndexKey);
}

if (window.widget) {
	data = preferenceForKey(kLocaleKey);
	widget.onhide = onhide;
	widget.onshow = onshow;
	widget.onremove = onremove;
	widget.onsync = onsync;
}

function $(id) {
	return document.getElementById(id);
}

function load() {
	loadPreferences();

	var doneButton = $('done');
	new AppleGlassButton (doneButton, getLocalizedString('Done'), doneClicked);
	new AppleInfoButton($("infoButton"), $("front"), "white", "white", showbackside);

	startClockTimer();
}

function loadPreferences() {
	updateDefaultCityAndContinent();
	gDefaultCity = parseInt(preferenceForKey(kCityIndexKey));
	gDefaultContinent = parseInt(preferenceForKey(kContinentIndexKey));
	gDefaultGeoID = parseInt(preferenceForKey(kGeoIDIndexKey));

	// Save orig GMT offset
	currentTimezone = continents[gDefaultContinent].array[gDefaultCity].timezone;

	populateContinentSelect();
 	$ ('continent-popup').options[gDefaultContinent].selected = true;
	popuplateCitySelect(continents[gDefaultContinent].array);
 	$ ('city-popup').options[gDefaultCity].selected = true;
 	$('localeDisplay').innerText= getLocalizedCityName(continents[gDefaultContinent].array[gDefaultCity].city);

 	$('continent-label').innerText = getLocalizedString('Continent:');
 	$('city-label').innerText = getLocalizedString('City:');
 	$('ampm').innerText = getLocalizedString(isItAM ? 'AM' : 'PM');
	//savePreferences(); <rdar://problem/6843159> Widget Clogs generated overnight
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

function getLocalizedCityName (key)
{
    try {
            var ret = localizedCityNames[key];
            if (ret === undefined)
                    ret = key;
            return ret;
    } catch (ex) {}

    return key;
}

function getLocalizedContinentName (key)
{
    try {
            var ret = localizedContinentNames[key];
            if (ret === undefined)
                    ret = key;
            return ret;
    } catch (ex) {}

    return key;
}

function updateDefaultCityAndContinent()
{
	// reset defaults to cupertino, north america
	gDefaultCity = 8;
	gDefaultContinent = 5;

	if (window.TimeZoneInfo) {
		var continentName = TimeZoneInfo.getDefaultContinentName();
		var count = continents.length;

		for(i = 0; i < count; i++)
		{
			if (continentName == continents[i].name)
			{
				gDefaultContinent = i;
				break;
			}
		}

		// if we're not in north america, default to first city in continent
		if (continentName != "North America")
			gDefaultCity = 0;

		// get city
		geoID = TimeZoneInfo.getDefaultGeoID();
		var foundCity = false;

		// find city in array
		var cityArray = continents[gDefaultContinent].array;
		for(i = 0; i < cityArray.length; i++)
		{
			if (geoID == cityArray[i].id)
			{
				foundCity = true;
				gDefaultCity = i;
				gDefaultGeoID = cityArray[i].id;
				break;
			}
		}

		var offset = TimeZoneInfo.getDefaultTimeZoneOffset();

		if(!foundCity) //lets try to find one in the same time zone
		{
			var offset = TimeZoneInfo.getDefaultTimeZoneOffset();

			for(i = 0; i < cityArray.length; i++)
			{
				if(offset == cityArray[i].offset)
				{
					gDefaultCity = i;
					gDefaultGeoID = cityArray[i].id;
					break;
				}
			}
		}
	}

	// Save orig GMT offset
	currentTimezone = continents[gDefaultContinent].array[gDefaultCity].timezone;
}

var isItEvening = isEvening((new Date).getHours());
var isItAM = isAM ((new Date).getHours);

function isEvening (hours)
{
	return hours < 6 || hours > 17;
}

function isAM (hours)
{
	return hours < 12;
}

imageLoaded.numImages = 1;
imageLoaded.count = 0;

function imageLoaded(evt) {
	imageLoaded.count++;
	console.log("Image loaded");
	if (imageLoaded.numImages == imageLoaded.count) {
		onshow();
	}
}

// Preload both sets of images
var minhand;
var minhand_pm = new Image (17, 53);
if(navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
minhand_pm.src = 'Images/pmmins.pdf';
} else {
	console.log("ischrome");
	minhand_pm.src = 'Images/pmmins.png';
}
minhand_pm.onload = imageLoaded;
var minhand_am = new Image (17, 53);
if(navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
minhand_am.src = 'Images/mins.pdf';
} else {
	minhand_am.src = 'Images/mins.png';
}
minhand_am.onload = imageLoaded;

if (isItEvening)
	minhand = minhand_pm;
else
	minhand = minhand_am;


var hourhand;
var hourhand_pm = new Image (13, 27);
if(navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
hourhand_pm.src = 'Images/pmhour.pdf';
} else {
	hourhand_pm.src = 'Images/pmhour.png';
}
hourhand_pm.onload = imageLoaded;
var hourhand_am = new Image (13, 27);
if(navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
hourhand_am.src = 'Images/hour.pdf';
} else {
	hourhand_am.src = 'Images/hour.png';
}
hourhand_am.onload = imageLoaded;

if (isItEvening)
	hourhand = hourhand_pm;
else
	hourhand = hourhand_am;

var sechand = new Image (7, 55);
if(navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
sechand.src = 'Images/secs.pdf';
} else {
	sechand.src = 'Images/secs.png';
}
sechand.onload = imageLoaded;

function secondSweepbackAnimate()
{
	if (secondSweepbackAnimation.step >= secondsSweepbackAmounts.length)
	{
		//  no more steps to the animation, clear the timer
		clearInterval(secondSweepbackAnimation.timer);
		secondSweepbackAnimation.timer = null;
		secondSweepbackAnimation.step = 0;
	}
	else
	{
		secondSweepbackAnimation.originalSeconds = secondSweepbackAnimation.originalSeconds + secondsSweepbackAmounts[secondSweepbackAnimation.step];
		secondsAngle = secondSweepbackAnimation.originalSeconds * 0.10471975511965977; // all angles computed in radians

		drawHands (hoursAngle, minutesAngle, secondsAngle);

		secondSweepbackAnimation.step++;
	}
}


// The time encoding from the plugin stores the hours minutes and seconds in an int as hhmmss
function getHoursMinutesSeconds(encodedTime)
{
	var parts = new Array();

	// Decode hours
	parts.hours = parseInt(encodedTime/10000);

	// Grab remainder
	var afterHours = encodedTime%10000;

	// Minutes is remainder div 100
	parts.minutes = parseInt(afterHours/100);

	// Seconds is the remainder of that
	parts.seconds = afterHours%100;

	return parts;
}

function updateTime(newTime,flags)
{
	var hours,minutes,seconds,evening,am;

	var shouldDoSweepback = ((flags & kNoSweepbackMask) == 0);
	var shouldAnimateFaceChange = ((flags & kNoFaceAnimationMask) == 0);

	if (newTime) {
		// time is specified during tz change animation
		hours = newTime.hours;
		minutes = newTime.minutes;
		seconds = newTime.seconds;

		// Keep the global current
		spinHandsAnimation.displayedTime = newTime;
	}
	else if (window.TimeZoneInfo && currentTimezone) {
		var d = new Date();
		d.toLocaleString('en-US', { timeZone: currentTimezone });
		var encodedTime = d;

		// Keep the globals current
		var timeParts = getHoursMinutesSeconds(encodedTime);
		hours = timeParts.hours;
		minutes = timeParts.minutes;
		seconds = timeParts.seconds;
	}
	else {
		// Fall back to offset
		var now = new Date();
		var ourGMTOffset = now.getTimezoneOffset();
		var targetGMTOffset = continents[gDefaultContinent].array[gDefaultCity].offset;

		now.setTime(now.getTime() + ((ourGMTOffset + targetGMTOffset) * 60 * 1000));
		hours = now.getHours();
		minutes = now.getMinutes();
		seconds = now.getSeconds();
	}

	evening = isEvening(hours);
	am = isAM(hours);

	//
	// change the face if necessary.  if no sweepback and not in spin anim, don't animate face change either.
	//
	if (evening != isItEvening)
	{
		isItEvening = evening;
		var eveningElement = $('eveningFace');

		if (evening)
		{
			hourhand = hourhand_pm;
			minhand = minhand_pm;
			if (shouldAnimateFaceChange) {
				clockFaceAnimation.to = 1.0;
			}
			else {
				eveningElement.style.opacity = 1.0;
			}
		}
		else
		{
			hourhand = hourhand_am;
			minhand = minhand_am;
			if (shouldAnimateFaceChange) {
				clockFaceAnimation.to = 0.0;
			}
			else {
				eveningElement.style.opacity = 0.0;
			}
		}

		// Perform clock face animation if necessary
		if (shouldAnimateFaceChange) {
			// set animation state for face change
			if (clockFaceAnimation.timer != null)
			{
				clearInterval (clockFaceAnimation.timer);
				clockFaceAnimation.timer  = null;
			}

			var starttime = (new Date).getTime() - 13; // set it back one frame
			clockFaceAnimation.starttime = starttime;
			clockFaceAnimation.element = eveningElement;
			clockFaceAnimation.now = parseFloat(eveningElement.style.opacity);
			clockFaceAnimation.from = clockFaceAnimation.now;
			clockFaceAnimation.timer = setInterval ("animate(clockFaceAnimation);", 35);

			animate(clockFaceAnimation);
		}
	}

	if (am != isItAM)
	{
		isItAM = am;
	 	$('ampm').innerText = getLocalizedString(isItAM ? 'AM' : 'PM');
	}

	secondSweepbackAnimation.originalSeconds = seconds+secondsSweepbackMax;
	var secondsAngle = secondSweepbackAnimation.originalSeconds * 0.10471975511965977; // all angles computed in radians
	minutesAngle = minutes * 0.10471975511965977;
	hoursAngle = ((hours%12) * 0.523598775598) + (minutesAngle/6.283185481853 * 0.523598775598);

	drawHands (hoursAngle, minutesAngle, secondsAngle);

	if (shouldDoSweepback)
	{
		if (secondSweepbackAnimation.timer != null)
		{
			clearInterval(secondSweepbackAnimation.timer);
			secondSweepbackAnimation.timer = null;
		}
		secondSweepbackAnimation.step = 0;
		secondSweepbackAnimation.timer = setInterval("secondSweepbackAnimate();", secondsSweepbackAnimateInterval);
	}
}

function startClockTimer()
{
	stopClockTimer();
	clockTimerInterval = setInterval("updateTime(null,null);", 1000);
}

function stopClockTimer()
{
	if (clockTimerInterval != null)
	{
		clearInterval(clockTimerInterval);
		clockTimerInterval = null;
	}
}

function resetHandSpinAnimation()
{
	// Reset the globals
	spinHandsAnimation.displayedTime.hours = 0;
	spinHandsAnimation.displayedTime.minutes = 0;
	spinHandsAnimation.displayedTime.seconds = 0;
	spinHandsAnimation.targetTime.hours = 0;
	spinHandsAnimation.targetTime.minutes = 0;
	spinHandsAnimation.targetTime.seconds = 0;
	spinHandsAnimation.minutesPassed = 0;
	spinHandsAnimation.minutesDifference = 0;

	newGMTOffset = null;
	origGMTOffset = null;
}

function clearHands()
{
	var canvas = $("canvas");
	var context = canvas.getContext("2d");

	context.clearRect (0, 0, 112, 112);
}

function drawHands (hoursAngle, minutesAngle, secondsAngle)
{
	if (imageLoaded.count < imageLoaded.numImages)
		return;
	var canvas =    $("canvas");
	var context = canvas.getContext("2d");

	context.clearRect (0, 0, 112, 112);

	context.save();
	context.translate (112/2, 112/2 -1);

	context.save();
	context.rotate (hoursAngle);
	context.translate (-7, -28.5);
	context.drawImage (hourhand, 0, 0, 13, 27);
	context.restore();

	context.save();
	context.rotate (minutesAngle);
	context.translate (-8.5, -44);
	context.drawImage (minhand, 0, 0, 17, 53);
	context.restore();

	context.rotate (secondsAngle);
	context.translate (-3.5, -50.5);
	context.drawImage (sechand, 0, 0, 7, 55);

	context.restore();

//  context.setFillColor ("black");
//  context.fillRect(112/2, 0, 1, 112);
//  context.fillRect(0, (112/2)-1, 112, 1);
}

function showbackside(event)
{
	var front = $("front");
	var back = $("behind");

	if (window.widget)
		widget.prepareForTransition("ToBack");

	stopClockTimer();
	resetHandSpinAnimation();

	front.style.display="none";
	back.style.display="block";

	if (window.widget)
		setTimeout ('widget.performTransition();', 0);

}


function doneClicked() {
	var front = $("front");
	var back = $("behind");

	if (window.widget)
			widget.prepareForTransition("ToFront");

	front.style.display="block";
	back.style.display="none";

	// on delay so hands can show during flip
	setTimeout ('flipitback();', 0);
}

function flipitback()
{
	if (window.widget)
			setTimeout("widget.performTransition();", 0);

	// Right now we're displaying the current time in the old timezone.

	// Get the newly selected timezone
	var newTimezone = continents[gDefaultContinent].array[gDefaultCity].timezone;
	console.log(newTimezone);
	var oldTimezone = currentTimezone;

	// Set current to new tz
	currentTimezone = newTimezone;

	//test getHoursMinutesSeconds
	var d = new Date();
	d.toLocaleString('en-US', { timeZone: currentTimezone });
	var d1 = new Date();
	d1.toLocaleString('en-US', { timeZone: oldTimezone });


	// the currently displayed time
	spinHandsAnimation.displayedTime = getHoursMinutesSeconds(d1);

	// Time showing on face as we flip back
	updateTime(spinHandsAnimation.displayedTime,kNoSweepbackMask|kNoFaceAnimationMask);

	// the time we'll animate to
	spinHandsAnimation.targetTime = getHoursMinutesSeconds(d);

	// Get the offsets from gmt
	var origGMTOffset = d1.getTimezoneOffset();
	var newGMTOffset = d.getTimezoneOffset();

	// See which direction to spin the hands
	//alert("new offset:"+ newGMTOffset  + "old offset:"+origGMTOffset);
	spinHandsAnimation.forwards = (newGMTOffset > origGMTOffset);
	spinHandsAnimation.minutesDifference = Math.abs(newGMTOffset - origGMTOffset);

	// Return immediately if the time is the same
	if (shouldStopSpinning(spinHandsAnimation.displayedTime,spinHandsAnimation.targetTime)) {
		startClockTimer();
		return;
	}

	// set up some animation constants
	if (spinHandsAnimation.minutesDifference <= 60) {	// The number of minutes difference between the old and new timezones
		// vals for time changes <= 1 hour
		spinHandsAnimation.incrementMin = .1;	// The bottom of the ease curve (incrementing by 1 minute each frame)
		spinHandsAnimation.incrementMax = 1;	// The top of the ease curve (incrementing by 2 minutes each frame)
		spinHandsAnimation.rampUpPeriod = 10;	// The number of minutes on the clock face over which we ease in
		spinHandsAnimation.rampDownPeriod = 20;	// The number of minutes on the clock face over which we ease out
	}
	else if (spinHandsAnimation.minutesDifference < 480) {
		// vals for time changes < 8 hours
		spinHandsAnimation.incrementMin = .1;
		spinHandsAnimation.incrementMax = 2;
		spinHandsAnimation.rampUpPeriod = 15;
		spinHandsAnimation.rampDownPeriod = 30;
	}
	else {
		spinHandsAnimation.incrementMin = .1;
		spinHandsAnimation.incrementMax = 3;
		spinHandsAnimation.rampUpPeriod = 30;
		spinHandsAnimation.rampDownPeriod = 45;
	}

	// Cancel a running timer.
	if (clockTimerInterval != null)
	{
		clearInterval (clockTimerInterval);
		clockTimerInterval = null;
	}

	// Start the spin animation
	setTimeout("clockTimerInterval = setInterval(\"animateHandSpin();\",spinHandsAnimation.incrementDelay)",spinHandsAnimation.preAnimationDelay);
}

function animateHandSpin()
{
	var d = new Date();
	d.toLocaleString('en-US', { timeZone: currentTimezone });
	var tmpNewTargetTime = getHoursMinutesSeconds(d);
	if (tmpNewTargetTime.minutes > spinHandsAnimation.targetTime.minutes) {
		if (spinHandsAnimation.forwards)
			spinHandsAnimation.minutesDifference++;
		else
			spinHandsAnimation.minutesDifference--;
	}
	spinHandsAnimation.targetTime = tmpNewTargetTime;

	if (shouldStopSpinning(spinHandsAnimation.displayedTime,spinHandsAnimation.targetTime))  // animation is done
	{
		if (clockTimerInterval != null)
		{
			clearInterval (clockTimerInterval);
			clockTimerInterval = null;

			resetHandSpinAnimation();

			// Start normal clock operation
			updateTime(null,kNoSweepbackMask);
			startClockTimer();
		}
	}
	else  // animate one step
	{
		var minutesLeft = spinHandsAnimation.minutesDifference - spinHandsAnimation.minutesPassed;
		if (minutesLeft <= spinHandsAnimation.rampDownPeriod) {
			// decel to min speed
			var percentDoneRamp = 1-(minutesLeft/spinHandsAnimation.rampDownPeriod);
			var ease = .5 + .5*Math.cos(Math.PI*percentDoneRamp);
			spinHandsAnimation.currentIncrement = computeNextFloat (spinHandsAnimation.incrementMin, spinHandsAnimation.incrementMax, ease);
		}
		else if (spinHandsAnimation.minutesPassed <= spinHandsAnimation.rampUpPeriod) {
			// accel to top speed
			var percentDoneRamp = spinHandsAnimation.minutesPassed/spinHandsAnimation.rampUpPeriod;
			var ease = .5 - .5*Math.cos(Math.PI*percentDoneRamp);
			spinHandsAnimation.currentIncrement = computeNextFloat (spinHandsAnimation.incrementMin, spinHandsAnimation.incrementMax, ease);
		}
		else {
			spinHandsAnimation.currentIncrement = spinHandsAnimation.incrementMax;
		}

		// Make sure this doesn't put us past the end.
		if ((spinHandsAnimation.currentIncrement + spinHandsAnimation.minutesPassed) >= spinHandsAnimation.minutesDifference)
			spinHandsAnimation.currentIncrement = spinHandsAnimation.minutesDifference-spinHandsAnimation.minutesPassed;

		// Update stop counter
		spinHandsAnimation.minutesPassed += spinHandsAnimation.currentIncrement;

		// Apply directional increment
		spinHandsAnimation.displayedTime = stepHands(spinHandsAnimation.displayedTime,spinHandsAnimation.currentIncrement);

		// Keep second hand ticking along.
		spinHandsAnimation.displayedTime.seconds = spinHandsAnimation.targetTime.seconds;

		updateTime(spinHandsAnimation.displayedTime,kNoSweepbackMask);
	}
}

// Time passed in hhmmss for as returned by TimeZoneInfo.currentTimeForTimeZone
function shouldStopSpinning(time1,time2)
{
	return (spinHandsAnimation.minutesPassed >= spinHandsAnimation.minutesDifference)
}

// Time comes in as hms array for as returned by TimeZoneInfo.currentTimeForTimeZone
// Assumes stepMinutes is less than an hour.
function stepHands(timeParts,stepMinutes)
{
	if (spinHandsAnimation.forwards)
	{
		if ((timeParts.minutes + stepMinutes) < 60)
			timeParts.minutes += stepMinutes;
		else
		{
			// Reset mins and add an hour
			timeParts.minutes = timeParts.minutes + stepMinutes - 60;
			if (timeParts.hours < 23)
			{
				// Plus an hour
				timeParts.hours++;
			}
			else
			{
				// Reset hours
				timeParts.hours = 0;
			}
		}
	}
	else
	{
		if ((timeParts.minutes - stepMinutes) >= 0)
			timeParts.minutes -= stepMinutes;
		else
		{
			// Reset minutes to 59 and subtract an hour
			timeParts.minutes = timeParts.minutes - stepMinutes + 60;
			if (timeParts.hours > 0)
			{
				// Minus an hour
				timeParts.hours--;
			}
			else
			{
				// Reset hours to 23
				timeParts.hours = 23;
			}
		}
	}

	return timeParts;
}

//  Returns val if min < val < max
//  Returns min if val <= min
//  Returns max if val >= max
function limit_3 (val, min, max)
{
    return val < min ? min : (val > max ? max : val);
}

function computeNextFloat (from, to, ease)
{
    return from + (to - from) * ease;
}

function animate(theAnimation)
{
	var T;
	var ease;
	var time = (new Date).getTime();
	T = limit_3(time-theAnimation.starttime, 0, theAnimation.duration);
	if (T >= theAnimation.duration)
	{
		clearInterval (theAnimation.timer);
		theAnimation.timer = null;
		theAnimation.now = theAnimation.to;
	}
	else
	{
		ease = 0.5 - (0.5 * Math.cos(Math.PI * T / theAnimation.duration));
		theAnimation.now = computeNextFloat (theAnimation.from, theAnimation.to, ease);
	}

	theAnimation.element.style.opacity = theAnimation.now;
}

function populateContinentSelect()
{
	var select = $ ('continent-popup');
	select.innerHTML = "";
	var c = continents.length;

	for (var i = 0; i < c; ++i)
	{

		var element = document.createElement("option");
		element.innerText = getLocalizedContinentName(continents[i].name);
		select.appendChild (element);
	}
}

function popuplateCitySelect(cities)
{
	var select = $ ('city-popup');
	select.innerHTML = "";
	var c = cities.length;

	for (var i = 0; i < c; ++i)
	{
		var element = document.createElement("option");
		element.innerText = getLocalizedCityName(cities[i].city);
		select.appendChild (element);
	}
}

function continentchanged(select) {
	if (gDefaultContinent != select.selectedIndex) {
		gDefaultContinent = select.selectedIndex;
		popuplateCitySelect(continents[gDefaultContinent].array);
		gDefaultCity = 0;
	 	$ ('city-popup').options[gDefaultCity].selected = true;
	 	$("localeDisplay").innerText= getLocalizedCityName(continents[gDefaultContinent].array[gDefaultCity].city);

	 	savePreferences();
	}
}

function citychanged(select) {
	if (gDefaultCity != select.selectedIndex) {
		gDefaultCity = select.selectedIndex;
	 	$("localeDisplay").innerText= getLocalizedCityName(continents[gDefaultContinent].array[gDefaultCity].city);

	 	savePreferences();
	}
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
