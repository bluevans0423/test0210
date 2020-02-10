<template>
    <div class="wrapper">
        <loading :active.sync="isLoading"></loading>
        <div class="btnBox">
            <i-button type="primary" @click="openModal(true)">建立新的產品</i-button>
            <modal
                v-model="modal1" width="800"
                title="新增產品"
                @on-ok="ok"
                @on-cancel="cancel">                
                <div class="productCon">
                    <div class="imgBox">
                        <div class="itemBox">
                            <span class="txt_title">輸入圖片網址</span>
                            <Input v-model="tempProduct.imageUrl" placeholder="請輸入圖片連結" />  
                        </div>
                        <div class="itemBox">
                            <span class="txt_title">或上傳圖片
                                <i class="fas fa-spinner fa-spin" v-if="status.fileUploading"></i>
                            </span>
                            <!-- <Upload action="https://vue-course-api.hexschool.io/api/thisismycourse2/admin/upload"
                            @on-success="uploadFile"
                            :headers="{enctype:'multipart/form-data'}"
                            >
                                <Button icon="ios-cloud-upload-outline"                                
                                >點選上傳</Button>
                            </Upload> -->

                            <form action="/api/thisismycourse2/admin/upload" enctype="multipart/form-data" method="post">
                            <input type="file" name="file-to-upload" ref="files"
                            @change="uploadFile"
                            >
                            <!-- <input type="submit" value="Upload"> -->
                            </form> 


                        </div>
                        <div class="itemBox">
                            <div class="img">
                                <img img="https://www.malldj.com/productimages/product/500/pbb15080200148.jpg"
                                class="img-fluid"
                                :src="tempProduct.imageUrl"
                                >
                            </div>                            
                        </div>                        
                    </div>
                    <div class="txtBox">
                        <div class="itemBox">
                            <span class="txt_title">標題</span>
                            <Input v-model="tempProduct.title" placeholder="請輸入標題" />  
                        </div>
                        <div class="item">
                            <div class="itemBox w50">
                                <span class="txt_title">分類</span>
                                <Input v-model="tempProduct.category" placeholder="請輸入分類" />  
                            </div>
                            <div class="itemBox w50 mr0">
                                <span class="txt_title">單位</span>
                                <Input v-model="tempProduct.unit" placeholder="請輸入單位" />  
                            </div>
                        </div>
                        <div class="item">
                            <div class="itemBox w50">
                                <span class="txt_title">原價</span>
                                <Input v-model="tempProduct.origin_price" placeholder="請輸入原價" />  
                            </div>
                            <div class="itemBox w50 mr0">
                                <span class="txt_title">售價</span>
                                <Input v-model="tempProduct.price" placeholder="請輸入售價" />  
                            </div>
                        </div>
                        <Divider />
                        <div class="itemBox">
                            <span class="txt_title">產品描述</span>
                            <Input v-model="tempProduct.description" maxlength="50" show-word-limit type="textarea" placeholder="請輸入產品描述" />  
                        </div>

                        <div class="itemBox">
                            <span class="txt_title">說明內容</span>
                            <Input v-model="tempProduct.content" maxlength="50" show-word-limit type="textarea" placeholder="請輸入產品說明內容" />  
                        </div>

                        <div class="itemBox">
                            <Checkbox 
                            v-model="tempProduct.is_enabled"
                            :true-value="1"
                            :false-value="0"
                            id="is_enabled"
                            >是否啟用</Checkbox>
                        </div>

                    </div>
                </div>
            </modal>                   
        </div>
        <Table :columns="products" :data="data1"></Table>
        <div class="pageBox">
            <div>
                <Page :total="totalPages" @on-change="getProducts"/>
            </div>
        </div>
        
    </div>
</template>

