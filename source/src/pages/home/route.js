
import Home from ".";

// Define the route
const route = {
    key: 'app.home',
    path: "/",
    icon: 'fa fa-plus-square',
    name: 'Home',
    isMenu: false,
    exact: true,
    public: true,
    component: Home,
    child: []
}
export default route;
