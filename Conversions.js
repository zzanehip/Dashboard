/*
Copyright ＿ 2005, Apple Computer, Inc.  All rights reserved.
NOTE:  Use of this source code is subject to the terms of the Software
License Agreement for Mac OS X, which accompanies the code.  Your use
of this source code signifies your agreement to such license terms and
conditions.  Except as expressly granted in the Software License Agreement
for Mac OS X, no other copyright, patent, or other intellectual property
license or right is granted, either expressly or by implication, by Apple.
*/

function linearForm(a,b)
{
	if ((a != null) && (b != null)) {
		return function(x) {return a*x + b;};
	} else if (a != null) {
		return function(x) {return a*x;};
	}
	alert("linearForm - bad args a = "+a+" b = "+b);
}

// y = ax + b ==> (y - b) = ax ==> (y-b)/a = x

function invLinForm(a,b)
{
	if ((a != null) && (b != null)) {
		return function(y) {return (y-b)/a;};
	} else if (a != null) {
		return function(y) {return y/a;};
	} 
	alert("invLinForm - bad args a = "+a+" b = "+b);
}

var Area = [
	{name:'Square Mile', 		toBase:linearForm(2589988.110336), 	fromBase:invLinForm(2589988.110336)},
	{name:'Square Yard', 		toBase:linearForm(0.836127), 		fromBase:invLinForm(0.836127)},
	{name:'Square Foot', 		toBase:invLinForm(10.7639104),		fromBase:linearForm(10.7639104)},
	{name:'Square Inch', 		toBase:invLinForm(1550.0031),		fromBase:linearForm(1550.0031)},
	{name:'Hectare', 			toBase:linearForm(10000.0), 		fromBase:invLinForm(10000.0)},
	{name:'Acre', 				toBase:linearForm(4046.8564224), 	fromBase:invLinForm(4046.8564224)},
	{name:'Square Kilometer', 	toBase:linearForm(1000000.0),		fromBase:invLinForm(1000000.0)},
	{name:'Square Meter', 		toBase:linearForm(1.0), 			fromBase:invLinForm(1.0)},
	{name:'Square Centimeter', 	toBase:invLinForm(10000.0), 		fromBase:linearForm(10000)},
	{name:'Square Millimeter', 	toBase:invLinForm(1000000.0), 		fromBase:linearForm(1000000.0)}
];

var Energy = [
	{name:'Btus', 				toBase:linearForm(1055.05585257348),	fromBase:invLinForm(1055.05585257348)},
	{name:'Calories', 			toBase:linearForm(4.1868), 				fromBase:invLinForm(4.1868)},
	{name:'Ergs', 				toBase:invLinForm(10000000.0), 			fromBase:linearForm(10000000.0)},
	{name:'Foot-Pounds', 		toBase:linearForm(1.3558179483314004), 	fromBase:invLinForm(1.3558179483314004)},
	{name:'Joules', 			toBase:linearForm(1.0), 				fromBase:linearForm(1.0)},
	{name:'Kilogram-Calories', 	toBase:linearForm(4186.8), 				fromBase:invLinForm(4186.8)},
	{name:'Kilogram-Meters', 	toBase:linearForm(9.80665), 			fromBase:invLinForm(9.80665)},
	{name:'Kilowatt-Hours', 	toBase:linearForm(3600000.0), 			fromBase:invLinForm(3600000.0)},
	{name:'Newton-Meters', 		toBase:linearForm(1.0), 				fromBase:linearForm(1.0)},
	{name:'Watt-Hours', 		toBase:linearForm(3600.0), 				fromBase:invLinForm(3600.0)}
];

var Temperature = [
	{name:'Celsius', 			toBase:linearForm(1.0),					fromBase:invLinForm(1.0)},
	{name:'Fahrenheit', 		toBase:invLinForm(1.8,32.0),			fromBase:linearForm(1.8,32.0)},
	{name:'Kelvin', 			toBase:linearForm(1.0,-273.15),			fromBase:invLinForm(1.0,-273.15)}
];

