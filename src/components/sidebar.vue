<template>
  <div>
    <nav class="col-md-2 d-none d-md-block bg-light sidebar">
      <div class="sidebar-sticky">       

        <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
          <span>管理員</span>
          <a class="d-flex align-items-center text-muted" href="#" aria-label="Add a new report">
            <span data-feather="plus-circle"></span>
          </a>
        </h6>
        <ul class="nav flex-column mb-2">
          <li class="nav-item">
            <router-link class="nav-link" to="/admin/products">            
            <i class="fas fa-box-open"></i>
              產品列表
            </router-link>
          </li>          
          <li class="nav-item">
            <router-link class="nav-link" to="/admin/order-list">            
            <i class="far fa-list-alt"></i>
              訂單列表
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/admin/products">            
            <i class="fas fa-money-bill-alt"></i>
              優惠券
            </router-link>
          </li>
        </ul>

        <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
          <span>模擬功能</span>
          <a class="d-flex align-items-center text-muted" href="#" aria-label="Add a new report">
            <span data-feather="plus-circle"></span>
          </a>
        </h6>
        <ul class="nav flex-column mb-2">
          <li class="nav-item">
            <router-link class="nav-link" to="/customer_orders">            
            <i class="fas fa-shopping-cart"></i>
              模擬訂單
            </router-link>
          </li>          
        </ul>
      </div>
    </nav>    
  </div>
</template>

<style lang="scss">
  .sidebar-sticky{
    letter-spacing: 2px;
   a.nav-link{
     color: #222;
     transition: all 0.4s ease;
     &:hover{
       color: #2d8cf0;
     }
   }
  }
</style>