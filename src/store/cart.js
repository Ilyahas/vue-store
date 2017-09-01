import shop from '@/api/shop'

const state = {
    added: [],
    lastCheckout: null
};

const actions = {
    checkout({commit, state}, products) {
        const savedCartItems = [...state.added];
        commit('checkout_request');
        shop.buyProducts(products,
            () => commit('checkout_successful'),
            () => commit('checkout_failure', savedCartItems));
    }
};

const mutations = {
    addToCart (state, pruductId) {
        state.lastCheckout = null;
        const record = state.added.find(p => p.id === pruductId);
        if(!record) {
            state.added.push({
                id: pruductId,
                quantity: 1
            })
        } else {
            record.quantity++;
        }
    },
    checkoutRequest(state) {
        state.added = [];
        state.lastCheckout = null;
    },
    checkoutSuccessfull(state) {
        state.lastCheckout = 'successfull';
    },
    checkoutFailure(state, savedCardItems) {
        state.added = savedCardItems;
        state.lastCheckout = 'failed';
    }
};

const getters = {
    cartProducts (state, rootState) {
        return state.added.map(({ id, quantity }) => {
            const prod = rootState.products.add.find(p => p.id === id);
            return {
                title: prod.title,
                price: prod.price,
                id,
                quantity
            }
        })
    },
    cartCount(state) {
        let totalCount = 0;
        state.added.forEach(({ quantity }) => {
            totalCount += quantity
        })
    }
};

export default {
    state,
    actions,
    mutations,
    getters
}