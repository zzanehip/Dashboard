/*
Copyright © 2006, 2008 Apple Inc.  All rights reserved.
NOTE:  Use of this source code is subject to the terms of the Software
License Agreement for Mac OS X, which accompanies the code.  Your use
of this source code signifies your agreement to such license terms and
conditions.  Except as expressly granted in the Software License Agreement
for Mac OS X, no other copyright, patent, or other intellectual property
license or right is granted, either expressly or by implication, by Apple.
*/



//
// Terminology:
//
// "Day view" refers to the smallest size, with only the day-of-week and date-of-month number showing.
// "Day/month view" refers to the medium size, which adds a calendar mini-month showing.
// "Day/month/event view" refers to the largest size, which adds a listing of upcoming iCal events.
//
// A "date id" (see idFromMonthDate()) is an html ID of the form "0102" (mmdd) that is used to refer to the
// dynamically-generated selectable calendar days in the grid.
//



var kWidgetDayViewWidth = 167;
var kWidgetDayMonthViewWidth = 333;
var kWidgetDayMonthEventViewWidth = 485;
var kWidgetHeight = 163;
var kEventViewContentHeight = 129;

var kDayViewMiddleContainerWidth = 155;
var kDayViewMiddleFillWidth = 142;
var kDayViewRightContentLeftPosition = 178;

var kDayMonthViewMiddleContainerWidth = 324;
var kDayMonthViewMiddleFillWidth = 311;
var kDayMonthViewRightContentLeftPosition = 151;

var kDayMonthEventViewMiddleContainerWidth = 474;
var kDayMonthEventViewMiddleFillWidth = 461;
var kDayMonthEventViewRightContentLeftPosition = 152;

var kDayView = "kDayView";
var kDayMonthView = "kDayMonthView";
var kDayMonthEventView = "kDayMonthEventView";
var kCurrentViewPrefKey = "currentView";

var gResizeAnimation = {startTime:0, duration:250, positionFrom:0, positionTo:0, positionNow:0, timer:null, elementMiddleContainer:null, elementMiddleFill:null, elementRightSideContent:null, elementMonthContent:null, elementEventContent:null, onfinished:null};
var gDate = new Date ();
var gBroswingJSDate = gDate;
var gBrowsingMonth = gDate.getMonth ();
var gBrowsingYear = gDate.getFullYear ();
var gBrowsingDate = gDate.getDate ();
var gCurrentView = kDayMonthView;
var gUpdateDateTimer = null;
var gButtonBeingTracked = null;
var gWidgetVisible = false;
var gViewChanging = false;

var gEventScrollArea = null;
var gEventScrollBar = null;

var kCFCalendarUnitEra = 1;
var kCFCalendarUnitYear = 2;
var kCFCalendarUnitMonth = 3;
var kCFCalendarUnitDay = 4;
var kCFCalendarUnitHour = 5;
var kCFCalendarUnitMinute = 6;
var kCFCalendarUnitSecond = 7;
var kCFCalendarUnitWeek = 8;
var kCFCalendarUnitWeekday = 9;
var kCFCalendarUnitWeekdayOrdinal = 10;




function keyPressed(e)
{
	if (gCurrentView == kDayMonthView || gCurrentView == kDayMonthEventView)
	{
		if (window.Calendar)
		{
			var mo = new Date(gBrowsingJSDate);
			var dateChanged = false;
			
			switch (e.keyIdentifier) {
				case "Up":
					mo = new Date(Calendar.addDeltaForUnitToDate(-1, kCFCalendarUnitYear, gBrowsingJSDate.getTime()));
					dateChanged = true;
					break;
				
				case "Down":
					mo = new Date(Calendar.addDeltaForUnitToDate(1, kCFCalendarUnitYear, gBrowsingJSDate.getTime()));
					dateChanged = true;
					break;
				
				case "Left":
				case "PageUp":
					mo = new Date(Calendar.addDeltaForUnitToDate(-1, kCFCalendarUnitMonth, gBrowsingJSDate.getTime()));
					dateChanged = true;
					break;
				
				case "Right":
				case "PageDown":
					mo = new Date(Calendar.addDeltaForUnitToDate(1, kCFCalendarUnitMonth, gBrowsingJSDate.getTime()));
					dateChanged = true;
					break;
				
				case "Home":
					mo = new Date();
					dateChanged = true;
					break;
			}
		}
		else
		{
			if (!gBrowsingDate)
				gBrowsingDate = 1;
			
			var mo = new Date(gBrowsingYear, gBrowsingMonth, gBrowsingDate);
			var dateChanged = false;
			
			switch (e.keyIdentifier) {
				case "Up":
					gBrowsingYear--;
					if (gBrowsingYear < 1753)			// assuming current calendar is Gregorian (not necessarily true), this
						gBrowsingYear = 1753;			// prevents incorrect viewing of September 1752 and before, including B.C.
					mo.setFullYear(gBrowsingYear);
					dateChanged = true;
					break;
				
				case "Down":
					gBrowsingYear++;
					mo.setFullYear(gBrowsingYear);
					dateChanged = true;
					break;
				
				case "Left":
				case "PageUp":
					gBrowsingMonth--;
					if (gBrowsingMonth < 0) {
						gBrowsingMonth = 11;
						gBrowsingYear--;
						if (gBrowsingYear < 1753)		// pin backwards monthwise browsing at January 1753; see note above
						{
							gBrowsingMonth = 0;
							gBrowsingYear = 1753;
						}
					}
					mo.setMonth(gBrowsingMonth);
					mo.setFullYear(gBrowsingYear);
					dateChanged = true;
					break;
				
				case "Right":
				case "PageDown":
					gBrowsingMonth++;
					if (gBrowsingMonth > 11) {
						gBrowsingMonth = 0;
						gBrowsingYear++;
					}
					mo.setMonth(gBrowsingMonth);
					mo.setFullYear(gBrowsingYear);
					dateChanged = true;
					break;
				
				case "Home":
					mo = new Date();
					dateChanged = true;
					break;
			}
		}
		
		if (dateChanged)
		{
			// create the new calendar
			if (window.Calendar)
			{
				gBrowsingYear = Calendar.getUnitForDate(kCFCalendarUnitYear, mo.getTime());
				gBrowsingMonth = Calendar.getUnitForDate(kCFCalendarUnitMonth, mo.getTime())-1;
				gBrowsingDate = Calendar.getUnitForDate(kCFCalendarUnitDay, mo.getTime());
			}
			else
			{
				gBrowsingMonth = mo.getMonth ();
				gBrowsingYear = mo.getFullYear ();
				gBrowsingDate = mo.getDate ();
			}
			gBrowsingJSDate = mo;
			
			if (gCurrentView != kDayView)
				drawGrid(gBrowsingJSDate);
			
			gBrowsingDate = 0; // note this makes the id of the form mm00yyyy which doesn't correspond to an HTML id
			
			drawText ();
			
			e.stopPropagation();
			e.preventDefault();
		}
	}
}



