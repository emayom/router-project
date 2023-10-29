import { Router } from './router';


class HistoryRouter extends Router {
    /**
     * @override
     * @returns HistoryRouter
     */
    initialize(){
        super.initialize();

        if(window.location.pathname.match(/\w.html$/)){
            this.setCurrentPath(this.basename, '');
        }

        return this;
    }
    /**
     * 주소창의 url을 변경 (HTTP 요청을 서버로 전송하지 않는다.)
     * @param {string} path 
     * @param {object} state 
     * @param {boolean} replace - entry 변경 여부 (true일 경우 대체된다.)
     */
    setCurrentPath(path, state, replace){
        // 현재와 같은 경로를 요청할 경우 경로를 재설정하지 않는다.
        if(window.location.pathname === path) return;

        (replace === true)
            ? window.history.replaceState(state, '', path)
            : window.history.pushState(state, '', path);

        // historychange 이벤트를 발생시켜 navigate 함수를 실행시킨다.
        window.dispatchEvent(
            new CustomEvent("historychange", {
                detail: {},
            })
        );
    }
}   
/**
 * @param {HTMLElement} element 
 * @param {object} opts 
 * @returns HistoryRouter
 */
function createHistoryRouter(element, opts){
    const router = new HistoryRouter(element, opts?.routes, opts?.basename).initialize();
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
            let detail;
            router.setCurrentPath(`${resourcePath}`, detail);

            event.preventDefault();
            event.stopPropagation();
        }
    }, true);
    /**
     * history 변경으로 hashchangeEvent(custum event)가 발생했을 경우 
     */
    window.addEventListener('historychange', (event)=>{
        router.navigate(
            window.location.pathname,
        )
    });
    /**
     * 앞으로 가기, 뒤로가기 실행 
     */
     window.addEventListener('popstate', (event)=>{
        router.navigate(
            window.location.pathname,
        )
    });   

    return router;
}


export {
    createHistoryRouter
}