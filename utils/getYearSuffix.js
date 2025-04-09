export default function getYearSuffix(year) {
    // Ensure year is treated as a number for comparison
    const yearNum = parseInt(year);
    if (isNaN(yearNum)) return ""; // Return empty if not a valid number
    if (yearNum === 1) return "st";
    if (yearNum === 2) return "nd";
    if (yearNum === 3) return "rd";
    return "th";
}