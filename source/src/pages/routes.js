
// Loop through all the folder in pages and collect all the route.js files
// and add them to the routes array.
let routes = [];
const context = require.context("./", true, /route.js$/);
context.keys().forEach((path) => {
    routes.push(context(`${path}`).default);
});

export default routes;