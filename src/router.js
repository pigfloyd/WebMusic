import Vue from 'vue'
import Router from 'vue-router'
import music from './views/music.vue'
import songDetail from './views/music-child/song-detail.vue'
import myCollection from './views/music-child/my-collection.vue'
import search from './views/music-child/search.vue'
import myPlayList from './views/music-child/my-playlist.vue'
import playListDetail from './views/music-child/playlist-child/playlist-detail.vue'

Vue.use(Router)

var router = new Router({
    routes:[
        { 
            path:'/',
            redirect:'/music/my-collection'
        },
        {
            path:'/music',
            component:music,
            meta: {
                keepAlive: false, //此组件不需要被缓存
            },
            children:[
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
                        keepAlive: false, //此组件不需要被缓存
                    }
                },
                {
                    path:'my-playlist',
                    component:myPlayList,
               
                    children:[
                        {
                            path: 'playlist-detail',
                            name: 'playlist-detail',
                            component:playListDetail,
                            meta: {
                                keepAlive: false,
                            }
                        }
                    ]
                }
            ]
        },

    ],
    
})

export default router

