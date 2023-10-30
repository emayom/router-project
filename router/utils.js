// 매칭 된 path parameter를 문자열과 매칭될 수 있도록 대체하기 위한 정규 표현식
const URL_REGEXP = '([^\\/]+)';       
// :param 같은 path parameter 정보를 매칭하기 위한 정규 표현식 
const PARAMETER_REGEXP = /:(\w+)/g; 
// /post/:id 에서 /post와 같은 베이스 네임을 매칭하기 위한 정규 표현식
const BASENAME_REGEXP = /\/(\w+(-*\w*)*)/;


/**
 * 라우터에 저장 할 path를 정규표현식으로 컴파일하여 리턴한다.
 * @param {string} path 
 * @returns {RegExp} matcher 
 * @example
 * // returns /^\/posts\/([^\/]+)$/
 * compilePath('/posts/:id');
 */
function compilePath(path){
    return new RegExp(`^${path.replace(PARAMETER_REGEXP, URL_REGEXP)}$`);
}
/**
 * 라우터에 저장 할 path parameters 정보를 배열로 리턴한다. 
 * @param {string} path 
 * @returns {array} params
 * @example
 * // returns [ 'getting-started', 'install' ]
 * getUrlParams('/docs/getting-started/install');
 */
function getUrlParams(path){
    return path.replace(BASENAME_REGEXP, '').match(/(\w+(-*\w*)*)/g);
}
/**
 * 요청한 path 정보와 일치하는 route 정보(매핑된 path paramter 정보, 컴포넌트 정보)를 리턴한다.
 * @param {object} routes - map 
 * @param {string} path 
 * @return {object} 
 */
function matchRoutes(routes, path){
    const { params, component } = routes.get(
        [ ...routes.keys() ].find( regexp => regexp.test(path))
    ) || {};

    // 라우터의 path parameters 정보와 매핑이 필요한 경우 
    if(params && component){
        return {
            params: setParamsProperites(path, params),
            component
        };

    }else {
        return { params, component };
    }
}
/**
 * 요청한 url의 path parameters 정보와 라우터의 path parameters 정보를 매핑한다.
 * @param {string} path 
 * @param {array} params 
 * @returns 
 */
function setParamsProperites(path, params){
    return path.replace(BASENAME_REGEXP, '')
                .match(/\w+/g)
                .reduce((acc, currentVal, currentIndex) => {
                    return { ...acc, [params[currentIndex]]: currentVal }
                }, {});
}


export {
    matchRoutes,
    compilePath,
    getUrlParams,
}

