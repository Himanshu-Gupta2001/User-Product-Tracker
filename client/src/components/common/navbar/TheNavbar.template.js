export default `
<nav class="navbar navbar-expand bg-primary" data-bs-theme="dark">
    <div class="container-fluid">
        <router-link class="navbar-brand" to="/">Navbar</router-link>
        <div class="navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <router-link aria-current="page" class='nav-link'
                        :class="$route.path.slice(1)==='dashboard' ? 'active' : ''" to="/dashboard">
                        <i class="icon-dashboard"></i>
                        Dashboard
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link class='nav-link' :class="$route.path.slice(1)==='about' ? 'active' : ''"
                        to="/about">About</router-link>
                </li>
                <li class="nav-item">
                    <router-link class='nav-link' :class="$route.path.slice(1)==='contact' ? 'active' : ''"
                        to="/contact">Contact</router-link>
                </li>
                <li class="nav-item">
                    <router-link class='nav-link' :class="$route.path.slice(1)==='products' ? 'active' : ''"
                        to="/products">Products</router-link>
                </li>
                <li class="nav-item">
                    <router-link class='nav-link' to="/logout">Logout</router-link>
                </li>
            </ul>
        </div>
    </div>
</nav>
`;