function limit_3 (a, b, c)
{
    return a < b ? b : (a > c ? c : a);
}



function computeNextFloat (from, to, ease)
{
    return from + (to - from) * ease;
}



function toggleView (inDoItSlow)
{
	// Don't allow an animation to start if a previous one isn't done.
	if (gViewChanging) return;
	
	gViewChanging = true;
	
	// Update gCurrentView.
	if (gCurrentView == kDayView)
		gCurrentView = kDayMonthView;
	else if (gCurrentView == kDayMonthView)
		gCurrentView = kDayMonthEventView;
	else if (gCurrentView == kDayMonthEventView)
		gCurrentView = kDayView;

	var midContDiv = document.getElementById ("Background-MiddleContainer");
	var midFillDiv = document.getElementById ("Background-MiddleFill");
	
	var rightSideContDiv = document.getElementById ("AllContent-RightSide-Container");
	var monthContDiv = document.getElementById ("AllContent-Month-Container");
	var eventContDiv = document.getElementById ("AllContent-Event-Container");
	
	var timeNow = (new Date).getTime();
	var multiplier = (inDoItSlow ? 10 : 1);							// enable slo-mo
	var startingSize = parseInt (midContDiv.clientWidth, 10);		// actual current size
	var endingSize;

	if (gCurrentView == kDayView) {
		// Don't resize window when shrinking widget.
		endingSize = kDayViewMiddleContainerWidth;
	} else if (gCurrentView == kDayMonthView) {
		endingSize = kDayMonthViewMiddleContainerWidth;
		window.resizeTo(kWidgetDayMonthViewWidth, kWidgetHeight);
	} else if (gCurrentView == kDayMonthEventView) {
		endingSize = kDayMonthEventViewMiddleContainerWidth;
		window.resizeTo(kWidgetDayMonthEventViewWidth, kWidgetHeight);
	}
	
	gResizeAnimation.elementMiddleContainer = midContDiv;			// for referral during animation
	gResizeAnimation.elementMiddleFill = midFillDiv;

	gResizeAnimation.elementRightSideContent = rightSideContDiv;
	gResizeAnimation.elementMonthContent = monthContDiv;
	gResizeAnimation.elementEventContent = eventContDiv;
	
	gResizeAnimation.duration = 250 * multiplier;
	gResizeAnimation.positionFrom = startingSize;
	
	gResizeAnimation.positionTo = endingSize;
	gResizeAnimation.startTime = timeNow - 13;						// set it back one frame
	gResizeAnimation.onfinished = viewDidChange;
	
	gResizeAnimation.timer = setInterval ("toggleViewAnimate();", 13);
	toggleViewAnimate ();
}

function toggleViewAnimate ()
{
	var T;
	var ease;
	var time  = (new Date).getTime();
	var xLoc;
	var frame;
	var rightContentClippingOnItsLeft, rightContentClippingOnItsRight;
	
	// Note: while the resizing of the widget is in motion due to this routine executing, mouseclicks
	// may cause dashboard to be dismissed.  It seems to be due to clicks coming into dashboard while
	// the elements' width are being changed.  This happens whether we set the element.style.width
	// directly or if we use element.style.setProperty().
	
	T = limit_3(time-gResizeAnimation.startTime, 0, gResizeAnimation.duration);
	ease = 0.5 - (0.5 * Math.cos(Math.PI * T / gResizeAnimation.duration));

	if (T >= gResizeAnimation.duration)
	{
		xLoc = gResizeAnimation.positionTo;
		clearInterval (gResizeAnimation.timer);
		gResizeAnimation.timer = null;
		
		if (gResizeAnimation.onfinished)
			setTimeout ("gResizeAnimation.onfinished();", 0); // call after the last frame is drawn
	}
	else
		xLoc = computeNextFloat(gResizeAnimation.positionFrom, gResizeAnimation.positionTo, ease);
	
	// Convert float to integer; old parseInt was like a round-down (floor), now Math.round rounds up:
	//
	gResizeAnimation.positionNow = Math.round(xLoc);
	
	// Affect the graphics to cause a frame of horizontal visual change: the main container that carries
	// with it the right endcap:
	//
	gResizeAnimation.elementMiddleContainer.style.width = gResizeAnimation.positionNow + "px";
	
	// The endcap is in the correct place before/during/after the move, but the background, whose width is
	// otherwise linked to that of the middle container, would be too wide and stick out beyond it (we don't
	// want to define its parent, the middle containter, to be smaller), so adjust it manually:
	//
	gResizeAnimation.elementMiddleFill.style.width = (gResizeAnimation.positionNow - 13) + "px";
	
	// Clip and move the necessary panes so we get a drawer appearance.
	if (gCurrentView == kDayView) {
		// Collapse month and event views simultaneously by clipping and moving them both.
		// Month view.
		gResizeAnimation.elementMonthContent.style.left = (gResizeAnimation.positionNow - 323) + "px";
		rightContentClippingOnItsLeft = kDayMonthEventViewMiddleContainerWidth - gResizeAnimation.positionNow;
		gResizeAnimation.elementMonthContent.style.clip = "rect(0,999,999," + rightContentClippingOnItsLeft + ")";

		// Event view.
		gResizeAnimation.elementEventContent.style.left = (gResizeAnimation.positionNow - 154) + "px";
		rightContentClippingOnItsLeft = 305 - gResizeAnimation.positionNow;
		gResizeAnimation.elementEventContent.style.clip = "rect(0,999,999," + rightContentClippingOnItsLeft + ")";
		
	} else if (gCurrentView == kDayMonthView) {
		// Expand month view.
		gResizeAnimation.elementMonthContent.style.left = (gResizeAnimation.positionNow - 173) + "px";
		rightContentClippingOnItsLeft = kDayMonthViewMiddleContainerWidth - gResizeAnimation.positionNow;
		gResizeAnimation.elementMonthContent.style.clip = "rect(0,999,999," + rightContentClippingOnItsLeft + ")";
	} else if (gCurrentView == kDayMonthEventView) {
		// Expand event view.
		gResizeAnimation.elementEventContent.style.left = (gResizeAnimation.positionNow - 154) + "px";
		rightContentClippingOnItsLeft = kDayMonthEventViewMiddleContainerWidth - gResizeAnimation.positionNow;
		gResizeAnimation.elementEventContent.style.clip = "rect(0,999,999," + rightContentClippingOnItsLeft + ")";
	}
}