var Length = [
	{name:'Mile (nautical)', 	toBase:linearForm(1852.0), 				fromBase:invLinForm(1852.0)},
	{name:'Mile', 				toBase:linearForm(1609.344), 			fromBase:invLinForm(1609.344)},
	{name:'Yard', 				toBase:invLinForm(1.093613298),			fromBase:linearForm(1.093613298)},
	{name:'Foot', 				toBase:invLinForm(3.280839895), 		fromBase:linearForm(3.280839895)},
	{name:'Inch', 				toBase:invLinForm(39.3700787402),		fromBase:linearForm(39.3700787402)},
	{name:'Kilometer', 			toBase:linearForm(1000.000000),			fromBase:invLinForm(1000.000000)},
	{name:'Meter', 				toBase:linearForm(1.0), 				fromBase:invLinForm(1.0)},
	{name:'Centimeter', 		toBase:invLinForm(100.000000), 			fromBase:linearForm(100.000000)},
	{name:'Millimeter', 		toBase:invLinForm(1000), 				fromBase:linearForm(1000)}
];

var Weight = [
	{name:'Short Ton (US)', 	toBase:linearForm(907.18474), 			fromBase:invLinForm(907.18474)},
	{name:'Pound (US)', 		toBase:invLinForm(2.204622622), 		fromBase:linearForm(2.204622622)},
// the following tests more accurately for 1 but actually has a poorer aproximation in binary *shrug*
//	{name:'Pound (US)', 		toBase:linearForm(0.45359237), 			fromBase:invLinForm(0.45359237)},
	{name:'Ounce (US)', 		toBase:invLinForm(35.2739619), 			fromBase:linearForm(35.2739619)},
	{name:'Stone', 				toBase:invLinForm(2.204622622/14), 		fromBase:linearForm(2.204622622/14)},
	{name:'Long Ton (UK)', 		toBase:linearForm(1016.0469088), 		fromBase:invLinForm(1016.0469088)},
	{name:'Metric Ton', 		toBase:linearForm(1000), 				fromBase:invLinForm(1000)},
	{name:'Kilogram', 			toBase:linearForm(1.0), 				fromBase:invLinForm(1.0)},
	{name:'Gram', 				toBase:invLinForm(1000), 				fromBase:linearForm(1000)}
];


var Speed = [
	{name:'Knots', 				toBase:invLinForm(1.94384449), 			fromBase:linearForm(1.94384449)},
	{name:'Miles/Hour', 		toBase:invLinForm(2.23693629), 			fromBase:linearForm(2.23693629)},
	{name:'Miles/Minute', 		toBase:linearForm(26.8224), 			fromBase:invLinForm(26.8224)},
	{name:'Feet/Minute', 		toBase:invLinForm(196.850394), 			fromBase:linearForm(196.850394)},
	{name:'Feet/Second', 		toBase:invLinForm(3.2808399), 			fromBase:linearForm(3.2808399)},
	{name:'Kilometers/Hour', 	toBase:invLinForm(3.6), 				fromBase:linearForm(3.6)},
	{name:'Kilometers/Minute',	toBase:invLinForm(0.06),				fromBase:linearForm(0.06)},
	{name:'Meters/Second', 		toBase:linearForm(1.00), 				fromBase:invLinForm(1.00)}
];


var Pressure = [
	{name:'Pounds/Square Foot',	 	toBase:linearForm(4.88242764), 			fromBase:invLinForm(4.88242764)},
	{name:'Pounds/Square Inch', 	toBase:linearForm(703.06957963916318),	fromBase:invLinForm(703.06957963916318)},
	{name:'Atmospheres', 			toBase:linearForm(10332.2745), 			fromBase:invLinForm(10332.2745)},
	{name:'Bars', 					toBase:linearForm(10197.1621), 			fromBase:invLinForm(10197.1621)},
	{name:'Inches of Mercury', 		toBase:linearForm(345.31554), 			fromBase:invLinForm(345.31554)},
	{name:'Centimeters of Mercury', toBase:linearForm(135.950981), 			fromBase:invLinForm(135.950981)},
	{name:'Kilograms/Square Meter', toBase:linearForm(1.0), 				fromBase:invLinForm(1.0)},
	{name:'Pascals', 				toBase:invLinForm(9.80665000000000),	fromBase:linearForm(9.80665000000000)}
];

var Power = [
	{name:'Btus/Minute', 		toBase:invLinForm(56.8690286), 			fromBase:linearForm(56.8690286)},
	{name:'Foot-Pounds/Minute', toBase:invLinForm(44253.72894), 		fromBase:linearForm(44253.72894)},
	{name:'Foot-Pounds/Second', toBase:invLinForm(737.562149), 			fromBase:linearForm(737.562149)},
	{name:'Horsepower', 		toBase:invLinForm(1.341022089599), 		fromBase:linearForm(1.341022089599)},
	{name:'Kilowatts',			toBase:linearForm(1.0), 				fromBase:invLinForm(1.0)},	
	{name:'Watts', 				toBase:invLinForm(1000.0), 				fromBase:linearForm(1000.0)}
];

