import {
    matchRoutes,
    compilePath,
    getUrlParams,
} from "./utils";


/**
 * @property {HTMLElement} root
 * @property {array} routes
 * @property {string} basename
 */
class Router {
    root;
    basename;
    #routes;
    /**
     * @param {HTMLElement} root
     * @param {array} routes 
     * @param {string} basename 
     */
    constructor(root, routes = [], basename = '/'){
        this.root = root;
        this.#routes = new Map();
        this.basename = basename;

        routes.map(route => this.addRoute(...route));
    }
    /**
     * @returns Router
     */
    initialize(){
        this.navigate(window.location.pathname);

        return this;
    }
    /**
     * @param {string} to 
     * @void
     */
    async navigate(to){
        const { params, component } = matchRoutes(this.#routes, to);

        if(component){
            new component(this.root, params);

        }else {
            const notFoundRoute = this.errorRoute;
            (notFoundRoute)? new notFoundRoute.component(this.root) : this.navigate('/');
        }
    }
    /**
     * @param {string} path 
     * @param {function} component 
     * @void
     */
    addRoute(path, component){
        this.#routes?.set(compilePath(path), {
            params: getUrlParams(path),
            component: component
        });
    }
    /**
     * @param {function} component 
     * @void
     */
    onRouteError(component){
        this.errorRoute = { component }
    }
}
/**
 * @param {array} routes 
 * @param {string} basename 
 * @returns Router
 */
function createRouter(routes, basename){
    const router = new Router(routes, basename);

    return router;
}


export {
    Router,
    createRouter,
};