function viewDidChange ()
{
	// Set the overall widget's window size so that screen captures, mouseover for the close box, etc, work
	// correctly for the resized widget (for example, don't reference empty space where the expanded view was).
	// We do this when the animation is done, rather than during, for smoothness reasons.  If we expanded then
	// this was already done; if we collapsed then reduce the window size now. We use clipping to simplify animation
	// code elsewhere:
	//
	if (gCurrentView == kDayView) {
		document.getElementById("AllContent-Month-Container").style.clip = "rect(0,0,0,0)";
		window.resizeTo(kWidgetDayViewWidth, kWidgetHeight);
	} else if (gCurrentView == kDayMonthView) {
		document.getElementById("AllContent-Event-Container").style.clip = "rect(0,0,0,0)";
	} else if (gCurrentView == kDayMonthEventView) {
		initEventScrollArea();
		drawUpcomingCalEvents();
	}
	
	gViewChanging = false;
	
	// After a collapse/expand operation we always want to snap back to the current date:
	jumpToToday ();
	drawText ();
	if (window.widget)
		widget.setPreferenceForKey (gCurrentView.toString(), createKey(kCurrentViewPrefKey));
}



function idFromMonthDate (month, dateCount)
{
	return ((month<10) ? "0" + month : month.toString()) + 
	       ((dateCount<10) ? "0" + dateCount : dateCount.toString());
}



function setupWeekHeader ()
//
// Get localized names of the narrow days of the week from the plugin and populate the Expanded View's calendar-grid's header:
//
{
	for (var i = 0;   i <= 6;   i++)
	{
		document.getElementById ("DayOfWeek-" + i).innerText = fetchIPrefNarrowDayOfWeekName (i);
	}
}



function myGetDayFromDate (inDate)
//
// JavaScript's Date.getDay() is Sunday-based, so we have to fix it up.
//
{
	var weekDay;
	if (window.Calendar)
	{
		weekDay = Calendar.getUnitForDate(kCFCalendarUnitWeekday, inDate.getTime())-1;
	}
	else
	{
		weekDay = inDate.getDay();
	}
	var dayIndex = weekDay - fetchIPrefFirstWeekday();
	if (dayIndex < 0)
		dayIndex += 7;
	return dayIndex;
}



function calculateNumberOfDaysInPreviousMonth (inJSDate)
//
// Return the number of days in the month that is previous to the one given, going into the previous year if needed.
//
{
	var returnValue;
	if (window.Calendar)
	{
		var priorMonthDate = new Date(Calendar.addDeltaForUnitToDate(-1, kCFCalendarUnitMonth, inJSDate.getTime()));
		returnValue = Calendar.getLimitOfUnitForBiggerUnitForDate(kCFCalendarUnitDay, kCFCalendarUnitMonth, priorMonthDate.getTime());
	}
	else
	{
		var monthOfInterestYear, monthOfInterestMonth;
		var aTrialDate;
		
		if (inMonth != 0)
		{
			monthOfInterestYear = inYear;
			monthOfInterestMonth = inMonth - 1;
		}
		else
		{
			monthOfInterestYear = inYear - 1;
			monthOfInterestMonth = 11;
		}
		
		aTrialDate = new Date (monthOfInterestYear, monthOfInterestMonth, 1);
		for (var i = 27;   i < 32;   i++)
		{
			aTrialDate.setDate (i);
			if (aTrialDate.getMonth () != monthOfInterestMonth)
				break;
			else
				returnValue = i;
		}
	}
	
	return returnValue;
}



