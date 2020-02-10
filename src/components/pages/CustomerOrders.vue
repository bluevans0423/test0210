<template>
  <div>
    <loading :active.sync="isLoading"></loading>

    <div class="row mt-4">
      <div class="col-md-3 mb-4" v-for="(item, i) in products" :key="i">
        <div class="card border-0 shadow-sm">
          <div
            style="height: 290px; background-size: 100% ; background-position: top"
            :style="{ backgroundImage: `url(${img(item)})`}"
          ></div>
          <div class="card-body">
            <span class="badge badge-secondary float-right ml-2">{{ item.category }}</span>
            <h5 class="card-title">
              <a href="#" class="text-dark">{{ item.title }}</a>
            </h5>
            <p class="card-text">{{ item.content }}</p>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h5" v-if="!item.price">$ {{ item.origin_price }}</div>
              <del class="h6" v-if="item.price">原價 {{ item.origin_price }}</del>
              <div class="h5" v-if="item.price">$ {{ item.price }}</div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm"
              @click="getProduct(item.id)"
            >
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
              查看更多
            </button>

            <button type="button" class="btn btn-outline-danger btn-sm ml-auto"
            @click="addtoCart(item.id)">
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="cartBox">
        <table class="table">
            <thead>
                <th></th>
                <th>品名</th>
                <th>數量</th>
                <th>單價</th>
            </thead>
            <tbody>
                <tr v-for="item in cart.carts" :key="item.id">
                <td class="align-middle">
                    <button type="button" class="btn btn-outline-danger btn-sm"
                    @click="removeCartItem(item.id)"
                    >
                    <i class="far fa-trash-alt"></i>
                    </button>
                </td>
                <td class="align-middle">
                    {{ item.product.title }}
                    <!-- <div class="text-success" v-if="item.coupon">
                    已套用優惠券
                    </div> -->
                </td>
                <td class="align-middle">{{ item.qty }}/{{ item.product.unit }}</td>
                <td class="align-middle text-right">{{ item.final_total }}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                  <td colspan="3" class="text-right">總計</td>
                  <td class="text-right">{{ cart.total }}</td>
                </tr>
                <tr v-if="cart.final_total !== cart.total">
                  <td colspan="3" class="text-right text-success">折扣價</td>
                  <td class="text-right text-success">{{ cart.final_total }}</td>
                </tr>
            </tfoot>
            </table>
            <div class="input-group mb-3 input-group-sm">
            <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="coupon_code">
            <div class="input-group-append">
                <button class="btn btn-outline-secondary" type="button" @click="addCouponCode">
                套用優惠碼
                </button>
            </div>
            </div>
    </div>

    <Modal v-model="isModalProduct" :title="modalProduct.title">
      <div>
        <div class="card border-0 shadow-sm">
          <div
            style="height: 480px; background-size: 100% ; background-position: top"
            :style="{ backgroundImage: `url(${img(modalProduct)})`}"
          ></div>
          <div class="card-body">
            <p class="card-text">{{ modalProduct.content }}</p>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h5" v-if="!modalProduct.price">$ {{ modalProduct.origin_price }}</div> 
              <del class="h6" v-if="modalProduct.price">原價 {{ modalProduct.origin_price }}</del>
              <div class="h5" v-if="modalProduct.price">特價 {{ modalProduct.price }}</div>
            </div>
          </div>

          <select name="" class="form-control" v-model="num">
          <option :value="num" v-for="num in 10" :key="num">
              選購{{ num }} {{ modalProduct.unit }}
              </option>
          </select>  

          <div class="d-flex mt-3 mb-3">
            <button type="button" class="btn btn-danger btn-sm ml-auto"
            @click="addtoCart(modalProduct.id, num)"
            >              
              加到購物車
            </button>
          </div>
        </div>
      </div>
       <div slot="footer"></div>
    </Modal>

    <div class="my-5 row justify-content-center">
      <form class="col-md-6" @submit.prevent="createOrder">
        <div class="form-group">
          <label for="useremail">Email</label>
          <input type="email" class="form-control" name="email" id="useremail"
            :class="{'is-invalid': errors.has('email')}"
            v-model="form.user.email" 
            v-validate="'required|email'"
            placeholder="請輸入 Email">
          <span class="text-danger" v-if="errors.has('email')">
            {{ errors.first('email') }}
          </span>
        </div>
      
        <div class="form-group">
          <label for="username">收件人姓名</label>
          <input type="text" class="form-control" name="name" id="username"
            :class="{'is-invalid': errors.has('name')}"
            v-model="form.user.name"
            v-validate="'required'"
            placeholder="輸入姓名">
          <span class="text-danger" v-if="errors.has('name')">請輸入姓名</span>
        </div>
      
        <div class="form-group">
          <label for="usertel">收件人電話</label>
          <input type="tel" class="form-control" name="tel" id="usertel" 
          :class="{'is-invalid': errors.has('tel')}"
          v-model="form.user.tel" 
          v-validate="'required'"
          placeholder="請輸入電話">
          <span class="text-danger" v-if="errors.has('tel')">請輸入電話</span>
        </div>
      
        <div class="form-group">
          <label for="useraddress">收件人地址</label>
          <input type="text" class="form-control" name="address" id="useraddress" 
          :class="{'is-invalid': errors.has('address')}"
          v-model="form.user.address"
          v-validate="'required'"
          placeholder="請輸入地址">
          <span class="text-danger" v-if="errors.has('address')">請輸入地址</span>
        </div>
      
        <div class="form-group">
          <label for="comment">留言</label>
          <textarea name="" id="comment" class="form-control" cols="30" rows="10" v-model="form.message"></textarea>
        </div>
        <div class="text-right">
          <button class="btn btn-danger">送出訂單</button>
        </div>
      </form>
    </div>

  </div>
