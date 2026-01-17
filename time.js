function updateDate() {
    const now = new Date();
    document.getElementById("date-time").textContent = now.toLocaleString(
        "en-IN",
        {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        }
    );
}
document.addEventListener("DOMContentLoaded", () => {
    updateDate();
    setInterval(updateDate, 1000);
});