function drawGrid (inJSDate)
//
// Draw the calendar day-names-and-date-numbers grid.
//
{
	var i;
	
	// we will fill this DIV in
	var monthDiv = document.getElementById ("Calendar-NumberGrid");
	
	// show the names of the days of the week
	setupWeekHeader ();
	
	// clear out any old calendar grid numbers out of the DIV
	if (monthDiv.hasChildNodes ())
	{
		var children = monthDiv.childNodes;
		var count = children.length;
		for (i = 0;   i < count;   i++)
		{
			monthDiv.removeChild (children[0]);
		}
	}
	
	// create the month grid, filling the DIV
	if (window.Calendar)
	{
		var dateForOurMonth = new Date(Calendar.firstDayOfMonthForDate(inJSDate.getTime()));
		var zeroBasedFirstDayOfWeekInOurMonth = myGetDayFromDate (dateForOurMonth);
		var numberOfDaysInPreviousMonth = calculateNumberOfDaysInPreviousMonth (inJSDate);
		var workingDate = new Date(Calendar.addDeltaForUnitToDate(-zeroBasedFirstDayOfWeekInOurMonth, kCFCalendarUnitDay, dateForOurMonth.getTime()));
		var ourMonth = Calendar.getUnitForDate(kCFCalendarUnitMonth, dateForOurMonth.getTime())-1;
		for (i = 0;   i < 42;   i++)
		{
			var dateSpan = document.createElement ("span");
			
			var date = Calendar.getUnitForDate(kCFCalendarUnitDay, workingDate.getTime());
			var dateString = Calendar.getUnitForDateAsString(kCFCalendarUnitDay, workingDate.getTime());
			dateSpan.innerHTML = dateString;
			if (i < zeroBasedFirstDayOfWeekInOurMonth)
			{
				// show dimmed numbers of the (final days of the previous month) before the begin of our month
				dateSpan.setAttribute ("class", "calendar-dayOfMonthNumberDimmed");
			}
			else
			{
				if (ourMonth != Calendar.getUnitForDate(kCFCalendarUnitMonth, workingDate.getTime())-1)
				{
					// show dimmed numbers of the (first days of the next month) after the end of our month
					dateSpan.setAttribute ("class", "calendar-dayOfMonthNumberDimmed");
				}
				else
				{
					// show normal numbers of the days in our month
					// they are clickable: they trigger event handlers when clicked and have
					// a formatted setting for the ID attribute that is used by the even handler to identify the date
					dateSpan.setAttribute ("class", "calendar-dayOfMonthNumberNormal");
					dateSpan.setAttribute ("id", idFromMonthDate (ourMonth, date));
					dateSpan.setAttribute("onmousedown", "selectDate(event, this.id);");
					dateSpan.setAttribute("onkeydown", "selectDate(event, this.id);");
					
					// increment: bump the valid date number in our month and bump the special date we are using to see
					// when our main loop goes beyond the number of days in our month
				}
			}
			
			monthDiv.appendChild (dateSpan);
			workingDate = new Date(Calendar.addDeltaForUnitToDate(1, kCFCalendarUnitDay, workingDate.getTime()));
		}
	}
	else
	{
		var dateNumberThatIsValidInOurMonth = 1;
		var ourMonth = inJSDate.getMonth();
		var dateToCheckDayRangeInOurMonth = new Date (inJSDate.getYear(), ourMonth, dateNumberThatIsValidInOurMonth);
		var zeroBasedFirstDayOfWeekInOurMonth = myGetDayFromDate (dateToCheckDayRangeInOurMonth);
		var numberOfDaysInPreviousMonth = calculateNumberOfDaysInPreviousMonth (inJSDate);
		var dateNumberThatIsValidInNextMonth = 1;
		for (i = 0;   i < 42;   i++)
		{
			var dateSpan = document.createElement ("span");
			
			if (i < zeroBasedFirstDayOfWeekInOurMonth)
			{
				// show dimmed numbers of the (final days of the previous month) before the begin of our month
				dateSpan.innerHTML = (numberOfDaysInPreviousMonth - zeroBasedFirstDayOfWeekInOurMonth) + i + 1;
				dateSpan.setAttribute ("class", "calendar-dayOfMonthNumberDimmed");
				
				// increment: we are waiting for the main loop index (i) to get into range of our month, so do nothing else
			}
			else
			{
				if (dateToCheckDayRangeInOurMonth.getMonth () != ourMonth)
				{
					// show dimmed numbers of the (first days of the next month) after the end of our month
					dateSpan.innerHTML = dateNumberThatIsValidInNextMonth;
					dateSpan.setAttribute ("class", "calendar-dayOfMonthNumberDimmed");
					
					// increment: only the simple 1,2,3... number of next month now that we are in the beyond-state
					dateNumberThatIsValidInNextMonth++;
				}
				else
				{
					// show normal numbers of the days in our month
					// they are clickable: they trigger event handlers when clicked and have
					// a formatted setting for the ID attribute that is used by the even handler to identify the date
					dateSpan.innerHTML = dateNumberThatIsValidInOurMonth;
					dateSpan.setAttribute ("class", "calendar-dayOfMonthNumberNormal");
					dateSpan.setAttribute ("id", idFromMonthDate (ourMonth, dateNumberThatIsValidInOurMonth));
					dateSpan.setAttribute("onmousedown", "selectDate(event, this.id);");
					dateSpan.setAttribute("onkeydown", "selectDate(event, this.id);");
					
					// increment: bump the valid date number in our month and bump the special date we are using to see
					// when our main loop goes beyond the number of days in our month
					dateNumberThatIsValidInOurMonth++;
					dateToCheckDayRangeInOurMonth.setDate (dateNumberThatIsValidInOurMonth);
				}
			}
			
			monthDiv.appendChild (dateSpan);
		}
	}

	drawHiliteTodayInGrid ();
}



function changeMonth (inEvent, inMoveNext)
{
	if (window.Calendar)
	{
		if (inMoveNext)
		{
			gBrowsingJSDate = new Date(Calendar.addDeltaForUnitToDate(1, kCFCalendarUnitMonth, gBrowsingJSDate.getTime()));
		}
		else
		{
			gBrowsingJSDate = new Date(Calendar.addDeltaForUnitToDate(-1, kCFCalendarUnitMonth, gBrowsingJSDate.getTime()));
		}
		gBrowsingYear = Calendar.getUnitForDate(kCFCalendarUnitYear, gBrowsingJSDate.getTime());
		gBrowsingMonth = Calendar.getUnitForDate(kCFCalendarUnitMonth, gBrowsingJSDate.getTime())-1;
	}
	else
	{
		if (inMoveNext)
		{
			gBrowsingMonth++;
			if (gBrowsingMonth > 11)
			{
				gBrowsingMonth = 0;
				gBrowsingYear++;
			}
		}
		else
		{
			gBrowsingMonth--;
			if (gBrowsingMonth < 0)
			{
				gBrowsingMonth = 11;
				gBrowsingYear--;
				if (gBrowsingYear < 1753)		// pin backwards monthwise browsing at January 1753; see note above
				{
					gBrowsingMonth = 0;
					gBrowsingYear = 1753;
				}
			}
		}
		gBrowsingJSDate = new Date (gBrowsingYear, gBrowsingMonth, gBrowsingDate);
	}

	// create the new calendar
	drawGrid (gBrowsingJSDate);

	gBrowsingDate = 0; // clear the selected date

	drawText ();
}



