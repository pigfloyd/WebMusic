import Vue from 'vue'
import Router from 'vue-router'
import music from './views/music.vue'
import songDetail from './views/music-child/song-detail.vue'
import myCollection from './views/music-child/my-collection.vue'
import search from './views/music-child/search.vue'
import explore from './views/music-child/explore.vue'
import myPlayList from './views/music-child/my-playlist.vue'
import playListDetail from './views/music-child/playlist-detail.vue'
import albumDetail from './views/music-child/album-detail.vue'
import artistDetail from './views/music-child/artist-detail.vue'

Vue.use(Router)

var router = new Router({
    mode: 'history',
    routes:[
        { 
            path:'/',
            redirect:'/music/artist-detail'
        },
        {
            path:'/music',
            component:music,
            meta: {
                keepAlive: false, //此组件不需要被缓存
            },
            children:[
                {
                    path: 'explore',
                    name: 'explore',
                    component: explore,
                },
                {
                    path:'song-detail',
                    name:'song-detail',
                    component:songDetail,
                    meta: {
                        keepAlive: false, //此组件需要被缓存
                    }
                },
                {
                    path:'my-collection',
                    component:myCollection,
                    meta: {
                        keepAlive: false, //此组件不需要被缓存
                    }
                },
                {
                    path:'search',
                    name:"search",
                    component:search,
                    meta: {
                        keepAlive: true, //此组件不需要被缓存
                    }
                },
                {
                    path:'my-playlist',
                    name: 'my-playlist',
                    component:myPlayList,
                },
                {
                    path: 'playlist-detail',
                    name: 'playlist-detail',
                    component: playListDetail,
                    meta: {
                        keepAlive: true,
                        ifDoFresh: false
                    }
                },
                {
                    path:'album-detail',
                    name: 'album-detail',
                    component: albumDetail,
                },
                {
                    path:'artist-detail',
                    name: 'artist-detail',
                    component: artistDetail,
                }
            ]
        },
    ],
})

export default router

