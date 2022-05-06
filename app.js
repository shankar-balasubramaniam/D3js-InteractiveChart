const DUMMY_DATA = [
  { id: 'd1', value: 10, region: 'USA' },
  { id: 'd2', value: 11, region: 'India' },
  { id: 'd3', value: 12, region: 'China' },
  { id: 'd4', value: 6, region: 'Germany' },
];

// Dimensions of the chart that will be rendered
const MARGINS = {
  top: 20,
  bottom: 10,
};
const CHART_WIDTH = 600;
const CHART_HEIGHT = 400 - MARGINS.top - MARGINS.bottom;
let selectedData = DUMMY_DATA;

/**
 * 1. create a scaleBand that gives equally sized items distributed along the x-axis
 * 2. Add a rangeRound that ranges from 0 to CHART_WIDTH
 * 3. padding(0.1) reserves 10% of total available space for padding
 */
const x = d3.scaleBand().rangeRound([0, CHART_WIDTH]).padding(0.1);
/**
 * 1. linearScale allows us to get proportional values based on data
 * 2. Add range to the linearScale. Range denotes the range of the values that are to be rendered to the chart
 */
const y = d3.scaleLinear().range([CHART_HEIGHT, 0]);

/**
 * 1. Select the svg element from the DOM
 * 2. Add width attribute to the svg element
 * 3. Add height attribute to the svg element
 */
const chartContainer = d3
  .select('svg')
  .attr('width', CHART_WIDTH)
  .attr('height', CHART_HEIGHT + MARGINS.top + MARGINS.bottom);

/**
 * 1. domain specifies how many data points should be scaled
 */
x.domain(DUMMY_DATA.map((d) => d.region));
/**
 * max() is a helper function that takes in data and the value in that data to calculate the max value
 */
y.domain([0, d3.max(DUMMY_DATA, (d) => d.value) + 3]);

/**
 * Within chartContainer create a group element <g> that groups multiple svg elements
 * To group all the bars to be rendered
 * This will be the chart
 */
const chart = chartContainer.append('g');

/**
 * Create a new group for the labels
 * Call axisBottom() with x Scale
 */
chart
  .append('g')
  .call(d3.axisBottom(x).tickSizeOuter(0))
  .attr('transform', `translate(0, ${CHART_HEIGHT})`)
  .attr('color', '#4f009e');

function renderChart() {
  /**
   * 1. Select all elements of the class '.bar' even if none exist at present. This helps d3.js to figure out the missing data
   * 2. Join the '.bar' elements with DUMMY_DATA
   * 3. Calling enter() gives access to the missing data
   * 4. Append <rect> element for the missing data
   * 5. Add the bar class to the rect element
   * 6. Gives equal width for all data points
   * 7. Add height attribute
   * 8. Add x position
   * 9. Add y position
   */
  chart
    .selectAll('.bar')
    .data(selectedData, (data) => data.id)
    .enter()
    .append('rect')
    .classed('bar', true)
    .attr('width', x.bandwidth())
    .attr('height', (data) => CHART_HEIGHT - y(data.value))
    .attr('x', (data) => x(data.region))
    .attr('y', (data) => y(data.value));

  chart
    .selectAll('.bar')
    .data(selectedData, (data) => data.id)
    .exit()
    .remove();

  chart
    .selectAll('.label')
    .data(selectedData, (data) => data.id)
    .enter()
    .append('text')
    .text((data) => data.value)
    .attr('x', (data) => x(data.region) + x.bandwidth() / 2)
    .attr('y', (data) => y(data.value) - 20)
    .attr('text-anchor', 'middle')
    .classed('label', true);

  chart
    .selectAll('.label')
    .data(selectedData, (data) => data.id)
    .exit()
    .remove();
}
renderChart();
let unselectedIds = [];

const listItems = d3
  .select('#data') // select element with id data
  .select('ul') // select ul from DOM
  .selectAll('li') // select li
  .data(DUMMY_DATA) // pass data
  .enter() // get the diff (rendered data ~ existing data)
  .append('li'); // associate data to resp. li element

listItems.append('span').text((data) => data.region); // append span in each li and add text to the span

listItems
  .append('input')
  .attr('type', 'checkbox')
  .attr('checked', true)
  .attr('id', (data) => data.id) // add checkbox to each li and make it checked by default
  .on('change', (data) => {
    // add change event listener
    if (unselectedIds.indexOf(data.id) === -1) {
      // if unselectedIds does not have the current id, add it to unselectedIds
      unselectedIds.push(data.id);
    } else {
      // else remove it from unselectedIds
      unselectedIds = unselectedIds.filter((id) => id !== data.id);
    }
    // Update selectedData
    selectedData = DUMMY_DATA.filter(
      (data) => unselectedIds.indexOf(data.id) === -1
    );
    renderChart();
  });