function drawHiliteTodayInGrid ()
//
// If the current calendar-grid being shown is of the now-month-and-year, highlight the corresponding date-number in it.
// This shows to the user that today's date is in there.  Otherwise, don't, ie, if the user is browsing into
// other months.
//
{
	var thisYear;
	var thisMonth;
	var thisDate;
	if (window.Calendar)
	{
		thisYear = Calendar.getUnitForDate(kCFCalendarUnitYear, gDate.getTime());
		thisMonth = Calendar.getUnitForDate(kCFCalendarUnitMonth, gDate.getTime())-1;
		thisDate = Calendar.getUnitForDate(kCFCalendarUnitDay, gDate.getTime());
	}
	else
	{
		thisYear = gDate.getFullYear();
		thisMonth = gDate.getMonth();
		thisDate = gDate.getDate();
	}
	if ((gBrowsingYear == thisYear) &&  (gBrowsingMonth == thisMonth))
	{
		var todayCalendarNumbersGridElement = document.getElementById (idFromMonthDate (thisMonth, thisDate));
		todayCalendarNumbersGridElement.setAttribute ("class", "calendar-dayOfMonthNumberHighlighted");
	}
}



function jumpToToday (inEvent)
{
	gDate = new Date ();
	gBrowsingJSDate = gDate;
	if (window.Calendar)
	{
		gBrowsingYear = Calendar.getUnitForDate(kCFCalendarUnitYear, gBrowsingJSDate.getTime());
		gBrowsingMonth = Calendar.getUnitForDate(kCFCalendarUnitMonth, gBrowsingJSDate.getTime())-1;
		gBrowsingDate = Calendar.getUnitForDate(kCFCalendarUnitDay, gBrowsingJSDate.getTime());
	}
	else
	{
		gBrowsingMonth = gDate.getMonth ();
		gBrowsingYear = gDate.getFullYear ();
		gBrowsingDate = gDate.getDate ();
	}

	if (gCurrentView != kDayView)
		drawGrid (gBrowsingJSDate);

	drawText ();
}



function selectDate (inEvent, inID)
//
// Can be used to take action when a date is clicked upon.
//
{
}



function fetchIPrefFirstWeekday () // returns integer
//
// Fetch data from this widget's plugin, from International Prefs.  Do fallback work if no plugin available.
//
// Get the first-day-of-week, 0-based index.
//
{
	if (window.Calendar)				// plugin available, and if plugin error will return 0
	{
		return Calendar.firstWeekday ();
	}
	else								// fallback case for if no plugin or plugin error
	{
		return 0;
	}
}



function fetchIPrefNarrowDayOfWeekName (inDayOfWeekIndex) // returns string
//
// Fetch data from this widget's plugin, from International Prefs.  Do fallback work if no plugin available.
//
// Get the (localized customized in International Pref Pane) "narrow" day-of-week, which is usually a single
// character such as "S" for Sunday, etc.  The inDayOfWeek input is zero-based and follows USA first-day-of-week
// conventions, even if the first-day-of-week is not Sunday for the current localized settings.  Thus: 0=Sunday,
// 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, and 6=Saturday, in a single-character format.
//
{
	var returnString = undefined;
	
	if (window.Calendar)				// plugin available: attempt to fill the string; will fill with undefined if plugin error
	{
		returnString = Calendar.localizedNarrowDayOfWeekNameForIndex (inDayOfWeekIndex);
	}
	
	if (returnString == undefined)		// still undefined: fallback if plugin unvailable or plugin returned null (plugin error)
	{
		switch (inDayOfWeekIndex)
		{
			case 0:   returnString = "S";   break;
			case 1:   returnString = "M";   break;
			case 2:   returnString = "T";   break;
			case 3:   returnString = "W";   break;
			case 4:   returnString = "T";   break;
			case 5:   returnString = "F";   break;
			case 6:   returnString = "S";   break;
		}
	}
	
	return returnString;
}



function fetchIPrefLongMixedcaseDayOfWeekName (inDayOfWeekIndex) // returns string
//
// Fetch data from this widget's plugin, from International Prefs.  Do fallback work if no plugin available.
//
// Get the (localized customized in International Pref Pane) mixed-case long day name,
// zero-based.  For example, 0="Sunday", 1="Monday", etc.
//
{
	var returnString = undefined;
	
	if (window.Calendar)				// plugin available: attempt to fill the string; will fill with undefined if plugin error
	{
		returnString = Calendar.localizedWideDayOfWeekNameForIndex (inDayOfWeekIndex);
	}
	
	if (returnString == undefined)		// still undefined: fallback if plugin unvailable or plugin returned null (plugin error)
	{
		switch (inDayOfWeekIndex)
		{
			case 0:   returnString = "Sunday";		break;
			case 1:   returnString = "Monday";		break;
			case 2:   returnString = "Tuesday";		break;
			case 3:   returnString = "Wednesday";	break;
			case 4:   returnString = "Thursday";	break;
			case 5:   returnString = "Friday";		break;
			case 6:   returnString = "Saturday";	break;
		}
	}
	
	return returnString;
}



function fetchIPrefLongMonthNameAndYearNumber (inDate) // returns string
//
// Fetch data from this widget's plugin, from International Prefs.  Do fallback work if no plugin available.
//
// Get the (localized customized in International Pref Pane) combined string of the form "January 1900", that is,
// the long mixed-case month name followed by a 4-digit year number (for most locales) and a reversed or otherwise
// modified version of the same (for other locales).
//
{
	var returnString = undefined;
	
	if (window.Calendar)				// plugin available: attempt to fill the string; will fill with undefined if plugin error
	{
		returnString = Calendar.localizedWideMonthNameAndYearNumberForDate (inDate.getTime());
	}
	
	if (returnString == undefined)		// still undefined: fallback if plugin unvailable or plugin returned null (plugin error)
	{
		switch (inDate.getMonth())
		{
			case 0:    returnString = "January";		break;
			case 1:    returnString = "February";		break;
			case 2:    returnString = "March";			break;
			case 3:    returnString = "April";			break;
			case 4:    returnString = "May";			break;
			case 5:    returnString = "June";			break;
			case 6:    returnString = "July";			break;
			case 7:    returnString = "August";			break;
			case 8:    returnString = "September";		break;
			case 9:    returnString = "October";		break;
			case 10:   returnString = "November";		break;
			case 11:   returnString = "December";		break;
		}
		returnString = returnString + " " + inDate.getYear().toString ();
	}
	
	return returnString;
}



