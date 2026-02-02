export class DateFormatter {
    formatDate(dateString) {
        const messageDate = new Date(dateString);
        const today = new Date();
        const messageDateString = messageDate.toISOString().split('T')[0];
        const todayDateString = today.toISOString().split('T')[0];
        const hours = messageDate.getHours().toString().padStart(2, '0');
        const minutes = messageDate.getMinutes().toString().padStart(2, '0');
        if (messageDateString === todayDateString) {
            // If message is from today, show only hours and minutes
            return `${hours}:${minutes}`;
        }
        else {
            // If message is from another day, show full date (MM-DD) and time
            const month = (messageDate.getMonth() + 1).toString().padStart(2, '0');
            const day = messageDate.getDate().toString().padStart(2, '0');
            return `${month}-${day} ${hours}:${minutes}`;
        }
    }
}
