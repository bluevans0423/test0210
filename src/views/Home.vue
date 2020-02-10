<template>
  <div class="home">
    <a href="#" @click.prevent="signout">登出</a>
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  data(){
    return{

    }
  },
  created(){
  //   console.log(this.$route.meta.requiresAuth)
  //   if(!this.$route.meta.requiresAuth){
  //     this.$router.push('/login');
  //   }
  },
  methods: {
    signout(){
      const api = `${process.env.VUE_APP_APIPATH}/logout`;
      const vm = this;
      this.$http.post(api).then((response) => {    
      console.log(response.data); 
      if(response.data.success){
          vm.$router.push('/login');
      }
      })   
    }
  },

}
</script>
