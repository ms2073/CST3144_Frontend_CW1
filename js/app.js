// Main Vue.js Application
const { createApp } = Vue;

// API Backend root
const API_ROOT = 'https://cst3144-backend-cw1.onrender.com';

// Lesson Card Component
Vue.component('lesson-card', {
    props: ['lesson'],
    template: `
        <div class="lesson-card">
            <div class="lesson-row d-flex align-items-start justify-content-between">
                <div class="lesson-info">
                    <p class="mb-1"><strong>Subject:</strong> {{ lesson.subject }}</p>
                    <p class="mb-1"><strong>Location:</strong> {{ lesson.location }}</p>
                    <p class="mb-1"><strong>Price:</strong> £{{ lesson.price }}</p>
                    <p class="mb-0"><strong>Spaces:</strong> {{ lesson.spaces }}</p>
                </div>
                <div class="lesson-image">
                    <img :src="getSubjectImage(lesson.subject)" :alt="lesson.subject" class="subject-image" @error="onImageError">
                </div>
            </div>
            <div class="text-center mt-3">
                <button 
                    class="btn btn-primary lesson-btn-inline" 
                    @click="$emit('add-to-cart', lesson)"
                    :disabled="lesson.spaces === 0"
                >
                    Add to cart
                </button>
            </div>
        </div>
    `,
    methods: {
        getSubjectImage(subject) {
            // Always use backend API for images
            const svgMap = {
                'Art': `${API_ROOT}/images/Art.svg`,
                'English': `${API_ROOT}/images/English.svg`,
                'History': `${API_ROOT}/images/History.svg`,
                'Math': `${API_ROOT}/images/Math.svg`,
                'Music': `${API_ROOT}/images/Music.svg`,
                'Science': `${API_ROOT}/images/Science.svg`
            };
            const pngMap = {
                'Art': `${API_ROOT}/images/Art.png`,
                'English': `${API_ROOT}/images/English.png`,
                'Math': `${API_ROOT}/images/Math.png`,
                'Music': `${API_ROOT}/images/Music.png`,
                'Science': `${API_ROOT}/images/Science.png`,
                'History': `${API_ROOT}/images/History.png`
            };
            return svgMap[subject] || pngMap[subject] || `${API_ROOT}/images/Art.svg`;
        },
        onImageError(event) {
            event.target.onerror = null;
            event.target.src = `${API_ROOT}/images/Art.svg`;
        }
    }
});

