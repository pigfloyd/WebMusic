import Vue from 'vue'
import Router from 'vue-router'
import test from './views/test.vue'
import music from './views/music.vue'
import songDetail from './views/music-child/song-detail.vue'
import myCollection from './views/music-child/my-collection.vue'
import search from './views/music-child/search.vue'

Vue.use(Router)

var router = new Router({
    routes:[
        { 
            path:'/',
            redirect:'/music/my-collection'
        },
        {
            path:'/test',
            component:test  
        },
        {
            path:'/music',
            component:music,
            children:[
                {
                    path:'song-detail',
                    component:songDetail
                },
                {
                    path:'my-collection',
                    component:myCollection
                },
                {
                    path:'search',
                    name:"search",
                    component:search
                }
            ]
        },

    ],
    
})

export default router