<script>
export default {
    data(){
        return{
            modal1: false,
            data1:[],
            tempProduct:{},
            isLoading: false,
            pagination: {},
            status:{
                fileUploading: false,
            },
            products: [
                {
                    title: '分類',
                    key: 'category',
                    width: 80
                },
                {
                    title: '商品名',
                    key: 'title'
                },
                {
                    title: '原價',
                    key: 'origin_price',
                    width: 80,
                    align: 'center'
                },
                {
                    title: '售價',
                    key: 'price',
                    width: 80,
                    align: 'center',                    
                },
                {
                    title: '是否啟用',
                    key: 'is_enabled',
                    width: 100,
                    align: 'center',
                    render: (h, {row}) => {
                        const is_enabled = row.is_enabled
                        return is_enabled === 1 ? <div class="enabled_yes">已啟用</div> : <div class="enabled_no">未啟用</div>
                    }
                },
                {
                    title: '編輯',
                    key: '',
                    width: 200,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'default',
                                        // size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },                                    
                                    on: {
                                        click: () => {
                                            // this.show(params.index)
                                            this.openModal(false, params.row);
                                            console.log(params.index)
                                        }
                                    }
                                }, '編輯'),
                                h('Button', {
                                    props: {
                                        type: 'default',
                                        // size: 'small'
                                    },
                                    style: {
                                        // color: '#000'
                                    }, 
                                    on: {
                                        click: () => {
                                            // console.log(this.removeProduct)
                                            this.removeProduct(params.row);
                                        }
                                    }
                                }, '刪除')                                
                            ]);
                    }
                },

            ],
        }
    },
    methods:{    
        openModal(isNew, item){
            
            if(isNew){
                this.tempProduct = {};
                this.isNew = true;
            }else{
                this.tempProduct = Object.assign({}, item);
                this.isNew = false;
            }
            this.modal1 = true;
        },
        getProducts(page){
            const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/products?page=${page}`;
            const vm = this;            
            // console.log(process.env.VUE_APP_APIPATH, process.env.VUE_APP_CUSTOMPATH);
            vm.isLoading = true;
            this.$http.get(api).then((response) => {    
            // console.log(response.data);   
            vm.isLoading = false;
            vm.data1 =  response.data.products;
            vm.pagination = response.data.pagination;        
            })
        },
        ok () {
            this.updatedProduct();
            this.$Message.info('成功建立商品');
        },
        cancel () {
            this.$Message.info('我取消了');
        },
        updatedProduct(){
            let api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/product`;
            let httpMethod = 'post';
            const vm = this;
            if(!vm.isNew){
                api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/product/${vm.tempProduct.id}`;
                httpMethod = 'put';
            }
            console.log(process.env.VUE_APP_APIPATH, process.env.VUE_APP_CUSTOMPATH);
            this.$http[httpMethod](api, {data: {
                ...this.tempProduct,
                image: this.tempProduct.imageUrl,           
            } }).then((response) => {    
            console.log(response.data);   
            // vm.data1 =  response.data.products;
            vm.getProducts();
            })
        },
        removeProduct(item){
            let api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/product/${item.id}`;
            this.$http.delete(api).then((response) => {    
            const vm = this;
            vm.getProducts();
            })
        },
        uploadFile(){
            console.log(this);
            const uploadedFile = this.$refs.files.files[0];
            const vm = this;
            const formData = new FormData();
            formData.append('file-to-upload', uploadedFile);
            const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/upload`;
            vm.status.fileUploading = true;
            this.$http.post(url, formData, {
                headers:{
                    'Content-Type': 'multipart/form-data'
                }
            }).then((response) => {    
                console.log(response.data);
                vm.status.fileUploading = false;
                if(response.data.success){
                    // vm.tempProduct.imageUrl = response.data.imageUrl;
                    // console.log(vm.tempProduct.imageUrl);
                    vm.$set(vm.tempProduct, 'imageUrl', response.data.imageUrl)
                }else{
                    this.$bus.$emit('message:push', response.data.message, 'danger');
                }
            })
        }
    },
    computed: {
        totalPages(){
            let vm = this;
            let total = vm.products.length * vm.pagination.total_pages;
            return total;            
        }
    },
    created(){
        this.getProducts();
    }
}
</script>

<style lang="scss" scoped>
    .wrapper{ 
        padding: 40px 20px;

        .btnBox{
            margin: 0 0 20px;
            text-align: right;
        }
    }

    .productCon{
        display: flex;
        & .imgBox{
            width: 30%;
            margin-right: 20px;
        }
        & .txtBox{
            width: 70%;
        }
        & span.txt_title{
            display: block;
            font-weight: bold;
            padding: 0 0 5px 10px;
            letter-spacing: 1px;
        }
        & .itemBox{
           width: 100%;
           margin-bottom: 10px;
           & .img{ 
               margin-top: 20px;
                & img{
                    display: block;
                    width: 100%;
                }
            }
        }
        & .item{
            display: flex;
        }
        & .w50{
            width: calc(50% - 5px);
            margin-right: 10px;
        }
        & .mr0{
            margin-right: 0px;
        }
        
    }
    .pageBox{
        text-align: center;
        margin-top: 40px;
    }
    ::v-deep .enabled_yes{
        color: green;
    }
    ::v-deep .enabled_no{
        color: gray ;
    }
</style>