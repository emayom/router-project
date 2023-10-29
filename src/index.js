import { startWorker } from "./mocks/browser.js"
import { createRouter } from "../router/router.js";
import { createHashRouter } from "../router/hash.js";
import { createHistoryRouter } from "../router/history.js";
import routes from "../routes.js";   
import styles from "./styles/style.css"


const App = document.getElementById('root');


startWorker();

// const hashRouter = createHashRouter(App, {
//     routes: routes,
//     // basename: '/#',    
// });
// console.log('hashRouter :: ', hashRouter);

const historyRouter = createHistoryRouter(App, {
    routes: routes,
    basename: '/',
});
console.log('historyRouter :: ', historyRouter);

