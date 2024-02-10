Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        },
    },
    template: `
      <div class="product">
        <div class="product-image">
          <img :src="image" :alt="altText" />
        </div>

        <div class="product-info">
          <h1>{{ title }}</h1>
          <p>{{ sale }}</p>
          <a :href="link">More products like this</a>
          <p v-if="inventory > 10">In stock</p>
          <p v-else-if="inventory <= 10 && inventory > 0">Almost sold out!</p>
          <p v-else :class="{ 'out-of-stock': !inStock }">Out of stock</p>
          <span v-if="onSale">On Sale</span>
          <product-details :details="details"></product-details>
          <p>Shipping: {{ shipping }}</p>
          <div class="color-box" v-for="variant in variants" :key="variant.variantId" :style="{ backgroundColor:variant.variantColor }"
               @mouseover="updateProduct(variant.variantImage)">
          </div>
          <p>Sizes:</p>
          <ul>
            <li v-for="size in sizes">{{ size }}</li>
          </ul>
          <div class="cart">
            <p>Cart({{ cart }})</p>
          </div>
          <button v-on:click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to cart</button>
          <button v-on:click="removeFromCart">Remove from cart</button>
        </div>
      </div>
    `,
    data() {
        return {
            product: "Socks",
            description: "A pair of warm, fuzzy socks",
            brand: 'Vue Mastery',
            image: "./assets/vmSocks-green-onWhite.jpg",
            altText: "A pair of socks",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            inStock: true,
            inventory: 100,
            onSale: false,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            cart: 0,

        };
    },
    methods: {
        addToCart() {
            this.cart += 1;
        },
        removeFromCart() {
            if (this.cart > 0) {
                this.cart -= 1;
            }
        },
        updateProduct(variantImage) {
            this.image = variantImage;
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        sale() {
            if (this.onSale) {
                return this.title + ' is on sale!';
            } else {
                return this.title + ' is not on sale.';
            }
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        }
    }
});

Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
      <div class="product-details">
        <ul>
          <li v-for="detail in details">{{ detail }}</li>
        </ul>
      </div>
    `
});

let app = new Vue({
    el: '#app',
    data: {
        premium: true
    }
});