function setFontSizeToFitAndCenter (inElement, inStartingFontSize, inLeft, inStartingTop, inMaxWidth, inMaxHeight)
//
// Sets the font size of the given element, while trying to ensure that the string contained within that
// element fits without clipping or spilling in the given width/height pixel size.
//
// The starting font size and top position parameters are given by the caller so that the setting always
// proceeds from an absolute basis.  If the requested font size cannot be honored, then the font size and
// top position in the element are repeatedly adjusted until the element's inner text fits (up to a limit).
//
// NOTE: The CSS declaration for the given element must not have explicitly specified a "width" property.
// NOTE: The height parameter is useful even for "single line" cases to prevent wrapping to an undesired
// additional line.
//
{
	var measuredWidth;
	var measuredHeight;
	var newFontSize = inStartingFontSize;
	var newTop = inStartingTop;
	var numReductions = 0;
	
	while (1)
	{
		inElement.style.setProperty ("font-size", newFontSize + "px", "important");
		inElement.style.setProperty ("top", newTop + "px", "important");
		measuredWidth = parseInt (document.defaultView.getComputedStyle (inElement, null).getPropertyValue ("width"), 10);
		measuredHeight = parseInt (document.defaultView.getComputedStyle (inElement, null).getPropertyValue ("height"), 10);
		inElement.style.setProperty ("left", inLeft + (inMaxWidth / 2) - (measuredWidth / 2) + "px", "important");
		if ((measuredWidth > inMaxWidth) || (measuredHeight > inMaxHeight))
		{
			if (newFontSize <= 6)
			{
				// this is the limit of of how small we will make it:
				break;
			}
			// adjust the size, then loop around one more time to set it; after a
			// few iterations, slow down the vertical adjustment a bit to better
			// track smaller font sizes' change; ideally this would be measured:
			numReductions++;
			newFontSize -= 1;
			if (numReductions <= 4) newTop += 1; else newTop += 0.8;
		}
		else
		{
			// this is where we exit if the size is acceptable:
			break;
		}
	}
}



function setFontSizeToFitAndCenterFix (inElement, inStartingFontSize, inLeft, inStartingTop, inMaxWidth, inMaxHeight)
//
// This is a workaround for a possible quirk with text measurement.  It is desirable to fix the
// underlying problem rather than rely on the loop below, because the change causes a visible size
// change in the text size, yet keeping it hidden and having a setTimeout proc to enable visibility
// clutters our code and causes flashing while browsing.  The problem is that in setFontSizeToFit, the
// getComputedStyle (inElement, null).getPropertyValue ("width") returns a different (smaller) value
// the first time than subsequent times.  This has to do with when things are rendered async; maybe
// set a proc to be called upon render completion?
//
{
	for (var i = 1;   i <= 3;   i++)
	{
		setFontSizeToFitAndCenter (inElement, inStartingFontSize, inLeft, inStartingTop, inMaxWidth, inMaxHeight);
	}
}



function drawText ()
//
// Updates the non-calendar-grid text strings such as the (day-name), (day-of-month-number), and (monthname+yearnumber).
//
{
	var dayOfWeekNameElement			= document.getElementById ("Message-DayOfWeekName");
	var dateOfMonthNumberElement		= document.getElementById ("Message-DateOfMonthNumber");
	var monthNameAndYearNumberElement	= document.getElementById ("Message-MonthNameAndYearNumber");
	var dateNumber;
	
	// This is, ie, "Wednesday" (the day-of-week name) on the left side; it always reflects the current time.
	// We do shrink-to-fit if needed: in some locales, this string can grow quite long:
	//
	dayOfWeekNameElement.innerText = fetchIPrefLongMixedcaseDayOfWeekName (myGetDayFromDate (gDate));
	setFontSizeToFitAndCenterFix (dayOfWeekNameElement,
						/* starting font size: */		18,
						/* starting left position: */	7,
						/* starting top position: */	9,
						/* max width: */				134,
						/* max height: */				25);

	// This is, ie, "31" (the big date number) on the left side; it always reflects the current time.
	// We dynamically adjust details of position and kerning to get the big huge number to look right:
	//
	if (window.Calendar)
	{
		dateNumber = Calendar.getUnitForDateAsString(kCFCalendarUnitDay, gDate.getTime());
	}
	else
	{
		dateNumber = gDate.getDate ();
	}
	dateOfMonthNumberElement.innerText = dateNumber;
	if (dateNumber <= 9) dateOfMonthNumberElement.setAttribute ("class", "message-dateOfMonthNumber-style1to9");
	else
	if (dateNumber == 10) dateOfMonthNumberElement.setAttribute ("class", "message-dateOfMonthNumber-style10to10");
	else
	if (dateNumber == 11) dateOfMonthNumberElement.setAttribute ("class", "message-dateOfMonthNumber-style11to11");
	else
	if ((dateNumber >= 12) && (dateNumber <= 19)) dateOfMonthNumberElement.setAttribute ("class", "message-dateOfMonthNumber-style12to19");
	else
	if (dateNumber == 20) dateOfMonthNumberElement.setAttribute ("class", "message-dateOfMonthNumber-style20to20");
	else
	if (dateNumber == 21) dateOfMonthNumberElement.setAttribute ("class", "message-dateOfMonthNumber-style21to21");
	else
	if ((dateNumber >= 22) && (dateNumber <= 26)) dateOfMonthNumberElement.setAttribute ("class", "message-dateOfMonthNumber-style22to26");
	else
	if ( dateNumber == 27) dateOfMonthNumberElement.setAttribute ("class", "message-dateOfMonthNumber-style27to27");
	else
	if ((dateNumber >= 28) && (dateNumber <= 29)) dateOfMonthNumberElement.setAttribute ("class", "message-dateOfMonthNumber-style28to29");
	else
	if (dateNumber == 30) dateOfMonthNumberElement.setAttribute ("class", "message-dateOfMonthNumber-style30to30");
	else
	if (dateNumber == 31) dateOfMonthNumberElement.setAttribute ("class", "message-dateOfMonthNumber-style31to31");
	
	// This is, ie, "January 1900" (the month + year combination) on the right side; it reflects what is currently being browsed.
	// We do shrink-to-fit if needed: in some locales, this string can grow quite long:
	//
	monthNameAndYearNumberElement.innerText = fetchIPrefLongMonthNameAndYearNumber (gBrowsingJSDate);
	setFontSizeToFitAndCenterFix (monthNameAndYearNumberElement,
						/* starting font size: */		12,
						/* starting left position: */	23,
						/* starting top position: */	9,
						/* max width: */				120,
						/* max height: */				25);
}



