export default {
    data() {
        return {
            modalFlag: false,
            cityList: [{
                    identify: 'province',
                    name: '',
                    showList: []
                },
                {
                    identify: 'city',
                    name: '',
                    showList: []
                },
                {
                    identify: 'district',
                    name: '',
                    showList: []
                },
                {
                    identify: 'town',
                    name: '',
                    showList: []
                }
            ],
            valueObj: {
                province: {
                    label: '',
                    value: ''
                },
                city: {
                    label: '',
                    value: ''
                },
                district: {
                    label: '',
                    value: ''
                },
                town: {
                    label: '',
                    value: ''
                },
            },
            busy: false,
            showRank: 0,
            showName: 'ext_name'//要展示接口返回字段的名字
        }
    },
    props: {
        level: {
            type: [String, Number],
            default: 2
        },
        value: {
            type: Boolean,
            default: false
        },
        defaultValue: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    computed: {
        curList_() {
            return this.cityList[this.showRank].showList
        },
        identifys_() {
            return this.cityList.map(o => o.identify);
        },
        checked_(){
            return (id) => {
                return this.valueObj[this.cityList[this.showRank].identify].value == id;
            }
        }
    },
    watch: {
        defaultValue: {
            handler(val) {
                let len = val.length;
                if(len <= 0){
                    this.initData();
                }else{
                    this.showRank = len >= this.level ? this.level : len;
                    val.forEach((o, i) => {
                        this.cityList[i].name = o.label;
                        this.valueObj[this.identifys_[i]] = o;
                    })
                }
            },
            immediate: true
        },
        value: {
            handler(val) {
                this.modalFlag = val;
                if (val) {
                    this.curReq();
                }
            },
            immediate: true
        },
        modalFlag(val) {
            this.$emit('input', val);
        }
    },
    created() {
        this.initData();
    },
    methods: {
        initData() {
            this.showRank = 0;
            this.cityList = [{
                    identify: 'province',
                    name: '',
                    showList: []
                },
                {
                    identify: 'city',
                    name: '',
                    showList: []
                },
                {
                    identify: 'district',
                    name: '',
                    showList: []
                },
                {
                    identify: 'town',
                    name: '',
                    showList: []
                }
            ]
            this.valueObj = {
                province: {
                    label: '',
                    value: ''
                },
                city: {
                    label: '',
                    value: ''
                },
                district: {
                    label: '',
                    value: ''
                },
                town: {
                    label: '',
                    value: ''
                },
            }
        },
        onRankClick(key) {
            this.showRank = key;
            this.curReq();
        },
        curReq(submit = false){
            let showRank = this.showRank - 1;
            if(this.showRank === -1 || !Object.keys(this.curList_).length) {
                let curArea = this.valueObj[this.identifys_[showRank]] || {};
                this.onChooseClick(curArea.label, curArea.value, submit);
            }
        },
        resetValueObj() {
            this.identifys_.forEach((o, i) => {
                if(i > this.showRank){
                    this.$set(this.cityList[i], 'name', '');
                }
            })
        },
        async onChooseClick(name, id, submit = true) {
            if (id && submit) {
                let identify = this.identifys_[this.showRank];
                //选择不同后要重置后面的选中
                if(this.valueObj[identify].value != id){
                    this.resetValueObj();
                }
                this.valueObj[identify].label = name;
                this.valueObj[identify].value = id;
                this.cityList[this.showRank].name = name;
            }
            let res = await this.$http('getRegion', {
                id: id
            });
            let cityList = Object.keys(res.data).map(o => {
                return {
                    value: o,
                    label: res.data[o]
                }
            });
            if (id) {
                if(submit){
                    if (!Object.keys(cityList).length || this.level <= this.showRank) {
                        if (this.showRank === 2) {
                            this.valueObj.town = {
                                label: '',
                                value: ''
                            }
                        }
                        this.$emit('confirm', {
                            type: 'confirm',
                            detail: this.valueObj
                        })
                        this.modalFlag = false;
                    } else {
                        this.showRank++;
                        this.cityList[this.showRank].showList = cityList;
                    }
                }else{
                    this.cityList[this.showRank].showList = cityList;
                }
            } else {
                this.cityList[0].showList = cityList;
            }
        }
    }
}