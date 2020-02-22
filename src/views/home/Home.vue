<template>
  <div id="home">
    <nav-bar class="home-nav">
      <template v-slot:center>购物车</template>
    </nav-bar>
    <tab-control :titles="titles" class="tab-control" @tabClick="tabClick" ref="tabControl" v-show="isTabFixed" :class="{fixed:isTabFixed}"></tab-control>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll" :pull-up-load="true" @pullingUp="pullingUp">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control :titles="titles" class="tab-control" @tabClick="tabClick" ref="tabControl"></tab-control>
      <goods-list :goods="goods[type].list"></goods-list>
    </scroll>
    <back-top @click.native="backClick" v-show="isShow"></back-top>
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'
import FeatureView from './childComps/FeatureView'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'
import BackTop from 'components/content/backTop/BackTop'

import {getHomeMultidata,getHomeGoods} from 'network/home'
import{debounce} from 'common/utils'

export default {
  name:'Home',
  components:{
    NavBar,
    HomeSwiper,
    RecommendView,
    FeatureView,
    TabControl,
    GoodsList,
    Scroll,
    BackTop
  },
  data(){
    return{
      banners:[],
      recommends:[],
      titles:['流行','新款','精选'],
      goods:{
        'pop':{page:0,list:[]},
        'new':{page:0,list:[]},
        'sell':{page:0,list:[]},
      },
      type:'pop',
      isShow:false,
      tabOffsetTop:0,
      isTabFixed:false
    }
  },
  beforeDestroy(){
    this.$bus.$off()
  },
  mounted(){
    //1.监听item中图片加载完成
    const refresh = debounce(this.$refs.scroll.refresh,200)
    this.$bus.$on('itemImageLoad',()=>{
      refresh()
    })

    //2.给tabControl的距离赋值
    //所有组件都有一个属性$el:勇于获取组件中的元素
    // this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop
    // console.log(this.tabOffsetTop)

  },
  created(){
    //1.请求多个数据
    this.getHomeMultidata()

    //2.请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
  },
  methods:{
    /**
     * 网络数据请求
     */
    getHomeMultidata(){
      getHomeMultidata().then(res =>{
      this.banners = res.data.banner.list
      this.recommends = res.data.recommend.list
      })
    },

    getHomeGoods(type){
      const page = this.goods[type].page + 1
      getHomeGoods(type,page).then(res => {
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page += 1

        this.$refs.scroll.finishPullUp()
      })
    },

    /**
     * 选项卡切换改变数据
     */
    tabClick(index){
      switch (index) {
        case 0:
          this.type = 'pop'
          break
        case 1:
          this.type = 'new'
          break
        case 2:
          this.type = 'sell'
      }
    },

    /**
     * 点击返回顶部
     */
    backClick(){
      this.$refs.scroll.scrollTo(0,0,500)
    },

    /**
     * 1.返回图案的隐藏与显示
     */
    contentScroll(position){
      //1.返回图案的隐藏与显示
      this.isShow =  (- position.y > 1000)

      //2.tabControl的吸顶(position:fixed)
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },

    /**
     * 上拉刷新
     */
    pullingUp(){
      this.getHomeGoods(this.type)
    },

    /**
     * tabControl吸顶
     */
    swiperImageLoad(){
      this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop
    }
  }
}
</script>

<style scoped>
  #home{
    /* position: relative; */
    height: 100vh;
  }

  .home-nav{
    background-color: var(--color-tint);
    color:#fff;

    /* position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9; */
  }

  .tab-control{
    top: 44px;
    z-index: 9;
  }

  .content{
    position: absolute;
    top: 44px;
    right: 0;
    left: 0;
    bottom: 49px;
    overflow: hidden;
  }

  .fixed{
    position: fixed;
    left: 0;
    right: 0;
    top: 44px;
  }
</style>