// Checkout Form Component
Vue.component('checkout-form', {
    props: ['cart'],
    data() {
        return {
            name: '',
            phone: '',
            nameValid: false,
            phoneValid: false,
            isSubmitting: false
        };
    },
    computed: {
        totalPrice() {
            return this.cart.reduce((total, item) => total + item.price, 0);
        }
    },
    template: `
        <div class="checkout-container">
            <!-- Order Summary -->
            <div class="card mb-4">
                <div class="card-header">
                    <h5 class="mb-0">
                        <i class="fas fa-receipt me-2"></i>
                        Order Summary
                    </h5>
                </div>
                <div class="card-body">
                    <div class="order-items">
                        <div v-for="item in cart" :key="item.id" class="order-item mb-2">
                            <div class="d-flex justify-content-between">
                                <span>{{ item.subject }} - {{ item.location }}</span>
                                <span class="fw-bold">£{{ item.price }}</span>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="d-flex justify-content-between">
                        <span class="fw-bold fs-5">Total:</span>
                        <span class="fw-bold fs-5 text-primary">£{{ totalPrice }}</span>
                    </div>
                </div>
            </div>

            <!-- Checkout Form -->
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">
                        <i class="fas fa-user me-2"></i>
                        Checkout Information
                    </h5>
                </div>
                <div class="card-body">
                    <form @submit.prevent="handleCheckout">
                        <div class="mb-3">
                            <label for="name" class="form-label">Full Name</label>
                            <input 
                                type="text" 
                                class="form-control" 
                                id="name"
                                v-model="name"
                                @input="validateName"
                                :class="{ 'is-valid': nameValid && name, 'is-invalid': name && !nameValid }"
                                placeholder="Enter your full name"
                            >
                            <div v-if="name && !nameValid" class="invalid-feedback">
                                Name must contain only letters and spaces
                            </div>
                        </div>
                        <div class="mb-4">
                            <label for="phone" class="form-label">Phone Number</label>
                            <input 
                                type="tel" 
                                class="form-control" 
                                id="phone"
                                v-model="phone"
                                @input="validatePhone"
                                :class="{ 'is-valid': phoneValid && phone, 'is-invalid': phone && !phoneValid }"
                                placeholder="Enter your phone number"
                            >
                            <div v-if="phone && !phoneValid" class="invalid-feedback">
                                Phone must contain only numbers
                            </div>
                        </div>
                        <button 
                            type="submit" 
                            class="btn btn-success w-100 btn-lg"
                            :disabled="!nameValid || !phoneValid || isSubmitting"
                        >
                            <i class="fas fa-credit-card me-2"></i>
                            {{ isSubmitting ? 'Processing...' : 'Complete Order' }}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `,
    methods: {
        validateName() {
            // Name validation: letters and spaces only
            this.nameValid = /^[a-zA-Z\s]+$/.test(this.name) && this.name.trim().length > 0;
        },
        validatePhone() {
            // Phone validation: numbers only
            this.phoneValid = /^[0-9]+$/.test(this.phone) && this.phone.length > 0;
        },
        async handleCheckout() {
            if (this.nameValid && this.phoneValid) {
                this.isSubmitting = true;
                try {
                    const orderData = {
                        name: this.name,
                        phone: this.phone,
                        lessons: this.cart,
                        total: this.totalPrice
                    };
                    this.$emit('checkout', orderData);
                } finally {
                    this.isSubmitting = false;
                }
            }
        }
    }
});

