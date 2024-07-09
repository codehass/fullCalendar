document.addEventListener("DOMContentLoaded", function () {
	let eventsData = localStorage.getItem("events")
		? JSON.parse(localStorage.getItem("events"))
		: [];

	let calendarEl = document.getElementById("calendar");
	let calendar = new FullCalendar.Calendar(calendarEl, {
		editable: true,
		droppable: true,
		selectable: true,
		selectHelper: true,
		eventClick: function (info) {
			let eventObj = info.event;

			// get event details
			document.getElementById("eventTitle").value = eventObj.title;
			document.getElementById("startDate").value = eventObj.start
				.toISOString()
				.slice(0, 16);
			document.getElementById("endDate").value = eventObj.end
				? eventObj.end.toISOString().slice(0, 16)
				: "";
			document.getElementById("popup").style.display = "block";
			document.getElementById("eventForm").dataset.eventId = eventObj.id;

			// Change button text to "Edit Event" and show the delete button
			document.getElementById("submitBtn").innerText = "Edit Event";
			document.getElementById("deleteBtn").style.display = "inline-block";
		},
		select: function (info) {
			let popup = document.getElementById("popup");
			if (popup) {
				popup.style.display = "block";
				let startDateInput = document.getElementById("startDate");
				let endDateInput = document.getElementById("endDate");

				if (startDateInput && endDateInput) {
					startDateInput.value = formatDateTimeLocal(info.start);
					endDateInput.value = formatDateTimeLocal(info.end);
				}

				// Clear the form for new event
				document.getElementById("eventTitle").value = "";
				document.getElementById("eventForm").dataset.eventId = "";
				document.getElementById("submitBtn").innerText = "Add Event";
				document.getElementById("deleteBtn").style.display = "none";
			}
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
					let startHour = new Date();
					let endHour = new Date(startHour.getTime() + 60 * 60 * 1000);

					// Clear form for new event
					document.getElementById("eventForm").reset();
					document.getElementById("startDate").value =
						formatDateTimeLocal(startHour);
					document.getElementById("endDate").value =
						formatDateTimeLocal(endHour);
					document.getElementById("popup").style.display = "block";
					document.getElementById("submitBtn").innerText = "Add Event";
					document.getElementById("deleteBtn").style.display = "none";
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
			successCallback(eventsData);
		},
		/*eventColor: "#378006",
		backgroundColor: "#378006",
		textColor: "#378006",*/
		// eventBackgroundColor: "red",
		// eventColor: "yellow",
		// eventBorderColor: "green",
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

			const eventTitle = document.getElementById("eventTitle").value;
			const startDate = document.getElementById("startDate").value;
			const endDate = document.getElementById("endDate").value;

			const eventId = event.target.dataset.eventId;
			if (eventId) {
				// Edit existing event
				let event = calendar.getEventById(eventId);
				event.setProp("title", eventTitle);
				event.setStart(startDate);
				event.setEnd(endDate);

				// Update eventsData and localStorage
				eventsData = eventsData.map((ev) =>
					ev.id === eventId
						? { ...ev, title: eventTitle, start: startDate, end: endDate }
						: ev
				);
				localStorage.setItem("events", JSON.stringify(eventsData));
			} else {
				// Add new event
				const newEvent = {
					id: uuidv4(),
					title: eventTitle,
					start: startDate,
					end: endDate,
					editable: true,
				};

				calendar.addEvent(newEvent);
				eventsData.push(newEvent);
				localStorage.setItem("events", JSON.stringify(eventsData));
			}

			document.getElementById("popup").style.display = "none";
			document.getElementById("eventForm").reset();
		});

	//DELETE: Handle event deletion
	document.getElementById("deleteBtn").addEventListener("click", function () {
		const eventId = document.getElementById("eventForm").dataset.eventId;
		if (eventId) {
			// delete from DOM
			let event = calendar.getEventById(eventId);
			event.remove();

			//UPDATE: Update eventsData and localStorage
			eventsData = eventsData.filter((ev) => ev.id !== eventId);
			localStorage.setItem("events", JSON.stringify(eventsData));

			document.getElementById("popup").style.display = "none";
			document.getElementById("eventForm").reset();
		}
	});

	// Hide the popup when clicking outside of it
	window.onclick = function (event) {
		const popup = document.getElementById("popup");
		if (event.target === popup) {
			popup.style.display = "none";
		}
	};
});

// format date to be "YYYY-MM-DDTHH:MM"
function formatDateTimeLocal(date) {
	return `${date.getFullYear()}-${(date.getMonth() + 1)
		.toString()
		.padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}T${date
		.getHours()
		.toString()
		.padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
}
