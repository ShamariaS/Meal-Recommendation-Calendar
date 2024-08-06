
const inputURL = 'input_day2.json';
const outputURLs = ['Output_day2.json', 'Output_day3.json','Output_day4.json','Output_day5.json', 'Output_day6.json','Output_day7.json','Output_day8.json','Output_day9.json','Output_day10.json','output.json'];

Promise.all([
  d3.json(inputURL),
  ...outputURLs.map(url => d3.json(url))
]).then(([inputData, ...outputDataArray]) => {

  const outputData = Object.assign({}, ...outputDataArray);

  const daysWithData = Object.keys(outputData).map(day => parseInt(day.split(' ')[1]));
  
  const mealData = Object.values(outputData);
  const uniqueMeals = mealData.map(meals => JSON.stringify(meals)).filter((meal, index, self) => self.indexOf(meal) !== index);
  const duplicateDays = Object.keys(outputData).filter(day => uniqueMeals.includes(JSON.stringify(outputData[day])));

  const totalDays = 30;
  const data = Array.from({ length: totalDays }, (_, i) => ({
    day: i + 1,
    meals: outputData[`day ${i + 1}`] || []
  }));

  const calendar = d3.select("#calendar");

  
  const dayDivs = calendar.selectAll(".day")
    .data(data)
    .enter().append("div")
      .attr("class", d => {
        if (daysWithData.includes(d.day)) {
          return `day ${duplicateDays.includes(`day ${d.day}`) ? 'duplicate' : 'highlight'}`;
        } else {
          return 'day';
        }
      })
      .text(d => `Day ${d.day}`)
      .on("click", function(event, d) {
        console.log(`Clicked Day ${d.day}`); 
        const mealDetails = outputData[`day ${d.day}`];
        console.log(`Meal Details for Day ${d.day}:`, mealDetails); 
        if (mealDetails) {
          d3.select("#details")
            .style("display", "block")
            .html(`
              <h3>Day ${d.day} Meals</h3>
              ${mealDetails.map(meal => `
                <div class="meal-card">
                  <p><strong>Meal:</strong> ${meal.meal_name}</p>
                  <p><strong>Time:</strong> ${meal.meal_time}</p>
                  ${Object.keys(meal).filter(key => !['meal_name', 'meal_time'].includes(key)).map(key => `
                    <p><strong>${key}:</strong> ${meal[key]}</p>
                  `).join('')}
                </div>
              `).join('')}
            `);
        }
      });

  
  d3.select("body").on("click", () => {
    d3.select("#details").style("display", "none");
  });

  
  d3.select("#calendar").on("click", function(event) {
    event.stopPropagation();
  });
}).catch(error => {
  console.error('Error fetching or parsing data:', error);
});





      
