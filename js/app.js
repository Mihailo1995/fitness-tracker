/******************* UI *******************/
const UI = (function () {

    // Draw data on the screen
    const drawData = (data) => {
        // console.log(data);
        const dailyDateDiv = document.querySelector(".daily-date-div");
        const dailyStatsDiv = document.querySelector(".daily-stats-div");
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const months = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        // let day, averageActivity, totalSteps, totalCalBurned, dailySteps, dailyKm, dailyCal, dailyHours;
        // data.forEach((obj, i) => console.log(i, obj));
        // const dataLength = Object.keys(data).length; // 16
        // const dataArr = [...data];

        // Total Steps (12,591)
        let totalSteps = data.reduce((total, num) => {
            return total + num.steps;
        }, 0);
        // Total Calories Burned (629)
        let totalCalBurned = Math.round(totalSteps * 0.05);
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

        // Days of Month (10 - 14)
        let daysOfMonthArr = [];
        data.forEach((obj, i) => daysOfMonthArr = [...daysOfMonthArr, new Date(data[i].timestamp).getDate()]);
        let daysOfMonthSet = new Set(daysOfMonthArr); // ► Set(5) {10, 11, 12, 13, 14}
        let daysOfMonthSetArr = [...daysOfMonthSet]; // ► (5) [10, 11, 12, 13, 14]

        // Days of Week (MON - FRI)
        let daysArr = [];
        data.forEach((obj, i) => daysArr = [...daysArr, new Date(data[i].timestamp).getDay()]);
        let daysSet = new Set(daysArr); // ► Set(5) {1, 2, 3, 4, 5}
        let daysSetArr = [...daysSet]; // ► (5) [1, 2, 3, 4, 5]

        // for each div.day set its day of month (10 - 14) and day of week (MON - FRI)
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

        // Show statistics by day
        const _showDailyStats = (n) => {
            // const dailyDateDiv = document.querySelector(".daily-date-div");
            // const dailyStatsDiv = document.querySelector(".daily-stats-div");
            document.querySelector(".welcome-div").style.display = "none";
            document.querySelector(".stats-div").style.display = "none";
            dailyDateDiv.style.display = "flex";
            dailyStatsDiv.style.display = "flex";
            dailyDateDiv.classList.add("animated", "bounceInDown");
            dailyStatsDiv.classList.add("animated", "bounceInUp");

            const filterStepsByDay = (n) => {
                let stepsByDay = data.filter(obj => (new Date(obj.timestamp).getDay() === n))
                    .map(obj => obj.steps)
                    .reduce((total, num) => total + num, 0);
                console.log(stepsByDay);
                return stepsByDay;
            }

            let dailySteps = filterStepsByDay(n);

            dailyDateDiv.innerHTML = `
                <div class="div-icon">
                    <i class="material-icons" id="back-icon">chevron_left</i>
                </div>
                <div class="div-info">
                    <h1 class="div-info__h1" id="day">${daysOfWeek[n]}</h1>
                    <p class="div-info__p" id="date">
                    ${months[new Date(data[n].timestamp).getMonth()]} ${daysOfMonthSetArr[n - 1]}, ${new Date(data[n].timestamp).getFullYear()}.
                    </p>
                </div>
            `;

            dailyStatsDiv.innerHTML = `
                <div class="circle-div">
                    <div class="div-icon">
                        <i class="material-icons">directions_run</i>
                    </div>
                    <h3 class="label-h3">Steps</h3>
                    <h1 class="number-h1" id="day-steps">${dailySteps.toLocaleString()}</h1>
                </div>

                <div class="motivation-div">
                    <h3 class="label-h3">Very good</h3>
                    <h2 class="label-h2">Keep going!</h2>
                </div>

                <div class="results-div">
                    <div class="km-div">
                        <h4 class="label-h4">km</h4>
                        <h2 class="number-h2">${parseFloat((dailySteps * 0.762 / 1000).toFixed(1))}</h2>
                    </div>
                    <div class="cal-div">
                        <h4 class="label-h4">cal</h4>
                        <h2 class="number-h2">${Math.round(dailySteps * 0.05)}</h2>
                    </div>
                    <div class="hours-div">
                        <h4 class="label-h4">min</h4>
                        <h2 class="number-h2">${Math.round(dailySteps * 0.5 / 60)}</h2>
                    </div>
                </div>
            `;

            // Go back to the home screen
            const _backToHomeScreen = () => {
                document.querySelector(".welcome-div").classList.add("animated", "bounceInLeft");
                document.querySelector(".activity-div").classList.add("animated", "bounceInRight");
                document.querySelector(".steps-div").classList.add("animated", "bounceInLeft");
                document.querySelector(".calories-div").classList.add("animated", "bounceInUp");
                document.querySelector(".welcome-div").style.display = "flex";
                document.querySelector(".stats-div").style.display = "block";
                document.querySelector(".daily-date-div").style.display = "none";
                document.querySelector(".daily-stats-div").style.display = "none";
            }

            document.querySelector("#back-icon").addEventListener("click", _backToHomeScreen);
        }

        // const filterStepsByDay = (num) => {
        //     let stepsByDay = data.filter(obj => (new Date(obj.timestamp).getDay() === num))
        //         .map(obj => obj.steps)
        //         .reduce((total, num) => total + num, 0);
        //     console.log(stepsByDay);
        //     return stepsByDay;
        // }

        // daysSetArr.forEach(day => filterStepsByDay(day));

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
                    // console.log(e.currentTarget);
                    _showDailyStats(i + 1);
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
    const getData = () => {
        fetch("https://api.myjson.com/bins/1gwnal")
            .then(response => response.json())
            .then(data => UI.drawData(data))
            .catch((err) => console.error(err));
    }

    return {
        getData
    }
})();

/******************* Init *******************/
window.onload = function () {
    Data.getData();
}