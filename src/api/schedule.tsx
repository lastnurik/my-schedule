// ScheduleService: fetches, maps, sorts, and stores schedule data for a group
class ScheduleService {
	static API_URL = 'https://my-schedule-api-hjb3dcftc6asb7d8.germanywestcentral-01.azurewebsites.net/api/schedulestorage/';

	// Fetch schedule for a group
	async fetchSchedule(groupName) {
		const url = `${ScheduleService.API_URL}${encodeURIComponent(groupName)}`;
		const response = await fetch(url);
		if (!response.ok) throw new Error('Failed to fetch schedule');
		const apiData = await response.json();
		return this.mapAndSortSchedule(apiData);
	}

	// Map and sort schedule data from new API format
	mapAndSortSchedule(apiData) {
		// apiData.days is an array of { day: string, items: [...] }
		const mapped = {};
		if (Array.isArray(apiData.days)) {
			apiData.days.forEach(dayObj => {
				const dayName = dayObj.day;
				if (Array.isArray(dayObj.items)) {
					mapped[dayName] = dayObj.items
						.map(item => ({
							time: item.classtime_time,
							discipline: item.subject,
							classroom: item.room,
							type: item.lesson_type,
							lector: item.tutor,
							teamsMeetingUrl: item.teamsMeetingUrl || null,
						}))
						.sort((a, b) => a.time.localeCompare(b.time));
				} else {
					mapped[dayName] = [];
				}
			});
		}
		// Ensure all weekdays exist in mapped
		['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach(day => {
			if (!mapped[day]) mapped[day] = [];
		});
		return mapped;
	}

	// Store schedule locally (browser & iOS PWA compatible)
	storeScheduleLocally(groupName, scheduleData) {
		try {
			// Use localStorage for browser and iOS PWA
			localStorage.setItem(`schedule_${groupName}`, JSON.stringify(scheduleData));
		} catch (e) {
			// Fallback for iOS PWA if needed (IndexedDB or other can be added here)
			// For most iOS PWAs, localStorage works, but can be extended if needed
			console.error('Failed to store schedule locally', e);
		}
	}

	// Get schedule from local storage
	getLocalSchedule(groupName) {
		try {
			const data = localStorage.getItem(`schedule_${groupName}`);
			return data ? JSON.parse(data) : null;
		} catch (e) {
			return null;
		}
	}

	// Main method: fetch, process, and store
	async getSchedule(groupName) {
		let schedule = this.getLocalSchedule(groupName);
		if (!schedule) {
			schedule = await this.fetchSchedule(groupName);
			this.storeScheduleLocally(groupName, schedule);
		}
		return schedule;
	}
}

export default ScheduleService;