function getButtonPathFileFromIdState (inId, inShowAsPressed)
{
	var outName = undefined;
	
	if ("Button-Left"  == inId) outName = "bar_left";
	if ("Button-Right" == inId) outName = "bar_right";
	
	if (true == inShowAsPressed) outName += "_pressed";
	
	outName = "Images/" + outName + ".png";
	
	return outName;
}



function mouseDownForButton (inEvent, inThis)
{
	inEvent.target.src = getButtonPathFileFromIdState (inThis.id, true);
	inEvent.stopPropagation();
	inEvent.preventDefault();
	document.addEventListener ("mouseup", mouseUpForButtonsInsideOutside, true);
	gButtonBeingTracked = inThis;
}



function mouseUpForButtonsInsideOutside (inEvent)
{
	// we use this event listener for the global document instead of an event handler on the button <IMG> so
	// that we can know to stop the tracking process even if the mouseup happens outside of the button
	
	if (null != gButtonBeingTracked)
		gButtonBeingTracked.src = getButtonPathFileFromIdState (gButtonBeingTracked.id, false);
	
	// note that inEvent.target will point to the IMG object only if this is a mouseup inside the button,
	// and also make sure we don't respond to mouseup in another button, hence the extra check for this
	// event being inside the button being tracked
	
	if (inEvent.target == gButtonBeingTracked)
	{
		if (inEvent.target.id == "Button-Left")
		{
			changeMonth(inEvent, false);
		}
		else if (inEvent.target.id == "Button-Right")
		{
			changeMonth(inEvent, true);
		}
	}
	
	inEvent.stopPropagation();
	inEvent.preventDefault();
	
	document.removeEventListener ("mouseup", mouseUpForButtonsInsideOutside, true);
	gButtonBeingTracked = null;
}



function mouseOutForButton (inEvent, inThis)
{
	inEvent.target.src = getButtonPathFileFromIdState (inThis.id, false);
}



function mouseOverForButton (inEvent, inThis)
{
	if (inThis == gButtonBeingTracked)
		inEvent.target.src = getButtonPathFileFromIdState (inThis.id, true);
}



function onRequestClickOnLeftSide (inEvent)
{
	toggleView (inEvent.shiftKey);
}



function onRequestClickedMonthNameAndYearNumber (inEvent)
{
	jumpToToday (inEvent);
}



function setupUpdateTimer ()
{
	if (gUpdateDateTimer != null)
	{
		clearTimeout (gUpdateDateTimer);
		gUpdateDateTimer = null;
	}
		
	// create a new timer for when we need to update the date
	var hourMillis = ((23 - gDate.getHours()) * 3600000);
	var minsMillis = ((59 - gDate.getMinutes()) * 60000);
	var secsMillis = ((60 - gDate.getSeconds()) * 1000); // overshoot a second
	var millisRemaining = hourMillis + minsMillis + secsMillis;
	
	gUpdateDateTimer = setTimeout("updateDate();", millisRemaining);
}



function updateDate ()
{
	var currentEqualDate;
	currentEqualDate = gDate == gBrowsingJSDate;
	gDate = new Date();
	
	if (currentEqualDate)
	{
		// only change the current vars if they matched the date
		// before it was updated
		if (window.Calendar)
		{
			gBrowsingYear = Calendar.getUnitForDate(kCFCalendarUnitYear, gDate.getTime());
			gBrowsingMonth = Calendar.getUnitForDate(kCFCalendarUnitMonth, gDate.getTime())-1;
			gBrowsingDate = Calendar.getUnitForDate(kCFCalendarUnitDay, gDate.getTime());
		}
		else
		{
			gBrowsingMonth = gDate.getMonth ();
			gBrowsingYear = gDate.getFullYear ();
			gBrowsingDate = gDate.getDate ();
		}
		gBrowsingJSDate = gDate;
	}
	else if (window.Calendar)
	{
		// Update these in case of calendar change
		gBrowsingYear = Calendar.getUnitForDate(kCFCalendarUnitYear, gBrowsingJSDate.getTime());
		gBrowsingMonth = Calendar.getUnitForDate(kCFCalendarUnitMonth, gBrowsingJSDate.getTime())-1;
		gBrowsingDate = Calendar.getUnitForDate(kCFCalendarUnitDay, gBrowsingJSDate.getTime());
	}

	if (gWidgetVisible)
	{
		if (gCurrentView != kDayView)
			drawGrid (gBrowsingJSDate); 

		drawText ();
	}

	// reset the timer
	setupUpdateTimer();
}



function updateCalendarEvents ()
{
	if ( gWidgetVisible )
		if ( gCurrentView == kDayMonthEventView )
			drawUpcomingCalEvents ();
}



function onPluginNotify ()
{
	// refresh the date, because the plugin is notifying us that date and/or format changed
	
	// note that onshow might also do this so multiple updates could happen but that is OK for now; having
	// the notify come from the plugin covers cases where the date is changed on us while the dashboard is
	// active and frontmost (remote login or another widget changing the date); further, it causes the date
	// to not "jump" from old to new if it WAS a case of the date changing while dashboard was frontmost

	updateDate ();
	updateCalendarEvents ();
}



function onshow ()
{
	gWidgetVisible = true;

	// start watching for calendar changes since we're now visible
	// this also marks the cal store as needing an update, since things might have changed while hidden

	Calendar.startListeningForChanges();

	// refresh the date, in case it changed while the dashboard was inactive or hidden

	// note that onPluginNotify might also do this so multiple updates can happen but that is OK for now;
	// having the notify be handled here besides just relying on the plugin is good because the plugin
	// might not be installed

	updateDate ();
	updateCalendarEvents ();
}



function onhide ()
{
	gWidgetVisible = false;

	// stop listening to calendar changes since we're not visible
	Calendar.stopListeningForChanges();

	if (gUpdateDateTimer)
	{
		clearTimeout(gUpdateDateTimer);
		gUpdateDateTimer = null;
	}
}



