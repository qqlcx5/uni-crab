export default {
    data() {
        return {
            company_name: '',
            number: '',
            state_text: '',
            timeAxisArr: [],
            finish: false
        }
    },
    onLoad() {
        this.getLogistInfo();
    },
    methods: {
        async getLogistInfo() {
            let { data } = await this.$http('getLogistInfo', {
                express_number: this.$Route.query.detailId,
                is_all: 1,
                source_id: this.$Route.query.deliveryId,
                source_type: 1
            });
            this.finish = true
            if(!data) return
            this.timeAxisArr = data.data; 
            this.company_name = data.express.company_name;
            this.number = data.number;
            this.state_text = data.state_text;
        },
        copyNum(e){
            this.$c.copyText({content: e})
        },
    }
}