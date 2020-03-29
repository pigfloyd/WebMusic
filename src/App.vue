<template>
      <router-view></router-view> 
</template>

<script>

export default {
  name: 'App',
  components: {
    
  },
  data: () => ({
  }),
  created(){
    document.body.removeChild(document.getElementById('Loading')) 
  }
};
</script>
