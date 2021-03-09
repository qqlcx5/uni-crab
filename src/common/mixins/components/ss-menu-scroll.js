export default {
    data() {
        return {
            menuIndex: -1
        }
    },
    props: {
        list: {
            type: Array,
            default: () => {
                return []
            }
        },
        color: {
            type: String,
            default: '#666'
        },
        selColor: {
            type: String,
            default: 't'
        },
        border: {
            type: [String, Boolean],
            default: true
        },
        value: {
            type: Number,
            default: -1
        },
        scrollX: {
            type: [String, Boolean],
            default: true
        },
        //仅在scrollX为true时生效
        height: {
            type: [ String, Number ],
            default: 88
        },
        label: {
            type: String,
            default: 'label'
        },
        mode: {
            type: String,
            default: 'normal'
        }
    },
    watch: {
        value: {
            handler(val) {
                if(val !== this.menuIndex){
                    this.changeType(val);
                }
            },
            immediate: true
        }
    },
    computed: {
        scrollX_() {
            return String(this.scrollX) === 'false' ? false : true;
        },
        listStyle_() {
            let listStyle = {};
            this.scrollX_ ? (listStyle.height = this.$c.addUnit(this.height)) : '';
            return listStyle;
        },
        border_() {
            return String(this.border) === 'false' ? false : true;
        },
        currentView_() {
            let typeIndex = this.menuIndex - 2;
            typeIndex = typeIndex < 0 ? 0 : typeIndex;
            return 'type' + typeIndex;
        }
    },
    methods: {
        changeType(index, e = {}) {
            if (this.menuIndex === index) return;
            this.menuIndex = index;
            this.$emit('input', index);
            this.$emit('change', {
                type: e.type || 'click',
                detail: {
                    value: index
                }
            });
        }
    }
}