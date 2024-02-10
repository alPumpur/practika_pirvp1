let eventBus = new Vue()

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
            cart: [],
            selectedVariant: 0,

        };
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        removeFromCart(){
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId);

        },
        updateProduct(variantImage) {
            this.image = variantImage;
        },

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
    },
    mounted() {
        eventBus.$on('review-submitted', function (productReview) {
            this.reviews.push(productReview);
        }.bind(this));
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

Vue.component('product-review', {
    template: `
      <div class="product-review-title">
        <div>

        </div>
        <ul>
          <li v-for="review in reviews" :key="review.id">
            <p>{{ review.name }}</p>
            <p>Rating: {{ review.rating }}</p>
            <p>{{ review.review }}</p>
          </li>
        </ul>

        <form class="review-form" @submit.prevent="onSubmit">
          <div v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
              <li v-for="error in errors">{{ error }}</li>
            </ul>
          </div>
          <p>
            <label for="name">Name:</label>
            <input id="name" v-model="name" placeholder="name">
          </p>

          <p>
            <label for="review">Review:</label>
            <textarea id="review" v-model="review"></textarea>
          </p>

          <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
              <option value="5">5</option>
              <option value="4">4</option>
              <option value="3">3</option>
              <option value="2">2</option>
              <option value="1">1</option>
            </select>
          </p>

          <p>Would you recommend this product?</p>
          <label>
            Yes
            <input type="radio" value="Yes" v-model="recommend"/>
          </label>
          <label>
            No
            <input type="radio" value="No" v-model="recommend"/>
          </label>

          <p>
            <input type="submit" value="Submit">
          </p>
        </form>
      </div>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            reviews: [],
            errors: []
        }
    },
    methods:{
        onSubmit() {
            this.errors = [];
            if(this.name && this.review && this.rating && this.recommend) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend,
                    id: this.reviews.length + 1 // Add unique id for each review
                };
                eventBus.$emit('review-submitted', productReview)
                this.name = null;
                this.review = null;
                this.rating = null;
                this.recommend = null;
            } else {
                if(!this.name) this.errors.push("Name required.");
                if(!this.review) this.errors.push("Review required.");
                if(!this.rating) this.errors.push("Rating required.");
                if(!this.recommend) this.errors.push("Recommendation required.");
            }
        }
    }
});


Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false
        }
    },

    template: `
      <div>
        <ul>
         <span class="tab"
               :class="{ activeTab: selectedTab === tab }"
               v-for="(tab, index) in tabs"
               @click="selectedTab = tab"
         >{{ tab }}</span>
        </ul>
        <div v-show="selectedTab === 'Reviews'">
          <p v-if="!reviews.length">There are no reviews yet.</p>
          <ul>
            <li v-for="review in reviews">
              <p>{{ review.name }}</p>
              <p>Rating: {{ review.rating }}</p>
              <p>{{ review.review }}</p>
            </li>
          </ul>
        </div>
        <div v-show="selectedTab === 'Make a Review'">
          <product-review></product-review>
        </div>
      </div>



    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    }

});


let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],
        reviews: [] // Initialize an empty array to hold reviews
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        removeFromCart(id){
            const index = this.cart.indexOf(id);
            if (index !== -1){
                this.cart.splice(index, 1);
            }
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview);
        });
    }
});
