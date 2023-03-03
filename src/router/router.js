import {
    RouterMount,
    createRouter
} from 'uni-simple-router';

const router = createRouter({
    platform: process.env.VUE_APP_PLATFORM,
    routes: [...ROUTES]
});

const whitelist = [
    "/pagesA/login/pass-code",
    "/pagesA/login/pass-word",
    "/pages/home/index",
    "/pages/user/index",
    "/pages/order/index",
    "/pages/stats/index",
    "/pagesA/reg/index",
    "/pagesB/agreement",
    "/pagesB/privacy",
] //声明了一个白名单
//全局路由前置守卫
router.beforeEach((to, from, next) => {
    if (uni.getStorageSync("login_status")) {
        next()
    } else {
        if (whitelist.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
            next()
        }else {
            next({ path: '/pages/home/index'});
         }
     }
});
export {
    router,
    RouterMount
}
