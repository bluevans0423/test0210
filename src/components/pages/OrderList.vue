<template>
  <div>
    <h5>訂單列表</h5>
    <div class="my-5 row justify-content-center">
      <form class="col-md">
        <table class="table">
          <thead>
            <th width="100px">購買時間</th>
            <th>Email</th>
            <th>購買項目</th>
            <th width="100px">應付金額</th>
            <th width="100px">是否付款</th>
          </thead>
          <tbody>
            <tr v-for="(item, i) in orderList" :key="i">
              <td class="align-middle"></td>
              <td class="align-middle text-left">{{ item.user.email }}</td>
              <td class="align-middle text-left">
                <span v-for="(e, i) in item.products" :key="i">
                  {{ e.product.title }}
                  <br />
                </span>
              </td>
              <td class="align-middle">{{ item.total }}</td>
              <td class="align-middle">
                <span :class="item.is_paid === true ? 'txt_green' : 'txt_gray'">
                {{ item.is_paid === true ? '已付款' : '未付款'}}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      orderList: [],
      is_paid: true,
    };
  },
  methods: {
    getOrderList(page) {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/orders?page=${page}`;
      vm.isLoading = true;
      this.$http.get(url).then(response => {
        vm.orderList = response.data.orders;
        console.log(response);
        vm.isLoading = false;
      });
    }
  },
  created() {
    this.getOrderList();
  }
};
</script>

<style lang="scss" scoped>
.txt_green {
  color: green;
  font-weight: bold;
}

.txt_gray {
  color: gray;
  font-weight: bold;
}
</style>