import { Router } from './router';


class HashRouter extends Router {
    /**
     * @param {HTMLElement} root 
     * @param {array} routes 
     * @param {string} basename 
     */
    constructor(root, routes, basename = '/#'){
        super(root, routes, basename);
    }
    /**
     * @override
     * @returns HashRouter
     */
    initialize(){
        super.initialize();

        if(!window.location.hash || window.location.pathname.match(/\w.html$/)){
            window.location.replace(`${this.basename}`);
        }

        return this;
    }
}
/**
 * @param {HTMLElement} element 
 * @param {object} opts 
 * @returns HashRouter
 */
function createHashRouter(element, opts){
    const router = new HashRouter(element, opts?.routes, opts?.basename).initialize();
    /**
     * <a>아닌 element의 clickEvent로 라우팅이 실행되어야 할 경우 
     * 1. event.target -> dataset에 대상 attriubute 값이 존재하는지 확인 -> stopPropagation
     * 2. 이벤트 실행 흐름 상에 존재하는 지 확인 -> stopPropagation
     */
    document.addEventListener('click', (event)=>{
        const resourcePath = event.target.dataset?.resourcePath
                                ? event.target.dataset?.resourcePath
                                : event.composedPath().find(node => node.dataset?.resourcePath)?.dataset.resourcePath;

        if(resourcePath){
            window.location.assign(`${router.basename}${resourcePath}`);

            event.preventDefault();
            event.stopPropagation();
        }
    }, true);
    /**
     * URL 해쉬(#) 변경으로 hashchangeEvent가 발생했을 경우 
     */
    window.addEventListener('hashchange', (event)=>{
        router.navigate(
            window.location.hash.replace(/\#/g, '')
        );
    });  

    return router;
}


export {
    createHashRouter
}