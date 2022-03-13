
import About from ".";

const route = {
    key: 'app.about',
    path: "/about",
    icon: 'fa fa-plus-square',
    name: 'About',
    isMenu: false,
    exact: true,
    public: true,
    component: About,
    child: []
}
export default route;