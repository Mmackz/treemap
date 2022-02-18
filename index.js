// data files
const gameData =
   "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

const movieData =
   "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

// setup chart
const height = 600;
const width = 960;
const chartContainer = d3.select(".chart");
const chart = chartContainer.append("svg").attr("height", height).attr("width", width);

// color scheme
const colors = d3.scaleOrdinal(d3.schemeCategory10);

// setup treemap
const treemap = d3.treemap().size([width, height]).paddingInner(1);

// add title
chartContainer.append("div").lower().attr("class", "title-container").append("h1").attr("id", "title").text("Movie box-office sales")
d3.select(".title-container").append("p").attr("id", "description").text("'Top 100 Highest Grossing Movies Grouped By Genre'")
d3.json(movieData).then((data) => {
   const root = d3
      .hierarchy(data)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value);
   treemap(root);

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
         console.log(data);
      });

   // add label
   dataCell
      .append("text")
      .attr("class", "cell-label")
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
});
