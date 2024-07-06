document.addEventListener("DOMContentLoaded", function () {
	//let eventsData = "/data.json";

	let eventsData = localStorage.getItem("events")
		? JSON.parse(localStorage.getItem("events"))
		: [];

	console.log("Loaded events from localStorage:", eventsData);
	let calendarEl = document.getElementById("calendar");
	let calendar = new FullCalendar.Calendar(calendarEl, {
		editable: true,
		droppable: true,
		selectable: true,
		selectHelper: true,
		dateClick: function (info) {
			console.log(info);

			alert("clicked " + info.dateStr);
		},
		select: function (info) {
			alert("selected " + info.startStr + " to " + info.endStr);
		},

		initialView: "dayGridMonth",
		headerToolbar: {
			start: "dayGridMonth,timeGridWeek,timeGridDay addEventButton",
			center: "title",
			end: "custom2 prevYear,prev,next,nextYear",
		},
		titleFormat: {
			year: "numeric",
			month: "short",
			day: "numeric",
		},
		buttonIcons: {
			prev: "chevron-left",
			next: "chevron-right",
		},
		customButtons: {
			addEventButton: {
				text: "Add new Event!",
				click: function () {
					// Display the popup
					document.getElementById("popup").style.display = "block";
				},
			},
			custom2: {
				text: "custom2!",
				click: function () {
					alert("clicked the custom button 2!");
				},
			},
		},
		events: function (info, successCallback, failureCallback) {
			console.log("Loading events into calendar:", eventsData);
			successCallback(eventsData);
			/*fetch(eventsData)
				.then(function (resp) {
					return resp.json();
				})
				.then(function (data) {
					console.log(data);
					let events = data.events.map(function (event) {
						return {
							title: event.eventTitle,
							start: event.eventStartDate,
							end: event.eventEndDate,
						};
					});
					console.log(events);
					successCallback(events);
				});*/
		},
		eventColor: "#378006",
		backgroundColor: "#378006",
		textColor: "#378006",
		eventClick: function (info) {
			console.log(info.event);
		},
	});

	calendar.render();

	// close popup
	document
		.getElementById("closePopupBtn")
		.addEventListener("click", function () {
			document.getElementById("popup").style.display = "none";
		});

	// Handle form submission
	document
		.getElementById("eventForm")
		.addEventListener("submit", function (event) {
			event.preventDefault();

			// Get title and date from inputs
			const eventTitle = document.getElementById("eventTitle").value;
			const startDate = document.getElementById("startDate").value;
			const endDate = document.getElementById("endDate").value;

			/*// Display event
			console.log({
				eventTitle: eventTitle,
				eventStartDate: eventDate,
			});

			// Add event to calendar
		calendar.addEvent({
				title: eventTitle,
				start: eventDate,
			});*/

			const newEvent = {
				title: eventTitle,
				start: startDate,
				end: endDate,
				editable: true,
			};

			// to show event immediately in UI
			calendar.addEvent(newEvent);

			eventsData.push(newEvent);

			localStorage.setItem("events", JSON.stringify(eventsData));

			// Hide the popup
			document.getElementById("popup").style.display = "none";

			// Clear the form
			document.getElementById("eventForm").reset();
		});

	// Optional: Hide the popup when clicking outside of it
	window.onclick = function (event) {
		const popup = document.getElementById("popup");
		if (event.target === popup) {
			popup.style.display = "none";
		}
	};
});
