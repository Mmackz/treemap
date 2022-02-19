// data files
const gameData =
   "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

const movieData =
   "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

// setup chart
const height = 600;
const width = 960;
const legendWidth = 500;
const chartContainer = d3.select(".chart");
const chart = chartContainer.append("svg").attr("height", height).attr("width", width);

// color scheme
const colors = d3.scaleOrdinal(d3.schemeCategory10);

// tooltip
const tip = d3
   .tip()
   .attr("class", "tooltip")
   .attr("id", "tooltip")
   .direction("n")
   .offset([16, 110])
   .html((d) => {
      d3.select("#tooltip").attr("data-value", d.value);
      const sales = `$${+(d.value / 10 ** 6).toFixed(2)}M`;
      return `
         <p><span class="tt-label">Title:</span>${d.name}</p>
         <p><span class="tt-label">Genre:</span>${d.category}</p>
         <p><span class="tt-label">Sales:</span>${sales}</p>
      `;
   });

// setup treemap
const treemap = d3.treemap().size([width, height]).paddingInner(1);

// add title
chartContainer
   .append("div")
   .lower()
   .attr("class", "title-container")
   .append("h1")
   .attr("id", "title")
   .text("Movie box-office sales");
d3.select(".title-container")
   .append("p")
   .attr("id", "description")
   .text("'Top 100 Highest Grossing Movies Grouped By Genre'");
d3.json(movieData).then((data) => {
   const root = d3
      .hierarchy(data)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value);
   treemap(root);

   // initialize tooltips
   chart.call(tip);

   // create cells to display data and label
   const dataCell = chart.selectAll("g").data(root.leaves()).enter().append("g");

   // add data
   dataCell
      .append("rect")
      .attr("class", "tile")
      .attr("data-name", ({ data }) => data.name)
      .attr("data-category", ({ data }) => data.category)
      .attr("data-value", ({ data }) => data.value)
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0)
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("fill", ({ data }) => colors(data.category))
      .style("overflow", "hidden")
      .on("mouseenter", (event, data) => {
         tip.show(data.data, event.target);
      })
      .on("mouseout", tip.hide);

   // add label
   dataCell
      .append("text")
      .attr("class", "cell-label")
      .attr("pointer-events", "none")
      .selectAll("tspan")
      .data((d) => {
         return d.data.name
            .match(/\S{6,} ?|\S+{4, }\s\S{0,3}\b ?|\S{0,3}\s\S+ ?|\S+ ?/g)
            .map((word, i) => ({ word, x: d.x0, y: d.y0 + i * 11 }));
      })
      .enter()
      .append("tspan")
      .attr("x", (d) => d.x + 2)
      .attr("y", (d) => d.y + 10)
      .text((d) => d.word)
      .style("font-size", "0.5rem");

   // add legend
   const genres = data.children.map(item => item.name)
   console.log(genres)

   const legend = chartContainer
      .append("svg")
      .attr("id", "legend")
      .attr("class", "legend")
      .attr("width", legendWidth)
      .attr("height", 400);

   legend
      .append("g")
      .selectAll("g")
      .data(genres)
      .enter()
      .append("g")
      .style("transform", (d, i) => {
         return `translate(${(i % 3) * (legendWidth / 3)}px, ${Math.floor(i / 3) * 24}px)`
      })
      .append("rect")
      .attr("class", "legend-item")
      .attr("fill", (d) => colors(d))
      .attr("width", 18)
      .attr("height", 18);
   d3.selectAll(".legend-item").append("text").text(d=> d).style("transform", "translate(22px, 16px)")
});