var Volume = [
	{name:'Cubic Feet', 		toBase:linearForm(28.316846592), 		fromBase:invLinForm(28.316846592)},
	{name:'Gallon (Imperial)', 	toBase:linearForm(4.54609), 			fromBase:invLinForm(4.54609)},
	{name:'Gallon (US)', 		toBase:linearForm(3.785411784), 		fromBase:invLinForm(3.785411784)},
	{name:'Quart (US)', 		toBase:linearForm(0.94635294600000), 	fromBase:invLinForm(0.94635294600000)},
	{name:'Pint (US)', 			toBase:invLinForm(2.11337641886519), 	fromBase:linearForm(2.11337641886519)},
	{name:'Fluid Ounce (US)',	toBase:invLinForm(33.81402270184300), 	fromBase:linearForm(33.81402270184300)},
	{name:'Cup',				toBase:invLinForm(4.22675283773), 		fromBase:linearForm(4.22675283773)},
	{name:'Tablespoon',			toBase:invLinForm(67.62804540368), 		fromBase:linearForm(67.62804540368)},
	{name:'Teaspoon',			toBase:invLinForm(202.88413621104), 	fromBase:linearForm(202.88413621104)},
	{name:'Dram (US)', 			toBase:invLinForm(270.51218161474401), 	fromBase:linearForm(270.51218161474401)},
	{name:'Cubic Meter',		toBase:linearForm(1000.0), 				fromBase:invLinForm(1000.0)},
	{name:'Liter', 				toBase:linearForm(1.0), 				fromBase:invLinForm(1.0)}
];

var Time = [
	{name:"Years", 				toBase:linearForm(31557600), 			fromBase:invLinForm(31557600)},
	{name:"Weeks", 				toBase:linearForm(604800), 				fromBase:invLinForm(604800)},
	{name:"Days", 				toBase:linearForm(86400), 				fromBase:invLinForm(86400)},
	{name:"Hours", 				toBase:linearForm(3600), 				fromBase:invLinForm(3600)},
	{name:"Minutes", 			toBase:linearForm(60), 					fromBase:invLinForm(60)},
	{name:"Seconds", 			toBase:linearForm(1.0), 				fromBase:linearForm(1.0)},
	{name:"Milliseconds", 		toBase:invLinForm(1000.0), 				fromBase:linearForm(1000.0)},
	{name:"Microseconds", 		toBase:invLinForm(1000000.0), 			fromBase:linearForm(1000000.0)},
	{name:"Nanoseconds", 		toBase:invLinForm(1000000000.0),		fromBase:linearForm(1000000000.0)}
];

// Currency data is coming from XML feed
var Currency = [];
var currencyCatIndex = 1;	// index for Currency in the Categories array

// defaultFrom is the unit on the left-hand side of the widget, 
// defaultTo is the unit on the right-hand side of the widget. 

// make sure to update the currency category index if you add a category before it
var Categories = [
	{name:'Area',array:Area,defaultFrom: 0,defaultTo: 4, precision:8},
	{name:'Currency',array:Currency,defaultFrom: 0,defaultTo: 12, precision:8, nextUpdate: null},
	{name:'Energy',array:Energy,defaultFrom: 3,defaultTo: 0, precision:8},
	{name:'Length',array:Length,defaultFrom: 1,defaultTo: 5, precision:8},
	{name:'Power',array:Power,defaultFrom: 4,defaultTo: 0, precision:8},
	{name:'Pressure',array:Pressure,defaultFrom: 0,defaultTo: 6, precision:8},
	{name:'Speed',array:Speed,defaultFrom: 1,defaultTo: 5, precision:8},
	{name:'Temperature',array:Temperature,defaultFrom:0,defaultTo: 1, precision:5},
	{name:'Time',array:Time,defaultFrom: 3,defaultTo: 4, precision:8},
	{name:'Volume',array:Volume,defaultFrom: 2,defaultTo: 8, precision:8},
	{name:'Weight',array:Weight,defaultFrom: 1,defaultTo: 5, precision:8}
];