</template>


<script>
export default {
  data() {
    return {
      num: 1,
      isModalProduct: false,
      modalProduct : {},
      cart:{
          'carts': [],
      },
      products: [],
    //product: {},
      status:{
          loadingItem: '',
      },
      isLoading: false,
      coupon_code: '',
      form: {
        user:{
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: ''
      },
    };
  },
  methods: {
    getProducts() {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/products`;
      vm.isLoading = true;
      this.$http.get(url).then(response => {
        // console.log(response.data);
        vm.products = response.data.products;
        vm.isLoading = false;
      });
    },
    getProduct(id) {
      const vm = this;
    //   const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/product/${id}`;
    //   this.$http.get(url).then(response => {
        //     console.log(response);
    //   });
      vm.status.loadingItem = id;
      this.isModalProduct = true;
      this.setProduct(id);
    },
    setProduct(id){
        const vm = this;
        const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/product/${id}`;
        this.$http.get(url).then(response => {
        // console.log(response);        
        // vm.product = response.data.product;
        vm.status.loadingItem = '';
        vm.modalProduct = response.data.product;        
      });
    },
    addtoCart(id, qty = 1){
        const vm = this;
        const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
        vm.status.loadingItem = id;
        const cart = {
            product_id: id,
            qty
        };
        this.$http.post(url, { data: cart }).then(response => {
            console.log(response);
            vm.status.loadingItem = '';  
            vm.getCart();
            vm.isModalProduct = false;             
            vm.num = 1;
      });
    },
    getCart(){
        const vm = this;
        const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
        vm.isLoading = true;
        this.$http.get(url).then(response => {
            console.log(response);
            vm.cart = response.data.data;            
            vm.isLoading = false;
        });
    },
    removeCartItem(id){
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart/${id}`;
      vm.isLoading = true;
      this.$http.delete(url).then(response => {
          console.log(response);
          vm.getCart();        
          vm.isLoading = false;
      });
    },
    addCouponCode(){
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/coupon`;
      const coupon = {
        code: vm.coupon_code
      }
      vm.isLoading = true;
      this.$http.post(url, {data: coupon}).then(response => {
          console.log(response);
          vm.getCart();        
          vm.isLoading = false;
      });
    },
    createOrder(){
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/order`;      
      const order = vm.form;
      // vm.isLoading = true;
      this.$validator.validate().then((result) => {
        if (result) {
          this.$http.post(url, {data: order}).then(response => {
            console.log('訂單已建立', response);
            if(response.data.success){
              vm.$router.push(`customer_checkout/${response.data.orderId}`);
            }

            // vm.getCart();        
            vm.isLoading = false;
          });
        }else{
          console.log('請輸入完整資料')
        }
      });

      
    },
    img(item) {
      if (item.image) {
        return item.image;
      } else {
        return item.imageUrl;
      }
      console.log(item);
    }
  },
  created() {
    this.getProducts();
    this.getCart();
  }
};
</script>

<style lang="scss" scoped>
    .ivu-modal-footer{ border: 0;}
    .cartBox{
        width: 60%;
        margin: 30px auto 0;
    }
</style>