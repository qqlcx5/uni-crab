export default {
    data() {
        return {
            id: '', // 退款申请的id
            return_brief: '',
            back_invoice_no: '',    // 物流单号
            expressFlag: false,
            companyList: [],    // 所有物流公司
            return_proof: [],   // 凭证图片（数组）
            back_mobile: '',    // 联系电话
            back_shipping_name: '请选择',   // 快递公司
            back_company_code: '',    // 快递公司编码
        }
    },
    onLoad() {
        this.id = this.$Route.query.detailId;
        this.expressList();
    },
    methods: {
        async expressList() {
            let res = await this.$http('expressList');
            this.companyList = res.data;
        },
        handleConfirm(e, name) {
            this.back_company_code = e.detail.value;
            let company = this.companyList.find(item => item.id === this.back_company_code)
            this.back_shipping_name = company.company_name;
        },
        expressCompany() {
            this.expressFlag = true;
        },
        async handleSubmit() {
			let validate = this.$refs.telRef.validate();
			if(!validateObj.validate) return ;
            let res = await this.$http('orderDeliver', {
                id: this.id,
                back_invoice_no: this.back_invoice_no,
                back_shipping_name: this.back_shipping_name,
                back_mobile: this.back_mobile,
                return_proof: this.return_proof,
                return_brief: this.return_brief,
                back_company_code: this.back_company_code,
            })
            this.$jumpDetail('refuseDetails', this.id)
        },
        scan() {
            uni.scanCode({
                success: res => {
                    this.back_invoice_no = res.result;
                }
            });
        },
        handleChange(e) {
            this.return_proof = e.detail.map(o => o.src);
        },
    }
}