// Main Vue App
new Vue({
    el: '#app',
    data: {
        lessons: [],
        cart: [],
        showCart: false,
        searchQuery: '',
        sortBy: 'subject',
        sortOrder: 'asc',
        searchTimeout: null
    },
    computed: {
        filteredLessons() {
            let filtered = [...this.lessons];

            // Apply sorting only (search is handled by backend)
            filtered.sort((a, b) => {
                let aVal = a[this.sortBy];
                let bVal = b[this.sortBy];

                // Handle numeric values
                if (this.sortBy === 'price' || this.sortBy === 'spaces') {
                    aVal = Number(aVal);
                    bVal = Number(bVal);
                }

                if (this.sortOrder === 'asc') {
                    return aVal > bVal ? 1 : -1;
                } else {
                    return aVal < bVal ? 1 : -1;
                }
            });

            return filtered;
        }
    },
    mounted() {
        this.loadLessons();
    },
    methods: {
        // Load lessons from API
        async loadLessons() {
            try {
                const response = await fetch(`${API_ROOT}/lessons`);
                if (!response.ok) {
                    throw new Error('Failed to load lessons');
                }
                this.lessons = await response.json();
            } catch (error) {
                console.error('Error loading lessons:', error);
                // Fallback data for demo purposes
                this.lessons = [
                    {
                        id: 1,
                        subject: 'Art',
                        location: 'Manchester',
                        price: 75,
                        spaces: 2
                    },
                    {
                        id: 2,
                        subject: 'Art',
                        location: 'Bristol',
                        price: 80,
                        spaces: 5
                    },
                    {
                        id: 3,
                        subject: 'English',
                        location: 'London',
                        price: 90,
                        spaces: 5
                    },
                    {
                        id: 4,
                        subject: 'English',
                        location: 'York',
                        price: 85,
                        spaces: 5
                    },
                    {
                        id: 5,
                        subject: 'English',
                        location: 'Bristol',
                        price: 95,
                        spaces: 5
                    },
                    {
                        id: 6,
                        subject: 'Math',
                        location: 'London',
                        price: 100,
                        spaces: 4
                    },
                    {
                        id: 7,
                        subject: 'Math',
                        location: 'Oxford',
                        price: 100,
                        spaces: 5
                    },
                    {
                        id: 8,
                        subject: 'Math',
                        location: 'York',
                        price: 80,
                        spaces: 4
                    },
                    {
                        id: 9,
                        subject: 'Music',
                        location: 'Bristol',
                        price: 90,
                        spaces: 5
                    },
                    {
                        id: 10,
                        subject: 'Music',
                        location: 'Manchester',
                        price: 85,
                        spaces: 5
                    },
                    {
                        id: 11,
                        subject: 'Science',
                        location: 'London',
                        price: 110,
                        spaces: 5
                    },
                    {
                        id: 12,
                        subject: 'Science',
                        location: 'Oxford',
                        price: 120,
                        spaces: 5
                    }
                ];
            }
        },

        // Debounced server-side search hitting /search (alias of /lessons/search)
        searchLessons() {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(async () => {
                const q = this.searchQuery.trim();
                if (!q) {
                    this.loadLessons();
                    return;
                }
                try {
                    const res = await fetch(`${API_ROOT}/search?q=${encodeURIComponent(q)}`);
                    if (!res.ok) return;
                    const results = await res.json();
                    this.lessons = results;
                } catch (e) {
                    console.error('Search error', e);
                }
            }, 300);
        },
        
        // Add lesson to cart
        addToCart(lesson) {
            if (lesson.spaces > 0) {
                // Check if lesson is already in cart
                const existingItem = this.cart.find(item => item.id === lesson.id);
                if (existingItem) {
                    // If already in cart, don't add again (as per requirements)
                    alert('This lesson is already in your cart!');
                    return;
                }
                
                // Add to cart and decrement spaces
                this.cart.push({ ...lesson });
                lesson.spaces--;
                
                // Show success message
                alert(`${lesson.subject} - ${lesson.location} added to cart!`);
            }
        },
        
        // Remove lesson from cart
        removeFromCart(item) {
            // Find the original lesson and increment spaces
            const originalLesson = this.lessons.find(lesson => lesson.id === item.id);
            if (originalLesson) {
                originalLesson.spaces++;
            }
            
            // Remove from cart
            const index = this.cart.findIndex(cartItem => cartItem.id === item.id);
            if (index > -1) {
                this.cart.splice(index, 1);
            }
        },
        
        // Toggle cart view
        toggleCart() {
            this.showCart = !this.showCart;
        },
        
        // Process checkout
        async processCheckout(orderData) {
            try {
                // Step 1: POST order to backend
                const response = await fetch(`${API_ROOT}/orders`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData)
                });

                if (response.ok) {
                    // Step 2: UPDATE each lesson's spaces with PUT (required by grading criteria)
                    for (const lesson of this.cart) {
                        const originalLesson = this.lessons.find(l => l.id === lesson.id);
                        if (originalLesson) {
                            await fetch(`${API_ROOT}/lessons/${lesson.id}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    spaces: originalLesson.spaces
                                })
                            });
                        }
                    }

                    // Show success message
                    alert(`Order placed successfully!\n\nOrder Details:\nName: ${orderData.name}\nPhone: ${orderData.phone}\nTotal: £${orderData.total}\nLessons: ${orderData.lessons.length}`);

                    // Clear cart and reset form
                    this.cart = [];
                    this.showCart = false;

                    // Reload lessons to get updated spaces from server
                    await this.loadLessons();
                } else {
                    throw new Error('Failed to place order');
                }
            } catch (error) {
                console.error('Error placing order:', error);
                alert('Failed to place order. Please try again.');
            }
        }
    }
});
