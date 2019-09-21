/******************* UI *******************/
const UI = (function () {
    // Show statistics by day
    const _showDailyStats = () => {
        document.querySelector(".overview-div").style.display = "none";
        document.querySelector(".stats-div").style.display = "none";
        document.querySelector(".daily-overview-div").style.display = "flex";
        document.querySelector(".daily-stats-div").style.display = "flex";
    }

    // Go back to the home screen
    const _backToHomeScreen = () => {
        document.querySelector(".overview-div").classList.add("animated", "bounceInLeft");
        document.querySelector(".activity-div").classList.add("animated", "bounceInRight");
        document.querySelector(".steps-div").classList.add("animated", "bounceInLeft");
        document.querySelector(".calories-div").classList.add("animated", "bounceInUp");
        document.querySelector(".overview-div").style.display = "flex";
        document.querySelector(".stats-div").style.display = "block";
        document.querySelector(".daily-overview-div").style.display = "none";
        document.querySelector(".daily-stats-div").style.display = "none";
    }

    // document.querySelectorAll(".day").forEach(e => e.addEventListener("click", _showDailyStats));
    document.querySelector("#back-icon").addEventListener("click", _backToHomeScreen);

    // Draw data on the screen
    const drawData = (data) => {
        console.log(data);
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        // let day, averageActivity, totalSteps, totalCalBurned, dailySteps, dailyKm, dailyCal, dailyHours;
        // data.forEach((obj, i) => console.log(i, obj));
        // const dataLength = Object.keys(data).length; // 16
        // const dataArr = [...data];

        // Total Steps (12,591)
        let totalSteps = data.reduce((total, num) => {
            return total + num.steps;
        }, 0);
        // Total Calories Burned (629)
        let totalCalBurned = parseInt(totalSteps * 0.05);
        // Total Seconds (6295.5)
        let totalSeconds = parseInt(totalSteps * 0.5);
        // Average daily time (1h 45min)
        let averageTime = `${Math.floor(totalSeconds / 3600 / 5)}h ${Math.round(totalSeconds / 60 / 5) % 60}min`;
        // Average daily distance passed in km
        let averageDistance = `${(totalSteps * 0.762 / 1000 / 5).toFixed(1)} km`;

        document.querySelector("#average-time").textContent = averageTime;
        document.querySelector("#average-distance").textContent = averageDistance;
        document.querySelector("#total-steps").textContent = totalSteps.toLocaleString();
        document.querySelector("#total-cal-burned").textContent = totalCalBurned;

        let mondaySteps = data.filter(obj => (new Date(obj.timestamp).getDay() === 1))
            .map(obj => obj.steps)
            .reduce((total, num) => total + num, 0);
        console.log(mondaySteps);
        let tuesdaySteps = data.filter(obj => (new Date(obj.timestamp).getDay() === 2))
            .map(obj => obj.steps)
            .reduce((total, num) => total + num, 0);
        console.log(tuesdaySteps);
        let wednesdaySteps = data.filter(obj => (new Date(obj.timestamp).getDay() === 3))
            .map(obj => obj.steps)
            .reduce((total, num) => total + num, 0);
        console.log(wednesdaySteps);
        let thursdaySteps = data.filter(obj => (new Date(obj.timestamp).getDay() === 4))
            .map(obj => obj.steps)
            .reduce((total, num) => total + num, 0);
        console.log(thursdaySteps);
        let fridaySteps = data.filter(obj => (new Date(obj.timestamp).getDay() === 5))
            .map(obj => obj.steps)
            .reduce((total, num) => total + num, 0);
        console.log(fridaySteps);

        // Days of Month (10 - 14)
        let daysOfMonthArr = [];
        data.forEach((obj, i) => daysOfMonthArr = [...daysOfMonthArr, new Date(data[i].timestamp).getDate()]);
        let daysOfMonthSet = new Set(daysOfMonthArr); // Set(5) {10, 11, 12, 13, 14}
        let daysOfMonthSetArr = [...daysOfMonthSet]; // (5) [10, 11, 12, 13, 14]

        // Days of Week (MON - FRI)
        let daysArr = [];
        data.forEach((obj, i) => daysArr = [...daysArr, new Date(data[i].timestamp).getDay()]);
        let daysSet = new Set(daysArr); // Set(5) {1, 2, 3, 4, 5}
        let daysSetArr = [...daysSet]; // (5) [1, 2, 3, 4, 5]

        for (let i = 0; i < daysOfMonthSetArr.length; i++) {
            const daysDiv = document.querySelector(".days-div");
            let dayClone = daysDiv.children[0].cloneNode(true);
            dayClone.style.display = "flex";
            for (let j = 0; j < daysSetArr.length; j++) {
                let dayOfMonth = daysOfMonthSetArr[i]; // 10 - 14
                let day = daysOfWeek[daysSetArr[i]]; // Monday - Friday
                dayClone.children[0].textContent = dayOfMonth;
                dayClone.children[1].textContent = day.slice(0, 3).toUpperCase();
                daysDiv.appendChild(dayClone);
            }
        }

        // Day divs array
        const btnsArr = [...document.querySelectorAll(".day")];
        // remove cloned div.day with style="diplay: none"
        btnsArr.shift();
        console.log(btnsArr);
        // btnsArr.forEach((btn) => btn.addEventListener("click", (e) => {
        //     console.log(e.target);
        // }));
        for (let i = 0; i < btnsArr.length; i++) {
            btnsArr[i].addEventListener("click", (e) => {
                if (e.currentTarget.classList.contains("day")) {
                    console.log(e.currentTarget);
                    _showDailyStats();
                }
            });
        }
    }

    return {
        drawData
    }
})();

/******************* Data *******************/
const Data = (function () {
    const fetchData = () => {
        fetch("https://api.myjson.com/bins/1gwnal")
            .then(response => response.json())
            .then(data => UI.drawData(data))
            .catch((err) => console.error(err));
    }

    return {
        fetchData
    }
})();

/******************* Init *******************/
window.onload = function () {
    Data.fetchData();
}