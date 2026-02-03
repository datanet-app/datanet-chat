export class DateFormatter {
    GetDate(time) {
        const Dt1 = new Date(time);
        const year = Dt1.getFullYear();
        const month = (Dt1.getMonth() + 1).toString().padStart(2, '0');
        const day = Dt1.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    /**
     *  محاسبه اختلاف دقیقه بین دو تیک
     * @param Newer
     * @param Older
     * @returns Minutes difference between two ticks
     */
    GetDiffervenceInMinutes(Newer, Older) {
        if (Older > Newer)
            return 0;
        return (Newer - Older) / (1000 * 60);
    }
    /**
     * فرمت ساعت و دقیقه از روی تعداد تیک‌ها
     * @param ticks
     * @returns HH:MM
     */
    HourMinuteFormat(ticks) {
        const Dt1 = new Date(ticks);
        return `${Dt1.getHours().toString().padStart(2, '0')}:${Dt1.getMinutes().toString().padStart(2, '0')}`;
    }
    GetDateFormat(time) {
        const diff = Date.now() - time;
        const minutes = Math.floor(diff / (1000 * 60));
        if (minutes < 1)
            return "Now";
        if (minutes < 60)
            return `${minutes} min ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24)
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        const days = Math.floor(hours / 24);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
}
