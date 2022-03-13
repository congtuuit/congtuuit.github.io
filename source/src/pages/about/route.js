
import About from ".";

const route = {
    key: 'app.about',
    path: "/gioi-thieu",
    icon: 'fa fa-plus-square',
    name: 'About',
    isMenu: false,
    exact: true,
    public: true,
    component: About,
    child: []
}
export default route;