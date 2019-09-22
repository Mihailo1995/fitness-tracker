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

/******************* UI *******************/
const UI = (function () {
    // Draw data on the screen
    const drawData = (data) => {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const welcomeDiv = document.querySelector(".welcome-div");
        const statsDiv = document.querySelector(".stats-div");
        const activityDiv = document.querySelector(".activity-div");
        const stepsDiv = document.querySelector(".steps-div");
        const caloriesDiv = document.querySelector(".calories-div");
        const dailyDateDiv = document.querySelector(".daily-date-div");
        const dailyStatsDiv = document.querySelector(".daily-stats-div");

        // Total Steps (12,591)
        let totalSteps = data.reduce((total, num) => {
            return total + num.steps;
        }, 0);
        // Total Calories Burned (630)
        let totalCalBurned = Math.round(totalSteps * 0.05);
        // Total Seconds (6295.5)
        let totalSeconds = parseInt(totalSteps * 0.5);
        // Average daily time (0h 21min)
        let averageTime = `${Math.floor(totalSeconds / 3600 / 5)}h ${Math.round(totalSeconds / 60 / 5) % 60}min`;
        // Average daily distance passed (1.9 km)
        let averageDistance = `${(totalSteps * 0.762 / 1000 / 5).toFixed(1)} km`;

        document.querySelector("#average-time").textContent = averageTime;
        document.querySelector("#average-distance").textContent = averageDistance;
        document.querySelector("#total-steps").textContent = totalSteps.toLocaleString();
        document.querySelector("#total-cal-burned").textContent = totalCalBurned;

        // Days of Month (10 - 14)
        let daysOfMonthArr = [];
        // For each data object, push its day of month into array
        data.forEach((obj, i) => daysOfMonthArr = [...daysOfMonthArr, new Date(data[i].timestamp).getDate()]);
        // Make Set with unique values
        let daysOfMonthSet = new Set(daysOfMonthArr); // ► Set(5) {10, 11, 12, 13, 14}
        // Make array from Set to have array methods in prototype
        let daysOfMonthSetArr = [...daysOfMonthSet]; // ► (5) [10, 11, 12, 13, 14]

        // Days of Week (MON - FRI)
        let daysArr = [];
        // For each data object, push its day of week into array
        data.forEach((obj, i) => daysArr = [...daysArr, new Date(data[i].timestamp).getDay()]);
        // Make Set with unique values
        let daysSet = new Set(daysArr); // ► Set(5) {1, 2, 3, 4, 5}
        // Make array from Set to have array methods in prototype
        let daysSetArr = [...daysSet]; // ► (5) [1, 2, 3, 4, 5]

        // For each div.day set its day of month (10 - 14) and day of week (MON - FRI)
        for (let i = 0; i < daysOfMonthSetArr.length; i++) {
            const daysDiv = document.querySelector(".days-div");
            // cloneNode(true) - true - Clone the node, its attributes, and its descendants
            let dayClone = daysDiv.children[0].cloneNode(true);
            dayClone.style.display = "flex";
            for (let j = 0; j < daysSetArr.length; j++) {
                let dayOfMonth = daysOfMonthSetArr[i]; // 10 - 14
                let day = daysOfWeek[daysSetArr[i]]; // Monday - Friday
                dayClone.children[0].textContent = dayOfMonth;
                // Shorten day name to first 3 letters and upperCase them
                dayClone.children[1].textContent = day.slice(0, 3).toUpperCase();
                daysDiv.appendChild(dayClone);
            }
        }

        // Filter steps in every data object for each day
        const filterStepsByDay = (n) => {
            let stepsByDay = data.filter(obj => (new Date(obj.timestamp).getDay() === n))
                .map(obj => obj.steps)
                .reduce((total, num) => total + num, 0);
            return stepsByDay;
        }

        // Go back to the home screen
        const backToHomeScreen = () => {
            welcomeDiv.style.display = "flex";
            statsDiv.style.display = "block";
            dailyDateDiv.style.display = "none";
            dailyStatsDiv.style.display = "none";
            welcomeDiv.classList.add("animated", "bounceInLeft");
            activityDiv.classList.add("animated", "bounceInRight");
            stepsDiv.classList.add("animated", "bounceInLeft");
            caloriesDiv.classList.add("animated", "bounceInUp");
        }

        // Show statistics by day
        const showDailyStats = (n) => {
            welcomeDiv.style.display = "none";
            statsDiv.style.display = "none";
            dailyDateDiv.style.display = "flex";
            dailyStatsDiv.style.display = "flex";
            // Reset animation for each click on day.div
            dailyDateDiv.classList.remove("animated", "bounceInDown");
            dailyStatsDiv.classList.remove("animated", "bounceInUp");
            void dailyDateDiv.offsetWidth;
            void dailyStatsDiv.offsetWidth;
            dailyDateDiv.classList.add("animated", "bounceInDown");
            dailyStatsDiv.classList.add("animated", "bounceInUp");
            let dailySteps = filterStepsByDay(n);

            // Draw div.daily-date-div
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

            // Draw div.daily-stats-div
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

            document.querySelector("#back-icon").addEventListener("click", backToHomeScreen);
        }

        // Day divs array
        const btnsArr = [...document.querySelectorAll(".day")];
        // Remove cloned div.day with style="diplay: none" from the start of the array
        btnsArr.shift();
        // For each clicked day button, show daily stats
        for (let i = 0; i < btnsArr.length; i++) {
            btnsArr[i].addEventListener("click", () => showDailyStats(i + 1));
        }
    }

    return {
        drawData
    }
})();

/******************* Initialize *******************/
window.onload = () => Data.getData();
