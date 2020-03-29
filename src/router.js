import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

var router = new Router({
    routes:[
        { 
            path:'/',
            redirect:'/music/explore'
        },
        {
            path:'/music',
            component: () => import('./views/music.vue'),
            meta: {
                keepAlive: false, //此组件不需要被缓存
            },
            children:[
                {
                    path: 'explore',
                    name: 'explore',
                    component: () => import('./views/music-child/explore.vue'),
                },
                {
                    path:'song-detail',
                    name:'song-detail',
                    component: () => import('./views/music-child/song-detail.vue'),
                    meta: {
                        keepAlive: false, //此组件需要被缓存
                    }
                },
                {
                    path:'my-collection',
                    component: () => import('./views/music-child/my-collection.vue'),
                    meta: {
                        keepAlive: false, //此组件不需要被缓存
                    }
                },
                {
                    path:'search',
                    name:"search",
                    component: () => import('./views/music-child/search.vue'),
                    meta: {
                        keepAlive: true, //此组件需要被缓存
                    }
                },
                {
                    path:'my-playlist',
                    name: 'my-playlist',
                    component: () => import('./views/music-child/my-playlist.vue'),
                },
                {
                    path: 'playlist-detail',
                    name: 'playlist-detail',
                    component: () => import('./views/music-child/playlist-detail.vue'),
                    meta: {
                        keepAlive: true,
                        ifDoFresh: false
                    }
                },
                {
                    path:'album-detail',
                    name: 'album-detail',
                    component: () => import('./views/music-child/album-detail.vue'),
                    meta: {
                        keepAlive: true,
                        ifDoFresh: false
                    }
                },
                {
                    path:'artist-detail',
                    name: 'artist-detail',
                    component: () => import('./views/music-child/artist-detail.vue'),
                    meta: {
                        keepAlive: true,
                        ifDoFresh: false
                    }
                }
            ]
        },
    ],
})

export default router

