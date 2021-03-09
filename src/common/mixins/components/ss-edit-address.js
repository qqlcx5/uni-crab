export default {
    data() {
        return {
            deleteFlag: false,
            selectCityFlag: false,
            itemObj: {
                id: "",
                user_name: "",
                mobile: "",
                province_id: "",
                city_id: "",
                district_id: "",
                address: "",
                is_default: 0
            },
            showHippingAddress: false
        };
    },
    computed: {
        local_() {
            return this.itemObj.province ? `${this.itemObj.province} ${this.itemObj.city} ${this.itemObj.district}` : ''
        },
        defaultValue_() {
            if(this.itemObj.province){
                return [{
                    value: this.itemObj.province_id,
                    label: this.itemObj.province
                }, {
                    value: this.itemObj.city_id,
                    label: this.itemObj.city
                }, {
                    value: this.itemObj.district_id,
                    label: this.itemObj.district
                }]
            }else{
                return []
            }
        }
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        tempItem: {
             type: Object,
            default: () => {}
        }
    },
    watch: {
        value: {
            handler(val) {
                this.showHippingAddress = val;
            },
            immediate: true
        },
        tempItem(newVal){
            this.itemObj = newVal
        },
        showHippingAddress(newVal) {
            this.$emit("input", newVal);
        }
    },
    methods: {
        async confirmDelete() {
            await this.$http('userShippingAddressDel', {
                id: this.itemObj.id
            });
            this.$toast('删除成功', 1);
            this.showHippingAddress = false;
            this.$emit('change')
        },
        handlerDelete() {
           this.deleteFlag = true;
        },
        async handlerSave() {
            let isGoing = true;
            for(var key in this.$refs){
                let validateObj = this.$refs[key].validate(true);
                if(!validateObj.validate){
                    isGoing = false;
                    break;
                }
            }
            if(!isGoing) return ;
            let params = this.$deepClone(this.itemObj);
            delete params.province;
            delete params.city;
            delete params.district;
            let res = await this.$http('userShippingAddressSave', params);
            this.$toast(params.id ? '修改成功' : '新增成功', 1);
            this.showHippingAddress = false;
            params.id = res.data.id;
            this.itemObj = {
                id: "",
                user_name: "",
                mobile: "",
                province_id: "",
                city_id: "",
                district_id: "",
                address: "",
                is_default: 0
            };
            this.$emit('change', params)
        },
        sureLocal(e) {
            let { detail } = e;
            let local = {
                province: detail.province.label,
                province_id: detail.province.value,
                city: detail.city.label,
                city_id: detail.city.value,
                district: detail.district.label,
                district_id: detail.district.value
            }
            this.itemObj = Object.assign({}, this.itemObj, local);
        },
        handleDefault(e) {
            this.itemObj.is_default = e.detail.value ? 1 : 0;
        },
        handleSelectLocal(val) {
            this.selectCityFlag = true;
        }
    }
}