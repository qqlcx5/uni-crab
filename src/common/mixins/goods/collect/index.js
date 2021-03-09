import { mapActions } from 'vuex'
import listMixins from '@/common/mixins/list'
export default {
    mixins: [listMixins],
    data() {
        return {
            list: [
                {
                    name: 'apple',
                    checked: false,
                    disabled: false
                },
                {
                    name: 'banner',
                    checked: false,
                    disabled: false
                },
                {
                    name: 'orange',
                    checked: false,
                    disabled: false
                }
            ],
            options: [{
                text: '取消收藏',
                style: {
                    backgroundColor: '#FA3F1E',
                    padding: '0 36rpx',
                    width: '120px',
                    fontSize: '24rpx'
                }
            }],
            reqName: 'favoritesDataList',
            editFlag: false,
            defaultParams: {
                relate_type: 1
            }
        }
    },
    computed: {
        selectedAll_() {
            return this.pageList.filter(o => o.checked).length === this.pageList.filter(o => !o.disabled).length;
        }
    },
    methods: {
        ...mapActions('common', ['favoritesCancel']),
        handleCheckbox(e, isAll){
            let pageList = [].concat(this.pageList);
            let val = e.detail.value;
            if(isAll){
                let checked = val[0] === 'all';
                pageList.forEach((o, index) => {
                    !o.disabled && (o.checked = checked);
                });
            } else {
                pageList.forEach((o, index) => {
                    o.checked = val.findIndex(o => o == index) !== -1;
                })
            }
            this.pageList = pageList;
        },
        //取消收藏
        async handleCollect(e = false) {
            let id = id = e ? this.pageList[e.detail.value].id : this.pageList.filter(o => o.checked).map(o => o.id).join(',');
            if(!id) return this.$toast('至少选中一个');
            let res = await this.favoritesCancel({
                id: id
            }, {
                loading: e ? false : ' '
            })
            this.initPage();
        },
        handleEdit(e) {
            this.editFlag = e.detail.value;
        }
    }
}
