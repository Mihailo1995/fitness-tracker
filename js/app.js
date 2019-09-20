/******************* UI *******************/
const UI = (function() {
    // Show statistics by day
    const _showDailyStats = () => {
        document.querySelector(".overview-div").style.display = "none";
        document.querySelector(".stats-div").style.display = "none";
        document.querySelector(".daily-overview-div").style.display = "flex";
        document.querySelector(".daily-stats-div").style.display = "flex";
    }

    // Go back to the home screen
    const _backToHomeScreen = () => {
        document.querySelector(".overview-div").style.display = "flex";
        document.querySelector(".stats-div").style.display = "block";
        document.querySelector(".daily-overview-div").style.display = "none";
        document.querySelector(".daily-stats-div").style.display = "none";
    }

    document.querySelectorAll(".day").forEach(e => e.addEventListener("click", _showDailyStats));
    document.querySelector("#back-icon").addEventListener("click", _backToHomeScreen);

    // Draw data on the screen
    const drawData = (data) => {
        console.log(data);
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    }

    return {
        drawData
    }
})();

/******************* Data *******************/
const Data = (function() {
    const fetchData = () => {
        fetch("https://api.myjson.com/bins/1gwnal")
            .then((response) => response.json())
            .then((data) => {
                // console.log(data);
                UI.drawData(data);
            })
            .catch((err) => console.error(err));
    }

    return {
        fetchData
    }
})();

/******************* Init *******************/
window.onload = function() {
    Data.fetchData();
}