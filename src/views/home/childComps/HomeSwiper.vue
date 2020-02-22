<template>
  <swiper v-if="banners.length">
      <swiper-item v-for="item in banners" :key="item.index">
        <a :href="item.link">
          <img :src="item.image" alt="" @load="iamgeLoad">
        </a>
      </swiper-item>
    </swiper>
</template>

<script>
import {Swiper,SwiperItem} from 'components/common/swiper'

export default {
  name:'HomeSwiper',
  components:{
    Swiper,
    SwiperItem
  },
  data(){
    return{
      isLoad:false
    }
  },
  props:{
    banners:{
      type:Array,
      default(){
        return []
      }
    }
  },
  methods:{
    iamgeLoad(){
      if(!this.isLoad){
        this.$emit('swiperImageLoad')
        this.isLoad = true
      }
    }
  }
}
</script>

<style scoped>

</style>