function onLoaded ()
{
	// Obtain pointers to some HTML elements:
	//
	var midContDiv = document.getElementById ("Background-MiddleContainer");
	var midFillDiv = document.getElementById ("Background-MiddleFill");
	var monthContDiv = document.getElementById ("AllContent-Month-Container");
	var leftButtonImg = document.getElementById ("Button-Left");
	var rightButtonImg = document.getElementById ("Button-Right");
	
	// Add some ALT tags so that an alternative view of the widget can work: for example, VoiceOver
	// can speak the names of items like button images:
	//
	leftButtonImg.setAttribute ("alt", getLocalizedString ("Previous Month Button"));
	rightButtonImg.setAttribute ("alt", getLocalizedString ("Next Month Button"));
	
	// Register for notifications:
	//
	if (window.widget)
	{
		widget.onhide = onhide;
		widget.onshow = onshow;
	}
	
	// Obtain persistent pref settings; default to day/month view if no pref
	// defined or if pref value is undefined.
	var viewSize = "expanded";
	if (window.widget)
	{
		// Upgrade preference key from the old key, if it exists.
		var oldPref = widget.preferenceForKey(createKey("collapsed"));
		if (oldPref != undefined) {
			if (oldPref == "true")
				gCurrentView = kDayView;
			else
				gCurrentView = kDayMonthView;
			widget.setPreferenceForKey(null, createKey("collapsed"));
		} else {
			// Get preference value from new key.
			var pref = widget.preferenceForKey(createKey(kCurrentViewPrefKey));
			if (gCurrentView == undefined || (pref != kDayView && pref != kDayMonthView && pref != kDayMonthEventView)) {
				gCurrentView = kDayMonthView;
				widget.setPreferenceForKey(gCurrentView, createKey(kCurrentViewPrefKey));
			} else {
				gCurrentView = pref;
			}
		}
	}
	
	// Initialize gCurrentView, the middle container div size, the middle container div's background fill size,
	// and the total window size:
	//
	if (gCurrentView == kDayView) {
		midContDiv.style.width = kDayViewMiddleContainerWidth + "px";
		midFillDiv.style.width = kDayViewMiddleFillWidth + "px";
		monthContDiv.style.left = kDayViewRightContentLeftPosition + "px";
		
		window.resizeTo(kWidgetDayViewWidth, kWidgetHeight);
	} else if (gCurrentView == kDayMonthView) {
		midContDiv.style.width = kDayMonthViewMiddleContainerWidth + "px";
		midFillDiv.style.width = kDayMonthViewMiddleFillWidth + "px";
		monthContDiv.style.left = kDayMonthViewRightContentLeftPosition + "px";

		window.resizeTo(kWidgetDayMonthViewWidth, kWidgetHeight);
	} else if (gCurrentView == kDayMonthEventView) {
		midContDiv.style.width = kDayMonthEventViewMiddleContainerWidth + "px";
		midFillDiv.style.width = kDayMonthEventViewMiddleFillWidth + "px";
		monthContDiv.style.left = kDayMonthEventViewRightContentLeftPosition + "px";

		window.resizeTo(kWidgetDayMonthEventViewWidth, kWidgetHeight);
	}
	viewDidChange();
	
	// Draw things, except events (they may take time to retrieve and must be drawn from viewDidChange):
	//
	if (gCurrentView != kDayView)
		drawGrid (gBrowsingJSDate);

	drawText ();
	
	// Register our keypress handler:
	//
	document.addEventListener ("keypress", keyPressed, true);
}

function initEventScrollArea ()
{
	if(!gEventScrollArea)
	{
		gEventScrollBar = new AppleVerticalScrollbar (document.getElementById ("AllContent-Event-Scrollbar"));

		//custom images. Set image offset because unlike default images, no alpha on either side
		gEventScrollBar.setTrackStart ("Images/scrollbar/topcap.png", 9);
		gEventScrollBar.setTrackMiddle ("Images/scrollbar/mid.png");
		gEventScrollBar.setTrackEnd ("Images/scrollbar/bottomcap.png", 9);

		gEventScrollBar._track.children[0].style["background-position"] = "1px 0";
		gEventScrollBar._track.children[1].style["background-position"] = "1px 0";
		gEventScrollBar._track.children[2].style["background-position"] = "1px 0";

		gEventScrollArea = new AppleScrollArea (document.getElementById ("AllContent-Event-ScrollArea"), gEventScrollBar);
	}
}

function drawUpcomingCalEvents ()
{
	var eventArea = document.getElementById("AllContent-Events");
	
	if (window.Calendar) {
		Calendar.loadUpcomingCalEvents();
		
		numUpcomingCalEvents = Calendar.numUpcomingCalEvents();

		if (numUpcomingCalEvents > 0) {
			var previousHTML = "";
			eventArea.innerHTML = "";
			for (var i = 0; i < numUpcomingCalEvents; ++i) {
				eventArea.innerHTML += Calendar.htmlForUpcomingCalEventAtIndex(i);
			}
			gEventScrollArea.refresh();
		} else {
			// No upcoming events.
			eventArea.innerHTML =
				'<div class="eventBody" id="noEvents"><a href="javascript:openICal();">' + getLocalizedString("There are no upcoming events in iCal today.") + '</a></div>';
		}
	}
}


function openICal ()
{
	widget.openApplication("com.apple.iCal");
}


function viewICalAtCurrentDate ()
{
	var script;
	script = "tell application \"iCal\"\n"
			 + "	view calendar at current date\n"
			 + "end tell";
	
	openICal ();
	runAppleScript (script);
}


function runAppleScript (script)
{
	if (window.widget) {
		var escapedScript = script.replace(/\'/, /\\\'/); //'
		widget.system("/usr/bin/osascript -e '" + escapedScript + "'", null);
	}
}


function onremove ()
{
	if (window.Calendar)
		Calendar.stopListeningForChanges();

	widget.setPreferenceForKey (null, createKey(kCurrentViewPrefKey));
}


function createKey (key)
{
	return widget.identifier + "-" + key;
}



function getLocalizedString (inKey)
{
	try
	{
		var outString = localizedStrings [inKey];
		if (outString == undefined) return inKey;
		return outString;
	}
	catch (ex)
	{}
	
	return inKey;
}



if (window.widget)
{
	widget.onremove = onremove;
}
